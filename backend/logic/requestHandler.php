<?php
// backend/logic/requestHandler.php
require_once "../config/dataHandler.php";

$dh = new DataHandler();
$action = $_GET['action'] ?? '';

if ($action === 'getCategories') {
    echo json_encode($dh->getCategories());
} elseif ($action === 'getProducts') {
    $catId = $_GET['category'] ?? 1;
    echo json_encode($dh->getProductsByCategory($catId));
} elseif ($action === 'getAllProducts') {
    echo json_encode($dh->getAllProducts());
}