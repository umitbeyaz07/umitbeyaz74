/* Referans düzeni: gerçek sohbet özetleri ve aktif kişiler. */
(()=>{
 const right=document.querySelector('.right');if(!right)return;
 const profile=document.getElementById('miniProfile');if(profile)profile.remove();
 const online=document.createElement('section');online.className='card pad compact-online';online.innerHTML='<div class="row between"><h2>Çevrim içi kişiler</h2><button class="quiet" type="button">Tümünü gör</button></div><div id="quickOnline"></div>';online.querySelector('button').onclick=()=>go('explore');right.prepend(online);
 function paint(){const peers=document.getElementById('quickOnline');peers.replaceChildren();const active=activityReady?users.filter(u=>state.following.includes(u.id)&&activityCache.get(u.id)?.is_online).slice(0,5):[];if(!active.length){peers.textContent=activityReady?'Şu an çevrim içi kişi yok.':'Durum bilgisi bekleniyor…'}for(const u of active){const b=document.createElement('button');b.className='quick-person is-online';b.innerHTML=avatar(u)+'<span><b>'+esc(u.name)+'</b><small>Çevrim içi</small></span>';b.onclick=()=>openProfile(u.id);peers.append(b)}}
 const oldRender=render;render=function(){oldRender();document.body.dataset.view=view;if(view==='home'){const main=document.getElementById('main');const title=main.querySelector('.topline');if(title)title.hidden=true;const tabs=main.querySelector('.tabs');const composer=main.querySelector('.composer-start')?.closest('.card');if(tabs&&composer)composer.before(tabs)}paint()};
 const oldPaint=paintActivity;paintActivity=function(){oldPaint();paint()};
 document.body.dataset.view=view;paint();render();
})();
