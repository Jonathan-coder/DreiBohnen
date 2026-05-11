<?php
// backend/config/dbaccess.php
$host = "localhost";
$user = "root";
$password = "";
$database = "dreibohnen";

$db = new mysqli($host, $user, $password, $database);
if ($db->connect_error) {
    die("Verbindung fehlgeschlagen: " . $db->connect_error);
}