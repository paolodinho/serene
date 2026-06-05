// Language toggle + persist across pages
const html = document.documentElement;
function setLang(l){
  html.dataset.lang = l; html.lang = (l==='zh'?'zh-Hans':l);
  try{ localStorage.setItem('serene_lang', l); }catch(e){}
  document.querySelectorAll('.lang button').forEach(x=>x.classList.toggle('active', x.dataset.set===l));
}
try{ const saved = localStorage.getItem('serene_lang'); if(saved){ setLang(saved); } }catch(e){}
document.querySelectorAll('.lang button').forEach(b=>{
  b.addEventListener('click', ()=> setLang(b.dataset.set));
});
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
