import Link from 'next/link';

export default function Login() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5', fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '24px', fontSize: '24px' }}>Herodoto Office</h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '32px' }}>Welcome back. Please sign in to your account.</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Email Address</label>
            <input type="email" value="admin@herodoto.art" readOnly style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Password</label>
            <input type="password" value="password123" readOnly style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
          </div>
          
          <Link href="/office/dashboard" style={{ marginTop: '16px', display: 'block', width: '100%', textDecoration: 'none' }}>
            <button style={{ width: '100%', padding: '12px', backgroundColor: '#000', color: 'white', border: 'none', borderRadius: '4px', fontWeight: '600', cursor: 'pointer' }}>
              Sign In
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
