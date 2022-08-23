FROM alpine:3.16 AS builder

LABEL maintainer="Adrien Navratil <adrien1975@live.fr>"

ENV BUILD_ROOT /tmp/intranet-build

RUN mkdir -p $BUILD_ROOT
WORKDIR $BUILD_ROOT

COPY src ./src
COPY static ./static
COPY package.json package-lock.json svelte.config.js ./

RUN apk update && apk add --no-cache npm
RUN npm ci
RUN npm run build
RUN sed -i "s/crypto';/crypto'; import cors from 'cors';/g" build/index.js && \
    sed -i 's/compression$1(/cors(), compression$1(/g' build/index.js

RUN rm -rf node_modules
RUN npm ci --omit=dev

FROM node:17-alpine

ENV USER intranet
ENV BUILD_ROOT /tmp/intranet-build
ENV INTRANET_ROOT /var/run/intranet

RUN mkdir -p ${INTRANET_ROOT} && \
    addgroup --gid 2000 --system $USER && adduser --uid 2000 --system $USER --ingroup $USER && \
    chown $USER:$USER ${INTRANET_ROOT}

USER $USER
WORKDIR $INTRANET_ROOT

COPY --from=builder ${BUILD_ROOT}/node_modules ./node_modules
COPY --from=builder ${BUILD_ROOT}/build ${BUILD_ROOT}/package.json ./

EXPOSE 3000
CMD ["node", "index.js"]
