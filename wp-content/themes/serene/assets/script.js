// Language: URL-based (/vi /en /zh) on static build, JS toggle on WP dev
const html = document.documentElement;
function applyLang(l){
  html.dataset.lang = l; html.lang = (l==='zh'?'zh-Hans':l);
  document.querySelectorAll('.lang [data-set]').forEach(x=>x.classList.toggle('active', x.dataset.set===l));
}
const langSeg = location.pathname.match(/\/(vi|en|zh)(?=\/|$)/);
if (langSeg) {
  // Static multilingual: trust URL segment, switch by navigating
  applyLang(langSeg[1]);
  document.querySelectorAll('.lang [data-set]').forEach(b=>{
    b.addEventListener('click', e=>{
      e.preventDefault();
      const l = b.dataset.set;
      const p = location.pathname.replace(/\/(vi|en|zh)(?=\/|$)/, '/'+l);
      location.href = p + location.hash;
    });
  });
} else {
  // WP dev / non-prefixed: keep baked lang, allow JS toggle with persistence
  try{ const s=localStorage.getItem('serene_lang'); if(s) applyLang(s); }catch(e){}
  document.querySelectorAll('.lang [data-set]').forEach(b=>{
    b.addEventListener('click', ()=>{
      const l=b.dataset.set; applyLang(l);
      try{ localStorage.setItem('serene_lang', l); }catch(e){}
    });
  });
}
// Mobile nav
const burger=document.getElementById('burger'), nav=document.getElementById('nav');
burger?.addEventListener('click',()=>nav.classList.toggle('open'));
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
// Header shadow on scroll
const header=document.querySelector('.site-header');
addEventListener('scroll',()=>{header.style.boxShadow=scrollY>20?'var(--shadow-mid)':'none';});

// Booking widget -> prefill booking form (no re-typing)
(function(){
  const go=document.getElementById('bk-go'); if(!go) return;
  const fmt=v=>{ if(!v) return ''; const p=v.split('-'); return p.length===3 ? p[2]+'/'+p[1] : v; };
  go.addEventListener('click',function(e){
    const di=document.getElementById('bk-in'), doo=document.getElementById('bk-out'),
          g=document.getElementById('bk-guests'), r=document.getElementById('bk-room');
    const inD=fmt(di&&di.value), outD=fmt(doo&&doo.value);
    const dates = inD&&outD ? inD+' – '+outD : (inD||outD||'');
    const fDates=document.querySelector('input[name="your-dates"]'),
          fG=document.querySelector('input[name="your-guests"]'),
          fR=document.querySelector('select[name="your-room"]'),
          fName=document.querySelector('input[name="your-name"]');
    if(fDates && dates) fDates.value=dates;
    if(fG && g) fG.value=g.value;
    if(fR && r){
      const want = r.value || 'Tư vấn giúp tôi / Advise me';
      [...fR.options].forEach(o=>{ if(o.value===want||o.text===want) fR.value=o.value; });
    }
    // smooth scroll then focus first empty field
    const tgt=document.getElementById('contact');
    if(tgt){ e.preventDefault(); tgt.scrollIntoView({behavior:'smooth'}); setTimeout(()=>fName&&fName.focus(),500); }
  });
})();
