'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../../../packages/supabase/src';

export default function DashboardPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if Admin
      const { data: orgMember } = await supabase.from('organization_members').select('role_id').eq('user_id', user.id).single();
      const { data: role } = await supabase.from('roles').select('name').eq('id', orgMember?.role_id).single();
      const admin = role?.name === 'ADMIN';
      setIsAdmin(admin);

      // Fetch user's pending tasks
      const { data: userTasks } = await supabase.from('tasks')
        .select('*')
        .eq('assignee_id', user.id)
        .in('status', ['TODO', 'IN_PROGRESS', 'REJECTED'])
        .order('created_at', { ascending: false });
      
      if (userTasks) setTasks(userTasks);

      // Fetch activity logs
      let query = supabase.from('activity_logs').select('*, profiles(first_name, last_name)').order('created_at', { ascending: false }).limit(10);
      if (!admin) {
        query = query.eq('is_visible', true);
      }
      
      const { data: logs } = await query;
      if (logs) setActivities(logs);

      setLoading(false);
    })();
  }, []);

  const toggleVisibility = async (id: string, current: boolean) => {
    await supabase.from('activity_logs').update({ is_visible: !current }).eq('id', id);
    setActivities(acts => acts.map(a => a.id === id ? { ...a, is_visible: !current } : a));
  };

  return (
    <div style={{ color: '#111' }}>
      <h1 style={{ color: '#000', fontSize: '32px', marginBottom: '8px' }}>Office Dashboard</h1>
      <p style={{ color: '#444', marginBottom: '24px' }}>Welcome to the Herodoto internal environment.</p>

      {loading ? <p>Loading...</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
          
          <div style={{ padding: '20px', background: 'white', borderRadius: '8px', border: '1px solid #ddd' }}>
            <h3 style={{ color: '#000', borderBottom: '1px solid #eee', paddingBottom: '8px', marginBottom: '12px' }}>My Pending Tasks</h3>
            <ul style={{ color: '#333', lineHeight: '1.6', paddingLeft: '20px' }}>
              {tasks.length === 0 ? <li style={{color: '#666'}}>No pending tasks!</li> : tasks.map(t => (
                <li key={t.id} style={{ marginBottom: '8px' }}>
                  <strong>{t.title}</strong> - <span style={{fontSize: '12px', color: '#666'}}>{t.status}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div style={{ padding: '20px', background: 'white', borderRadius: '8px', border: '1px solid #ddd' }}>
            <h3 style={{ color: '#000', borderBottom: '1px solid #eee', paddingBottom: '8px', marginBottom: '12px' }}>Recent Activity</h3>
            <ul style={{ color: '#333', lineHeight: '1.6', paddingLeft: '20px', listStyle: 'none', marginLeft: '-20px' }}>
              {activities.length === 0 ? <li style={{color: '#666', marginLeft: '20px'}}>No recent activity.</li> : activities.map(a => (
                <li key={a.id} style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '14px' }}>
                      <strong>{a.profiles?.first_name || 'System'}</strong> {a.action} on <em>{a.table_name}</em>
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                      {new Date(a.created_at).toLocaleString()}
                    </div>
                  </div>
                  {isAdmin && (
                    <button 
                      onClick={() => toggleVisibility(a.id, a.is_visible)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '18px', opacity: a.is_visible ? 1 : 0.3 }}
                      title={a.is_visible ? "Make Hidden" : "Make Visible"}
                    >
                      ???
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

        </div>
      )}
    </div>
  );
}
