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

function showUserSocCap($username, $avatarid) {
	$json = array();
	$userid = 0;
	$user_rs = mysql_query("SELECT id FROM users WHERE username='".$username."';");
	while($r = mysql_fetch_assoc($user_rs)) { $userid = $r['id']; array_push($json, array('userid' => $userid)); }
	
	//$user_vars = mysql_query("SELECT COUNT(*) FROM avatar_vars where ");
	
	print json_encode($json);
}

function showUserAvatars($username) {
	$json = array();
	$userid = 0;
	$user_rs = mysql_query("SELECT id FROM users WHERE username='".$username."';");
	while($r = mysql_fetch_assoc($user_rs)) { $userid = $r['id']; }
	
	$avatars_rs = mysql_query("SELECT * FROM avatars WHERE user_id = ".$userid.";");
	while($r = mysql_fetch_assoc($avatars_rs)) { $json[] = $r; }
	
	print json_encode($json);
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
	if($_REQUEST['action'] == "socCap") {
		showUserSocCap($_REQUEST['username'], $_REQUEST['avatarid']);
	}
	if($_REQUEST['action'] == "avatars") {
		showUserAvatars($_REQUEST['username']);
	}
}

?>