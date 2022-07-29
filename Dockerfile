from node:16-slim as build
shell ["/bin/bash", "-c"]
workdir /src

# node-gyp requires Python and basic packages needed to compile C libs
# git is needed for `yarn gen-version`
run apt-get update \
   && apt-get install -y python3 build-essential git \
   && apt-get clean \
   && rm -rf /var/lib/apt/lists/*

copy package.json yarn.lock .
run yarn
copy . .
run yarn build

workdir /build
run cp -r /src/{build,assets,package.json,yarn.lock} . && \
    yarn install --production=true


from gcr.io/distroless/nodejs:16-debug
env NODE_ENV=production
workdir /app

copy --from=build /build .

cmd ["build/index.js"]
