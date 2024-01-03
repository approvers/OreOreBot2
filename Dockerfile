FROM mwader/static-ffmpeg:5.1.2 as ffmpeg

FROM node:20-slim as build
ARG GIT_TAG
SHELL ["/bin/bash", "-c"]
WORKDIR /src

# node-gyp requires Python and basic packages needed to compile C libs
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3=3.11.2-1+b1 build-essential=12.9 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY packages/bot/ ./packages/bot/
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN npx --quiet pinst --disable
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    corepack enable pnpm \
    && pnpm install --frozen-lockfile --filter @oreorebot2/bot
RUN pnpm build:bot

WORKDIR /build
RUN cp -r /src/{package.json,pnpm-lock.yaml,pnpm-workspace.yaml,node_modules} . \
    && mkdir -p ./packages/bot \
    && cp -r /src/packages/bot/{build,assets,node_modules} ./packages/bot

FROM ubuntu:jammy-20231128
COPY --from=build /usr/local/include/ /usr/local/include/
COPY --from=build /usr/local/lib/ /usr/local/lib/
COPY --from=build /usr/local/bin/ /usr/local/bin/
COPY --from=ffmpeg /ffmpeg /usr/local/bin/

LABEL org.opencontainers.image.source=https://github.com/approvers/OreOreBot2
ENV NODE_ENV=production
WORKDIR /app

# Sentry に必要なパッケージ
RUN apt-get update \
    && apt-get install -y --no-install-recommends libssl-dev=3.0.2-0 ca-certificates=20230311 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /build .
COPY --from=build /build/packages ./packages
COPY --from=build /build/packages/bot ./packages/bot

WORKDIR /app/packages/bot

ENTRYPOINT ["node"]
CMD ["build/index.mjs"]
