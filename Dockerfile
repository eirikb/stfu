FROM node as build

COPY . /app
WORKDIR /app
RUN rm -rf .git node_modules dist .idea .cache
RUN du -a
RUN npm i && npm run build

FROM node:16-alpine
COPY . /app
WORKDIR /app
RUN rm -rf .git node_modules dist .idea .cache package*
RUN du -a
COPY --from=build /app/dist /app/dist
RUN npm i express http-proxy-middleware
CMD node prod.js
