import MarkdownEditor from '../../../../../components/MarkdownEditor';
import { createServerClient } from '@repo/supabase';
import { notFound } from 'next/navigation';

export default async function EditDocPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = await params;
  const currentSlug = resolvedParams.slug;
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'dummy';
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey);
  
  const { data: page } = await supabase.from('documentation_pages').select('*').eq('slug', currentSlug).single();

  if (!page) {
    notFound();
  }

  return <MarkdownEditor initialData={page} />;
}
