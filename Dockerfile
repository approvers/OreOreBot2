FROM node:16-slim as build
SHELL ["/bin/bash", "-c"]
WORKDIR /src

# node-gyp requires Python and basic packages needed to compile C libs
# git is needed for `yarn gen-version`
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3=3.7.3-1 build-essential=12.6 git=1:2.20.1-2+deb10u3 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY package.json yarn.lock ./
RUN yarn
COPY . .
RUN yarn build

WORKDIR /build
RUN cp -r /src/{build,assets,package.json,yarn.lock} . && \
    yarn install --production=true


FROM gcr.io/distroless/nodejs:16
LABEL org.opencontainers.image.source=https://github.com/approvers/OreOreBot2
ENV NODE_ENV=production
WORKDIR /app

COPY --from=build /build .

CMD ["build/index.js"]
