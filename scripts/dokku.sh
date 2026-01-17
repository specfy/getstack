#!/usr/bin/env bash

set -ex

IMAGE_TAG=459baeba7d956bbc40aee0d02bd38ba23c6ec8d8

# API
dokku apps:create getstack-api
dokku config:set --no-restart getstack-api \
  ALGOLIA_APP_ID=KECOEVPMGH \
  ALGOLIA_API_KEY= \
  ALGOLIA_INDEX_NAME=getstack \
  ANALYZE_REDO_BEFORE="2025-05-17T00:00:00" \
  ANALYZE_MAX_SIZE=1500000 \
  ANALYZE_MIN_STARS=1000 \
  BEEHIIV_API_KEY= \
  BEEHIIV_PUBLICATION_ID= \
  CLICKHOUSE_DATABASE_URL= \
  CRON_ANALYZE=true \
  CRON_LIST=true \
  DATABASE_URL= \
  IS_PROD=true \
  NODE_ENV="production" \
  SENTRY_DSN= \
  SENTRY_ENVIRONMENT=production \
  GITHUB_TOKEN= \
  DOKKU_DOCKERFILE_START_CMD="node --run prod:start"

dokku domains:add getstack-api api.getstack.dev
dokku ports:set getstack-api http:80:3000

docker pull h1fra/getstack:$IMAGE_TAG
dokku git:from-image getstack-api h1fra/getstack:$IMAGE_TAG
dokku letsencrypt:set getstacka-api email EMAIL
dokku letsencrypt:enable getstack-api

# APP
dokku apps:create getstack
dokku config:set --no-restart getstack \
  NODE_ENV=production \
  VITE_API_URL=https://api.getstack.dev \
  VITE_URL=https://getstack.dev \
  DOKKU_DOCKERFILE_START_CMD="npm run -w @getstack/frontend start"

dokku domains:add getstack getstack.dev
dokku ports:set getstack http:80:3000

docker pull h1fra/getstack:$IMAGE_TAG
dokku git:from-image getstack h1fra/getstack:$IMAGE_TAG
dokku letsencrypt:set getstack email EMAIL
dokku letsencrypt:enable getstack
dokku docker-options:add getstack deploy "--restart=always"

# ClickHouse
sudo dokku plugin:install https://github.com/dokku/dokku-clickhouse.git --name clickhouse
dokku clickhouse:create clickhouse -p PASSWORD -r PASSWORD
dokku clickhouse:link getstack-api
dokku clickhouse:expose clickhouse 9000 8123

# Plausible
