const API_URL = "https://api.schooltimer.net/api/data";

export type RawDaycycle = {
  id?: string;
  today?: string;
  tomorrow?: string;
  next_day?: string;
  last_updated?: string | null;
};

export type FoodMenu = {
  breakfast: string[];
  lunch: string[];
};

export type SchoolTimerData = {
  daycycle: RawDaycycle;
  foodmenu: FoodMenu;
  timestamp: string | null;
  last_updated: {
    daycycle: string | null;
    foodmenu: string | null;
  };
};

type RawMenuItem = string | { product?: { name?: string } };

function normalizeMenu(items: unknown): string[] {
  if (!Array.isArray(items)) return [];
  return (items as RawMenuItem[])
    .map((item) => {
      if (typeof item === "string") return item;
      return item?.product?.name ?? "";
    })
    .filter((v): v is string => typeof v === "string" && v.trim().length > 0)
    .map((v) => v.charAt(0).toUpperCase() + v.slice(1));
}

function normalize(raw: unknown): SchoolTimerData {
  const r = (raw ?? {}) as Record<string, unknown>;
  const daycycle = (r.daycycle ?? {}) as RawDaycycle;
  const foodRaw = (r.foodmenu ?? {}) as Record<string, unknown>;

  return {
    daycycle,
    foodmenu: {
      breakfast: normalizeMenu(foodRaw.breakfast),
      lunch: normalizeMenu(foodRaw.lunch),
    },
    timestamp: (r.timestamp as string | undefined) ?? null,
    last_updated: {
      daycycle: daycycle?.last_updated ?? null,
      foodmenu: (foodRaw.last_updated as string | undefined) ?? null,
    },
  };
}

let cached: SchoolTimerData | null = null;
let inFlight: Promise<SchoolTimerData> | null = null;

export function fetchCombinedData(options: { force?: boolean } = {}): Promise<SchoolTimerData> {
  if (inFlight && !options.force) return inFlight;

  inFlight = fetch(API_URL)
    .then((r) => r.json())
    .then((raw) => {
      cached = normalize(raw);
      return cached;
    })
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}

export function getCachedData(): SchoolTimerData | null {
  return cached;
}
