import { createServerClient } from '@repo/supabase';
import Link from 'next/link';

export default async function SearchDocsPage({ searchParams }: { searchParams: Promise<{ q?: string }> | { q?: string } }) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q || '';
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'dummy';
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey);
  
  let results: any[] = [];
  if (q) {
    const { data } = await supabase
      .from('documentation_pages')
      .select('slug, title, category, content_markdown')
      .or(`title.ilike.%${q}%,content_markdown.ilike.%${q}%`)
      .limit(20);
    if (data) results = data;
  }

  return (
    <div style={{ fontFamily: 'sans-serif', color: '#111' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '16px' }}>Search Results for "{q}"</h1>
      
      {results.length === 0 ? (
        <p style={{ color: '#666' }}>No results found.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {results.map(page => {
            const snippet = page.content_markdown.substring(0, 150) + '...';
            return (
              <div key={page.slug} style={{ border: '1px solid #e5e7eb', padding: '16px', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: '#6366f1', fontWeight: 'bold', marginBottom: '4px' }}>{page.category}</div>
                <Link href={`/office/docs/${page.slug}`} style={{ fontSize: '20px', fontWeight: 'bold', color: '#2563eb', textDecoration: 'none' }}>
                  {page.title}
                </Link>
                <p style={{ marginTop: '8px', color: '#4b5563', fontSize: '14px', lineHeight: '1.5' }}>
                  {snippet}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
