require("dotenv").config();

const mongoose = require("mongoose");
const app = require("./server.js");
const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("MongoDB database connected successfully"))
  .catch(console.log);

app.listen(port, () => console.log(`Server is running on port: ${port}`));
