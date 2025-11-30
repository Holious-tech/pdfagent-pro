import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromPdf } from '@/lib/pdf/extractText';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    console.log('Upload-and-summarize request received');
    
    const formData = await req.formData();
    const file = formData.get('file');

    console.log('File received:', file instanceof File ? `${file.name} (${file.size} bytes)` : 'Invalid file type');

    if (!file || !(file instanceof File)) {
      console.error('Missing or invalid PDF file');
      return NextResponse.json(
        { error: 'Missing PDF file' },
        { status: 400 }
      );
    }

    // 1) Extract text
    console.log('Starting PDF text extraction...');
    const { text, metadata } = await extractTextFromPdf(file);
    console.log('Extraction complete, text length:', text?.length);

    if (!text.trim()) {
      console.error('No text extracted from PDF');
      return NextResponse.json(
        { error: 'No text could be extracted from this PDF' },
        { status: 400 }
      );
    }

    // 2) Summarize via OpenAI (reuse your Stage 6 logic)
    console.log('Starting OpenAI summarization...');
    const prompt = `Summarize the following PDF content for a busy professional. Focus on key points, decisions, and actions.\n\n${text}`;

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that summarizes PDF content for busy professionals.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
    });

    const summary =
      completion.choices[0]?.message?.content?.trim() ||
      'No summary generated.';

    console.log('Summarization complete, summary length:', summary?.length);

    return NextResponse.json({ summary, metadata });

  } catch (error) {
    console.error('Upload-and-summarize error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to process and summarize PDF: ' + errorMessage },
      { status: 500 }
    );
  }
}
