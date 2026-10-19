/* Aynı sohbet için tekrar render çağrıları formu ve mesajları sıfırlamaz. */
(()=>{
 let mountedBox=null,mountedOwner=null,mountedPeer=null;
 const previousChat=renderChat;
 renderChat=function(){
  previousChat();mountedBox=$('bubbles');mountedOwner=session?.user.id;mountedPeer=chatUser;
 };
 const previousRender=render;
 render=function(){
  if(view==='messages'&&session?.user.id===mountedOwner&&chatUser===mountedPeer&&mountedBox&&mountedBox===$('bubbles')&&mountedBox.isConnected){
   notificationBadge();paintMessageBadge();return;
  }
  previousRender();
 };
 const previousDraw=drawBubbles;
 drawBubbles=function(peer){
  const box=$('bubbles');if(!box||view!=='messages'||chatUser!==peer)return;
  const rows=state.messages[peer]||[];
  const signature=JSON.stringify([session?.user.id,peer,rows.map(m=>[m.id,m.text,m.media,m.me]),rows.map(m=>[m.id,messageReactions.get(m.id)||[]])]);
  if(box.dataset.stableSignature===signature){markShownMessages(peer);return}
  const scroll=box.scrollTop,nearBottom=box.scrollHeight-scroll-box.clientHeight<80;
  previousDraw(peer);box.dataset.stableSignature=signature;
  if(!nearBottom)box.scrollTop=scroll;
 };
})();
