/* Atlas V3 independent cartographic palette and partner styling. */
(function(){
'use strict';
const map=window.SDCA_V2_BRIDGE?.map;if(!map)return;
const pref=matchMedia('(prefers-color-scheme: dark)');
let queued=false,lastTheme='';
function paint(id,prop,value){if(!map.getLayer(id))return;try{if(JSON.stringify(map.getPaintProperty(id,prop))!==JSON.stringify(value))map.setPaintProperty(id,prop,value);}catch(e){console.warn('Atlas paint',id,prop,e);}}
function apply(){
 const dark=pref.matches;document.documentElement.dataset.v2Theme=dark?'dark':'light';
 const p=dark?{water:'#17172B',land:'#332942',boundary:'#665779',grid:'#786591',label:'#D6C8E7',labelHalo:'#332942',sky:'#100B1D'}:{water:'#DDD4EB',land:'#F9F5EF',boundary:'#C3B6CE',grid:'#AFA0C8',label:'#6B567D',labelHalo:'#F9F5EF',sky:'#1B1031'};
 if(!map.getLayer('atlas-ocean'))return;
 paint('atlas-ocean','background-color',p.water);
 paint('atlas-land','fill-color',p.land);
 paint('atlas-lakes-water','fill-color',p.water);
 paint('atlas-country-boundary','line-color',p.boundary);
 paint('atlas-graticule','line-color',p.grid);
 for(const id of ['atlas-country-label','atlas-city-label']){paint(id,'text-color',p.label);paint(id,'text-halo-color',p.labelHalo);}
 paint('atlas-city-dot','circle-color',p.label);
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
  // Featured partners keep the same gold star in both colour themes.

  paint('v2-key-clusters','circle-color',byClusterMajority);
  paint('v2-key-clusters','circle-stroke-color',dark?'#B9AABE':'#FFFFFF');
  paint('v2-key-clusters','circle-stroke-width',dark?1.5:3);
  // Prototype-inspired tinted halo; mixed clusters retain their secondary hue.
  const clusterHalo=['case',
    ['all',['>', ['get','exchangeCount'],0],['<',['get','exchangeCount'],['get','point_count']]],
    ['case',['>=',['get','exchangeCount'],['/', ['get','point_count'],2]],placementColor,exchangeColor],
    byClusterMajority[1],exchangeColor,placementColor];
  paint('v2-key-halo','circle-opacity',dark?0.035:0.12);
  paint('v2-key-cluster-halo','circle-color',clusterHalo);
  paint('v2-key-cluster-halo','circle-opacity',dark?0.26:0.24);
  paint('v2-key-count','text-color',dark?'#21162B':'#FFFFFF');
  paint('v2-key-labels','text-color',p.label);
  paint('v2-key-labels','text-halo-color',p.labelHalo);
  paint('v2-key-labels','text-halo-width',2);
  paint('sdca-hover-label','text-color',p.label);
  paint('sdca-hover-label','text-halo-color',p.labelHalo);
  paint('sdca-hover-label','text-halo-width',2);

 if(lastTheme!==String(dark)){lastTheme=String(dark);try{map.setSky({'sky-color':p.sky,'horizon-color':p.water,'fog-color':p.water,'sky-horizon-blend':0.25,'horizon-fog-blend':0.12,'fog-ground-blend':0.08,'atmosphere-blend':0.65});}catch(e){console.warn('Atlas sky',e);}}
}
function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply();});}
map.on('load',schedule);map.on('styledata',schedule);pref.addEventListener('change',schedule);schedule();
})();