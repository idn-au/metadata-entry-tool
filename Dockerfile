# syntax=docker/dockerfile:1

FROM node:alpine AS base
ARG PORT=3000
WORKDIR /src

FROM base AS build
RUN --mount=type=secret,id=npm_token,env=NPM_TOKEN

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN apk add --no-cache python3 py3-pip make build-base
COPY --link package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --frozen-lockfile
COPY --link . .
RUN pnpm build

FROM base

ENV PORT=$PORT
ENV NODE_ENV=production
COPY --from=build /src/.output /src/.output
EXPOSE $PORT
CMD [ "node", ".output/server/index.mjs" ]