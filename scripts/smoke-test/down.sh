#!/usr/bin/env bash

set -eou pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$DIR"/exports.sh

docker compose down -v
