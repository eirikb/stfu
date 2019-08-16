// Temporary hack until parcel get some proxy
// Ref https://github.com/parcel-bundler/parcel/pull/2477

const Bundler = require('parcel');
const express = require('express');
const proxy = require('http-proxy-middleware');

const app = express();

['user', 'stikkut', 'app', 'turar'].forEach(path =>
  app.use(`/${path}`, proxy({
    target: `https://www.stikkut.no/`,
    changeOrigin: true,
  }))
);
app.use('/elevation', proxy({
  target: 'https://www.norgeskart.no/ws/elev.py',
  changeOrigin: true,
}));

const bundler = new Bundler('index.html');
app.use(bundler.middleware());

app.listen(Number(process.env.PORT || 1234));