<?php
header('Access-Control-Allow-Origin: *'); //just for testig, delete after for securito

include('DBConnection.php');
	
function login($username, $password)  {

	$ip = "Mobili aplikacija";
	
	$userid = 0;
	$user_rs = mysql_query("SELECT id, name FROM users WHERE username='".$username."' AND password='".$password."';");
	if (mysql_num_rows($user_rs) < 1) { echo "false"; }
	while($r = mysql_fetch_assoc($user_rs)) {
		$userid = $r['id'];
	}
	if($userid != 0) { 
		$sql = "INSERT INTO users_stats (userid, username, logedin, ip) VALUES('".$userid."', '".$username."', '".date("Y-m-d H:i:s")."', '".$ip."')";
		mysql_query($sql);
		echo "true"; 
	}
}

function showUserStats($username) {
	$user_rs = mysql_query("SELECT * FROM users_stats WHERE username = '".$username."';");
	if (mysql_num_rows($user_rs) < 1) { echo "0"; return; }
	$rows = array();
	while($r = mysql_fetch_assoc($user_rs)) {
		$rows[] = $r;
	}
	print json_encode($rows);
}

function showUserStatsChart($username) {
	$user_rs = mysql_query("SELECT date(`logedin`) as `date`, COUNT(*) as visits from users_stats WHERE username = '".$username."' GROUP BY date(`logedin`);");
	if (mysql_num_rows($user_rs) < 1) { echo "0"; return; }
	$rows = array();
	while($r = mysql_fetch_assoc($user_rs)) {
		$rows[] = $r;
	}
	print json_encode($rows);
}

if(isset($_REQUEST) && !empty($_REQUEST)) {
	if($_REQUEST['action'] == "login") {
		login($_REQUEST['username'], $_REQUEST['password']);
	}
	if($_REQUEST['action'] == "stats") {
		showUserStats($_REQUEST['username']);
	}
	if($_REQUEST['action'] == "statsChart") {
		showUserStatsChart($_REQUEST['username']);
	}
}

?>