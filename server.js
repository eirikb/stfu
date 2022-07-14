const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

["user", "stikkut", "app", "turar"].forEach((path) =>
  app.use(
    `/${path}`,
    createProxyMiddleware({
      target: `https://www.stikkut.no/`,
      changeOrigin: true,
    })
  )
);
app.use(
  "/elevation",
  createProxyMiddleware({
    target: "https://www.norgeskart.no/ws/elev.py",
    changeOrigin: true,
  })
);

app.listen(Number(process.env.PORT || 1234));

module.exports = app;
