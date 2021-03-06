/**
 * Created by Saras on 13.11.12.
 */
console.log("ES Script loaded");

canvasApp();

function canvasSupport () {
    return Modernizr.canvas;
}

function canvasApp () {

    console.log("ES Script Initialised");

    if (!canvasSupport()) {
        return;
    }

    var theCanvas = document.getElementById("canvasOne");
    var context = theCanvas.getContext("2d");

    var formElement = document.getElementById("sendChat");
    formElement.addEventListener('click', sendMessage, false);

    function drawScreen() {
        //background
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, 500, 320);

        context.fillStyle = "#000000";
        context.font = "10px Helvetica";
        context.textBaseline = "top";

        //box
        context.strokeStyle = '#000000';
        context.strokeRect(2, 2, 490, 310);

        var starty = 15;
        var maxMessages = 22;


        //status box
        context.strokeStyle = '#000000';
        context.strokeRect(345,  10, 145, 285);
        var starti = 0;

        if (statusMessages.length > maxMessages) {
            starti = (statusMessages.length) - maxMessages;

        }
        for (var i = starti;i< statusMessages.length;i++) {
            context.fillText  (statusMessages[i], 350, starty );
            starty+=12;
        }

        //chat box
        context.strokeStyle = '#000000';
        context.strokeRect(10,  10, 335, 285);

        starti = 0;
        lastMessage = chatMessages.length-1;
        if (chatMessages.length > maxMessages) {
            starti = (chatMessages.length) - maxMessages;
        }
        starty = 15;
        for (var i = starti;i< chatMessages.length;i++) {
            context.fillText  (chatMessages[i], 10, starty );
            starty+=12;
        }

        context.fillText  ("User Name:" + username, 10, 295 );

    }

    var statusMessages = new Array();
    var chatMessages = new Array();

    var server = new ElectroServer.Server("server1");

    statusMessages.push(server);

    var availableConnection = new ElectroServer.AvailableConnection
        ("vds000004.hosto.lt", 8989, ElectroServer.TransportType.BinaryHTTP);

    server.addAvailableConnection(availableConnection);

    var es = new ElectroServer();
    es.initialize();

    var username;
    var _room;

    es.engine.addServer(server);

    es.engine.addEventListener(MessageType.ConnectionResponse, onConnectionResponse);
    es.engine.addEventListener(MessageType.LoginResponse, onLoginResponse);
    es.engine.addEventListener(MessageType.JoinRoomEvent, onJoinRoomEvent);
    es.engine.addEventListener(MessageType.JoinZoneEvent, onJoinZoneEvent);
    es.engine.addEventListener(MessageType.ConnectionAttemptResponse,
        onConnectionAttemptResponse);
    es.engine.addEventListener(MessageType.PublicMessageEvent, onPublicMessageEvent);

    es.engine.connect();

    statusMessages.push("Connecting...");

    setInterval(drawScreen, 33);

    function onConnectionAttemptResponse(event) {
        statusMessages.push("connection attempt response!!");
    }

    function onJoinRoomEvent(event) {
        statusMessages.push("joined a room");
        _room = es.managerHelper.zoneManager.zoneById
            (event.zoneId).roomById(event.roomId);
        var formElement = document.getElementById("inputForm");
        formElement.setAttribute("style", "display:true");
    }

    function onJoinZoneEvent(event) {
        statusMessages.push("joined a zone");

    }

    function onConnectionResponse(event) {
        statusMessages.push("Connect Successful?: "+event.successful);
        var r = new LoginRequest();
        //r.userName = "DarnusMobile_" + Math.floor(Math.random() * 1000);
        console.log("es.js: "+window.logedInUser);
        r.userName = window.logedInUser;
        es.engine.send(r);
    }

    function onLoginResponse(event) {
        statusMessages.push("Login Successful?: "+event.successful);

        username = event.userName;
        //username = $("#username").val();

        var crr = new CreateRoomRequest();
        crr.zoneName = "TestZoneChat";
        crr.roomName = "TestRoomChat";

        es.engine.send(crr);
    }

    function sendMessage(event) {
        var formElement = document.getElementById("textBox");
        var pmr = new PublicMessageRequest();
        pmr.message = "";
        pmr.roomId = _room.id;
        pmr.zoneId = _room.zoneId;
        var esob = new ElectroServer.EsObject();
        esob.setString("message", formElement.value);
        esob.setString("type","chatmessage");
        pmr.esObject = esob;
        es.engine.send(pmr);
        statusMessages.push("message sent")
    }

    function onPublicMessageEvent(event) {

        var esob = event.esObject;
        statusMessages.push("message received")
        if (esob.getString("type") == "chatmessage") {

            chatMessages.push(event.userName + ":" + esob.getString("message"));

        }

    }

}