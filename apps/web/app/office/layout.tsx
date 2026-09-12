'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function OfficeLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* Sidebar */}
      {isSidebarOpen && (
        <aside style={{ width: '250px', backgroundColor: '#1a1a1a', color: 'white', padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2 style={{ margin: 0 }}>Herodoto Office</h2>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: '20px' }}
              title="Close Menu"
            >
              ✕
            </button>
          </div>
          
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px', flex: 1 }}>
            <Link href="/office/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
            <Link href="/office/guides" style={{ color: 'white', textDecoration: 'none' }}>Guide CMS</Link>
            <Link href="/office/tasks" style={{ color: 'white', textDecoration: 'none' }}>Tasks</Link>
            <Link href="/office/organization" style={{ color: 'white', textDecoration: 'none' }}>Organization</Link>
            <hr style={{ borderColor: '#333', margin: '10px 0' }} />
            <Link href="/office/subscriptions" style={{ color: 'white', textDecoration: 'none' }}>Subscriptions</Link>
            <Link href="/office/promo-codes" style={{ color: 'white', textDecoration: 'none' }}>Promo Codes</Link>
            <Link href="/office/security" style={{ color: '#ff6b6b', textDecoration: 'none' }}>Security & Audit</Link>
          </nav>
          
          {/* Logout Button */}
          <Link 
            href="http://localhost:8081" 
            style={{ 
              marginTop: 'auto', 
              padding: '12px', 
              backgroundColor: '#ef4444', 
              color: 'white', 
              textAlign: 'center', 
              borderRadius: '6px', 
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            Logout
          </Link>
        </aside>
      )}

      {/* Main Content */}
      <main style={{ flex: 1, backgroundColor: '#f4f4f4', color: '#111111', overflowY: 'auto' }}>
        
        {/* Top Header Bar for opening sidebar when hidden */}
        {!isSidebarOpen && (
          <div style={{ padding: '20px 30px', backgroundColor: 'white', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center' }}>
            <button 
              onClick={() => setIsSidebarOpen(true)}
              style={{ background: '#1a1a1a', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}
            >
              ☰ Menu
            </button>
            <span style={{ marginLeft: '20px', fontWeight: 'bold', fontSize: '20px' }}>Herodoto Office</span>
          </div>
        )}

        {/* Content Wrapper */}
        <div style={{ padding: '30px' }}>
          {children}
        </div>
        
      </main>
    </div>
  );
}
