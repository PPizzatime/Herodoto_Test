import Comments from '../Comments';

export default function DocsReqs() {
  return (
    <div style={{ fontFamily: 'sans-serif', lineHeight: 1.6, color: '#333' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>Requirements Status</h1>
      
      <p>This artifact tracks the completion status of the major platform requirements requested during development.</p>

      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px' }}>? Fulfilled Requirements</h2>
      <ul style={{ marginBottom: '24px' }}>
        <li><strong>Monorepo Setup:</strong> Establish a Turborepo foundation with shared packages.</li>
        <li><strong>Dual Environments:</strong> Create an Office (Next.js) and Consumer (Expo) environment.</li>
        <li><strong>Cross-Platform Capability:</strong> The Consumer app must be fully functional on both Mobile and Web.</li>
        <li><strong>Unified Hosting (Netlify):</strong> Both environments must be accessible from a single domain without creating two separate sites.</li>
        <li><strong>Single Login Flow:</strong> Prevent duplicate login pages. All users authenticate through the Consumer login screen.</li>
        <li><strong>Role-based Routing:</strong> Automatically reveal the "Enter Office" portal button ONLY for authenticated employees/admins.</li>
        <li><strong>Internal Documentation:</strong> Provide a documentation hub for workers (this site).</li>
      </ul>

      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px' }}>?? Pending Requirements</h2>
      <ul style={{ marginBottom: '24px' }}>
        <li><strong>Strict RLS Security Audit:</strong> Review and tighten Supabase Row Level Security policies before MVP launch.</li>
        <li><strong>Consumer Map Implementation:</strong> Integrate Mapbox or Google Maps fully into the Expo Map tab.</li>
        <li><strong>Office CMS:</strong> Complete the Data management tables in the Office Portal (Tours, Guides, Users).</li>
        <li><strong>Gamification Backend:</strong> Connect the Level/Points UI in the Profile tab to real Supabase database columns.</li>
      </ul>
      <Comments pageId="requirements" />
    </div>
  );
}


