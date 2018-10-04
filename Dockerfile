FROM cryptosregistry.azurecr.io/alpine-node:lts-carbon

LABEL Author="James Kirkby <james.kirby@atlascity.io>"

VOLUME [ "/srv" ]

CMD [ "node" ]
