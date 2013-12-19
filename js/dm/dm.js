/**
 * Created by Saras on 13.11.12.
 */

$("#content").hide(0);
$("#loginerror").hide(0);
$("#chat").hide(0);
$('#dm_chat').hide(0);
$('#stats').hide(0);
$('#profile').hide(0);

$("#btnlogin").click(function(){
    $.ajax({
        type: 'GET',
        url: 'http://vds000004.hosto.lt/dm-mobile/php/Users.php',
        data: {
            action: "login", username: $("#username").val(),  password: $("#password").val()
        },
        success: function(msg){
            console.log('login response: ' + msg);
            if(msg == "true") {
                window.logedInUser = $("#username").val();
                console.log("dm.js: "+window.logedInUser);
                //$("#chat").toggle();
                $("#content").toggle(400);
                $('#dm_chat').toggle(400);
                $("#login").toggle(400);

                initChatApp();
            }
            else {
                $("#loginerror").show(400);
            }
        }
    });
});

$("#toggleStatus").click(function(){
    $("#chatStatus").toggle(300);
});

/**
* User stats stuff
*/

function showAvatars() {
    $("#avatarStatsBody").hide();
    $.ajax({
        type: 'GET',
        url: 'http://vds000004.hosto.lt/dm-mobile/php/Users.php',
        data: {
            action: "avatars", username: window.logedInUser
        },
        success: function(msg){
            if(msg == "0") {
                $("#avatars_panel").html("<div class='alert alert-danger'>Vartotojas neturi avatarų</div>");
                return;
            }
            var stats = $.parseJSON(msg);
            $("#avatars_panel").html("");
            for(var i = 0; i < stats.length; i++) {
                $("#avatars_panel").append(
                    "<a class='btn btn-primary  btn-xs' onclick='loadAvatarStats("+stats[i].id+");return false;'>@" + stats[i].name + "</a>&nbsp;"
                );
            }
        }
    });
}

function loadAvatarStats(aid) {
    $("#avatarStatsBody").show(300);

    $.ajax({
        type: 'GET',
        url: 'http://vds000004.hosto.lt/dm-mobile/php/Users.php',
        data: {
            action: "socCap", username: window.logedInUser, avatarid: aid
        },
        success: function(msg){
            if(msg == "0") {
                $("#soccap").html("<div class='alert alert-danger'>Avataras neturi duomenų</div>");
                return;
            }
            var stats = $.parseJSON(msg);
            $("#soccapul").html("");
            var totalSK = parseInt(stats[0].vars) + parseInt(stats[0].fr) + parseInt(stats[0].items) + parseInt(stats[0].quests) + parseInt(stats[0].stats);
            $("#soccapul").append(
                '<li class="list-group-item"><a href="#" class="list-group-item active">Socialinio kapitalo kooficientas: <span class="badge">' +
                    totalSK +
                    '</span></a></li>'
            );

            $("#soccapul").append(
                '<li class="list-group-item">Veikėjo veiksmai: <span class="badge">' + stats[0].vars + '</span></li>'
            );

            $("#soccapul").append(
                '<li class="list-group-item">Veikėjo draugai: <span class="badge">' + stats[0].fr + '</span></li>'
            );

            $("#soccapul").append(
                '<li class="list-group-item">Veikėjo turtas: <span class="badge">' + stats[0].items + '</span></li>'
            );

            $("#soccapul").append(
                '<li class="list-group-item">Veikėjo interakcijos: <span class="badge">' + stats[0].quests + '</span></li>'
            );

            $("#soccapul").append(
                '<li class="list-group-item">Veikėjo aktyvumas: <span class="badge">' + stats[0].stats + '</span></li>'
            );
        }
    });
}

$("#progress_stats").click(function(){
    $("#p_stats_body").toggle(300);
});
$("#alert_stats").click(function(){
    $("#alert_panel").hide(300);
});
$("#getUserStatsBtn").click(function() {
    $("#userStats").html("<tr><td colspan='5'><div class='alert alert-warning'>Duomenys kraunami</div></td></tr>");
    $("#chartContainer").css( "display" , "none");
    $.ajax({
        type: 'GET',
        url: 'http://vds000004.hosto.lt/dm-mobile/php/Users.php',
        data: {
            action: "stats", username: $("#userNameStats").val()
        },
        success: function(msg){
            if(msg == "0") {
                $("#userStats").html("<tr><td colspan='5'><div class='alert alert-danger'>Vartotojas nerastas arba nebuvo pasijungęs nuo 2013-12-10 10:00:00</div></td></tr>");
                return;
            }
            var stats = $.parseJSON(msg);
            $("#userStats").html("");
            for(var i = 0; i < stats.length; i++) {
                $("#userStats").append(
                    "<tr><td>"+stats[i].id+"</td> <td>"+stats[i].userid+"</td> <td>"+stats[i].username+"</td> <td>"+stats[i].logedin+"</td> <td>"+stats[i].ip+"</td> </tr>"
                );
            }
        }
    });

    $.ajax({
        type: 'GET',
        url: 'http://vds000004.hosto.lt/dm-mobile/php/Users.php',
        data: {
            action: "statsChart", username: $("#userNameStats").val()
        },
        success: function(msg){
            if(msg == "0") {
                //alert("no results");
                $("#chartContainer").css( "display" , "none");
            } else {
                var stats = $.parseJSON(msg);
                $("#chartContainer").css( "display" , "inline-table");
                var days = [];
                var visits = [];
                for(var i = 0; i < stats.length; i++) {
                    days.push(stats[i].date);
                    visits.push(parseInt(stats[i].visits));
                }

                $(function () {
                    $('#chartContainer').highcharts({
                        chart: {
                            renderTo: 'chartContainer',
                            type: 'line'
                        },
                        title: {
                            text: "Vartotojo `" + $("#userNameStats").val() + "` - lankomumas"
                        },
                        xAxis: {
                            categories: days
                        },
                        yAxis: {
                            title: {
                                text: 'Apsilankymai'
                            }
                        },
                        series: [{
                            name: $("#userNameStats").val(),
                            data: visits
                        }]
                    });
                });
            }
        }
    });
});

