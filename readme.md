#  Scraping API for RAG

A powerful web scraping API built with TypeScript and Fastify that extracts clean, readable content from web pages using AI-powered content processing optimized for RAG system. 

## Features

- 🚀 **Fast & Scalable**: Built with Fastify for high performance
- 🤖 **AI-Powered Content Cleaning**: Uses OpenAI GPT-4 to clean and process scraped content
- 🕷️ **Advanced Web Scraping**: Puppeteer with clustering for parallel processing
- 📖 **Content Processing**: Converts HTML to clean markdown and text
- 🧹 **Smart Content Extraction**: Uses Mozilla Readability for article extraction
- 🛡️ **Popup & Ad Blocking**: Automatically handles popups, modals, and unwanted elements
- ⚡ **TypeScript**: Fully typed for better development experience
- 🔧 **Environment Configuration**: Secure environment variable management
- 📚 **RAG Optimization**: Perfect for Retrieval-Augmented Generation workflows

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Fastify
- **Web Scraping**: Puppeteer with Puppeteer Cluster
- **AI Processing**: OpenAI GPT-4 via LangChain
- **Content Processing**: 
  - Mozilla Readability for article extraction
  - TurnDown for HTML to Markdown conversion
  - JSDOM for DOM manipulation
- **Development**: ts-node-dev, nodemon for hot reloading

## Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd rag-scraping
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env` file in the root directory:
```env
PORT=3000
OPENAI_API_KEY=your_openai_api_key_here
```

## Usage

### Development
```bash
# Start development server with hot reload
npm run dev

# Or use nodemon
npm run dev:watch

# Alternative with ts-node-dev
npm run dev:ts-node
```

### Production
```bash
# Build the project
npm run build

# Start production server
npm start
```

## API Endpoints

### POST `/api/scraping`

Scrapes content from a given URL and returns clean text.

**Request Body:**
```json
{
  "url": "https://example.com/article"
}
```

**Response:**
```json
{
  "result": "Clean extracted text content from the webpage..."
}
```

**Error Responses:**
```json
{
  "status": "fail",
  "message": "Invalid URL. Please check the URL and try again.",
  "code": "INVALID_URL"
}
```

## Project Structure

```
src/
├── index.ts              # Application entry point
├── cluster.ts            # Puppeteer cluster management
├── envSchema.ts          # Environment variable validation
├── config/
│   └── llmConfig.ts      # OpenAI/LangChain configuration
├── controllers/
│   ├── index.ts          # Controller registry
│   └── scraping/
│       └── index.ts      # Scraping controller logic
├── middleware/
│   └── error/
│       ├── customError.ts     # Custom error class
│       └── errorMiddleware.ts # Global error handling
├── prompts/
│   └── scrapePrompts.ts  # AI prompts for content cleaning
├── routes/
│   ├── routes.ts         # Main route registry
│   └── scraping/
│       └── route.ts      # Scraping API routes
├── services/
│   ├── index.ts          # Service registry
│   └── scraping/
│       └── index.ts      # Core scraping logic
├── types/
│   └── fastify.d.ts      # Fastify type extensions
└── utils/
    └── commonUtils.ts    # Utility functions
```

## How It Works

1. **URL Validation**: Validates and checks if the provided URL exists and is accessible
2. **Puppeteer Scraping**: Uses Puppeteer cluster to scrape the webpage content
3. **Popup Handling**: Automatically removes popups, modals, cookie banners, and overlays
4. **Content Cleaning**: Removes unwanted elements like navigation, footers, and advertisements
5. **Content Extraction**: Uses Mozilla Readability to extract the main article content
6. **HTML to Markdown**: Converts HTML content to clean markdown format
7. **AI Processing**: Uses OpenAI GPT-4 to further clean and optimize the markdown content
8. **Text Conversion**: Converts the final markdown to plain text

## RAG Optimization Features

This API is specifically designed to optimize content for Retrieval-Augmented Generation (RAG) systems:

### Content Quality for RAG
- **Clean Text Extraction**: Removes HTML artifacts, navigation, and noise that can degrade RAG performance
- **Structured Content**: Preserves headings, lists, and important formatting for better chunking
- **Link Preservation**: Maintains source links for citation and verification in RAG responses
- **Table Data Retention**: Keeps tabular data intact for factual retrieval

### Optimized Output Formats
- **Raw Text**: Clean plain text perfect for embedding generation
- **Structured Markdown**: Maintains document structure for context-aware chunking
- **AI-Cleaned Content**: GPT-4 processed content with optimal signal-to-noise ratio

### RAG Pipeline Integration
- **Batch Processing**: Puppeteer clustering enables processing multiple URLs efficiently
- **Consistent Formatting**: Standardized output format across all scraped content
- **Error Handling**: Robust error management prevents pipeline failures
- **Scalable Architecture**: Designed to handle high-volume RAG data preparation

### Best Practices for RAG
- **Content Deduplication**: Removes repetitive elements common in web pages
- **Context Preservation**: Maintains semantic structure important for retrieval
- **Metadata Extraction**: Preserves important document metadata for enhanced retrieval
- **Clean Chunking Boundaries**: Processed content creates natural chunking points

## Features in Detail

### Smart Content Extraction
- Automatically identifies main content areas (`main`, `article`, `section` tags)
- Removes navigation, footers, sidebars, and advertisements
- Handles dynamic content and JavaScript-rendered pages

### AI-Powered Content Cleaning
- Uses custom prompts to clean markdown content
- Preserves important structure while removing noise
- Maintains links, tables, headings, and formatting

### Robust Error Handling
- Custom error classes with specific error codes
- Graceful handling of invalid URLs and scraping failures
- Comprehensive error middleware

### Performance Optimizations
- Puppeteer clustering for parallel processing
- Efficient DOM manipulation and content extraction
- Optimized for handling multiple concurrent requests

### RAG-Specific Optimizations
- **Content Quality**: Removes noise that degrades embedding quality
- **Semantic Preservation**: Maintains document structure for better retrieval
- **Chunk-Friendly Output**: Creates content optimized for text chunking strategies
- **Citation Support**: Preserves source URLs and link context for RAG citations

## Use Cases

### RAG System Data Preparation
- **Knowledge Base Creation**: Build clean, structured knowledge bases from web content
- **Document Ingestion**: Prepare web articles for vector database storage
- **Content Curation**: Extract high-quality content for AI training and fine-tuning
- **Research Automation**: Automatically process research papers and articles

### Content Processing Workflows
- **Batch URL Processing**: Process multiple URLs for comprehensive data collection
- **Content Standardization**: Ensure consistent format across diverse web sources
- **Quality Filtering**: AI-powered content cleaning for better RAG performance
- **Metadata Extraction**: Preserve important context for enhanced retrieval

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `3000` | Server port number |
| `OPENAI_API_KEY` | Yes | - | OpenAI API key for content processing |

## Development

### Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run dev:watch` - Start with nodemon
- `npm run dev:ts-node` - Alternative development start

### Code Structure
The project follows a clean architecture pattern with:
- **Controllers**: Handle HTTP requests and responses
- **Services**: Business logic and core functionality
- **Middleware**: Cross-cutting concerns like error handling
- **Utils**: Shared utility functions
- **Types**: TypeScript type definitions

## Error Handling

The API uses custom error classes with specific error codes:

- `INVALID_URL`: When the provided URL is invalid or inaccessible
- `INTERNAL_SERVER_ERROR`: For general server errors

All errors return a consistent JSON structure with status, message, and optional error code.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

ISC License

## Support

For issues and questions, please create an issue in the repository.