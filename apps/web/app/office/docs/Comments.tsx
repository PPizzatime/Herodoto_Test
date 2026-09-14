'use client';
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@repo/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'dummy';
const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

export default function Comments({ pageId }: { pageId: string }) {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');

  useEffect(() => {
    loadComments();
    loadUsers();

    // Subscribe to new comments
    const channel = supabase.channel('realtime-comments')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'comments', filter: `page_id=eq.${pageId}` }, (payload) => {
        loadComments();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [pageId]);

  async function loadComments() {
    const { data } = await supabase
      .from('comments')
      .select('*, author:profiles(first_name, last_name, avatar_url)')
      .eq('page_id', pageId)
      .order('created_at', { ascending: true });
    if (data) setComments(data);
  }

  async function loadUsers() {
    const { data } = await supabase.from('profiles').select('id, first_name, last_name');
    if (data) setUsers(data);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNewComment(val);

    // Simple mention trigger logic (looks for @word at the end)
    const match = val.match(/@(\w*)$/);
    if (match) {
      setShowMentions(true);
      setMentionQuery(match[1].toLowerCase());
    } else {
      setShowMentions(false);
    }
  };

  const insertMention = (user: any) => {
    const replacement = `@${user.first_name} `;
    const newText = newComment.replace(/@\w*$/, replacement);
    setNewComment(newText);
    setShowMentions(false);
  };

  const submitComment = async () => {
    if (!newComment.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Insert comment
    await supabase.from('comments').insert({
      page_id: pageId,
      author_id: user.id,
      content: newComment
    });

    // 2. Parse Mentions and create Notifications
    const mentionedNames = newComment.match(/@(\w+)/g)?.map(m => m.substring(1)) || [];
    for (const name of mentionedNames) {
      const taggedUser = users.find(u => u.first_name?.toLowerCase() === name.toLowerCase());
      if (taggedUser) {
        await supabase.from('notifications').insert({
          user_id: taggedUser.id,
          actor_id: user.id,
          message: `mentioned you in a comment on ${pageId}`,
          link: `/office/docs/${pageId}`
        });
      }
    }

    setNewComment('');
  };

  const filteredUsers = users.filter(u => u.first_name?.toLowerCase().includes(mentionQuery));

  return (
    <div style={{ marginTop: '40px', borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
      <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Discussions</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
        {comments.length === 0 ? <p style={{ color: '#6b7280' }}>No comments yet. Start the conversation!</p> : null}
        {comments.map(c => (
          <div key={c.id} style={{ display: 'flex', gap: '12px', backgroundColor: '#f9fafb', padding: '12px', borderRadius: '8px' }}>
            {c.author?.avatar_url ? (
              <img src={c.author.avatar_url} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#d1d5db' }} />
            )}
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{c.author?.first_name || 'Unknown User'}</div>
              <div style={{ fontSize: '15px', marginTop: '4px' }}>{c.content}</div>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>{new Date(c.created_at).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ position: 'relative' }}>
        <textarea
          value={newComment}
          onChange={handleInputChange}
          placeholder="Write a comment... (Type @ to tag someone)"
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', minHeight: '80px', fontFamily: 'inherit' }}
        />
        
        {showMentions && filteredUsers.length > 0 && (
          <div style={{ position: 'absolute', bottom: '100%', left: 0, backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', zIndex: 10, maxHeight: '150px', overflowY: 'auto', width: '200px', marginBottom: '8px' }}>
            {filteredUsers.map(u => (
              <div 
                key={u.id} 
                onClick={() => insertMention(u)}
                style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid #f3f4f6' }}
              >
                {u.first_name} {u.last_name}
              </div>
            ))}
          </div>
        )}

        <button 
          onClick={submitComment}
          style={{ marginTop: '8px', backgroundColor: 'black', color: 'white', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', border: 'none' }}
        >
          Post Comment
        </button>
      </div>
    </div>
  );
}
