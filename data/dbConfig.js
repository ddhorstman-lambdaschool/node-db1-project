const knex = require("knex");
require('dotenv').config();

const knexfile = require("../knexfile.js");

// change to "production" and update knexfile.js to use postgres.
const database = process.env.ENVIRONMENT || "development";

module.exports = knex(knexfile[database]);
