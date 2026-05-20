/**
 * cart.js
 * Steuerung der Warenkorb-Oberfläche (US-PROD-07 & US-PROD-08)
 */

const CART_API_URL = '../../backend/logic/requestHandler.php';

$(document).ready(function () {
    loadCart();

    // Event-Handler für Mengenänderung
    $(document).on('change', '.item-quantity', function () {
        var productId = $(this).data('product-id');
        var newQty = parseInt($(this).val());
        if (newQty >= 0) {
            updateQuantity(productId, newQty);
        }
    });

    // Event-Handler für Löschen-Button
    $(document).on('click', '.remove-item', function () {
        var productId = $(this).data('product-id');
        updateQuantity(productId, 0); // Menge 0 löscht das Produkt
    });
});

function loadCart() {
    $.ajax({
        url: CART_API_URL + '?action=getCart',
        method: 'GET',
        dataType: 'json'
    }).done(function (response) {
        renderCart(response);
    }).fail(function () {
        $('#cart-container').html('<p class="alert alert-danger">Fehler beim Laden des Warenkorbs.</p>');
    });
}

function renderCart(cart) {
    if (cart.items.length === 0) {
        $('#cart-container').html('<div class="alert alert-info">Ihr Warenkorb ist leer.</div>');
        $('#cart-total').text('0.00 €');
        return;
    }

    var html = '<table class="table align-middle"><thead><tr><th>Produkt</th><th>Preis</th><th>Anzahl</th><th>Summe</th><th>Aktion</th></tr></thead><tbody>';

    $.each(cart.items, function (index, item) {
        var itemPrice = parseFloat(item.price).toFixed(2);
        var subtotal = parseFloat(item.subtotal).toFixed(2);

        html += `<tr>
            <td><strong>${item.name}</strong></td>
            <td>${itemPrice} €</td>
            <td>
                <input type="number" class="form-control item-quantity" data-product-id="${item.id}" value="${item.quantity}" min="1" style="width: 80px;">
            </td>
            <td>${subtotal} €</td>
            <td>
                <button class="btn btn-sm btn-danger remove-item" data-product-id="${item.id}"><i class="fas fa-trash"></i></button>
            </td>
        </tr>`;
    });

    html += '</tbody></table>';

    $('#cart-container').html(html);
    $('#cart-total').text(parseFloat(cart.totalPrice).toFixed(2) + ' €');
}

function updateQuantity(productId, quantity) {
    $.ajax({
        url: CART_API_URL + '?action=updateCartQuantity',
        method: 'POST',
        data: { productId: productId, quantity: quantity },
        dataType: 'json'
    }).done(function (response) {
        $('#cartCount').text(response.cartCount);
        loadCart(); // Warenkorb-Ansicht aktualisieren
    });
}