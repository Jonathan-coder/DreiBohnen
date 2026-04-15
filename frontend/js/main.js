$(document).ready(function() {
    // Basis-Pfad für Komponenten bestimmen
    var basePath = window.location.pathname.indexOf('/sites/') !== -1 ? '../' : '';
    var rootPath = window.location.pathname.indexOf('/sites/') !== -1 ? '../' : '';

    // Header laden
    $('#header-placeholder').load(basePath + 'components/header.html', function(response, status, xhr) {
        if (status === 'error') {
            console.error('Header konnte nicht geladen werden:', xhr.status, xhr.statusText);
            console.log('Gesuchter Pfad:', basePath + 'components/header.html');
            console.log('Aktuelle URL:', window.location.href);
            $('#header-placeholder').html('<header class="bg-dark text-white p-3">Fehler beim Laden des Headers</header>');
        } else {
            $('#header-placeholder .home-link').attr('href', rootPath + 'index.html');
            $('#header-placeholder .products-link').attr('href', rootPath + 'sites/products.html');
            $('#header-placeholder .account-link').attr('href', rootPath + 'sites/account.html');
            $('#header-placeholder .cart-link').attr('href', rootPath + 'sites/cart.html');

            if (typeof checkLoginStatus === 'function') checkLoginStatus();
            if (typeof updateCartCount === 'function') updateCartCount();
        }
    });
    
    // Footer laden
    $('#footer-placeholder').load(basePath + 'components/footer.html', function(response, status, xhr) {
        if (status === 'error') {
            console.error('Footer konnte nicht geladen werden:', xhr.status, xhr.statusText);
            $('#footer-placeholder').html('<footer class="bg-dark text-white p-3">Fehler beim Laden des Footers</footer>');
        } else {
            $('#footer-placeholder .imprint-link').attr('href', rootPath + 'sites/imprint.html');
            $('#footer-placeholder .terms-link').attr('href', rootPath + 'sites/terms.html');
        }
    });
});