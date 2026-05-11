/**
 * utils.js
 * Hilfsfunktionen für die Anwendung
 */

/**
 * Generiert HTML für Stern-Bewertung
 * @param {number} rating - Bewertung (1-5)
 * @returns {string} HTML mit Sternen und Bewertungstext
 */
function generateStars(rating) {
    var stars = '';
    
    for (var i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star text-warning"></i>';
        } else {
            stars += '<i class="far fa-star text-warning"></i>';
        }
    }
    
    stars += ' <span class="rating-text">(' + rating + '/5)</span>';
    return stars;
}

/**
 * Formatiert einen Preis mit Dezimalstellen und Währung
 * @param {number|string} price - Der zu formatierende Preis
 * @param {string} currency - Währungssymbol (Standard: €)
 * @returns {string} Formatierter Preis
 */
function formatPrice(price, currency) {
    currency = currency || '€';
    return parseFloat(price).toFixed(2) + ' ' + currency;
}

/**
 * Zeigt eine Toast-Nachricht an (für zukünftige Benachrichtigungen)
 * @param {string} message - Die Nachricht
 * @param {string} type - Typ (success, error, info, warning)
 */
function showToast(message, type) {
    type = type || 'info';
    console.log('[' + type.toUpperCase() + '] ' + message);
    // Kann später mit echter Toast-Bibliothek erweitert werden
}

/**
 * Bestätigt eine Aktion mit dem Benutzer
 * @param {string} message - Bestätigungsnachricht
 * @returns {boolean} true, wenn bestätigt
 */
function confirmAction(message) {
    return confirm(message);
}

/**
 * Verzögerung in Millisekunden (für async-await Patterns)
 * @param {number} ms - Millisekunden
 * @returns {Promise} Promise, die nach ms Millisekunden resolved
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
