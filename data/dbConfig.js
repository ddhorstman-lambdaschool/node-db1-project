const knex = require("knex");
require('dotenv').config();

const knexfile = require("../knexfile.js");
const database = process.env.ENVIRONMENT || "development";

module.exports = knex(knexfile[database]);
