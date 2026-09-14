import Link from 'next/link';
import { createServerClient } from '@repo/supabase';

export default async function DocsLayout({ children }: { children: React.ReactNode }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'dummy';
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey);
  
  // Fetch all pages and their categories
  const { data: pages } = await supabase.from('documentation_pages').select('slug, title, category').order('title');

  // Group by category
  const categories: Record<string, typeof pages> = {};
  if (pages) {
    pages.forEach(p => {
      const cat = p.category || 'General';
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(p);
    });
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'white', color: '#111' }}>
      {/* Docs Sidebar */}
      <div style={{ width: '280px', borderRight: '1px solid #e5e7eb', padding: '24px', backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>?? Herodoto Wiki</h2>
          <Link href="/office/docs/new" style={{ background: '#2563eb', color: 'white', padding: '4px 8px', borderRadius: '4px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold' }}>+ New</Link>
        </div>
        
        {/* Search Bar */}
        <form action="/office/docs/search" method="GET" style={{ marginBottom: '24px' }}>
          <input 
            type="text" 
            name="q" 
            placeholder="Search wiki..." 
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
          />
        </form>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ marginBottom: '16px' }}>
            <Link href="/office/docs" style={{ fontWeight: '600', color: '#111', textDecoration: 'none' }}>?? Home</Link>
          </div>
          
          {Object.entries(categories).map(([cat, catPages]) => (
            <div key={cat} style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', marginBottom: '8px' }}>
                {cat}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {catPages?.map(p => (
                  <li key={p.slug} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link href={`/office/docs/${p.slug}`} style={{ color: '#374151', textDecoration: 'none', fontSize: '14px', flex: 1 }}>
                      {p.title}
                    </Link>
                    <Link href={`/office/docs/edit/${p.slug}`} style={{ color: '#9ca3af', fontSize: '12px', textDecoration: 'none' }}>
                      ?
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Docs Content */}
      <div style={{ flex: 1, padding: '40px', maxWidth: '800px', margin: '0 auto', overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  );
}
