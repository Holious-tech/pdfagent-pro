import { prisma } from '../../lib/prisma';
import Link from 'next/link';
import { formatFileSize, formatDate } from '../../lib/utils';

export default async function Dashboard() {
  // Fetch last 10 documents with their events
  const documents = await prisma.document.findMany({
    take: 10,
    orderBy: { uploadedAt: 'desc' },
    include: {
      events: {
        select: { id: true }
      }
    }
  });

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>PDF Analytics Dashboard</h1>
        <Link 
          href="/" 
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#0070f3',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        >
          ← Back to Upload
        </Link>
      </div>

      {documents.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h3>No documents yet</h3>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>
            Upload and summarize some PDFs to see analytics data here.
          </p>
          <Link 
            href="/"
            style={{
              display: 'inline-block',
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#0070f3',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px'
            }}
          >
            Upload First PDF
          </Link>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0070f3' }}>{documents.length}</div>
              <div style={{ color: '#666', fontSize: '0.875rem' }}>Recent Documents</div>
            </div>
            <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>
                {documents.filter(doc => doc.summary).length}
              </div>
              <div style={{ color: '#666', fontSize: '0.875rem' }}>With Summaries</div>
            </div>
            <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffc107' }}>
                {documents.reduce((total, doc) => total + doc.events.length, 0)}
              </div>
              <div style={{ color: '#666', fontSize: '0.875rem' }}>Total Events</div>
            </div>
            <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc3545' }}>
                {formatFileSize(documents.reduce((total, doc) => total + doc.fileSize, 0))}
              </div>
              <div style={{ color: '#666', fontSize: '0.875rem' }}>Total Size</div>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e1e5e9' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e1e5e9', fontWeight: '600' }}>File Name</th>
                  <th style={{ padding: '1rem', textAlign: 'right', borderBottom: '1px solid #e1e5e9', fontWeight: '600' }}>Size</th>
                  <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid #e1e5e9', fontWeight: '600' }}>Uploaded</th>
                  <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid #e1e5e9', fontWeight: '600' }}>Summary</th>
                  <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid #e1e5e9', fontWeight: '600' }}>Events</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc, index) => (
                  <tr key={doc.id} style={{ borderBottom: index < documents.length - 1 ? '1px solid #e1e5e9' : 'none' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: '500', color: '#333' }}>{doc.fileName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.25rem' }}>
                        ID: {doc.id.slice(0, 8)}...
                      </div>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right', fontFamily: 'monospace' }}>
                      {formatFileSize(doc.fileSize)}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>
                      {formatDate(doc.uploadedAt)}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      {doc.summary ? (
                        <span style={{ 
                          backgroundColor: '#28a745', 
                          color: 'white', 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '12px', 
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}>
                          ✓ {doc.summary.length} chars
                        </span>
                      ) : (
                        <span style={{ 
                          backgroundColor: '#6c757d', 
                          color: 'white', 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '12px', 
                          fontSize: '0.75rem'
                        }}>
                          None
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span style={{ 
                        backgroundColor: '#0070f3', 
                        color: 'white', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '12px', 
                        fontSize: '0.75rem'
                      }}>
                        {doc.events.length}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '2rem', textAlign: 'center', color: '#666', fontSize: '0.875rem' }}>
            Showing last {documents.length} documents • Total database: {await prisma.document.count()} documents
          </div>
        </>
      )}
    </div>
  );
}
