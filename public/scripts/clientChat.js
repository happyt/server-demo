window.onload = function() {

    var messages = [];
    var socket = io.connect('http://localhost:3700');
    var field = document.getElementById("field");
    var sendButton = document.getElementById("send");
    var content = document.getElementById("content");
    var name = document.getElementById("name");

    socket.on('message', function (data) {
        if(data.message) {
            console.log("Message:" + data.message);
            var mess = data.message.toString();
            var words =  data.message.split(" ");

            switch (words[0]) {

                case "t":
                    var tim = parseInt(words[1]);
                    console.log("time:", tim);

                    break;

                default:
                    break;

            }

            messages.push(data);
            var html = '';
            for(var i=0; i<messages.length; i++) {
                html += '<b>' + (messages[i].username ? messages[i].username : 'Server') + ': </b>';
                html += messages[i].message + '<br />';
            }
            content.innerHTML = html;
            content.scrollTop = content.scrollHeight;
        } else {
            console.log("Problem message:", data);
        }
    });

    sendButton.onclick = sendMessage = function() {
        if(name.value == "") {
            alert("Please type your user name!");
        } else {
            var text = field.value;
            socket.emit('send', { message: text, username: name.value });
            console.log("sent message");
            field.value = "";
        }
    };
}



$(document).ready(function() {
    $("#field").keyup(function(e) {
        if(e.keyCode == 13) {
            sendMessage();
        }
    });
});
