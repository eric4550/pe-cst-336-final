const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const mysqlConfig = {
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
    password: process.env.MYSQL_PASSWORD,
    port: 3306,
    user: process.env.MYSQL_USER,
};

const pool = mysql.createPool(mysqlConfig);

router.get('/', async function (req, res) {
	console.log(req.session.isAuthenticated);
	if(req.session.isAuthenticated){
	    schedule = await new Promise(function (resolve, reject) {
	        let query = `
	            SELECT *
	            FROM schedule
	            WHERE userId = '${req.app.locals.session.user.id}'
	            ;
	        `;

	        mysqlConfig.query(query, function (err, rows, fields) {
	              if (err) throw err;
	              //res.send(rows);
	              conn.end();
	              resolve(rows);
	           });

		    }).catch((err) => console.log('caught it'));

	    console.log("length", schedule.length)

	    res.render("dashboard", {schedule, user: req.app.locals.session.user,});

	}else{
		res.render("login");
	}
});

// return new Promise(function(resolve, reject){
//         conn.connect(function(err) {
//            if (err) throw err;
//            console.log("Connected!");
        
//            let sql = `SELECT authorId, firstName, lastName 
//                         FROM q_author
//                         ORDER BY lastName`;
        
//            conn.query(sql, function (err, rows, fields) {
//               if (err) throw err;
//               //res.send(rows);
//               conn.end();
//               resolve(rows);
//            });
        
//         });//connect
//     });//promise 

/*
 * deletes a rating from the table
 * @Param {int} req.body.id
 * @Return json containing rows affected and changed
 */

router.delete('/delete', async function (req, res) {
    const tableStatus = new Promise(function (resolve, reject) {
        const query = `DELETE FROM schedule WHERE id = '${req.body.id}';`;
        pool.query(query, function (error, results) {
            if (error) {
                req.err = error;
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
    res.json({
        affected: tableStatus.affectedRows,
        changed: tableStatus.changedRows,
    });
});

router.post('/create', async function (req, res) {
    new Promise(function (resolve, reject) {
        const query = 'INSERT INTO schedule VALUES (NULL, ?, ?, ?, ?, ?)';
        const values = [
            req.app.locals.session.user.id,
            req.body.open_date,
            req.body.start_time,
            req.body.stop_time,
            req.body.duration,
            req.app.locals.session.user.username
        ];
        pool.query(query, values, (error, results) => {
            if (error) {
                req.err = error;
                reject(error);
            } else {
                resolve(results);
            }
        });
    });

    const scheduleId = new Promise(function (resolve, reject) {
        const query = 'SELECT last_insert_id();';
        pool.query(query, (error, results) => {
            if (error) {
                req.err = error;
                reject(error);
            } else {
                resolve(results[0]['last_insert_id()']);
            }
        });
    });

    res.json({
        scheduleId,
    });
});


module.exports = router;

