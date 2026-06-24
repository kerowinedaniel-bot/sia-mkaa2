// UI enhancements: smooth scroll, reveal on scroll, header shadow, parallax and 3D tilt
(function(){
  // smooth anchors
  document.querySelectorAll('a[href^="#"]').forEach(a=>{ a.addEventListener('click', (e)=>{ e.preventDefault(); const t=document.querySelector(a.getAttribute('href')); if(t) t.scrollIntoView({behavior:'smooth',block:'start'}); }); });

  // header shadow on scroll
  const header = document.querySelector('.header');
  window.addEventListener('scroll', ()=>{ header.style.boxShadow = (window.scrollY>20) ? '0 14px 50px rgba(0,0,0,0.6)' : 'none'; });

  // reveal elements
  const obs = new IntersectionObserver((entries)=>{ entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('visible'); }); }, {threshold:0.12});
  document.querySelectorAll('.service,.card,.contact-box').forEach(el=>obs.observe(el));

  // 3D parallax for hero layers
  const hero = document.querySelector('.hero-inner');
  if(hero){
    const rect = ()=>hero.getBoundingClientRect();
    let mouseX=0, mouseY=0, lX=0, lY=0;
    window.addEventListener('mousemove', (e)=>{ mouseX = (e.clientX - window.innerWidth/2) / (window.innerWidth/2); mouseY = (e.clientY - window.innerHeight/2) / (window.innerHeight/2); });
    function raf(){ lX += (mouseX - lX) * 0.08; lY += (mouseY - lY) * 0.08; hero.style.transform = `rotateX(${(lY*6)}deg) rotateY(${(lX*6)}deg)`; requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }

  // tilt effect for cards and services (safe wrapper so icons and images are preserved)
  const tiltables = document.querySelectorAll('.service, .card, .contact-box, .uploaded-img');
  tiltables.forEach(el=>{
    if(!el.classList.contains('tilt')) el.classList.add('tilt');
    // don't double-wrap
    if(!el.querySelector('.tilt-inner')){
      const inner = document.createElement('div'); inner.className = 'tilt-inner';
      // move children into inner (preserves images and icons)
      while(el.firstChild) inner.appendChild(el.firstChild);
      el.appendChild(inner);
    }
    const inner = el.querySelector('.tilt-inner');
    el.addEventListener('mousemove', (ev)=>{
      const b = el.getBoundingClientRect();
      const px = (ev.clientX - b.left)/b.width; const py = (ev.clientY - b.top)/b.height;
      const rx = (py - 0.5) * -12; const ry = (px - 0.5) * 12; const tz = 12;
      if(inner) inner.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(${tz}px)`;
      el.style.boxShadow = '0 40px 90px rgba(0,0,0,0.7)';
    });
    el.addEventListener('mouseleave', ()=>{
      if(inner) inner.style.transform = '';
      el.style.boxShadow = '';
    });
  });

})();

// Extra dynamic features: scroll progress, counters and subtle parallax on hero background
(function(){
  const progress = document.getElementById('scroll-progress');
  const hero = document.querySelector('.hero');
  function onScroll(){
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const sc = (window.scrollY / (docH||1)) * 100;
    if(progress) progress.style.width = sc + '%';
    // update hero background parallax var
    if(hero){
      const x = (window.innerWidth/2 - (window.scrollX + window.innerWidth/2)) * 0.01;
      hero.style.setProperty('--bg-x', x + 'px');
      const y = (window.scrollY - hero.offsetTop) * 0.02;
      hero.style.setProperty('--bg-y', (y||0) + 'px');
    }
  }
  window.addEventListener('scroll', onScroll); onScroll();

  // counters
  const counters = document.querySelectorAll('.num');
  const ctrObs = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const el = entry.target; const target = +el.dataset.target || 0; let cur=0; const step = Math.max(1, Math.floor(target/60));
        const t = setInterval(()=>{ cur += step; if(cur >= target){ el.textContent = target; clearInterval(t);} else el.textContent = cur; }, 16);
        ctrObs.unobserve(el);
      }
    });
  },{threshold:0.4});
  counters.forEach(c=>ctrObs.observe(c));

  // subtle parallax for floating icons
  const floatWrap = document.querySelector('.floating-icons');
  const floats = document.querySelectorAll('.float-icon');
  if(floatWrap && floats.length){
    window.addEventListener('mousemove', (e)=>{
      const cx = e.clientX - window.innerWidth/2; const cy = e.clientY - window.innerHeight/2;
      floats.forEach((f,i)=>{
        const depth = (i+1)*6;
        f.style.transform = `translate3d(${cx*(0.003*depth)}px,${Math.sin((Date.now()/600)+(i))*10 - (cy*(0.002*depth))}px,0)`;
      });
    });
  }

})();
