<?php
// backend/config/dataHandler.php
require_once "dbaccess.php";

class DataHandler {
    public function getProductsByCategory($categoryId) {
        global $db;
        $stmt = $db->prepare("SELECT * FROM products WHERE category_id = ?");
        $stmt->bind_param("i", $categoryId);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    public function getCategories() {
        global $db;
        $result = $db->query("SELECT * FROM categories");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function getAllProducts() {
        global $db;
        $result = $db->query("SELECT * FROM products");
        return $result->fetch_all(MYSQLI_ASSOC);
    }
}