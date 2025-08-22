// assets/data/loader.js
import { FAMIGLIE, MATERIALI, FINITURE } from './cataloghi.js';
import { TIPI } from './tipi.js';

const KEY = 'scm_data'; // override in localStorage

export function getData(ignoreOverride = false) {
  let data = {
    famiglie: FAMIGLIE,
    materiali: MATERIALI,
    finiture: FINITURE,
    tipi: TIPI
  };
  if (!ignoreOverride) {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const ov = JSON.parse(raw);
        data = { ...data, ...ov };
      }
    } catch {}
  }
  return data;
}

export function setOverride(obj) {
  localStorage.setItem(KEY, JSON.stringify(obj));
}

export function clearOverride() {
  localStorage.removeItem(KEY);
}
