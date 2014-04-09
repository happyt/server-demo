var dt = require('./public/scripts/DeltaTimer.js');

var express = require("express");
var app = express();
var port = 3700;
var version = "2.1";

var timer = new dt.DeltaTimer(function (time) {
    console.log("timer..." + parseInt(time));
}, 1000);

timer.start();

app.set('views', __dirname + '/views');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res){
	res.render("page", { title: 'Check this out' });
});


var io = require('socket.io').listen(app.listen(port));

io.sockets.on('connection', function (socket) {
	socket.emit('message', { message: ('welcome to the system, v' + version) });
	socket.on('send', function (data) {
		io.sockets.emit('message', data);
	});
});


console.log("Server Version " + version);
console.log("Listening on port " + port);
var d = new Date();
console.log("Started at " + d.getHours() + ":"
    + d.getMinutes() + ":" + d.getSeconds());


