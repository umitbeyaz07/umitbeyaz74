/* Dekoratif yağmur: arka planda, tıklamalara kapalı ve hareket tercihine duyarlı. */
(()=>{
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)'),mobile=window.matchMedia('(max-width: 780px)');
 const layer=document.createElement('div');layer.className='rain-layer';layer.setAttribute('aria-hidden','true');document.body.prepend(layer);
 function build(){layer.replaceChildren();if(reduced.matches)return;const count=mobile.matches?28:62,fragment=document.createDocumentFragment();for(let i=0;i<count;i++){const drop=document.createElement('span');drop.className='rain-drop';drop.style.left=(Math.random()*116)+'%';drop.style.setProperty('--rain-length',(22+Math.random()*48)+'px');drop.style.setProperty('--rain-duration',(1.6+Math.random()*1.8)+'s');drop.style.setProperty('--rain-delay',(-Math.random()*5)+'s');drop.style.setProperty('--rain-opacity',String(.2+Math.random()*.38));fragment.append(drop)}layer.append(fragment);pause()}
 function pause(){layer.classList.toggle('rain-paused',document.hidden)}
 reduced.addEventListener('change',build);mobile.addEventListener('change',build);document.addEventListener('visibilitychange',pause);build();
})();
