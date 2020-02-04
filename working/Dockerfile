FROM node:12-alpine

# 1. Create the working directory at '/home/node/app' and give node use permissions
RUN mkdir -p /usr/src/prod/node_modules && chown -R node:node /usr/src/prod

# 2. Set the working directory
WORKDIR /usr/src/prod

# 3. Copy the package.json and lock
COPY package*.json ./

# 3.5 This npm install requires python
RUN apk add --no-cache --virtual .gyp \
  yarn \
  bash \
  git \
  coreutils \
  grep \
  sed \
  python \
  make \
  g++

# 4. Switch to non-root user
USER node

# 5. Install deps
# RUN rm package-lock.json && rm -rf ./node_modules/ && npm install
RUN npm install

# 6. Copy the app
COPY --chown=node:node . .

# 7. Run the app
CMD [ "yarn", "start" ]
