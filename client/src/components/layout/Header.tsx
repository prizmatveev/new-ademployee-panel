import { Bell, Search } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { format } from 'date-fns'
import styles from './Header.module.css'

export default function Header() {
  const { user } = useAuth()
  const today = format(new Date(), 'EEEE, MMMM d, yyyy')

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.dateText}>{today}</div>
      </div>
      <div className={styles.right}>
        {/* Search */}
        <div className={styles.searchBox}>
          <Search size={14} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Search employees, reports..."
          />
        </div>
        {/* Notifications */}
        <button className="btn btn-ghost btn-icon" style={{ position: 'relative' }}>
          <Bell size={18} />
          <span className={styles.notifDot} />
        </button>
        {/* User chip */}
        <div className={styles.userChip}>
          <div className={`avatar avatar-sm ${styles.avatar}`}>
            {user?.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
          </div>
          <span className={styles.userName}>{user?.name}</span>
          <span className={`badge badge-brand`}>{user?.role}</span>
        </div>
      </div>
    </header>
  )
}
