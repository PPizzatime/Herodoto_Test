export default function DocsDb() {
  return (
    <div style={{ fontFamily: 'sans-serif', lineHeight: 1.6, color: '#333' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>Database Architecture</h1>
      
      <p>Herodoto uses <strong>Supabase (PostgreSQL)</strong> as its backend-as-a-service. It handles user authentication, data storage, and real-time syncing.</p>

      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px' }}>Authentication</h2>
      <p>Users are authenticated via Supabase Auth (GoTrue). When a user logs in, Supabase issues a JWT. We use <strong>Row Level Security (RLS)</strong> policies in PostgreSQL to restrict what data each user can see based on their JWT claims.</p>

      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px' }}>Key Tables</h2>
      <ul style={{ marginBottom: '24px' }}>
        <li><strong>Users (Managed by Supabase Auth):</strong> Stores email and password hashes.</li>
        <li><strong>Profiles:</strong> Extends the User table with custom metadata (e.g., points, level, role: consumer/employee/admin).</li>
        <li><strong>Guides/Tours:</strong> Content for the map and audio guides.</li>
        <li><strong>Subscriptions:</strong> Tracks user payment tiers (Free, Premium).</li>
      </ul>

      <p>For how the database connects to the code, see the <a href="/office/docs/tech-stack" style={{ color: '#2563eb' }}>Tech Stack</a>.</p>
    </div>
  );
}
