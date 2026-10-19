let replyDraft=null,voiceJob=null;
function clearReply(){replyDraft=null;document.getElementById('replyDraft')?.remove()}
function startReply(m,peer){clearReply();replyDraft={id:m.id,peer};const panel=document.createElement('div');panel.id='replyDraft';panel.className='reply-quote';const text=document.createElement('span');text.textContent='Yanıt: '+(m.text||'Ekli mesaj').slice(0,140);const close=document.createElement('button');close.type='button';close.textContent='×';close.onclick=clearReply;panel.append(text,close);$('chatForm').before(panel);$('chatForm').querySelector('input').focus()}
function stopVoice(cancel=false){const job=voiceJob;if(!job)return;job.cancel=cancel;clearTimeout(job.timer);if(job.recorder?.state==='recording')job.recorder.stop();job.stream?.getTracks().forEach(t=>t.stop());if(cancel){voiceJob=null;document.getElementById('voiceRecord')?.remove()}}
async function startVoice(){
 if(voiceJob||chatMediaBusy||chatMediaPreparing||!session)return;
 if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){toast('Bu tarayıcı ses kaydını desteklemiyor.');return}
 const job={owner:session.user.id,peer:chatUser,cancel:false};voiceJob=job;
 try{
  job.stream=await navigator.mediaDevices.getUserMedia({audio:true});
  if(job.cancel||session?.user.id!==job.owner||chatUser!==job.peer){job.stream.getTracks().forEach(t=>t.stop());if(voiceJob===job)voiceJob=null;return}
  const mime=['audio/webm','audio/mp4','audio/ogg'].find(t=>MediaRecorder.isTypeSupported(t));if(!mime)throw new Error('Desteklenen ses kayıt biçimi bulunamadı.');
  job.recorder=new MediaRecorder(job.stream,{mimeType:mime});const chunks=[];
  const panel=document.createElement('div');panel.id='voiceRecord';panel.className='reply-quote';panel.append('● Ses kaydediliyor · en fazla 2 dakika ');
  for(const [title,cancel]of [['Durdur ve dinle',false],['Vazgeç',true]]){const b=document.createElement('button');b.type='button';b.textContent=title;b.onclick=()=>stopVoice(cancel);panel.append(b)}$('chatForm').before(panel);
  job.recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
  job.recorder.onstop=()=>{clearTimeout(job.timer);job.stream.getTracks().forEach(t=>t.stop());if(voiceJob!==job)return;voiceJob=null;panel.remove();if(job.cancel||session?.user.id!==job.owner||chatUser!==job.peer)return;const blob=new Blob(chunks,{type:mime});if(!blob.size||blob.size>20971520){toast('Ses kaydı boş veya çok büyük.');return}clearChatDraft();chatDraft={peer:job.peer,blob,kind:'audio',mime,preview:URL.createObjectURL(blob)};paintChatDraft();toast('Kaydı dinleyip Gönder düğmesine basabilirsin.')};
  job.recorder.onerror=()=>{stopVoice(true);toast('Ses kaydı tamamlanamadı.')};job.recorder.start();job.timer=setTimeout(()=>stopVoice(false),120000);
 }catch(e){job.stream?.getTracks().forEach(t=>t.stop());if(voiceJob===job)voiceJob=null;toast(e.name==='NotAllowedError'?'Ses kaydı için mikrofon izni vermelisin.':e.message)}
}
const plusChat=renderChat;renderChat=function(){if(replyDraft?.peer!==chatUser)clearReply();stopVoice(true);plusChat();const bar=document.querySelector('.chat-media-toolbar');if(bar){const b=document.createElement('button');b.type='button';b.className='secondary';b.textContent='🎙 Sesli mesaj';b.onclick=startVoice;bar.append(b)}};
const plusDraw=drawBubbles;drawBubbles=function(peer){plusDraw(peer);if(view!=='messages'||chatUser!==peer)return;const rows=state.messages[peer]||[];$('bubbles')?.querySelectorAll('.bubble').forEach((el,i)=>{const m=rows[i];if(!m)return;if(!el.querySelector('.reply-button')){const b=document.createElement('button');b.className='reply-button';b.type='button';b.textContent='Yanıtla';b.onclick=()=>startReply(m,peer);el.append(b)}let receipt=el.querySelector('.message-receipt');if(m.me){if(!receipt){receipt=document.createElement('small');receipt.className='message-receipt';el.append(receipt)}const text=m.readAt?'✓✓ Görüldü':'✓ Gönderildi';if(receipt.textContent!==text)receipt.textContent=text}let quote=el.querySelector('.reply-quote');if(m.replyTo){if(!quote){quote=document.createElement('div');quote.className='reply-quote';el.prepend(quote)}const original=rows.find(x=>x.id===m.replyTo);const text='↳ '+(original?(original.text||'Ekli mesaj'):'Önceki mesaja yanıt').slice(0,140);if(quote.textContent!==text)quote.textContent=text}else quote?.remove()})};
const plusGo=go;go=function(v){if(v!=='messages'){stopVoice(true);clearReply()}return plusGo(v)};
const plusReset=resetSocial;resetSocial=function(){stopVoice(true);clearReply();plusReset()};
window.addEventListener('pagehide',()=>stopVoice(true));
const plusRender=render;render=function(){if(view!=='messages'){stopVoice(true);clearReply()}return plusRender()};
const plusSend=sendChatMedia;sendChatMedia=async function(e){if(voiceJob){e.preventDefault();toast('Önce ses kaydını durdur veya iptal et.');return}return plusSend(e)};
