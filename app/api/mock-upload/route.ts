import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileName, userId } = body;
    
    // Mock implementation - return a demo document ID
    const documentId = 'demo-doc-123';
    
    return NextResponse.json({ documentId });
  } catch (error) {
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
