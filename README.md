# Open Station Explorer

A progressive web app (PWA) for exploring German train stations — their facilities, live departures, and community data.

Built with **Vue 3 + TypeScript + Pinia + Tailwind CSS**, deployed on Vercel.

---

## Data Sources

| Feature | Source |
|---|---|
| Station list, search, nearby, facilities | [`https://bahn.dev/station-overview`](https://bahn.dev/station-overview) |
| Live departures | [`https://v5.db.transport.rest`](https://v5.db.transport.rest) |
| Community photos & feedback | `localStorage` (client-side only) |

### Station Overview

All station discovery (name search, nearby lookup, facilities/inventory) is driven by the JSON data from `https://bahn.dev/station-overview`, which provides the full list of Deutsche Bahn stations in the [db-stations](https://github.com/derhuerst/db-stations) format.

Each station entry includes:
- EVA number (used as the station ID)
- Name and geographic coordinates
- Category (1–7, lower = larger station)
- Facility flags: parking, bicycle parking, toilets, lockers, taxi rank, travel necessities, railway mission, DB Lounge, lost & found, mobility service, step-free access, WiFi, travel centre, car rental
- Federal state and postal address

The station overview is fetched once per session and cached in memory. The PWA service worker additionally caches the response for 24 hours.

### Departures

Live departure boards continue to use the `v5.db.transport.rest` HAFAS API. Station IDs (EVA numbers) from the station overview are directly compatible with this API.

---

## Architecture

```
src/
  services/
    stationOverviewApi.ts   ← fetches & caches bahn.dev/station-overview
    stationDataApi.ts       ← maps StationFacilities → InventoryItem[]
    transportApi.ts         ← live departures via v5.db.transport.rest
    communityService.ts     ← localStorage helpers
  stores/
    stationsStore.ts        ← station search / nearby / detail state
    communityStore.ts       ← inventory + community verification state
  views/
    HomeView.vue            ← search + nearby
    StationView.vue         ← station detail, inventory, departures
  components/
    StationSearch.vue
    NearbyStations.vue
    InventoryGrid.vue
    DepartureBoard.vue
    ...
  types/index.ts            ← shared TypeScript interfaces
```

---

## Getting Started

```bash
npm install
npm run dev        # start dev server at http://localhost:5173
npm run build      # type-check + production build
npm run preview    # preview production build locally
```

---

## Deployment

The app is a static SPA configured for Vercel. `vercel.json` rewrites all routes to `index.html` for client-side routing.

