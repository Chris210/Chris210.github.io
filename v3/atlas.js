/* Loughborough Atlas local geography and MapLibre helpers. */
(function(){'use strict';
const root=new URL('./atlas/',location.href);
const get=path=>fetch(new URL(path,root)).then(r=>{if(!r.ok)throw Error(path+' unavailable');return r.json();});
let geography;
function geo(){return geography||(geography=Promise.all([get('countries.geojson'),get('cities.geojson')]));}
function insideRing(x,y,ring){let inside=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const a=ring[i],b=ring[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])inside=!inside;}return inside;}
function inside(x,y,g){const polygons=g.type==='Polygon'?[g.coordinates]:g.type==='MultiPolygon'?g.coordinates:[];return polygons.some(p=>insideRing(x,y,p[0])&&!p.slice(1).some(h=>insideRing(x,y,h)));}
function distance(a,b,c,d){const r=Math.PI/180,dl=(c-a)*r,dp=(d-b)*r;return 6371*2*Math.asin(Math.min(1,Math.sqrt(Math.sin(dp/2)**2+Math.cos(b*r)*Math.cos(d*r)*Math.sin(dl/2)**2)));}
async function resolve(feature){const [x,y]=feature.geometry.coordinates;const [countries,cities]=await geo();const p=feature.properties||{};let country=String(p.country||p.country_name||'').trim();const hit=countries.features.find(f=>inside(x,y,f.geometry));if(!country)country=hit?.properties.name||'';let closest=null,best=25;for(const f of cities.features){const [a,b]=f.geometry.coordinates;const d=distance(x,y,a,b);if(d<best&&(!hit||hit.properties.iso===f.properties.iso)){closest=f;best=d;}}return {city:closest?.properties.name||'',country:country||closest?.properties.country||''};}
function language(map,lang){const k=({'zh-Hans':'zh','zh-Hant':'zht','zh-CN':'zh','zh-TW':'zht'})[lang]||String(lang||'en').split('-')[0];if(map.getLayer('atlas-country-label'))map.setLayoutProperty('atlas-country-label','text-field',['coalesce',['get','name_'+k],['get','name']]);}
window.Atlas={styleURL:new URL('style.json',root).href,resolve,language,transformRequest:url=>({url:url.startsWith('./')?new URL(url,root).href:url})};
})();