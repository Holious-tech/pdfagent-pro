import { NextRequest, NextResponse } from 'next/server';
import PDFParser from 'pdf2json';

export async function POST(req: NextRequest)): Promise<NextResponse> {
  try {
    console.log('PDF extraction request received');
    
    const formData = await req.formData();
    const file = formData.get('file') as File;

    console.log('File received:', file?.name, file?.type, file?.size);

    if (!file) {
      console.error('No file provided');
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (file.type !== 'application/pdf') {
      console.error('Invalid file type:', file.type);
      return NextResponse.json(
        { error: 'Only PDF files are supported' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log('File converted to buffer, size:', buffer.length);

    // Use pdf2json for text extraction
    const pdfParser = new PDFParser();
    
    return new Promise((resolve) => {
      pdfParser.on('pdfParser_dataError', (errData: any) => {
        console.error('PDF parsing error:', errData.parserError);
        resolve(NextResponse.json(
          { error: 'Failed to extract PDF content: ' + errData.parserError },
          { status: 500 }
        ));
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

          console.log('PDF parsed successfully, text length:', extractedText?.length);

          // If no text extracted, try alternative methods
          if (!extractedText || extractedText.trim().length === 0) {
            console.log('No text found with primary method, trying fallback...');
            
            // Try extracting from other possible structures
            if (pdfData.Pages) {
              pdfData.Pages.forEach((page: any) => {
                // Try different text extraction approaches
                if (page.Fields) {
                  page.Fields.forEach((field: any) => {
                    if (field.T) {
                      try {
                        const decodedText = decodeURIComponent(field.T);
                        extractedText += decodedText + ' ';
                      } catch (decodeError) {
                        extractedText += field.T + ' ';
                      }
                    }
                  });
                }
              });
            }
          }

          const finalText = extractedText.trim();
          
          if (!finalText || finalText.length === 0) {
            console.log('No extractable text found in PDF');
            resolve(NextResponse.json(
              { error: 'This PDF appears to be scanned or contains no extractable text. Try a PDF with text content.' },
              { status: 400 }
            ));
          } else {
            resolve(NextResponse.json({ 
              text: finalText,
              pageCount: pdfData.Pages?.length || 0
            }));
          }
          
        } catch (error) {
          console.error('Error processing PDF data:', error);
          resolve(NextResponse.json(
            { error: 'Failed to process PDF content: ' + (error instanceof Error ? error.message : 'Unknown error') },
            { status: 500 }
          ));
        }
      });

      // Parse the PDF
      pdfParser.parseBuffer(buffer);
    });

  } catch (error) {
    console.error('PDF extraction error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to extract PDF content: ' + errorMessage },
      { status: 500 }
    );
  }
}
