# ShortCode Maker v4 — Grimaldelli

Generatore di codici compatti per CAD con struttura `FAM-TIPO-D3-L4-H4-S3-MAT-FIN-TOK`.

## Struttura
- `index.html` — Generatore (UI principale)
- `istruzioni.html` — Manuale
- `dati.html` — Editor dati (override locale + export JSON)
- `tipi.html` — Vista configurazione Tipi
- `assets/styles.css` — Stili
- `assets/app.js` — Logica UI
- `assets/data/` — Dati base (JS modules) + loader con override

## Esecuzione locale
Serve un server statico per gli ES Modules:
- Python: `python -m http.server 8000`
- Node: `npx http-server . -p 8000`
- VS Code: estensione *Live Server*

Poi apri `http://localhost:8000`.

## Deploy su GitHub Pages
- Repo → **Settings** → **Pages** → Source: `Deploy from a branch` → Branch: `main` (root).
- Attendi il build e visita l'URL fornito.

## Modifica dati
- **Veloce (runtime)**: usa `dati.html` per salvare un override in `localStorage`.
- **Persistente (repo)**: modifica `assets/data/cataloghi.js` e `assets/data/tipi.js` e committa.

## Note
- Estensione file output di default: `.dwg`. Cambiala in `assets/app.js` se serve.
