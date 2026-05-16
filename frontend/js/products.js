/**
 * products.js
 * Verwaltung von Produkten, Kategorien, Live-Suche und Drag'n'Drop
 */

// API-Basis-URL
const API_URL = 'http://localhost/DreiBohnen/backend/logic/requestHandler.php';
const PRODUCT_PICTURES_PATH = 'http://localhost/DreiBohnen/backend/productpictures/';

/**
 * Initialisiert die Produktseite
 */
function initProductsPage() {
    // Event Handler ZUERST binden
    attachEventHandlers();
    // Dann Daten laden
    loadCategories();
    loadAllProducts();
}

/**
 * Bindet alle Event-Handler (Klicks, Live-Suche und Drag'n'Drop)
 */
function attachEventHandlers() {
    // 1. Kategorie-Filter Klick
    $(document).on('click', '.category-btn', function () {
        var categoryId = String($(this).data('category'));
        console.log('Kategorie geklickt:', categoryId);
        // Suchfeld leeren, wenn eine Kategorie aktiv gewählt wird
        $('#product-search').val('');
        filterProductsByCategory(categoryId);
    });

    // 2. Normaler Button-Klick: "In den Warenkorb"
    $(document).on('click', '.add-to-cart', function () {
        var productId = $(this).data('product-id');
        executeAddToCart(productId);
    });

    // 3. Continuous Search Filter (Live-Suche beim Tippen)
    $(document).on('input', '#product-search', function () {
        var query = $(this).val().trim();
        console.log('Suche nach:', query);

        if (query.length > 0) {
            // Kategorie-Buttons optisch deaktivieren, da wir global suchen
            $('.category-btn').removeClass('active');

            $.ajax({
                url: API_URL + '?action=searchProducts',
                method: 'GET',
                data: { query: query },
                dataType: 'json'
            }).done(function (products) {
                console.log('Suchergebnisse erhalten:', products.length);
                renderProducts(products);
            }).fail(function (xhr) {
                console.error('Fehler bei der Produktsuche:', xhr);
            });
        } else {
            // Wenn das Suchfeld komplett leergeräumt wird, wieder alle Produkte zeigen
            filterProductsByCategory('all');
        }
    });

    // 4. Drag & Drop: Event beim Starten des Ziehens (auf der Produktkarte)
    $(document).on('dragstart', '.draggable-product', function (e) {
        var productId = $(this).data('product-id');
        // Die ID des gezogenen Produkts im Browser-Übertragungsobjekt merken
        e.originalEvent.dataTransfer.setData('text/plain', productId);
        $(this).css('opacity', '0.5'); // Karte beim Ziehen leicht transparent machen
    });

    $(document).on('dragend', '.draggable-product', function () {
        $(this).css('opacity', '1.0'); // Nach dem Loslassen wieder normal anzeigen
    });

    // 5. Drag & Drop: Event wenn das Produkt über das Warenkorb-Symbol bewegt wird
    $(document).on('dragover', '.cart-link', function (e) {
        e.preventDefault(); // Zwingend notwendig, damit ein Drop erlaubt wird!
        $(this).addClass('cart-drag-hover'); // CSS-Klasse für visuelles Feedback aktivieren
    });

    $(document).on('dragleave', '.cart-link', function () {
        $(this).removeClass('cart-drag-hover'); // Feedback entfernen, wenn man herauszieht
    });

    $(document).on('drop', '.cart-link', function (e) {
        e.preventDefault();
        $(this).removeClass('cart-drag-hover');

        // Produkt-ID aus dem Übertragungsobjekt auslesen
        var productId = e.originalEvent.dataTransfer.getData('text/plain');
        if (productId) {
            console.log('Produkt via Drag\'n\'Drop abgelegt. ID:', productId);
            executeAddToCart(productId);
        }
    });
}

/**
 * Filtert Produkte nach Kategorie
 */
function filterProductsByCategory(categoryId) {
    categoryId = String(categoryId);
    console.log('Filtere Produkte für Kategorie:', categoryId);

    $('.category-btn').removeClass('active');
    $('[data-category="' + categoryId + '"]').addClass('active');

    if (categoryId === 'all') {
        loadAllProducts();
    } else {
        loadProductsByCategory(categoryId);
    }
}

/**
 * Lädt alle verfügbaren Kategorien und erstellt Filter-Buttons
 */
function loadCategories() {
    $.ajax({
        url: API_URL,
        type: 'GET',
        data: { action: 'getCategories' },
        dataType: 'json',
        success: function (categories) {
            renderCategoryButtons(categories);
        },
        error: function (xhr, status, error) {
            console.error('Fehler beim Laden der Kategorien:', error);
        }
    });
}

