import { useState } from 'react'
import { Clock, Play, Square, Coffee, Filter } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useTimer } from '@/hooks/useTimer'
import { format, subDays } from 'date-fns'
import styles from './AttendancePage.module.css'

const RECORDS = Array.from({ length: 10 }, (_, i) => {
  const date = subDays(new Date(), i + 1)
  const isWeekend = date.getDay() === 0 || date.getDay() === 6
  const checkIn  = isWeekend ? null : `0${8 + Math.floor(Math.random()*2)}:${String(Math.floor(Math.random()*60)).padStart(2,'0')} AM`
  const checkOut = isWeekend ? null : `0${5 + Math.floor(Math.random()*2)}:${String(Math.floor(Math.random()*60)).padStart(2,'0')} PM`
  const hrs = isWeekend ? 0 : 7 + Math.floor(Math.random()*2)
  const late = !isWeekend && checkIn && checkIn > '09:00'
  return { date, checkIn, checkOut, hours: isWeekend ? '—' : `${hrs}h ${Math.floor(Math.random()*60)}m`, status: isWeekend ? 'weekend' : late ? 'late' : 'ontime' }
})

export default function AttendancePage() {
  const { user } = useAuth()
  const [checkedIn, setCheckedIn] = useState(false)
  const [checkInTime, setCheckInTime] = useState<Date | null>(null)
  const [onBreak, setOnBreak] = useState(false)
  const { formatted } = useTimer(checkInTime, checkedIn && !onBreak)

  return (
    <div className="fade-in">
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Attendance</h1>
          <p className="text-secondary text-sm">Track your work hours and sessions</p>
        </div>
        <button className="btn btn-secondary">
          <Filter size={14} /> Filter
        </button>
      </div>

      <div className={styles.layout}>
        {/* Left: Check-in widget */}
        <div className={styles.sidebar}>
          {/* Live check-in card */}
          <div className={styles.checkinWidget}>
            <div className={styles.widgetHeader}>
              <Clock size={18} />
              <span>Today's Session</span>
            </div>
            <div className={styles.widgetTime}>
              {checkedIn ? (
                <>
                  <div className={styles.liveTimer}>{formatted}</div>
                  <div className={styles.timerLabel}>
                    {onBreak ? '☕ On Break' : '● Live'}
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.liveTimer}>{format(new Date(), 'hh:mm')}</div>
                  <div className={styles.timerLabel}>{format(new Date(), 'a')}</div>
                </>
              )}
            </div>
            {checkedIn && checkInTime && (
              <div className={styles.checkinMeta}>
                <div className={styles.metaRow}>
                  <span>Check-in</span>
                  <span>{format(checkInTime, 'hh:mm a')}</span>
                </div>
                <div className={styles.metaRow}>
                  <span>Status</span>
                  <span className={onBreak ? 'text-warning' : 'text-success'}>
                    {onBreak ? 'On Break' : 'Working'}
                  </span>
                </div>
              </div>
            )}
            <div className={styles.widgetActions}>
              {!checkedIn ? (
                <button className="btn btn-accent w-full" style={{ justifyContent: 'center' }}
                  onClick={() => { setCheckedIn(true); setCheckInTime(new Date()) }}>
                  <Play size={14} /> Check In
                </button>
              ) : (
                <>
                  <button className={`btn btn-sm ${onBreak ? 'btn-secondary' : 'btn-ghost'} w-full`}
                    style={{ justifyContent: 'center' }}
                    onClick={() => setOnBreak(!onBreak)}>
                    <Coffee size={13} /> {onBreak ? 'Resume' : 'Take Break'}
                  </button>
                  <button className="btn btn-danger btn-sm w-full" style={{ justifyContent: 'center' }}
                    onClick={() => { setCheckedIn(false); setOnBreak(false) }}>
                    <Square size={13} /> Check Out
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Monthly summary */}
          <div className="card-sm">
            <div className="font-semibold text-sm mb-3">This Month</div>
            {[
              { label: 'Working Days', value: '20', color: 'var(--color-brand-light)' },
              { label: 'Present',      value: '18', color: 'var(--color-success)' },
              { label: 'Late Arrivals',value: '3',  color: 'var(--color-warning)' },
              { label: 'Total Hours',  value: '144h', color: 'var(--text-primary)' },
            ].map(s => (
              <div key={s.label} className={styles.summaryRow}>
                <span className="text-muted text-xs">{s.label}</span>
                <span className="font-semibold text-sm" style={{ color: s.color }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Records table */}
        <div style={{ flex: 1 }}>
          <div className="card" style={{ padding: 0 }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
              <h3 className="font-semibold">Attendance History</h3>
            </div>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Total Hours</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {RECORDS.map((r, i) => (
                    <tr key={i}>
                      <td>
                        <div className="font-medium text-sm">{format(r.date, 'MMM d, yyyy')}</div>
                        <div className="text-muted" style={{ fontSize: '11px' }}>{format(r.date, 'EEEE')}</div>
                      </td>
                      <td className="text-sm">{r.checkIn ?? '—'}</td>
                      <td className="text-sm">{r.checkOut ?? '—'}</td>
                      <td className="text-sm font-medium">{r.hours}</td>
                      <td>
                        <span className={`badge ${
                          r.status === 'ontime' ? 'badge-success' :
                          r.status === 'late'   ? 'badge-warning' : 'badge-muted'
                        }`}>
                          {r.status === 'ontime' ? 'On Time' : r.status === 'late' ? 'Late' : 'Weekend'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
