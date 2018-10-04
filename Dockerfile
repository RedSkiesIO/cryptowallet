FROM cryptosregistry.azurecr.io/alpine-node:lts-carbon

LABEL Author="James Kirkby <james.kirby@atlascity.io>"

RUN apk add --no-cache --virtual .gyp \
        python \
        make \
        g++

WORKDIR /srv

VOLUME [ "/srv" ]

CMD [ "node" ]
