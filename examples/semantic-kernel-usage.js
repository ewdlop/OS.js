/*
 * OS.js - JavaScript Cloud/Web Desktop Platform
 *
 * Copyright (c) 2011-2020, Anders Evenrud <andersevenrud@gmail.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * @author  Anders Evenrud <andersevenrud@gmail.com>
 * @licence Simplified BSD License
 */

/**
 * Semantic Kernel Example Application
 *
 * This example demonstrates how to use the Semantic Kernel service in OS.js
 */

// Example usage in an OS.js application:

const exampleUsage = async (core) => {
  // Get the semantic kernel service
  const semanticKernel = core.make('osjs/semantic-kernel');

  // Check if service is available
  const available = await semanticKernel.isAvailable();
  console.log('Semantic Kernel available:', available);

  if (!available) {
    console.error('Semantic Kernel service is not available');
    return;
  }

  // Example 1: Text Analysis
  console.log('\\n=== Example 1: Text Analysis ===');
  const textToAnalyze = 'This is a wonderful example of semantic analysis! ' +
                        'It can detect sentiment and extract keywords. ' +
                        'Machine learning makes this possible.';

  const analysis = await semanticKernel.analyzeText(textToAnalyze);
  console.log('Analysis result:', JSON.stringify(analysis, null, 2));

  // Example 2: Text Embeddings
  console.log('\\n=== Example 2: Text Embeddings ===');
  const embedding = await semanticKernel.getEmbedding('Artificial Intelligence');
  console.log('Embedding dimension:', embedding.dimension);
  console.log('First 5 values:', embedding.embedding.slice(0, 5));

  // Example 3: Semantic Search
  console.log('\\n=== Example 3: Semantic Search ===');
  const documents = [
    'Cats are independent and graceful animals.',
    'Dogs are loyal and friendly companions.',
    'Python is a popular programming language.',
    'JavaScript runs in web browsers.',
    'Birds can fly and sing beautifully.',
    'Fish live in water and breathe through gills.'
  ];

  const searchQuery = 'programming languages';
  const searchResults = await semanticKernel.semanticSearch(searchQuery, documents);

  console.log(`Search query: "${searchQuery}"`);
  console.log('Top 3 results:');
  searchResults.results.slice(0, 3).forEach((result, index) => {
    console.log(`${index + 1}. [Score: ${result.score.toFixed(3)}] ${result.document}`);
  });

  // Example 4: Comparing different queries
  console.log('\\n=== Example 4: Comparing Queries ===');
  const queries = ['pets and animals', 'computer science', 'nature'];

  for (const query of queries) {
    const results = await semanticKernel.semanticSearch(query, documents);
    const topResult = results.results[0];
    console.log(`Query: "${query}" -> Best match: "${topResult.document}" (${topResult.score.toFixed(3)})`);
  }
};

// To use this in your OS.js application:
// 1. Import or include this code in your application
// 2. Call exampleUsage(core) where 'core' is your OS.js core instance
// 3. Check the browser console for output

export default exampleUsage;
