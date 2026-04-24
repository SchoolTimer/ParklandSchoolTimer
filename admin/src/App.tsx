import { useState } from 'react'
import { AuthProvider, useAuth } from './lib/auth'
import { LoginPage } from './pages/LoginPage'
import { DayCyclePage } from './pages/DayCyclePage'
import { FoodMenuPage } from './pages/FoodMenuPage'
import { SchoolDatesPage } from './pages/SchoolDatesPage'
import { BellSchedulePage } from './pages/BellSchedulePage'

type Page = 'daycycle' | 'foodmenu' | 'dates' | 'bells'

const NAV: { id: Page; label: string; icon: string }[] = [
  { id: 'daycycle', label: 'Day Cycle',      icon: '📅' },
  { id: 'foodmenu', label: 'Food Menu',      icon: '🍽' },
  { id: 'dates',    label: 'School Dates',   icon: '🗓' },
  { id: 'bells',    label: 'Bell Schedules', icon: '🔔' },
]

function AdminShell() {
  const { user, loading, logout } = useAuth()
  const [page, setPage] = useState<Page>('daycycle')

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="w-6 h-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
    </div>
  )

  if (!user) return <LoginPage />

  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 flex flex-col border-r border-border bg-surface">
        <div className="px-5 py-5 border-b border-border">
          <p className="text-[10px] font-bold text-dim uppercase tracking-widest leading-none">Parkland HS</p>
          <p className="text-sm font-bold text-text leading-none mt-0.5">Admin Portal</p>
        </div>

        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {NAV.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setPage(id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-sm font-semibold transition-colors ${
                page === id
                  ? 'bg-accent-soft text-accent'
                  : 'text-dim hover:text-text hover:bg-surface-2'
              }`}
            >
              <span className="text-base leading-none">{icon}</span>
              {label}
            </button>
          ))}
        </nav>

        <div className="p-2 border-t border-border">
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-dim hover:text-danger hover:bg-surface-2 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-8">
        {page === 'daycycle' && <DayCyclePage />}
        {page === 'foodmenu' && <FoodMenuPage />}
        {page === 'dates'    && <SchoolDatesPage />}
        {page === 'bells'    && <BellSchedulePage />}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AdminShell />
    </AuthProvider>
  )
}
