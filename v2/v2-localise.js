/* V2-only language adapter: follows the existing V1 language picker and translations.
   Only the V2 subtree is changed; official partner names remain untouched. */
(function(){
'use strict';
const root=document.getElementById('v2-root');
const picker=document.getElementById('language-select');
const dictionary=window.SDCA_V2_I18N;
const base=window.SDCA_V2_BRIDGE;
if(!root||!picker||!dictionary)return;
const lang=()=>picker.value||'en';
const t=(key,vars={})=>dictionary.translate(lang(),key,vars);
const native=(key)=>typeof base?.translate==='function'?base.translate(key):null;
const number=n=>{
 try{return new Intl.NumberFormat(lang()==='ms-Arab'?'ms':lang()).format(n);}
 catch(e){return String(n);}
};
const iso={
 'United Kingdom':'GB','United States':'US','Denmark':'DK','Germany':'DE',
 'France':'FR','Italy':'IT','Japan':'JP','Netherlands':'NL','Sweden':'SE',
 'Norway':'NO','Finland':'FI','Canada':'CA','Australia':'AU','Singapore':'SG',
 'Hong Kong':'HK','Turkey':'TR','Türkiye':'TR','Spain':'ES','China':'CN',
 'India':'IN','South Korea':'KR','Ireland':'IE','Belgium':'BE','Poland':'PL'
};
const region=(name)=>{
 if(lang()==='en'||!iso[name])return name;
 try{return new Intl.DisplayNames([lang()==='ms-Arab'?'ms':lang()],{type:'region'}).of(iso[name])||name;}
 catch(e){return name;}
};
const staticText={
 'Top 50 in the world for Art and Design':'ranking',
 'Top 50 in the world for Art and Design · QS 2026':'ranking',
 'QS World University Rankings by Subject 2026':'rankSource',
 'Exchange universities':'universityPartners',
 'Employers & placements':'employerPlacements',
 'Featured Partners':'featured',
 'Featured partners':'featured',
 'featured partners':'featured',
 'View all 50':'viewAll',
 'Global employers':'employers',
 'Design studios':'studios',
 'Universities':'universities',
 'Employers':'employers',
 'Studios':'studios',
 'University':'universities',
 'Global employer':'globalEmployer',
 'Design studio':'designStudio',
 'Exchange university':'exchangeUniversity',
 'Category':'category',
 'Relationship':'relationship',
 'Academic exchange':'academicExchange',
 'Programmes':'programmes',
 'Placement years':'placementYears',
 'Exchange years':'exchangeYears',
 'City and country unavailable':'cityUnavailable',
 'No matching partners found.':'noMatches',
 'Loading the worldwide directory…':'loadingDirectory',
 'Print / Save PDF':'printPdf',
 'Download PDF':'printPdf',
 '50 organisations our students and staff work with':'directoryTitle',
 'Partner names and locations follow the school’s published directory. Locations marked unverified are not plotted.':'directoryNote',
 'Exit tour':'exitTour',
 'Exit guided tour':'exitTour',
 'Pauses on interaction · arrow keys to step':'tourHint',
 'Flying to partner…':'flying',
 'Next partner in':'nextIn',
 'Featured connection with the School of Design and Creative Arts.':'connectionDesc',
 'Years not recorded':'yearsUnknown',
 'Not available':'unavailable',
 'Resume tour':'resume',
 'Pause tour':'pause',
 'Return to map':'backMap',
 'Back to map':'backMap',
 'Next':'next',
 'Previous':'previous',
 'Worldwide partner search results':'searchResults',
 'Map marker colours':'mapColours',
 'Global network figures':'networkFigures',
 'Featured partner details':'partnerDetails',
 'Search all partners worldwide':'searchWorldwide',
 'Search partners':'searchWorldwide',
 'Search partners and places worldwide':'searchWorldwide',
 '50 featured partners':'featuredCount',
 '50 organisations':'directoryTitle',
 'placement hosts':'hosts',
 'exchange universities':'universityPartners',
 'featured partners':'featured',
 'SDCA Student Placement':'studentPlacement',
 'Student placement':'studentPlacement',
 'Student Placement':'studentPlacement',
 'Exchange Programme':'exchangeProgramme',
 'Search partners worldwide':'searchWorldwide',
 'Minimise panel':'backMap',
 // Additional mobile, tour and partner-card interface strings.
 'Explore partners':'explorePartners',
 'Close partners':'closePartners',
 'Expand partner panel':'expandPartners',
 'Collapse partner panel':'collapsePartners',
 'Visit website ↗':'visitWebsite',
 'Next stop in':'nextStopIn',
 'Time until the next partner':'timeUntilNext',
 'Previous partner':'previousPartner',
 'Next partner':'nextPartner',
 'Featured partner categories':'featuredCategories',
 'QS World Rank · 2027':'qsRank',
 'View QS Art and Design subject rankings (opens in a new tab)':'qsLink',
 'Partner':'partnerLabel'
};
function translateString(str,element){
 const value=String(str||'').trim().replace(/\s+/g,' ');
 if(!value||lang()==='en')return str;
 const attr=(element&&element.nodeType===1)?element:null;
 const nativeWords={
  'Student placement':native('placementSing'),
  'Student Placement':native('placementSing'),
  'SDCA Student Placement':(native('placementSing')||'Student placement')+' (SDCA)',
  'Exchange Programme':native('exchangeSing')
 };
 if(nativeWords[value])return nativeWords[value];
 if(value==='Top 50 in the world for Art and Design · QS 2026')return t('ranking')+' · QS 2026';
 if(value==='★ Featured partner'||value==='★ Featured Partner')return '★ '+t('featured');
 if(value==='★ Featured Partners')return '★ '+t('featured');
 if(value==='Featured partner')return t('featured');
 if(value==='Selected partner')return t('selectedPartner',{name:''}).replace(/[:：]\s*$/,'');
 if(value==='SDCSA Exchange programme partner')return base?.localDescription?.({description:value})?.text||str;
 if(value==='QS World Rank · 2027')return t('qsRank');
 let match;
 if((match=/^Search all ([\d,\s.]+) partners and places$/.exec(value)))
   return t('searchWorldwide',{count:number(Number(match[1].replace(/[\s,]/g,'')))});
 if(value==='Search partners and places worldwide'||value==='Search partners worldwide'||value==='Search all partners worldwide')
   return t('searchWorldwide',{count:'…'});
 if((match=/^View all (\d+)$/.exec(value)))return t('viewAll',{count:number(Number(match[1]))});
 if((match=/^Take the tour: (\d+) featured partners$/.exec(value)))return t('takeTour',{count:number(Number(match[1]))});
 if((match=/^(\d+) featured partners$/.exec(value)))return t('featuredCount',{count:number(Number(match[1]))});
 if((match=/^(\d+) placement hosts$/.exec(value)))return t('hosts',{count:number(Number(match[1]))});
 if((match=/^(Employers|Studios|Universities) (\d+)$/.exec(value)))
   return t({Employers:'employers',Studios:'studios',Universities:'universities'}[match[1]])+' '+number(Number(match[2]));
 if((match=/^(Global employers|Design studios|Universities) · (\d+)$/.exec(value)))
   return t({'Global employers':'employers','Design studios':'studios','Universities':'universities'}[match[1]])+' · '+number(Number(match[2]));
 if((match=/^Featured partner (\d+) of (\d+)(?: ·)?$/.exec(value)))
   return t('featuredPosition',{index:number(Number(match[1])),total:number(Number(match[2]))})+(value.endsWith('·')?' ·':'');
 if(value==='Next featured partner →')return t('next')+' '+t('featured')+' →';
 if((match=/^Map marker for (.+)$/.exec(value)))return t('markerFor',{name:match[1]});
  if((match=/^Visit (.+) website \(opens in a new tab\)$/.exec(value)))
    return t('visitNamedSite',{name:match[1]});
  if((match=/^(.+) QS World University Rankings 2027: (.+) \(opens in a new tab\)$/.exec(value)))
    return match[1]+' · '+t('qsRank')+': '+match[2];
  if((match=/^Visit (.+) website ↗$/.exec(value)))return t('visitNamedSite',{name:match[1]});
 if((match=/^Visit (.+) →$/.exec(value)))return t('website',{host:match[1]});
 if((match=/^Stop (\d+) of (\d+)$/.exec(value)))
   return t('stopPosition',{index:number(Number(match[1])),total:number(Number(match[2]))});
 if((match=/^Next: (.+)$/.exec(value)))return t('next')+': '+match[1];
 if(value==='Paused · next partner in')return t('pause')+' · '+t('nextIn');
 if((match=/^(\d+)s$/.exec(value))){
   try{return new Intl.NumberFormat(lang()==='ms-Arab'?'ms':lang(),{style:'unit',unit:'second',unitDisplay:'narrow'}).format(Number(match[1]));}
   catch(e){return value;}
 }
 if((match=/^SDCA placement and exchange records · updated (.+)$/.exec(value))){
   let date=match[1];
   try{date=new Intl.DateTimeFormat(lang()==='ms-Arab'?'ms':lang(),{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date('2026-11-18T12:00:00Z'));}
   catch(e){}
   return t('updated',{date});
 }
 if((match=/^Selected partner: (.+)$/.exec(value)))return t('selectedPartner',{name:match[1]});
 if(value==='Loughborough Global Creative Network')return native('title')||value;
 if(value==='School of Design and Creative Arts')return native('school')||value;
 if(value==='Connecting world-leading creativity, education and industry.')return native('summary')||value;
 if(value==='Search partners by name'||value==='Search partners')return native('searchButton')||value;
 if(value==='Visit Loughborough University website (opens in a new tab)')
   return t('visitNamedSite',{name:'Loughborough University'});
 if(value==='50')return str; // Numbers and official names never change by accident.
 if(attr&&attr.classList?.contains('v2-tour-country'))return region(value);
 if((match=/^(.+), (United Kingdom|United States|Denmark|Germany|France|Italy|Japan|Netherlands|Sweden|Norway|Finland|Canada|Australia|Singapore|Hong Kong|Turkey|Spain|China|India|South Korea|Ireland|Belgium|Poland)$/.exec(value)))
   return match[1]+', '+region(match[2]);
 // Marker keys and organisation names are not changed.
 const key=staticText[value];
 if(!key)return str;
 if(key==='studentPlacement')return native('placementSing')||str;
 if(key==='exchangeProgramme')return native('exchangeSing')||str;
 if(key==='viewAll')return t('viewAll',{count:50});
 if(key==='featuredCount')return t('featuredCount',{count:''}).trim();
 if(key==='hosts')return t('hosts',{count:''}).trim();
 if(key==='searchWorldwide')return t('searchWorldwide',{count:'…'});
 return t(key);
}
const remembered=new WeakMap();
const leading=str=>str.match(/^\s*/)?.[0]||'';
const trailing=str=>str.match(/\s*$/)?.[0]||'';
function applyText(node){
 if(!node||node.nodeType!==3)return;
 const current=node.nodeValue||'';
 // Never translate official names in partner lists, selected cards or search results.
 if(node.parentElement?.matches('.v2-tile strong,.v2-dir-row strong,.v2-search-result > span,#v2-tour-name,#v2-spotlight > h2')){
  remembered.set(node,{source:current,rendered:current});
  return;
 }
 let entry=remembered.get(node);
 if(!entry||current!==entry.rendered)entry={source:current,rendered:current};
 const src=entry.source;
 const normalized=src.trim().replace(/\s+/g,' ');
 if(!normalized){remembered.set(node,entry);return;}
 const changed=translateString(normalized,node.parentElement);
 const translated=changed===normalized?src:leading(src)+changed+trailing(src);
 if(translated!==current)node.nodeValue=translated;
 remembered.set(node,{source:src,rendered:translated});
}
const attrs=new WeakMap();
function applyAttributes(element){
 if(!element||element.nodeType!==1)return;
 for(const attrName of ['aria-label','title','placeholder']){
  if(!element.hasAttribute(attrName))continue;
  const original=element.getAttribute(attrName)||'';
  let record=attrs.get(element);
  if(!record){record={};attrs.set(element,record);}
  let entry=record[attrName];
  if(!entry||entry.rendered!==original)entry={source:original,rendered:original};
  const translated=translateString(entry.source,element);
  const next=translated===entry.source?entry.source:translated;
  if(next!==original)element.setAttribute(attrName,next);
  record[attrName]={source:entry.source,rendered:next};
 }
}
const knownTitleSelectors=[
 ['#v2-home .v2-h1','title'],
 ['#v2-mobile-nav strong','title'],
 ['#v2-compact-header strong','title'],
 ['#v2-tour-header strong','title'],
 ['#v2-home .v2-overline','school'],
 ['#v2-home .v2-subtitle','summary']
];
let observer=null,scheduled=false;
function applyAll(){
 root.lang=lang();
 root.dir=['ar','ur','ms-Arab'].includes(lang())?'rtl':'ltr';
 // V2 title is split with a <br>; use the complete translations already in V1.
 for(const [selector,key] of knownTitleSelectors){
  const el=root.querySelector(selector);
  const translated=native(key);
  if(!el||!translated)continue;
  if(key==='title'&&lang()==='en'&&
     (selector==='#v2-home .v2-h1'||selector==='#v2-mobile-nav strong')){
   const original='Loughborough Global<br>Creative Network';
   if(el.innerHTML!==original)el.innerHTML=original;
  }else if(el.textContent!==translated)el.textContent=translated;
 }
 const iterator=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
 const texts=[];while(iterator.nextNode())texts.push(iterator.currentNode);
 for(const node of texts)applyText(node);
 applyAttributes(root);
 root.querySelectorAll('*').forEach(applyAttributes);
}
function schedule(){
 if(scheduled)return;
 scheduled=true;
 queueMicrotask(()=>{scheduled=false;applyAll();});
}
observer=new MutationObserver(()=>schedule());
observer.observe(root,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['title','placeholder','aria-label']});
picker.addEventListener('change',applyAll);
applyAll();
})();
