import Link from 'next/link';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'white' }}>
      {/* Docs Sidebar */}
      <div style={{ width: '250px', borderRight: '1px solid #e5e7eb', padding: '24px', backgroundColor: '#f9fafb' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>?? Herodoto Docs</h2>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <li><Link href="/office/docs" style={{ color: '#374151', textDecoration: 'none' }}>Home</Link></li>
          <li><Link href="/office/docs/architecture" style={{ color: '#374151', textDecoration: 'none' }}>Architecture</Link></li>
          <li><Link href="/office/docs/database" style={{ color: '#374151', textDecoration: 'none' }}>Database</Link></li>
          <li><Link href="/office/docs/tech-stack" style={{ color: '#374151', textDecoration: 'none' }}>Tech Stack</Link></li>
          <li><Link href="/office/docs/deployment" style={{ color: '#374151', textDecoration: 'none' }}>Deployment Guide</Link></li>
          <li><Link href="/office/docs/requirements" style={{ color: '#374151', textDecoration: 'none' }}>Requirements Status</Link></li>
        </ul>
      </div>

      {/* Docs Content */}
      <div style={{ flex: 1, padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
        {children}
      </div>
    </div>
  );
}
