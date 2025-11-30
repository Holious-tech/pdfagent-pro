import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { documentId, instructions } = body;
    
    // Mock implementation - return a demo summary
    const mockSummary = "This is a mock summary for demo purposes. The document appears to be a standard business document with typical content structure. Key points include important information that would normally be extracted from an actual PDF file.";
    
    return NextResponse.json({ summary: mockSummary });
  } catch (error) {
    return NextResponse.json(
      { error: 'Summarization failed' },
      { status: 500 }
    );
  }
}
