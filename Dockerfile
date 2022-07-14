FROM node as build

COPY . /app
WORKDIR /app
RUN rm -rf .git node_modules dist .idea .cache
RUN npm i && npm run build

FROM node:16-alpine
COPY . /app
WORKDIR /app
# Hack - don't want the other packages - don't want two package.json-files
RUN rm -rf .git node_modules dist .idea .cache package*
COPY --from=build /app/dist /app/dist
RUN npm i express http-proxy-middleware
CMD node prod.js
