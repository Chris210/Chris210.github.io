/* V2-only map appearance. Responds to OS appearance changes without altering
   Mapbox sources, markers, partner directory, language, map camera or V1. */
(function(){
'use strict';
const map=window.SDCA_V2_BRIDGE?.map;
if(!map||typeof window.matchMedia!=='function')return;
const preference=window.matchMedia('(prefers-color-scheme: dark)');
const palettes={
 light:{
  land:'#FAF8FC',water:'#DBD2E7',park:'#E3E6DF',building:'#F0EAF5',
  background:'#EDE7F3',road:'#FFFFFF',boundary:'#B8A7C8',
  label:'#362248',labelHalo:'#FFFFFF',muted:'#79648A',
  atmosphere:{color:'#EDE5F4','high-color':'#D9CDE5','horizon-blend':0.025,'space-color':'#EDE7F3','star-intensity':0}
 },
 dark:{
  land:'#2B2137',water:'#171A30',park:'#29362F',building:'#36283D',
  background:'#110D18',road:'#52445C',boundary:'#776487',
  label:'#F5EFFB',labelHalo:'#181020',muted:'#D3C5DD',
  atmosphere:{color:'#231A32','high-color':'#1A1425','horizon-blend':0.025,'space-color':'#110D18','star-intensity':0}
 }
};
let lastFogMode=null,queued=false,applying=false,styleReady=false;
const noChange=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const skip=id=>/^(?:sdca-|v2-key-|GE Data|sdca-master-points)/i.test(id);
function paint(id,prop,value){
 try{
  if(!map.getLayer(id))return;
  if(!noChange(map.getPaintProperty(id,prop),value))map.setPaintProperty(id,prop,value);
 }catch(e){/* Custom or imported layer paint may not support this property. */}
}
function configureStandard(p,dark){
 const imports=map.getStyle()?.imports||[];
 if(typeof map.setConfigProperty!=='function'||typeof map.getConfigProperty!=='function')return;
 for(const imp of imports){
  if(!imp.id||!/standard|basemap|mapbox/i.test(String(imp.id+' '+(imp.url||''))))continue;
  const props={
   lightPreset:dark?'night':'day',
   theme:'custom',
   colorLand:p.land,
   colorWater:p.water,
   colorRoads:p.road,
   colorPlaceLabels:p.label,
   colorRoadLabels:p.label,
   colorAdminBoundaries:p.boundary,
   colorBuildings:p.building,
   colorGreenspace:p.park
  };
  for(const [key,value] of Object.entries(props)){
   try{
    if(!noChange(map.getConfigProperty(imp.id,key),value))
      map.setConfigProperty(imp.id,key,value);
   }catch(_){/* The specific Studio style may not expose this Standard option. */}
  }
 }
}
function applyTheme(){
 if(applying)return;
 const dark=preference.matches;
 document.documentElement.dataset.v2Theme=dark?'dark':'light';
 const p=dark?palettes.dark:palettes.light;
 if(!map.getStyle()?.layers?.length)return;
 applying=true;
 try{
  // Prefer Mapbox Standard's supported native theming for imported basemaps.
  configureStandard(p,dark);
  // Custom Mapbox Studio vector layers need explicit matching paint overrides.
  // Crucially, circle layers (purple exchanges/pink placements) are untouched.
  for(const layer of map.getStyle().layers){
   const id=String(layer.id||'');
   if(skip(id))continue;
   const name=id.toLowerCase();
   if(layer.type==='background'){
    paint(id,'background-color',p.background);
   }else if(layer.type==='fill'){
    const color=/water|ocean|sea|river|lake/.test(name)?p.water:
      /grass|park|wood|forest|green|vegetation/.test(name)?p.park:
      /building|structure|construction/.test(name)?p.building:p.land;
    paint(id,'fill-color',color);
   }else if(layer.type==='line'){
    const color=/boundary|admin|border|coast/.test(name)?p.boundary:p.road;
    paint(id,'line-color',color);
   }else if(layer.type==='symbol'&&(layer.layout?.['text-field']!==undefined||/label|place|country|city|name/.test(name))){
    paint(id,'text-color',p.label);
    paint(id,'text-halo-color',p.labelHalo);
    paint(id,'text-halo-width',1.3);
   }
  }
  // Dark theme: restrained sea-glass (derived from Loughborough's green)
  // versus muted mulberry rose (derived from Loughborough's magenta).
  // Different hues AND marker rings distinguish categories without relying
  // on brightness alone. Original purple/pink are retained in light mode.
  const exchangeColor=dark?'#6FA99E':'#2D0153';
  const placementColor=dark?'#C77795':'#F0047F';
  const byGroup=['match',['get','group'],
    'Exchange Programme',exchangeColor,'Academic Collaboration',exchangeColor,placementColor];
  const byMarkerType=['match',['get','markerType'],
    'exchange',exchangeColor,placementColor];
  const byClusterMajority=['case',
    ['>=',['get','exchangeCount'],['/', ['get','point_count'],2]],
    exchangeColor,placementColor];
  // All map dot layers need consistent symbols, including featured clusters
  // and the selection/hover effect. Never modify the source feature data.
  paint('sdca-master-points','circle-color',byGroup);
  // An understated ring for university markers, a thinner ring for employers.
  // Emissive fills ensure night lighting never makes either group disappear.
  const masterStroke=dark?
    ['match',['get','group'],'Exchange Programme','#B9CFC9','Academic Collaboration','#B9CFC9','#C59CAD']:
    '#FFFFFF';
  const featuredStroke=dark?
    ['match',['get','markerType'],'exchange','#B9CFC9','#C59CAD']:
    '#FFFFFF';
  paint('sdca-master-points','circle-stroke-color',masterStroke);
  paint('sdca-master-points','circle-stroke-width',
    dark?['match',['get','group'],'Exchange Programme',2.1,'Academic Collaboration',2.1,1.0]:1.5);
  paint('sdca-hover-dot','circle-color',byGroup);
  paint('sdca-hover-dot','circle-stroke-color',dark?masterStroke:'#FFFFFF');
  paint('sdca-hover-dot','circle-stroke-width',dark?2:3);
  paint('v2-key-points','circle-color',byMarkerType);
  paint('v2-key-points','circle-stroke-color',featuredStroke);
  paint('v2-key-points','circle-stroke-width',
    dark?['match',['get','markerType'],'exchange',2.4,1.2]:3);
  paint('v2-key-clusters','circle-color',byClusterMajority);
  paint('v2-key-clusters','circle-stroke-color',dark?'#B9AABE':
    ['case',
      ['all',['>', ['get','exchangeCount'],0],
       ['<',['get','exchangeCount'],['get','point_count']]],
      ['case',['>=',['get','exchangeCount'],['/', ['get','point_count'],2]],
        '#F0047F','#2D0153'],
      '#FFFFFF']);
  paint('v2-key-clusters','circle-stroke-width',dark?1.5:3);
  // Suppress luminous white haloes around the dark-mode clusters.
  paint('v2-key-halo','circle-opacity',dark?0.035:0.12);
  paint('v2-key-cluster-halo','circle-opacity',dark?0.035:0.13);
  paint('v2-key-count','text-color',dark?'#21162B':'#FFFFFF');
  paint('v2-key-labels','text-color',p.label);
  paint('v2-key-labels','text-halo-color',p.labelHalo);
  paint('v2-key-labels','text-halo-width',2);
  // Mapbox Standard's 3D 'night' lighting dims every custom circle,
  // including bright pink/lilac paint colours, unless it emits light.
  // Set emissive strength on every partner dot and its highlight/halo.
  // Daylight uses the original default (0) to preserve light-mode styling.
  const emissive=dark?1:0;
  for(const id of [
    'sdca-master-points','sdca-hover-dot','sdca-hover-halo',
    'sdca-selected-ring','v2-key-points','v2-key-clusters',
    'v2-key-halo','v2-key-cluster-halo'
  ]) paint(id,'circle-emissive-strength',emissive);
  // Cluster counts and featured labels also need legible colours at night.
  for(const id of ['v2-key-count','v2-key-labels'])
    paint(id,'text-emissive-strength',emissive);
  if(lastFogMode!==(dark?'dark':'light')){
   try{map.setFog(p.atmosphere);lastFogMode=dark?'dark':'light';}
   catch(_){/* Mapbox builds without atmospheric fog still function. */}
  }
 }catch(e){console.warn('V2 map appearance could not be fully applied',e);}
 finally{applying=false;}
}
function schedule(){
 if(queued)return;
 queued=true;
 window.requestAnimationFrame(()=>{
  queued=false;
  if(typeof map.getStyle==='function')applyTheme();
 });
}
function changed(){
 // CSS responds immediately; Mapbox vector tiles update without replacing sources.
 lastFogMode=null;
 schedule();
}
if(typeof preference.addEventListener==='function')
 preference.addEventListener('change',changed);
else if(typeof preference.addListener==='function')
 preference.addListener(changed);
map.on('style.load',()=>{lastFogMode=null;styleReady=true;schedule();});
map.on('load',()=>{styleReady=true;schedule();});
map.on('styledata',schedule); // Also catches dynamically added featured layers.
schedule();
})();
