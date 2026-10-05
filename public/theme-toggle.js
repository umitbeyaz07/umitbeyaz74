(()=>{
 const root=document.documentElement;
 let saved;try{saved=localStorage.getItem('cevre-theme')}catch{}
 root.dataset.theme=saved==='dark'?'dark':'light';
 function ready(){
  const button=document.getElementById('themeToggle');
  function paint(){const dark=root.dataset.theme==='dark';button.textContent=dark?'☀':'☾';button.setAttribute('aria-label',dark?'Açık temaya geç':'Koyu temaya geç');button.title=button.getAttribute('aria-label');button.setAttribute('aria-pressed',String(dark));document.querySelector('meta[name="theme-color"]').content=dark?'#182333':'#a5aebe'}
  button.addEventListener('click',()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem('cevre-theme',root.dataset.theme)}catch{}paint()});paint();
 }
 document.addEventListener('DOMContentLoaded',ready);
})();
