# JavaScript-Module Dokumentation

## Übersicht

Der JavaScript-Code ist in mehrere spezialisierte Module aufgeteilt, um Wartbarkeit und Lesbarkeit zu verbessern.

## Module

### 1. **utils.js** 
Hilfsfunktionen und Utilities, die überall verwendet werden.

**Funktionen:**
- `generateStars(rating)` - Erstellt HTML für Stern-Bewertung (1-5 Sterne)
- `formatPrice(price, currency)` - Formatiert Preise mit Währung
- `showToast(message, type)` - Zeigt Benachrichtigungen an
- `confirmAction(message)` - Bestätigungsdialog
- `delay(ms)` - Promise-basierte Verzögerung

### 2. **components.js**
Verwaltet wiederverwendbare Komponenten wie Header und Footer.

**Funktionen:**
- `loadComponents()` - Startet das Laden aller Komponenten
- `loadHeader(basePath, rootPath)` - Lädt Header und konfiguriert Links
- `loadFooter(basePath, rootPath)` - Lädt Footer und konfiguriert Links

### 3. **products.js**
Kernfunktionalität für Produktanzeige und Filterung.

**Konstanten:**
- `API_URL` - Basis-URL für API-Calls
- `PRODUCT_PICTURES_PATH` - Pfad zu Produktbildern

**Funktionen:**
- `initProductsPage()` - Initialisiert die Produktseite
- `attachEventHandlers()` - Bindet Event-Handler
- `filterProductsByCategory(categoryId)` - Filtert nach Kategorie
- `loadCategories()` - Lädt Kategorien aus der API
- `renderCategoryButtons(categories)` - Rendert Kategorie-Filter-Buttons
- `loadAllProducts()` - Lädt alle Produkte
- `loadProductsByCategory(categoryId)` - Lädt Produkte einer Kategorie
- `renderProducts(products)` - Rendert Produkte im Grid
- `createProductCard(product)` - Erstellt einzelne Produktkarte
- `showErrorMessage(message)` - Zeigt Fehlermeldung
- `showEmptyMessage(message)` - Zeigt leere Liste Nachricht

### 4. **main.js**
Zentrale Initialisierungsdatei - bindet alles zusammen.

**Aufgaben:**
- Laden aller Module
- Initialisierung bei DOM Ready
- Konditionale Initialisierung basierend auf Seite

## Ladereihenfolge

Die Scripts **müssen** in dieser Reihenfolge geladen werden:

```html
<script src="../js/products.js"></script>
<script src="../js/utils.js"></script>
<script src="../js/components.js"></script>
<script src="../js/products.js"></script>
<script src="../js/main.js"></script>
```

>  **Wichtig:** Die Reihenfolge ist entscheidend, da später geladene Module von früheren abhängen.

## Erweiterung neuer Module

Beim Hinzufügen neuer Funktionalität:

1. **Neue Datei erstellen** (z.B. `cart.js`)
2. **Funktionen dokumentieren** mit JSDoc-Kommentaren
3. **In main.js initialisieren** falls nötig
4. **In products.html laden** in korrekter Reihenfolge
5. **Dieses README aktualisieren**

## Best Practices

- Jede Datei hat **eine klare Verantwortung**
- Funktionen sind **beschreibend benannt**
- Alle Funktionen haben **JSDoc-Kommentare**
- Konstanten sind **großgeschrieben** (SCREAMING_SNAKE_CASE)
- Error-Handling erfolgt **konsistent** über alle Module

## Beispiel: Neue Warenkorb-Funktion

```javascript
// In cart.js
function addToCart(productId) {
    console.log('Produkt ' + productId + ' in den Warenkorb');
    showToast('Produkt hinzugefügt!', 'success');
}

// In main.js initialisieren
$(document).on('click', '.add-to-cart', function() {
    var productId = $(this).data('product-id');
    addToCart(productId);
});
```

## Debugging-Tipps

- **Browser Console öffnen** (F12) um Logs zu sehen
- **console.log()** nutzen für Debugging
- **Breakpoints** im DevTools setzen
- **Network Tab** nutzen um API-Calls zu überprüfen
