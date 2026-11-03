#!/bin/sh
# Builds the three images on the build server, tagged with the current commit and "latest".
# Usage: ./scripts/build-images.sh [--push]
set -eu
cd "$(dirname "$0")/.."

repo=ndtrungggai/thepackhouse
commit=$(git rev-parse --short HEAD)

for service in web api notifier; do
  docker build --pull --target "$service" -t "$repo:$service-$commit" -t "$repo:$service-latest" .
done

if [ "${1:-}" = "--push" ]; then
  for service in web api notifier; do
    docker push "$repo:$service-$commit"
    docker push "$repo:$service-latest"
  done
fi

echo "Built commit $commit"
