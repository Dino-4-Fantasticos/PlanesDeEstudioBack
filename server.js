const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const usersRouter = require("./src/users/router");
app.use("/api/users", usersRouter);

const planesRouter = require("./src/planes/router");
app.use("/api/planes", planesRouter);

const planificadosRouter = require("./src/planificados/router");
app.use("/api/planificados", planificadosRouter);

const loginRouter = require("./src/login/router");
app.use("/api/login", loginRouter);

module.exports = app;
