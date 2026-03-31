/**
 * =============================================================
 * AMADORI SOSTENIBILITÀ — main.js
 * Script principale della pagina di sostenibilità.
 *
 * INDICE:
 *   1. REPORTS (dati statici)  — array con i report ESG disponibili
 *   2. downloadReport()        — scarica il PDF via fetch + Blob
 *   3. renderReports()         — genera le card dall'array
 *   4. initNavbar()            — comportamento scroll + menu mobile
 *   5. initScrollAnimation()   — IntersectionObserver per fade-up
 *   6. initFooterYear()        — anno corrente nel footer
 *   7. Inizializzazione        — DOMContentLoaded
 */


/* ─────────────────────────────────────────────────────────────
   1. DATI STATICI DEI REPORT
   Array contenente i metadati di ogni report ESG pubblicato.

   Campi di ogni oggetto:
     id          {string}       Identificativo univoco del report
     anno        {number}       Anno di riferimento del report
     titolo      {string}       Titolo esteso del documento
     descrizione {string}       Breve descrizione dei contenuti
     pagine      {number|null}  Numero di pagine (null se non disponibile)
     urlDownload {string}       URL diretto al PDF sul sito amadori.it
───────────────────────────────────────────────────────────── */
const REPORTS = [
  {
    id:          'esg-2024',
    anno:        2024,
    titolo:      'Relazione di Sostenibilità 2024',
    descrizione: 'Il quinto report illustra il Piano ESG 2030 e il nuovo modello ' +
                 'di Governance. Perimetro: Amadori S.p.A. e tutte le società ' +
                 'consolidate. Redatto secondo GRI Standards 2021.',
    pagine:      null,
    urlDownload: 'https://www.amadori.it/hubfs/Amadori%202022/Report_Sostenibilit%C3%A0/Ama_report_sost_2024_sin.pdf?hsLang=it',
  },
  {
    id:          'esg-2023',
    anno:        2023,
    titolo:      'Report di Sostenibilità 2023',
    descrizione: 'Quarto report del Gruppo: esercizio 1° gennaio – 31 dicembre 2023. ' +
                 'Redatto secondo GRI Standards 2021 (opzione in accordance). ' +
                 'Perimetro: capogruppo e tutte le società consolidate.',
    pagine:      null,
    urlDownload: 'https://www.amadori.it/hubfs/Amadori%202022/Report_Sostenibilit%C3%A0/Ama_report_sost_2023.pdf?hsLang=it',
  },
  {
    id:          'esg-2022',
    anno:        2022,
    titolo:      'Report di Sostenibilità 2022',
    descrizione: 'Terzo report: narrativa quantitativa e qualitativa sugli ambiti ' +
                 'ambientale, sociale ed economico del Gruppo. Prima edizione ' +
                 'conforme ai nuovi GRI Standards 2021.',
    pagine:      null,
    urlDownload: 'https://www.amadori.it/hubfs/Amadori%202022/Report%20Sostenibilit%C3%A0/Amadori_report_sost_2022.pdf?hsLang=it',
  },
  {
    id:          'esg-2021',
    anno:        2021,
    titolo:      'Report di Sostenibilità 2021',
    descrizione: 'Secondo report: illustra l\'impegno per un sistema alimentare ' +
                 'sano, equo e rispettoso dell\'ambiente, fondato su una filiera ' +
                 'italiana integrata, controllata e certificata.',
    pagine:      null,
    urlDownload: 'https://sostenibilita.amadori.it/wp-content/uploads/2022/07/Amadori-Report-sostenibilita-2021.pdf',
  },
  {
    id:          'esg-2020',
    anno:        2020,
    titolo:      'Report di Sostenibilità 2020',
    descrizione: 'Primo report del Gruppo Amadori: segna l\'avvio della ' +
                 'rendicontazione ESG e della condivisione del percorso ' +
                 'sostenibile con tutti gli stakeholder.',
    pagine:      null,
    urlDownload: 'https://sostenibilita.amadori.it/wp-content/uploads/2022/01/Amadori_Report_Sostenibilita-2020_mail.pdf',
  },
];

