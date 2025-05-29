# Use the official Node.js 22 image as the base image
FROM node:22.15.0-bookworm-slim AS compilation

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
COPY apps/backend/package.json ./apps/backend/package.json

# for Sharp
ENV SHARP_FORCE_GLOBAL_LIBVIPS=1

# Install dependencies
RUN npm install

# Copy the entire repository to the working directory
COPY . ./

RUN npm run build:back

# Clean dev dependencies
RUN true \
  && npm prune --omit=dev --omit=peer --omit=optional

# ---- Final ----
# Resulting new, minimal image
FROM node:22.15.0-bookworm-slim AS final

ENV NODE_ENV=production

# - Bash is just to be able to log inside the image and have a decent shell
# - OpenSSL is here to handle HTTPS + git clone requests correctly
# - Git is to be able to clone repositories
RUN true \
  && apt update && apt-get install -y bash \
  openssl \
  git \
  ca-certificates \
  curl \
  libvips \
  && update-ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false

# Do not use root to run the app
USER node

WORKDIR /app

# Code
COPY --from=compilation --chown=node:node /app /app

RUN npm install sharp

# Expose the port the backend service runs on
EXPOSE 3000

# Set the command to run the backend service
CMD ["node", "--run", "prod:start"]
