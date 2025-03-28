FROM node:20-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run frontend-build

EXPOSE 8000

RUN printf '#!/bin/sh\n\
npm run migrate\n\
npm run backend-start\n' > /usr/src/app/docker-entrypoint.sh && \
    chmod +x /usr/src/app/docker-entrypoint.sh

CMD ["/bin/sh", "/usr/src/app/docker-entrypoint.sh"] 
