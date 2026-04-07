# ソウル交通ナビ Development Plan

## Research-Validated Architecture Decisions

### 1. Routing Strategy: ODsay Lab API (Proxy)
- **Decision**: Use ODsay Lab API (lab.odsay.com) as the transit routing backend
- **Rationale**: Building a custom routing engine (RAPTOR/Dijkstra) would consume 80% of engineering effort. Cloudflare Workers CPU limits (10ms free / 30s paid) make in-Worker routing infeasible. ODsay provides multi-modal Korean transit routing already solved.
- **Architecture**: Cloudflare Worker proxies ODsay API -> translates to Japanese -> adds UX explanation layer
- **Fallback**: Pre-computed subway-only routes stored in D1 if ODsay is unavailable

### 2. Station Data Source: 역명다국어표기 (Official Multilingual Dataset)
- **Source**: https://www.data.go.kr/data/15044232/fileData.do
- **Contains**: Korean, Hanja, English, Chinese (Simplified), Japanese station names for ALL Seoul Metro stations
- **Format**: CSV with columns: 역번호, 역명, 호선, 한자, 영문, 중문간체, 일본어
- **Impact**: Eliminates Japanese translation risk entirely - official human-curated data

### 3. Framework: Next.js + OpenNext Cloudflare Adapter
- **Decision**: Use @opennextjs/cloudflare (NOT @cloudflare/next-on-pages which is deprecated)
- **Runtime**: Node.js runtime (not Edge-only) via OpenNext
- **Known Issues**: 
  - Node.js in Middleware NOT supported
  - Next.js 16.2.0 has crash reports (pin to stable version)
  - All route handlers must be edge-compatible
- **Refs**: 
  - OpenNext: https://opennext.js.org/cloudflare
  - Deprecation: https://github.com/cloudflare/next-on-pages (deprecated)

### 4. API: Hono on Cloudflare Workers
- **ORM**: Drizzle ORM with D1 (SQLite dialect)
- **Cache**: KV for hot-path station/place lookups
- **Structure**: Modular route groups (search, routes, places, share)
- **Reference**: gregalexsmith/workers-hono-api pattern

### 5. Project Structure: Flat (NOT Monorepo)
```
seoul-transit-navi/
├── web/          # Next.js frontend
├── api/          # Hono Cloudflare Worker
├── shared/       # TypeScript types + constants
├── data/         # Static transit datasets + fixtures
├── scripts/      # Data ingestion, seed scripts
└── docs/         # Product documents
```

### 6. MVP Scope: Subway Only
- ~300 Seoul Metro stations across 9+ lines
- NO bus support in MVP (8,000+ stops, no Japanese translations)
- Bus support deferred to Phase 2

---

## Document Review: Issues Found & Fixes Applied

### Issue 1: Route Calculation Architecture Mismatch
- **Original**: Document describes "static transit data" + "Cloudflare Worker API" doing route calculation
- **Problem**: Custom routing in Workers is infeasible (CPU/memory limits)
- **Fix**: Architecture changed to ODsay API proxy with pre-computed fallback

### Issue 2: Monorepo Overkill
- **Original**: apps/ + packages/ Turborepo structure
- **Problem**: Unnecessary complexity for 2 apps (web + api)
- **Fix**: Flat structure with shared/ directory

### Issue 3: @cloudflare/next-on-pages Deprecated
- **Original**: Document doesn't specify adapter
- **Fix**: Explicitly use @opennextjs/cloudflare

### Issue 4: Bus Support Scope
- **Original**: MVP includes "selected bus routes"
- **Problem**: Bus data lacks Japanese translations, 8000+ stops
- **Fix**: MVP is subway-only; bus deferred to Phase 2

### Issue 5: i18n Framework Premature
- **Original**: "i18n-ready structure" for MVP
- **Problem**: Japanese-only MVP doesn't need i18n framework overhead
- **Fix**: Hardcode Japanese for MVP, add i18n infrastructure in Phase 2

---

## Data Sources Matrix

| Source | URL | Content | Format | MVP Use |
|--------|-----|---------|--------|---------|
| 역명다국어표기 | data.go.kr/15044232 | Station names (KO/JA/EN/CN) | CSV | Primary station data |
| Train Schedule API | data.go.kr/15143847 | Subway timetables | REST API | Travel time estimation |
| ODsay Lab API | lab.odsay.com | Multi-modal routing | REST API | Route calculation |
| Seoul Real-time Arrival | data.seoul.go.kr/OA-12764 | Real-time arrivals | REST API | Phase 2 |
| KoreaMetroGraph | github.com/ledyx | Graph model of metro | JSON | Connection/transfer data reference |

---

## Milestone & Issue Plan

### Milestone 1: Project Foundation (Issues #1-#4)
- #1 Initialize repository with Next.js + Hono + TypeScript
- #2 Configure shared TypeScript types and data models
- #3 Configure CI, linting, edge-runtime safety
- #4 Set up Cloudflare D1/KV/Workers config

### Milestone 2: Data Pipeline (Issues #5-#9)
- #5 Download and parse 역명다국어표기 CSV
- #6 Create D1 schema for stations, lines, exits
- #7 Build data ingestion script (CSV -> D1 seed)
- #8 Add subway line and connection data
- #9 Create KV cache layer for station lookups

### Milestone 3: API Layer (Issues #10-#14)
- #10 Implement station search with Japanese matching
- #11 Implement ODsay API integration (route provider)
- #12 Build Japanese route explanation generator
- #13 Implement place/destination detail endpoint
- #14 Implement shareable route URL resolver

### Milestone 4: Frontend Core (Issues #15-#20)
- #15 Build home page with search UI
- #16 Build station autocomplete component
- #17 Build search results page with route cards
- #18 Build route detail page with step-by-step guide
- #19 Build place/destination detail page
- #20 Add shareable URL + OG metadata

### Milestone 5: Polish & Deploy (Issues #21-#25)
- #21 Mobile-first responsive styling
- #22 Error handling and loading states
- #23 SEO metadata for destination pages
- #24 Cloudflare production deployment
- #25 QA: iPhone Safari + Android Chrome testing

---

## Critical Path

```
[Download CSV] -> [Parse + Seed D1] -> [Station Search API] -> [ODsay Integration] -> [Search UI] -> [Results UI] -> [Deploy]
                                              |
                                    [Japanese Explanation Engine]
```

**Estimated Timeline**: 4-6 weeks for working MVP

---

## Tech Stack Summary

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Frontend | Next.js 15.x (App Router) | SSR/SSG for SEO, shareable URLs |
| Styling | Tailwind CSS | Mobile-first, rapid UI development |
| Language | TypeScript (strict) | Type safety across full stack |
| API | Hono on Cloudflare Workers | Edge-native, lightweight |
| Database | Cloudflare D1 (SQLite) | Structured queries, 10GB paid |
| Cache | Cloudflare KV | Hot-path lookups, eventually consistent |
| ORM | Drizzle ORM | D1-native, type-safe, lightweight |
| Routing | ODsay Lab API | Korean transit routing solved |
| Deploy | @opennextjs/cloudflare | Current recommended adapter |
| Testing | Vitest | Compatible with Workers + Next.js |
| Package | pnpm | Fast, disk-efficient |
