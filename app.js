'use strict';

const PORT=3333;

var express=require('express');
var morgan=require('morgan');
var bodyParser=require('body-parser');
var http=require('http');
var path=require('path');
var fs=require("fs");

var app=express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static('public'));

app.get('/', function(rec,res) {
	var indexPath=path.join(__dirname,'./public/index.html');
	res.sendFile(indexPath);
});

app.get('/contacts', function(rec,res) {
	var dataPath=path.join(__dirname,'./data/database.json');
	res.sendFile(dataPath);
});

app.post('/contacts', function(rec,res) {
	console.log(rec.body);
	var dataPath=path.join(__dirname,'./data/database.json');
	fs.writeFile(dataPath,JSON.stringify(rec.body), err => {
		console.log("db file write: ", err);
		res.sendFile(dataPath);
	});

});

app.put('/contacts/:id', function(rec,res) {
	console.log(rec.body, rec.params);
	var dataPath=path.join(__dirname,'./data/database.json');



	fs.readFile(dataPath,function(err,data) {
		var contacts=JSON.parse(data);
		var replacedContact=contacts.find((e,i)=>e.id===contacts[i].id);
		contacts[replacedContact]=data;
		fs.writeFile(dataPath,JSON.stringify(contacts), err => {
			console.log("db file write: ", err);
			res.sendFile(dataPath);
		});

	});
});


var server=http.createServer(app);

server.listen(PORT,function() {
	console.log("listening on port "+PORT);
});