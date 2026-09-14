import { createServerClient } from '@repo/supabase';
import ClientOrgChart from './ClientOrgChart';

export default async function HRIndex() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'dummy';
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey);
  
  // Fetch organization members and roles
  const { data: members } = await supabase
    .from('organization_members')
    .select('*, profiles(first_name, last_name, avatar_url)')
    .order('level', { ascending: false });
    
  const { data: roles } = await supabase.from('roles').select('*');

  return (
    <div style={{ fontFamily: 'sans-serif', lineHeight: 1.6, color: '#333' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>HR Portal</h1>
      </div>
      
      <p>Welcome to the HR portal. Here you can manage the organization structure and staff assignments.</p>
      
      <ClientOrgChart initialMembers={members || []} roles={roles || []} />
    </div>
  );
}
