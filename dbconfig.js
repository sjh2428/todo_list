import dotenv from "dotenv";

dotenv.config();

module.exports = {
    connectionLimit: 10,
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWD,
    database: process.env.DBNAME
}