#!/usr/bin/env bash

set -eou pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo -e "\033[0;35m ⚡\033[0m\033[35m Smoke test ⚡ preparing...\033[0m"
source "$DIR"/exports.sh

docker compose pull
docker compose up mongodb -d
