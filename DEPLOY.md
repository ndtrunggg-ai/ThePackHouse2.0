# Docker deployment

Runs the whole shop on one 1 vCPU / 2 GB VM from published images. Nothing is built on the server, and it depends on no outside backend.

| Service | Image | Purpose | Reachable at |
| --- | --- | --- | --- |
| `web` | `ndtrungggai/thepackhouse:web-*` | nginx: storefront, catalogue pages, product images | ports 80 and 443 |
| `api` | `ndtrungggai/thepackhouse:api-*` | Node and SQLite: orders, admin, product editing, publishing | Docker network, `/api/` through nginx |
| `notifier` | `ndtrungggai/thepackhouse:notifier-*` | Receives new orders (email and Zalo sending are still stubs) | Docker network only |

The api writes the catalogue as static files (`products.json`, product and category pages, `sitemap.xml`, `google-merchant.xml`) to a volume that nginx serves. Visitors browsing the shop never reach the api, so the shop stays up while it restarts. Only placing or tracking an order needs it.

## First deploy

On the VM, with Docker installed:

```bash
mkdir -p /opt/thepackhouse && cd /opt/thepackhouse
curl -fsSL -O https://raw.githubusercontent.com/ndtrunggg-ai/ThePackHouse2.0/master/docker-compose.yml
curl -fsSL -o .env https://raw.githubusercontent.com/ndtrunggg-ai/ThePackHouse2.0/master/.env.example
```

Edit `.env`: set `ADMIN_EMAIL` and an `ADMIN_PASSWORD` of at least 12 characters. They are only read while no admin exists, so the password can be removed from the file after the first start.

The image repository is private, so log in with a Docker Hub access token, then start:

```bash
docker login -u ndtrungggai
docker compose up -d
```

The first start creates the database and imports the 49 products from the old catalogue with their original ids, so existing product URLs keep working.

## Product images

Images are not imported, because they were hosted on Strapi Cloud. Sign in at `/admin`, open **Sản phẩm**, tick **Chỉ hiện sản phẩm thiếu ảnh** and upload them product by product. The first image is the main one. Photos are shrunk in your browser to 1600 px WebP before upload.

Changes appear on the shop about 2 seconds after saving, with no rebuild.

The Google Merchant feed lists products without images with an empty image link, and Merchant Center rejects those until their images are uploaded.

## HTTPS with Cloudflare

The domain's DNS is on Cloudflare, which replaces the HTTPS that GitHub Pages provided.

1. In Cloudflare, under **SSL/TLS > Origin Server**, create an Origin Certificate for `thepackhouse.vn` and `*.thepackhouse.vn`.
2. Save it on the VM as `/opt/thepackhouse/certs/origin.pem` and the key as `/opt/thepackhouse/certs/origin.key`, then run `docker compose restart web`. HTTPS turns on when both files exist.
3. Set **SSL/TLS** mode to **Full (strict)**.
4. Check the VM directly before moving traffic: `curl -k -H 'Host: thepackhouse.vn' https://<vm-ip>/products.json`.
5. Point the `A` records for `thepackhouse.vn` and `www` at the VM with the proxy on (orange cloud), replacing the GitHub Pages addresses.
6. Remove the custom domain in the repository's GitHub Pages settings.

Allow only ports 22, 80 and 443 on the VM's firewall.

## Update and roll back

Build and push on the build server, never on the VM:

```bash
./scripts/build-images.sh --push
```

Each service is pushed as `<service>-latest` and `<service>-<commit>`. To update the VM:

```bash
docker compose pull
docker compose up -d
```

To roll back, set `TAG=<commit>` in `.env` and run the same two commands. Always run all three services on the same tag, because the api publishes pages that load the web image's asset files.

## Back up

Orders, products and images live only on this VM, so copy them somewhere else regularly:

```bash
docker compose exec api node backup.js
docker run --rm -v thepackhouse_api-data:/data:ro -v thepackhouse_uploads:/uploads:ro -v "$PWD":/out alpine tar czf /out/thepackhouse-backup.tar.gz /data/backups /uploads
```

## Reset the admin password

```bash
docker compose exec -it api node set-admin-password.js admin@thepackhouse.vn
```

## Resource use

Measured with all three containers pinned to one CPU core during a full test run, including 6,000 storefront requests:

| Service | Idle | Peak | Limit |
| --- | --- | --- | --- |
| `web` | 3 MB | 7 MB | 64 MB |
| `api` | 13 MB | 45 MB | 256 MB |
| `notifier` | 10 MB | 14 MB | 64 MB |

The stack starts serving in about 5 seconds once the images are pulled, and the api restarts in 1 to 2 seconds.
