import React from 'react';
import ReactMarkdown from 'react-markdown';
import Comments from '../Comments';
import { createServerClient } from '@repo/supabase';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

export default async function DynamicDocPage({ params }: { params: { slug: string } }) {
  const cookieStore = cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'dummy';
  
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, cookieStore);
  
  const { data: page } = await supabase
    .from('documentation_pages')
    .select('title, content_markdown')
    .eq('slug', params.slug)
    .single();

  if (!page) {
    notFound();
  }

  return (
    <div style={{ maxWidth: '800px', padding: '24px' }}>
      <ReactMarkdown
        components={{
          h1: ({node, ...props}) => <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '24px', borderBottom: '2px solid #eaeaea', paddingBottom: '8px' }} {...props} />,
          h2: ({node, ...props}) => <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px', color: '#1a1a1a' }} {...props} />,
          h3: ({node, ...props}) => <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '24px', marginBottom: '12px', color: '#2a2a2a' }} {...props} />,
          p: ({node, ...props}) => <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '16px', color: '#4a4a4a' }} {...props} />,
          ul: ({node, ...props}) => <ul style={{ marginBottom: '16px', paddingLeft: '24px' }} {...props} />,
          li: ({node, ...props}) => <li style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '8px', color: '#4a4a4a' }} {...props} />,
          strong: ({node, ...props}) => <strong style={{ color: '#000' }} {...props} />,
          code: ({node, inline, ...props}: any) => 
            inline 
              ? <code style={{ backgroundColor: '#f4f4f5', padding: '2px 6px', borderRadius: '4px', fontSize: '14px', color: '#ec4899' }} {...props} />
              : <pre style={{ backgroundColor: '#1e293b', color: '#f8fafc', padding: '16px', borderRadius: '8px', overflowX: 'auto', marginBottom: '16px' }}><code {...props} /></pre>,
          hr: ({node, ...props}) => <hr style={{ border: 'none', borderTop: '1px solid #eaeaea', margin: '32px 0' }} {...props} />
        }}
      >
        {page.content_markdown}
      </ReactMarkdown>

      <Comments pageId={params.slug} />
    </div>
  );
}
