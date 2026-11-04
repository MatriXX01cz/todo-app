# Úkolníček (To-Do List)

Fullstack webová aplikace s architekturou **klient – server – databáze**.
Úkoly se přidávají přes formulář a ukládají do MongoDB. Seznam se po přidání
úkolu aktualizuje bez znovunačtení stránky (`fetch` + `async/await`).

## Technologie

- Node.js + Express.js (backend, REST API)
- MongoDB + Mongoose (databáze)
- HTML + JavaScript (frontend ve složce `public/`)

## Funkce

- přidání úkolu s názvem a prioritou (nízká / střední / vysoká)
- výpis všech uložených úkolů (nejnovější nahoře)
- validace na serveru (název nesmí být prázdný, priorita musí být platná)

## API

| Metoda | Adresa       | Popis                            |
| ------ | ------------ | -------------------------------- |
| GET    | `/api/tasks` | vrátí všechny úkoly jako JSON    |
| POST   | `/api/tasks` | uloží nový úkol (`title`, `priority`) |

## Spuštění lokálně

1. Nainstaluj [Node.js](https://nodejs.org/) a MongoDB (nebo si založ
   bezplatný cluster na MongoDB Atlas).
2. Naklonuj repozitář a nainstaluj závislosti:
   ```bash
   npm install
   ```
3. Vytvoř soubor `.env` podle vzoru `.env.example`:
   ```
   MONGODB_URI=mongodb://127.0.0.1:27017/todo-app
   PORT=3000
   ```
   Pokud `.env` nevytvoříš, použije se lokální MongoDB na výchozím portu
   a port 3000. Pro MongoDB Atlas dej do `MONGODB_URI` svůj connection string.
4. Spusť aplikaci:
   ```bash
   npm start
   ```
5. Otevři v prohlížeči <http://localhost:3000>.

## Struktura projektu

```
server.js          – Express server, API, model Mongoose
public/index.html  – formulář a výpis úkolů
public/script.js   – komunikace se serverem přes fetch()
package.json
```
