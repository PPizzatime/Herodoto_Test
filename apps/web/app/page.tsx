import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: 'sans-serif' }}>
      <div style={{ padding: '40px', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '8px', color: '#111' }}>Herodoto</h1>
        <p style={{ color: '#6b7280', marginBottom: '32px' }}>Select your environment to continue.</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Link href="/index.html" style={{ padding: '16px', backgroundColor: '#3b82f6', color: 'white', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none', transition: '0.2s' }}>
            ?? Enter Consumer App
          </Link>
          
          <Link href="/login" style={{ padding: '16px', backgroundColor: '#111827', color: 'white', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none', transition: '0.2s' }}>
            ?? Enter Office Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
