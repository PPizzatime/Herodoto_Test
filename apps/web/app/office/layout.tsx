'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@repo/supabase';

// Use same env variables as Next.js normally would
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'dummy';
const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

function NotificationBell({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadNotifications();
    const channel = supabase.channel('realtime-notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, (payload) => {
        loadNotifications();
      }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  async function loadNotifications() {
    const { data } = await supabase.from('notifications')
      .select('*, actor:profiles!actor_id(first_name)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);
    if (data) setNotifications(data);
  }

  async function markAsRead(id: string) {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    loadNotifications();
  }

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setIsOpen(!isOpen)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '24px', position: 'relative' }}>
        ??
        {unreadCount > 0 && (
          <div style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', borderRadius: '50%', width: '20px', height: '20px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            {unreadCount}
          </div>
        )}
      </button>

      {isOpen && (
        <div style={{ position: 'absolute', right: 0, top: '40px', width: '300px', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', zIndex: 50, maxHeight: '400px', overflowY: 'auto' }}>
          <div style={{ padding: '12px', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>Notifications</div>
          {notifications.length === 0 ? (
            <div style={{ padding: '16px', color: '#888', textAlign: 'center' }}>No notifications</div>
          ) : (
            notifications.map(n => (
              <div key={n.id} onClick={() => { markAsRead(n.id); if (n.link) window.location.href = n.link; }} style={{ padding: '12px', borderBottom: '1px solid #eee', cursor: 'pointer', backgroundColor: n.is_read ? 'white' : '#eff6ff' }}>
                <div style={{ fontSize: '14px', color: 'black' }}><b>{n.actor?.first_name || 'Someone'}</b> {n.message}</div>
                <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>{new Date(n.created_at).toLocaleString()}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function OfficeLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error || !user) {
        window.location.href = '/app';
      } else {
        setUserId(user.id);
        setIsAuthorized(true);
      }
    });
  }, []);

  if (!isAuthorized) {
    return <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>Authenticating...</div>;
  }

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
            <Link href="/office/profile" style={{ color: 'white', textDecoration: 'none' }}>My Profile</Link>
            <Link href="/office/guides" style={{ color: 'white', textDecoration: 'none' }}>Guide CMS</Link>
            <Link href="/office/tasks" style={{ color: 'white', textDecoration: 'none' }}>Tasks</Link>
            <Link href="/office/organization" style={{ color: 'white', textDecoration: 'none' }}>Organization</Link>
            <hr style={{ borderColor: '#333', margin: '10px 0' }} />
            <Link href="/office/subscriptions" style={{ color: 'white', textDecoration: 'none' }}>Subscriptions</Link>
            <Link href="/office/promo-codes" style={{ color: 'white', textDecoration: 'none' }}>Promo Codes</Link>
            <Link href="/office/security" style={{ color: '#ff6b6b', textDecoration: 'none' }}>Security & Audit</Link>
            <Link href="/office/docs" style={{ color: '#60a5fa', textDecoration: 'none' }}>System Docs</Link>
          </nav>
          
          {/* Logout Button */}
          <Link 
            href="/" 
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








