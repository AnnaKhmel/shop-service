const mysql = require('mysql2');

// const pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database: process.env.DB_NAME
// });

const pool = mysql.createPool({
    host: 'localhost',
    port: '3307',
    user: 'root',
    password: 'root',
    database: 'shop'
});

module.exports = pool.promise();