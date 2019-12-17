const express = require('express');
const request = require('request');
const moment = require('moment');
const mysql = require('mysql');

const mysqlConfig = {
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
    password: process.env.MYSQL_PASSWORD,
    port: 3306,
    user: process.env.MYSQL_USER,
};

const pool = mysql.createPool(mysqlConfig);
const router = express.Router();

router.get('/login', async function (req, res) {
    const password = req.query.password;
    const username = req.query.username;
    const users = await new Promise(function (resolve, reject) {
        const query = `
            SELECT *
            FROM user
            WHERE username = '${username}' AND password = '${password}'
            ;
        `;
        pool.query(query, function (error, results) {
            if (error) {
                req.err = error;
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
    if (Array.isArray(users) && users.length) {
        req.app.locals.session.isAuthenticated = true;
        req.app.locals.session.user = users[0];
        req.originalUrl = '/schedule'; // kludge for now
        res.redirect('/schedule');
    } else {
        res.redirect('/login');
    }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
