import { createServerClient } from '@repo/supabase';
import Link from 'next/link';

export default async function ArtifactsIndex() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'dummy';
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey);
  
  const { data: artifacts } = await supabase.from('documentation_pages').select('id, title, slug, category').eq('category', 'Artifact').order('title');

  return (
    <div style={{ fontFamily: 'sans-serif', lineHeight: 1.6, color: '#333' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>Company Artifacts</h1>
        <Link href="/office/docs/new?category=Artifact" style={{ padding: '8px 16px', background: '#c084fc', color: '#fff', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }}>+ New Artifact</Link>
      </div>
      
      <p>Welcome to the Company Artifacts portal. Here you can find assets, branding materials, and other company-wide resources.</p>
      
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px' }}>Available Artifacts</h2>
      {(!artifacts || artifacts.length === 0) ? (
        <p style={{ color: '#888' }}>No artifacts found. Click the button above to create one.</p>
      ) : (
        <ul style={{ paddingLeft: '20px' }}>
          {artifacts.map((doc: any) => (
            <li key={doc.id} style={{ marginBottom: '8px' }}>
              <Link href={`/office/docs/${doc.slug}`} style={{ color: '#2563eb', fontWeight: 'bold', textDecoration: 'none' }}>{doc.title}</Link>
              <Link href={`/office/docs/edit/${doc.slug}`} style={{ marginLeft: '10px', color: '#888', fontSize: '12px', textDecoration: 'underline' }}>Edit</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
