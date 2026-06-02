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

    public function getUserByUsernameOrEmail($identifier) {
        global $db;
        $stmt = $db->prepare("SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1");
        $stmt->bind_param("ss", $identifier, $identifier);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public function createUser($userData) {
        global $db;
        $stmt = $db->prepare("INSERT INTO users (salutation, first_name, last_name, street, zip, city, email, username, password_hash, payment_info, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param(
            "sssssssssss",
            $userData['salutation'],
            $userData['first_name'],
            $userData['last_name'],
            $userData['street'],
            $userData['zip'],
            $userData['city'],
            $userData['email'],
            $userData['username'],
            $userData['password_hash'],
            $userData['payment_info'],
            $userData['role']
        );
        return $stmt->execute() ? $stmt->insert_id : false;
    }

    public function getUserByRememberToken($token) {
        global $db;
        $stmt = $db->prepare("SELECT * FROM users WHERE remember_token = ? LIMIT 1");
        $stmt->bind_param("s", $token);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public function setRememberToken($userId, $token, $expiry) {
        global $db;
        $stmt = $db->prepare("UPDATE users SET remember_token = ?, remember_expiry = ? WHERE id = ?");
        $stmt->bind_param("sii", $token, $expiry, $userId);
        return $stmt->execute();
    }

    public function clearRememberToken($userId) {
        global $db;
        $stmt = $db->prepare("UPDATE users SET remember_token = NULL, remember_expiry = NULL WHERE id = ?");
        $stmt->bind_param("i", $userId);
        return $stmt->execute();
    }

    public function getProductById($productId) {
    global $db;
    $stmt = $db->prepare("SELECT * FROM products WHERE id = ?");
    $stmt->bind_param("i", $productId);
    $stmt->execute();
    return $stmt->get_result()->fetch_assoc();
    }

    public function searchProducts($query) {
    global $db;
    $searchTerm = "%" . $query . "%";
    $stmt = $db->prepare("SELECT * FROM products WHERE name LIKE ? OR description LIKE ?");
    $stmt->bind_param("ss", $searchTerm, $searchTerm);
    $stmt->execute();
    return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
}
}