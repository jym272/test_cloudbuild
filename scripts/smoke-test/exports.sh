#!/usr/bin/env bash

set -eou pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$DIR"/random_functions.sh

rankings_port=$(get_random_port_not_used)

export DIR
# docker compose set up
export DOCKER_BUILDKIT=1
export COMPOSE_FILE="$DIR"/docker-compose.smoke.yml
# si se cambia, cambiar también en Saga Image Size step en las actions id: saga-image-size
export COMPOSE_PROJECT_NAME=smoke-test
# ports
export PORT_RANKINGS=$rankings_port
