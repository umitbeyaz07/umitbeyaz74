import {parseGIF,decompressFrame} from 'gifuct-js';
import {GIFEncoder,quantize,applyPalette} from 'gifenc';
function canvas(w,h){if(typeof OffscreenCanvas!=='undefined')return new OffscreenCanvas(w,h);const c=document.createElement('canvas');c.width=w;c.height=h;return c}
export async function cropAnimatedGIF(buffer,rect,width,height,progress=()=>{}){
 const gif=parseGIF(buffer),w=gif.lsd.width,h=gif.lsd.height,raw=gif.frames.filter(f=>f.image);if(!raw.length||w*h>8000000||raw.length>240||w*h*raw.length>100000000)throw new Error('Bu GIF kırpmak için çok büyük. Daha küçük/kısa GIF seç veya Kırpmadan kullan düğmesine bas.');
 const c=canvas(w,h),ctx=c.getContext('2d',{willReadFrequently:true}),out=canvas(width,height),oc=out.getContext('2d',{willReadFrequently:true}),patch=canvas(1,1),pc=patch.getContext('2d');
 const encoder=GIFEncoder();let previous=null,restore=null,repeat=-1;
 for(const f of gif.frames){const a=f.application;if(a&&(typeof a.id==='string'?a.id:String.fromCharCode(...a.id)).startsWith('NETSCAPE')&&a.blocks?.length>=3)repeat=a.blocks[1]|a.blocks[2]<<8;}
 const background=gif.gct?.[gif.lsd.backgroundColorIndex]||[255,255,255];
 for(let i=0;i<raw.length;i++){
  if(previous?.disposalType===2){const d=previous.dims;ctx.clearRect(d.left,d.top,d.width,d.height);if(previous.transparentIndex===undefined){ctx.fillStyle=`rgb(${background.join(',')})`;ctx.fillRect(d.left,d.top,d.width,d.height)}}
  if(previous?.disposalType===3&&restore)ctx.putImageData(restore,0,0);
  const f=decompressFrame(raw[i],gif.gct,true);if(i===0&&f.transparentIndex===undefined){ctx.fillStyle=`rgb(${background.join(',')})`;ctx.fillRect(0,0,w,h)}
  restore=f.disposalType===3?ctx.getImageData(0,0,w,h):null;patch.width=f.dims.width;patch.height=f.dims.height;pc.putImageData(new ImageData(f.patch,f.dims.width,f.dims.height),0,0);ctx.drawImage(patch,f.dims.left,f.dims.top);
  oc.clearRect(0,0,width,height);oc.drawImage(c,rect.x,rect.y,rect.width,rect.height,0,0,width,height);const rgba=oc.getImageData(0,0,width,height).data;
  const palette=quantize(rgba,256,{format:'rgba4444',oneBitAlpha:true,clearAlpha:true}),index=applyPalette(rgba,palette,'rgba4444'),transparentIndex=palette.findIndex(p=>p[3]===0);
  encoder.writeFrame(index,width,height,{palette:palette.map(p=>p.slice(0,3)),delay:f.delay,repeat,dispose:2,transparent:transparentIndex>=0,transparentIndex:Math.max(0,transparentIndex)});
  previous=f;progress(i+1,raw.length);if(encoder.bytesView().length>10485760)throw new Error('Kırpılmış GIF 10 MB sınırını aşıyor. Daha küçük GIF seç.');await new Promise(resolve=>setTimeout(resolve,0));
 }
 encoder.finish();return encoder.bytes();
}
