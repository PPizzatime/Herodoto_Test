import Link from 'next/link';

export default function GuidesCMSPage() {
  return (
    <div style={{ color: '#111' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Guide CMS</h1>
        <button style={{ padding: '10px 20px', background: 'blue', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+ Create New Guide</button>
      </div>

      <table style={{ width: '100%', marginTop: '30px', background: 'white', borderRadius: '8px', overflow: 'hidden', borderCollapse: 'collapse' }}>
        <thead style={{ background: '#eee', textAlign: 'left' }}>
          <tr>
            <th style={{ padding: '12px' }}>Status</th>
            <th style={{ padding: '12px' }}>Title</th>
            <th style={{ padding: '12px' }}>Organization</th>
            <th style={{ padding: '12px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '12px' }}><span style={{ padding: '4px 8px', background: 'green', color: 'white', borderRadius: '4px', fontSize: '12px' }}>PUBLISHED</span></td>
            <td style={{ padding: '12px' }}>Trevi Fountain</td>
            <td style={{ padding: '12px' }}>Default Org</td>
            <td style={{ padding: '12px' }}>
              <Link href="/office/guides/1/edit" style={{ marginRight: '10px', color: 'blue' }}>Edit</Link>
              <Link href="/office/guides/1/preview" style={{ color: 'blue' }}>Preview</Link>
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '12px' }}><span style={{ padding: '4px 8px', background: 'gray', color: 'white', borderRadius: '4px', fontSize: '12px' }}>DRAFT</span></td>
            <td style={{ padding: '12px' }}>Geological Reserve</td>
            <td style={{ padding: '12px' }}>Default Org</td>
            <td style={{ padding: '12px' }}>
              <Link href="/office/guides/2/edit" style={{ marginRight: '10px', color: 'blue' }}>Edit</Link>
              <Link href="/office/guides/2/preview" style={{ color: 'blue' }}>Preview</Link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}


