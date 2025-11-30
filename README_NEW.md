# PDFAgent Pro

**Author**: Idode Destiny M  
**Project Type**: AI Product Management Portfolio  
**Last Updated**: November 30, 2025

## Project Setup

### Prerequisites
- Node.js (v16 or later)
- npm (v8 or later)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Holious-tech/pdfagent-pro.git
   cd pdfagent-pro
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Start the backend server (in a separate terminal):
   ```bash
   cd backend
   npm install
   npm run dev
   ```

### Project Structure

```
.
├── app/                    # Next.js app router
│   └── api/               # API routes
├── backend/               # Express API
│   └── src/
│       ├── routes/        # API route handlers
│       └── server.ts      # Express server setup
├── infrastructure/        # For Docker, CI/CD, IaC (future)
├── public/                # Static files
└── package.json           # Project dependencies and scripts
```

### Available Scripts

- `npm run dev` - Start the Next.js development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm test` - Run tests (to be implemented)

## API Endpoints

### PDF Operations

#### Upload PDF
- **POST** `/api/pdf/upload`
  - Request: PDF file + userId
  - Response: `{ documentId: string }`

#### Summarize PDF
- **POST** `/api/pdf/summarize`
  - Request: `{ documentId: string, instructions?: string }`
  - Response: `{ summary: string }`

#### Edit PDF
- **POST** `/api/pdf/edit`
  - Request: `{ documentId: string, instruction: string }`
  - Response: `{ editedDocumentId: string }`

## License

MIT