/**
 * Rendert die Kategorie-Buttons
 */
function renderCategoryButtons(categories) {
    var html = '<button type="button" class="btn btn-outline-primary category-btn active" data-category="all">Alle Kategorien</button>';
    $.each(categories, function (index, category) {
        html += '<button type="button" class="btn btn-outline-primary category-btn" data-category="' + category.id + '">' + category.name + '</button>';
    });
    $('#category-buttons').html(html);
}

/**
 * Lädt alle Produkte
 */
function loadAllProducts() {
    $.ajax({
        url: API_URL,
        type: 'GET',
        data: { action: 'getAllProducts' },
        dataType: 'json',
        success: function (products) {
            renderProducts(products);
        },
        error: function (xhr, status, error) {
            console.error('Fehler beim Laden der Produkte:', error);
            showErrorMessage('Fehler beim Laden der Produkte');
        }
    });
}

/**
 * Lädt Produkte einer bestimmten Kategorie
 */
function loadProductsByCategory(categoryId) {
    $.ajax({
        url: API_URL,
        type: 'GET',
        data: { action: 'getProducts', category: categoryId },
        dataType: 'json',
        success: function (products) {
            renderProducts(products);
        },
        error: function (xhr, status, error) {
            console.error('Fehler beim Laden der Produkte:', error);
            showErrorMessage('Fehler beim Laden der Produkte');
        }
    });
}

/**
 * Rendert die Produkte im Grid
 */
function renderProducts(products) {
    if (products.length === 0) {
        showEmptyMessage('Keine Produkte gefunden.');
        return;
    }
    var html = '';
    $.each(products, function (index, product) {
        html += createProductCard(product);
    });
    $('#product-list').html(html);
}

/**
 * Erstellt eine Produktkarte (Jetzt mit Draggable-Attributen für US-PROD-06!)
 */
function createProductCard(product) {
    var ratingStars = generateStars(product.rating);
    var imagePath = PRODUCT_PICTURES_PATH + product.image;
    var price = parseFloat(product.price).toFixed(2);

    // HIER WURDE draggable="true" und data-product-id an die äußere Karte gehängt
    var card = '<div class="col-md-6 col-lg-4 mb-4">' +
        '<div class="card product-card h-100 shadow-sm draggable-product" draggable="true" data-product-id="' + product.id + '">' +
        '<div class="product-image-container">' +
        '<img src="' + imagePath + '" class="card-img-top product-image" alt="' + product.name + '" onerror="this.src=\'' + PRODUCT_PICTURES_PATH + 'default.png\'">' +
        '</div>' +
        '<div class="card-body d-flex flex-column">' +
        '<h5 class="card-title">' + product.name + '</h5>' +
        '<p class="card-text text-muted">' + product.description + '</p>' +
        '<div class="rating-stars mb-3">' + ratingStars + '</div>' +
        '<div class="mt-auto">' +
        '<div class="price-row mb-3">' +
        '<span class="product-price">' + price + ' €</span>' +
        '</div>' +
        '<button class="btn btn-primary w-100 add-to-cart" data-product-id="' + product.id + '">In den Warenkorb</button>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';

    return card;
}

/**
 * Zeigt eine Fehlermeldung an
 */
function showErrorMessage(message) {
    $('#product-list').html('<p class="alert alert-danger">' + message + '</p>');
}

/**
 * Zeigt eine Nachricht für leere Liste an
 */
function showEmptyMessage(message) {
    $('#product-list').html('<div class="alert alert-info w-100">' + message + '</div>');
}

/**
 * Zentrale Hilfsfunktion zum Ausführen des AJAX-Warenkorb-Calls
 */
function executeAddToCart(productId) {
    $.ajax({
        url: API_URL + '?action=addToCart',
        method: 'POST',
        data: { productId: productId },
        dataType: 'json'
    }).done(function (response) {
        if (response.success) {
            $('#cartCount').text(response.cartCount);
            if (typeof showToast === 'function') {
                showToast('Produkt erfolgreich hinzugefügt!', 'success');
            }
        }
    }).fail(function (xhr) {
        console.error('Fehler beim Hinzufügen zum Warenkorb:', xhr);
    });
}

/**
 * Holt den aktuellen Counter-Stand aus dem Backend
 */
function updateCartCount() {
    var basePath = window.location.pathname.indexOf('/sites/') !== -1 ? '../../' : '../';
    $.ajax({
        url: basePath + 'backend/logic/requestHandler.php?action=getCartCount',
        method: 'GET',
        dataType: 'json'
    }).done(function (response) {
        $('#cartCount').text(response.cartCount);
    });
}