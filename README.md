# Projekt: Express-Backend

> Ihre Aufgabe ist es ein passendes Express-Backend zu einer existierenden Todos-Anwendung zu erstellen.

## Development-Setup

Nach dem Entpacken des Projekt-Ordners wechseln sie auf einem Terminal / einer Konsole in
den Wurzel-Ordner des Projektes. Das ist der oberste Ordner mit der `package.json`-Datei.
Dann geben Sie folgende Befehle ein:

    npm install
    npm run dev

Der erste Befehl installiert die notwendigen Abhängigkeiten, der zweite startet die
Anwendung im Watch-Modus. Nach dem Start läuft die Anwendung unter http://localhost:3000 .
Lernen Sie die Anwendung zunächst einfach kennen und erstellen sie eine eigene Todo-Liste.

## Schnellstart

Ändern sie die Zeile 18 in

```js
this.store = stores.express;
```

und beginnen sie mit der Implementierung der Lösung in der Express-Anwendung. Diese funktioniert
jetzt erst mal nicht mehr. 

Der vorbereitete Express-Server in `server.js` liefert bis jetzt nur das Ausliefern
der Client-Anwendung über die `express.static`-Middleware. Es sind keine weiteren Routen
und Middlewares definiert, die Sie enventuell für die Aufgabenlösung brauchen. Auch
existiert noch keine Datenbank-Anbindung.

Die `fetch`-Requests der Anwendung finden Sie in der Datei `public/js/store/http-store.js`.
Die Methoden sind im einzelnen

- `read`: Erwartet ein Array von Objekten in der Antwort im Json-Format. Die Properties der
  Objekte sind `id` (String oder Number), `title` (String) und `completed` (Boolean).
- `create`: Die Anwendung schickt ein Objekt (Json-codiert) im Body mit den Properties `title` und
  `completed`. Als Antwort wird das komplette erzeugte Objekt mit einer generierten `id` erwartet.
- `update`: Die Anwendung schickt einen Request mit der `id` in der URL und den zu ändernden
  Daten im Json-codierten Body (entweder `title` oder `completed`). Die Antwort enthält das
  komplette geänderte Objekt.
- `delete`: Die Anwendung schickt einen Request mit der `id` in der URL - keine weiteren Daten.

Nutzen Sie die Browser-Console und die Log-Meldungen des Servers, um die nötigen Routen zu identifizieren.

## Ausprobieren

Die Anwendung verfügt über insgesamt vier Backends. Diese werden in der Datei `public/js/app.js`
definiert:

```js
const stores = {
  array: new ArrayStore(),
  local: new LocalStore(),
  cloud: new HttpStore('https://cloud.lean-stack.de/api/public/todos'),
  express: new HttpStore('/api/todos'),
};
```

In der Zeile 18 wird das aktuell genutzte festgelegt. Nach dem Entpacken ist das zunächst eine
`LocalStore`-Instanz. Hier werden die Todos in ihrem Browser lokal gespeichert. Sie können den Browser
schließen und wieder öffnen (bzw. die Seite einfach neu laden) und finden ihre angelegten Todos
wieder. In einem anderen Browser können sie eine andere Todo-Liste anlegen. Sie wird dann in
diesem gespeichert. Je Browser eine Liste.

Der `ArrayStore` in der `stores.array`-Property speichert die Liste im Browser-Speicher (in der JavaScript-Anwendung)
nur bis zum nächsten Neuladen der Seite bzw. bis zum Schließen des Browsers.

Der in der Property `stores.cloud` definierte `HttpStore` nutzt ein vorhandenes Backend. Er ist
etwas langsam und generiert die `id`-Property der neuen Todos als String. Dies können
Sie aber einfach ignorieren, es ist auch möglich aufsteigende Zahlen zu generieren. Beim Nutzen
dieses Backends sehen natürlich alle Nutzer die gleichen Daten. Und es kommt sicherlich schnell
zu Problemen, da die Daten nicht in Echtzeit geändert werden.

## Zum Todos-Client

Die Browser-Client Anwendung wurde dem [todomvc.com](https://todomvc.com) Projekt entnommen. Bei TodoMVC
können sich Client-seitige Frameworks präsentieren und eine Implementierung dieser
Anwendung im jeweiligen Framework realisieren.

Die in diesem Projekt verwendete Implementierung wurde übernommen und angepasst aus der
Lösung [JavaScript ES6](https://todomvc.com/examples/javascript-es6/dist/). Die vorliegende
Implementierung kann mit verschiedenen Backend-Varianten genutzt werden.

## Fazit

Mit Ausnahme der Zeile 18 in der `public/js/app.js` brauchen Sie im kompletten Client im
`public`-Pfad nichts zu ändern. Sie müssen lediglich im Express-Server eine Datenbank-Anbindung an 
eine `sqlite3` Datenbank realisieren (eine Tabelle mit passenden Spalten), nötige Middlewares 
definieren (die CORS-Problematik darf ignoriert werden) und insgesamt vier Routen definieren (GET, POST, ...).
Versuchen Sie dabei die Änderungen in der `server.js` minimal zu halten und strukturieren
Sie ihren eigenen Code entsprechend im `src`-Ordner.

Wenn Sie möchten, dürfen Sie ihren Namen in der `public/index.html` in Zeile 43 eintragen.

Viele Spaß!
