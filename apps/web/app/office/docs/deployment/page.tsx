export default function DocsDeploy() {
  const content = \$deployText\;
  return (
    <div style={{ fontFamily: 'sans-serif', lineHeight: 1.6, color: '#333' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>Deployment Guide</h1>
      <pre style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        {content}
      </pre>
    </div>
  );
}
