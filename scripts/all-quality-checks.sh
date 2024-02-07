#!/usr/bin/env bash
set -eou pipefail

bun run lint:fix
sleep 1
bun run format
sleep 1
bun run type-check
sleep 1
bun run test:smoke
