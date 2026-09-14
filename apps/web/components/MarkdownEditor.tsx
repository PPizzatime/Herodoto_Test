'use client';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@repo/supabase';

export default function MarkdownEditor({ initialData = null }: { initialData?: any }) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [category, setCategory] = useState(initialData?.category || 'General');
  const [content, setContent] = useState(initialData?.content_markdown || '# New Page\n\nStart typing here...');
  const [loading, setLoading] = useState(false);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'dummy';
  const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

  const handleSave = async () => {
    setLoading(true);
    
    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { alert('Not authenticated'); setLoading(false); return; }

    const payload = {
      slug,
      title,
      category,
      content_markdown: content,
      author_id: user.id
    };

    let res;
    if (initialData?.id) {
      res = await supabase.from('documentation_pages').update(payload).eq('id', initialData.id);
    } else {
      res = await supabase.from('documentation_pages').insert([payload]);
    }

    if (res.error) {
      alert('Error saving page: ' + res.error.message);
    } else {
      router.push(`/office/docs/${slug}`);
      router.refresh();
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!initialData?.id) return;
    if (!confirm('Are you sure you want to delete this page?')) return;
    setLoading(true);
    const res = await supabase.from('documentation_pages').delete().eq('id', initialData.id);
    if (res.error) {
      alert('Error deleting page: ' + res.error.message);
      setLoading(false);
    } else {
      router.push(`/office/docs`);
      router.refresh();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', color: '#111' }}>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', alignItems: 'center' }}>
        <input 
          placeholder="Page Title" 
          value={title} 
          onChange={e => setTitle(e.target.value)}
          style={{ flex: 1, padding: '12px', fontSize: '18px', fontWeight: 'bold', border: '1px solid #d1d5db', borderRadius: '6px' }}
        />
        <input 
          placeholder="url-slug" 
          value={slug} 
          onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
          style={{ width: '200px', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
        />
        <input 
          placeholder="Category" 
          value={category} 
          onChange={e => setCategory(e.target.value)}
          style={{ width: '150px', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
        />
        <button 
          onClick={handleSave} 
          disabled={loading || !title || !slug}
          style={{ padding: '12px 24px', background: '#10b981', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer', opacity: (loading || !title || !slug) ? 0.5 : 1 }}
        >
          {loading ? 'Saving...' : 'Save Page'}
        </button>
        {initialData && (
          <button onClick={handleDelete} style={{ padding: '12px 16px', background: '#ef4444', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            Delete
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flex: 1, gap: '20px', minHeight: '600px' }}>
        {/* Editor */}
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
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
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
