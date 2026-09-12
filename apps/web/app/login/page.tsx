'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@herodoto.art');
  const [password, setPassword] = useState('password123');

  const autofill = (role: string) => {
    setEmail(role + '@herodoto.art');
    setPassword('password123');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.startsWith('consumer')) {
      alert('Consumers do not have access to the Office portal. Please use the Mobile App.');
    } else {
      router.push('/office/dashboard?role=' + email.split('@')[0]);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f5f5f5', fontFamily: 'sans-serif', padding: '20px' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 8px 16px rgba(0,0,0,0.1)', width: '100%', maxWidth: '450px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '8px', fontSize: '28px', fontWeight: 'bold' }}>Herodoto Office</h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '32px' }}>Sign in to the employee dashboard</p>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '30px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' }} 
            />
          </div>
          
          <button type="submit" style={{ width: '100%', padding: '14px', backgroundColor: '#000', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', marginTop: '8px', fontSize: '16px' }}>
            Sign In
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
          <span style={{ padding: '0 12px', color: '#9ca3af', fontSize: '12px', fontWeight: 'bold' }}>OR AUTOFILL AS</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button type="button" onClick={() => autofill('consumer')} style={{ padding: '12px', backgroundColor: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Consumer</button>
          <button type="button" onClick={() => autofill('employee')} style={{ padding: '12px', backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Employee</button>
          <button type="button" onClick={() => autofill('manager')} style={{ padding: '12px', backgroundColor: '#fdf4ff', color: '#c026d3', border: '1px solid #fbcfe8', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Manager</button>
          <button type="button" onClick={() => autofill('admin')} style={{ padding: '12px', backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Admin</button>
        </div>
      </div>
    </div>
  );
}
