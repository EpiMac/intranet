FROM alpine:3.6 AS builder

LABEL maintainer="Adrien Navratil <adrien1975@live.fr>"

ENV USER intranet
ENV BUILD_ROOT /tmp/intranet-build
ENV INTRANET_ROOT /var/run/intranet

RUN mkdir -p $BUILD_ROOT
WORKDIR ${BUILD_ROOT}

COPY src/ static/ package.json svelte.config.js ./

RUN apk add npm
RUN npm i
RUN npm run build

RUN rm -rf node_modules
RUN npm i --only=production

FROM node:17-alpine

RUN mkdir -p INTRANET_ROOT && \
    addgroup --gid 1000 --system $USER && adduser --uid 1000 --system $USER --ingroup $USER && \
    chown $USER:$USER INTRANET_ROOT

USER $USER
WORKDIR $INTRANET_ROOT

COPY --from=builder ${BUILD_ROOT}/build ${BUILD_ROOT}/node_modules ${BUILD_ROOT}/package.json ./

EXPOSE 3000
CMD ["node", "index.js"]
