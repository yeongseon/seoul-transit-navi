# Deployment

## Prerequisites
- Cloudflare account with access to Workers, Pages, D1, and KV
- Wrangler CLI authenticated locally (`wrangler login`)
- ODsay API key (https://lab.odsay.com/)
- Node.js >= 20, pnpm >= 9

## Step 1: Create D1 database
```sh
wrangler d1 create seoul-transit
```
Update the `database_id` and `preview_database_id` values in `api/wrangler.toml`.

## Step 2: Create KV namespace
```sh
wrangler kv namespace create STATION_CACHE
```
Update the `id` and `preview_id` values in `api/wrangler.toml`.

## Step 3: Set secrets
```sh
wrangler secret put ODSAY_API_KEY --name seoul-transit-navi-api
```

## Step 4: Run migrations
```sh
pnpm --filter api db:migrate
```

## Step 5: Seed database
```sh
pnpm --filter api db:seed
```

## Step 6: Deploy API
```sh
pnpm deploy:api
```
Note the deployed API URL (e.g., `https://seoul-transit-navi-api.<your-subdomain>.workers.dev`).

## Step 7: Set API URL and deploy web

`NEXT_PUBLIC_API_URL` is inlined at build time by Next.js. Set it **before** building:

```sh
NEXT_PUBLIC_API_URL=https://seoul-transit-navi-api.<your-subdomain>.workers.dev pnpm deploy:web
```

Alternatively, create `web/.env.production`:
```
NEXT_PUBLIC_API_URL=https://seoul-transit-navi-api.<your-subdomain>.workers.dev
```
Then run `pnpm deploy:web`.

## Notes
- The placeholder D1 and KV IDs in `api/wrangler.toml` **must** be replaced before deploying.
- `NEXT_PUBLIC_API_URL` is embedded at build time — changing it requires a rebuild.
- The `deploy:web` script runs `opennextjs-cloudflare build && wrangler deploy` automatically.
