(function () {
  "use strict";

  const AIRBNB_URL = "https://www.airbnb.fr/rooms/53414747";
  const MONTHS_TO_SHOW = 3;

  const MONTH_NAMES = {
    fr: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
    en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  };
  const DOW = { fr: ["L", "M", "M", "J", "V", "S", "D"], en: ["M", "T", "W", "T", "F", "S", "S"] };

  function currentLang() {
    return document.documentElement.lang === "en" ? "en" : "fr";
  }

  function isoDay(date) {
    return date.toISOString().slice(0, 10);
  }

  function buildBusySet(ranges) {
    const set = new Set();
    ranges.forEach(({ start, end }) => {
      let d = new Date(start + "T00:00:00Z");
      const endDate = new Date(end + "T00:00:00Z");
      while (d < endDate) {
        set.add(isoDay(d));
        d.setUTCDate(d.getUTCDate() + 1);
      }
    });
    return set;
  }

  function renderMonth(year, month, busySet, todayIso) {
    const lang = currentLang();
    const wrap = document.createElement("div");
    wrap.className = "cal-month";

    const h4 = document.createElement("h4");
    h4.textContent = `${MONTH_NAMES[lang][month]} ${year}`;
    wrap.appendChild(h4);

    const grid = document.createElement("div");
    grid.className = "cal-days";
    DOW[lang].forEach((d) => {
      const el = document.createElement("div");
      el.className = "cal-dow";
      el.textContent = d;
      grid.appendChild(el);
    });

    const first = new Date(Date.UTC(year, month, 1));
    const firstWeekday = (first.getUTCDay() + 6) % 7; // Monday = 0
    for (let i = 0; i < firstWeekday; i++) {
      const el = document.createElement("div");
      el.className = "cal-day empty";
      grid.appendChild(el);
    }

    const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(Date.UTC(year, month, day));
      const iso = isoDay(dateObj);
      const el = document.createElement("div");
      el.className = "cal-day";
      el.textContent = day;
      if (iso < todayIso) {
        el.classList.add("past");
      } else if (busySet.has(iso)) {
        el.classList.add("busy");
      } else {
        el.classList.add("free");
      }
      grid.appendChild(el);
    }

    wrap.appendChild(grid);
    return wrap;
  }

  let lastBusySet = null;

  function renderCalendar() {
    const grid = document.getElementById("calendar-grid");
    if (!grid || !lastBusySet) return;
    grid.innerHTML = "";
    const now = new Date();
    const todayIso = isoDay(now);
    for (let i = 0; i < MONTHS_TO_SHOW; i++) {
      const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + i, 1));
      grid.appendChild(renderMonth(d.getUTCFullYear(), d.getUTCMonth(), lastBusySet, todayIso));
    }
  }

  async function loadAvailability() {
    const status = document.getElementById("calendar-status");
    const ctaCal = document.getElementById("cta-calendar");
    if (ctaCal) ctaCal.href = AIRBNB_URL;

    try {
      const res = await fetch("/api/availability");
      if (!res.ok) throw new Error("bad status");
      const data = await res.json();
      lastBusySet = buildBusySet(data.busy || []);
      renderCalendar();
      if (status) {
        status.classList.remove("is-error");
        status.setAttribute("data-fr", "Calendrier à jour.");
        status.setAttribute("data-en", "Calendar up to date.");
        status.textContent = currentLang() === "fr" ? "Calendrier à jour." : "Calendar up to date.";
      }
    } catch (err) {
      if (status) {
        status.classList.add("is-error");
        status.setAttribute("data-fr", "Calendrier indisponible pour le moment — consultez Airbnb directement.");
        status.setAttribute("data-en", "Calendar temporarily unavailable — check Airbnb directly.");
        status.textContent = currentLang() === "fr"
          ? "Calendrier indisponible pour le moment — consultez Airbnb directement."
          : "Calendar temporarily unavailable — check Airbnb directly.";
      }
    }
  }

  document.addEventListener("DOMContentLoaded", loadAvailability);

  // Re-render month names / weekday letters when the language toggle is used.
  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("lang-toggle");
    if (btn) btn.addEventListener("click", () => setTimeout(renderCalendar, 0));
  });
})();
