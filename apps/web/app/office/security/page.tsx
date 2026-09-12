'use client';

import React, { useState } from 'react';

interface ApprovalRequest {
  id: string;
  requester: string;
  action: string;
  target: string;
  timestamp: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  ipAddress: string;
}

const INITIAL_APPROVALS: ApprovalRequest[] = [
  {
    id: '1',
    requester: 'Jane Doe',
    action: 'DELETE',
    target: 'Guide 42',
    timestamp: '10 minutes ago',
    status: 'PENDING',
  },
  {
    id: '2',
    requester: 'John Smith',
    action: 'PROMOTE_ROLE',
    target: 'User #104 to ADMIN',
    timestamp: '1 hour ago',
    status: 'PENDING',
  },
  {
    id: '3',
    requester: 'Manager 10',
    action: 'PURGE_CACHE',
    target: 'Global Audio CDN',
    timestamp: '3 hours ago',
    status: 'PENDING',
  },
];

const AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2024-03-24 14:32:01',
    actor: 'Jane Doe',
    action: 'REQUEST_DELETE',
    target: 'Guide 42 (Trevi Fountain Tour)',
    status: 'PENDING',
    ipAddress: '192.168.1.45',
  },
  {
    id: 'log-2',
    timestamp: '2024-03-24 13:50:12',
    actor: 'Admin User',
    action: 'UPDATE_SUBSCRIPTION_POLICY',
    target: 'Annual Pro Tier ($99/yr)',
    status: 'SUCCESS',
    ipAddress: '10.0.0.12',
  },
  {
    id: 'log-3',
    timestamp: '2024-03-24 12:15:40',
    actor: 'Worker 5',
    action: 'EXPORT_USER_DATA',
    target: 'Consumer Batch #2024-Q1',
    status: 'SUCCESS',
    ipAddress: '192.168.1.88',
  },
  {
    id: 'log-4',
    timestamp: '2024-03-24 11:42:09',
    actor: 'system-service',
    action: 'ROTATE_API_KEYS',
    target: 'Supabase JWT Secret',
    status: 'SUCCESS',
    ipAddress: '127.0.0.1',
  },
  {
    id: 'log-5',
    timestamp: '2024-03-24 10:05:33',
    actor: 'unknown_client',
    action: 'FAILED_ADMIN_LOGIN',
    target: '/office/security',
    status: 'FAILED',
    ipAddress: '203.0.113.195',
  },
];

export default function SecurityPage() {
  const [approvals, setApprovals] = useState<ApprovalRequest[]>(INITIAL_APPROVALS);

  const handleDecision = (id: string, decision: 'APPROVED' | 'REJECTED') => {
    setApprovals((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: decision } : item))
    );
  };

  return (
    <div style={{ color: '#111' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px' }}>Security & Audit</h1>
          <p style={{ color: '#666', marginTop: '6px' }}>
            System-wide activity logs and consensus authorization workflows.
          </p>
        </div>
      </div>

      {/* Pending Approvals Section */}
      <div style={{ marginTop: '24px', padding: '20px', background: 'white', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '18px', margin: '0 0 16px 0' }}>Pending Approvals</h2>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
          Actions requiring Admin consensus prior to execution.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {approvals.map((req) => (
            <div
              key={req.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                border: '1px solid #eee',
                borderRadius: '6px',
                backgroundColor: req.status === 'PENDING' ? '#fff' : '#fafafa',
              }}
            >
              <div>
                <span style={{ fontWeight: '600' }}>{req.requester}</span>
                <span> requests to </span>
                <span
                  style={{
                    color: req.action.includes('DELETE') ? '#dc2626' : '#2563eb',
                    fontWeight: 'bold',
                  }}
                >
                  {req.action}
                </span>
                <span> {req.target}</span>
                <span style={{ marginLeft: '12px', fontSize: '12px', color: '#888' }}>
                  ({req.timestamp})
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {req.status === 'PENDING' ? (
                  <>
                    <button
                      onClick={() => handleDecision(req.id, 'APPROVED')}
                      style={{
                        padding: '6px 14px',
                        background: '#16a34a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '500',
                      }}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDecision(req.id, 'REJECTED')}
                      style={{
                        padding: '6px 14px',
                        background: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '500',
                      }}
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: req.status === 'APPROVED' ? '#16a34a' : '#dc2626',
                      backgroundColor: req.status === 'APPROVED' ? '#dcfce7' : '#fee2e2',
                    }}
                  >
                    {req.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Logs Table */}
      <div style={{ marginTop: '30px', padding: '20px', background: 'white', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '18px', margin: '0 0 16px 0' }}>Audit Logs</h2>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#eee', textAlign: 'left' }}>
            <tr>
              <th style={{ padding: '12px' }}>Timestamp</th>
              <th style={{ padding: '12px' }}>Actor</th>
              <th style={{ padding: '12px' }}>Action</th>
              <th style={{ padding: '12px' }}>Target</th>
              <th style={{ padding: '12px' }}>Status</th>
              <th style={{ padding: '12px' }}>IP Address</th>
            </tr>
          </thead>
          <tbody>
            {AUDIT_LOGS.map((log) => (
              <tr key={log.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px', fontSize: '14px', color: '#555' }}>
                  {log.timestamp}
                </td>
                <td style={{ padding: '12px', fontWeight: '500' }}>{log.actor}</td>
                <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '13px' }}>
                  {log.action}
                </td>
                <td style={{ padding: '12px' }}>{log.target}</td>
                <td style={{ padding: '12px' }}>
                  <span
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      color: 'white',
                      backgroundColor:
                        log.status === 'SUCCESS'
                          ? '#16a34a'
                          : log.status === 'FAILED'
                          ? '#dc2626'
                          : '#eab308',
                    }}
                  >
                    {log.status}
                  </span>
                </td>
                <td style={{ padding: '12px', fontSize: '13px', color: '#666' }}>
                  {log.ipAddress}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

