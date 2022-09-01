FROM mwader/static-ffmpeg:5.1 as ff

FROM node:18-slim as build
SHELL ["/bin/bash", "-c"]
WORKDIR /src

# node-gyp requires Python and basic packages needed to compile C libs
# git is needed for `yarn gen-version`
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3=3.9.2-3 build-essential=12.9 git=1:2.30.2-1 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY package.json yarn.lock ./
RUN yarn
COPY . .
RUN yarn build

WORKDIR /build
RUN cp -r /src/{build,assets,package.json,yarn.lock} . && \
    yarn install --production=true


FROM gcr.io/distroless/nodejs:18

COPY --from=ff /ffmpeg /usr/local/bin/

LABEL org.opencontainers.image.source=https://github.com/approvers/OreOreBot2
ENV NODE_ENV=production
WORKDIR /app

COPY --from=build /build .

CMD ["build/index.js"]
