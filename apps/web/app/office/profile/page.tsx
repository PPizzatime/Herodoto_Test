'use client';
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@repo/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'dummy';
const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (data) {
          setProfile(data);
          setFirstName(data.first_name || '');
          setLastName(data.last_name || '');
          setAvatarUrl(data.avatar_url || '');
        } else {
          // Profile might not exist yet if they just signed up
          const newProfile = { id: user.id, first_name: user.user_metadata?.first_name || '' };
          await supabase.from('profiles').insert(newProfile);
          setProfile(newProfile);
          setFirstName(newProfile.first_name);
        }
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  const handleSave = async () => {
    setMessage('');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('profiles').update({
      first_name: firstName,
      last_name: lastName,
      avatar_url: avatarUrl,
    }).eq('id', user.id);

    if (error) {
      setMessage('Error saving profile: ' + error.message);
    } else {
      setMessage('Profile updated successfully!');
    }
  };

  if (loading) return <div>Loading Profile...</div>;

  return (
    <div style={{ maxWidth: '600px', backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>My Profile</h1>
      
      {message && <div style={{ marginBottom: '15px', color: message.includes('Error') ? 'red' : 'green' }}>{message}</div>}

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>First Name</label>
        <input 
          value={firstName} 
          onChange={(e) => setFirstName(e.target.value)} 
          style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} 
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Last Name</label>
        <input 
          value={lastName} 
          onChange={(e) => setLastName(e.target.value)} 
          style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} 
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Profile Picture URL</label>
        <input 
          value={avatarUrl} 
          onChange={(e) => setAvatarUrl(e.target.value)} 
          style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} 
          placeholder="https://example.com/my-picture.jpg"
        />
        {avatarUrl && (
          <img src={avatarUrl} alt="Avatar Preview" style={{ width: '80px', height: '80px', borderRadius: '50%', marginTop: '10px', objectFit: 'cover' }} />
        )}
      </div>

      <button 
        onClick={handleSave} 
        style={{ backgroundColor: '#2563eb', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
      >
        Save Changes
      </button>
    </div>
  );
}
