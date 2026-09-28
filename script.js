// Human+ Bali v2 — ref-inspired interactions
(function(){
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const stickyCta = document.getElementById('stickyCta');

  function onScroll(){
    if(stickyCta){
      const menuOpen = mobileMenu.classList.contains('open');
      const m = document.getElementById('svcModal');
      const modalOpen = m && m.classList.contains('open');
      const hidden = menuOpen || modalOpen;
      stickyCta.style.opacity = hidden ? '0' : '1';
      stickyCta.style.pointerEvents = hidden ? 'none' : 'auto';
    }
    const ids = ['home','about','services','longevity','approach','faq','contact'];
    let cur = 'home';
    ids.forEach(id=>{
      const el = document.getElementById(id);
      if(el && el.getBoundingClientRect().top < 160) cur = id;
    });
    document.querySelectorAll('.nav-link').forEach(a=>a.classList.toggle('active', a.getAttribute('href')==='#'+cur));
  }
  addEventListener('scroll', onScroll, {passive:true}); onScroll();

  function toggleMenu(force){
    const open = force!==undefined?force:!mobileMenu.classList.contains('open');
    mobileMenu.classList.toggle('open', open);
    hamburger.classList.toggle('open', open);
    navbar.classList.toggle('menu-open', open);
    document.body.classList.toggle('menu-open', open);
    hamburger.setAttribute('aria-expanded', open);
    mobileMenu.setAttribute('aria-hidden', !open);
    hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    const modalOpen = document.getElementById('svcModal')?.classList.contains('open');
    document.body.style.overflow = (open || modalOpen) ? 'hidden' : '';
    onScroll();
  }
  hamburger.addEventListener('click', ()=>toggleMenu());
  mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=>toggleMenu(false)));
  addEventListener('keydown', e=>{ if(e.key==='Escape') toggleMenu(false); });

  const io = new IntersectionObserver(es=>es.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('visible'); io.unobserve(en.target);} }),{threshold:.1});
  document.querySelectorAll('.reveal,.reveal-img').forEach(el=>io.observe(el));

  function goTo(id){
    const t = document.querySelector(id);
    if(!t) return;
    const top = t.getBoundingClientRect().top + scrollY - 84;
    scrollTo({top, behavior:'smooth'});
  }
  document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click', e=>{
    const id = a.getAttribute('href');
    if(id.length>1 && document.querySelector(id)){
      e.preventDefault();
      const m = document.getElementById('svcModal');
      const needWait = (m && m.classList.contains('open')) || mobileMenu.classList.contains('open');
      if(m && m.classList.contains('open')){ m.classList.remove('open'); m.setAttribute('aria-hidden','true'); document.body.classList.remove('modal-open'); }
      if(mobileMenu.classList.contains('open')) toggleMenu(false);
      document.body.style.overflow = '';
      setTimeout(()=>{ goTo(id); if(id==='#contact'){ setTimeout(()=>document.getElementById('fName')?.focus({preventScroll:true}), 650); } }, needWait ? 90 : 0);
    }
  }));

  // FAQ single open
  const accs = document.querySelectorAll('.acc');
  accs.forEach(acc=>acc.querySelector('summary').addEventListener('click', ()=>setTimeout(()=>{ if(acc.open) accs.forEach(o=>{ if(o!==acc) o.open=false; }); },0)));

  // Testimonial carousel
  const data = [
    {q:'“A completely different approach to healthcare. The experience felt personal, calm and incredibly thoughtful.”', n:'Client Name — Demo Testimonial*', img:'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop'},
    {q:'“From booking to follow-up, everything was seamless. I felt listened to, never rushed.”', n:'Client Name — Demo Testimonial*', img:'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop'},
    {q:'“The space, the team, the clarity. It feels like health, designed for real life in Bali.”', n:'Client Name — Demo Testimonial*', img:'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=800&auto=format&fit=crop'}
  ];
  let ti = 0;
  const qEl = document.getElementById('tQuote'), nEl = document.getElementById('tName'), mEl = document.getElementById('tiMain');
  const avs = document.querySelectorAll('.t-av');
  function show(i){
    ti = (i+data.length)%data.length;
    qEl.textContent = data[ti].q; nEl.innerHTML = data[ti].n; mEl.src = data[ti].img;
    avs.forEach((a,k)=>a.classList.toggle('active', k===ti));
  }
  document.getElementById('tPrev').addEventListener('click', ()=>show(ti-1));
  document.getElementById('tNext').addEventListener('click', ()=>show(ti+1));
  avs.forEach(a=>a.addEventListener('click', ()=>show(+a.dataset.i)));

  // Service detail modal — safe demo content, no medical claims
  const svcData = {
    iv: {num:'01', title:'IV Therapy', img:'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1000&auto=format&fit=crop',
      desc:'A personalized approach to modern wellness, delivered in a calm and premium environment. Every session starts with consultation — no ingredients, dosages or outcomes stated here.',
      expect:['Book a consultation','Discuss goals and health history','Explore a tailored approach','Begin in clinic or at home*'],
      notes:['Consultation recommended first','Duration shared at booking — demo','Home visits subject to availability*','Bring ID and health history']},
    diagnostics: {num:'02', title:'Diagnostics', img:'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=1000&auto=format&fit=crop',
      desc:'Health assessments and diagnostic services designed to provide deeper insight into your current health. Results reviewed with the Human+ team. [Demo placeholder].',
      expect:['Book an assessment','Share goals and background','Review insights together','Plan next steps'],
      notes:['No diagnoses stated here — demo','Reports explained simply','Follow-up as needed','Contact team for test list']},
    recovery: {num:'03', title:'Recovery Technology', img:'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop',
      desc:'Modern recovery technologies designed to support restoration, performance and wellbeing in a premium setting. [Demo placeholder, no devices specified].',
      expect:['Consultation and intro','Guided recovery session','Rest and reset','Continue your routine'],
      notes:['Session length varies — demo','Ideal after training / travel*','Wear comfortable clothing','Ask team for suitability']},
    home: {num:'04', title:'Home Health Care', img:'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1000&auto=format&fit=crop',
      desc:'Personalized healthcare delivered with convenience and comfort — at your villa, hotel or home in Bali, subject to service availability.',
      expect:['Request home visit','Confirm area and schedule','Team arrives discreetly','Relaxed care at your place'],
      notes:['Coverage area to be confirmed','Subject to availability*','Calm, private experience','WhatsApp for fastest response']},
    longevity: {num:'05', title:'Longevity', img:'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000&auto=format&fit=crop',
      desc:'A longer view of health: assess, understand, personalize, recover and optimize — in one continuous, intentional journey. Conceptual framework, not a clinical protocol.',
      expect:['Assess — understand where you are','Understand — see what matters','Personalize — care around you','Recover & Optimize over time'],
      notes:['Holistic and unhurried','Combines all 4 pillars','Long-term perspective','Start with consultation']}
  };
  const modal = document.getElementById('svcModal');
  const mImg = document.getElementById('mImg'), mNum = document.getElementById('mNum'),
        mTitle = document.getElementById('mTitle'), mDesc = document.getElementById('mDesc'),
        mExpect = document.getElementById('mExpect'), mNotes = document.getElementById('mNotes'),
        mBook = document.getElementById('mBook');
  let lastFocus = null;
  function openSvc(key, silent){
    const d = svcData[key]; if(!d) return;
    lastFocus = document.activeElement;
    mImg.src = d.img; mImg.alt = d.title;
    mNum.textContent = d.num; mTitle.textContent = d.title; mDesc.textContent = d.desc;
    mExpect.innerHTML = d.expect.map(x=>'<li>'+x+'</li>').join('');
    mNotes.innerHTML = d.notes.map(x=>'<li>'+x+'</li>').join('');
    const sel = document.getElementById('fService');
    if(sel){ [...sel.options].forEach(o=>{ if(o.text.toLowerCase().includes(d.title.split(' ')[0].toLowerCase())) sel.value = o.value || o.text; }); }
    modal.classList.add('open'); modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
    if(!silent) document.getElementById('modalClose').focus();
    onScroll();
  }
  function closeSvc(silent){
    if(!modal.classList.contains('open')) return;
    modal.classList.remove('open'); modal.setAttribute('aria-hidden','true');
    document.body.classList.remove('modal-open');
    if(!mobileMenu.classList.contains('open')) document.body.style.overflow = '';
    if(!silent && lastFocus) lastFocus.focus();
    onScroll();
  }
  document.querySelectorAll('[data-service]').forEach(card=>{
    card.addEventListener('click', ()=>openSvc(card.dataset.service));
    card.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openSvc(card.dataset.service); } });
  });
  document.getElementById('modalClose').addEventListener('click', ()=>closeSvc());
  modal.addEventListener('click', e=>{ if(e.target===modal) closeSvc(); });
  addEventListener('keydown', e=>{ if(e.key==='Escape'){ closeSvc(); toggleMenu(false); } });
  // NOTE: mBook/mFaq are anchor links — smooth-scroll handler above already closes modal + scrolls. No extra close here to avoid focus fight.

  // Booking demo form
  const form = document.getElementById('bookForm');
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const name = (document.getElementById('fName').value||'there').trim();
    const note = document.getElementById('formNote');
    note.textContent = 'Thank you, '+name+' — demo request received. (No data sent.)';
    note.style.color = '#131414';
  });
  console.log('Human+ Bali v2 loaded — no errors.');
})();
