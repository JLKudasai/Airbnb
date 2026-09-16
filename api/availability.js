// Fetches the host's private Airbnb iCal export and returns only the busy
// date ranges. The iCal URL (which embeds a private access token) stays in
// an environment variable and is never sent to the browser.
export default async function handler(req, res) {
  const icalUrl = process.env.AIRBNB_ICAL_URL;

  if (!icalUrl) {
    res.status(500).json({ error: "AIRBNB_ICAL_URL is not configured" });
    return;
  }

  try {
    const icalRes = await fetch(icalUrl);
    if (!icalRes.ok) throw new Error(`Upstream status ${icalRes.status}`);
    const text = await icalRes.text();
    const busy = parseBusyRanges(text);

    res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate=3600");
    res.status(200).json({ busy, updatedAt: new Date().toISOString() });
  } catch (err) {
    res.status(502).json({ error: "Could not read the availability calendar" });
  }
}

function parseBusyRanges(ics) {
  const blocks = ics.split("BEGIN:VEVENT").slice(1);
  const ranges = [];

  for (const block of blocks) {
    const start = /DTSTART[^:]*:(\d{8})/.exec(block);
    const end = /DTEND[^:]*:(\d{8})/.exec(block);
    if (!start || !end) continue;
    ranges.push({ start: toIsoDate(start[1]), end: toIsoDate(end[1]) });
  }
  return ranges;
}

function toIsoDate(yyyymmdd) {
  return `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`;
}
