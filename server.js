const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const usersRouter = require("./src/users/router");
app.use("/api/users", usersRouter);

const planesRouter = require("./src/planes/router");
app.use("/api/planes", planesRouter);

module.exports = app;
