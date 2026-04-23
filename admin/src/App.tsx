import { useState } from 'react'
import type React from 'react'
import { AuthProvider, useAuth } from './lib/auth'
import { LoginPage } from './pages/LoginPage'
import { DayCycleSection } from './pages/DayCyclePage'
import { FoodMenuSection } from './pages/FoodMenuPage'
import { SchoolDatesSection } from './pages/SchoolDatesPage'
import { BellScheduleSection } from './pages/BellSchedulePage'

type Page = 'daycycle' | 'foodmenu' | 'dates' | 'bells'

const NAV: { id: Page; label: string; icon: React.ReactNode }[] = [
  {
    id: 'daycycle', label: 'Day Cycle',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  },
  {
    id: 'foodmenu', label: 'Food Menu',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
  },
  {
    id: 'dates', label: 'School Dates',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  },
  {
    id: 'bells', label: 'Bell Schedules',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  },
]

const PAGE_TITLES: Record<Page, { title: string; subtitle: string }> = {
  daycycle: { title: 'Day Cycle',       subtitle: 'Set today, tomorrow, and next day schedule values' },
  foodmenu: { title: 'Food Menu',       subtitle: "Manage today's breakfast and lunch items" },
  dates:    { title: 'School Dates',    subtitle: 'Configure key dates for the school year' },
  bells:    { title: 'Bell Schedules',  subtitle: 'Edit period times for each schedule type' },
}

function AdminShell() {
  const { user, loading, logout } = useAuth()
  const [page, setPage] = useState<Page>('daycycle')

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="w-5 h-5 rounded-full border-2 border-accent border-t-transparent animate-spin" />
    </div>
  )

  if (!user) return <LoginPage />

  const { title, subtitle } = PAGE_TITLES[page]

  return (
    <div className="flex h-screen bg-bg overflow-hidden">

      {/* ── Sidebar ───────────────────────────────────────────── */}
      <aside className="w-60 shrink-0 flex flex-col bg-surface border-r border-border">
        {/* Logo */}
        <div className="px-5 pt-6 pb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center shrink-0">
              <span className="text-[10px] font-black text-white tracking-tight">PHS</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-dim uppercase tracking-widest leading-none">Parkland HS</p>
              <p className="text-sm font-bold text-text leading-tight">Admin</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <div className="px-3 flex-1 overflow-y-auto">
          <p className="text-[10px] font-bold text-dim uppercase tracking-widest px-2 mb-2">Menu</p>
          <nav className="space-y-0.5">
            {NAV.map(({ id, label, icon }) => {
              const active = page === id
              return (
                <button
                  key={id}
                  onClick={() => setPage(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    active
                      ? 'bg-accent text-white font-semibold'
                      : 'text-dim hover:text-text hover:bg-surface-2'
                  }`}
                >
                  <span className={active ? 'text-white' : 'text-dim'}>{icon}</span>
                  {label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* User */}
        <div className="px-3 pb-4 pt-3 border-t border-border mt-2">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl">
            <div className="w-7 h-7 rounded-lg bg-accent-soft border border-accent/20 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-accent uppercase">{user.email?.[0] ?? 'A'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-text truncate leading-none">{user.email}</p>
              <p className="text-[10px] text-dim mt-0.5 leading-none">Administrator</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="mt-1 w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-dim hover:text-danger hover:bg-surface-2 transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ──────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="shrink-0 h-14 px-8 flex items-center justify-between border-b border-border bg-surface">
          <div>
            <h1 className="text-base font-bold text-text leading-none">{title}</h1>
            <p className="text-xs text-dim mt-0.5 leading-none">{subtitle}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-dim">
            <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
            Connected
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-8">
          {page === 'daycycle' && <DayCycleSection />}
          {page === 'foodmenu' && <FoodMenuSection />}
          {page === 'dates'    && <SchoolDatesSection />}
          {page === 'bells'    && <BellScheduleSection />}
        </main>
      </div>

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
