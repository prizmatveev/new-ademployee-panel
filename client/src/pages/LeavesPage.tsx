import { useState } from 'react'
import { Plus, CheckCircle, XCircle, Clock } from 'lucide-react'
import { format, addDays } from 'date-fns'
import styles from './LeavesPage.module.css'

const LEAVES = [
  { id: 1, name: 'Anita Karmacharya', type: 'Sick Leave',    from: '2025-06-16', to: '2025-06-20', days: 5, reason: 'Medical treatment',    status: 'approved' },
  { id: 2, name: 'Ramesh Basnet',     type: 'Annual Leave',  from: '2025-06-25', to: '2025-06-28', days: 4, reason: 'Family vacation',       status: 'pending' },
  { id: 3, name: 'Dipak Shrestha',    type: 'Casual Leave',  from: '2025-06-22', to: '2025-06-22', days: 1, reason: 'Personal work',         status: 'pending' },
  { id: 4, name: 'Kamala Adhikari',   type: 'Maternity',     from: '2025-07-01', to: '2025-09-30', days: 90, reason: 'Maternity leave',      status: 'approved' },
  { id: 5, name: 'Sita Gurung',       type: 'Sick Leave',    from: '2025-06-10', to: '2025-06-11', days: 2, reason: 'Fever',                status: 'rejected' },
]

const LEAVE_TYPES = ['Annual Leave', 'Sick Leave', 'Casual Leave', 'Maternity', 'Paternity']

export default function LeavesPage() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="fade-in">
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Leave Management</h1>
          <p className="text-secondary text-sm">Manage and track leave requests</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={15} /> Apply Leave
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid-4 mb-6">
        {[
          { label: 'Total Requests', value: LEAVES.length, badge: 'badge-muted' },
          { label: 'Pending',   value: LEAVES.filter(l => l.status === 'pending').length,   badge: 'badge-warning' },
          { label: 'Approved',  value: LEAVES.filter(l => l.status === 'approved').length,  badge: 'badge-success' },
          { label: 'Rejected',  value: LEAVES.filter(l => l.status === 'rejected').length,  badge: 'badge-danger' },
        ].map(s => (
          <div key={s.label} className="card-sm flex items-center justify-between">
            <div>
              <div className="text-muted text-xs mb-1">{s.label}</div>
              <div className="font-bold" style={{ fontSize: '1.5rem' }}>{s.value}</div>
            </div>
            <span className={`badge ${s.badge}`} style={{ fontSize: '1rem', padding: '0.3rem 0.7rem' }}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Requests table */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
          <h3 className="font-semibold">Leave Requests</h3>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {LEAVES.map(leave => (
                <tr key={leave.id}>
                  <td className="font-medium text-sm">{leave.name}</td>
                  <td><span className="badge badge-muted">{leave.type}</span></td>
                  <td className="text-sm text-muted">{leave.from}</td>
                  <td className="text-sm text-muted">{leave.to}</td>
                  <td className="text-sm font-semibold">{leave.days}d</td>
                  <td className="text-sm text-secondary">{leave.reason}</td>
                  <td>
                    <span className={`badge ${
                      leave.status === 'approved' ? 'badge-success' :
                      leave.status === 'pending'  ? 'badge-warning' : 'badge-danger'
                    }`}>
                      {leave.status === 'approved' ? '✓ Approved' :
                       leave.status === 'pending'  ? '○ Pending'  : '✕ Rejected'}
                    </span>
                  </td>
                  <td>
                    {leave.status === 'pending' && (
                      <div className="flex gap-1">
                        <button className="btn btn-ghost btn-icon btn-sm" title="Approve" style={{ color: 'var(--color-success)' }}>
                          <CheckCircle size={15} />
                        </button>
                        <button className="btn btn-ghost btn-icon btn-sm" title="Reject" style={{ color: 'var(--color-danger)' }}>
                          <XCircle size={15} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold" style={{ marginBottom: '1.25rem' }}>Apply for Leave</h3>
            <div className="form-group">
              <label className="label">Leave Type</label>
              <select className="input">
                {LEAVE_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="label">From Date</label>
                <input type="date" className="input" />
              </div>
              <div className="form-group">
                <label className="label">To Date</label>
                <input type="date" className="input" />
              </div>
            </div>
            <div className="form-group">
              <label className="label">Reason</label>
              <textarea className="input" rows={3} placeholder="Briefly describe the reason..." />
            </div>
            <div className="flex gap-2" style={{ marginTop: '0.5rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary">Submit Request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
