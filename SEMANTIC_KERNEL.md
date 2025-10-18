# Semantic Kernel for OS.js

This implementation adds AI and semantic analysis capabilities to OS.js through a service provider architecture.

## Features

- **Text Analysis**: Analyze text for length, word count, sentence count, sentiment, and keywords
- **Text Embeddings**: Generate vector embeddings for text (useful for semantic similarity)
- **Semantic Search**: Search through documents using semantic similarity

## Usage

### Client-side

Applications can access the Semantic Kernel service through the OS.js core:

```javascript
const semanticKernel = core.make('osjs/semantic-kernel');

// Analyze text
const analysis = await semanticKernel.analyzeText('This is a great example!');
console.log(analysis);
// Output: { length: 24, words: 5, sentences: 1, sentiment: 'positive', keywords: [...] }

// Get embeddings
const embedding = await semanticKernel.getEmbedding('Hello world');
console.log(embedding);
// Output: { embedding: [0.1, -0.3, ...], dimension: 128 }

// Semantic search
const documents = [
  'The cat sat on the mat',
  'Dogs are great pets',
  'Machine learning is fascinating'
];
const results = await semanticKernel.semanticSearch('feline animals', documents);
console.log(results);
// Output: { results: [{index: 0, document: '...', score: 0.85}, ...] }

// Check availability
const available = await semanticKernel.isAvailable();
console.log(available); // true
```

### Server-side

The server provides API endpoints:

- `POST /api/semantic-kernel/status` - Check service status
- `POST /api/semantic-kernel/analyze` - Analyze text
- `POST /api/semantic-kernel/embedding` - Generate embeddings
- `POST /api/semantic-kernel/search` - Perform semantic search

## Configuration

### Client configuration (`src/client/config.js`)

```javascript
semanticKernel: {
  enabled: true,
  features: {
    textAnalysis: true,
    embedding: true,
    semanticSearch: true
  }
}
```

### Server configuration (`src/server/config.js`)

```javascript
semanticKernel: {
  enabled: true,
  embeddingDimension: 128,
  features: {
    textAnalysis: true,
    embedding: true,
    semanticSearch: true
  }
}
```

## Implementation Details

### Text Analysis
- Counts words, sentences, and characters
- Performs basic sentiment analysis using keyword matching
- Extracts top keywords by frequency

### Embeddings
- Generates 128-dimensional vectors by default
- Uses a simple hash-based approach (can be replaced with ML models)
- Normalized vectors for consistent similarity calculations

### Semantic Search
- Uses cosine similarity to rank documents
- Returns documents sorted by relevance score
- Configurable embedding dimension

## Future Enhancements

This is a basic implementation that can be extended with:
- Integration with OpenAI, Hugging Face, or other AI services
- More sophisticated NLP models
- Caching for embeddings
- Batch processing
- Custom model training
- Multi-language support

## Architecture

The Semantic Kernel follows OS.js's service provider pattern:

```
src/client/semantic-kernel.js - Client service provider
src/server/semantic-kernel.js - Server service provider
```

Both providers are registered in their respective bootstrap files (`src/client/index.js` and `src/server/index.js`).
