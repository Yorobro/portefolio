# syntax=docker/dockerfile:1.7

# ─────────────────────────────────────────────────────────────
# Stage 1: deps — install all dependencies (incl. devDependencies)
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat python3 make g++ \
  && corepack enable
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ─────────────────────────────────────────────────────────────
# Stage 2: build — compile SvelteKit, prune dev deps
# ─────────────────────────────────────────────────────────────
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build && pnpm prune --prod

# ─────────────────────────────────────────────────────────────
# Stage 3: runtime — minimal production image
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS runtime
RUN apk add --no-cache tini libc6-compat
WORKDIR /app
ENV NODE_ENV=production

# Copy the built app + production node_modules
COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

# Copy content (markdown) and migrations (SQL)
COPY --from=build /app/content ./content
COPY --from=build /app/static ./static
COPY --from=build /app/src/lib/infrastructure/persistence/sqlite/migrations ./migrations

# Non-root user for security
RUN addgroup -S app && adduser -S app -G app && chown -R app:app /app
USER app

# Defaults aligned with the runtime layout
ENV DATABASE_PATH=/data/portfolio.db
ENV MIGRATIONS_DIR=/app/migrations
ENV CONTENT_DIR=/app/content
ENV HOST=0.0.0.0
ENV PORT=3000

VOLUME ["/data"]
EXPOSE 3000

# Use tini as PID 1 to handle signals (SIGTERM, etc.) gracefully
ENTRYPOINT ["tini", "--"]
CMD ["node", "build/index.js"]
