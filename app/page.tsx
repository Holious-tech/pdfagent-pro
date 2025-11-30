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
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/pdf/upload-and-summarize', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(err?.error || 'Upload and summarization failed');
      }

      const data = await response.json();
      setSummary(data.summary);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong');
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
