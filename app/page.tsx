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
      // Step 1: Upload (mocked)
      const uploadResponse = await fetch('/api/mock-upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId: 'demo-user',
          fileName: file.name 
        }),
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload failed');
      }

      const uploadData = await uploadResponse.json();
      const documentId = uploadData.documentId;

      // Step 2: Summarize (mocked)
      const summarizeResponse = await fetch('/api/mock-summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId,
          instructions: 'Provide a concise summary'
        }),
      });

      if (!summarizeResponse.ok) {
        throw new Error('Summarization failed');
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
          {loading ? 'Summarizing...' : 'Upload & Summarize'}
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
