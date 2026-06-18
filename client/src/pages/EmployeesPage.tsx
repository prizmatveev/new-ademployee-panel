import { useState } from 'react'
import { Plus, Search, MoreHorizontal, Mail, Phone } from 'lucide-react'
import styles from './EmployeesPage.module.css'

const EMPLOYEES = [
  { id: 'LSM-0001', name: 'Arjun Sharma',      email: 'arjun@localsm.com',   phone: '+977-9801234567', dept: 'Management',  position: 'CEO',              status: 'active',   joined: 'Jan 2023', avatar: 'AS' },
  { id: 'LSM-0002', name: 'Priya Thapa',        email: 'priya@localsm.com',   phone: '+977-9802345678', dept: 'HR',           position: 'HR Manager',       status: 'active',   joined: 'Mar 2023', avatar: 'PT' },
  { id: 'LSM-0003', name: 'Bikash Rai',         email: 'bikash@localsm.com',  phone: '+977-9803456789', dept: 'Engineering',  position: 'Tech Lead',        status: 'active',   joined: 'Feb 2023', avatar: 'BR' },
  { id: 'LSM-0004', name: 'Sita Gurung',        email: 'sita@localsm.com',    phone: '+977-9804567890', dept: 'Engineering',  position: 'Developer',        status: 'active',   joined: 'Jun 2023', avatar: 'SG' },
  { id: 'LSM-0005', name: 'Ramesh Basnet',      email: 'ramesh@localsm.com',  phone: '+977-9805678901', dept: 'Marketing',    position: 'Marketing Head',   status: 'active',   joined: 'Apr 2023', avatar: 'RB' },
  { id: 'LSM-0006', name: 'Anita Karmacharya',  email: 'anita@localsm.com',   phone: '+977-9806789012', dept: 'Finance',      position: 'Accountant',       status: 'on-leave', joined: 'May 2023', avatar: 'AK' },
  { id: 'LSM-0007', name: 'Dipak Shrestha',     email: 'dipak@localsm.com',   phone: '+977-9807890123', dept: 'Engineering',  position: 'Developer',        status: 'active',   joined: 'Aug 2023', avatar: 'DS' },
  { id: 'LSM-0008', name: 'Kamala Adhikari',    email: 'kamala@localsm.com',  phone: '+977-9808901234', dept: 'HR',           position: 'Recruiter',        status: 'inactive', joined: 'Sep 2022', avatar: 'KA' },
]

export default function EmployeesPage() {
  const [search, setSearch] = useState('')
  const [filterDept, setFilterDept] = useState('All')

  const depts = ['All', ...Array.from(new Set(EMPLOYEES.map(e => e.dept)))]

  const filtered = EMPLOYEES.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
                        e.id.toLowerCase().includes(search.toLowerCase())
    const matchDept = filterDept === 'All' || e.dept === filterDept
    return matchSearch && matchDept
  })

  return (
    <div className="fade-in">
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Employees</h1>
          <p className="text-secondary text-sm">{EMPLOYEES.length} total employees</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={15} /> Add Employee
        </button>
      </div>

      {/* Filters */}
      <div className={styles.toolbar}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
          <Search size={14} style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            className="input"
            style={{ paddingLeft: '2.1rem' }}
            placeholder="Search by name or ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.deptTabs}>
          {depts.map(d => (
            <button
              key={d}
              className={`btn ${filterDept === d ? 'btn-primary' : 'btn-ghost'} btn-sm`}
              onClick={() => setFilterDept(d)}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Position</th>
                <th>Contact</th>
                <th>Joined</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(emp => (
                <tr key={emp.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar avatar-sm" style={{ background: 'var(--color-brand-muted)', color: 'var(--color-brand-light)' }}>
                        {emp.avatar}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{emp.name}</div>
                        <div className="text-muted" style={{ fontSize: '11px' }}>{emp.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-muted">{emp.dept}</span>
                  </td>
                  <td className="text-sm text-secondary">{emp.position}</td>
                  <td>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-xs text-muted">
                        <Mail size={11} /> {emp.email}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted">
                        <Phone size={11} /> {emp.phone}
                      </div>
                    </div>
                  </td>
                  <td className="text-sm text-muted">{emp.joined}</td>
                  <td>
                    <span className={`badge ${
                      emp.status === 'active' ? 'badge-success' :
                      emp.status === 'on-leave' ? 'badge-warning' : 'badge-muted'
                    }`}>
                      {emp.status === 'active' ? 'Active' : emp.status === 'on-leave' ? 'On Leave' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-ghost btn-icon btn-sm">
                      <MoreHorizontal size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
