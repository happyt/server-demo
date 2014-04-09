var dt = require('./public/scripts/DeltaTimer.js');

var express = require("express");
var app = express();
var port = 3700;
var version = "2.1";
var pollTime = 10000;

var timer = new dt.DeltaTimer(function (time) {
    console.log("timer..." + parseInt(time));
}, pollTime);

timer.start();

app.set('views', __dirname + '/views');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res){
	res.render("page", { title: 'Check this out' });
});

app.get("/client", function(req, res){
    res.render("clientSide", { title: 'Client page' });
});
var io = require('socket.io').listen(app.listen(port));

io.sockets.on('connection', function (client) {
    console.log("\t connection: " + client);

    //Welcome message
    client.emit('message', { message: ('Welcome to the system, v' + version) });

    client.on('setNickname', function (data) {
        client.set('nickname', data);
    });

    client.on('message', function (message) {
        client.get('nickname', function (error, name) {
            var data = { 'message' : message, nickname : name };
            client.broadcast.emit('message', data);
            console.log("user " + name + " send this : " + message);
        })
    });

    //send a message to everyone
	client.on('send', function (data) {
		io.sockets.emit('message', data);
	});

    //When this client disconnects
    client.on('disconnect', function () {
        console.log('\t client disconnected ' + client.userid );
    }); //client.on disconnect
});


console.log("Server Version " + version);
console.log("Listening on port " + port);
var d = new Date();
console.log("Started at " + d.getHours() + ":"
    + d.getMinutes() + ":" + d.getSeconds());


