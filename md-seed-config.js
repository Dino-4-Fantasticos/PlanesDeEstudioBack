require("dotenv").config();

const mongoose = require("mongoose");
const Planes = require("./seeders/planes.seeder");

const mongoURL = process.env.DB_PRODUCCION || process.env.ATLAS_URI;


/**
 * Seeders List
 * order is important
 * @type {Object} 
 */
const seedersList = {
  Planes
};
/**
 * Connect to mongodb implementation
 * @return {Promise}
 */
const connect = async () => await mongoose.connect(mongoURL, { useNewUrlParser: true });
  // console.log("\n---------------config----------------")
  // console.log("Planes: ", Planes);
  // console.log("-------------------------------------\n")
/**
 * Drop/Clear the database implementation
 * @return {Promise}
 */
const dropdb = async () => mongoose.connection.db.dropDatabase();

module.exports = { seedersList, connect, dropdb }
