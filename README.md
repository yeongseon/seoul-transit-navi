# ソウル交通ナビ (Seoul Transit Navi)

Japanese-friendly Seoul transit navigation service.

## Overview

ソウル交通ナビ is a mobile-first web service for Japanese tourists visiting Seoul.
It helps users understand subway routes clearly in Japanese with step-by-step guidance,
transfer explanations, and exit information.

## Architecture

```
User (Japan/Korea)
  ↓
Cloudflare CDN/Edge
  ↓
Next.js Frontend (web/)
  ↓
Hono API (api/) on Cloudflare Workers
  ├── Station Search (D1 + KV)
  ├── Route Calculation (ODsay Lab API proxy)
  ├── Place/Destination Detail
  └── Japanese Explanation Generator
  ↓
Data Layer
  ├── Cloudflare D1 (stations, lines, places)
  ├── Cloudflare KV (search cache)
  └── ODsay Lab API (transit routing)
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router) + TypeScript + Tailwind CSS |
| API | Hono on Cloudflare Workers |
| Database | Cloudflare D1 (SQLite) |
| Cache | Cloudflare KV |
| ORM | Drizzle ORM |
| Routing Backend | ODsay Lab API |
| Deploy | @opennextjs/cloudflare |
| Testing | Vitest |

## Project Structure

```
seoul-transit-navi/
├── web/            # Next.js frontend
├── api/            # Hono Cloudflare Worker API
├── shared/         # Shared TypeScript types & constants
├── data/           # Static transit datasets & fixtures
├── scripts/        # Data ingestion scripts
└── docs/           # Product documentation
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Start frontend dev server
pnpm dev:web

# Start API dev server
pnpm dev:api

# Run tests
pnpm test
```

## Data Sources

- **Station Names**: 역명다국어표기 (data.go.kr) - Official multilingual station names including Japanese
- **Route Calculation**: ODsay Lab API - Korean public transit routing
- **Schedule Data**: Seoul Metro Train Schedule API (data.go.kr)

## MVP Scope

- Seoul subway only (~300 stations, 9+ lines)
- Japanese-first UI (no multi-locale in MVP)
- Route search, comparison, and step-by-step guidance
- Transfer and exit information
- Shareable route URLs

## License

MIT
