const $=(q,e=document)=>e.querySelector(q);
const $$=(q,e=document)=>[...e.querySelectorAll(q)];

async function loadProfile(){
  const res = await fetch('profile.json', {cache:'no-store'});
  const d = await res.json();

  $('#name').textContent=d.name;
  $('#name2').textContent=d.name;
  $('#name3').textContent=d.name;
  $('#title').textContent=d.title;
  $('#tagline').textContent=d.tagline;

  const tel = 'tel:' + d.phone.replace(/\s/g,'');
  $('#phone').textContent=d.phone; $('#phone').href=tel;
  $('#phone2').textContent=d.phone; $('#phone2').href=tel;
  $('#callBtn').href=tel;

  const mail='mailto:'+d.email;
  $('#email').textContent=d.email; $('#email').href=mail;
  $('#email2').textContent=d.email; $('#email2').href=mail;
  $('#mailBtn').href=mail;

  $('#tempAddr').textContent=d.temp_address;
  $('#permAddr').textContent=d.perm_address;

  $('#objective').textContent=d.objective;
  $('#objective2').textContent=d.objective;

  const langs=$('#langs'); langs.innerHTML='';
  d.languages.forEach(l=>{const s=document.createElement('span');s.className='chip';s.textContent=l;langs.appendChild(s);});

  const xp=$('#xp'); xp.innerHTML='';
  d.experience.forEach(it=>{
    const el=document.createElement('article');
    el.className='xp reveal';
    el.innerHTML=`
      <div class="xp__when">${it.start} — ${it.end}</div>
      <div>
        <h3 class="xp__role">${it.role}</h3>
        <p class="xp__org">${it.org}</p>
        ${it.highlights && it.highlights.length ? `<ul class="xp__hl">${it.highlights.map(h=>`<li>${h}</li>`).join('')}</ul>`:''}
      </div>`;
    xp.appendChild(el);
  });

  const edu=$('#edu'); edu.innerHTML='';
  d.education.forEach(e=>{
    const el=document.createElement('div');
    el.className='card reveal';
    el.innerHTML=`
      <h3>${e.degree}</h3>
      <p class="muted">${e.school}</p>
      <div class="pillRow">
        <span class="pill2">Year: ${e.year}</span>
        <span class="pill2">Score: ${e.score}</span>
      </div>`;
    edu.appendChild(el);
  });

  const sg=$('#skillsGrid'); sg.innerHTML='';
  d.skills.forEach(s=>{
    const el=document.createElement('div');
    el.className='card reveal';
    el.innerHTML=`<h3>${s}</h3><p class="muted">Practical, patient‑focused and reliable.</p>`;
    sg.appendChild(el);
  });

  document.title = `${d.name} — ${d.title}`;
}

function setupTheme(){
  const key='portfolio_theme';
  const apply=(t)=>{document.documentElement.dataset.theme=t;localStorage.setItem(key,t);};
  const saved=localStorage.getItem(key);
  if(saved) apply(saved);
  else {
    const prefersLight=window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    apply(prefersLight?'light':'dark');
  }
  $('#themeBtn').addEventListener('click',()=>{
    const cur=document.documentElement.dataset.theme||'dark';
    apply(cur==='dark'?'light':'dark');
  });
}

function setupMenu(){
  const btn=$('#menuBtn'), nav=$('#nav');
  btn.addEventListener('click',()=>{
    const open=nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  });
  $$('#nav a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');btn.setAttribute('aria-expanded','false');}));
}

function setupReveal(){
  const els=$$('.reveal');
  const io=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('is-in'); io.unobserve(e.target);} });
  },{threshold:0.12});
  els.forEach(el=>io.observe(el));
}

function setupContactForm(){
  const form=$('#contactForm');
  form.addEventListener('submit',(ev)=>{
    ev.preventDefault();
    const fd=new FormData(form);
    const name=fd.get('fromName');
    const email=fd.get('fromEmail');
    const msg=fd.get('message');
    const to=$('#email2').textContent || '';
    const subject=encodeURIComponent(`Portfolio Contact — ${name}`);
    const body=encodeURIComponent(`From: ${name} <${email}>\n\n${msg}`);
    window.location.href=`mailto:${to}?subject=${subject}&body=${body}`;
  });
}

$('#year').textContent=String(new Date().getFullYear());

loadProfile().then(setupReveal).catch(()=>{});
setupTheme();
setupMenu();
setupContactForm();
