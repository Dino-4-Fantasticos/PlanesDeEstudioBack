const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("MongoDB database connected successfully"))
  .catch((err) => console.log(err));

app.listen(port, () => console.log(`Server is running on port: ${port}`));
