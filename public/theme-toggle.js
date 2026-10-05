(()=>{
 const root=document.documentElement;
 let saved;try{saved=localStorage.getItem('cevre-theme')}catch{}
 root.dataset.theme=saved==='dark'?'dark':'light';
 const colors=[['blue','Mavi'],['purple','Mor'],['green','Yeşil'],['pink','Pembe']];
 let color;try{color=localStorage.getItem('cevre-color')}catch{}
 root.dataset.color=colors.some(c=>c[0]===color)?color:'blue';
 function ready(){
  const button=document.getElementById('themeToggle');
  const picker=document.createElement('details');picker.className='color-picker';
  const label=document.createElement('summary');label.textContent='◉';label.setAttribute('aria-label','Tema rengini seç');label.title='Tema rengini seç';
  const choices=document.createElement('div');choices.className='color-options';choices.setAttribute('role','group');choices.setAttribute('aria-label','Tema renkleri');
  function paintColors(){choices.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.color===root.dataset.color)))}
  for(const [value,name] of colors){const b=document.createElement('button');b.type='button';b.dataset.color=value;b.textContent=name;b.setAttribute('aria-label',name+' tema rengi');b.addEventListener('click',()=>{root.dataset.color=value;try{localStorage.setItem('cevre-color',value)}catch{}paintColors();picker.open=false;label.focus()});choices.append(b)}
  picker.append(label,choices);button.before(picker);paintColors();
  document.addEventListener('click',e=>{if(!picker.contains(e.target))picker.open=false});
  picker.addEventListener('keydown',e=>{if(e.key==='Escape'){picker.open=false;label.focus()}});

  function paint(){const dark=root.dataset.theme==='dark';button.textContent=dark?'☀':'☾';button.setAttribute('aria-label',dark?'Açık temaya geç':'Koyu temaya geç');button.title=button.getAttribute('aria-label');button.setAttribute('aria-pressed',String(dark));document.querySelector('meta[name="theme-color"]').content=dark?'#182333':'#a5aebe'}
  button.addEventListener('click',()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem('cevre-theme',root.dataset.theme)}catch{}paint()});paint();
 }
 document.addEventListener('DOMContentLoaded',ready);
})();
