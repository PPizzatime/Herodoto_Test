import Comments from '../Comments';

export default function DocsArch() {
  return (
    <div style={{ fontFamily: 'sans-serif', lineHeight: 1.6, color: '#333' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>System Architecture</h1>
      
      <p>Herodoto is built as a <strong>Monorepo</strong> using Turborepo. This allows us to share code (like database clients and UI components) between completely different applications while keeping them in the same GitHub repository.</p>

      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px' }}>The Two Environments</h2>
      
      <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>1. Consumer App (apps/mobile)</h3>
        <p>Built with <strong>Expo (React Native)</strong>. This is the main product that tourists and consumers use to view maps, explore guides, and track their gamification points. Even though it is a mobile app, we compile it for the Web so it can be accessed directly from a browser without installing anything.</p>
      </div>

      <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>2. Office Portal (apps/web)</h3>
        <p>Built with <strong>Next.js (React)</strong>. This is the secure internal dashboard used by Employees, Managers, and Admins to manage tours, view audit logs, manage subscriptions, and oversee the platform.</p>
      </div>

      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px' }}>Unified Web Routing</h2>
      <p>To provide a seamless experience, both environments are hosted on a single Netlify domain (<code>herodoto.art</code>). When a user visits the site:</p>
      <ul>
        <li>The server instantly redirects them to the <code>/app</code> directory.</li>
        <li>The <code>/app</code> directory serves the compiled Expo Mobile App statically.</li>
        <li>If an employee logs in through the Mobile App, their profile shows an "Enter Office" button.</li>
        <li>Clicking the button sends them to <code>/office</code>, which is intercepted and rendered by the Next.js Office Portal engine.</li>
      </ul>
      <p>For more details on how these are built and hosted, see the <a href="/office/docs/deployment" style={{ color: '#2563eb' }}>Deployment Guide</a>.</p>
      <Comments pageId="architecture" />
    </div>
  );
}


