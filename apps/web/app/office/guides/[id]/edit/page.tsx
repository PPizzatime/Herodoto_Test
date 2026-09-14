import GuideMarkdownEditor from '../../../../../components/GuideMarkdownEditor';
import { createServerClient } from '@repo/supabase';
import { notFound } from 'next/navigation';

export default async function GuideBuilderPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = await params;
  const currentId = resolvedParams.id;
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'dummy';
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey);
  
  // Try to find the existing version for this guide id (assuming guide_id = id for now or getting the latest)
  const { data: page } = await supabase.from('guide_versions').select('*').eq('guide_id', currentId).order('version_number', { ascending: false }).limit(1).maybeSingle();

  return <GuideMarkdownEditor initialData={page} guideId={currentId} />;
}
