// Vercel Node function: fixed publisher URL, no arbitrary proxy requests.
module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({error:'Yalnızca GET desteklenir.'});
  try {
    const response = await fetch('https://www.trthaber.com/sondakika_articles.rss', {signal:AbortSignal.timeout(8000)});
    if (!response.ok) throw new Error('Feed unavailable');
    const xml = await response.text();
    const field = (s, tag) => (s.match(new RegExp('<'+tag+'(?:\\s[^>]*)?>([\\s\\S]*?)</'+tag+'>','i'))?.[1] || '').replace(/^\s*<!\[CDATA\[|\]\]>\s*$/g,'').trim();
    const decode = s => s.replace(/&#(x[\da-f]+|\d+);/gi,(_,v)=>{const n=v[0].toLowerCase()==='x'?parseInt(v.slice(1),16):Number(v);return n>0&&n<=0x10ffff?String.fromCodePoint(n):''}).replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
    const items = [...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)].map(m=>({title:decode(field(m[1],'title')),url:decode(field(m[1],'link')),publishedAt:field(m[1],'pubDate')})).filter(x=>{try{return x.title && new URL(x.url).protocol==='https:' && new URL(x.url).hostname==='www.trthaber.com'}catch{return false}}).slice(0,5);
    if (!items.length) throw new Error('Empty feed');
    res.setHeader('Cache-Control','public, s-maxage=300, stale-while-revalidate=600');
    res.status(200).json({items, fetchedAt:new Date().toISOString(), source:'TRT Haber'});
  } catch { res.status(503).json({error:'Haberler şu anda alınamıyor.'}); }
};
