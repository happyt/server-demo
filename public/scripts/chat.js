window.onload = function() {

	var messages = [];
	var socket = io.connect('http://localhost:3700');
	var field = document.getElementById("field");
	var sendButton = document.getElementById("send");
	var content = document.getElementById("content");
	var name = document.getElementById("name");
//    var ctx = $('#draw')[0].getContext("2d");
//
    var json = '{"attrs": {"width": 578,"height": 200},"className": "Stage","children": ' +
        '[{"attrs": {"id": "redButton"},"className": "Layer",' +
        '"children": [{"attrs": {"x": 250,"y": 100,"sides": 6,' +
        '"radius": 70,"fill": "red","stroke": "black","strokeWidth": 4,' +
        '"id": "redPoly"},"className": "RegularPolygon"},' +
        '{ "attrs": {"stroke": "black","strokeWidth": 10,"lineJoin": "round",' +
        '"lineCap": "round","points": [{ "x": 250,"y": 60 },{"x": 250,"y": 80}]},' +
        '"className": "Line"}]}]}';

    var stage = new Kinetic.Stage({
        container: 'draw',
        width: 1000,
        height: 800
    });
    var layer = new Kinetic.Layer();

    var redPoly = new Kinetic.RegularPolygon({
        x: 0,
        y: 0,
        sides: 6,
        radius: 70,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 5
    });

    var marker = new Kinetic.Line ({
        x: 0,
        y: 0,
        points: [0,40,0,80],
        stroke: 'black',
        strokeWidth: 7
    });

    var redGroup = new Kinetic.Group({
        x: 100,
        y: 100,
        rotationDeg: 40,
        scale: 0.2
    });

    redGroup.add(redPoly);
    redGroup.add(marker);
    layer.add(redGroup);
    stage.add(layer);

//    var stage = Kinetic.Node.create(json, 'draw');

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

                case "r":
                    // second word is rotation in degrees

                    var ang = parseInt(words[1])*Math.PI / 180;
                    console.log("rotation:", ang);

                    var tween = new Kinetic.Tween({
                        node: redGroup,
                        duration: 1,
                        rotation: ang
                    });

                    tween.play();

                    break;

                case "s":
                    // second word is rotation in degrees

                    var sca = parseInt(words[1]) / 100;
                    console.log("scale:", sca);

                    var tween = new Kinetic.Tween({
                        node: redGroup,
                        duration: 1,
                        scaleX: sca,
                        scaleY: sca
                    });

                    tween.play();

                    break;

                case "p":
                    // second word is rotation in degrees

                    var x = parseInt(words[1]);
                    var y = parseInt(words[2]);
                    console.log("position:", x, y);

                    var tween = new Kinetic.Tween({
                        node: redGroup,
                        duration: 1,
                        x: x,
                        y: y
                    });

                    tween.play();

                    break;
                default:
                    break;


            }



    /*
            // one revolution per 4 seconds
            var angularSpeed = Math.PI / 2;
            var anim = new Kinetic.Animation(function(frame) {
                var angleDiff = frame.timeDiff * angularSpeed / 1000;
                redGroup.rotate(angleDiff);
            }, layer);

            anim.start();
   */
   //        redGroup.rotateDeg(Math.random()*180);
   //         layer.draw();

      //      layer.setRotation(45);
         /*
            drawSomething();

            //draw a circle
            ctx.beginPath();
            ctx.arc(Math.random()*75, Math.random()*75, 10, 0, Math.PI*2, true);
            ctx.closePath();
            ctx.fill();
                          */
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
