# Projekt "Dreibohnen" - Webshop

## Installation & Setup (Datenbank)

Damit das Backend funktioniert, müsst ihr die lokale Datenbank wie folgt einrichten:

1. **XAMPP starten**: Apache und MySQL müssen laufen.
2. **Datenbank erstellen**:
   - Gehe auf `http://localhost/phpmyadmin`.
   - Erstelle eine neue Datenbank mit dem Namen `dreibohnen`.
3. **SQL Import**:
   - Klicke auf die Datenbank `dreibohnen`.
   - Gehe zum Reiter **"SQL"** und kopiere den Inhalt der Datei `setup.sql` (oder den SQL-Block aus unserem Chat) hinein.
   - Klicke auf "OK".
4. **Bilder**:
   - Stelle sicher, dass ihr Testbilder im Ordner `backend/productpictures/` habt. Ein Bild sollte `testpic.png` heißen, damit die Testdaten angezeigt werden.

## Backend-Zugriff
Die Datenbankverbindung wird zentral über `backend/config/dbaccess.php` gesteuert. 
Standardmäßig eingestellt ist:
- Host: `localhost`
- User: `root`
- Passwort: (leer)