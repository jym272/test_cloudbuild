#!/usr/bin/env bash

set -eou pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$DIR"/exports.sh

# Constants
RETRIES=20
SLEEP_INTERVAL=1


rankings_url="http://localhost:$PORT_RANKINGS/api/legend-rankings"

function show_logs {
  docker logs "$COMPOSE_PROJECT_NAME"-rankings-1
}


function health() {
  local url=$1
  local cmd
  cmd=$(curl -s "$url"/ping || echo "error")
  echo "$cmd"
}

function wait_for_services() {
  local retries=$1
  for i in $(seq 1 "$retries"); do
    if [ "$(health "$rankings_url")" == "pong" ]; then
      echo -e "\033[1;32m ✔\033[0m\033[32m Rankings is up.\033[0m"
      return 0
    fi
    echo -e "\033[0;33m ⚠ Retrying... ($i/$retries)\033[0m"
    sleep "$SLEEP_INTERVAL"
  done
  echo -e "\033[0;31m ✘ Services not ready after $retries retries\033[0m"
  show_logs
  return 1
}

main() {
  echo -e "\033[0;35m ⚡\033[0m\033[35m Smoke test ⚡ preparing...\033[0m"
  docker compose pull
  docker compose up mongodb -d
  # prevents issues with parallel builds and cache
  docker compose build rankings
  docker compose up rankings -d

  echo -e "\033[0;35m ⚡\033[0m\033[35m Smoke test has started\033[0m"
  echo -e "\033[0;35m ⚡\033[0m\033[35m Rankings test process has started\033[0m"
  wait_for_services "$RETRIES" || exit 1
  echo -e "\033[0;35m ⚡\033[0m\033[35m Smoke test has finished ⚡\033[0m"
  show_logs
}

main

