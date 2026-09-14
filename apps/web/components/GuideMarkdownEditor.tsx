'use client';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@repo/supabase';

export default function GuideMarkdownEditor({ initialData = null, guideId }: { initialData?: any, guideId: string }) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '# New Guide\n\nWrite your guide content here...');
  const [price, setPrice] = useState(initialData?.price || 0);
  const [imageUrls, setImageUrls] = useState(initialData?.image_url || '');
  const [loading, setLoading] = useState(false);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'dummy';
  const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

  const handleSave = async () => {
    setLoading(true);
    
    // Check if user is auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { alert('Not authenticated'); setLoading(false); return; }

    const urls = imageUrls.split(',').map((u: string) => u.trim()).filter(Boolean);
    const primaryImage = urls[0] || '';

    const payload = {
      guide_id: guideId,
      version_number: initialData?.version_number || 1,
      title,
      description,
      price: parseFloat(price.toString()),
      image_url: primaryImage
    };

    let res;
    if (initialData?.id) {
      res = await supabase.from('guide_versions').update(payload).eq('id', initialData.id);
    } else {
      res = await supabase.from('guide_versions').insert([payload]);
    }

    if (res.error) {
      alert('Error saving guide: ' + res.error.message);
      setLoading(false);
      return;
    }

    // Save additional images to guide_images table
    if (urls.length > 0) {
      // First, delete existing images for this guide
      await supabase.from('guide_images').delete().eq('guide_id', guideId);
      
      // Then insert the new ones
      const imagePayloads = urls.map((url: string) => ({
        guide_id: guideId,
        image_url: url,
        is_user_uploaded: false,
        status: 'APPROVED'
      }));
      await supabase.from('guide_images').insert(imagePayloads);
    }

    router.push(`/office/guides`);
    router.refresh();
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', color: '#111' }}>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
        <input 
          placeholder="Guide Title" 
          value={title} 
          onChange={e => setTitle(e.target.value)}
          style={{ flex: 1, minWidth: '200px', padding: '12px', fontSize: '18px', fontWeight: 'bold', border: '1px solid #d1d5db', borderRadius: '6px' }}
        />
        <input 
          placeholder="Image URLs (comma separated)" 
          value={imageUrls} 
          onChange={e => setImageUrls(e.target.value)}
          style={{ flex: 1, minWidth: '200px', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
        />
        <input 
          type="number"
          placeholder="Price" 
          value={price} 
          onChange={e => setPrice(e.target.value)}
          style={{ width: '100px', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
        />
        <button 
          onClick={handleSave} 
          disabled={loading || !title}
          style={{ padding: '12px 24px', background: '#10b981', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer', opacity: (loading || !title) ? 0.5 : 1 }}
        >
          {loading ? 'Saving...' : 'Save Guide'}
        </button>
      </div>

      <div style={{ display: 'flex', flex: 1, gap: '20px', minHeight: '600px' }}>
        {/* Editor */}
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          style={{ flex: 1, padding: '16px', fontFamily: 'monospace', fontSize: '14px', border: '1px solid #d1d5db', borderRadius: '8px', resize: 'none' }}
        />
        
        {/* Preview */}
        <div style={{ flex: 1, padding: '16px', border: '1px solid #d1d5db', borderRadius: '8px', overflowY: 'auto', backgroundColor: '#fff' }}>
          <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>Live Preview</div>
          <ReactMarkdown
            components={{
              h1: ({node, ...props}) => <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '24px', borderBottom: '2px solid #eaeaea', paddingBottom: '8px' }} {...props} />,
              h2: ({node, ...props}) => <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px', color: '#1a1a1a' }} {...props} />,
              h3: ({node, ...props}) => <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '24px', marginBottom: '12px', color: '#2a2a2a' }} {...props} />,
              p: ({node, ...props}) => <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '16px', color: '#4a4a4a' }} {...props} />,
              ul: ({node, ...props}) => <ul style={{ marginBottom: '16px', paddingLeft: '24px' }} {...props} />,
              li: ({node, ...props}) => <li style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '8px', color: '#4a4a4a' }} {...props} />,
              code: ({node, inline, ...props}: any) => 
                inline 
                  ? <code style={{ backgroundColor: '#f4f4f5', padding: '2px 6px', borderRadius: '4px', fontSize: '14px', color: '#ec4899' }} {...props} />
                  : <pre style={{ backgroundColor: '#1e293b', color: '#f8fafc', padding: '16px', borderRadius: '8px', overflowX: 'auto', marginBottom: '16px' }}><code {...props} /></pre>,
              a: ({node, ...props}) => <a style={{ color: '#2563eb', textDecoration: 'underline' }} {...props} />
            }}
          >
            {description}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
