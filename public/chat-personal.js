/* Hesaba özel mesaj gizleme ve gelen metni kopyalama. */
const personalHideBusy=new Set();
let personalHidden=new Set(),personalOwner=null;
function personalScope(){const owner=session?.user.id;if(personalOwner!==owner){personalOwner=owner;personalHidden=new Set()}return owner}
const personalLoadChat=loadChat;
loadChat=async function(peer){
 const owner=personalScope();if(!owner)return;
 await personalLoadChat(peer);if(session?.user.id!==owner)return;
 const ids=(state.messages[peer]||[]).map(m=>m.id);
 if(ids.length){const result=await db.from('message_hidden').select('message_id').eq('profile_id',myId).in('message_id',ids);if(session?.user.id!==owner)return;if(result.error){state.messages[peer]=[];throw result.error}for(const row of result.data||[])personalHidden.add(row.message_id)}
 state.messages[peer]=(state.messages[peer]||[]).filter(m=>!personalHidden.has(m.id));
};
async function hidePersonalMessage(id,peer){
 const owner=personalScope();if(!owner||personalHideBusy.has(id))return;
 if(!confirm('Bu mesaj yalnızca senin hesabından kaldırılacak. Devam edilsin mi?'))return;
 personalHideBusy.add(id);
 try{
  const result=await db.from('message_hidden').upsert({profile_id:myId,message_id:id},{onConflict:'profile_id,message_id',ignoreDuplicates:true});checked(result);
  if(session?.user.id!==owner)return;
  personalHidden.add(id);state.messages[peer]=(state.messages[peer]||[]).filter(m=>m.id!==id);
  if(view==='messages'&&chatUser===peer)drawBubbles(peer);
  toast('Mesaj yalnızca senden silindi.');
 }catch(e){toast('Mesaj gizlenemedi: '+(e.message||'upgrade-v14.sql güncellemesini kontrol et.'))}finally{personalHideBusy.delete(id)}
}
async function copyIncomingMessage(text){
 try{
  if(navigator.clipboard?.writeText){try{await navigator.clipboard.writeText(text);toast('Mesaj kopyalandı.');return}catch{}}
  const field=document.createElement('textarea');field.value=text;field.style.cssText='position:fixed;left:0;top:0;opacity:0';field.setAttribute('readonly','');document.body.append(field);
  const previous=document.activeElement;let copied=false;
  try{field.focus();field.select();field.setSelectionRange(0,field.value.length);copied=document.execCommand('copy')}finally{field.remove();previous?.focus()}
  if(!copied)throw new Error('Panoya erişilemedi. Mesaj metnine basılı tutup kopyala.');
  toast('Mesaj kopyalandı.');
 }catch(e){toast(e.message||'Mesaj kopyalanamadı.')}
}
const personalDrawBubbles=drawBubbles;
drawBubbles=function(peer){
 personalDrawBubbles(peer);if(view!=='messages'||chatUser!==peer||!$('bubbles'))return;
 const messages=state.messages[peer]||[];
 $('bubbles').querySelectorAll('.bubble').forEach((bubble,i)=>{
  const m=messages[i];if(!m?.id||bubble.querySelector('.personal-message-actions'))return;
  const area=document.createElement('div');area.className='personal-message-actions';
  const hide=document.createElement('button');hide.type='button';hide.textContent='Benden sil';hide.onclick=()=>hidePersonalMessage(m.id,peer);area.append(hide);
  if(!m.me&&m.text){const copy=document.createElement('button');copy.type='button';copy.textContent='Kopyala';copy.onclick=()=>copyIncomingMessage(m.text);area.append(copy)}
  bubble.append(area);
 });
};
