import PDFParser from 'pdf2json';

export interface PdfMetadata {
  fileName: string;
  fileSize: number;
  uploadedAt: string;
}

export interface PdfExtractionResult {
  text: string;
  metadata: PdfMetadata;
}

export async function extractTextFromPdf(file: File): Promise<PdfExtractionResult> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  // Use pdf2json for more reliable text extraction
  const pdfParser = new PDFParser();
  
  return new Promise((resolve, reject) => {
    pdfParser.on('pdfParser_dataError', (errData: any) => {
      reject(new Error('PDF parsing failed: ' + errData.parserError));
    });

    pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
      try {
        // Extract text from parsed PDF
        let extractedText = '';
        
        if (pdfData.Pages) {
          pdfData.Pages.forEach((page: any) => {
            if (page.Texts) {
              page.Texts.forEach((text: any) => {
                if (text.R && text.R.length > 0) {
                  text.R.forEach((r: any) => {
                    if (r.T) {
                      try {
                        // Safely decode text, fallback if it fails
                        const decodedText = decodeURIComponent(r.T);
                        extractedText += decodedText + ' ';
                      } catch (decodeError) {
                        // If decoding fails, use raw text or skip
                        try {
                          extractedText += r.T + ' ';
                        } catch (rawError) {
                          // Skip this text element if both fail
                          console.log('Skipping malformed text element');
                        }
                      }
                    }
                  });
                }
              });
            }
          });
        }

        const metadata: PdfMetadata = {
          fileName: file.name,
          fileSize: file.size,
          uploadedAt: new Date().toISOString(),
        };
        
        resolve({
          text: extractedText.trim(),
          metadata,
        });
      } catch (error) {
        reject(error);
      }
    });

    // Parse the PDF
    pdfParser.parseBuffer(buffer);
  });
}
