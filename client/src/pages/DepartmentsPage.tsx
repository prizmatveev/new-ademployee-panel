import { useState } from 'react'
import { Plus, Users, ChevronRight } from 'lucide-react'
import styles from './DepartmentsPage.module.css'

const DEPARTMENTS = [
  { id: 1, name: 'Management',  head: 'Arjun Sharma',   count: 3,  positions: ['CEO', 'COO', 'Strategy Lead'] },
  { id: 2, name: 'Engineering', head: 'Bikash Rai',     count: 8,  positions: ['Tech Lead', 'Senior Dev', 'Developer', 'QA Engineer'] },
  { id: 3, name: 'HR',         head: 'Priya Thapa',    count: 4,  positions: ['HR Manager', 'Recruiter', 'HR Executive'] },
  { id: 4, name: 'Marketing',  head: 'Ramesh Basnet',  count: 5,  positions: ['Marketing Head', 'Content Writer', 'Designer'] },
  { id: 5, name: 'Finance',    head: 'Anita K.',        count: 4,  positions: ['Finance Manager', 'Accountant', 'Auditor'] },
]

const DEPT_COLORS = ['#2563eb','#7c3aed','#059669','#d97706','#dc2626']

export default function DepartmentsPage() {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <div className="fade-in">
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Departments</h1>
          <p className="text-secondary text-sm">{DEPARTMENTS.length} departments · {DEPARTMENTS.reduce((a,b) => a + b.count, 0)} total staff</p>
        </div>
        <button className="btn btn-primary"><Plus size={15} /> Add Department</button>
      </div>

      <div className={styles.grid}>
        {DEPARTMENTS.map((dept, i) => (
          <div
            key={dept.id}
            className={`card ${styles.deptCard} ${selected === dept.id ? styles.selected : ''}`}
            onClick={() => setSelected(selected === dept.id ? null : dept.id)}
          >
            <div className={styles.deptAccent} style={{ background: DEPT_COLORS[i % DEPT_COLORS.length] }} />
            <div className={styles.deptIcon} style={{ background: `${DEPT_COLORS[i % DEPT_COLORS.length]}20`, color: DEPT_COLORS[i % DEPT_COLORS.length] }}>
              <Users size={20} />
            </div>
            <div className={styles.deptName}>{dept.name}</div>
            <div className={styles.deptHead}>
              <span className="text-muted text-xs">Head: </span>
              <span className="text-sm">{dept.head}</span>
            </div>
            <div className={styles.deptCount}>
              <span className="font-bold" style={{ fontSize: '1.5rem', color: DEPT_COLORS[i % DEPT_COLORS.length] }}>{dept.count}</span>
              <span className="text-muted text-xs">employees</span>
            </div>

            {selected === dept.id && (
              <div className={styles.positions}>
                <div className="text-xs text-muted font-semibold mb-2" style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>Positions</div>
                {dept.positions.map(pos => (
                  <div key={pos} className={styles.positionItem}>
                    <ChevronRight size={11} style={{ color: DEPT_COLORS[i % DEPT_COLORS.length] }} />
                    <span className="text-sm">{pos}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
