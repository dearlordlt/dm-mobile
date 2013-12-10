/**
 * Created by Saras on 13.12.10.
 */

window.fbAsyncInit = function() {
    FB.init({appId: '592501834152367', status: true, cookie: true, xfbml: true});

    /* All the events registered */
    FB.Event.subscribe('auth.login', function(response) {
        // do something with response
        login();
    });
    FB.Event.subscribe('auth.logout', function(response) {
        // do something with response
        logout();
    });

    FB.getLoginStatus(function(response) {
        if (response.session) {
            // logged in and connected user, someone you know
            login();
        }
    });
};
(function() {
    var e = document.createElement('script');
    e.type = 'text/javascript';
    e.src = document.location.protocol +
        '//connect.facebook.net/en_US/all.js';
    e.async = true;
    document.getElementById('fb-root').appendChild(e);
}());

function login(){
    FB.api('/me', function(response) {
        document.getElementById('login').style.display = "block";
        document.getElementById('login').innerHTML = response.name + " succsessfully logged in!";
    });
}
function logout(){
    document.getElementById('login').style.display = "none";
}

//stream publish method
function streamPublish(name, description, hrefTitle, hrefLink, userPrompt){
    FB.ui(
        {
            method: 'stream.publish',
            message: '',
            attachment: {
                name: name,
                caption: '',
                description: (description),
                href: hrefLink
            },
            action_links: [
                { text: hrefTitle, href: hrefLink }
            ],
            user_prompt_message: userPrompt
        },
        function(response) {

        });

}
function showStream(){
    FB.api('/me', function(response) {
    });
    //console.log(response.id);
    streamPublish(response.name, 'Sveiki, mes esame unikalaus projekto – mokomojo simuliacinio žaidimo kūrėjai! Siekiame sukurti edukacinį žaidimą – virtualią erdvę, į kurią galėtų persikelti dalis mokymosi veiklos', 'Darnus Miestas', 'http://darnus-miestas.lt', "pasidalink darniu miestu");
}

function share(){
    var share = {
        method: 'stream.share',
        u: 'http://darnus-miestas.lt/'
    };

    FB.ui(share, function(response) { console.log(response); });
}

function graphStreamPublish(){
    var body = 'Darnus Miestas - Mokomasis simuliacinis žaidimas';
    FB.api('/me/feed', 'post', { message: body }, function(response) {
        if (!response || response.error) {
            alertfb('Error occured');
        } else {
            alertfb('Post ID: ' + response.id);
        }
    });
}

function fqlQuery(){
    FB.api('/me', function(response) {
        var query = FB.Data.query('select name, hometown_location, sex, pic_square from user where uid={0}', response.id);
        query.wait(function(rows) {

            document.getElementById('name').innerHTML =
                'Your name: ' + rows[0].name + "<br />" +
                    '<img src="' + rows[0].pic_square + '" alt="" />' + "<br />";
        });
    });
}

function setStatus(){
    status1 = document.getElementById('status').value;
    FB.api(
        {
            method: 'status.set',
            status: status1
        },
        function(response) {
            if (response == 0){
                alertfb('Your facebook status not updated. Give Status Update Permission.');
            }
            else{
                alertfb('Your facebook status updated');
            }
        }
    );
}

function alertfb(msg) {
    $("#fbAlert").html(msg);
}