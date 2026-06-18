import { useState } from 'react'
import { Clock, Users, UserCheck, UserX, TrendingUp, Calendar, ArrowUpRight } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useTimer } from '@/hooks/useTimer'
import { format } from 'date-fns'
import styles from './DashboardPage.module.css'

const TEAM_STATUS = [
  { name: 'Arjun Sharma',   code: 'LSM-0001', dept: 'Management',   status: 'in',    time: '09:02 AM', avatar: 'AS' },
  { name: 'Priya Thapa',    code: 'LSM-0002', dept: 'HR',           status: 'in',    time: '08:55 AM', avatar: 'PT' },
  { name: 'Bikash Rai',     code: 'LSM-0003', dept: 'Engineering',  status: 'in',    time: '09:15 AM', avatar: 'BR' },
  { name: 'Sita Gurung',    code: 'LSM-0004', dept: 'Engineering',  status: 'in',    time: '09:08 AM', avatar: 'SG' },
  { name: 'Ramesh Basnet',  code: 'LSM-0005', dept: 'Marketing',    status: 'out',   time: '—',        avatar: 'RB' },
  { name: 'Anita Karmacharya', code: 'LSM-0006', dept: 'Finance',   status: 'leave', time: '—',        avatar: 'AK' },
]

const RECENT_ACTIVITIES = [
  { user: 'Priya Thapa',   action: 'Checked in',           time: '8:55 AM',  icon: '🟢' },
  { user: 'Ramesh Basnet', action: 'Applied for leave',    time: '8:30 AM',  icon: '📋' },
  { user: 'Bikash Rai',    action: 'Checked in',           time: '9:15 AM',  icon: '🟢' },
  { user: 'Anita K.',      action: 'Leave approved',       time: 'Yesterday', icon: '✅' },
  { user: 'Sita Gurung',   action: 'Checked in',           time: '9:08 AM',  icon: '🟢' },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const [checkedIn, setCheckedIn] = useState(false)
  const [checkInTime, setCheckInTime] = useState<Date | null>(null)
  const [onBreak, setOnBreak] = useState(false)
  const { formatted } = useTimer(checkInTime, checkedIn && !onBreak)

  const handleCheckIn = () => {
    setCheckedIn(true)
    setCheckInTime(new Date())
  }

  const handleCheckOut = () => {
    setCheckedIn(false)
    setOnBreak(false)
  }

  const inCount  = TEAM_STATUS.filter(t => t.status === 'in').length
  const outCount = TEAM_STATUS.filter(t => t.status === 'out').length
  const leaveCount = TEAM_STATUS.filter(t => t.status === 'leave').length

  return (
    <div className="fade-in">
      {/* Page header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className="text-secondary text-sm">{format(new Date(), "EEEE, MMMM d, yyyy")}</p>
        </div>
      </div>

      {/* Check-in card + KPI row */}
      <div className={styles.topRow}>
        {/* Check-in card */}
        <div className={styles.checkinCard}>
          <div className={styles.checkinTop}>
            <div>
              <div className={styles.checkinLabel}>
                {checkedIn ? (
                  <><span className={styles.liveDot} />Live Session</>
                ) : 'Your Attendance'}
              </div>
              <div className={styles.checkinTime}>
                {checkedIn ? formatted : format(new Date(), 'h:mm a')}
              </div>
              {checkedIn && checkInTime && (
                <div className="text-muted text-xs" style={{ marginTop: '0.2rem' }}>
                  Checked in at {format(checkInTime, 'h:mm a')}
                </div>
              )}
            </div>
            <div className={styles.checkinIcon}>
              <Clock size={24} />
            </div>
          </div>

          <div className={styles.checkinActions}>
            {!checkedIn ? (
              <button className="btn btn-accent btn-lg" onClick={handleCheckIn} style={{ flex: 1, justifyContent: 'center' }}>
                <Clock size={16} /> Check In
              </button>
            ) : (
              <>
                <button
                  className={`btn ${onBreak ? 'btn-secondary' : 'btn-ghost'}`}
                  onClick={() => setOnBreak(!onBreak)}
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  {onBreak ? '▶ Resume' : '⏸ Break'}
                </button>
                <button className="btn btn-danger" onClick={handleCheckOut} style={{ flex: 1, justifyContent: 'center' }}>
                  Check Out
                </button>
              </>
            )}
          </div>
        </div>

        {/* KPI Cards */}
        <div className={styles.kpiGrid}>
          {[
            { label: 'Present Today',  value: inCount,    icon: UserCheck, color: 'success', change: '+2' },
            { label: 'Absent',         value: outCount,   icon: UserX,     color: 'danger',  change: '-1' },
            { label: 'On Leave',       value: leaveCount, icon: Calendar,  color: 'warning', change: '0' },
            { label: 'Total Staff',    value: 24,         icon: Users,     color: 'brand',   change: '' },
          ].map(kpi => (
            <div key={kpi.label} className={`card-sm ${styles.kpiCard}`}>
              <div className={`${styles.kpiIcon} ${styles[`kpi_${kpi.color}`]}`}>
                <kpi.icon size={18} />
              </div>
              <div className={styles.kpiValue}>{kpi.value}</div>
              <div className={styles.kpiLabel}>{kpi.label}</div>
              {kpi.change && (
                <div className={`${styles.kpiChange} ${kpi.change.startsWith('+') ? styles.up : styles.down}`}>
                  <TrendingUp size={11} /> {kpi.change} vs yesterday
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Team Status + Activity */}
      <div className={styles.bottomRow}>
        {/* Team Status */}
        <div className="card" style={{ flex: 1 }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Team Status</h3>
            <span className="text-muted text-xs">{format(new Date(), 'h:mm a')}</span>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {TEAM_STATUS.map(emp => (
                  <tr key={emp.code}>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="avatar avatar-sm" style={{ background: 'var(--color-brand-muted)', color: 'var(--color-brand-light)' }}>
                          {emp.avatar}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{emp.name}</div>
                          <div className="text-muted text-xs">{emp.code}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-secondary text-sm">{emp.dept}</td>
                    <td>
                      <span className={`badge ${
                        emp.status === 'in' ? 'badge-success' :
                        emp.status === 'out' ? 'badge-danger' : 'badge-warning'
                      }`}>
                        {emp.status === 'in' ? '● Present' : emp.status === 'out' ? '○ Absent' : '● Leave'}
                      </span>
                    </td>
                    <td className="text-muted text-sm">{emp.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card" style={{ width: '280px', flexShrink: 0 }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Activity</h3>
            <button className="btn btn-ghost btn-sm">
              View all <ArrowUpRight size={12} />
            </button>
          </div>
          <div className={styles.activityList}>
            {RECENT_ACTIVITIES.map((a, i) => (
              <div key={i} className={styles.activityItem}>
                <span className={styles.activityDot}>{a.icon}</span>
                <div className={styles.activityText}>
                  <div className="text-sm font-medium">{a.user}</div>
                  <div className="text-xs text-muted">{a.action}</div>
                </div>
                <div className="text-xs text-muted ml-auto">{a.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
