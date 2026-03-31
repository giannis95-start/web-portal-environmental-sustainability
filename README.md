# Sostenibilità nell'Era Digitale: Sfide e Soluzioni Informatiche 

 Il sito presenta gli impegni di sostenibilità ESG (Environmental, Social, Governance) del Gruppo Amadori attraverso un'interfaccia moderna, responsiva e accessibile.

---

## Descrizione del progetto

Il portale è una pagina statica composta da un unico file HTML principale (`index.html`) e da un documento di approfondimento (`elaborato-tesi-portale.html`). Non richiede backend, database o build tool: funziona interamente lato client.

### Sezioni principali

| Sezione | Descrizione |
|---|---|
| **Hero** | Presentazione visiva con 4 KPI di sostenibilità chiave |
| **I Sei Pilastri ESG** | Card tematiche su Clima, Benessere Animale, Filiera, Risorse, Persone, Governance |
| **Traguardi** | Timeline cronologica dei risultati raggiunti dal 2019 al 2023 |
| **Report di Sostenibilità** | Sezione download dei report ESG annuali (2020–2024) |
| **Impegno 2030** | Obiettivi strategici a lungo termine allineati agli SDGs ONU |

### Tecnologie utilizzate

- **HTML5** — struttura semantica con attributi ARIA per l'accessibilità
- **CSS3** — layout con CSS Grid e Flexbox, animazioni, design responsivo mobile-first
- **JavaScript (ES2020, vanilla)** — nessuna dipendenza esterna; gestione navbar, animazioni scroll tramite `IntersectionObserver`, rendering dinamico delle card report, download PDF via `fetch` + Blob
- **Google Fonts** — DM Serif Display (titoli) e DM Sans (corpo testo)

### Struttura dei file

```
web-portal-environmental-sustainability/
├── index.html                  # Pagina principale del portale
├── elaborato-tesi-portale.html  # Documento di approfondimento della tesi
├── css/
│   └── style.css               # Foglio di stile principale
└── js/
    └── main.js                 # Logica applicativa JavaScript
```

---

## Come avviare il progetto

Il progetto è composto esclusivamente da file statici e non richiede installazione di dipendenze o compilazione.

### Metodo 1 — Apertura diretta nel browser (più semplice)

1. Clona o scarica il repository:
   ```bash
   git clone <url-repository>
   cd web-portal-environmental-sustainability
   ```
2. Apri il file `index.html` direttamente nel browser (doppio clic sul file o trascina nella finestra del browser).

#### Con l'estensione VS Code "Live Server"

1. Installa l'estensione **Live Server** di Ritwick Dey da VS Code Marketplace.
2. Apri la cartella del progetto in VS Code.
3. Tasto destro su `index.html` → **Open with Live Server**.

Il browser si aprirà automaticamente con il server locale attivo e il live reload abilitato.

---

## Note aggiuntive

- Il portale è ottimizzato per **Chrome**, **Firefox**, **Edge** e **Safari** nelle versioni recenti.
- Le animazioni di scroll utilizzano l'API `IntersectionObserver`, supportata da tutti i browser moderni.
- I report PDF vengono scaricati dai server ufficiali di Amadori; è necessaria una connessione internet per il download.
- Il progetto è un **prototipo accademico** e non è affiliato ufficialmente al Gruppo Amadori S.p.A.