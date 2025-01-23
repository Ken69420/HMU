const { Sequelize } = require("sequelize");
require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

//Setup a connection to db
const sequelize = new Sequelize({
  host: "localhost",
  dialect: "postgres",
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

module.exports = sequelize;
