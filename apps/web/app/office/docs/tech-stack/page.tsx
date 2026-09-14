import Comments from '../Comments';

export default function DocsTech() {
  return (
    <div style={{ fontFamily: 'sans-serif', lineHeight: 1.6, color: '#333' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>Technology Stack</h1>
      
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px' }}>Frameworks</h2>
      <ul>
        <li><strong>Turborepo:</strong> High-performance build system for our monorepo. It manages dependencies and scripts across all our apps.</li>
        <li><strong>Next.js 14 (App Router):</strong> React framework used for the Office Portal (<code>apps/web</code>). Used for its robust routing and server components.</li>
        <li><strong>Expo / React Native:</strong> Used for the Consumer App (<code>apps/mobile</code>). Allows us to write code once and deploy it to iOS, Android, and the Web simultaneously.</li>
      </ul>

      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px' }}>Libraries</h2>
      <ul>
        <li><strong>Supabase JS:</strong> Client SDK for connecting to our PostgreSQL database. Shared between both apps in <code>packages/supabase</code>.</li>
        <li><strong>Lucide React Native:</strong> Icon library used in the mobile app for a consistent look.</li>
        <li><strong>Expo Router:</strong> File-based routing for React Native, bringing web-like navigation to the mobile app.</li>
      </ul>
      <Comments pageId="tech-stack" />
    </div>
  );
}

