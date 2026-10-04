/* Çevre: hafif, dekoratif ve etkileşimleri engellemeyen hareketli ışıklar. */
(()=>{
 const layer=document.createElement('div');
 layer.className='cevre-ambient';layer.setAttribute('aria-hidden','true');
 for(let i=0;i<3;i++){const glow=document.createElement('span');glow.className='ambient-glow ambient-glow-'+i;layer.append(glow)}
 const water=document.createElement('div');water.className='cevre-water';
 for(let i=0;i<24;i++){
  const drop=document.createElement('span');drop.className='cevre-water-drop';
  drop.style.left=((i*37+13)%100)+'%';
  drop.style.setProperty('--drop-size',(7+(i*7)%17)+'px');
  drop.style.setProperty('--drop-time',(17+(i*11)%24)+'s');
  drop.style.setProperty('--drop-delay',(-((i*13)%41))+'s');
  drop.style.setProperty('--drop-drift',((i%2?1:-1)*(8+i%15))+'px');
  water.append(drop);
 }
 layer.append(water);
 document.body.prepend(layer);
 function pause(){layer.classList.toggle('ambient-paused',document.hidden)}
 document.addEventListener('visibilitychange',pause);pause();
})();
