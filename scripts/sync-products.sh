#!/bin/sh
# Publishes CMS product changes: refreshes public/products.json and rebuilds the storefront image.
set -eu
cd "$(dirname "$0")/.."

tmp=public/products.json.tmp
trap 'rm -f "$tmp"' EXIT
curl -fsS 'http://127.0.0.1:1337/api/products?populate=*&pagination%5BpageSize%5D=100' -o "$tmp"

if grep -q '"total":0' "$tmp"; then
  echo "The CMS returned no products; keeping the current catalogue." >&2
  exit 1
fi

mv "$tmp" public/products.json
docker compose up -d --build web
