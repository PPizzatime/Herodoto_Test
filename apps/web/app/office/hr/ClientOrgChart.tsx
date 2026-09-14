"use client";

import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@repo/supabase';

export default function ClientOrgChart({ initialMembers, roles }: { initialMembers: any[], roles: any[] }) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || ''
  );
  
  const [members, setMembers] = useState<any[]>(initialMembers);
  const [editingMember, setEditingMember] = useState<any | null>(null);

  const handleSave = async (memberId: string, newSupervisorId: string | null, newRoleId: string) => {
    const { error } = await supabase
      .from('organization_members')
      .update({ supervisor_id: newSupervisorId, role_id: newRoleId })
      .eq('id', memberId);
      
    if (!error) {
      setMembers(members.map(m => m.id === memberId ? { ...m, supervisor_id: newSupervisorId, role_id: newRoleId } : m));
      setEditingMember(null);
    } else {
      alert("Error saving: " + error.message);
    }
  };

  const getRoleName = (roleId: string) => roles.find(r => r.id === roleId)?.name || 'Unknown';
  const getSupervisorName = (supervisorId: string | null) => {
    if (!supervisorId) return 'None (Top Level)';
    const sup = members.find(m => m.user_id === supervisorId);
    return sup ? `${sup.profiles?.first_name} ${sup.profiles?.last_name}` : 'Unknown';
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Organization Chart</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {members.map(member => (
          <div key={member.id} style={{ border: '1px solid #ddd', padding: '16px', borderRadius: '8px', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontWeight: 'bold', fontSize: '18px' }}>{member.profiles?.first_name} {member.profiles?.last_name}</h3>
                <p style={{ color: '#666', fontSize: '14px' }}>Role: {getRoleName(member.role_id)}</p>
                <p style={{ color: '#666', fontSize: '14px' }}>Reports to: {getSupervisorName(member.supervisor_id)}</p>
              </div>
              <button 
                onClick={() => setEditingMember(editingMember?.id === member.id ? null : member)}
                style={{ padding: '8px 16px', border: '1px solid #ccc', borderRadius: '4px', background: '#f9f9f9', cursor: 'pointer' }}
              >
                Edit
              </button>
            </div>
            
            {editingMember?.id === member.id && (
              <div style={{ marginTop: '16px', padding: '16px', background: '#f0f4f8', borderRadius: '4px' }}>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Supervisor</label>
                  <select 
                    value={editingMember.supervisor_id || ''} 
                    onChange={e => setEditingMember({...editingMember, supervisor_id: e.target.value || null})}
                    style={{ padding: '8px', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }}
                  >
                    <option value="">None (Top Level)</option>
                    {members.filter(m => m.id !== member.id).map(m => (
                      <option key={m.user_id} value={m.user_id}>{m.profiles?.first_name} {m.profiles?.last_name}</option>
                    ))}
                  </select>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Role</label>
                  <select 
                    value={editingMember.role_id} 
                    onChange={e => setEditingMember({...editingMember, role_id: e.target.value})}
                    style={{ padding: '8px', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }}
                  >
                    {roles.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <button 
                  onClick={() => handleSave(member.id, editingMember.supervisor_id, editingMember.role_id)}
                  style={{ padding: '8px 16px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
