import Comments from './Comments';

export default function DocsIndex() {
  return (
    <div style={{ fontFamily: 'sans-serif', lineHeight: 1.6, color: '#333' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>Herodoto Internal Documentation</h1>
      <p>Welcome to the internal documentation portal for Herodoto workers.</p>
      <p>This portal contains the complete technical overview of the Herodoto platform, designed to help employees, managers, and admins understand how the system is built, deployed, and maintained.</p>
      
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px' }}>Index</h2>
      <ul>
        <li><a href="/office/docs/architecture" style={{ color: '#2563eb' }}>Architecture</a> - High-level overview of the monorepo, web, and mobile environments.</li>
        <li><a href="/office/docs/database" style={{ color: '#2563eb' }}>Database</a> - Supabase PostgreSQL schema, RLS policies, and data models.</li>
        <li><a href="/office/docs/tech-stack" style={{ color: '#2563eb' }}>Tech Stack</a> - Frameworks and tools used (Next.js, Expo, Turborepo, etc).</li>
        <li><a href="/office/docs/deployment" style={{ color: '#2563eb' }}>Deployment Guide</a> - How to push updates and manage the Netlify CI/CD pipeline.</li>
        <li><a href="/office/docs/requirements" style={{ color: '#2563eb' }}>Requirements Status</a> - Checklist of fulfilled and pending features.</li>
      </ul>

      <div style={{ marginTop: '40px' }}>
        <Comments pageId="home" />
      </div>
    </div>
  );
}
