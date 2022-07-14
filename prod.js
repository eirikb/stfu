const express = require("express");
const app = require("./server.js");
app.use(express.static("dist"));
