'use client';
import { useEffect, useState, useRef } from 'react';
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
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        }
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  const handleUpdate = async () => {
    setMessage('');
    if (!profile) return;
    const { error } = await supabase
      .from('profiles')
      .update({ first_name: firstName, last_name: lastName, avatar_url: avatarUrl, updated_at: new Date() })
      .eq('id', profile.id);
    
    if (error) setMessage('Error updating profile: ' + error.message);
    else setMessage('Profile updated successfully!');
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setMessage('');
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      if (!file) {
        throw new Error('You must select an image to upload.');
      }
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${profile.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      setAvatarUrl(data.publicUrl);
      
      // Auto save
      await supabase.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', profile.id);
      setMessage('Avatar uploaded & saved!');
    } catch (error: any) {
      setMessage('Error uploading avatar: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div style={{ padding: '24px' }}>Loading profile...</div>;
  if (!profile) return <div style={{ padding: '24px' }}>Please log in.</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '24px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Your Profile</h1>
      
      {message && <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: message.includes('Error') ? '#fee2e2' : '#dcfce7', color: message.includes('Error') ? '#991b1b' : '#166534', borderRadius: '4px' }}>{message}</div>}
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
        <div 
          style={{ width: '120px', height: '120px', borderRadius: '60px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '2px solid #e2e8f0', cursor: 'pointer', marginBottom: '16px' }}
          onClick={() => fileInputRef.current?.click()}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ color: '#94a3b8', fontSize: '14px' }}>{uploading ? 'Uploading...' : 'Click to Upload'}</span>
          )}
        </div>
        <input 
          type="file" 
          ref={fileInputRef}
          style={{ display: 'none' }} 
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
        <p style={{ fontSize: '14px', color: '#64748b' }}>Click the image to upload a new avatar</p>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#334155' }}>First Name</label>
        <input 
          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '16px' }}
          value={firstName} 
          onChange={e => setFirstName(e.target.value)} 
          placeholder="First Name"
        />
      </div>
      
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#334155' }}>Last Name</label>
        <input 
          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '16px' }}
          value={lastName} 
          onChange={e => setLastName(e.target.value)} 
          placeholder="Last Name"
        />
      </div>

      <button 
        style={{ width: '100%', padding: '12px', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}
        onClick={handleUpdate}
      >
        Save Changes
      </button>
    </div>
  );
}