/* ─────────────────────────────────────────────────────────────
   2. DOWNLOADREPORT()
   Scarica un PDF dal sito Amadori forzando il salvataggio locale.

   Strategia:
     1. fetch() recupera il PDF come Blob binario
     2. URL.createObjectURL() crea un URL temporaneo locale
     3. Un <a download> simulato triggera il salvataggio
     4. L'URL temporaneo viene revocato per liberare memoria

   Se fetch() fallisce per CORS o rete, apre il PDF
   in una nuova scheda come fallback trasparente all'utente.

   Parametro:
     btn {HTMLButtonElement}  Il pulsante cliccato (contiene
                              data-url e data-name come attributi)
───────────────────────────────────────────────────────────── */
async function downloadReport(btn) {
  const url      = btn.dataset.url;
  const filename = btn.dataset.name;

  // Feedback visivo: disabilita il pulsante durante il download
  btn.disabled = true;
  const originalHTML = btn.innerHTML;
  btn.innerHTML = '<span style="font-size:0.85em">Download in corso…</span>';

  try {
    /*
     * fetch() con mode 'cors' tenta di ottenere il file.
     * Se il server Amadori non risponde con i giusti header CORS,
     * il browser lancerà un TypeError — gestito nel catch.
     */
    const response = await fetch(url, { mode: 'cors' });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    // Converte la risposta in Blob (dati binari del PDF)
    const blob = await response.blob();

    // Crea un URL object temporaneo che punta al Blob in memoria
    const blobUrl = URL.createObjectURL(blob);

    // Crea un <a> invisibile con l'attributo download e lo "clicca"
    const tempLink = document.createElement('a');
    tempLink.href     = blobUrl;
    tempLink.download = filename;
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);

    // Libera la memoria dopo un breve ritardo (necessario su Safari)
    setTimeout(() => URL.revokeObjectURL(blobUrl), 200);

  } catch (err) {
    /*
     * Fallback: apre il PDF in una nuova scheda.
     * Avviene quando il server blocca la richiesta cross-origin.
     * L'utente può comunque salvare il file dal browser.
     */
    console.warn('[Amadori] Download diretto non riuscito, apertura scheda:', err);
    window.open(url, '_blank', 'noopener,noreferrer');
  } finally {
    // Ripristina il pulsante in ogni caso
    btn.innerHTML = originalHTML;
    btn.disabled  = false;
  }
}


/* ─────────────────────────────────────────────────────────────
   3. RENDER REPORTS
   Genera dinamicamente le card HTML dei report e le inietta
   nel contenitore #reportsGrid tramite innerHTML.

   Parametro:
     data {Array}  Array di oggetti report (dall'array REPORTS sopra)
───────────────────────────────────────────────────────────── */
function renderReports(data) {
  const grid = document.getElementById('reportsGrid');

  // Sicurezza: interrompi se il contenitore non esiste nel DOM
  if (!grid) {
    console.warn('[Amadori] Elemento #reportsGrid non trovato.');
    return;
  }

  // Caso: array vuoto o null
  if (!data || data.length === 0) {
    grid.innerHTML =
      '<p class="noscript-msg">Nessun report disponibile al momento.</p>';
    return;
  }

  /**
   * Icona SVG di download inline.
   * Usare SVG inline garantisce:
   *   - nessuna richiesta HTTP aggiuntiva
   *   - scalabilità perfetta
   *   - controllabilità via CSS (color: currentColor)
   */
  const downloadIcon = `
    <svg xmlns="http://www.w3.org/2000/svg"
         width="16" height="16"
         viewBox="0 0 24 24"
         fill="none"
         stroke="currentColor"
         stroke-width="2.5"
         stroke-linecap="round"
         stroke-linejoin="round"
         aria-hidden="true"
         focusable="false">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>`;

  /*
   * Template literals per costruire l'HTML di ogni card.
   * Array.map() trasforma ogni oggetto report in una stringa HTML;
   * join('') concatena le stringhe in un unico blocco da iniettare.
   * L'id dell'h3 (report-title-ANNO) è referenziato da aria-labelledby
   * sull'<article> per associare il titolo all'elemento contenitore
   * in modo accessibile agli screen reader.
   */
  grid.innerHTML = data.map((report) => `
    <article
      class="report-card fade-up"
      role="listitem"
      aria-labelledby="report-title-${report.anno}"
    >
      <!-- Badge anno in alto a sinistra -->
      <div class="report-year-badge" aria-hidden="true">
        ${report.anno}
      </div>

      <!-- Corpo della card -->
      <div class="report-body">
        <h3 id="report-title-${report.anno}" class="report-title">
          ${report.titolo}
        </h3>
        <p class="report-desc">${report.descrizione}</p>

        <!-- Metadati del file: mostra le pagine solo se disponibili -->
        ${report.pagine ? `
        <div class="report-meta" aria-label="Dettagli documento">
          <span>${report.pagine} pagine</span>
        </div>` : ''}
      </div>

      <!--
        Pulsante download: chiama downloadReport() in JS.
        Il download avviene via fetch + Blob per forzare il salvataggio
        del file invece dell'apertura nel browser.
        data-url  → URL sorgente del PDF
        data-name → nome suggerito per il file salvato
      -->
      <button
        class="btn btn-download"
        data-url="${report.urlDownload}"
        data-name="Amadori-Sostenibilita-${report.anno}.pdf"
        aria-label="Scarica ${report.titolo} in formato PDF"
        onclick="downloadReport(this)"
      >
        ${downloadIcon}
        Scarica PDF ${report.anno}
      </button>
    </article>
  `).join('');

  /*
   * Dopo aver iniettato i nuovi elementi nel DOM,
   * registra le card nell'IntersectionObserver per
   * applicare l'animazione fade-up anche su di esse.
   */
  registerFadeElements();

}


