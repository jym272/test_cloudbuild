ARG BUN_VERSION=slim
FROM oven/bun:${BUN_VERSION} as base

WORKDIR /app


FROM base as build

COPY --link bun.lockb package.json ./

RUN bun install --production

COPY --link . .

RUN bun run build

FROM base as runner

ARG ENVIRONMENT=development
LABEL legend="rankings"
ENV NODE_ENV=${ENVIRONMENT}

USER bun

COPY --link --from=build --chown=1000:1000 /app/build/ /app
COPY --link --from=build --chown=1000:1000 /app/.env /app/.env

CMD ["bun", "run", "--bun", "server.js"]
