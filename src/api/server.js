const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const usersRouter = require("../users/router");
app.use("/api/users", usersRouter);

const materiasRouter = require("../materias/router");
app.use("/api/materias", materiasRouter);

const planesRouter = require("../planes/router");
app.use("/api/planes", planesRouter);

const planificadosRouter = require("../planificados/router");
app.use("/api/planificados", planificadosRouter);

const loginRouter = require("../login/router");
app.use("/api/login", loginRouter);

module.exports = app;
