'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@repo/supabase';

export default function GuidesCMSPage() {
  const [guides, setGuides] = useState<any[]>([]);
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'dummy';
  const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    const { data, error } = await supabase
      .from('guides')
      .select('*, guide_versions(*)');
      
    if (data) {
      setGuides(data);
    }
  };

  return (
    <div style={{ color: '#111' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Guide CMS</h1>
        <Link href="/office/guides/new">
          <button style={{ padding: '10px 20px', background: 'blue', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            + Create New Guide
          </button>
        </Link>
      </div>

      <table style={{ width: '100%', marginTop: '30px', background: 'white', borderRadius: '8px', overflow: 'hidden', borderCollapse: 'collapse' }}>
        <thead style={{ background: '#eee', textAlign: 'left' }}>
          <tr>
            <th style={{ padding: '12px' }}>Status</th>
            <th style={{ padding: '12px' }}>Title</th>
            <th style={{ padding: '12px' }}>Price</th>
            <th style={{ padding: '12px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {guides.map(guide => {
            const latestVersion = guide.guide_versions?.sort((a: any, b: any) => b.version_number - a.version_number)[0];
            const title = latestVersion?.title || 'Untitled';
            const price = latestVersion?.price || 0;
            return (
              <tr key={guide.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    background: guide.status === 'PUBLISHED' ? 'green' : 'gray', 
                    color: 'white', 
                    borderRadius: '4px', 
                    fontSize: '12px' 
                  }}>
                    {guide.status}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>{title}</td>
                <td style={{ padding: '12px' }}>${price}</td>
                <td style={{ padding: '12px' }}>
                  <Link href={`/office/guides/${guide.id}/edit`} style={{ marginRight: '10px', color: 'blue' }}>Edit</Link>
                  <Link href={`/office/guides/${guide.id}/preview`} style={{ color: 'blue' }}>Preview</Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
