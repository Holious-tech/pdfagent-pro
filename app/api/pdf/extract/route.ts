import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromPdf } from '@/lib/pdf/extractText';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'Missing PDF file' },
        { status: 400 }
      );
    }

    const result = await extractTextFromPdf(file);

    if (!result.text.trim()) {
      return NextResponse.json(
        { error: 'No text could be extracted from this PDF' },
        { status: 400 }
      );
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('PDF extraction error:', error);
    return NextResponse.json(
      { error: 'Failed to extract text from PDF' },
      { status: 500 }
    );
  }
}
