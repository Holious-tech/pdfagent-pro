import { Request, Response, Router } from 'express';

const router = Router();

// Types
type UploadRequest = {
  userId: string;
  // File will be handled by multer in the actual implementation
};

type UploadResponse = {
  documentId: string;
};

type SummarizeRequest = {
  documentId: string;
  instructions?: string;
};

type SummarizeResponse = {
  summary: string;
};

type EditRequest = {
  documentId: string;
  instruction: string;
};

type EditResponse = {
  editedDocumentId: string;
};

// Routes
router.post('/upload', (req: Request<{}, {}, UploadRequest>, res: Response<UploadResponse>) => {
  // Mock implementation
  const documentId = 'doc_' + Math.random().toString(36).substr(2, 9);
  res.status(200).json({ documentId });
});

router.post('/summarize', (req: Request<{}, {}, SummarizeRequest>, res: Response<SummarizeResponse>) => {
  // Mock implementation
  const { documentId, instructions } = req.body;
  res.status(200).json({
    summary: `This is a mock summary for document ${documentId}. ${instructions || ''}`
  });
});

router.post('/edit', (req: Request<{}, {}, EditRequest>, res: Response<EditResponse>) => {
  // Mock implementation
  const { documentId, instruction } = req.body;
  const editedDocumentId = 'edited_' + documentId;
  
  res.status(200).json({
    editedDocumentId
  });
});

export default router;