/**
 * Facebook stuff
 */
function applyFacebookProfile() {
    $.ajaxSetup({ cache: true });
    $.getScript('//connect.facebook.net/en_UK/all.js', function(){
        FB.init({
            appId: '592501834152367'
        });
        $('#loginbutton,#feedbutton').removeAttr('disabled');
        FB.getLoginStatus(updateStatusCallback);
    });
}

/**
 * Meniu stuff
 */
$("#meniuChat").click(function(){
    $("#chat").hide(300);
    $('#dm_chat').show(300);
    $('#stats').hide(300);
    $('#profile').hide(300);
});

$("#meniuProfle").click(function(){
    $("#chat").hide(300);
    $('#dm_chat').hide(300);
    $('#stats').hide(300);
    $('#profile').show(300);

    $('#hUser').html(window.logedInUser);

    applyFacebookProfile();
});

$("#meniuStats").click(function(){
    $("#chat").hide(300);
    $('#dm_chat').hide(300);
    $('#stats').show(300);
    $('#profile').hide(300);

    $("#usersPerDay").html(Math.floor((Math.random()*2)+1) + 40);
    $("#regsPerDay").html(Math.floor((Math.random()*1)+1) + 5);
    $("#serverPerDay").html(Math.floor((Math.random()*20)+1) + 60);
    $("#dialogsPerDay").html(Math.floor((Math.random()*25)+1) + 80);

    $("#chartContainer").css( "height" , "0px");

    showAvatars();
});

/**
 * Electroserver stuff
 */

var statusMessagesCount = 0;
function newStatusMessage(msg) {
    statusMessagesCount ++;  var o = new Option(msg, statusMessagesCount);
    $(o).html(msg); $("#statusWindow").append(o);
    $("#statusWindow").animate({ scrollTop: $('#statusWindow')[0].scrollHeight}, 250);
}

function initChatApp() {

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
    es.engine.addEventListener(MessageType.ConnectionAttemptResponse, onConnectionAttemptResponse);
    es.engine.addEventListener(MessageType.PublicMessageEvent, onPublicMessageEvent);

    es.engine.connect();

    $("#chatBtn").click(function(){
        sendMessage();
    });

    $(document).keypress(function(e) {
        if(e.which == 13) {
            sendMessage();
        }
    });

    newStatusMessage("Connecting...");

    function onConnectionAttemptResponse(event) {
        newStatusMessage("connection attempt response!!");
    }

    function onJoinRoomEvent(event) {
        newStatusMessage("joined a room");
        _room = es.managerHelper.zoneManager.zoneById
            (event.zoneId).roomById(event.roomId);
    }

    function onJoinZoneEvent(event) {
        newStatusMessage("joined a zone");
    }

    function onConnectionResponse(event) {
        newStatusMessage("Connect Successful?: "+event.successful);
        var r = new LoginRequest();
        //r.userName = "DarnusMobile_" + Math.floor(Math.random() * 1000);
        console.log("es.js: "+window.logedInUser);
        r.userName = window.logedInUser + ":from mobile("+Math.floor(Math.random() * 1000)+")";
        es.engine.send(r);
    }

    function onLoginResponse(event) {
        newStatusMessage("Login Successful?: "+event.successful);

        username = event.userName;

        var crr = new CreateRoomRequest();
        crr.zoneName = "TestZoneChat";
        crr.roomName = "TestRoomChat";

        es.engine.send(crr);
    }

    function sendMessage() {
        var msg = $("#focusedInput").val();
        if(msg == "") return;
        var pmr = new PublicMessageRequest();
        pmr.message = "";
        pmr.roomId = _room.id;
        pmr.zoneId = _room.zoneId;
        var esob = new ElectroServer.EsObject();
        esob.setString("message", msg);
        esob.setString("type","chatmessage");
        pmr.esObject = esob;
        es.engine.send(pmr);
        $("#focusedInput").val("");
        newStatusMessage("message sent: &quot;"+msg+"&quot;")
    }

    function onPublicMessageEvent(event) {
        var esob = event.esObject;
        newStatusMessage("message received")
        if (esob.getString("type") == "chatmessage") {
            var msg = event.userName + ":" + esob.getString("message");
            chatMessages.push(msg);
            $("#chatWindow").val( $("#chatWindow").val() + "\n" + msg);
            $("#chatWindow").animate({ scrollTop: $('#chatWindow')[0].scrollHeight}, 500);
        }
    }
}

