const Bundler = require("parcel");
const app = require("./server.js");

const bundler = new Bundler("index.html");
app.use(bundler.middleware());
