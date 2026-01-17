# Use the official Node.js 22 image as the base image
FROM node:22.15.0-bookworm-slim AS compilation

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY apps/frontend/package.json ./apps/frontend/package.json

# for Sharp
ENV SHARP_FORCE_GLOBAL_LIBVIPS=1
ENV VITE_API_URL=https://api.getstack.dev
ENV VITE_URL=https://getstack.dev
ENV VITE_GA_ID=G-3LFB5YDRG9
ENV VITE_ALGOLIA_APP_ID=KECOEVPMGH
ENV VITE_ALGOLIA_API_KEY=226ec03e3294262ab9ea797f2275d8fb
ENV VITE_ALGOLIA_INDEX_NAME=getstack
ENV VITE_SENTRY_DSN=https://8100be9237713d80188a9958449712ac@o4510727256670208.ingest.de.sentry.io/4510727258767440
ENV VITE_SENTRY_ENVIRONMENT=production

# Install dependencies
RUN npm ci

# Copy the entire repository to the working directory
COPY . ./

RUN true \
  && npm run build:back \
  && npm run build:front

# Clean dev dependencies
RUN true \
  && npm prune --omit=dev --omit=peer --omit=optional

# ---- Final ----
# Resulting new, minimal image
FROM node:22.15.0-bookworm-slim AS final


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

ENV NODE_ENV=production

RUN npm install sharp

ARG git_hash
ENV GIT_HASH=$git_hash

# Expose the port the backend service runs on
EXPOSE 3000

