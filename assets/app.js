// assets/app.js
import { getData } from './data/loader.js';

const DOM = {
  famiglia:   document.getElementById('famiglia'),
  materiale:  document.getElementById('materiale'),
  finitura:   document.getElementById('finitura'),
  tipo:       document.getElementById('tipo'),

  includeFam: document.getElementById('includeFam'),
  includeTipo:document.getElementById('includeTipo'),
  includeD:   document.getElementById('includeD'),
  includeL:   document.getElementById('includeL'),
  includeH:   document.getElementById('includeH'),
  includeS:   document.getElementById('includeSpessore'),
  includeMat: document.getElementById('includeMat'),
  includeFin: document.getElementById('includeFin'),
  includeTok: document.getElementById('includeToken'),

  D:          document.getElementById('D'),
  L:          document.getElementById('L'),
  H:          document.getElementById('H'),
  S:          document.getElementById('spessore'),
  token:      document.getElementById('token'),

  shortcode:  document.getElementById('shortcode'),
  foldername: document.getElementById('foldername'),
  filename:   document.getElementById('filename'),
  descrizione:document.getElementById('descrizione'),
};

function pad(n, len) {
  if (n === null || n === undefined || isNaN(n)) return '0'.repeat(len);
  const s = Math.round(Number(n)).toString();
  return s.padStart(len, '0').slice(-len);
}
function padDecTenth(n, len=3) {
  if (n === null || n === undefined || isNaN(n)) return '0'.repeat(len);
  const v = Math.round(Number(n) * 10); // decimi
  return v.toString().padStart(len, '0').slice(-len);
}
function cleanToken(s) {
  s = (s || '').toString().toUpperCase().replace(/[^A-Z0-9]/g, '');
  return s || '000';
}
function getSel(select){ const i=select.selectedIndex; return i>=0 ? select.options[i].value : ''; }
function getLabel(select){ const i=select.selectedIndex; return i>=0 ? select.options[i].text : ''; }

function build() {
  const data = getData();

  const famCode = getSel(DOM.famiglia) || '---';
  const famLabel= getLabel(DOM.famiglia) || '';

  const tipoCode= getSel(DOM.tipo) || '---';
  const tipoLabel= getLabel(DOM.tipo) || '';

  const D3 = DOM.includeD.checked ? pad(DOM.D.value, 3) : '000';
  const L4 = DOM.includeL.checked ? pad(DOM.L.value, 4) : '0000';
  const H4 = DOM.includeH.checked ? pad(DOM.H.value, 4) : '0000';
  const S3 = DOM.includeS.checked ? padDecTenth(DOM.S.value, 3) : '000';

  const matCode = DOM.includeMat.checked ? (getSel(DOM.materiale) || '000') : '000';
  const finCode = DOM.includeFin.checked ? (getSel(DOM.finitura) || '000') : '000';
  const tokCode = DOM.includeTok.checked ? cleanToken(DOM.token.value) : '000';

  // compone ShortCode
  const parts = [
    famCode, DOM.includeTipo.checked ? tipoCode : '---',
    D3, L4, H4, S3, matCode, finCode, tokCode
  ];
  const shortCode = parts.join('-');

  // folder/file/desc
  const folder = `${famCode}/${DOM.includeTipo.checked ? tipoCode : '---'}/${shortCode}`;
  const file = `${shortCode}.dwg`;
  const desc = [
    famLabel, tipoLabel && `— ${tipoLabel}`,
    DOM.includeD.checked && `D=${Number(DOM.D.value)||0}mm`,
    DOM.includeL.checked && `L=${Number(DOM.L.value)||0}mm`,
    DOM.includeH.checked && `H=${Number(DOM.H.value)||0}mm`,
    DOM.includeS.checked && `S=${Number(DOM.S.value)||0}mm`,
    DOM.includeMat.checked && getLabel(DOM.materiale),
    DOM.includeFin.checked && getLabel(DOM.finitura),
    DOM.includeTok.checked && `TOK=${cleanToken(DOM.token.value)}`
  ].filter(Boolean).join(' | ');

  DOM.shortcode.value = shortCode;
  DOM.foldername.value = folder;
  DOM.filename.value = file;
  DOM.descrizione.value = desc;
}

function fillSelect(select, items, includeCode = true) {
  select.innerHTML = '';
  const opt0 = new Option('— Seleziona —', '');
  select.add(opt0);
  items.forEach(o => {
    const text = includeCode ? `${o.code} — ${o.label}` : o.label;
    const opt = new Option(text, o.code);
    select.add(opt);
  });
}

function init() {
  const { famiglie, materiali, finiture, tipi } = getData();

  fillSelect(DOM.famiglia, famiglie);
  fillSelect(DOM.materiale, materiali);
  fillSelect(DOM.finitura, finiture);
  fillSelect(DOM.tipo, tipi);

  const inputs = [
    DOM.famiglia, DOM.materiale, DOM.finitura, DOM.tipo,
    DOM.includeTipo, DOM.includeD, DOM.includeL, DOM.includeH, DOM.includeS, DOM.includeMat, DOM.includeFin, DOM.includeTok,
    DOM.D, DOM.L, DOM.H, DOM.S, DOM.token
  ];
  inputs.forEach(el => el && el.addEventListener('input', build));

  // copia su click
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const sel = btn.getAttribute('data-copy');
      const inp = document.querySelector(sel);
      if (!inp) return;
      inp.select(); inp.setSelectionRange(0, 99999);
      document.execCommand('copy');
      btn.textContent = 'Copiato!';
      setTimeout(()=>btn.textContent='Copia', 1000);
    });
  });

  build();
}

document.addEventListener('DOMContentLoaded', init);
