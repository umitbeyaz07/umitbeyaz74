(()=>{
 const root=document.documentElement;
 let previous=root.dataset.theme||'light',enabled=false;
 try{enabled=localStorage.getItem('cevre-battle')==='on'}catch{}
 function apply(){if(enabled){root.dataset.battle='on';root.dataset.theme='dark'}else{delete root.dataset.battle;root.dataset.theme=previous}}
 apply();
 document.addEventListener('DOMContentLoaded',()=>{
  const toggle=document.createElement('button');toggle.id='battleToggle';toggle.type='button';
  toggle.innerHTML='<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 28V21C8 9 16 5 25 5s17 7 17 19v8l-10 8H16l-7-7Z" fill="#71776c" stroke="#242920" stroke-width="2"/><path d="M12 16c5-8 19-9 25 1" fill="none" stroke="#b5baaa" stroke-width="3"/><path d="m6 24 31-3 4 6-9 6-24-2Z" fill="#171c1a" stroke="#a3a895" stroke-width="2"/><path d="m9 33 9 5 16-2" fill="none" stroke="#b3b69e" stroke-width="2"/><circle cx="38" cy="19" r="2" fill="#e6bc46"/></svg><span>3</span>';
  const theme=document.getElementById('themeToggle');theme.after(toggle);
  function paint(){toggle.setAttribute('aria-pressed',String(enabled));toggle.setAttribute('aria-label',enabled?'PUBG temasını kapat':'Seviye 3 kask: PUBG temasını aç');toggle.title=toggle.getAttribute('aria-label');const dark=root.dataset.theme==='dark';theme.textContent=dark?'☀':'☾';theme.setAttribute('aria-pressed',String(dark));theme.setAttribute('aria-label',dark?'Açık temaya geç':'Koyu temaya geç');document.querySelector('meta[name="theme-color"]').content=enabled?'#191d18':dark?'#182333':'#a5aebe'}
  toggle.onclick=()=>{if(!enabled)previous=root.dataset.theme;enabled=!enabled;apply();try{localStorage.setItem('cevre-battle',enabled?'on':'off')}catch{}paint()};
  function exit(){if(!enabled)return;enabled=false;delete root.dataset.battle;try{localStorage.setItem('cevre-battle','off')}catch{}paint()}
  theme.addEventListener('click',exit);
  document.querySelectorAll('.color-options button').forEach(b=>b.addEventListener('click',()=>{if(enabled){root.dataset.theme=previous;exit()}}));paint();
 });
})();
