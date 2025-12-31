# GOGLOBAL Market Analysis Backend

Backend API service for analyzing product market expansion opportunities using DeepSeek AI.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `server/` directory:

```bash
cp .env.example .env
```

Edit `.env` and add your DeepSeek API key:

```env
DEEPSEEK_API_KEY=your_actual_api_key_here
DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MAX_REQUESTS_PER_MINUTE=10
```

### 3. Run Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
npm start
```

## 📡 API Endpoints

### Health Check
```
GET /api/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "GOGLOBAL Market Analysis API"
}
```

### Market Analysis
```
POST /api/analyze
```

Request Body:
```json
{
  "productData": {
    "productName": "Organic Green Tea",
    "category": "Food & Beverage",
    "description": "Premium organic green tea from local farms",
    "costPrice": 10,
    "sellingPrice": 25,
    "targetMarkets": ["United States", "Japan", "Germany"],
    "currentMarket": "China",
    "productionCapacity": "Medium (1,000 - 10,000 units/month)",
    "certifications": "Organic, ISO 9001",
    "shelfLife": "24 months",
    "experience": "Limited (1-2 markets)"
  }
}
```

Response:
```json
{
  "success": true,
  "data": {
    "markets": {
      "United States": {
        "market": "United States",
        "overallScore": 85,
        "recommendation": "recommended",
        "scores": { ... },
        "legalCompliance": { ... },
        "competitiveAnalysis": { ... },
        "marketDemand": { ... },
        "pricingStrategy": { ... },
        "culturalAdaptation": { ... },
        "keyFindings": [...],
        "actionItems": [...],
        "riskAlerts": [...],
        "sources": [...],
        "lastUpdated": "2024-01-01T00:00:00.000Z"
      }
    }
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🏗️ Project Structure

```
server/
├── src/
│   ├── index.ts              # Server entry point
│   ├── types.ts              # TypeScript type definitions
│   ├── routes/
│   │   └── api.ts           # API route handlers
│   ├── services/
│   │   └── deepseek.ts      # DeepSeek AI integration
│   └── middleware/
│       └── errorHandler.ts  # Error handling middleware
├── .env                      # Environment variables (create this)
├── .env.example             # Environment template
├── package.json             # Dependencies and scripts
└── tsconfig.json            # TypeScript configuration
```

## 🔧 Development

### Run with Watch Mode
```bash
npm run dev
```

### Type Check
```bash
npm run type-check
```

### Build
```bash
npm run build
```

## 🌐 Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DEEPSEEK_API_KEY` | ✅ Yes | - | Your DeepSeek API key |
| `DEEPSEEK_API_URL` | No | https://api.deepseek.com/v1/chat/completions | DeepSeek API endpoint |
| `PORT` | No | 3000 | Server port |
| `NODE_ENV` | No | development | Environment mode |
| `FRONTEND_URL` | No | http://localhost:5173 | Frontend URL for CORS |
| `MAX_REQUESTS_PER_MINUTE` | No | 10 | Rate limit per IP |

## 🔒 Rate Limiting

The API implements basic rate limiting:
- Default: 10 requests per minute per IP address
- Returns HTTP 429 when limit is exceeded

## ⚠️ Error Handling

### Common Error Responses

**400 Bad Request**
```json
{
  "success": false,
  "error": "Missing required fields: productName, category",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**429 Too Many Requests**
```json
{
  "success": false,
  "error": "Rate limit exceeded. Please try again later.",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "error": "Analysis service temporarily unavailable",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 📝 Testing with cURL

```bash
# Health check
curl http://localhost:3000/api/health

# Market analysis
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "productData": {
      "productName": "Test Product",
      "category": "Electronics",
      "description": "Test description",
      "costPrice": 100,
      "sellingPrice": 200,
      "targetMarkets": ["United States"],
      "currentMarket": "China",
      "productionCapacity": "Medium",
      "certifications": "CE",
      "shelfLife": "5 years",
      "experience": "No prior export experience"
    }
  }'
```

## 🚀 Deployment

### Using Node.js

```bash
npm run build
NODE_ENV=production npm start
```

### Using Docker (optional)

Create `Dockerfile`:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

Build and run:
```bash
docker build -t goglobal-backend .
docker run -p 3000:3000 --env-file .env goglobal-backend
```

## 📄 License

MIT
