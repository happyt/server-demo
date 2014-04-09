var socket = io.connect();

function addMessage(message, nickname) {
    if (nickname == "" || nickname == null) {
        msg = message;
    } else {
        msg = nickname + ' : ' + message;
    }
    $("#chatEntries").append('<div class="message"><p>' + msg + '</p></div>');
}

function sentMessage() {
    if ($('#messageInput').val() != "")
    {
        socket.emit('message', $('#messageInput').val());
        addMessage($('#messageInput').val(), "Me", new Date().toISOString(), true);
        $('#messageInput').val('');
    }
}

function setNickname() {
    if ($("#nicknameInput").val() != "")
    {
        socket.emit('setNickname', $("#nicknameInput").val());
        $('#chatControls').show();
        $('#nicknameInput').hide();
        $('#setNickname').hide();
    }
}

socket.on('message', function(data) {
    addMessage(data['message'], data['nickname']);
});

$(function() {
    $("#chatControls").hide();
    $("#setNickname").click(function() {setNickname()});
    $("#submit").click(function() {sentMessage();});
});

