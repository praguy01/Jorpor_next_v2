const mysql = require("mysql2");
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "nextjs-jorpor"
}).promise()

module.exports = db;