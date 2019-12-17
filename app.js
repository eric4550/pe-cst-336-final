const express = require("express");
const mysql   = require("mysql");
const sha256  = require("sha256");
const session = require('express-session');

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public")); //folder for images, css, js
app.use(express.urlencoded()); //use to parse data sent using the POST method
app.use(session({ secret: 'any word', cookie: { maxAge: 60000 }}))

// app.use(myMiddleware);

// function myMiddleware(req, res, next){
//   console.log(new Date());
//   next()
// }

//routes
app.get("/", function(req, res){
   res.render("login");
});

app.get("/user", async function(req, res){
    
   console.log("authenticated: ", req.session.authenticated);    
   
   if (req.session.authenticated) { //if user hasn't authenticated, sending them to login screen
       
     let schedule = await getSchedule();  
       //console.log(eventList);
       res.render("dashboard", {"schedule":schedule});  
       
   }  else { 
    
       res.render("login"); 
   
   }
});

app.post("/loginProcess", function(req, res) {
    
    if ( req.body.username == "Admin" && req.bod.password == "Admin") {
       req.session.authenticated = true;
       res.send({"loginSuccess":true});
       req.render('dashboard');
    } else {
       res.send(false);
    }

    
});

app.get("/addEvent", function(req, res){
  res.render("dashboard");
});

app.post("/addEvent", async function(req, res){
  //res.render("dashboard");
  let rows = await insertEvent(req.body);
  console.log(rows);
  //res.send("First name: " + req.body.firstName); //When using the POST method, the form info is stored in req.body
  let message = "Event WAS NOT added to the database!";
  if (rows.affectedRows > 0) {
      message= "Event successfully added!";
  }
  res.render("newEvent", {"message":message});
    
});

app.get("/updateEventr", async function(req, res){

  let schedule = await getSchedule(req.query.id);    
  //console.log(ScheduleInfo);
  res.render("updateEvent", {"schedule":schedule});
});

app.post("/updateAuthor", async function(req, res){
  let rows = await updateEvent(req.body);
  
  let scheduleInfo = req.body;
  console.log(rows);
  //res.send("First name: " + req.body.firstName); //When using the POST method, the form info is stored in req.body
  let message = "Author WAS NOT updated!";
  if (rows.affectedRows > 0) {
      message= "Author successfully updated!";
  }
  res.render("dashboard", {"message":message, "scheduleInfo":scheduleInfo});
    
});

app.get("/deleteEvent", async function(req, res){
 let rows = await deleteEvent(req.query.id);
 console.log(rows);
  //res.send("First name: " + req.body.firstName); //When using the POST method, the form info is stored in req.body
  let message = "Event WAS NOT deleted!";
  if (rows.affectedRows > 0) {
      message= "Event successfully deleted!";
  }    
    
   let schedule = await getSchedule();  
   //console.log(authorList);
   res.render("user", {"schedule":schedule});
});

app.get("/dbTest", function(req, res){

    let conn = dbConnection();
    
    conn.connect(function(err) {
       if (err) throw err;
       console.log("Connected!");
    
       let sql = "SELECT * FROM schedule WHERE userId = 0";
    
       conn.query(sql, function (err, rows, fields) {
          if (err) throw err;
          conn.end();
          res.send(rows);
       });
    
    });

});//dbTest

//functions

function insertEvent(body){
   
   let conn = dbConnection();
    
    return new Promise(function(resolve, reject){
        conn.connect(function(err) {
           if (err) throw err;
           console.log("Connected!");
        
           let sql = 'INSERT INTO schedule VALUES (NULL, ?, ?, ?, ?, ?)';
        
           let params = [
            req.app.locals.session.user.id,
            req.body.open_date,
            req.body.start_time,
            req.body.stop_time,
            req.body.duration,
            req.app.locals.session.user.username
        ];
        
           conn.query(sql, params, function (err, rows, fields) {
              if (err) throw err;
              //res.send(rows);
              conn.end();
              resolve(rows);
           });
        
        });//connect
    });//promise 
}


function deleteEvent(id){
   
   let conn = dbConnection();
    
    return new Promise(function(resolve, reject){
        conn.connect(function(err) {
           if (err) throw err;
           console.log("Connected!");
        
           let sql = `DELETE FROM schedule
                      WHERE id = ?`;
        
           conn.query(sql, [id], function (err, rows, fields) {
              if (err) throw err;
              //res.send(rows);
              conn.end();
              resolve(rows);
           });
        
        });//connect
    });//promise 
}


function getSchedule(){
   
   let conn = dbConnection();
    
    return new Promise(function(resolve, reject){
        conn.connect(function(err) {
           if (err) throw err;
           console.log("Connected!");
        
           let sql = `SELECT id, userId, date, start_time, duration,  
                        FROM schedule
                        ORDER BY id`;
        
           conn.query(sql, function (err, rows, fields) {
              if (err) throw err;
              //res.send(rows);
              conn.end();
              resolve(rows);
           });
        
        });//connect
    });//promise 
}

function dbConnection(){

  
let mysqlConfig = {
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
    password: process.env.MYSQL_PASSWORD,
    port: 3306,
    user: process.env.MYSQL_USER,
};

 //createConnection

return conn;

}


//starting server
app.listen(process.env.PORT, process.env.IP, function(){
console.log("Express server is running...");
});







// const express = require("express");
// const mysql   = require("mysql");
// const session = require('express-session');
// const cookieParser = require('cookie-parser');
// const morgan = require('morgan');

// const app = express();

// const mysqlConfig = {
//     database: process.env.MYSQL_DATABASE,
//     host: process.env.MYSQL_HOST,
//     password: process.env.MYSQL_PASSWORD,
//     port: 3306,
//     user: process.env.MYSQL_USER,
// };

// const pool = mysql.createPool(mysqlConfig);
// const router = express.Router();

// var exp = require('express');
// var path = require('path');

// var actionRouter = require('./routes/action');
// var loginRouter = require('./routes/login');
// var scheduleRouter = require('./routes/schedule');
// var usersRouter = require('./routes/users');

// app.locals.session = {
//     isAuthenticated: false,
// };

// function isAuthenticated(req, res, next) {
//     if (app.locals.session.isAuthenticated) {
//         next();
//     } else {
//         res.redirect('/login');
//     }
// }

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// app.use(morgan('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/action', actionRouter);
// console.log("***1");
// app.use('/login', loginRouter);
// console.log("***2");
// app.use('/schedule', isAuthenticated, scheduleRouter);
// console.log("***3");
// app.use('/users', usersRouter);
// console.log("***4");

// app.use('/*', function (req, res) {
//     // console.log(`req.originalUrl:<${req.originalUrl}>`);
//     res.redirect('/login');
// });


module.exports = app;
