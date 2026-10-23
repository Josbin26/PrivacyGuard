const BASE=import.meta.env.VITE_API_URL||'/api';
async function req(path,opts={}){const r=await fetch(`${BASE}${path}`,{headers:{'Content-Type':'application/json',...(opts.headers||{})},...opts});if(!r.ok){const b=await r.json().catch(()=>({}));throw new Error(b.message||'Request failed');}return r.status===204?null:r.json();}
export const scanText=text=>req('/scans',{method:'POST',body:JSON.stringify({text})});
export const getHistory=()=>req('/scans');
export const deleteScan=id=>req(`/scans/${id}`,{method:'DELETE'});
