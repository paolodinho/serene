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

// ---------- Hiệu ứng: scroll reveal + đếm số ----------
(function(){
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;
  const groups = ['.usp .item','.stats .stat','.about .imgwrap','.about .grid > div:first-child',
    '.sec-head','.rooms-grid .room-card','.amen-list li','.exp-card','.gallery-grid img',
    '.reviews-grid .review-card','.blog-grid .blog-card','.room-detail','.offer-card','.contact-wrap > *','.post-body'];
  const seen = new Set();
  groups.forEach(sel=>{
    document.querySelectorAll(sel).forEach((el,i)=>{
      if(seen.has(el)) return; seen.add(el);
      el.classList.add('reveal');
      el.dataset.rev = Math.min(i,6);   // stagger index (không gắn transition-delay để không ảnh hưởng hover)
    });
  });
  const io = new IntersectionObserver((ents,obs)=>{
    ents.forEach(e=>{
      if(!e.isIntersecting) return;
      const el=e.target, d=(+el.dataset.rev||0)*70;
      setTimeout(()=>el.classList.add('in'), d);
      if(el.matches('.stat')) setTimeout(()=>countStat(el), d);
      obs.unobserve(el);
    });
  }, {threshold:.16, rootMargin:'0px 0px -8% 0px'});
  seen.forEach(el=>io.observe(el));

  function countStat(stat){
    const b=stat.querySelector('b'); if(!b) return;
    const node=[...b.childNodes].find(n=>n.nodeType===3 && n.textContent.trim());
    if(!node) return;
    const raw=node.textContent.trim();
    if(raw.includes('/')) return;                 // "24/7" giữ nguyên
    const m=raw.match(/^([\d.,]+)(.*)$/); if(!m) return;
    const suffix=m[1+1]||'', hasComma=m[1].includes(',');
    const target=parseFloat(m[1].replace(',','.')); if(isNaN(target)) return;
    const dec=hasComma?1:0, dur=1100, t0=performance.now();
    (function tick(t){
      const p=Math.min((t-t0)/dur,1), e=1-Math.pow(1-p,3);
      node.textContent=(target*e).toFixed(dec).replace('.',',')+suffix;
      if(p<1) requestAnimationFrame(tick);
    })(performance.now());
  }
})();
