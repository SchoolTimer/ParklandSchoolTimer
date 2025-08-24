// Unified API client for School Timer data (day cycle + food menus)
// Provides a single fetch with simple caching and in-flight request coalescing

/* global window */

(function initSchoolTimerAPI(global) {
  const API_URL = "https://schooltimer-api.vercel.app/api/data";
  const CORS_PROXY = "https://corsproxy.io/?"; // fallback for localhost/dev only

  /**
   * Holds the most recent successful response in normalized form
   * { daycycle, foodmenu: { breakfast: string[], lunch: string[] }, timestamp, last_updated }
   */
  let cachedData = null;

  /**
   * Tracks an in-flight request so multiple callers share the same promise
   */
  let inFlightPromise = null;

  function normalizeMenuArray(items) {
    if (!Array.isArray(items)) return [];
    return items
      .map(function mapToString(item) {
        if (typeof item === "string") return item;
        if (item && item.product && typeof item.product.name === "string") {
          return item.product.name;
        }
        return "";
      })
      .filter(function filterNonEmpty(value) {
        return typeof value === "string" && value.trim().length > 0;
      });
  }

  function capitalizeFirst(word) {
    if (typeof word !== "string" || word.length === 0) return word;
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  function normalizeResponse(raw) {
    var daycycle = raw && raw.daycycle ? raw.daycycle : {};
    var foodmenuRaw = raw && raw.foodmenu ? raw.foodmenu : {};

    var breakfast = normalizeMenuArray(foodmenuRaw.breakfast).map(
      capitalizeFirst
    );
    var lunch = normalizeMenuArray(foodmenuRaw.lunch).map(capitalizeFirst);

    return {
      daycycle: daycycle,
      foodmenu: { breakfast: breakfast, lunch: lunch },
      timestamp: raw && raw.timestamp ? raw.timestamp : null,
      last_updated: {
        daycycle:
          daycycle && daycycle.last_updated ? daycycle.last_updated : null,
        foodmenu:
          foodmenuRaw && foodmenuRaw.last_updated
            ? foodmenuRaw.last_updated
            : null,
      },
    };
  }

  function fetchJson(url) {
    return fetch(url).then(function toJson(response) {
      return response.json();
    });
  }

  function fetchCombinedData(options) {
    var opts = options || {};
    if (inFlightPromise && !opts.force) {
      return inFlightPromise;
    }

    // Avoid custom headers/mode on GET to prevent CORS preflight
    inFlightPromise = fetchJson(API_URL)
      .catch(function tryProxy(error) {
        // Retry through CORS proxy (useful in local dev when API doesn't allow localhost origins)
        return fetchJson(CORS_PROXY + encodeURIComponent(API_URL));
      })
      .then(function handleRaw(raw) {
        cachedData = normalizeResponse(raw);
        return cachedData;
      })
      .catch(function onError(error) {
        // Surface the error to callers; keep the cachedData as-is
        throw error;
      })
      .finally(function clearInFlight() {
        inFlightPromise = null;
      });

    return inFlightPromise;
  }

  function getCachedData() {
    return cachedData;
  }

  global.SchoolTimerAPI = {
    fetchCombinedData: fetchCombinedData,
    getCachedData: getCachedData,
  };
})(window);
