<?php
// backend/logic/requestHandler.php
require_once "../config/dataHandler.php";
session_start();

$dh = new DataHandler();
$action = $_GET['action'] ?? '';
header('Content-Type: application/json');

function respond($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

if ($action === 'getCategories') {
    respond($dh->getCategories());
} elseif ($action === 'getProducts') {
    $catId = $_GET['category'] ?? 1;
    respond($dh->getProductsByCategory($catId));
} elseif ($action === 'getAllProducts') {
    respond($dh->getAllProducts());
} elseif ($action === 'register') {
    $salutation = trim($_POST['salutation'] ?? '');
    $firstName = trim($_POST['first_name'] ?? '');
    $lastName = trim($_POST['last_name'] ?? '');
    $street = trim($_POST['street'] ?? '');
    $zip = trim($_POST['zip'] ?? '');
    $city = trim($_POST['city'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $username = trim($_POST['username'] ?? '');
    $paymentInfo = trim($_POST['payment_info'] ?? '');
    $password = $_POST['password'] ?? '';
    $passwordConfirm = $_POST['password_confirm'] ?? '';

    if (!$salutation || !$firstName || !$lastName || !$street || !$zip || !$city || !$email || !$username || !$paymentInfo || !$password || !$passwordConfirm) {
        respond(['success' => false, 'message' => 'Bitte alle Pflichtfelder ausfüllen.'], 400);
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        respond(['success' => false, 'message' => 'Ungültige E-Mail-Adresse.'], 400);
    }

    if ($password !== $passwordConfirm) {
        respond(['success' => false, 'message' => 'Passwörter stimmen nicht überein.'], 400);
    }

    if ($dh->getUserByUsernameOrEmail($username)) {
        respond(['success' => false, 'message' => 'Dieser Benutzername ist bereits vergeben.'], 400);
    }

    if ($dh->getUserByUsernameOrEmail($email)) {
        respond(['success' => false, 'message' => 'Diese E-Mail-Adresse ist bereits registriert.'], 400);
    }

    $passwordHash = password_hash($password, PASSWORD_DEFAULT);
    $userData = [
        'salutation' => $salutation,
        'first_name' => $firstName,
        'last_name' => $lastName,
        'street' => $street,
        'zip' => $zip,
        'city' => $city,
        'email' => $email,
        'username' => $username,
        'password_hash' => $passwordHash,
        'payment_info' => $paymentInfo,
        'role' => 'user'
    ];

    $userId = $dh->createUser($userData);
    if ($userId) {
        respond(['success' => true, 'message' => 'Registrierung erfolgreich. Bitte loggen Sie sich ein.'], 201);
    }

    respond(['success' => false, 'message' => 'Registrierung fehlgeschlagen.'], 500);
} elseif ($action === 'login') {
    $identifier = trim($_POST['identifier'] ?? '');
    $password = $_POST['password'] ?? '';
    $remember = isset($_POST['remember']) && $_POST['remember'] === '1';

    if (!$identifier || !$password) {
        respond(['success' => false, 'message' => 'Bitte Benutzername/E-Mail und Passwort eingeben.'], 400);
    }

    $user = $dh->getUserByUsernameOrEmail($identifier);
    if (!$user || !password_verify($password, $user['password_hash']) || !$user['active']) {
        respond(['success' => false, 'message' => 'Ungültige Login-Daten.'], 401);
    }

    $_SESSION['user'] = [
        'id' => $user['id'],
        'username' => $user['username'],
        'first_name' => $user['first_name'],
        'last_name' => $user['last_name'],
        'email' => $user['email'],
        'street' => $user['street'],
        'zip' => $user['zip'],
        'city' => $user['city'],
        'payment_info' => $user['payment_info'],
        'role' => $user['role']
    ];

    if ($remember) {
        $token = bin2hex(random_bytes(32));
        $expiry = time() + 30 * 24 * 60 * 60;
        $dh->setRememberToken($user['id'], $token, $expiry);
        setcookie('remember_token', $token, $expiry, '/');
    }

    respond(['success' => true, 'message' => 'Login erfolgreich.', 'user' => $_SESSION['user']]);
} elseif ($action === 'logout') {
    if (isset($_SESSION['user']['id'])) {
        $dh->clearRememberToken($_SESSION['user']['id']);
    }

    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
    }
    setcookie('remember_token', '', time() - 42000, '/');
    session_destroy();
    respond(['success' => true, 'message' => 'Logout erfolgreich.']);
} elseif ($action === 'checkAuth') {
    if (!empty($_SESSION['user'])) {
        respond(['authenticated' => true, 'user' => $_SESSION['user']]);
    }

    if (!empty($_COOKIE['remember_token'])) {
        $token = $_COOKIE['remember_token'];
        $user = $dh->getUserByRememberToken($token);
        if ($user && $user['remember_expiry'] >= time() && $user['active']) {
            $_SESSION['user'] = [
                'id' => $user['id'],
                'username' => $user['username'],
                'first_name' => $user['first_name'],
                'last_name' => $user['last_name'],
                'email' => $user['email'],
                'street' => $user['street'],
                'zip' => $user['zip'],
                'city' => $user['city'],
                'payment_info' => $user['payment_info'],
                'role' => $user['role']
            ];
            respond(['authenticated' => true, 'user' => $_SESSION['user']]);
        }
        setcookie('remember_token', '', time() - 42000, '/');
    }

    respond(['authenticated' => false]);
}