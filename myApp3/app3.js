var express = require('express');
var mySql = require ('mysql');
var app = express();

var connection = mySql.createConnection({
    host:'mydb.cshyvbtfvili.ap-southeast-1.rds.amazonaws.com',
    user:'admin',
    password:'08012540',
    database:'game1'
});

connection.connect (function(err)
{
    if (err)
    {
        console.log ('Error Connection', err.stack);
        return;
    }
    console.log ('Connected as id', connection.threadId);
});


app.get('/users',function(req,res){
    queryAllUser(function(err,result){
        res.end(result);
    });
});

app.get('/user/:name',function(req,res){
    var name = req.params.name;
    console.log (name);

    queryUser(function(err,result){
        res.end(result);
    },name);
});

app.get('/user/add/user',function(req,res){
    var susername = req.query.username;
    var spassword = req.query.pass;
    var sname = req.query.name;
    var sscore = req.query.score;

    var user = [
        [susername,spassword,sname,sscore]
    ];

    addUser(user,function(err,result){
        res.end(result);
    })

    //res.end(name + " " + password);
});

var server = app.listen(8081,function(){
    console.log('Server : Running');
});

function queryAllUser (callback)
{
    var json = '';
    connection.query('SELECT * FROM user',
    function (err, rows, fields)
    {
        if (err) throw err;
        
        json = JSON.stringify(rows);

        callback(null,json);
    });
}

function queryUser (callback,name)
{
    var json = '';
    connection.query("SELECT * FROM user WHERE username = ?",name,
    function (err, rows, fields)
    {
        if (err) throw err;
        
        json = JSON.stringify(rows);

        callback(null,json);
    });
}

function addUser (user,callback)
{
    var sql = 'INSERT INTO user(username,password,name,score) values ?';
    connection.query(sql,[user],
    function (err)
    {
        var result = '[{success":"true"}]'

        if (err)
        {
            var result = '[{success":"false"}]'
            throw err;
        }

        callback(null,result);
    });
}