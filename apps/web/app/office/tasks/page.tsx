'use client';
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@repo/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'dummy';
const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [orgMembers, setOrgMembers] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');

  // Review states
  const [rejectingTaskId, setRejectingTaskId] = useState<string | null>(null);
  const [rejectComment, setRejectComment] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);

    const [tasksRes, profilesRes, orgRes] = await Promise.all([
      supabase.from('tasks').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*'),
      supabase.from('organization_members').select('*')
    ]);
    
    if (tasksRes.data) setTasks(tasksRes.data);
    if (profilesRes.data) setProfiles(profilesRes.data);
    if (orgRes.data) setOrgMembers(orgRes.data);
    
    setLoading(false);
  }

  async function handleCreateTask() {
    if (!newTaskTitle) return;
    const { data, error } = await supabase.from('tasks').insert({
      title: newTaskTitle,
      description: newTaskDescription,
      assignee_id: newTaskAssignee || null,
      status: 'TODO'
    }).select().single();

    if (error) {
      alert('Error creating task: ' + error.message);
    } else if (data) {
      setTasks([data, ...tasks]);
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskAssignee('');
      setShowForm(false);
    }
  }

  async function handleUpdateAssignee(taskId: string, assigneeId: string) {
    const { error } = await supabase.from('tasks').update({ assignee_id: assigneeId || null }).eq('id', taskId);
    if (error) {
      alert('Error updating assignee: ' + error.message);
    } else {
      setTasks(tasks.map(t => t.id === taskId ? { ...t, assignee_id: assigneeId || null } : t));
    }
  }

  async function handleUpdateStatus(taskId: string, status: string) {
    const updateData: any = { status };
    
    if (status === 'REVIEW_REQUESTED') {
      const task = tasks.find(t => t.id === taskId);
      const member = orgMembers.find(m => m.user_id === task?.assignee_id);
      if (member?.supervisor_id) {
        updateData.reviewer_id = member.supervisor_id;
      }
    }

    const { error } = await supabase.from('tasks').update(updateData).eq('id', taskId);
    if (error) {
      alert('Error updating status: ' + error.message);
    } else {
      setTasks(tasks.map(t => t.id === taskId ? { ...t, ...updateData } : t));
    }
  }

  async function handleApprove(taskId: string) {
    const { error } = await supabase.from('tasks').update({ status: 'COMPLETED' }).eq('id', taskId);
    if (error) {
      alert('Error approving task: ' + error.message);
    } else {
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: 'COMPLETED' } : t));
    }
  }

  async function submitReject(taskId: string) {
    const task = tasks.find(t => t.id === taskId);
    const newDescription = rejectComment ? `[REJECTED: ${rejectComment}]\n\n${task?.description || ''}` : task?.description;
    
    const { error } = await supabase.from('tasks').update({ 
      status: 'REJECTED',
      description: newDescription
    }).eq('id', taskId);

    if (error) {
      alert('Error rejecting task: ' + error.message);
    } else {
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: 'REJECTED', description: newDescription } : t));
      setRejectingTaskId(null);
      setRejectComment('');
    }
  }

  const getStatusColor = (status: string) => {
    if (status === 'COMPLETED') return '#16a34a';
    if (status === 'IN_PROGRESS') return '#2563eb';
    if (status === 'REVIEW_REQUESTED') return '#9333ea';
    if (status === 'REJECTED') return '#dc2626';
    return '#ea580c';
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading tasks...</div>;

  const mySubordinateIds = orgMembers.filter(m => m.supervisor_id === currentUser?.id).map(m => m.user_id);
  const tasksToReview = tasks.filter(t => 
    t.status === 'REVIEW_REQUESTED' && 
    (t.reviewer_id === currentUser?.id || mySubordinateIds.includes(t.assignee_id))
  );

  return (
    <div style={{ color: '#111' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Task Management</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {showForm ? 'Cancel' : '+ Assign New Task'}
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', marginTop: '20px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Create New Task</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
            <input 
              placeholder="Task Title" 
              value={newTaskTitle} 
              onChange={e => setNewTaskTitle(e.target.value)} 
              style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
            />
            <textarea 
              placeholder="Task Description" 
              value={newTaskDescription} 
              onChange={e => setNewTaskDescription(e.target.value)} 
              style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', minHeight: '80px' }}
            />
            <select 
              value={newTaskAssignee} 
              onChange={e => setNewTaskAssignee(e.target.value)}
              style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
            >
              <option value="">Unassigned</option>
              {profiles.map(p => (
                <option key={p.id} value={p.id}>
                  {(p.first_name || '') + ' ' + (p.last_name || '') || 'Unknown User'}
                </option>
              ))}
            </select>
          </div>
          <button onClick={handleCreateTask} style={{ padding: '8px 16px', background: '#16a34a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Save Task
          </button>
        </div>
      )}

      {tasksToReview.length > 0 && (
        <div style={{ background: '#f3e8ff', padding: '20px', borderRadius: '8px', marginTop: '20px', border: '1px solid #d8b4fe' }}>
          <h2 style={{ marginTop: 0, color: '#6b21a8' }}>Review Requested Tasks</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tasksToReview.map(task => {
              const assignee = profiles.find(p => p.id === task.assignee_id);
              const assigneeName = assignee ? `${assignee.first_name || ''} ${assignee.last_name || ''}`.trim() : 'Unknown User';
              
              return (
                <div key={task.id} style={{ background: 'white', padding: '16px', borderRadius: '6px', border: '1px solid #e9d5ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0' }}>{task.title}</h4>
                    <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>Requested by: {assigneeName}</p>
                    {task.description && <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#4b5563' }}>{task.description}</p>}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    {rejectingTaskId === task.id ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input 
                          type="text" 
                          placeholder="Reason for rejection..." 
                          value={rejectComment}
                          onChange={(e) => setRejectComment(e.target.value)}
                          style={{ padding: '6px 12px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                        />
                        <button onClick={() => submitReject(task.id)} style={{ padding: '6px 12px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Confirm Reject</button>
                        <button onClick={() => setRejectingTaskId(null)} style={{ padding: '6px 12px', background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                      </div>
                    ) : (
                      <>
                        <button onClick={() => handleApprove(task.id)} style={{ padding: '6px 16px', background: '#16a34a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Approve</button>
                        <button onClick={() => setRejectingTaskId(task.id)} style={{ padding: '6px 16px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Reject</button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <table style={{ width: '100%', marginTop: '30px', background: 'white', borderRadius: '8px', overflow: 'hidden', borderCollapse: 'collapse', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <thead style={{ background: '#f1f5f9', textAlign: 'left' }}>
          <tr>
            <th style={{ padding: '16px' }}>Status</th>
            <th style={{ padding: '16px' }}>Title</th>
            <th style={{ padding: '16px' }}>Assignee</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '16px', verticalAlign: 'top', width: '170px' }}>
                <select 
                  value={task.status} 
                  onChange={(e) => handleUpdateStatus(task.id, e.target.value)}
                  style={{ padding: '6px 8px', background: getStatusColor(task.status), color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', width: '100%' }}
                >
                  <option value="TODO">TODO</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="REVIEW_REQUESTED">REVIEW REQUESTED</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </td>
              <td style={{ padding: '16px', verticalAlign: 'top' }}>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>{task.title}</div>
                {task.description && <div style={{ fontSize: '14px', color: '#64748b', whiteSpace: 'pre-wrap' }}>{task.description}</div>}
              </td>
              <td style={{ padding: '16px', verticalAlign: 'top', width: '200px' }}>
                <select 
                  value={task.assignee_id || ''} 
                  onChange={(e) => handleUpdateAssignee(task.id, e.target.value)}
                  style={{ padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', width: '100%' }}
                >
                  <option value="">Unassigned</option>
                  {profiles.map(p => (
                    <option key={p.id} value={p.id}>
                      {((p.first_name || '') + ' ' + (p.last_name || '')).trim() || 'Unknown User'}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
          {tasks.length === 0 && (
            <tr>
              <td colSpan={3} style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>No tasks found. Create one above!</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
