// Unified API client for School Timer data (day cycle + food menus)
// Provides a single fetch with simple caching and in-flight request coalescing

/* global window */

(function initSchoolTimerAPI(global) {
  const API_URL = "https://api.schooltimer.net/api/data";
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

  function fetchJson(url, init) {
    return fetch(url, init).then(function toJson(response) {
      return response.json();
    });
  }

  function withTimeout(promise, ms) {
    var controller = new AbortController();
    var timeout = setTimeout(function () {
      try {
        controller.abort();
      } catch (e) {}
    }, ms);
    var wrapped = fetchJson(API_URL, { signal: controller.signal });
    return wrapped.finally(function () {
      clearTimeout(timeout);
    });
  }

  function fetchCombinedData(options) {
    var opts = options || {};
    if (inFlightPromise && !opts.force) {
      return inFlightPromise;
    }

    // Try direct fetch first with a short timeout
    var isLocalDev = (function () {
      var origin = (typeof location !== "undefined" && location.origin) || "";
      return /localhost|127\.0\.0\.1/.test(origin);
    })();

    function tryDirect() {
      return fetchJson(API_URL);
    }

    function tryProxiesSequentially() {
      var idx = 0;
      function next() {
        if (idx >= CORS_PROXIES.length) {
          return Promise.reject(new Error("All CORS proxies failed"));
        }
        var proxyUrl = CORS_PROXIES[idx++] + encodeURIComponent(API_URL);
        return fetchJson(proxyUrl).catch(next);
      }
      return next();
    }

    inFlightPromise = tryDirect()
      .catch(function onDirectFail() {
        // Only attempt proxy fallbacks during local development
        if (!isLocalDev) throw new Error("Direct fetch failed outside dev");
        return tryProxiesSequentially();
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
