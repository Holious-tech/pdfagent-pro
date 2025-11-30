import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { text, instructions } = await req.json();
    
    console.log('Received request with text:', text?.substring(0, 100) + '...');
    console.log('OpenAI API Key exists:', !!process.env.OPENAI_API_KEY);

    if (!text) {
      return NextResponse.json(
        { error: 'Missing text to summarize' },
        { status: 400 }
      );
    }

    const prompt = `${instructions || 'Summarize the following text concisely.'}\n\n${text}`;

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that summarizes PDF content for busy professionals.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
    });

    const summary =
      completion.choices[0]?.message?.content?.trim() ||
      'No summary generated.';

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}
