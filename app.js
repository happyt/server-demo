var dt = require('./public/scripts/DeltaTimer.js');

var express = require("express");
var app = express();
var port = 3700;
var version = "2.1";
var pollTime = 10000;
var gameTime = 0;

// lists of the client types
var adminClients = {};
var displayClients = {};
var clients = {};



var timer = new dt.DeltaTimer(function (time) {
    gameTime += 1;
    io.sockets.in('admin').emit('message', { message: ('Timer :' + gameTime) });
    console.log("timer..." + parseInt(time));
}, pollTime);

timer.start();

app.set('views', __dirname + '/views');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.use(express.static(__dirname + '/public'));

// pages available through express
app.get("/", function(req, res){
	res.render("page", { title: 'Check this out' });
});

app.get("/client", function(req, res){
    res.render("clientSide", { title: 'Client page' });
});

// web socket handlers
var io = require('socket.io').listen(app.listen(port));

io.configure( function() {
    io.set('close timeout', 60*60*24); // 24h time out
});

// when a client makes a connection
io.sockets.on('connection', function (client) {
    console.log("\t connection: " + client);

    //Welcome message
    client.emit('message', { message: ('Welcome to the system, v' + version) });

    // event handlers for client messages

    client.on('setNickname', function (nickname) {
        client.set('nickname', nickname);
        // add the clients to their set, admin, display, or other
        if (nickname == "admin") {
            client.join('admin');

        } else
        if (nickname == "display") {
            client.join('display');

        } else
        // Normal client
        // Is this an existing user name?
        if (clients[nickname] === undefined) {
            // Does not exist ... so, proceed
            clients[nickname] = client.id;
            console.log("==== User added: " + nickname);

        } else
        if (clients[nickname] === client.id) {
            console.log("==== User added adain: " + nickname);
            // Ignore a second setNickname message
        } else {
            userNameAlreadyInUse(client.id, nickname);
            console.log("==== User already in use: " + nickname);
        }

    });

    // When this client sends a message
    client.on('message', function (message) {
        client.get('nickname', function (error, name) {
            var data = { 'message' : message, nickname : name };
            client.broadcast.emit('message', data);
            console.log("==== User " + name + " sent this : " + message);
        })
    });

    //send a message to everyone
	client.on('send', function (data) {
		io.sockets.emit('message', data);
	});

    //When this client disconnects
    client.on('disconnect', function () {
        console.log("==== Disconnect...");
        client.get('nickname', function (error, name) {
            console.log( name + ' disconnected ' + client.userid);
        });
    });
});


console.log("Server Version " + version);
console.log("Listening on port " + port);
var d = new Date();
console.log("Started at " + d.getHours() + ":"
    + d.getMinutes() + ":" + d.getSeconds());


