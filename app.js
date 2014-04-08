require('./public/scripts/DeltaTimer.js');

var express = require("express");
var app = express();
var port = 3700;
var version = "2.1";

var timer = new DeltaTimer(function (time) {
    console.log("timer...");
}, 1000);

var d = new Date();
var n = d.getTime();
var interval = 1000;    // msec

app.set('views', __dirname + '/views');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res){
	res.render("page", { title: 'Checkout' });
});


var io = require('socket.io').listen(app.listen(port));

io.sockets.on('connection', function (socket) {
	socket.emit('message', { message: ('welcome to the system v' + version) });
	socket.on('send', function (data) {
		io.sockets.emit('message', data);
	});
});


console.log("Server Version " + version);
console.log("Listening on port " + port);
console.log("Started at " + d.getHours() + ":"
    + d.getMinutes() + ":" + d.getSeconds());

function my_async_function() {
    console.log("working...");
}
/*
myVar=setTimeout(function(){

    console.log("Hello")
},3000);

(function schedule() {
    setTimeout(function do_it() {
        my_async_function(function() {
            console.log('async done');
            schedule();
        });
    }, interval);
    console.log('schedule end');
}());

function doSomething() {
    console.log("10 seconds");
    setTimeout(doSomething, interval);
}

setTimeout(doSomething, interval);
 */