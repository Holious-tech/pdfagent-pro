'use client';

import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    setLoading(true);
    setError('');
    setSummary('');

    try {
      // Step 1: Extract text from uploaded PDF
      const formData = new FormData();
      formData.append('file', file);

      const extractResponse = await fetch('/api/extract-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!extractResponse.ok) {
        const errorData = await extractResponse.json();
        console.error('PDF extraction API error:', errorData);
        throw new Error(`PDF extraction failed: ${errorData.error || 'Unknown error'}`);
      }

      const extractData = await extractResponse.json();
      const extractedText = extractData.text;

      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error('No text could be extracted from the PDF');
      }

      // Step 2: Summarize the extracted text with AI
      const summarizeResponse = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: extractedText,
          instructions: 'Provide a concise summary for a busy professional.'
        }),
      });

      if (!summarizeResponse.ok) {
        const errorData = await summarizeResponse.json();
        console.error('Summarize API error:', errorData);
        throw new Error(`Summarization failed: ${errorData.error || 'Unknown error'}`);
      }

      const summarizeData = await summarizeResponse.json();
      
      // Step 3: Show result
      setSummary(summarizeData.summary);
      
    } catch (err) {
      setError('Something went wrong');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>PDFAgent Pro – MVP</h1>
      <p>Upload and summarize PDF documents with AI-powered analysis.</p>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="pdf-file" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Select PDF File:
          </label>
          <input
            id="pdf-file"
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            style={{ display: 'block' }}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading || !file}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading || !file ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Extracting & Summarizing...' : 'Upload & Summarize'}
        </button>
      </form>

      {error && (
        <div style={{ color: 'red', marginTop: '1rem' }}>
          {error}
        </div>
      )}

      {summary && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Summary</h2>
          <pre style={{ 
            backgroundColor: '#f5f5f5', 
            padding: '1rem', 
            borderRadius: '4px',
            whiteSpace: 'pre-wrap',
            fontFamily: 'monospace'
          }}>
            {summary}
          </pre>
        </div>
      )}
    </div>
  );
}
