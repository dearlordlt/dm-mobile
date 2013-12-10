<?php
	$host = "localhost";
	$name = "dm_user";
	$password = "WQ6hV5ybGGxHEj4S";
	$database = "dm";
	
	$connection = mysql_connect($host, $name, $password);
	mysql_select_db($database, $connection);
	
	mysql_query('SET NAMES utf8');
	mysql_query('SET CHARACTER SET utf8');
	
?>