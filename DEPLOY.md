# Deployment

## Prerequisites
- Cloudflare account with access to Workers, Pages, D1, and KV
- Wrangler CLI authenticated locally
- ODsay API key

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

## Step 7: Deploy web
```sh
pnpm deploy:web
```

## Step 8: Set `NEXT_PUBLIC_API_URL`
Set `NEXT_PUBLIC_API_URL` in the Cloudflare Pages dashboard to the deployed API base URL.

## Notes
- The placeholder D1 and KV IDs in `api/wrangler.toml` must be replaced before deploying.
