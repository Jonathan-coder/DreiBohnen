/**
 * main.js
 * Zentrale Initialisierungsdatei
 * Lädt alle Module und startet die Anwendung
 */

$(document).ready(function() {
    console.log('🚀 DreiBohnen Webshop wird geladen...');
    
    // 1. Komponenten (Header, Footer) laden
    loadComponents();
    
    // 2. Wenn Produktseite, Produkte initialisieren
    if ($('#product-list').length > 0) {
        initProductsPage();
    }
    
    console.log('✅ DreiBohnen Webshop erfolgreich geladen');
});