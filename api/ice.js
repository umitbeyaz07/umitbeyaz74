// TURN bilgilerini sadece geçerli Supabase oturumu olan istemciye verir.
module.exports=async function(req,res){
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='GET')return res.status(405).json({error:'Yalnızca GET.'});
 const token=req.headers.authorization;
 if(!token||!/^Bearer \S+$/.test(token))return res.status(401).json({error:'Giriş yapmalısın.'});
 try{
  const auth=await fetch('https://fyzqvulxtavcoqlvghji.supabase.co/auth/v1/user',{headers:{Authorization:token,apikey:'sb_publishable_Y7px8ajJJjWOkGK7ax5Efw_smNsq7As'},signal:AbortSignal.timeout(8000)});
  if(!auth.ok)return res.status(401).json({error:'Oturum süresi doldu.'});
  const identity=await auth.json();if(!identity.id)return res.status(401).json({error:'Geçersiz oturum.'});
  const username=process.env.TURN_USERNAME,credential=process.env.TURN_PASSWORD;
  if(!username||!credential)return res.status(503).json({error:'Vercel TURN_USERNAME ve TURN_PASSWORD ayarlarını tamamla ve yeniden yayımla.'});
  res.status(200).json({iceServers:[{urls:'stun:stun.relay.metered.ca:80'},{urls:['turn:global.relay.metered.ca:80','turn:global.relay.metered.ca:80?transport=tcp','turn:global.relay.metered.ca:443','turns:global.relay.metered.ca:443?transport=tcp'],username,credential}]});
 }catch{return res.status(502).json({error:'Arama bağlantı ayarları alınamadı. Tekrar dene.'})}
};
