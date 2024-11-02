FROM mwader/static-ffmpeg:7.0.2 as ffmpeg

FROM oven/bun:1.1.34-slim as build
ARG GIT_TAG
SHELL ["/bin/bash", "-c"]
WORKDIR /src

# node-gyp requires Python and basic packages needed to compile C libs
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3=3.9.2-3 build-essential=12.9 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY packages/ ./packages/
COPY package.json bun.lockb LICENSE ./

RUN --mount=type=cache,id=bun,target=/root/.bin/install/cache \
    bun install --frozen-lockfile
RUN bun run build:bot

WORKDIR /build
RUN cp -r /src/{package.json,bun.lockb,node_modules} . \
    && mkdir -p ./packages/bot \
    && cp -r /src/packages/bot/{build,assets} ./packages/bot

FROM ubuntu:jammy-20240808
COPY --from=build /usr/local/include/ /usr/local/include/
COPY --from=build /usr/local/lib/ /usr/local/lib/
COPY --from=build /usr/local/bin/ /usr/local/bin/
COPY --from=ffmpeg /ffmpeg /usr/local/bin/

LABEL org.opencontainers.image.source=https://github.com/approvers/OreOreBot2
ENV NODE_ENV=production
WORKDIR /app

# Sentry に必要なパッケージ
# RUN apt-get update \
#     && apt-get install -y --no-install-recommends libssl-dev=3.0.2-0ubuntu1.13 ca-certificates=20230311ubuntu0.22.04.1 \
#     && apt-get clean \
#     && rm -rf /var/lib/apt/lists/*

COPY --from=build /build .
COPY --from=build /build/packages ./packages
COPY --from=build /build/packages/bot ./packages/bot

WORKDIR /app/packages/bot

ENTRYPOINT ["bun", "run"]
CMD ["build/index.mjs"]
