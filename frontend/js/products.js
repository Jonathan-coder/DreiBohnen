/**
 * products.js
 * Verwaltung von Produkten und Kategorien
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
 * Bindet Event-Handler für Kategorie-Filter
 */
function attachEventHandlers() {
    $(document).on('click', '.category-btn', function() {
        var categoryId = String($(this).data('category')); // Stelle sicher dass es ein String ist
        console.log('Kategorie geklickt:', categoryId);
        filterProductsByCategory(categoryId);
    });
}

/**
 * Filtert Produkte nach Kategorie
 */
function filterProductsByCategory(categoryId) {
    categoryId = String(categoryId); // Stelle sicher dass es ein String ist
    console.log('Filtere Produkte für Kategorie:', categoryId);
    
    $('.category-btn').removeClass('active');
    $('[data-category="' + categoryId + '"]').addClass('active');

    if (categoryId === 'all') {
        console.log('Lade alle Produkte...');
        loadAllProducts();
    } else {
        console.log('Lade Produkte für Kategorie:', categoryId);
        loadProductsByCategory(categoryId);
    }
}

/**
 * Lädt alle verfügbaren Kategorien und erstellt Filter-Buttons
 */
function loadCategories() {
    console.log('Lade Kategorien...');
    $.ajax({
        url: API_URL,
        type: 'GET',
        data: { action: 'getCategories' },
        dataType: 'json',
        success: function(categories) {
            console.log(' Kategorien geladen:', categories);
            renderCategoryButtons(categories);
        },
        error: function(xhr, status, error) {
            console.error(' Fehler beim Laden der Kategorien:', error, xhr);
        }
    });
}

/**
 * Rendert die Kategorie-Buttons
 */
function renderCategoryButtons(categories) {
    // "Alle Kategorien" Button ohne active-Klasse erstellen (wird später gesetzt)
    var html = '<button type="button" class="btn btn-outline-primary category-btn active" data-category="all">Alle Kategorien</button>';

    $.each(categories, function(index, category) {
        html += '<button type="button" class="btn btn-outline-primary category-btn" data-category="' + category.id + '">' + category.name + '</button>';
    });

    $('#category-buttons').html(html);
    console.log('Kategorie-Buttons gerendert:', categories.length, 'Kategorien');
}

/**
 * Lädt alle Produkte
 */
function loadAllProducts() {
    console.log('ℹ️ Lade alle Produkte...');
    $.ajax({
        url: API_URL,
        type: 'GET',
        data: { action: 'getAllProducts' },
        dataType: 'json',
        success: function(products) {
            console.log('✅ Produkte geladen:', products.length, 'Produkte');
            renderProducts(products);
        },
        error: function(xhr, status, error) {
            console.error('❌ Fehler beim Laden der Produkte:', error, xhr);
            showErrorMessage('Fehler beim Laden der Produkte');
        }
    });
}

/**
 * Lädt Produkte einer bestimmten Kategorie
 */
function loadProductsByCategory(categoryId) {
    console.log('ℹ️ Lade Produkte für Kategorie:', categoryId);
    $.ajax({
        url: API_URL,
        type: 'GET',
        data: { action: 'getProducts', category: categoryId },
        dataType: 'json',
        success: function(products) {
            console.log('✅ Produkte geladen:', products.length, 'Produkte');
            renderProducts(products);
        },
        error: function(xhr, status, error) {
            console.error('❌ Fehler beim Laden der Produkte:', error, xhr);
            showErrorMessage('Fehler beim Laden der Produkte');
        }
    });
}

/**
 * Rendert die Produkte im Grid
 */
function renderProducts(products) {
    if (products.length === 0) {
        showEmptyMessage('Keine Produkte in dieser Kategorie.');
        return;
    }

    var html = '';
    $.each(products, function(index, product) {
        html += createProductCard(product);
    });

    $('#product-list').html(html);
}

/**
 * Erstellt eine Produktkarte
 */
function createProductCard(product) {
    var ratingStars = generateStars(product.rating);
    var imagePath = PRODUCT_PICTURES_PATH + product.image;
    var price = parseFloat(product.price).toFixed(2);

    var card = '<div class="col-md-6 col-lg-4 mb-4">' +
        '<div class="card product-card h-100 shadow-sm">' +
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
