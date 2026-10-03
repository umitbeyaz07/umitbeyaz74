import {cropAnimatedGIF} from './gif-codec.js';
self.onmessage=async({data})=>{try{const bytes=await cropAnimatedGIF(data.buffer,data.rect,data.width,data.height,(done,total)=>self.postMessage({done,total}));self.postMessage({bytes},[bytes.buffer])}catch(e){self.postMessage({error:e.message||'GIF kırpılamadı.'})}};
