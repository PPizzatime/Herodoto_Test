import Link from 'next/link';

export default function GuidePreviewPage({ params }: { params: { id: string } }) {
  return (
    <div style={{ color: '#111' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Guide Preview - #{params.id}</h1>
        <Link href={`/office/guides/${params.id}/edit`} style={{ padding: '8px 16px', background: 'blue', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>Back to Builder</Link>
      </div>

      <div style={{ display: 'flex', gap: '40px', marginTop: '30px', justifyContent: 'center' }}>
        {/* Mobile Preview */}
        <div>
          <h3 style={{ textAlign: 'center', marginBottom: '15px' }}>Mobile</h3>
          <div style={{ width: '375px', height: '812px', border: '12px solid black', borderRadius: '40px', overflow: 'hidden', background: 'white', position: 'relative' }}>
             <div style={{ padding: '20px', textAlign: 'center' }}>
                {/* Simulating mobile renderer */}
                <div style={{ width: '100%', height: '200px', background: '#eee', marginBottom: '20px' }}>[Image Placeholder]</div>
                <p>[Text Placeholder] Welcome to the guide.</p>
                <button style={{ padding: '10px 20px', marginTop: '20px' }}>[Play Audio Placeholder]</button>
             </div>
          </div>
        </div>

        {/* Desktop Preview */}
        <div>
          <h3 style={{ textAlign: 'center', marginBottom: '15px' }}>Desktop / Web</h3>
          <div style={{ width: '800px', height: '600px', border: '4px solid #ccc', borderRadius: '8px', overflow: 'hidden', background: 'white', display: 'flex' }}>
             {/* Simulating desktop renderer (split view) */}
             <div style={{ flex: 1, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>[Large Image]</div>
             <div style={{ flex: 1, padding: '30px' }}>
                <h2>Guide Title</h2>
                <p style={{ marginTop: '20px' }}>[Text Placeholder] Welcome to the guide.</p>
                <button style={{ padding: '10px 20px', marginTop: '20px' }}>[Play Audio Placeholder]</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

