export default function GuideBuilderPage({ params }: { params: { id: string } }) {
  return (
    <div style={{ color: '#111' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Guide Builder - #{params.id}</h1>
        <div>
          <button style={{ padding: '8px 16px', background: '#ccc', marginRight: '10px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>Save Draft</button>
          <button style={{ padding: '8px 16px', background: 'green', color: 'white', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>Publish</button>
          <button style={{ padding: '8px 16px', background: 'red', color: 'white', borderRadius: '4px', border: 'none', cursor: 'pointer', marginLeft: '10px' }}>Erase</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px', marginTop: '30px' }}>
        {/* Component Palette */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
          <h3>Add Component</h3>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '15px' }}>
            <li style={{ padding: '10px', background: '#eee', marginBottom: '8px', cursor: 'grab', borderRadius: '4px' }}>TEXT</li>
            <li style={{ padding: '10px', background: '#eee', marginBottom: '8px', cursor: 'grab', borderRadius: '4px' }}>IMAGE</li>
            <li style={{ padding: '10px', background: '#eee', marginBottom: '8px', cursor: 'grab', borderRadius: '4px' }}>PLAY AUDIO</li>
            <li style={{ padding: '10px', background: '#eee', marginBottom: '8px', cursor: 'grab', borderRadius: '4px' }}>BUTTON</li>
          </ul>
        </div>

        {/* Builder Canvas */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', minHeight: '500px' }}>
          <h3>Layout (JSON Array Representation)</h3>
          <pre style={{ background: '#f8f8f8', padding: '15px', borderRadius: '4px', marginTop: '15px', overflowX: 'auto' }}>
{`[
  { "type": "IMAGE", "url": "..." },
  { "type": "TEXT", "text": "..." },
  { "type": "PLAY_AUDIO", "url": "..." }
]`}
          </pre>
          <p style={{ color: '#666', marginTop: '20px' }}>Drag and drop components from the palette to construct the guide structure.</p>
        </div>
      </div>
    </div>
  );
}

