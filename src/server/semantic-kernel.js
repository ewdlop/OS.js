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
 * Semantic Kernel Service Provider (Server)
 *
 * Provides backend AI and semantic analysis capabilities
 */
class SemanticKernelServiceProvider {
  constructor(core, options = {}) {
    this.core = core;
    this.options = options;
  }

  provides() {
    return ['osjs/semantic-kernel'];
  }

  init() {
    const app = this.core.app;

    // Status endpoint
    app.post('/api/semantic-kernel/status', (req, res) => {
      res.json({
        available: true,
        version: '1.0.0',
        features: ['analyze', 'embedding', 'search']
      });
    });

    // Text analysis endpoint
    app.post('/api/semantic-kernel/analyze', (req, res) => {
      const {text} = req.body;

      if (!text) {
        return res.status(400).json({error: 'Text is required'});
      }

      // Basic text analysis (can be extended with actual AI models)
      const analysis = {
        length: text.length,
        words: text.split(/\s+/).length,
        sentences: text.split(/[.!?]+/).filter(s => s.trim()).length,
        sentiment: this.analyzeSentiment(text),
        keywords: this.extractKeywords(text)
      };

      return res.json(analysis);
    });

    // Embedding endpoint
    app.post('/api/semantic-kernel/embedding', (req, res) => {
      const {text} = req.body;

      if (!text) {
        return res.status(400).json({error: 'Text is required'});
      }

      // Simple embedding simulation (in production, use actual embedding models)
      const embedding = this.generateSimpleEmbedding(text);
      return res.json({embedding, dimension: embedding.length});
    });

    // Semantic search endpoint
    app.post('/api/semantic-kernel/search', (req, res) => {
      const {query, documents} = req.body;

      if (!query || !documents) {
        return res.status(400).json({error: 'Query and documents are required'});
      }

      // Simple relevance scoring (can be enhanced with actual semantic search)
      const results = this.performSemanticSearch(query, documents);
      return res.json({results});
    });

    this.core.singleton('osjs/semantic-kernel', () => ({
      analyze: (text) => this.analyzeText(text),
      embed: (text) => this.generateSimpleEmbedding(text),
      search: (query, documents) => this.performSemanticSearch(query, documents)
    }));
  }

  /**
   * Analyze sentiment of text
   * @param {string} text - Text to analyze
   * @returns {string} Sentiment (positive, negative, neutral)
   */
  analyzeSentiment(text) {
    const positive = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'love', 'best'];
    const negative = ['bad', 'terrible', 'awful', 'worst', 'hate', 'poor'];

    const words = text.toLowerCase().split(/\s+/);
    let score = 0;

    words.forEach(word => {
      if (positive.includes(word)) {
        score++;
      }
      if (negative.includes(word)) {
        score--;
      }
    });

    if (score > 0) {
      return 'positive';
    }
    if (score < 0) {
      return 'negative';
    }
    return 'neutral';
  }

  /**
   * Extract keywords from text
   * @param {string} text - Text to process
   * @returns {Array<string>} Keywords
   */
  extractKeywords(text) {
    const stopWords = ['the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but'];
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.includes(word));

    const frequency = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    return Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);
  }

  /**
   * Generate simple embedding vector
   * @param {string} text - Text to embed
   * @returns {Array<number>} Embedding vector
   */
  generateSimpleEmbedding(text) {
    // Simple hash-based embedding for demonstration
    const dimension = 128;
    const embedding = new Array(dimension).fill(0);

    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const idx = (charCode * i) % dimension;
      embedding[idx] += Math.sin(charCode) * Math.cos(i);
    }

    // Normalize
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return magnitude > 0 ? embedding.map(val => val / magnitude) : embedding;
  }

  /**
   * Perform semantic search
   * @param {string} query - Search query
   * @param {Array} documents - Documents to search
   * @returns {Array} Ranked results
   */
  performSemanticSearch(query, documents) {
    const queryEmbedding = this.generateSimpleEmbedding(query);

    const results = documents.map((doc, index) => {
      const docText = typeof doc === 'string' ? doc : doc.text || '';
      const docEmbedding = this.generateSimpleEmbedding(docText);

      // Cosine similarity
      const similarity = this.cosineSimilarity(queryEmbedding, docEmbedding);

      return {
        index,
        document: doc,
        score: similarity
      };
    });

    return results.sort((a, b) => b.score - a.score);
  }

  /**
   * Calculate cosine similarity between two vectors
   * @param {Array<number>} a - First vector
   * @param {Array<number>} b - Second vector
   * @returns {number} Similarity score
   */
  cosineSimilarity(a, b) {
    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      magnitudeA += a[i] * a[i];
      magnitudeB += b[i] * b[i];
    }

    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    return magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0;
  }

  start() {
    // Service is ready
  }
}

module.exports = SemanticKernelServiceProvider;
