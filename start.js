require("dotenv").config();
const express = require("express");
const path = require("path");
const { Seeder } = require('mongo-seeding');

const mongoose = require("mongoose");
const app = require("./server.js");
const port = process.env.PORT || 5000;

const config = {
  database: process.env.ATLAS_URI,
  dropDatabase: true,
};
const seeder = new Seeder(config);
const collections = seeder.readCollectionsFromPath(path.resolve("./seeds"));

// console.log('collections', collections)


// seeder
//   .import(collections)
//   .then(() => {
//     // Do whatever you want after successful import
//     console.log('wiii');
//   })
//   .catch(err => {
//     console.error('error con seeds db', err);
//   });

function connectDB() {

	console.log('connecting to DB', process.env.ATLAS_URI)
	mongoose
  		.connect(process.env.ATLAS_URI, {
    		useNewUrlParser: true,
    		useUnifiedTopology: true,
    		// useCreateIndex: true,
  	})
  		.then(() => console.log("MongoDB database connected successfully"))
  		.catch(err => console.log(err))
  		.finally(() => console.log("finally"));
}

connectDB();

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  console.log("produccion wiii");
  app.use(express.static(path.join(__dirname, "build")));
  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
  });
}

app.listen(port, () => console.log(`Server is running on port: ${port}`));

module.exports = app;
