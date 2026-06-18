import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, Clock, Building2,
  CalendarDays, BarChart3, LogOut, ChevronRight
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import styles from './Sidebar.module.css'

const NAV_ITEMS = [
  { to: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard',   roles: ['admin','hr','manager','employee'] },
  { to: '/employees',   icon: Users,            label: 'Employees',   roles: ['admin','hr','manager'] },
  { to: '/attendance',  icon: Clock,            label: 'Attendance',  roles: ['admin','hr','manager','employee'] },
  { to: '/departments', icon: Building2,        label: 'Departments', roles: ['admin','hr'] },
  { to: '/leaves',      icon: CalendarDays,     label: 'Leaves',      roles: ['admin','hr','manager','employee'] },
  { to: '/reports',     icon: BarChart3,        label: 'Reports',     roles: ['admin','hr','manager'] },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const visibleItems = NAV_ITEMS.filter(item =>
    user && item.roles.includes(user.role)
  )

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user?.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() ?? 'U'

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <span>L</span>
        </div>
        <div>
          <div className={styles.logoName}>LocalSM</div>
          <div className={styles.logoTagline}>Employee Portal</div>
        </div>
      </div>

      <div className={styles.divider} />

      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navSection}>
          <span className={styles.navLabel}>Menu</span>
          {visibleItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={17} />
              <span>{label}</span>
              <ChevronRight size={13} className={styles.chevron} />
            </NavLink>
          ))}
        </div>
      </nav>

      {/* User card at bottom */}
      <div className={styles.userSection}>
        <div className={styles.divider} />
        <div className={styles.userCard}>
          <div className={`avatar avatar-sm ${styles.avatar}`}>{initials}</div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{user?.name}</div>
            <div className={styles.userRole}>{user?.role.toUpperCase()}</div>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={handleLogout} title="Logout">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  )
}
