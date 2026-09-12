'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// Mock org data
const initialEmployees = [
  { id: '1', name: 'Alice Admin', role: 'Admin', managerId: null },
  { id: '2', name: 'Bob Manager', role: 'Manager', managerId: '1' },
  { id: '3', name: 'Charlie Employee', role: 'Employee', managerId: '2' },
  { id: '4', name: 'Diana Employee', role: 'Employee', managerId: '2' },
  { id: '5', name: 'Eve Manager', role: 'Manager', managerId: '1' },
  { id: '6', name: 'Frank Employee', role: 'Employee', managerId: '5' },
];

function OrganizationContent() {
  const searchParams = useSearchParams();
  const [currentUserRole, setCurrentUserRole] = useState('employee'); // Default to lowest privilege

  useEffect(() => {
    // In a real app, this would be a secure database/JWT check.
    // For development, we are picking it up from the URL parameter set by the login page.
    const roleParam = searchParams.get('role');
    if (roleParam) {
      setCurrentUserRole(roleParam.toLowerCase());
    }
  }, [searchParams]);

  const [employees, setEmployees] = useState(initialEmployees);
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

  const handleReassign = (employeeId: string, newManagerId: string) => {
    setEmployees(emps => emps.map(emp => 
      emp.id === employeeId ? { ...emp, managerId: newManagerId } : emp
    ));
    setReassignModalOpen(false);
  };

  const canReassign = currentUserRole === 'admin';

  // Build Tree
  const renderTree = (managerId: string | null = null, depth = 0) => {
    const children = employees.filter(e => e.managerId === managerId);
    if (children.length === 0) return null;

    return (
      <div style={{ marginLeft: depth > 0 ? '40px' : '0px', marginTop: '10px' }}>
        {children.map(emp => (
          <div key={emp.id} style={{ marginBottom: '10px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '12px', 
              background: 'white', 
              border: '1px solid #ddd', 
              borderRadius: '8px',
              width: '400px'
            }}>
              <div>
                <strong>{emp.name}</strong> 
                <span style={{ marginLeft: '8px', color: '#666', fontSize: '14px' }}>({emp.role})</span>
              </div>
              
              {emp.role !== 'Admin' && canReassign && (
                <button 
                  onClick={() => {
                    setSelectedEmployee(emp.id);
                    setReassignModalOpen(true);
                  }}
                  style={{ padding: '6px 12px', background: '#f0fdf4', color: '#16a34a', border: '1px solid #16a34a', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Reassign
                </button>
              )}
            </div>
            {/* Render direct reports recursively */}
            {renderTree(emp.id, depth + 1)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ color: '#111' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Organization Chart</h1>
        <div style={{ padding: '8px 16px', backgroundColor: canReassign ? '#dcfce7' : '#f3f4f6', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold', color: canReassign ? '#166534' : '#4b5563' }}>
          Viewing as: {currentUserRole.toUpperCase()}
        </div>
      </div>
      
      <p style={{ color: '#444', marginBottom: '30px' }}>
        Manage the reporting structure of your organization.
        {!canReassign && (
          <span style={{ display: 'block', color: '#b91c1c', marginTop: '8px', fontWeight: 'bold' }}>
            ⚠ You do not have permission to reassign employees.
          </span>
        )}
      </p>

      {/* The Recursive Org Chart */}
      {renderTree(null, 0)}

      {/* Reassignment Modal */}
      {reassignModalOpen && selectedEmployee && canReassign && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '8px', width: '400px' }}>
            <h2>Reassign Manager</h2>
            <p style={{ margin: '10px 0 20px 0' }}>Select a new manager for {employees.find(e => e.id === selectedEmployee)?.name}</p>
            
            <select 
              id="newManager" 
              style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
              defaultValue=""
            >
              <option value="" disabled>Select Manager...</option>
              {employees.filter(e => e.role !== 'Employee' && e.id !== selectedEmployee).map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
              ))}
            </select>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setReassignModalOpen(false)}
                style={{ padding: '10px 20px', background: '#eee', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  const sel = document.getElementById('newManager') as HTMLSelectElement;
                  if (sel.value) handleReassign(selectedEmployee, sel.value);
                }}
                style={{ padding: '10px 20px', background: 'blue', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export default function OrganizationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrganizationContent />
    </Suspense>
  );
}
