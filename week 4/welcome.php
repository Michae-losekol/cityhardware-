<?php
session_start();

$_SESSION["user"] = "Michael";

echo "Welcome " .
$_SESSION["user"];
?>