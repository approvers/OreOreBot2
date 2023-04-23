FROM mwader/static-ffmpeg:5.1.2 as ffmpeg

FROM node:20-slim as build
ARG GIT_TAG
SHELL ["/bin/bash", "-c"]
WORKDIR /src

# node-gyp requires Python and basic packages needed to compile C libs
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3=3.9.2-3 build-essential=12.9 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY .yarn/releases/ ./.yarn/releases/
COPY package.json yarn.lock .yarnrc.yml ./

RUN npx --quiet pinst --disable \
    && yarn install --immutable \
    && yarn cache clean

COPY . .
RUN yarn build

WORKDIR /build
RUN cp -r /src/{build,assets,package.json,yarn.lock,node_modules} .

FROM ubuntu:jammy-20221130
COPY --from=build /usr/local/include/ /usr/local/include/
COPY --from=build /usr/local/lib/ /usr/local/lib/
COPY --from=build /usr/local/bin/ /usr/local/bin/
COPY --from=ffmpeg /ffmpeg /usr/local/bin/

LABEL org.opencontainers.image.source=https://github.com/approvers/OreOreBot2
ENV NODE_ENV=production
WORKDIR /app

COPY --from=build /build .

ENTRYPOINT ["node"]
CMD ["build/index.js"]
