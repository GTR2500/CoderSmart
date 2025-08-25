// assets/loader.js
// Loader universale: override da localStorage + default assets/data/*
// Ritorna SEMPRE formato canonico: { famiglie[], materiali[], finiture[], tipi[] }
// famiglie[i] = { code,label,D,L,H,Sp,mat,fin,tok }

const STORAGE_KEYS = [
  'scm.catalogs.override',
  'scm:catalogsOverride',
  'scm_override_catalogs',
  'ShortCodeMakerV4.catalogsOverride'
];

const PATHS = {
  famiglie: 'assets/data/famiglie.json',
  materiali: 'assets/data/materiali.json',
  finiture:  'assets/data/finiture.json',
  tipi:      'assets/data/tipi.json',
};

const toBool = v => !!(v === true || v === 'true' || v === 1 || v === '1');

function canonFam(x){
  return {
    code: (x.code || '').trim().toUpperCase(),
    label: x.label || '',
    D:   toBool(x.D   ?? x.useD ?? x.d),
    L:   toBool(x.L   ?? x.useL ?? x.l),
    H:   toBool(x.H   ?? x.useH ?? x.h),
    Sp:  toBool(x.Sp  ?? x.useSp ?? x.sp),
    mat: toBool(x.mat ?? x.hasMaterial ?? x.material),
    fin: toBool(x.fin ?? x.hasFinish   ?? x.finish),
    tok: toBool(x.tok ?? x.useTokens   ?? x.tokens),
  };
}
const canonSimple = (x)=>({code:(x.code||'').trim().toUpperCase(), label:x.label||''});

function canonize(obj){
  return {
    famiglie: (obj.famiglie||[]).map(canonFam),
    materiali:(obj.materiali||[]).map(canonSimple),
    finiture: (obj.finiture ||[]).map(canonSimple),
    tipi:     (obj.tipi     ||[]).map(canonSimple),
  };
}

function fromLS(){
  for(const k of STORAGE_KEYS){
    const raw = localStorage.getItem(k);
    if(!raw) continue;
    try{
      const parsed = JSON.parse(raw);
      if(parsed && parsed.famiglie && parsed.materiali && parsed.finiture && parsed.tipi){
        return canonize(parsed);
      }
    }catch(e){}
  }
  return null;
}

export async function loadCatalogs(){
  const ls = fromLS();
  if(ls) return ls;

  const [fam, mat, fin, tip] = await Promise.all([
    fetch(PATHS.famiglie).then(r=>r.json()),
    fetch(PATHS.materiali).then(r=>r.json()),
    fetch(PATHS.finiture).then(r=>r.json()),
    fetch(PATHS.tipi).then(r=>r.json()),
  ]);
  return canonize({famiglie:fam, materiali:mat, finiture:fin, tipi:tip});
}

export function saveOverrideCanonical(canonical){
  const txt = JSON.stringify(canonical);
  for(const k of STORAGE_KEYS) localStorage.setItem(k, txt);
}
export function clearOverride(){
  for(const k of STORAGE_KEYS) localStorage.removeItem(k);
}
