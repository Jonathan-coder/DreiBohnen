/**
 * auth.js
 * Authentifizierungsfunktionen für Login, Registrierung und Logout.
 */

function getAuthApiUrl() {
    var path = window.location.pathname;
    if (path.indexOf('/sites/') !== -1) {
        return '../../backend/logic/requestHandler.php';
    }
    return '../backend/logic/requestHandler.php';
}

function getPageLink(page) {
    return window.location.pathname.indexOf('/sites/') !== -1 ? page : 'sites/' + page;
}

function renderGuestArea() {
    var accountNav = document.getElementById('accountNav');
    if (accountNav) {
        accountNav.style.display = 'none';
    }
    var authArea = document.getElementById('authArea');
    if (authArea) {
        authArea.innerHTML = `
            <a class="btn btn-outline-light btn-sm me-2" href="${getPageLink('login.html')}">Login</a>
            <a class="btn btn-outline-light btn-sm" href="${getPageLink('register.html')}">Registrieren</a>`;
    }
}

function renderUserArea(user) {
    var accountNav = document.getElementById('accountNav');
    if (accountNav) {
        accountNav.style.display = 'block';
    }
    var authArea = document.getElementById('authArea');
    if (authArea) {
        authArea.innerHTML = `
            <span class="text-white me-3">Hallo, ${htmlspecialchars(user.first_name)}</span>
            <button id="logoutButton" class="btn btn-outline-light btn-sm">Ausloggen</button>`;
    }
    var logoutBtn = document.getElementById('logoutButton');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            logout();
        });
    }
}

function htmlspecialchars(text) {
    if (typeof text !== 'string') {
        return text;
    }
    return text.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function showMessage(targetId, message, type) {
    var target = document.getElementById(targetId);
    if (!target) {
        console.warn('Message target not found:', targetId);
        return;
    }
    var alertType = type === 'success' ? 'alert-success' : 'alert-danger';
    target.innerHTML = '<div class="alert ' + alertType + ' mt-3" role="alert">' + htmlspecialchars(message) + '</div>';
}

function checkLoginStatus() {
    $.ajax({
        url: getAuthApiUrl(),
        method: 'GET',
        data: { action: 'checkAuth' },
        dataType: 'json'
    }).done(function(response) {
        if (response.authenticated) {
            renderUserArea(response.user);
        } else {
            renderGuestArea();
        }
    }).fail(function() {
        renderGuestArea();
    });
}

function handleLoginForm(event) {
    event.preventDefault();
    var identifier = $('#loginIdentifier').val().trim();
    var password = $('#loginPassword').val();
    var remember = $('#loginRemember').is(':checked');

    if (!identifier || !password) {
        showMessage('loginMessage', 'Bitte Benutzername/E-Mail und Passwort eingeben.', 'error');
        return;
    }

    $.ajax({
        url: getAuthApiUrl() + '?action=login',
        method: 'POST',
        dataType: 'json',
        data: {
            identifier: identifier,
            password: password,
            remember: remember ? '1' : '0'
        }
    }).done(function(response) {
        if (response.success) {
            window.location.href = window.location.pathname.indexOf('/sites/') !== -1 ? 'account.html' : 'sites/account.html';
        } else {
            showMessage('loginMessage', response.message || 'Login fehlgeschlagen.', 'error');
        }
    }).fail(function() {
        showMessage('loginMessage', 'Serverfehler beim Login.', 'error');
    });
}

function handleRegisterForm(event) {
    event.preventDefault();
    var form = $('#registerForm');
    var password = $('#registerPassword').val();
    var passwordConfirm = $('#registerPasswordConfirm').val();

    if (password !== passwordConfirm) {
        showMessage('registerMessage', 'Passwörter stimmen nicht überein.', 'error');
        return;
    }

    $.ajax({
        url: getAuthApiUrl() + '?action=register',
        method: 'POST',
        dataType: 'json',
        data: form.serialize()
    }).done(function(response) {
        if (response.success) {
            showMessage('registerMessage', response.message || 'Registrierung erfolgreich.', 'success');
            setTimeout(function() {
                window.location.href = window.location.pathname.indexOf('/sites/') !== -1 ? 'login.html' : 'sites/login.html';
            }, 1200);
        } else {
            showMessage('registerMessage', response.message || 'Registrierung fehlgeschlagen.', 'error');
        }
    }).fail(function() {
        showMessage('registerMessage', 'Serverfehler bei der Registrierung.', 'error');
    });
}

function logout() {
    $.ajax({
        url: getAuthApiUrl() + '?action=logout',
        method: 'POST',
        dataType: 'json'
    }).done(function(response) {
        renderGuestArea();
        window.location.href = window.location.pathname.indexOf('/sites/') !== -1 ? '../index.html' : 'index.html';
    }).fail(function() {
        renderGuestArea();
        window.location.href = window.location.pathname.indexOf('/sites/') !== -1 ? '../index.html' : 'index.html';
    });
}

function initAuthPage() {
    if ($('#loginForm').length > 0) {
        $('#loginForm').on('submit', handleLoginForm);
    }
    if ($('#registerForm').length > 0) {
        $('#registerForm').on('submit', handleRegisterForm);
    }
    if ($('#accountPage').length > 0) {
        $.ajax({
            url: getAuthApiUrl(),
            method: 'GET',
            data: { action: 'checkAuth' },
            dataType: 'json'
        }).done(function(response) {
            if (!response.authenticated) {
                window.location.href = window.location.pathname.indexOf('/sites/') !== -1 ? 'login.html' : 'sites/login.html';
                return;
            }
            $('#accountName').text(response.user.first_name + ' ' + response.user.last_name);
            $('#accountEmail').text(response.user.email);
            $('#accountAddress').text(response.user.street + ', ' + response.user.zip + ' ' + response.user.city);
            $('#accountPayment').text(response.user.payment_info);
            $('#logoutButtonAccount').on('click', logout);
        }).fail(function() {
            window.location.href = window.location.pathname.indexOf('/sites/') !== -1 ? 'login.html' : 'sites/login.html';
        });
    }
}

$(document).ready(function() {
    if (typeof checkLoginStatus === 'function') {
        checkLoginStatus();
    }
    initAuthPage();
});
