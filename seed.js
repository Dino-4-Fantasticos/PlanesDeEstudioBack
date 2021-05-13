require("dotenv").config();

module.exports = {
  "undefined": "localhost/PDE",
  "dev": process.env.ATLAS_URI,
  "prod": process.env.DB_PRODUCCION
}