/* ─────────────────────────────────────────────────────────────
   4. INITNAVBAR()
   Due comportamenti:
     a) Scroll: aggiunge/rimuove .scrolled sulla <nav> in base
        alla posizione verticale della pagina.
     b) Mobile menu: toggle della classe .open su #navLinks
        e aggiornamento dell'attributo aria-expanded.
───────────────────────────────────────────────────────────── */
function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const toggle    = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  if (!navbar) return;

  /* ── a) Comportamento scroll ── */
  const SCROLL_THRESHOLD = 80; // px di scroll prima di cambiare stile

  function handleScroll() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // Controlla subito al caricamento (es. se la pagina è già scrollata)
  handleScroll();

  // Listener ottimizzato,
  window.addEventListener('scroll', handleScroll, { passive: true });

  /* ── b) Toggle menu mobile ── */
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');

    // Aggiorna attributo ARIA per screen reader
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    toggle.setAttribute('aria-label', isOpen ? 'Chiudi menu' : 'Apri menu');
  });

  /*
   * Chiude il menu quando si clicca su un link di navigazione.
   * Questo migliora l'UX su mobile: dopo aver scelto una sezione
   * il menu si chiude automaticamente prima dello scroll.
   */
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Apri menu');
    });
  });

  /*
   * Chiude il menu se si clicca fuori dal pannello (su mobile).
   * Controlla che il click non sia né sul toggle né sul menu stesso.
   */
  document.addEventListener('click', (event) => {
    if (
      navLinks.classList.contains('open') &&
      !navLinks.contains(event.target) &&
      !toggle.contains(event.target)
    ) {
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Apri menu');
    }
  });
}


/* ─────────────────────────────────────────────────────────────
   5. INITSCROLLANIMATION() — IntersectionObserver
   Osserva tutti gli elementi con classe .fade-up nel DOM.
   Quando un elemento entra nella viewport (con margine del 10%),
   aggiunge la classe .visible che attiva la transizione CSS.
───────────────────────────────────────────────────────────── */

// Istanza globale dell'Observer (per poter riutilizzarla)
let scrollObserver = null;

function initScrollAnimation() {
  /*
   * rootMargin: "-10% 0px"
   *   L'animazione si attiva quando l'elemento supera il 10%
   *   dall'alto della viewport (non subito al bordo).
   * threshold: 0
   *   Basta che un pixel dell'elemento sia visibile.
   */
  const observerOptions = {
    root: null,           // viewport del browser
    rootMargin: '-10% 0px',
    threshold: 0,
  };

  scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // L'elemento è entrato nella viewport: attiva l'animazione
        entry.target.classList.add('visible');

        /*
         * Una volta animato, smetti di osservarlo.
         * Questo libera risorse e previene re-trigger sull'uscita.
         */
        scrollObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Registra tutti gli elementi .fade-up presenti al momento
  registerFadeElements();
}

/**
 * Registra gli elementi .fade-up nell'Observer.
 * Chiamata sia all'init che dopo renderReports(),
 * perché le card sono aggiunte dopo il caricamento della pagina.
 */
function registerFadeElements() {
  if (!scrollObserver) return;

  document.querySelectorAll('.fade-up:not(.visible)').forEach((el) => {
    scrollObserver.observe(el);
  });
}


/* ─────────────────────────────────────────────────────────────
   6. INITFOOTERYEAR()
   Aggiorna dinamicamente l'anno nel copyright del footer.
   Evita di dover aggiornare manualmente l'HTML ogni anno.
───────────────────────────────────────────────────────────── */
function initFooterYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}


/* ─────────────────────────────────────────────────────────────
   7. INIZIALIZZAZIONE 
   DOMContentLoaded si attiva quando il DOM è pronto ma prima
   che immagini e font siano completamente caricati — ideale
   per operazioni sul DOM che non dipendono dalle risorse.

   ORDINE DI ESECUZIONE:
     1. initNavbar()          — setup interazioni UI
     2. initScrollAnimation() — setup Observer (deve precedere render)
     3. renderReports(REPORTS)— inietta le card dall'array statico
     4. initFooterYear()      — aggiorna l'anno nel copyright
───────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  // 1. Navbar: scroll behavior + hamburger menu mobile
  initNavbar();

  // 2. IntersectionObserver per animazioni fadeUp all'entrata
  initScrollAnimation();

  /*
   * 3. Rendering report dall'array statico REPORTS.
   *    Nessuna chiamata di rete: la pagina funziona interamente
   *    come file locale (anche senza server HTTP).
   */
  renderReports(REPORTS);

  // 4. Anno corrente nel copyright del footer
  initFooterYear();

});
