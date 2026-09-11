/* PDF.js document viewer. Original PDFs and slide-preserving PowerPoint exports. */
(() => {
  'use strict';
  const root = document.getElementById('anamika-portfolio');
  if (!root) return;
  const $ = id => root.querySelector(`#${id}`);
  const dialog = $('document-viewer');
  const stage = $('document-stage');
  const pageHost = $('document-page');
  const status = $('document-status');
  const position = $('document-position');
  const previous = $('document-previous');
  const next = $('document-next');
  const error = $('document-error');
  const docs = new Map();
  const scripts = new Map();
  let library;
  let documentPDF;
  let requestedPage = 1;
  let zoom = 1;
  let opener;
  let overflow;
  let session = 0;
  let renderID = 0;
  let rendering;
  let resizeTimer;

  function script(src) {
    if (scripts.has(src)) return scripts.get(src);
    const pending = new Promise((resolve, reject) => {
      const el = document.createElement('script');
      el.src = src;
      el.onload = resolve;
      el.onerror = () => { scripts.delete(src); el.remove(); reject(new Error('Asset unavailable')); };
      document.head.appendChild(el);
    });
    scripts.set(src, pending);
    return pending;
  }
  async function loadLibrary() {
    if (!window.anamikaPDFReady) await script('vendor/pdfjs/loader.js');
    return window.anamikaPDFReady;
  }
  function controls() {
    previous.disabled = !documentPDF || requestedPage <= 1;
    next.disabled = !documentPDF || requestedPage >= documentPDF.numPages;
    position.textContent = documentPDF ? `${requestedPage} / ${documentPDF.numPages}` : 'Loading…';
    $('document-zoom-out').disabled = !documentPDF || zoom <= .5;
    $('document-zoom-in').disabled = !documentPDF || zoom >= 3;
    $('document-fit').textContent = zoom === 1 ? 'Fit' : `${Math.round(zoom * 100)}%`;
  }
  async function draw() {
    if (!documentPDF || !dialog.open) return;
    const ownRender = ++renderID;
    rendering?.cancel();
    controls();
    error.hidden = true;
    status.textContent = 'Rendering page…';
    status.hidden = false;
    const pdf = documentPDF;
    const number = requestedPage;
    try {
      const page = await pdf.getPage(number);
      if (ownRender !== renderID || !dialog.open) return;
      const original = page.getViewport({ scale: 1 });
      const fit = Math.min(Math.max(240, stage.clientWidth - 36) / original.width,
        Math.max(180, stage.clientHeight - 36) / original.height);
      const viewport = page.getViewport({ scale: fit * zoom });
      const density = Math.min(window.devicePixelRatio || 1, 2,
        Math.sqrt(16000000 / (viewport.width * viewport.height)));
      const canvas = document.createElement('canvas');
      canvas.id = 'document-canvas';
      canvas.setAttribute('role', 'img');
      canvas.setAttribute('aria-label', `${$('document-viewer-title').textContent}, page ${number} of ${pdf.numPages}`);
      canvas.width = Math.ceil(viewport.width * density);
      canvas.height = Math.ceil(viewport.height * density);
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;
      rendering = page.render({ canvasContext: canvas.getContext('2d'), viewport,
        transform: density === 1 ? null : [density, 0, 0, density, 0, 0] });
      await rendering.promise;
      if (ownRender !== renderID || !dialog.open) return;
      pageHost.replaceChildren(canvas);
      pageHost.hidden = false;
      status.hidden = true;
      stage.scrollTop = 0;
      stage.scrollLeft = 0;
      const text = await page.getTextContent();
      if (ownRender === renderID) $('document-accessible-text').textContent = text.items.map(item => item.str || '').join(' ');
    } catch (failure) {
      if (ownRender !== renderID || failure.name === 'RenderingCancelledException') return;
      status.hidden = true;
      error.hidden = false;
    }
  }
  async function open(link) {
    const ownSession = ++session;
    ++renderID;
    rendering?.cancel();
    opener = link;
    overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    documentPDF = null;
    zoom = 1;
    requestedPage = 1;
    controls();
    error.hidden = true;
    pageHost.hidden = true;
    status.textContent = 'Loading document…';
    status.hidden = false;
    $('document-accessible-text').textContent = '';
    $('document-viewer-title').textContent = `${link.dataset.caseBrand} · ${link.closest('.case-card').querySelector('h3').textContent}`;
    $('document-fallback').href = link.href;
    dialog.showModal();
    $('document-close').focus();
    try {
      library = await loadLibrary();
      const key = link.dataset.document;
      if (!docs.has(key)) {
        if (!window.anamikaDocuments?.[key]) await script(link.dataset.documentSrc);
        const bytes = Uint8Array.from(atob(window.anamikaDocuments[key]), c => c.charCodeAt(0));
        const pending = library.getDocument({ data: bytes, useWasm: false,
          useSystemFonts: true, isEvalSupported: false }).promise;
        docs.set(key, pending);
        pending.catch(() => docs.delete(key));
      }
      const pdf = await docs.get(key);
      if (ownSession !== session || !dialog.open) return;
      documentPDF = pdf;
      await draw();
    } catch (_) {
      if (ownSession !== session || !dialog.open) return;
      status.hidden = true;
      error.hidden = false;
    }
  }
  root.querySelectorAll('.case-view').forEach(link => link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !dialog.showModal) return;
    event.preventDefault();
    open(link);
  }));
  function navigate(delta) {
    if (!documentPDF) return;
    requestedPage = Math.max(1, Math.min(documentPDF.numPages, requestedPage + delta));
    draw();
  }
  previous.addEventListener('click', () => navigate(-1));
  next.addEventListener('click', () => navigate(1));
  $('document-zoom-in').addEventListener('click', () => { zoom = Math.min(3, zoom + .25); draw(); });
  $('document-zoom-out').addEventListener('click', () => { zoom = Math.max(.5, zoom - .25); draw(); });
  $('document-fit').addEventListener('click', () => { zoom = 1; draw(); });
  $('document-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    ++session;
    ++renderID;
    rendering?.cancel();
    if (document.fullscreenElement === dialog) document.exitFullscreen?.().catch(() => {});
    document.body.style.overflow = overflow;
    opener?.focus({ preventScroll: true });
  });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); navigate(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  const fullscreen = $('document-fullscreen');
  fullscreen.hidden = !dialog.requestFullscreen;
  fullscreen.addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await dialog.requestFullscreen();
    } catch (_) { /* The viewer remains usable when fullscreen is unavailable. */ }
  });
  new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { if (dialog.open && documentPDF) draw(); }, 120);
  }).observe(stage);
})();
