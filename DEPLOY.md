# Docker deployment

Runs the storefront, Strapi CMS and notification service on one host.

| Service | Purpose | Reachable at |
| --- | --- | --- |
| `web` | nginx serving the built storefront and proxying CMS routes | port 80 |
| `cms` | Strapi with SQLite, stored in the `cms-data` and `cms-uploads` volumes | `127.0.0.1:1337` |
| `notifier` | Receives Strapi webhooks | Docker network only |

## First deploy

Copy `.env.example` to `.env` and replace every `change-me`, then run:

```bash
docker compose up -d --build
docker compose exec -T cms node scripts/seed-products.js < public/products.json
```

## Create the first admin

Registering an admin is blocked on the public port. Open a tunnel from your own machine:

```bash
ssh -L 1337:127.0.0.1:1337 root@<server>
```

Then register at http://localhost:1337/admin.

## Publish product changes

The storefront serves a catalogue built into the `web` image, so CMS edits appear after running:

```bash
./scripts/sync-products.sh
```

Product page URLs contain the CMS id, so ids from a new CMS change those URLs.
