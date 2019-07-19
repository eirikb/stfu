// Temporary hack until parcel get some proxy
// Ref https://github.com/parcel-bundler/parcel/pull/2477

const Bundler = require('parcel');
const express = require('express');
const proxy = require('http-proxy-middleware');

const app = express();

app.use('/api/', proxy({
  target: 'https://www.stikkut.no/',
  changeOrigin: true,
  pathRewrite: {
    '^/api/': ''
  }
}));

const bundler = new Bundler('index.html');
app.use(bundler.middleware());

app.listen(Number(process.env.PORT || 1234));