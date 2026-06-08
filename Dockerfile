FROM node:20-alpine AS builder

RUN npm install -g pnpm@9.12.0

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

ARG PUBLIC_SITE_URL=http://localhost:5173
ENV PUBLIC_SITE_URL=$PUBLIC_SITE_URL

RUN pnpm build

FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
