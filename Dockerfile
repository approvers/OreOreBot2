FROM mwader/static-ffmpeg:8.0.1 AS ffmpeg

FROM node:24-alpine AS build
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
ARG GIT_TAG
WORKDIR /src

# node-gyp requires Python and basic packages needed to compile C libs
# RUN apt-get update \
#     && apt-get install -y --no-install-recommends python3=3.11.2-1+b1 build-essential=12.9 \
#     && apt-get clean \
#     && rm -rf /var/lib/apt/lists/*

COPY packages/ ./packages/
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml LICENSE ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile
RUN pnpm run build:bot \
    && pnpm deploy --prod --filter "./packages/bot" /build

FROM gcr.io/distroless/nodejs24-debian12:nonroot
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

CMD ["build/index.mjs"]
