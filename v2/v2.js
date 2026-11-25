
/* Loughborough Global Creative Network — Figma Iteration 2. Runs in a separate V2 only. */
(function(){
'use strict';
const api=window.SDCA_V2_BRIDGE;
if(!api){console.error('V2 bridge unavailable; original site is still functional');return;}
const map=api.map;
const exhibitionRequested=['tv','exhibition'].includes(new URLSearchParams(location.search).get('mode'));
let exhibition=exhibitionRequested;
let exhibitionReady=false, exhibitionStarted=false, exhibitionMapReady=map.isStyleLoaded()===true;
const exhibitionHome='https://chris210.github.io/v2/';
const groups=[{id:'academic',title:'Universities',tab:'Universities'},{id:'design',title:'Design studios',tab:'Studios'},{id:'employers',title:'Global employers',tab:'Employers'}];
const featured=api.featured;
const ordered=window.SDCA_V2_REPUTATION?.sort(featured,item=>api.findFeature(item),window.SDCA_V2_REPUTATION.visitorCountry())||featured.slice();
// One editorial order follows the visitor's country, without changing the featured 50.
// All QS values and years are stored separately from presentation in the V2 data file.
const qsRankingData=window.SDCA_V2_QS_RANKINGS;
const homeArt=qsRankingData?.home()?.art_design||null;
const homeArtYear=Number.isInteger(homeArt?.edition)?homeArt.edition:2026;
const homeArtPosition=parseInt(String(homeArt?.rank||'').replace(/^[^0-9]*/,''),10);
const homeTop50=Number.isInteger(homeArtPosition)&&homeArtPosition<=50;
const artClaim=homeTop50?'Top 50 in the world for Art and Design':'QS-ranked in Art and Design';
const qsArtUrl='https://www.topuniversities.com/university-subject-rankings/art-design';
const qsLabels={
 en:{world:'QS World Ranking',art:'QS Art & Design',missing:'Rank not available',worldScore:'Overall score',artScore:'Art & Design score',na:'not available'},
 'zh-CN':{world:'QS 世界大学排名',art:'QS 艺术与设计',missing:'暂无排名数据',worldScore:'综合得分',artScore:'艺术与设计得分',na:'暂无数据'},
 'zh-TW':{world:'QS 世界大學排名',art:'QS 藝術與設計',missing:'暫無排名資料',worldScore:'綜合得分',artScore:'藝術與設計得分',na:'暫無資料'},
 ja:{world:'QS世界大学ランキング',art:'QSアート＆デザイン',missing:'順位情報なし',worldScore:'総合スコア',artScore:'アート＆デザインのスコア',na:'データなし'},
 hi:{world:'QS विश्व विश्वविद्यालय रैंकिंग',art:'QS कला एवं डिज़ाइन',missing:'रैंक उपलब्ध नहीं',worldScore:'समग्र स्कोर',artScore:'कला एवं डिज़ाइन स्कोर',na:'उपलब्ध नहीं'},
 ar:{world:'تصنيف QS العالمي',art:'QS للفنون والتصميم',missing:'لا يوجد تصنيف متاح',worldScore:'الدرجة الإجمالية',artScore:'درجة الفنون والتصميم',na:'غير متاحة'}
};
// The guided tour shows the stronger (numerically lower) recorded QS position.
// Preserve tied ranks and ranking bands exactly as published in the source data.
const qsOrdinal=ranking=>{
 const raw=String(ranking?.rank??'').trim();
 if(!/^=?\d/.test(raw))return null;
 const match=raw.match(/\d+/);
 return match?Number(match[0]):null;
};
const strongestTourQs=record=>{
 const options=['art_design','overall'].map(kind=>({
  kind,ranking:record?.[kind],position:qsOrdinal(record?.[kind])
 })).filter(value=>Number.isFinite(value.position)&&value.position>0);
 options.sort((a,b)=>a.position-b.position||
  (a.kind==='art_design'?-1:1)); // On a tie, prefer the relevant subject.
 return options[0]||null;
};
const makeQsRankingCard=(institution,kind,ranking)=>{
 const locale=document.getElementById('language-select')?.value||'en';
 const words=qsLabels[locale]||qsLabels.en;
 const qs=kind==='overall'?words.world:words.art;
 const card=element('div','v2-stat v2-qs-stat');
 const year=Number.isInteger(ranking?.edition)?' · '+ranking.edition:'';
 card.append(element('span','',qs+year));
 const rank=ranking?.rank;
 if(rank!==undefined&&rank!==null&&String(rank).trim()){
  const rankLink=element('a','v2-qs-rank',qsRankingData?.formatRank(rank)||('#'+String(rank).replace(/^#?\s*=\s*/,'').replace(/^#\s*/,'')));
  rankLink.href=ranking.source_url||(kind==='overall'?'https://www.topuniversities.com/world-university-rankings':qsArtUrl);
  rankLink.target='_blank';rankLink.rel='noopener noreferrer';
  rankLink.setAttribute('aria-label',institution+' '+qs+(ranking.edition?' '+ranking.edition:'')+' rank '+String(rank).replace(/^#?\s*=\s*/,'').replace(/^#\s*/,'')+' (opens source in a new tab)');
  card.append(rankLink);
 }else{
  card.append(element('strong','v2-qs-unavailable',words.missing));
 }
 return card;
};
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
// A regional display convention only; original directory properties stay intact.
const isHongKongLocation=value=>/^(?:hk|hong kong(?:\s+(?:sar|special administrative region))?(?:,\s*china)?|香港(?:特别行政区|特別行政區)?|中国香港特别行政区|中國香港特別行政區)$/i.test(String(value||'').trim());
const locationParts=data=>{
 const originalCity=String(data?.city||'').trim();
 const originalCountry=String(data?.country||'').trim();
 const hk=isHongKongLocation(originalCountry);
 return {
  city:hk&&isHongKongLocation(originalCity)?'':originalCity,
  country:hk?'Hong Kong SAR, China':originalCountry
 };
};
const place=f=>{
 const location=locationParts(partnerPlaceFromRecords(f));
 return [location.city,location.country].filter(Boolean).join(', ');
};
const category=i=>groups.find(g=>g.id===i.group)||groups[0];
const root=element('div');root.id='v2-root';
root.innerHTML="\n<div id=\"v2-home\">\n  <div class=\"v2-logo-line\"><a class=\"v2-logo-link\" href=\"https://www.lboro.ac.uk/\" target=\"_blank\" rel=\"noopener noreferrer\" aria-label=\"Visit Loughborough University website (opens in a new tab)\"><picture><source media=\"(prefers-color-scheme: dark)\" srcset=\"https://chris210.github.io/LU-logo-white.png\"><img class=\"v2-brand-logo\" src=\"./LU-logo-primary.svg\" alt=\"Loughborough University\"></picture></a><button class=\"v2-icon-btn\" id=\"v2-collapse\" type=\"button\" aria-label=\"Minimise panel\">›</button></div>\n  <a class=\"v2-overline v2-school-link\" href=\"https://www.lboro.ac.uk/schools/design-creative-arts/\" target=\"_blank\" rel=\"noopener noreferrer\">School of Design and Creative Arts</a>\n  <h1 class=\"v2-h1\">Loughborough Global<br>Creative Network</h1>\n  <p class=\"v2-subtitle\">Connecting world-leading creativity, education and industry.</p>\n  <div class=\"v2-accolade\"><span class=\"v2-award\" aria-hidden=\"true\"><svg viewBox=\"0 0 28 30\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"m14 2.5 2.7 2.4 3.4-.2.6 3.4 2.7 2-1.7 3 1.1 3.3-3.3 1.3-1.7 2.8-3.8-1-3.8 1-1.7-2.8-3.3-1.3 1.1-3.3-1.7-3 2.7-2 .6-3.4 3.4.2Z\"/><circle cx=\"14\" cy=\"12.6\" r=\"4.3\"/><path d=\"m10.5 20.4-2.2 7 5.7-2.7 5.7 2.7-2.2-7\"/></svg></span><div><a class=\"v2-ranking-link\" href=\"https://www.topuniversities.com/university-subject-rankings/art-design?page=1\" target=\"_blank\" rel=\"noopener noreferrer\" aria-label=\"View QS Art and Design subject rankings (opens in a new tab)\"><strong>Top 50 in the world for Art and Design</strong></a><small>QS World University Rankings by Subject 2026</small></div></div>\n  <div class=\"v2-search-wrap\"><label for=\"v2-search\" class=\"visually-hidden\">Search all partners worldwide</label><span class=\"v2-search-icon\" aria-hidden=\"true\"><svg viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><circle cx=\"10.9\" cy=\"10.9\" r=\"6.8\"/><path d=\"m16 16 5 5\"/></svg></span><input class=\"v2-search-input\" id=\"v2-search\" type=\"search\" autocomplete=\"off\" placeholder=\"Search partners, places or themes\"><div id=\"v2-search-results\" hidden role=\"listbox\" aria-label=\"Worldwide partner search results\"></div></div>\n  <div class=\"v2-category-legend\" role=\"group\" aria-label=\"Map marker colours\"><span><i class=\"v2-category-dot exchange\" aria-hidden=\"true\"></i>University partners</span><span><i class=\"v2-category-dot placement\" aria-hidden=\"true\"></i>Employers &amp; placements</span></div>\n  <div class=\"v2-heading-row\"><h2><span class=\"v2-star\" aria-hidden=\"true\">★</span>Featured Partners</h2><button type=\"button\" class=\"v2-link-btn\" id=\"v2-view-all\">View all 50</button></div>\n  <div class=\"v2-tabs\" role=\"tablist\" aria-label=\"Featured partner categories\"></div>\n  <div class=\"v2-tiles\" id=\"v2-tiles\" aria-live=\"polite\"></div>\n  <div class=\"v2-data-note\"><span aria-hidden=\"true\">ⓘ</span><span id=\"v2-records-updated\" data-added-iso=\"2026-11-18\">SDCA records updated 18 Nov 2026</span></div>\n</div>\n<div id=\"v2-mobile-nav\"><a class=\"v2-logo-link\" href=\"https://www.lboro.ac.uk/\" target=\"_blank\" rel=\"noopener noreferrer\" aria-label=\"Visit Loughborough University website (opens in a new tab)\"><picture><source media=\"(prefers-color-scheme: dark)\" srcset=\"https://chris210.github.io/LU-logo-white.png\"><img class=\"v2-brand-logo\" src=\"./LU-logo-primary.svg\" alt=\"Loughborough University\"></picture></a><strong>Loughborough Global<br>Creative Network</strong></div>\n<div id=\"v2-mobile-accolade\"><svg viewBox=\"0 0 28 30\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"m14 2.5 2.7 2.4 3.4-.2.6 3.4 2.7 2-1.7 3 1.1 3.3-3.3 1.3-1.7 2.8-3.8-1-3.8 1-1.7-2.8-3.3-1.3 1.1-3.3-1.7-3 2.7-2 .6-3.4 3.4.2Z\"/><circle cx=\"14\" cy=\"12.6\" r=\"4.3\"/><path d=\"m10.5 20.4-2.2 7 5.7-2.7 5.7 2.7-2.2-7\"/></svg> &nbsp;<a class=\"v2-ranking-link\" href=\"https://www.topuniversities.com/university-subject-rankings/art-design?page=1\" target=\"_blank\" rel=\"noopener noreferrer\" aria-label=\"View QS Art and Design subject rankings (opens in a new tab)\">Top 50 in the world for Art and Design · QS 2026</a></div>\n<div class=\"v2-metrics\" id=\"v2-metrics\" aria-label=\"Global network figures\"><span><b>50</b>featured partners</span><span><b id=\"v2-placement-count\">—</b>placement hosts</span><span><b id=\"v2-exchange-count\">—</b>exchange universities</span></div>\n<button type=\"button\" class=\"v2-cta\" id=\"v2-start-tour\"><span class=\"v2-play\" aria-hidden=\"true\">▶</span>Take the tour: 50 featured partners</button>\n<div id=\"v2-compact-header\" hidden><a class=\"v2-logo-link\" href=\"https://www.lboro.ac.uk/\" target=\"_blank\" rel=\"noopener noreferrer\" aria-label=\"Visit Loughborough University website (opens in a new tab)\"><picture><source media=\"(prefers-color-scheme: dark)\" srcset=\"https://chris210.github.io/LU-logo-white.png\"><img class=\"v2-brand-logo\" src=\"./LU-logo-primary.svg\" alt=\"Loughborough University\"></picture></a><strong>Loughborough Global Creative Network</strong><button type=\"button\" class=\"v2-icon-btn\" id=\"v2-compact-search\" aria-label=\"Search partners\"><svg viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><circle cx=\"10.9\" cy=\"10.9\" r=\"6.8\"/><path d=\"m16 16 5 5\"/></svg></button><button type=\"button\" class=\"v2-icon-btn\" id=\"v2-return-home\" aria-label=\"Return to map\">‹</button></div>\n<aside id=\"v2-spotlight\" hidden aria-label=\"Featured partner details\"></aside>\n<div id=\"v2-overlay-scrim\" hidden></div>\n<section id=\"v2-directory\" hidden aria-label=\"50 featured partners\">\n <div class=\"v2-dir-header\"><button type=\"button\" class=\"v2-icon-btn\" id=\"v2-directory-back\" aria-label=\"Back to map\">‹</button><div class=\"v2-dir-title\"><small>Featured Partners</small><h2>50 organisations our students and staff work with</h2></div><button type=\"button\" class=\"v2-pdf\" id=\"v2-directory-print\">Download PDF</button></div>\n <div class=\"v2-dir-grid\" id=\"v2-dir-grid\"></div>\n</section>\n<section id=\"v2-tour-mode\" hidden aria-live=\"polite\">\n <div id=\"v2-tour-header\"><a class=\"v2-logo-link\" href=\"https://www.lboro.ac.uk/\" target=\"_blank\" rel=\"noopener noreferrer\" aria-label=\"Visit Loughborough University website (opens in a new tab)\"><picture><source media=\"(prefers-color-scheme: dark)\" srcset=\"https://chris210.github.io/LU-logo-white.png\"><img class=\"v2-brand-logo\" src=\"./LU-logo-primary.svg\" alt=\"Loughborough University\"></picture></a><strong>Loughborough Global Creative Network</strong></div>\n \n <div id=\"v2-tour-card\"><button type=\"button\" id=\"v2-exit-tour\" aria-label=\"Exit guided tour\" title=\"Exit guided tour\"><svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M6 6 18 18M18 6 6 18\"/></svg><span>Exit tour</span></button><div class=\"v2-spot-header\"><span class=\"v2-badge\"><span class=\"v2-badge-star\" aria-hidden=\"true\">★</span><span class=\"v2-badge-text\">Featured partner</span></span><span class=\"v2-spot-type\" id=\"v2-tour-kind\"></span></div><h2 id=\"v2-tour-name\"></h2><p id=\"v2-tour-desc\"></p><div id=\"v2-tour-location\" class=\"v2-tour-location\"></div><div id=\"v2-tour-qs\" class=\"v2-tour-qs\" hidden></div><div id=\"v2-tour-relationship\" class=\"v2-tour-relationship\"></div><a id=\"v2-tour-website\" class=\"v2-tour-website\" target=\"_blank\" rel=\"noopener noreferrer\" hidden>Visit website ↗</a><div class=\"v2-tour-progress\"><div id=\"v2-tour-progress-active\"></div></div><div class=\"v2-tour-step-line\"><strong id=\"v2-tour-count\"></strong><span id=\"v2-tour-next\"></span></div><div class=\"v2-tour-countdown\" role=\"timer\" aria-label=\"Time until the next partner\"><span id=\"v2-tour-countdown-status\">Next stop in</span><div class=\"v2-countdown-track\" aria-hidden=\"true\"><div id=\"v2-countdown-fill\"></div></div><strong id=\"v2-tour-countdown-seconds\">9s</strong></div><div class=\"v2-tour-actions\"><button type=\"button\" id=\"v2-tour-prev\" aria-label=\"Previous partner\">‹</button><button type=\"button\" id=\"v2-tour-pause\" class=\"v2-pause\" aria-label=\"Pause tour\">Ⅱ</button><button type=\"button\" id=\"v2-tour-next-btn\" aria-label=\"Next partner\">›</button></div></div>\n</section>";
// Match the displayed edition to Loughborough's source-backed Art & Design result.
root.innerHTML=root.innerHTML.replace(/QS World University Rankings by Subject 2026/g,'QS World University Rankings by Subject '+homeArtYear)
 .replace(/QS 2026/g,'QS '+homeArtYear);
if(!homeTop50)root.innerHTML=root.innerHTML.replace(/Top 50 in the world for Art and Design/g,artClaim);
document.body.appendChild(root);
const exhibitionEntry=element('a','v2-exhibition-entry','Exhibition mode ↗');
exhibitionEntry.href='?mode=tv'; homeEntry();
function homeEntry(){document.getElementById('v2-start-tour').after(exhibitionEntry);}
const exhibitionInfo=element('div','v2-exhibition-info');
exhibitionInfo.id='v2-exhibition-info';
const exhibitionStory=element('p','v2-exhibition-story');
exhibitionStory.hidden=true;
document.getElementById('v2-tour-relationship').after(exhibitionStory);
const exhibitionFooter=element('div','v2-exhibition-footer');
const exhibitionLink=element('a','v2-exhibition-link');
exhibitionLink.href=exhibitionHome;
const exhibitionQr=element('img','v2-exhibition-qr');exhibitionQr.src='./exhibition-qr.svg';exhibitionQr.alt='QR code to explore the interactive map';
const exhibitionInvite=element('span','v2-exhibition-invite','Explore the network on your phone');
exhibitionLink.append(exhibitionQr,exhibitionInvite);
const exhibitionControls=element('div','v2-exhibition-controls');
const exhibitionFullscreen=element('button','','Full screen');exhibitionFullscreen.type='button';
exhibitionFullscreen.addEventListener('click',()=>{if(document.fullscreenElement){document.exitFullscreen?.();}else document.documentElement.requestFullscreen?.().catch(()=>{});});
const exhibitionExit=element('a','','Exit exhibition');exhibitionExit.href=exhibitionHome;
const exhibitionLanguage=element('select');exhibitionLanguage.setAttribute('aria-label','Exhibition language');
const originalLanguage=document.getElementById('language-select');
for(const option of originalLanguage.options)exhibitionLanguage.append(option.cloneNode(true));
const requestedLang=new URLSearchParams(location.search).get('lang');
if(exhibition&&requestedLang&&Array.from(originalLanguage.options).some(o=>o.value===requestedLang)){originalLanguage.value=requestedLang;originalLanguage.dispatchEvent(new Event('change',{bubbles:true}));}
exhibitionLanguage.value=originalLanguage.value;
exhibitionLanguage.addEventListener('change',()=>{originalLanguage.value=exhibitionLanguage.value;originalLanguage.dispatchEvent(new Event('change',{bubbles:true}));});
const exhibitionPause=element('button','','Pause');exhibitionPause.type='button';
exhibitionPause.addEventListener('click',()=>playing?pauseTour():playTour());
exhibitionControls.append(exhibitionLanguage,exhibitionPause,exhibitionFullscreen,exhibitionExit);
exhibitionFooter.append(exhibitionLink,exhibitionControls);exhibitionInfo.append(exhibitionFooter);
document.getElementById('v2-tour-mode').append(exhibitionInfo);
if(exhibition){const logoPicture=document.querySelector('#v2-tour-header picture');const whiteLogo='https://chris210.github.io/LU-logo-white.png';logoPicture.querySelector('source').media='all';logoPicture.querySelector('img').src=whiteLogo;document.body.classList.add('v2-exhibition'); const loading=element('div','v2-exhibition-loading','Preparing the global creative network…');loading.id='v2-exhibition-loading';document.body.append(loading);}

// Tour and ordinary partner popups share the same vetted case-study destination.
const tourCaseAction=element('a','gcn-case-link gcn-tour-case-action');
tourCaseAction.id='v2-tour-case-study';
tourCaseAction.hidden=true;
$('v2-tour-website').before(tourCaseAction);
// Opening evidence should not let the guided tour advance in the background.
tourCaseAction.addEventListener('click',()=>pauseTour());
// A deliberately unhurried editorial pace: travel, settle, then linger.
const TOUR_DWELL_MS=exhibitionRequested?15000:6000;
const TOUR_TRAVEL_MS=7200;
const SPOTLIGHT_TRAVEL_MS=3100;
const CINEMATIC_EASE=t=>t*t*(3-2*t);
let tab='academic',activeSpotlightItem=null,panelMinimised=exhibition,mode='home',tourIndex=0,tourTimer=null,playing=false,tourRemainingMs=TOUR_DWELL_MS,tourDeadline=0,tourPhase='idle',tourSequence=0,tourArrivalHandler=null,tourSiteMarker=null,tourPlaceAbortController=null,activeTourPlace=null;
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
  mode=name;home.hidden=exhibition||name!=='home'||panelMinimised;
  exhibitionEntry.hidden=name!=='home'||panelMinimised||exhibition;
  // Reuse the identical white mobile masthead in home and guided-tour views.
  $('v2-mobile-nav').hidden=name!=='home'&&name!=='tour';$('v2-mobile-accolade').hidden=name!=='home';
  $('v2-metrics').hidden=name!=='home';$('v2-start-tour').hidden=name!=='home';
  spot.hidden=name!=='spotlight';compact.hidden=exhibition||(name!=='spotlight'&&!(name==='home'&&panelMinimised));
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
 ordered.filter(i=>i.group===tab).slice(0,6).forEach(i=>{
   const b=element('button','v2-tile');b.type='button';
   b.append(element('strong','',i.name));
   const locationLabel=place(find(i));
   if(locationLabel)b.append(element('small','',locationLabel));
   b.addEventListener('click',()=>openPartner(i));box.append(b);
 });
}
function directory(){
 const container=$('v2-dir-grid');container.replaceChildren();
 // Maintain the three established partner categories. Within each one, use
 // the same evidence-led, country-aware ranking as the home tiles and tour.
 const model=window.SDCA_V2_REPUTATION;
 const audience=model?.visitorCountry();
 let audienceName='';
 if(audience){
  try{audienceName=new Intl.DisplayNames(['en'],{type:'region'}).of(audience)||audience;}
  catch(_){audienceName=audience;}
 }
 const intro=element('p','v2-dir-audience',
  audienceName
   ?'Featured partners ranked within each category for audiences in '+audienceName+'. Editorial Art & Design relevance, not QS survey results.'
   :'Featured partners ranked within each category in the global editorial order. A detected country personalises each list.');
 container.append(intro);
 groups.forEach(group=>{
  const partners=ordered.filter(item=>item.group===group.id);
  const col=element('section','v2-dir-col');
  const heading=element('h3','',group.title);
  heading.append(element('span','v2-dir-count',String(partners.length)));
  col.append(heading);
  partners.forEach((item,index)=>{
   const priority=index+1;
   const b=element('button','v2-dir-row');
   b.type='button';
   b.setAttribute('aria-label',group.title+' priority '+priority+': '+item.name);
   b.append(element('span','v2-dir-position',String(priority).padStart(2,'0')));
   const details=element('span','v2-dir-partner');
   details.append(element('strong','',item.name));
   b.append(details);
   // Never display placeholder geography for partners with no location.
   const locationLabel=place(find(item));
   if(locationLabel)b.append(element('small','v2-dir-location',locationLabel));
   b.addEventListener('click',()=>openPartner(item));
   col.append(b);
  });
  container.append(col);
 });
 // Retain the existing QS evidence panel, below the ranked master list.
 const rank=element('div','v2-rank-panel v2-dir-evidence');
 rank.innerHTML='<a class="v2-ranking-link" href="https://www.topuniversities.com/university-subject-rankings/art-design?page=1" target="_blank" rel="noopener noreferrer" aria-label="View QS Art and Design subject rankings (opens in a new tab)"><strong>'+artClaim+'</strong></a><br>QS World University Rankings by Subject '+homeArtYear;
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
 container.append(rank);
}
// Refresh when country detection and the full partner index are ready.
// Preserve the active tour's sequence if a slow country lookup finishes mid-flight.
function refreshAudienceOrder(){
 const model=window.SDCA_V2_REPUTATION;
 if(!model||mode==='tour')return;
 const country=model.visitorCountry();
 const ranked=model.sort(featured,find,country);
 const changed=!ranked.every((item,index)=>item===ordered[index]);
 if(changed){
  ordered.splice(0,ordered.length,...ranked);
  tiles();
  if(mode==='spotlight'&&activeSpotlightItem){
   const position=spot.querySelector('.v2-spot-footer > span');
   if(position)position.textContent='Featured partner '+(ordered.indexOf(activeSpotlightItem)+1)+' of 50';
  }
 }
 // Also refresh the audience label if a country becomes known but its order ties.
 if(mode==='directory')directory();
 const header=home.querySelector('.v2-heading-row h2');
 if(header&&country)header.title='Featured partners curated for the '+country+' audience; editorial relevance, not QS survey scores';
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
 header.append(badge,element('span','v2-spot-type',i.group==='academic'?(p.group==='Academic Collaboration'?'Academic collaborator':'University partner'):i.group==='design'?'Design studio':'Global employer'));
 const close=element('button','v2-icon-btn','×');close.type='button';close.setAttribute('aria-label','Return to map');close.onclick=overview;header.append(close);
 const locationLine=element('p','v2-spot-location');
 locationLine.append(tourLocationNode(partnerPlaceFromRecords(feature)));
 spot.append(header,element('h2','',i.name),locationLine);
 resolveSpotlightLocation(feature,locationLine,sequence);
 const grid=element('div','v2-stat-grid');
 if(i.group==='academic'){
  grid.classList.add('v2-stat-grid-two','v2-stat-grid-academic');
  const qs=qsRankingData?.lookup(i.name,feature?.id);
  grid.append(makeQsRankingCard(i.name,'overall',qs?.overall));
  grid.append(makeQsRankingCard(i.name,'art_design',qs?.art_design));
 }
 const stats=i.group==='academic'?
  [['Category','University'],['Relationship',p.group==='Academic Collaboration'?'Academic collaboration':'Academic exchange']]:
  [['Category',category(i).tab],['Relationship','Student placement']];
 stats.forEach(pair=>{
  const box=element('div','v2-stat');
  box.append(element('span','',pair[0]),element('strong','',pair[1]));
  grid.append(box);
 });
 if(i.group!=='academic')grid.classList.add('v2-stat-grid-two');
 spot.append(grid);
 const partnerThemes=window.SDCA_V2_THEMES?.render(feature);
 if(partnerThemes)spot.append(partnerThemes);
 // Evidence is the primary next action: keep it visible before longer metadata.
 const relatedWork=window.SDCA_V2_CASE_STUDIES?.createLink(feature,i,'v2-spot-link gcn-case-action');
 if(relatedWork)spot.append(relatedWork);
 if(progs.length){
  spot.append(element('div','v2-section-label','Programmes'));
  const list=element('div','v2-chip-list');progs.forEach(p=>list.append(element('span','v2-chip',p)));spot.append(list);
 }
 if(p.relationship_years_display){
  spot.append(element('div','v2-section-label','Activity'));
  const friendlyDates={
   'Documented; dates unspecified':'Shared activity is recorded; dates have not been published.',
   '2019–2020 documented; ongoing status not asserted':'Research and teaching projects documented in 2019–2020; current status unconfirmed.',
   'Study-abroad listing reviewed 2026':'University-wide study-abroad listing · reviewed in 2026',
   '2021 documented seminar':'International design research seminar · 2021'
  };
  spot.append(element('p','v2-spot-description v2-spot-years',friendlyDates[p.relationship_years_display]||p.relationship_years_display));
 }else if(yr){
  spot.append(element('div','v2-section-label',i.group==='academic'?'Exchange years':'Placement years'));
  spot.append(element('p','v2-spot-description v2-spot-years',yr));
 }
 // Relationship-only labels repeat the Relationship tile; retain substantive descriptions.
 const rawDescription=String(field(p,'description','summary','notes')||'').trim();
 // Reuse the original popup's curated field translations when available.
 // Organisation names and source data are never machine-translated.
 const localDescription=typeof api.localDescription==='function'&&p.description
   ? api.localDescription(p)?.text : null;
 const editorial=window.SDCA_V2_ACTIVITY?.forFeature(feature);
 const desc=String(editorial||localDescription||rawDescription).trim();
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
 footer.append(element('span','', 'Featured partner '+(ordered.indexOf(i)+1)+' of 50'),next);spot.append(footer);
}
function flyTo(i,touring=false){
 const f=find(i);
 if(!located(f)||!(touring&&exhibition?exhibitionMapReady:map.loaded()))return false;
 try{
   map.flyTo({
     center:f.geometry.coordinates,
     zoom:touring?(exhibition?5.2:(i.group==='employers'?10.5:8.5)):11.5,
     bearing:0,pitch:0,
     duration:window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:(touring?TOUR_TRAVEL_MS:SPOTLIGHT_TRAVEL_MS),
     easing:CINEMATIC_EASE,
     essential:false,
     padding:touring?
       (exhibition&&window.innerWidth>680?{left:Math.round(window.innerWidth*.44),right:30,top:80,bottom:75}:window.innerWidth>680?{left:180,right:0,top:0,bottom:0}:{left:0,right:0,top:0,bottom:145}):
       (window.innerWidth>680?
         {left:45,right:Math.ceil(spot.getBoundingClientRect().width+Math.max(0,window.innerWidth-spot.getBoundingClientRect().right)+25),top:45,bottom:45}:
         {left:20,right:20,top:24,bottom:Math.ceil(window.innerHeight-spot.getBoundingClientRect().top+15)})
   });
   return true;
 }catch(e){console.warn('Map camera could not move',e);return false;}
}
function openPartner(i,skip=false){activeSpotlightItem=i;stopTimer();clearTourArrival();clearTourMarker();tourPhase='idle';drawSpotlight(i);view('spotlight');showSelectedPartnerMarker(i);if(!skip)flyTo(i);}
function renderCountdown(){
 if(exhibition)exhibitionPause.textContent=playing?'Pause':'Resume';
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
 if(exhibition){location.href=exhibitionHome;return;}
 stopTimer();if(tourPlaceAbortController){tourPlaceAbortController.abort();tourPlaceAbortController=null;}clearTourArrival();clearTourMarker();tourSequence++;tourPhase='idle';if(map.loaded())map.stop();panelMinimised=false;view('home');
 // Use the original country's reset camera, not an Atlantic placeholder.
 if(map.loaded())api.resetToVisitorCountry();
}
function openDirectory(){stopTimer();if(tourPlaceAbortController){tourPlaceAbortController.abort();tourPlaceAbortController=null;}clearTourArrival();clearTourMarker();tourSequence++;tourPhase='idle';directory();view('directory');}
function search(){
 const q=$('v2-search').value.trim().toLocaleLowerCase(),box=$('v2-search-results');box.replaceChildren();
 if(!q){box.hidden=true;return;}
 // Search the entire authoritative world index; the map viewport never limits results.
 const themes=window.SDCA_V2_THEMES;
 const candidates=api.allFeatures().map(f=>{
  const p=f.properties||{};
  const ordinary=[p.name,p.description,p.location,p.city,p.country].join(' ').toLocaleLowerCase().includes(q);
  const tagMatches=themes?.matchingTags(f,q)||[];
  const record=themes?.get(f);
  const name=normalize(p.name||'');
  const query=normalize(q);
  const evidenceScore=record?.basis?.startsWith('case_study')?5:
    record?.basis?.startsWith('official_')?4:
    record?.basis==='sector_inferred_pending_website'?2:
    record?.basis==='school_strategy_pending'?1:0;
  return {f,ordinary,tagMatches,evidenceScore,exactName:name===query,nameStarts:name.startsWith(query)};
 }).filter(x=>x.ordinary||x.tagMatches.length);
 // When a user types a theme, partners with directly matching themes surface first.
 candidates.sort((a,b)=>Number(b.exactName)-Number(a.exactName) ||
    Number(b.nameStarts)-Number(a.nameStarts) ||
    Number(b.tagMatches.length>0)-Number(a.tagMatches.length>0) ||
    b.evidenceScore-a.evidenceScore ||
    Number(b.ordinary)-Number(a.ordinary) ||
    String(a.f.properties?.name||'').localeCompare(String(b.f.properties?.name||'')));
 const matches=candidates.slice(0,35);
 if(candidates.length>35){
  const count=element('div','v2-empty',candidates.length+' matching partners · showing first 35. Refine your search to narrow results.');
  box.append(count);
 }
 matches.forEach(({f,tagMatches})=>{
  const b=element('button','v2-search-result');
  b.append(element('span','',f.properties?.name||'Partner'));
  const locationLabel=place(f);
  if(locationLabel)b.append(element('small','',locationLabel));
  if(tagMatches.length){
    b.append(element('small','gcn-search-result-themes gcn-search-result-theme-match',tagMatches.map(tag=>themes.displayLabel(tag)).join(' · ')));
  }else{
    const listed=themes?.displayForFeature(f)||[];
    if(listed.length)b.append(element('small','gcn-search-result-themes',listed.join(' · ')));
  }
  if(!located(f))b.disabled=true;
  b.onclick=()=>{const item=itemOf(f);$('v2-search').value='';box.hidden=true;
   if(item)openPartner(item);else{view('home');map.flyTo({center:f.geometry.coordinates,zoom:6,essential:false,duration:950});api.openNative(f);}
  };box.append(b);
 });
 if(!candidates.length)box.append(element('div','v2-empty',api.status()==='ready'?'No matching partners found.':'Loading the worldwide directory…'));
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
 if(exhibition){
  const evidence=window.SDCA_V2_CASE_STUDIES?.findPartner(f,item)?.cases?.[0];
  exhibitionStory.textContent=evidence?.summary||'';
  exhibitionStory.hidden=!evidence?.summary;
  if(evidence?.summary)exhibitionStory.setAttribute('lang','en');
 }
 $('v2-tour-name').textContent=item.name;
 $('v2-tour-kind').textContent=category(item).title;
 const localDescription=typeof api.localDescription==='function'&&p.description
   ? api.localDescription(p)?.text : null;
 $('v2-tour-desc').textContent=String(window.SDCA_V2_ACTIVITY?.forFeature(f)||localDescription||field(p,'description','summary')||'Featured connection with the School of Design and Creative Arts.').slice(0,370);
 if(exhibition&&exhibitionStory.textContent) $('v2-tour-desc').hidden=true;
 else $('v2-tour-desc').hidden=false;
 renderTourLocation(activeTourPlace);
 // Show the strongest recorded QS position for university stops, including
 // the correct separate edition year; other types have no QS element.
 const qsRow=$('v2-tour-qs');
 qsRow.replaceChildren();
 qsRow.hidden=true;
 if(item.group==='academic'){
  const selected=strongestTourQs(qsRankingData?.lookup(item.name,f?.id));
  if(selected){
   const locale=$('language-select')?.value||'en';
   const words=qsLabels[locale]||qsLabels.en;
   const typeLabel=selected.kind==='art_design'?words.art:words.world;
   const edition=Number.isInteger(selected.ranking.edition)?' · '+selected.ranking.edition:'';
   const rankText=qsRankingData?.formatRank(selected.ranking.rank)||('#'+String(selected.ranking.rank).replace(/^#?\s*=\s*/,'').replace(/^#\s*/,''));
   const link=element('a','v2-tour-qs-rank',rankText);
   link.href=selected.ranking.source_url||
     (selected.kind==='art_design'?qsArtUrl:'https://www.topuniversities.com/world-university-rankings');
   link.target='_blank';
   link.rel='noopener noreferrer';
   link.setAttribute('aria-label',item.name+' '+typeLabel+edition+' position '+rankText+' (opens QS source in a new tab)');
   qsRow.append(element('span','v2-tour-qs-label',typeLabel+edition),link);
   qsRow.hidden=false;
  }
 }
 const yearsRow=$('v2-tour-relationship');
 yearsRow.hidden=exhibition&&!Boolean(p.relationship_years_display||years(p));
 yearsRow.replaceChildren(element('span','v2-tour-meta-label',p.group==='Academic Collaboration'?'Activity':p.group==='Exchange Programme'?'Exchange years':'Placement years'),
  element('strong','v2-tour-meta-value',p.relationship_years_display||years(p)||'Years not recorded'));
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
  'hong kong':'Hong Kong','taiwan':'Taiwan','tw':'Taiwan','turkey':'Turkey','norway':'Norway',
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
 const {city,country}=locationParts(data);
 if(!city&&!country)return document.createDocumentFragment();
 const output=document.createDocumentFragment();
 if(city)output.append(element('span','v2-tour-city',city));
 if(city&&country)output.append(document.createTextNode(', '));
 if(country)output.append(element('strong','v2-tour-country',country));
 return output;
}
function renderTourLocation(data){
 const {city,country}=locationParts(data);
 const hasLocation=Boolean(city||country);
 const row=$('v2-tour-location');
 if(row){
  row.replaceChildren();
  row.style.display=hasLocation?'':'none';
  if(hasLocation){
   const place=element('span','v2-tour-place');place.append(tourLocationNode(data));
   row.append(element('span','v2-tour-location-icon','⌖'),place);
  }
 }
 const marker=tourSiteMarker?.getElement()?.querySelector('.v2-tour-marker-location');
 if(marker){
  marker.replaceChildren(tourLocationNode(data));
  marker.style.display=hasLocation?'':'none';
 }
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
 markerPlace.style.display=locationParts(activeTourPlace).city||locationParts(activeTourPlace).country?'':'none';
 label.append(element('strong','',item.name),markerPlace);
 pin.append(label);
 pin.setAttribute('aria-label',ui('markerFor',{name:item.name}));
 tourSiteMarker=new mapboxgl.Marker({element:pin,anchor:'center'})
   .setLngLat(f.geometry.coordinates).addTo(map);
}
// A great-circle line visually connects each destination with Loughborough.
function drawExhibitionConnection(feature){
 if(!located(feature)||!map.isStyleLoaded())return;
 const start=[-1.2284,52.7653],end=feature.geometry.coordinates;
 const rad=Math.PI/180,vec=p=>[Math.cos(p[1]*rad)*Math.cos(p[0]*rad),Math.cos(p[1]*rad)*Math.sin(p[0]*rad),Math.sin(p[1]*rad)];
 const a=vec(start),b=vec(end),omega=Math.acos(Math.max(-1,Math.min(1,a.reduce((sum,v,i)=>sum+v*b[i],0))));
 const points=[];
 for(let n=0;n<=96;n++){
  const t=n/96,den=Math.sin(omega);
  const v=Math.abs(den)<1e-7?a.map((x,i)=>x*(1-t)+b[i]*t):a.map((x,i)=>(Math.sin((1-t)*omega)*x+Math.sin(t*omega)*b[i])/den);
  points.push([Math.atan2(v[1],v[0])/rad,Math.atan2(v[2],Math.hypot(v[0],v[1]))/rad]);
 }
 const segments=[[points[0]]];
 for(let i=1;i<points.length;i++){
  const p=points[i-1],q=points[i],diff=q[0]-p[0];
  if(Math.abs(diff)>180){const edge=diff>0?-180:180,adjusted=q[0]+(diff>0?-360:360),lat=p[1]+(q[1]-p[1])*(edge-p[0])/(adjusted-p[0]);segments.at(-1).push([edge,lat]);segments.push([[-edge,lat]]);}
  segments.at(-1).push(q);
 }
 const data={type:'Feature',geometry:{type:'MultiLineString',coordinates:segments},properties:{}};
 try{
  if(map.getSource('v2-exhibition-connection'))map.getSource('v2-exhibition-connection').setData(data);
  else {map.addSource('v2-exhibition-connection',{type:'geojson',data});map.addLayer({id:'v2-exhibition-connection',type:'line',source:'v2-exhibition-connection',layout:{'line-cap':'round','line-join':'round'},paint:{'line-color':'#ffbd00','line-width':3,'line-opacity':0.8}});}
 }catch(e){console.warn('Exhibition connection unavailable',e);}
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
 // Render the destination marker before the camera starts its flight.
 if(exhibition)drawExhibitionConnection(find(item));
 showTourMarker(item);
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
   tourPhase='dwell';
   tourRemainingMs=TOUR_DWELL_MS;
   if(playing)beginDwellClock();
   else renderCountdown();
 };
 const f=find(item);
 if(!located(f)||!(exhibition?exhibitionMapReady:map.loaded())){arrive();return;}
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
 if(exhibition){document.getElementById('v2-exhibition-loading')?.remove();}
 stopTimer();
 clearTourArrival();
 clearTourMarker();
 panelMinimised=exhibition;
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
 const placements=points.filter(f=>String(f.properties?.group||'').toLowerCase().includes('placement')).length;
 $('v2-placement-count').textContent=placements.toLocaleString('en-GB');
 $('v2-exchange-count').textContent=exchange.toLocaleString('en-GB');
 $('v2-search').placeholder='Search all '+all.length.toLocaleString('en-GB')+' partners and places';
 const added=api.lastPartnerAdded?.();
 if(/^\d{4}-\d{2}-\d{2}$/.test(added||'')){
  const note=$('v2-records-updated');
  const formatted=new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(added+'T12:00:00Z'));
  note.dataset.addedIso=added;
  note.textContent='SDCA records updated '+formatted;
 }
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
   map.setPaintProperty('sdca-master-points','circle-color',['match',['get','group'],'Exchange Programme','#2D0153','Academic Collaboration','#2D0153','#F0047F']);
   map.setPaintProperty('sdca-master-points','circle-opacity',['case',['==',['get','sdcaFeatured'],true],0,1]);
   map.setPaintProperty('sdca-master-points','circle-radius',5.5);
  }
 }catch(e){console.warn('Some base layers cannot be recoloured',e);}
 // Styling must not override the country-aware initial camera in index.html.
}
// The clustering index decides where bubbles appear, not what their labels count.
let lastCoverageSignature='',lastCoverageData='',coveragePartners=[];
function updateDiskCoverage(){
 if(!map.getLayer('v2-key-cluster-seeds')||!map.getSource('v2-key-disk-coverage'))return;
 const seeds=new Map();
 for(const f of map.queryRenderedFeatures({layers:['v2-key-cluster-seeds']})){
  if(f.geometry?.type==='Point')seeds.set(f.properties.cluster_id,f);
 }
 const sorted=[...seeds.values()].sort((a,b)=>a.properties.cluster_id-b.properties.cluster_id);
 const center=map.getCenter(),canvas=map.getCanvas();
 const signature=JSON.stringify([center.lng,center.lat,map.getZoom(),map.getBearing(),map.getPitch(),canvas.clientWidth,canvas.clientHeight,sorted.map(f=>[f.properties.cluster_id,f.properties.point_count,f.geometry.coordinates])]);
 if(signature===lastCoverageSignature)return;
 lastCoverageSignature=signature;
 const globe=map.getProjection()?.name==='globe'&&map.getZoom()<6;
 const projectVisible=coords=>{
  const p=map.project(coords);
  if(!Number.isFinite(p.x)||!Number.isFinite(p.y))return null;
  // A location behind the globe can project into the visible hemisphere.
  // The inverse projection must recover the same geographic location.
  if(globe){
   const ll=map.unproject(p);
   const longitudeError=Math.abs(((ll.lng-coords[0]+540)%360+360)%360-180);
   if(!Number.isFinite(ll.lat)||longitudeError>.05||Math.abs(ll.lat-coords[1])>.05)return null;
  }
  return p;
 };
 const partners=sorted.length?coveragePartners.map(f=>({...f,point:projectVisible(f.coords)})).filter(f=>f.point):[];
 const disks=[];
 for(const seed of sorted){
  const p=seed.properties,coords=seed.geometry.coordinates,point=projectVisible(coords);
  if(!point)continue;
  // Preserve existing bubble and halo sizes, independent of the new count.
  const n=Number(p.point_count),diskRadius=n>=25?33:n>=12?29:n>=4?21:15;
  const haloRadius=n>=25?44:n>=12?39:n>=4?31:23;
  const strokeWidth=window.matchMedia('(prefers-color-scheme: dark)').matches?1.5:3;
  const radiusSquared=(diskRadius+strokeWidth)**2;
  const included=new Map();
  for(const partner of partners){
   const dx=partner.point.x-point.x,dy=partner.point.y-point.y;
   if(dx*dx+dy*dy<=radiusSquared)included.set(partner.name,Boolean(included.get(partner.name)||partner.exchange));
  }
  const exchangeCount=[...included.values()].filter(Boolean).length;
  disks.push({type:'Feature',geometry:{type:'Point',coordinates:coords},properties:{cluster:true,cluster_id:p.cluster_id,point_count:included.size,exchangeCount,diskRadius,haloRadius}});
 }
 const data=JSON.stringify(disks);
 if(data===lastCoverageData)return;
 lastCoverageData=data;
 map.getSource('v2-key-disk-coverage').setData({type:'FeatureCollection',features:disks});
}
function highlight(){
 if(!map.loaded()||api.status()!=='ready')return;
 // Match the master layer's featured aliases, including additional locations
 // of a featured organisation; deduplicate coincident records for that partner.
 const seen=new Set(),features=[];
 coveragePartners=[];
 for(const f of api.allFeatures()){
  if(!located(f))continue;
  const i=itemOf(f);
  coveragePartners.push({coords:f.geometry.coordinates,name:normalize(i?.name||f.properties?.name)||String(f.properties?.name||f.id),exchange:/^(Exchange Programme|Academic Collaboration)$/.test(String(f.properties?.group||''))});
  if(!i)continue;
  const key=JSON.stringify([i.name,f.geometry.coordinates]);
  if(seen.has(key))continue;
  seen.add(key);
  features.push({type:'Feature',properties:{name:i.name,markerType:/^(Exchange Programme|Academic Collaboration)$/.test(String(f.properties?.group||''))?'exchange':'placement'},geometry:f.geometry});
 }
 const collection={type:'FeatureCollection',features};
 if(!features.length)return;
 const existing=map.getSource('v2-key-partners');
 if(existing){lastCoverageSignature='';existing.setData(collection);return;}
 try{
  map.addSource('v2-key-partners',{type:'geojson',data:collection,cluster:true,clusterRadius:54,clusterMaxZoom:5,clusterProperties:{exchangeCount:['+',['case',['==',['get','markerType'],'exchange'],1,0]]}});
  // Transparent seed circles remain queryable; the displayed disks use a separate source.
  map.addLayer({id:'v2-key-cluster-seeds',type:'circle',source:'v2-key-partners',filter:['has','point_count'],paint:{
    'circle-radius':['step',['get','point_count'],15,4,21,12,29,25,33],
    'circle-stroke-width':3,'circle-opacity':0,'circle-stroke-opacity':0,'circle-pitch-scale':'viewport','circle-pitch-alignment':'viewport'}});
  map.addSource('v2-key-disk-coverage',{type:'geojson',data:{type:'FeatureCollection',features:[]},buffer:128});
  map.addLayer({id:'v2-key-clusters',type:'circle',source:'v2-key-disk-coverage',paint:{
    'circle-color':['case',['>=',['get','exchangeCount'],['/', ['get','point_count'],2]],'#2D0153','#F0047F'],
    'circle-radius':['get','diskRadius'],'circle-pitch-scale':'viewport','circle-pitch-alignment':'viewport',
    'circle-stroke-color':['case',
      ['all',['>', ['get','exchangeCount'],0],['<',['get','exchangeCount'],['get','point_count']]],
      ['case',['>=',['get','exchangeCount'],['/', ['get','point_count'],2]],'#F0047F','#2D0153'],
      '#ffffff'],
    'circle-stroke-width':3}});
  map.addLayer({id:'v2-key-count',type:'symbol',source:'v2-key-disk-coverage',
    layout:{'text-field':['to-string',['get','point_count']],'text-size':13,'text-allow-overlap':true,'text-ignore-placement':true,'text-pitch-alignment':'viewport','text-rotation-alignment':'viewport'},paint:{'text-color':'#ffffff'}});
  map.addLayer({id:'v2-key-cluster-halo',type:'circle',source:'v2-key-disk-coverage',paint:{
    'circle-color':'#ffffff','circle-opacity':.13,
    'circle-radius':['get','haloRadius'],'circle-pitch-scale':'viewport','circle-pitch-alignment':'viewport'
  }},'v2-key-clusters');
  // Draw a crisp five-point star at 2x resolution, independent of basemap fonts.
  const starId='v2-featured-gold-star';
  if(!map.hasImage(starId)){
   const canvas=document.createElement('canvas');canvas.width=canvas.height=56;
   const ctx=canvas.getContext('2d');
   ctx.beginPath();
   for(let n=0;n<10;n++){
    const a=-Math.PI/2+n*Math.PI/5,r=n%2===0?23:10;
    const x=28+Math.cos(a)*r,y=28+Math.sin(a)*r;
    if(n===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
   }
   ctx.closePath();ctx.lineJoin='round';
   ctx.strokeStyle='#FFFFFF';ctx.lineWidth=6;ctx.stroke();
   ctx.strokeStyle='#2D0153';ctx.lineWidth=2.5;ctx.stroke();
   ctx.fillStyle='#FFBD00';ctx.fill();
   map.addImage(starId,ctx.getImageData(0,0,56,56),{pixelRatio:2});
  }
  map.addLayer({id:'v2-key-points',type:'symbol',source:'v2-key-partners',filter:['!',['has','point_count']],
   layout:{'icon-image':starId,'icon-size':1,'icon-allow-overlap':true,'icon-ignore-placement':true},
   paint:{'icon-emissive-strength':1}});
  map.addLayer({id:'v2-key-halo',type:'circle',source:'v2-key-partners',filter:['!',['has','point_count']],paint:{
    'circle-color':'#ffffff','circle-radius':13,'circle-opacity':.12}},'v2-key-points');
  map.addLayer({id:'v2-key-labels',type:'symbol',source:'v2-key-partners',filter:['!',['has','point_count']],
    layout:{'text-field':['get','name'],'text-font':['Open Sans Bold','Arial Unicode MS Bold'],'text-size':11,'text-anchor':'left','text-offset':[1.5,0],'text-max-width':17,'text-optional':true},
    paint:{'text-color':'#34125e','text-halo-color':'#ffffff','text-halo-width':2}});
  map.on('render',updateDiskCoverage);
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>{lastCoverageSignature='';map.triggerRepaint();});
  updateDiskCoverage();
  map.on('click','v2-key-clusters',e=>{
   const f=e.features?.[0];if(!f)return;
   map.getSource('v2-key-partners').getClusterExpansionZoom(f.properties.cluster_id,(err,zoom)=>{
    if(!err)map.easeTo({center:f.geometry.coordinates,zoom:Math.max(zoom,map.getZoom()+1),duration:600,essential:false});
   });
  });
 }catch(e){console.warn('Featured marker cluster could not be created',e);}
}
window.SDCA_V2={
 pauseTour(){pauseTour();},
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
tabs();refreshAudienceOrder();tiles();directory();view('home');
Promise.resolve(window.__sdcaV2IpCountryPromise).then(refreshAudienceOrder).catch(()=>{ /* Keep global order if lookup fails. */ });
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
 // The native case-study dialog owns Escape and arrow keys while open.
 if(document.getElementById('gcn-case-dialog')?.open)return;
 if(e.key==='Escape'){if(mode==='tour'||mode==='directory'||mode==='spotlight'){overview();e.preventDefault();}else if(mode==='home'&&root.classList.contains('v2-mobile-drawer-open')&&window.matchMedia('(max-width:680px)').matches){setMobileDrawerOpen(false);mobileDrawerToggle.focus();e.preventDefault();}else $('v2-search-results').hidden=true;}
 if(mode==='tour'&&(e.key==='ArrowLeft'||e.key==='ArrowRight')&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)){
  e.preventDefault();stepTour(e.key==='ArrowLeft'?-1:1);
 }
});
function maybeStartExhibition(){
 if(!exhibition||exhibitionStarted||!exhibitionReady||api.status()!=='ready'||!exhibitionMapReady)return;
 refreshAudienceOrder();
 const usable=ordered.filter(item=>located(find(item)));
 if(!usable.length){document.getElementById('v2-exhibition-loading').textContent='No featured locations available. Reload to retry.';return;}
 exhibitionStarted=true;
 ordered.splice(0,ordered.length,...usable);
 startTour();
}
api.startLookup()?.then(()=>{refreshAudienceOrder();tiles();directory();renderCounts();highlight();if(exhibition&&api.status()!=='ready')document.getElementById('v2-exhibition-loading').textContent='Partner directory unavailable. Reload to retry.';maybeStartExhibition();});
Promise.resolve(window.__sdcaV2IpCountryPromise).catch(()=>null).then(()=>{exhibitionReady=true;maybeStartExhibition();});
map.on('load',()=>{exhibitionMapReady=true;mapStyle();api.startLookup()?.then(()=>{highlight();maybeStartExhibition();});maybeStartExhibition();});
// A data load can briefly make map.loaded() false; retry once the map settles.
map.on('idle',()=>{if(!map.getLayer('v2-key-points'))highlight();});
if(exhibition)map.on('idle',()=>{exhibitionMapReady=true;maybeStartExhibition();});
if(map.loaded()){mapStyle();highlight();maybeStartExhibition();}
if(exhibition){
 const startupRetry=setInterval(()=>{if(exhibitionStarted){clearInterval(startupRetry);return;}if(map.isStyleLoaded())exhibitionMapReady=true;maybeStartExhibition();},250);
 setTimeout(()=>{exhibitionReady=true;maybeStartExhibition();},3500);
 for(const handler of ['dragPan','scrollZoom','boxZoom','dragRotate','doubleClickZoom','touchZoomRotate','keyboard'])map[handler]?.disable();
 document.addEventListener('keydown',e=>{if(e.code==='Space'&&e.target===document.body&&mode==='tour'){e.preventDefault();playing?pauseTour():playTour();}});
 setTimeout(()=>{const loading=document.getElementById('v2-exhibition-loading');if(loading)loading.textContent='Still loading the network. Check the connection or reload.';},25000);
}
})();