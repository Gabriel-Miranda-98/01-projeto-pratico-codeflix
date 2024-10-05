FROM node:20-lts


USER node


WORKDIR /home/node/app


CMD [ "tail", "-f", "/dev/null" ]