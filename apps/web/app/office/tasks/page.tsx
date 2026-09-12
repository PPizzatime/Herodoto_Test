export default function TasksPage() {
  return (
    <div style={{ color: '#111' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Task Management</h1>
        <button style={{ padding: '10px 20px', background: 'blue', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+ Assign New Task</button>
      </div>

      <table style={{ width: '100%', marginTop: '30px', background: 'white', borderRadius: '8px', overflow: 'hidden', borderCollapse: 'collapse' }}>
        <thead style={{ background: '#eee', textAlign: 'left' }}>
          <tr>
            <th style={{ padding: '12px' }}>Status</th>
            <th style={{ padding: '12px' }}>Priority</th>
            <th style={{ padding: '12px' }}>Title</th>
            <th style={{ padding: '12px' }}>Assignee</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '12px' }}><span style={{ padding: '4px 8px', background: 'orange', color: 'white', borderRadius: '4px', fontSize: '12px' }}>TODO</span></td>
            <td style={{ padding: '12px' }}>High</td>
            <td style={{ padding: '12px' }}>Review new Trevi Fountain audio</td>
            <td style={{ padding: '12px' }}>Worker 5</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '12px' }}><span style={{ padding: '4px 8px', background: 'green', color: 'white', borderRadius: '4px', fontSize: '12px' }}>COMPLETED</span></td>
            <td style={{ padding: '12px' }}>Medium</td>
            <td style={{ padding: '12px' }}>Write copy for National Museum</td>
            <td style={{ padding: '12px' }}>Manager 10</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

