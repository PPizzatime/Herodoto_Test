export default function DashboardPage() {
  return (
    <div style={{ color: '#111' }}>
      <h1 style={{ color: '#000', fontSize: '32px', marginBottom: '8px' }}>Office Dashboard</h1>
      <p style={{ color: '#444', marginBottom: '24px' }}>Welcome to the Herodoto internal environment.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
        <div style={{ padding: '20px', background: 'white', borderRadius: '8px', border: '1px solid #ddd' }}>
          <h3 style={{ color: '#000', borderBottom: '1px solid #eee', paddingBottom: '8px', marginBottom: '12px' }}>Pending Tasks</h3>
          <ul style={{ color: '#333', lineHeight: '1.6' }}>
            <li>Review new Trevi Fountain audio (High)</li>
            <li>Approve permission request for HR (Medium)</li>
          </ul>
        </div>
        
        <div style={{ padding: '20px', background: 'white', borderRadius: '8px', border: '1px solid #ddd' }}>
          <h3 style={{ color: '#000', borderBottom: '1px solid #eee', paddingBottom: '8px', marginBottom: '12px' }}>Recent Guide Activity</h3>
          <ul style={{ color: '#333', lineHeight: '1.6' }}>
            <li>"National Museum" published by Admin</li>
            <li>"Geological Reserve" moved to PENDING_REVIEW</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

