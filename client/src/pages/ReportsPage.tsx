import { Download, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import styles from './ReportsPage.module.css'

const DEPT_DATA = [
  { dept: 'Engineering', present: 8, absent: 0, late: 1, hours: '62h', rate: 100 },
  { dept: 'HR',          present: 3, absent: 1, late: 0, hours: '22h', rate: 75 },
  { dept: 'Management',  present: 3, absent: 0, late: 0, hours: '24h', rate: 100 },
  { dept: 'Marketing',   present: 4, absent: 1, late: 2, hours: '30h', rate: 80 },
  { dept: 'Finance',     present: 3, absent: 1, late: 1, hours: '21h', rate: 75 },
]

const MONTHLY = [
  { month: 'Jan', rate: 94 }, { month: 'Feb', rate: 96 }, { month: 'Mar', rate: 91 },
  { month: 'Apr', rate: 98 }, { month: 'May', rate: 95 }, { month: 'Jun', rate: 93 },
]

const LATE_ARRIVALS = [
  { name: 'Sita Gurung',    count: 5, trend: 'up' },
  { name: 'Dipak Shrestha', count: 3, trend: 'neutral' },
  { name: 'Ramesh Basnet',  count: 2, trend: 'down' },
  { name: 'Kamala Adhikari',count: 1, trend: 'down' },
]

export default function ReportsPage() {
  const maxRate = Math.max(...MONTHLY.map(m => m.rate))

  return (
    <div className="fade-in">
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Reports & Analytics</h1>
          <p className="text-secondary text-sm">Attendance and workforce analytics</p>
        </div>
        <button className="btn btn-secondary"><Download size={14} /> Export CSV</button>
      </div>

      {/* Summary KPI */}
      <div className="grid-4 mb-6">
        {[
          { label: 'Avg Attendance Rate', value: '92%',  sub: '+2% vs last month', color: 'var(--color-success)' },
          { label: 'Total Hours Logged',  value: '1,248h', sub: 'This month',       color: 'var(--color-brand-light)' },
          { label: 'Late Arrivals',       value: '11',   sub: 'This month',         color: 'var(--color-warning)' },
          { label: 'Pending Leaves',      value: '2',    sub: 'Awaiting approval',  color: 'var(--color-danger)' },
        ].map(s => (
          <div key={s.label} className="card-sm">
            <div className="text-muted text-xs mb-1">{s.label}</div>
            <div className="font-bold" style={{ fontSize: '1.6rem', color: s.color }}>{s.value}</div>
            <div className="text-muted text-xs mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className={styles.chartsRow}>
        {/* Bar chart - monthly attendance */}
        <div className="card" style={{ flex: 1 }}>
          <h3 className="font-semibold mb-4">Monthly Attendance Rate</h3>
          <div className={styles.barChart}>
            {MONTHLY.map(m => (
              <div key={m.month} className={styles.barItem}>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    style={{ height: `${(m.rate / 100) * 100}%`, opacity: m.rate === maxRate ? 1 : 0.6 }}
                  />
                </div>
                <div className={styles.barLabel}>{m.month}</div>
                <div className={styles.barValue}>{m.rate}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Late arrivals */}
        <div className="card" style={{ width: '260px', flexShrink: 0 }}>
          <h3 className="font-semibold mb-4">Late Arrivals (June)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {LATE_ARRIVALS.map(emp => (
              <div key={emp.name} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="avatar avatar-sm" style={{ background: 'var(--color-brand-muted)', color: 'var(--color-brand-light)', flexShrink: 0 }}>
                  {emp.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="text-sm font-medium">{emp.name}</div>
                  <div className={styles.barMini}>
                    <div className={styles.barMiniFill} style={{ width: `${(emp.count / 5) * 100}%` }} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span className="font-bold text-sm">{emp.count}</span>
                  {emp.trend === 'up' ? <TrendingUp size={12} style={{ color: 'var(--color-danger)' }} /> :
                   emp.trend === 'down' ? <TrendingDown size={12} style={{ color: 'var(--color-success)' }} /> :
                   <Minus size={12} style={{ color: 'var(--text-muted)' }} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department breakdown */}
      <div className="card" style={{ padding: 0, marginTop: '1.25rem' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
          <h3 className="font-semibold">Department-wise Breakdown</h3>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Department</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Late</th>
                <th>Total Hours</th>
                <th>Attendance Rate</th>
              </tr>
            </thead>
            <tbody>
              {DEPT_DATA.map(d => (
                <tr key={d.dept}>
                  <td className="font-medium text-sm">{d.dept}</td>
                  <td><span className="badge badge-success">{d.present}</span></td>
                  <td><span className="badge badge-danger">{d.absent}</span></td>
                  <td><span className="badge badge-warning">{d.late}</span></td>
                  <td className="font-semibold text-sm">{d.hours}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div className={styles.rateBar}>
                        <div className={styles.rateBarFill} style={{
                          width: `${d.rate}%`,
                          background: d.rate >= 90 ? 'var(--color-success)' : d.rate >= 75 ? 'var(--color-warning)' : 'var(--color-danger)'
                        }} />
                      </div>
                      <span className="text-sm font-semibold">{d.rate}%</span>
                    </div>
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
