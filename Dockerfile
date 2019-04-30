FROM node:10.9
ARG BUILD_DATE
ARG VCS_REF
LABEL maintainer="EmCasa <dev@emcasa.com>" \
      org.opencontainers.image.title="Frontend service for EmCasa." \
      org.opencontainers.image.description="Frontend service for EmCasa." \
      org.opencontainers.image.authors="EmCasa <dev@emcasa.com>" \
      org.opencontainers.image.license="MIT" \
      org.opencontainers.image.source="https://github.com/emcasa/frontend" \
      org.opencontainers.image.revision=$VCS_REF \
      org.opencontainers.created=$BUILD_DATE

ARG BUILD_ACCOUNT_KIT_APP_SECRET
ENV ACCOUNT_KIT_APP_SECRET=$BUILD_ACCOUNT_KIT_APP_SECRET

ARG BUILD_AMPLITUDE_API_KEY
ENV AMPLITUDE_API_KEY=$BUILD_AMPLITUDE_API_KEY

ARG BUILD_APOLLO_ENGINE
ENV APOLLO_ENGINE=$BUILD_APOLLO_ENGINE

ARG BUILD_FACEBOOK_APP_ID
ENV FACEBOOK_APP_ID=$BUILD_FACEBOOK_ID

ARG BUILD_FACEBOOK_PAGES
ENV FACEBOOK_PAGES=$BUILD_FACEBOOK_PAGES

ARG BUILD_FLAGR_URL
ENV FLAGR_URL=$BUILD_FLAGR_URL

ARG BUILD_GOOGLE_ANALYTICS_TRACKING_ID
ENV GOOGLE_ANALYTICS_TRACKING_ID=$BUILD_GOOGLE_ANALYTICS_TRACKING_ID

ARG BUILD_GOOGLE_MAPS_KEY
ENV GOOGLE_MAPS_KEY=$BUILD_GOOGLE_MAPS_KEY

ARG BUILD_HOTJAR_SITE_ID
ENV HOTJAR_SITE_ID=$BUILD_HOTJAR_SITE

ARG BUILD_IS_STAGING
ENV IS_STAGING=$BUILD_IS_STAGING

ARG BUILD_SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN=$BUILD_SENTRY_AUTH_TOKEN

ARG BUILD_SENTRY_DSN
ENV SENTRY_DSN=$BUILD_SENTRY_DSN

ARG BUILD_SENTRY_ORG
ENV SENTRY_ORG=$BUILD_SENTRY_ORG

ARG BUILD_SENTRY_PROJECT
ENV SENTRY_PROJECT=$BUILD_SENTRY_PROJECT

ARG BUILD_WEBSERVICE_BASE_URL
ENV WEBSERVICE_BASE_URL=$BUILD_WEBSERVICE_BASE_URL

# system install yarn
RUN npm install -g yarn

# app set workdir
WORKDIR /opt/emcasa/frontend
COPY . /opt/emcasa/frontend

RUN yarn install
RUN yarn build

ENTRYPOINT ["yarn"]
CMD ["start"]
