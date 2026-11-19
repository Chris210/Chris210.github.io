
/* Loughborough Global Creative Network — Figma Iteration 2. Runs in a separate V2 only. */
(function(){
'use strict';
const api=window.SDCA_V2_BRIDGE;
if(!api){console.error('V2 bridge unavailable; original site is still functional');return;}
const map=api.map;
const groups=[{id:'employers',title:'Global employers',tab:'Employers'},{id:'design',title:'Design studios',tab:'Studios'},{id:'academic',title:'Universities',tab:'Universities'}];
const featured=api.featured;
const ordered=groups.flatMap(g=>featured.filter(i=>i.group===g.id));
const QS_WORLD_RANKINGS_2027 = new Map([["Delft University of Technology (TU Delft)","48","https://www.topuniversities.com/universities/delft-university-technology"],["Politecnico di Milano","=87","https://www.topuniversities.com/universities/politecnico-di-milano"],["Nanyang Technological University","12","https://www.topuniversities.com/universities/nanyang-technological-university-singapore-ntu"],["City University of Hong Kong","=52","https://www.topuniversities.com/universities/city-university-hong-kong"],["University of Technology Sydney","=87","https://www.topuniversities.com/universities/university-technology-sydney"],["Middle East Technical University (METU)","305","https://www.topuniversities.com/universities/middle-east-technical-university"],["Norwegian University of Science and Technology (NTNU)","264","https://www.topuniversities.com/universities/norwegian-university-science-technology"],["Université de Montréal","=162","https://www.topuniversities.com/universities/universite-de-montreal"],["University of Michigan","51","https://www.topuniversities.com/universities/university-michigan-ann-arbor"],["Curtin University","189","https://www.topuniversities.com/universities/curtin-university"],["Virginia Tech","366","https://www.topuniversities.com/universities/virginia-polytechnic-institute-state-university"],["University of Navarra","=279","https://www.topuniversities.com/universities/university-navarra"],["University of Wuppertal","1001–1200","https://www.topuniversities.com/universities/bergische-universitat-wuppertal"]]);
const element=(tag,cls,value)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(value!==undefined)e.textContent=String(value);return e;};
const $=id=>document.getElementById(id);
const ui=(key,vars={})=>window.SDCA_V2_I18N?.translate($('language-select')?.value||'en',key,vars)||key;
const normalize=v=>String(v||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/&/g,' and ').replace(/[^a-z0-9]+/g,' ').trim();
const itemOf=f=>{const name=normalize(f?.properties?.name);return featured.find(i=>[i.name,...(i.aliases||[])].map(normalize).some(a=>name===a||(a.length>=4&&name.startsWith(a+' '))));};
const find=i=>api.findFeature(i);
const located=f=>Array.isArray(f?.geometry?.coordinates)&&f.geometry.coordinates.length===2&&f.geometry.coordinates.every(Number.isFinite)&&!(f.geometry.coordinates[0]===0&&f.geometry.coordinates[1]===0);
const field=(p,...names)=>names.map(k=>p?.[k]).find(v=>v!==undefined&&v!==null&&String(v).trim());
// Use geographic metadata rather than a placeholder in V2 partner views.
const partnerPlaceFromRecords=f=>{
 const recorded=tourLocationFromRecords(f);
 if(recorded.city&&recorded.country)return recorded;
 const p=f?.properties||{};
 const city=String(field(p,'city','town','locality','municipality')||recorded.city||'').trim();
 const rawCountry=String(field(p,'country_name','country')||recorded.country||'').trim();
 const aliases={'uk':'United Kingdom','gb':'United Kingdom','us':'United States','usa':'United States','de':'Germany','dk':'Denmark','fr':'France'};
 return {city,country:aliases[rawCountry.toLowerCase()]||rawCountry};
};
const place=f=>{
 const location=partnerPlaceFromRecords(f);
 return [location.city,location.country].filter(Boolean).join(', ')||'City and country unavailable';
};
const category=i=>groups.find(g=>g.id===i.group)||groups[0];
const root=element('div');root.id='v2-root';
root.innerHTML="\n<div id=\"v2-home\">\n  <div class=\"v2-logo-line\"><a class=\"v2-logo-link\" href=\"https://www.lboro.ac.uk/\" target=\"_blank\" rel=\"noopener noreferrer\" aria-label=\"Visit Loughborough University website (opens in a new tab)\"><img class=\"v2-brand-logo\" src=\"https://chris210.github.io/LU-logo-white.png\" alt=\"Loughborough University\"></a><button class=\"v2-icon-btn\" id=\"v2-collapse\" type=\"button\" aria-label=\"Minimise panel\">›</button></div>\n  <a class=\"v2-overline v2-school-link\" href=\"https://www.lboro.ac.uk/schools/design-creative-arts/\" target=\"_blank\" rel=\"noopener noreferrer\">School of Design and Creative Arts</a>\n  <h1 class=\"v2-h1\">Loughborough Global<br>Creative Network</h1>\n  <p class=\"v2-subtitle\">Connecting world-leading creativity, education and industry.</p>\n  <div class=\"v2-accolade\"><span class=\"v2-award\" aria-hidden=\"true\"><svg viewBox=\"0 0 28 30\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"m14 2.5 2.7 2.4 3.4-.2.6 3.4 2.7 2-1.7 3 1.1 3.3-3.3 1.3-1.7 2.8-3.8-1-3.8 1-1.7-2.8-3.3-1.3 1.1-3.3-1.7-3 2.7-2 .6-3.4 3.4.2Z\"/><circle cx=\"14\" cy=\"12.6\" r=\"4.3\"/><path d=\"m10.5 20.4-2.2 7 5.7-2.7 5.7 2.7-2.2-7\"/></svg></span><div><a class=\"v2-ranking-link\" href=\"https://www.topuniversities.com/university-subject-rankings/art-design?page=1\" target=\"_blank\" rel=\"noopener noreferrer\" aria-label=\"View QS Art and Design subject rankings (opens in a new tab)\"><strong>Top 50 in the world for Art and Design</strong></a><small>QS World University Rankings by Subject 2026</small></div></div>\n  <div class=\"v2-search-wrap\"><label for=\"v2-search\" class=\"visually-hidden\">Search all partners worldwide</label><span class=\"v2-search-icon\" aria-hidden=\"true\"><svg viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><circle cx=\"10.9\" cy=\"10.9\" r=\"6.8\"/><path d=\"m16 16 5 5\"/></svg></span><input class=\"v2-search-input\" id=\"v2-search\" type=\"search\" autocomplete=\"off\" placeholder=\"Search partners and places worldwide\"><div id=\"v2-search-results\" hidden role=\"listbox\" aria-label=\"Worldwide partner search results\"></div></div>\n  <div class=\"v2-category-legend\" role=\"group\" aria-label=\"Map marker colours\"><span><i class=\"v2-category-dot exchange\" aria-hidden=\"true\"></i>Exchange universities</span><span><i class=\"v2-category-dot placement\" aria-hidden=\"true\"></i>Employers &amp; placements</span></div>\n  <div class=\"v2-heading-row\"><h2><span class=\"v2-star\" aria-hidden=\"true\">★</span>Featured Partners</h2><button type=\"button\" class=\"v2-link-btn\" id=\"v2-view-all\">View all 50</button></div>\n  <div class=\"v2-tabs\" role=\"tablist\" aria-label=\"Featured partner categories\"></div>\n  <div class=\"v2-tiles\" id=\"v2-tiles\" aria-live=\"polite\"></div>\n  <div class=\"v2-data-note\"><span aria-hidden=\"true\">ⓘ</span><span>SDCA placement and exchange records · updated 18 Nov 2026</span></div>\n</div>\n<div id=\"v2-mobile-nav\"><a class=\"v2-logo-link\" href=\"https://www.lboro.ac.uk/\" target=\"_blank\" rel=\"noopener noreferrer\" aria-label=\"Visit Loughborough University website (opens in a new tab)\"><img class=\"v2-brand-logo\" src=\"https://chris210.github.io/LU-logo-white.png\" alt=\"Loughborough University\"></a><strong>Loughborough Global<br>Creative Network</strong></div>\n<div id=\"v2-mobile-accolade\"><svg viewBox=\"0 0 28 30\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"m14 2.5 2.7 2.4 3.4-.2.6 3.4 2.7 2-1.7 3 1.1 3.3-3.3 1.3-1.7 2.8-3.8-1-3.8 1-1.7-2.8-3.3-1.3 1.1-3.3-1.7-3 2.7-2 .6-3.4 3.4.2Z\"/><circle cx=\"14\" cy=\"12.6\" r=\"4.3\"/><path d=\"m10.5 20.4-2.2 7 5.7-2.7 5.7 2.7-2.2-7\"/></svg> &nbsp;<a class=\"v2-ranking-link\" href=\"https://www.topuniversities.com/university-subject-rankings/art-design?page=1\" target=\"_blank\" rel=\"noopener noreferrer\" aria-label=\"View QS Art and Design subject rankings (opens in a new tab)\">Top 50 in the world for Art and Design · QS 2026</a></div>\n<div class=\"v2-metrics\" id=\"v2-metrics\" aria-label=\"Global network figures\"><span><b>50</b>featured partners</span><span><b id=\"v2-placement-count\">—</b>placement hosts</span><span><b id=\"v2-exchange-count\">—</b>exchange universities</span></div>\n<button type=\"button\" class=\"v2-cta\" id=\"v2-start-tour\"><span class=\"v2-play\" aria-hidden=\"true\">▶</span>Take the tour: 50 featured partners</button>\n<div id=\"v2-compact-header\" hidden><a class=\"v2-logo-link\" href=\"https://www.lboro.ac.uk/\" target=\"_blank\" rel=\"noopener noreferrer\" aria-label=\"Visit Loughborough University website (opens in a new tab)\"><img class=\"v2-brand-logo\" src=\"https://chris210.github.io/LU-logo-white.png\" alt=\"Loughborough University\"></a><strong>Loughborough Global Creative Network</strong><button type=\"button\" class=\"v2-icon-btn\" id=\"v2-compact-search\" aria-label=\"Search partners\"><svg viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><circle cx=\"10.9\" cy=\"10.9\" r=\"6.8\"/><path d=\"m16 16 5 5\"/></svg></button><button type=\"button\" class=\"v2-icon-btn\" id=\"v2-return-home\" aria-label=\"Return to map\">‹</button></div>\n<aside id=\"v2-spotlight\" hidden aria-label=\"Featured partner details\"></aside>\n<div id=\"v2-overlay-scrim\" hidden></div>\n<section id=\"v2-directory\" hidden aria-label=\"50 featured partners\">\n <div class=\"v2-dir-header\"><button type=\"button\" class=\"v2-icon-btn\" id=\"v2-directory-back\" aria-label=\"Back to map\">‹</button><div class=\"v2-dir-title\"><small>Featured Partners</small><h2>50 organisations our students and staff work with</h2></div><button type=\"button\" class=\"v2-pdf\" id=\"v2-directory-print\">Download PDF</button></div>\n <div class=\"v2-dir-grid\" id=\"v2-dir-grid\"></div>\n</section>\n<section id=\"v2-tour-mode\" hidden aria-live=\"polite\">\n <div id=\"v2-tour-header\"><a class=\"v2-logo-link\" href=\"https://www.lboro.ac.uk/\" target=\"_blank\" rel=\"noopener noreferrer\" aria-label=\"Visit Loughborough University website (opens in a new tab)\"><img class=\"v2-brand-logo\" src=\"https://chris210.github.io/LU-logo-white.png\" alt=\"Loughborough University\"></a><strong>Loughborough Global Creative Network</strong></div>\n \n <div id=\"v2-tour-card\"><button type=\"button\" id=\"v2-exit-tour\" aria-label=\"Exit guided tour\" title=\"Exit guided tour\"><svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M6 6 18 18M18 6 6 18\"/></svg><span>Exit tour</span></button><div class=\"v2-spot-header\"><span class=\"v2-badge\"><span class=\"v2-badge-star\" aria-hidden=\"true\">★</span><span class=\"v2-badge-text\">Featured partner</span></span><span class=\"v2-spot-type\" id=\"v2-tour-kind\"></span></div><h2 id=\"v2-tour-name\"></h2><p id=\"v2-tour-desc\"></p><div id=\"v2-tour-location\" class=\"v2-tour-location\"></div><div id=\"v2-tour-relationship\" class=\"v2-tour-relationship\"></div><a id=\"v2-tour-website\" class=\"v2-tour-website\" target=\"_blank\" rel=\"noopener noreferrer\" hidden>Visit website ↗</a><div class=\"v2-tour-progress\"><div id=\"v2-tour-progress-active\"></div></div><div class=\"v2-tour-step-line\"><strong id=\"v2-tour-count\"></strong><span id=\"v2-tour-next\"></span></div><div class=\"v2-tour-countdown\" role=\"timer\" aria-label=\"Time until the next partner\"><span id=\"v2-tour-countdown-status\">Next stop in</span><div class=\"v2-countdown-track\" aria-hidden=\"true\"><div id=\"v2-countdown-fill\"></div></div><strong id=\"v2-tour-countdown-seconds\">9s</strong></div><div class=\"v2-tour-actions\"><button type=\"button\" id=\"v2-tour-prev\" aria-label=\"Previous partner\">‹</button><button type=\"button\" id=\"v2-tour-pause\" class=\"v2-pause\" aria-label=\"Pause tour\">Ⅱ</button><button type=\"button\" id=\"v2-tour-next-btn\" aria-label=\"Next partner\">›</button><small>Pauses on interaction · arrow keys to step</small></div></div>\n</section>";
document.body.appendChild(root);
// Tour and ordinary partner popups share the same vetted case-study destination.
const tourCaseAction=element('a','gcn-case-link gcn-tour-case-action');
tourCaseAction.id='v2-tour-case-study';
tourCaseAction.hidden=true;
$('v2-tour-website').before(tourCaseAction);
// Opening evidence should not let the guided tour advance in the background.
tourCaseAction.addEventListener('click',()=>pauseTour());
// A deliberately unhurried editorial pace: travel, settle, then linger.
const TOUR_DWELL_MS=6000;
const TOUR_TRAVEL_MS=7200;
const SPOTLIGHT_TRAVEL_MS=3100;
const CINEMATIC_EASE=t=>t*t*(3-2*t);
let tab='employers',activeSpotlightItem=null,panelMinimised=false,mode='home',tourIndex=0,tourTimer=null,playing=false,tourRemainingMs=TOUR_DWELL_MS,tourDeadline=0,tourPhase='idle',tourSequence=0,tourArrivalHandler=null,tourSiteMarker=null,tourPlaceAbortController=null,activeTourPlace=null;
const home=$('v2-home'),spot=$('v2-spotlight'),dir=$('v2-directory'),compact=$('v2-compact-header'),tour=$('v2-tour-mode');
// Mobile-only bottom drawer: a small, tappable handle is visible by default.
// Keep the existing search, map key and featured-partner controls inside the drawer.
const mobileDrawerToggle=element('button','v2-mobile-drawer-toggle');
mobileDrawerToggle.id='v2-mobile-drawer-toggle';
mobileDrawerToggle.type='button';
mobileDrawerToggle.setAttribute('aria-controls','v2-home');
const mobileDrawerLabel=element('span','v2-mobile-drawer-label','Explore partners');
const mobileDrawerChevron=element('span','v2-mobile-drawer-chevron','⌃');
mobileDrawerChevron.setAttribute('aria-hidden','true');
mobileDrawerToggle.append(mobileDrawerLabel,mobileDrawerChevron);
home.prepend(mobileDrawerToggle);
function setMobileDrawerOpen(isOpen){
 const open=Boolean(isOpen);
 home.classList.toggle('v2-mobile-collapsed',!open);
 root.classList.toggle('v2-mobile-drawer-open',open);
 mobileDrawerToggle.setAttribute('aria-expanded',String(open));
 mobileDrawerToggle.setAttribute('aria-label',open?'Collapse partner panel':'Expand partner panel');
 mobileDrawerLabel.textContent=open?'Close partners':'Explore partners';
}
mobileDrawerToggle.addEventListener('click',()=>setMobileDrawerOpen(home.classList.contains('v2-mobile-collapsed')));
setMobileDrawerOpen(false);

let selectedPartnerMarker=null;
function clearSelectedPartnerMarker(){
 if(selectedPartnerMarker){selectedPartnerMarker.remove();selectedPartnerMarker=null;}
}
function showSelectedPartnerMarker(item){
 clearSelectedPartnerMarker();
 const feature=find(item);
 if(!located(feature))return;
 // Mapbox's HTML marker stays exactly on the partner coordinates throughout camera flights.
 const pin=element('div','v2-selected-marker');
 pin.setAttribute('role','img');
 pin.setAttribute('aria-label',ui('selectedPartner',{name:item.name}));
 selectedPartnerMarker=new mapboxgl.Marker({element:pin,anchor:'center'})
  .setLngLat(feature.geometry.coordinates).addTo(map);
}
function view(name){
  if(name!=='spotlight')clearSelectedPartnerMarker();
  if(name==='home') setMobileDrawerOpen(false);
  document.body.classList.toggle('v2-guided-tour-active', name==='tour');
  mode=name;home.hidden=name!=='home'||panelMinimised;
  // Reuse the identical white mobile masthead in home and guided-tour views.
  $('v2-mobile-nav').hidden=name!=='home'&&name!=='tour';$('v2-mobile-accolade').hidden=name!=='home';
  $('v2-metrics').hidden=name!=='home';$('v2-start-tour').hidden=name!=='home';
  spot.hidden=name!=='spotlight';compact.hidden=name!=='spotlight'&&!(name==='home'&&panelMinimised);
  dir.hidden=name!=='directory';$('v2-overlay-scrim').hidden=name!=='directory';tour.hidden=name!=='tour';
  const picker=$('language-picker');if(picker)picker.hidden=name==='tour';
  $('v2-search-results').hidden=true;
}
function tabs(){
 const container=home.querySelector('.v2-tabs');container.replaceChildren();
 groups.forEach(g=>{
  const n=featured.filter(i=>i.group===g.id).length,button=element('button','',g.tab+' '+n);
  button.type='button';button.setAttribute('role','tab');button.setAttribute('aria-selected',g.id===tab?'true':'false');
  button.addEventListener('click',()=>{tab=g.id;tabs();tiles();});container.append(button);
 });
}
function tiles(){
 const box=$('v2-tiles');box.replaceChildren();
 featured.filter(i=>i.group===tab).slice(0,6).forEach(i=>{
   const b=element('button','v2-tile');b.type='button';
   b.append(element('strong','',i.name),element('small','',place(find(i))));
   b.addEventListener('click',()=>openPartner(i));box.append(b);
 });
}
function directory(){
 const container=$('v2-dir-grid');container.replaceChildren();
 groups.forEach(g=>{
  const items=featured.filter(i=>i.group===g.id),col=element('div','v2-dir-col');
  col.append(element('h3','',g.title+' · '+items.length));
  items.forEach(i=>{
   const b=element('button','v2-dir-row');
   b.append(element('strong','',i.name));
   // Do not clutter the directory with missing-geography placeholders.
   const locationLabel=place(find(i));
   if(locationLabel&&locationLabel!=='City and country unavailable'){
    b.append(element('small','',locationLabel));
   }
   b.addEventListener('click',()=>openPartner(i));col.append(b);
  });
  if(g.id==='design'){
    const rank=element('div','v2-rank-panel');
    rank.innerHTML='<a class="v2-ranking-link" href="https://www.topuniversities.com/university-subject-rankings/art-design?page=1" target="_blank" rel="noopener noreferrer" aria-label="View QS Art and Design subject rankings (opens in a new tab)"><strong>Top 50 in the world for Art and Design</strong></a><br>QS World University Rankings by Subject 2026';
    // Simply expand the original pale-purple QS box with text, not a second panel.
    const evidence=window.SDCA_V2_EXCELLENCE;
    if(evidence){
      const lang=$('language-select')?.value||'en';
      const localized=evidence.translations[lang]||evidence.translations.en;
      const list=element('div','v2-evidence-lines');
      evidence.facts.forEach(fact=>{
        const line=element('p','v2-evidence-line');
        line.append(element('strong','v2-evidence-value',fact.value));
        line.append(document.createTextNode(' '+(localized[fact.key]||evidence.translations.en[fact.key])));
        if(fact.source)line.append(element('small','v2-evidence-source',' · '+fact.source));
        list.append(line);
      });
      rank.append(list);
    }
    col.append(rank);
  }
  container.append(col);
 });
}
function programmes(p){
 const raw=field(p,'programmes','programs','programme','courses','subjects');
 if(Array.isArray(raw))return raw.map(String).slice(0,12);
 if(typeof raw==='string'){
   try{const obj=JSON.parse(raw);if(Array.isArray(obj))return obj.map(String).slice(0,12);}catch(e){}
   return raw.split(/[;|]/).map(s=>s.trim()).filter(Boolean).slice(0,12);
 }
 return [];
}
function years(p){
 const raw=field(p,'placement_years_display','placement_years','academic_years','years');
 return Array.isArray(raw)?raw.join(', '):String(raw||'');
}
function website(p){
 let raw=field(p,'website','website_url','url','partner_website');
 if(!raw&&p?.name==='Form Us with Love')raw='https://www.formuswithlove.se/';
 if(!raw)return '';
 try{const url=new URL(/^https?:\/\//i.test(String(raw))?String(raw):'https://'+raw);return ['https:','http:'].includes(url.protocol)?url.href:'';}catch(e){return '';}
}
// Spotlight and guided tour use the same Mapbox reverse-geocoding endpoint,
// while keeping separate request controllers to avoid cross-view interference.
const spotlightPlaceCache=new Map();
let spotlightPlaceSequence=0,spotlightPlaceAbortController=null;
function resolveSpotlightLocation(feature,row,sequence){
 if(!located(feature)||!mapboxgl.accessToken)return;
 const [longitude,latitude]=feature.geometry.coordinates;
 const key=longitude+','+latitude;
 const cached=spotlightPlaceCache.get(key);
 if(cached){row.replaceChildren(tourLocationNode(cached));return;}
 const query=new URLSearchParams({
  longitude:String(longitude),latitude:String(latitude),
  types:'place',limit:'1',language:'en',access_token:mapboxgl.accessToken
 });
 const controller=new AbortController();
 spotlightPlaceAbortController=controller;
 fetch('https://api.mapbox.com/search/geocode/v6/reverse?'+query.toString(),{
  signal:controller.signal,credentials:'omit'
 }).then(response=>{
  if(!response.ok)throw Error('Geocoding unavailable');
  return response.json();
 }).then(data=>{
  const p=data.features?.[0]?.properties||{};
  const city=p.name_preferred||p.name||p.context?.place?.name;
  const country=p.context?.country?.name;
  if(!city||!country)return;
  const resolved={city:String(city),country:String(country)};
  spotlightPlaceCache.set(key,resolved);
  if(sequence===spotlightPlaceSequence&&mode==='spotlight'&&row.isConnected){
   row.replaceChildren(tourLocationNode(resolved));
  }
 }).catch(error=>{
  if(error.name!=='AbortError')console.info('Spotlight using recorded location where available');
 }).finally(()=>{
  if(spotlightPlaceAbortController===controller)spotlightPlaceAbortController=null;
 });
}
function drawSpotlight(i){
 if(spotlightPlaceAbortController)spotlightPlaceAbortController.abort();
 spotlightPlaceAbortController=null;
 const sequence=++spotlightPlaceSequence;
 spot.replaceChildren();
 const feature=find(i),p=feature?.properties||{},yr=years(p),progs=programmes(p),link=website(p);
 const header=element('div','v2-spot-header');
 const badge=element('span','v2-badge');
 badge.append(element('span','v2-badge-star','★'),element('span','v2-badge-text','Featured partner'));
 badge.querySelector('.v2-badge-star').setAttribute('aria-hidden','true');
 header.append(badge,element('span','v2-spot-type',i.group==='academic'?'Exchange university':i.group==='design'?'Design studio':'Global employer'));
 const close=element('button','v2-icon-btn','×');close.type='button';close.setAttribute('aria-label','Return to map');close.onclick=overview;header.append(close);
 const locationLine=element('p','v2-spot-location');
 locationLine.append(tourLocationNode(partnerPlaceFromRecords(feature)));
 spot.append(header,element('h2','',i.name),locationLine);
 resolveSpotlightLocation(feature,locationLine,sequence);
 const grid=element('div','v2-stat-grid');
 if(i.group==='academic'){
  const qs=QS_WORLD_RANKINGS_2027.get(i.name);
  const card=element('div','v2-stat v2-qs-stat');
  card.append(element('span','','QS World Rank · 2027'));
  if(qs){
   const rankLink=element('a','v2-qs-rank','#'+qs[0]);
   rankLink.href=qs[1];rankLink.target='_blank';rankLink.rel='noopener noreferrer';
   rankLink.setAttribute('aria-label',i.name+' QS World University Rankings 2027: '+qs[0]+' (opens in a new tab)');
   card.append(rankLink);
  }else{
   card.append(element('strong','v2-qs-unavailable','Not available'));
  }
  grid.append(card);
 }
 const stats=i.group==='academic'?
  [['Category','University'],['Relationship','Academic exchange']]:
  [['Category',category(i).tab],['Relationship','Student placement']];
 stats.forEach(pair=>{
  const box=element('div','v2-stat');
  box.append(element('span','',pair[0]),element('strong','',pair[1]));
  grid.append(box);
 });
 if(i.group!=='academic')grid.classList.add('v2-stat-grid-two');
 spot.append(grid);
 // Evidence is the primary next action: keep it visible before longer metadata.
 const relatedWork=window.SDCA_V2_CASE_STUDIES?.createLink(feature,i,'v2-spot-link gcn-case-action');
 if(relatedWork)spot.append(relatedWork);
 if(progs.length){
  spot.append(element('div','v2-section-label','Programmes'));
  const list=element('div','v2-chip-list');progs.forEach(p=>list.append(element('span','v2-chip',p)));spot.append(list);
 }
 if(yr){
  spot.append(element('div','v2-section-label','Placement years'));
  spot.append(element('p','v2-spot-description v2-spot-years',yr));
 }
 // Relationship-only labels repeat the Relationship tile; retain substantive descriptions.
 const rawDescription=String(field(p,'description','summary','notes')||'').trim();
 // Reuse the original popup's curated field translations when available.
 // Organisation names and source data are never machine-translated.
 const localDescription=typeof api.localDescription==='function'&&p.description
   ? api.localDescription(p)?.text : null;
 const desc=String(localDescription||rawDescription).trim();
 if(desc&&!/^(?:sdca\s+)?student\s+placement\.?$/i.test(desc)){
  spot.append(element('p','v2-spot-description',desc.slice(0,640)));
 }
 if(link){
  const a=element('a','v2-spot-link','Visit '+new URL(link).hostname.replace(/^www\./,'')+' →');
  a.href=link;a.target='_blank';a.rel='noopener noreferrer';
  if(relatedWork)a.classList.add('gcn-secondary-website');
  spot.append(a);
 }
 const footer=element('div','v2-spot-footer'),next=element('button','v2-link-btn','Next featured partner →');
 next.onclick=()=>openPartner(ordered[(ordered.indexOf(i)+1)%ordered.length]);
 footer.append(element('span','', 'Featured partner '+(featured.indexOf(i)+1)+' of 50 · '),next);spot.append(footer);
}
function flyTo(i,touring=false){
 const f=find(i);
 if(!located(f)||!map.loaded())return false;
 try{
   map.flyTo({
     center:f.geometry.coordinates,
     zoom:touring?(i.group==='employers'?10.5:8.5):11.5,
     bearing:0,pitch:0,
     duration:window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:(touring?TOUR_TRAVEL_MS:SPOTLIGHT_TRAVEL_MS),
     easing:CINEMATIC_EASE,
     essential:false,
     padding:touring?
       (window.innerWidth>680?{left:180,right:0,top:0,bottom:0}:{left:0,right:0,top:0,bottom:145}):
       (window.innerWidth>680?
         {left:45,right:Math.ceil(spot.getBoundingClientRect().width+Math.max(0,window.innerWidth-spot.getBoundingClientRect().right)+25),top:45,bottom:45}:
         {left:20,right:20,top:24,bottom:Math.ceil(window.innerHeight-spot.getBoundingClientRect().top+15)})
   });
   return true;
 }catch(e){console.warn('Map camera could not move',e);return false;}
}
function openPartner(i,skip=false){activeSpotlightItem=i;stopTimer();clearTourArrival();clearTourMarker();tourPhase='idle';drawSpotlight(i);view('spotlight');showSelectedPartnerMarker(i);if(!skip)flyTo(i);}
function renderCountdown(){
 const seconds=$('v2-tour-countdown-seconds');
 if(!seconds)return;
 const status=$('v2-tour-countdown-status');
 const fill=$('v2-countdown-fill');
 if(tourPhase==='travel'){
   status.textContent='Flying to partner…';
   seconds.textContent='—';
   fill.style.width='0%';
   return;
 }
 const remaining=Math.max(0,tourRemainingMs);
 status.textContent=playing?'Next partner in':'Paused · next partner in';
 seconds.textContent=Math.ceil(remaining/1000)+'s';
 fill.style.width=(100*remaining/TOUR_DWELL_MS).toFixed(1)+'%';
}
function stopTimer(){
 if(tourTimer!==null){clearInterval(tourTimer);tourTimer=null;}
 if(playing&&tourPhase==='dwell')tourRemainingMs=Math.max(0,tourDeadline-performance.now());
 playing=false;
 if(mode==='tour')renderCountdown();
}
function overview(){
 stopTimer();if(tourPlaceAbortController){tourPlaceAbortController.abort();tourPlaceAbortController=null;}clearTourArrival();clearTourMarker();tourSequence++;tourPhase='idle';if(map.loaded())map.stop();panelMinimised=false;view('home');
 // Use the original country's reset camera, not an Atlantic placeholder.
 if(map.loaded())api.resetToVisitorCountry();
}
function openDirectory(){stopTimer();if(tourPlaceAbortController){tourPlaceAbortController.abort();tourPlaceAbortController=null;}clearTourArrival();clearTourMarker();tourSequence++;tourPhase='idle';directory();view('directory');}
function search(){
 const q=$('v2-search').value.trim().toLocaleLowerCase(),box=$('v2-search-results');box.replaceChildren();
 if(!q){box.hidden=true;return;}
 const matches=api.allFeatures().filter(f=>[f.properties?.name,f.properties?.description,f.properties?.location].join(' ').toLowerCase().includes(q)).slice(0,35);
 matches.forEach(f=>{
  const b=element('button','v2-search-result');
  b.append(element('span','',f.properties?.name||'Partner'),element('small','',place(f)));
  if(!located(f))b.disabled=true;
  b.onclick=()=>{const item=itemOf(f);$('v2-search').value='';box.hidden=true;
   if(item)openPartner(item);else{view('home');map.flyTo({center:f.geometry.coordinates,zoom:6,essential:false,duration:950});api.openNative(f);}
  };box.append(b);
 });
 if(!matches.length)box.append(element('div','v2-empty',api.status()==='ready'?'No matching partners found.':'Loading the worldwide directory…'));
 box.hidden=false;
}
function pauseTour(){
 if(mode!=='tour')return;
 stopTimer();
 $('v2-tour-pause').textContent='▶';
 $('v2-tour-pause').setAttribute('aria-label','Resume tour');
 renderCountdown();
}
function beginDwellClock(){
 if(tourTimer!==null){clearInterval(tourTimer);tourTimer=null;}
 if(!playing||tourPhase!=='dwell'||mode!=='tour')return;
 tourDeadline=performance.now()+tourRemainingMs;
 tourTimer=setInterval(()=>{
   if(mode!=='tour'){clearInterval(tourTimer);tourTimer=null;return;}
   tourRemainingMs=Math.max(0,tourDeadline-performance.now());
   if(tourRemainingMs<=0){
     clearInterval(tourTimer);
     tourTimer=null;
     stepTour(1,true);
     return;
   }
   renderCountdown();
 },100);
 renderCountdown();
}
function playTour(){
 if(mode!=='tour')return;
 playing=true;
 $('v2-tour-pause').textContent='Ⅱ';
 $('v2-tour-pause').setAttribute('aria-label','Pause tour');
 if(tourPhase==='dwell')beginDwellClock();
 else renderCountdown();
}
function tourScreen(){
 const item=ordered[tourIndex],f=find(item),p=f?.properties||{};
 $('v2-tour-name').textContent=item.name;
 $('v2-tour-kind').textContent=category(item).title;
 const localDescription=typeof api.localDescription==='function'&&p.description
   ? api.localDescription(p)?.text : null;
 $('v2-tour-desc').textContent=String(localDescription||field(p,'description','summary')||'Featured connection with the School of Design and Creative Arts.').slice(0,250);
 renderTourLocation(activeTourPlace);
 const yearsRow=$('v2-tour-relationship');
 yearsRow.replaceChildren(element('span','v2-tour-meta-label',p.group==='Exchange Programme'?'Exchange years':'Placement years'),
  element('strong','v2-tour-meta-value',years(p)||'Years not recorded'));
 window.SDCA_V2_CASE_STUDIES?.updateLink($('v2-tour-case-study'),f,item);
 const official=website(p),link=$('v2-tour-website');
 link.hidden=!official;
 if(official){
   link.href=official;
   link.textContent='Visit '+item.name+' website ↗';
   link.setAttribute('aria-label','Visit '+item.name+' website (opens in a new tab)');
 }
 $('v2-tour-count').textContent='Stop '+(tourIndex+1)+' of '+ordered.length;
 $('v2-tour-next').textContent='Next: '+ordered[(tourIndex+1)%ordered.length].name;
 $('v2-tour-progress-active').style.width=(100*(tourIndex+1)/ordered.length)+'%';
}
function clearTourArrival(){
 if(tourArrivalHandler){
   map.off('moveend',tourArrivalHandler);
   tourArrivalHandler=null;
 }
}
function clearTourMarker(){
 if(tourSiteMarker){tourSiteMarker.remove();tourSiteMarker=null;}
}
// Locate the current pin by its city and country (never display raw coordinates).
// Mapbox reverse-geocoding results are shown transiently, not stored in GitHub.
function tourLocationFromRecords(f){
 const p=f?.properties||{};
 const candidates=[p.location,...(Array.isArray(p.placement_locations)?p.placement_locations:[]),p.address_verified];
 const countryNames={
  'uk':'United Kingdom','united kingdom':'United Kingdom','usa':'United States',
  'us':'United States','united states':'United States',
  'denmark':'Denmark','sweden':'Sweden','germany':'Germany','france':'France',
  'italy':'Italy','japan':'Japan','netherlands':'Netherlands',
  'canada':'Canada','australia':'Australia','singapore':'Singapore',
  'hong kong':'Hong Kong','turkey':'Turkey','norway':'Norway',
  'spain':'Spain','finland':'Finland'
 };
 for(const candidate of candidates){
  if(typeof candidate!=='string'||candidate.includes('|'))continue;
  const parts=candidate.split(',').map(p=>p.trim()).filter(Boolean);
  if(parts.length<2)continue;
  const country=countryNames[parts[parts.length-1].toLowerCase()];
  const city=parts[0];
  if(country&&city&&!/^\d/.test(city)&&!/\b(road|street|hill|lane|drive|avenue)\b/i.test(city)){
   return {city,country};
  }
 }
 return {city:'',country:''};
}
function tourLocationNode(data){
 const city=String(data?.city||'').trim(),country=String(data?.country||'').trim();
 if(!city&&!country)return element('span','v2-tour-location-unavailable','City and country unavailable');
 const output=document.createDocumentFragment();
 if(city)output.append(element('span','v2-tour-city',city));
 if(city&&country)output.append(document.createTextNode(', '));
 if(country)output.append(element('strong','v2-tour-country',country));
 return output;
}
function renderTourLocation(data){
 const row=$('v2-tour-location');
 if(row){
  row.replaceChildren();
  const place=element('span','v2-tour-place');place.append(tourLocationNode(data));
  row.append(element('span','v2-tour-location-icon','⌖'),place);
 }
 const marker= tourSiteMarker?.getElement()?.querySelector('.v2-tour-marker-location');
 if(marker)marker.replaceChildren(tourLocationNode(data));
}
function resolveTourLocation(feature,sequence){
 if(!located(feature)||!mapboxgl.accessToken)return;
 const [longitude,latitude]=feature.geometry.coordinates;
 const query=new URLSearchParams({
  longitude:String(longitude),latitude:String(latitude),
  types:'place',limit:'1',language:'en',
  access_token:mapboxgl.accessToken
 });
 const controller=new AbortController();
 tourPlaceAbortController=controller;
 fetch('https://api.mapbox.com/search/geocode/v6/reverse?'+query.toString(),{
  signal:controller.signal,credentials:'omit',cache:'no-store'
 }).then(response=>{
  if(!response.ok)throw Error('Geocoding unavailable');
  return response.json();
 }).then(data=>{
  if(sequence!==tourSequence||mode!=='tour')return;
  const p=data.features?.[0]?.properties||{};
  const city=p.name_preferred||p.name||p.context?.place?.name;
  const country=p.context?.country?.name;
  if(!city||!country)return;
  activeTourPlace={city:String(city),country:String(country)};
  renderTourLocation(activeTourPlace);
 }).catch(error=>{
  if(error.name!=='AbortError')console.info('Tour using partner source location where available');
 });
}
function showTourMarker(item){
 clearTourMarker();
 const f=find(item);
 if(!located(f))return;
 const pin=element('div','v2-tour-site-marker');
 pin.append(element('span','v2-tour-site-dot'));
 const label=element('div','v2-tour-site-label');
 const markerPlace=element('small','v2-tour-marker-location');
 markerPlace.append(tourLocationNode(activeTourPlace));
 label.append(element('strong','',item.name),markerPlace);
 pin.append(label);
 pin.setAttribute('aria-label',ui('markerFor',{name:item.name}));
 tourSiteMarker=new mapboxgl.Marker({element:pin,anchor:'center'})
   .setLngLat(f.geometry.coordinates).addTo(map);
}
function beginTourStep(){
 tourSequence++;
 const token=tourSequence;
 if(tourPlaceAbortController){tourPlaceAbortController.abort();tourPlaceAbortController=null;}
 clearTourArrival();
 clearTourMarker();
 if(tourTimer!==null){clearInterval(tourTimer);tourTimer=null;}
 if(map.loaded())map.stop();
 tourPhase='travel';
 tourRemainingMs=TOUR_DWELL_MS;
 const item=ordered[tourIndex];
 activeTourPlace=tourLocationFromRecords(find(item));
 tourScreen();
 // The new partner details enter with a restrained reveal as the camera begins.
 const tourCard=$('v2-tour-card');
 tourCard.classList.remove('v2-partner-arrival');
 void tourCard.offsetWidth;
 tourCard.classList.add('v2-partner-arrival');
 resolveTourLocation(find(item),token);
 renderCountdown();
 const arrive=()=>{
   if(token!==tourSequence||mode!=='tour'||tourPhase!=='travel')return;
   clearTourArrival();
   showTourMarker(item);
   tourPhase='dwell';
   tourRemainingMs=TOUR_DWELL_MS;
   if(playing)beginDwellClock();
   else renderCountdown();
 };
 const f=find(item);
 if(!located(f)||!map.loaded()){arrive();return;}
 tourArrivalHandler=arrive;
 map.on('moveend',arrive);
 if(!flyTo(item,true))arrive();
 else if(!map.isMoving())arrive();
}
function stepTour(d,auto=false){
 if(!auto)pauseTour();
 tourIndex=(tourIndex+d+ordered.length)%ordered.length;
 beginTourStep();
}
function startTour(){
 stopTimer();
 clearTourArrival();
 clearTourMarker();
 panelMinimised=false;
 tourIndex=0;
 playing=true;
 tourRemainingMs=TOUR_DWELL_MS;
 view('tour');
 $('v2-tour-pause').textContent='Ⅱ';
 $('v2-tour-pause').setAttribute('aria-label','Pause tour');
 beginTourStep();
}
function renderCounts(){
 if(api.status()!=='ready')return;
 const all=api.allFeatures(),points=all.filter(located);
 const exchange=points.filter(f=>String(f.properties?.group||'').toLowerCase().includes('exchange')).length;
 $('v2-placement-count').textContent=(points.length-exchange).toLocaleString('en-GB');
 $('v2-exchange-count').textContent=exchange.toLocaleString('en-GB');
 $('v2-search').placeholder='Search all '+all.length.toLocaleString('en-GB')+' partners and places';
}
function mapStyle(){
 try{map.setProjection('globe');}catch(e){console.warn('Globe projection unavailable',e);}
 try{map.setFog({color:'#e0d6eb','high-color':'#d9cce5','horizon-blend':0.025,'space-color':'#1c092e','star-intensity':0});}catch(e){console.warn('Globe atmosphere unavailable',e);}
 try{
  for(const layer of (map.getStyle().layers||[])){
   const id=layer.id.toLowerCase();
   if(layer.type==='background')map.setPaintProperty(layer.id,'background-color','#2c124a');
   if(layer.type==='fill'&&/water|ocean|sea/.test(id))map.setPaintProperty(layer.id,'fill-color','#ded5e9');
   if(layer.type==='fill'&&/land|natural|landcover/.test(id))map.setPaintProperty(layer.id,'fill-color','#ffffff');
   if(layer.type==='line'&&/boundary|admin|border/.test(id))map.setPaintProperty(layer.id,'line-color','#d3c7e0');
  }
  if(map.getLayer('sdca-master-points')){
   map.setPaintProperty('sdca-master-points','circle-color',['match',['get','group'],'Exchange Programme','#2D0153','#F0047F']);
   map.setPaintProperty('sdca-master-points','circle-opacity',1);
   map.setPaintProperty('sdca-master-points','circle-radius',5.5);
  }
 }catch(e){console.warn('Some base layers cannot be recoloured',e);}
 // Styling must not override the country-aware initial camera in index.html.
}
function highlight(){
 if(!map.loaded()||api.status()!=='ready')return;
 const features=featured.map(i=>{const f=find(i);return located(f)?{type:'Feature',properties:{name:i.name,markerType:String(f.properties?.group||'')==='Exchange Programme'?'exchange':'placement'},geometry:f.geometry}:null;}).filter(Boolean);
 const collection={type:'FeatureCollection',features};
 if(!features.length)return;
 const existing=map.getSource('v2-key-partners');
 if(existing){existing.setData(collection);return;}
 try{
  map.addSource('v2-key-partners',{type:'geojson',data:collection,cluster:true,clusterRadius:54,clusterMaxZoom:5,clusterProperties:{exchangeCount:['+',['case',['==',['get','markerType'],'exchange'],1,0]]}});
  map.addLayer({id:'v2-key-clusters',type:'circle',source:'v2-key-partners',filter:['has','point_count'],paint:{
    'circle-color':['case',['>=',['get','exchangeCount'],['/', ['get','point_count'],2]],'#2D0153','#F0047F'],
    'circle-radius':['step',['get','point_count'],15,4,21,12,29,25,33],
    'circle-stroke-color':['case',
      ['all',['>', ['get','exchangeCount'],0],['<',['get','exchangeCount'],['get','point_count']]],
      ['case',['>=',['get','exchangeCount'],['/', ['get','point_count'],2]],'#F0047F','#2D0153'],
      '#ffffff'],
    'circle-stroke-width':3}});
  map.addLayer({id:'v2-key-count',type:'symbol',source:'v2-key-partners',filter:['has','point_count'],
    layout:{'text-field':['get','point_count_abbreviated'],'text-size':13},paint:{'text-color':'#ffffff'}});
  map.addLayer({id:'v2-key-cluster-halo',type:'circle',source:'v2-key-partners',filter:['has','point_count'],paint:{
    'circle-color':'#ffffff','circle-opacity':.13,
    'circle-radius':['step',['get','point_count'],23,4,31,12,39,25,44]
  }},'v2-key-clusters');
  map.addLayer({id:'v2-key-points',type:'circle',source:'v2-key-partners',filter:['!',['has','point_count']],paint:{
    'circle-color':['match',['get','markerType'],'exchange','#2D0153','#F0047F'],'circle-radius':8,'circle-stroke-color':'#fff','circle-stroke-width':3}});
  map.addLayer({id:'v2-key-halo',type:'circle',source:'v2-key-partners',filter:['!',['has','point_count']],paint:{
    'circle-color':'#ffffff','circle-radius':13,'circle-opacity':.12}},'v2-key-points');
  map.addLayer({id:'v2-key-labels',type:'symbol',source:'v2-key-partners',filter:['!',['has','point_count']],
    layout:{'text-field':['get','name'],'text-size':11,'text-anchor':'left','text-offset':[1.5,0],'text-max-width':17,'text-optional':true},
    paint:{'text-color':'#34125e','text-halo-color':'#ffffff','text-halo-width':2}});
  map.on('click','v2-key-clusters',e=>{
   const f=e.features?.[0];if(!f)return;
   map.getSource('v2-key-partners').getClusterExpansionZoom(f.properties.cluster_id,(err,zoom)=>{
    if(!err)map.easeTo({center:f.geometry.coordinates,zoom:zoom,duration:600,essential:false});
   });
  });
 }catch(e){console.warn('Featured marker cluster could not be created',e);}
}
window.SDCA_V2={
 handleMapClick(e){
  if(!map.getLayer('v2-key-points')||!map.getLayer('v2-key-clusters'))return false;
  const hits=map.queryRenderedFeatures(e.point,{layers:['v2-key-points','v2-key-clusters']});
  if(!hits.length)return false;
  const f=hits[0];
  if(f.properties?.cluster){return true;} // Layer-specific cluster handler zooms into the group.
  const item=itemOf(f);
  if(item){openPartner(item);return true;}
  return false;
 },
 handleMapFeature(f){const item=itemOf(f);if(!item)return false;if(mode==='tour'){pauseTour();return true;}openPartner(item,true);return true;},
 openPartner(name){const item=featured.find(i=>normalize(i.name)===normalize(name));if(item)openPartner(item);}
};
tabs();tiles();directory();view('home');
$('v2-view-all').onclick=openDirectory;
$('v2-directory-back').onclick=overview;$('v2-directory-print').onclick=()=>window.print();
$('v2-overlay-scrim').onclick=overview;
$('v2-compact-search').onclick=()=>{overview();$('v2-search').focus();};
$('v2-return-home').onclick=overview;
$('v2-collapse').onclick=()=>{panelMinimised=!panelMinimised;view('home');};
$('language-select')?.addEventListener('change',()=>{
  if(mode==='directory')directory();
  if(mode==='tour')tourScreen();
  if(mode==='spotlight'&&activeSpotlightItem){
    drawSpotlight(activeSpotlightItem);
    const marker=selectedPartnerMarker?.getElement();
    if(marker)marker.setAttribute('aria-label',ui('selectedPartner',{name:activeSpotlightItem.name}));
  }
});
$('v2-search').addEventListener('input',search);
$('v2-search').addEventListener('keydown',e=>{if(e.key==='Enter')$('v2-search-results').querySelector('button:not([disabled])')?.click();});
$('v2-start-tour').onclick=startTour;$('v2-exit-tour').onclick=overview;
$('v2-tour-pause').onclick=()=>playing?pauseTour():playTour();
$('v2-tour-prev').onclick=()=>stepTour(-1);$('v2-tour-next-btn').onclick=()=>stepTour(1);
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'){if(mode==='tour'||mode==='directory'||mode==='spotlight'){overview();e.preventDefault();}else if(mode==='home'&&root.classList.contains('v2-mobile-drawer-open')&&window.matchMedia('(max-width:680px)').matches){setMobileDrawerOpen(false);mobileDrawerToggle.focus();e.preventDefault();}else $('v2-search-results').hidden=true;}
 if(mode==='tour'&&(e.key==='ArrowLeft'||e.key==='ArrowRight')&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)){
  e.preventDefault();stepTour(e.key==='ArrowLeft'?-1:1);
 }
});
api.startLookup()?.then(()=>{tiles();directory();renderCounts();highlight();});
map.on('load',()=>{mapStyle();api.startLookup()?.then(highlight);});
if(map.loaded()){mapStyle();highlight();}
})();