require("dotenv").config();

module.exports = {
  "undefined": "localhost/PDE",
  "dev": process.env.ATLAS_URI,
  "production": process.env.ATLAS_URI
}
