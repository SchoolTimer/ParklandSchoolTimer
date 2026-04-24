export type ScheduleLetter = 'A' | 'B' | 'C' | 'D'

export type BellSlot = {
  start: string  // HH:MM
  end: string    // HH:MM
  label: string  // "HR", "1", "2", etc.
}

export type BellTable = {
  letter: ScheduleLetter
  name: string
  slots: BellSlot[]
}

export type DayCycle = {
  id: string
  today: string | null
  tomorrow: string | null
  next_day: string | null
  last_updated: string | null
}

export type FoodMenu = {
  id: string
  breakfast: string[]
  lunch: string[]
  last_updated: string | null
}

export type SchoolDates = {
  id: string
  school_year_start: string   // ISO date
  school_year_end: string     // ISO date
  seniors_last_day: string    // ISO date
  last_updated: string | null
}
