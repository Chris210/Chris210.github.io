/* Loughborough Global Creative Network V2 — editorial country-audience relevance.
 * NOT QS data, QS survey results, a league table or an inference about any individual voter.
 * This ranking uses confirmed source-backed academic/QS evidence, partner case studies,
 * documented location, and explicitly CURATED country-market recognition priorities.
 * Never change which organisations are featured, or write this score to the dataset.
 * Review country preferences with local academic and creative-industry contacts.
 */
(function(){
'use strict';
const normalise=value=>String(value||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'')
 .toLowerCase().replace(/&/g,' and ').replace(/[^a-z0-9]+/g,' ').trim();
const C={
 JP:['Joshibi University of Art and Design','Shibaura Institute of Technology','Kansai University','Adobe','LEGO','The Walt Disney Company','BMW','Dyson','Politecnico di Milano','Delft University of Technology (TU Delft)'],
 CN:['Central Academy of Fine Arts (CAFA)','Tongji University','China Academy of Art (CAA)','Politecnico di Milano','Delft University of Technology (TU Delft)','Adobe','BMW','Louis Vuitton','LEGO','Dyson'],
 TW:['Nanyang Technological University','City University of Hong Kong','Shibaura Institute of Technology','Delft University of Technology (TU Delft)','Adobe','LEGO','BMW','Dyson'],
 IN:['Indian Institute of Technology Bombay (IIT Bombay)','Adobe','IBM','Dyson','Unilever','BMW','LEGO','Delft University of Technology (TU Delft)','Politecnico di Milano'],
 SA:['Princess Nourah bint Abdulrahman University (PNU)','Middle East Technical University (METU)','Adobe','BMW','The Walt Disney Company','LEGO','Politecnico di Milano','Delft University of Technology (TU Delft)'],
 HK:['City University of Hong Kong','Nanyang Technological University','Central Academy of Fine Arts (CAFA)','Tongji University','Adobe','LEGO','Delft University of Technology (TU Delft)'],
 SG:['Nanyang Technological University','Dyson','Adobe','IBM','LEGO','BMW','Delft University of Technology (TU Delft)'],
 IT:['Politecnico di Milano','Mimar Sinan Fine Arts University','Louis Vuitton','Iris van Herpen','BMW','Adobe','Delft University of Technology (TU Delft)'],
 NL:['Delft University of Technology (TU Delft)','Iris van Herpen','Politecnico di Milano','BMW','Adobe','LEGO'],
 DE:['BMW','Adidas','RheinMain University of Applied Sciences','Politecnico di Milano','Delft University of Technology (TU Delft)','Adobe','LEGO'],
 FR:['Louis Vuitton','L’Oréal','Politecnico di Milano','Delft University of Technology (TU Delft)','Adobe','Iris van Herpen'],
 DK:['Design School Kolding','LEGO','Jacob Jensen Design','Delft University of Technology (TU Delft)','Politecnico di Milano'],
 SE:['Form Us With Love','Design School Kolding','Iris van Herpen','LEGO','Adobe'],
 FI:['Academy of Fine Arts, Helsinki','Design School Kolding','Adobe','LEGO'],
 NO:['Norwegian University of Science and Technology (NTNU)','Design School Kolding','LEGO','Adobe'],
 US:['University of Michigan','Adobe','The Walt Disney Company','IBM','LEGO','BMW','Politecnico di Milano','Delft University of Technology (TU Delft)'],
 GB:['Dyson','McLaren','Burberry','Jaguar Land Rover','PriestmanGoode','LEGO','Politecnico di Milano','Delft University of Technology (TU Delft)','Adobe'],
 AU:['University of Technology Sydney','Adobe','Dyson','LEGO','The Walt Disney Company','Delft University of Technology (TU Delft)'],
 CA:['Université de Montréal','Adobe','IBM','The Walt Disney Company','Politecnico di Milano'],
 TR:['Middle East Technical University (METU)','Mimar Sinan Fine Arts University','BMW','Adobe'],
 AE:['Princess Nourah bint Abdulrahman University (PNU)','Adobe','BMW','The Walt Disney Company','Politecnico di Milano']
};
const aliases={
 'japan':'JP','china':'CN','mainland china':'CN','people s republic of china':'CN',
 'taiwan':'TW','hong kong':'HK','hong kong sar china':'HK','hong kong sar':'HK',
 'india':'IN','saudi arabia':'SA','kingdom of saudi arabia':'SA',
 'singapore':'SG','italy':'IT','netherlands':'NL','germany':'DE','france':'FR',
 'denmark':'DK','sweden':'SE','finland':'FI','norway':'NO','united states':'US',
 'united states of america':'US','usa':'US','us':'US','united kingdom':'GB',
 'great britain':'GB','uk':'GB','england':'GB','scotland':'GB','wales':'GB',
 'australia':'AU','canada':'CA','turkey':'TR','turkiye':'TR','united arab emirates':'AE',
 'new zealand':'NZ','ireland':'IE','south korea':'KR','republic of korea':'KR'
};
const listKeys=Object.fromEntries(Object.entries(C).map(([code,names])=>[
 code,new Map(names.map((name,index)=>[normalise(name),index]))
]));
function countryCode(value){
 const raw=String(value||'').trim();
 if(/^[A-Z]{2}$/.test(raw))return raw;
 const norm=normalise(raw);
 if(aliases[norm])return aliases[norm];
 if(norm.includes('hong kong'))return 'HK';
 return null;
}
function visitorCountry(){
 const query=new URLSearchParams(window.location.search).get('audience');
 const override=countryCode(query);
 return override||countryCode(window.__sdcaV2IpCountryCode);
}
function featureCountry(feature){
 const p=feature?.properties||{};
 const direct=[p.country_name,p.country,p.country_code,p.iso_country,p.iso2].map(countryCode).find(Boolean);
 if(direct)return direct;
 const location=String(p.location||p.address_verified||'');
 if(location&&!location.includes('|'))return countryCode(location.split(',').at(-1));
 return null;
}
// Nearby lists use the country where the majority of records are located; the
// worldwide lists use the audience's country instead. No GPS or new IP requests.
function contextCountry(features){
 const sample=(features||[]).slice(0,300);
 const tally=new Map();
 for(const f of sample){
  const code=featureCountry(f);
  if(code)tally.set(code,(tally.get(code)||0)+1);
 }
 const main=[...tally].sort((a,b)=>b[1]-a[1])[0];
 return main&&main[1]>=3&&main[1]>=sample.length*.65?main[0]:visitorCountry();
}
const ordinal=r=>{
 const m=String(r?.rank||'').trim().match(/^#?=?(\d+)/);
 return m?Number(m[1]):null;
};
function caseEvidence(item,feature){
 const name=normalise(item?.name||feature?.properties?.name),id=String(feature?.id??'');
 const list=window.SDCA_V2_CASE_STUDY_DATA?.partners||[];
 const record=list.find(p=>(p.featureIds||[]).some(x=>String(x)===id)||
  [p.name,...(p.aliases||[])].some(x=>normalise(x)===name));
 const cases=record?.cases||[];
 if(!cases.length)return 0;
 const specific=cases.filter(c=>!/university.wide|related group|not sdca.specific/i.test(String(c.relationship||'')));
 return specific.length?Math.min(28,19+specific.length*3):9;
}
function score(item,feature,country,index=50){
 const code=countryCode(country),name=normalise(item?.name||feature?.properties?.name);
 const group=item?.group||'';
 // Art & Design reputation is primarily an academic peer question. For all
 // organisations, evidence of actual collaboration is stronger than name alone.
 let value=group==='academic'?65:group==='design'?43:35;
 if(group==='academic'){
  const data=window.SDCA_V2_QS_RANKINGS?.lookup(item?.name,feature?.id);
  const subject=ordinal(data?.art_design),overall=ordinal(data?.overall);
  if(subject&&subject>0)value+=Math.round(37*Math.exp(-(subject-1)/90));
  else if(overall&&overall>0)value+=Math.round(12*Math.exp(-(overall-1)/190));
 }
 value+=caseEvidence(item,feature);
 // Preserve the existing research-led global shortlist as a weak tie-breaker.
 value+=Math.max(0,50-index)*.16;
 if(!code)return value;
 // Genuine domestic proximity is a relevant but not decisive trust cue.
 if(featureCountry(feature)===code)value+=group==='academic'?31:21;
 const priority=listKeys[code]?.get(name);
 if(priority!==undefined)value+=Math.max(13,61-priority*5);
 return value;
}
function sort(items,findFeature,country){
 const code=countryCode(country)||visitorCountry();
 // Without a detected country, retain the site's approved global editorial order.
 if(!code)return items.slice();
 return items.map((item,index)=>({item,index,score:score(item,findFeature(item),code,index)}))
  .sort((a,b)=>b.score-a.score||a.index-b.index).map(x=>x.item);
}
function sortFeatures(features,featured,country){
 const code=countryCode(country)||contextCountry(features);
 const matches=(featured||[]).map(item=>[item,[item.name,...(item.aliases||[])].map(normalise)]);
 return (features||[]).map((feature,index)=>{
  const n=normalise(feature?.properties?.name);
  const found=matches.find(([,names])=>names.some(a=>n===a||(a.length>=4&&n.startsWith(a+' '))));
  const curated=found?(featured||[]).indexOf(found[0]):-1;
  return {feature,index,curated,score:curated>=0?score(found[0],feature,code,curated):-Infinity};
 }).sort((a,b)=>Number(b.curated>=0)-Number(a.curated>=0)||
  b.score-a.score||a.index-b.index||
  String(a.feature.properties?.name||'').localeCompare(String(b.feature.properties?.name||'')))
  .map(row=>row.feature);
}
window.SDCA_V2_REPUTATION=Object.freeze({visitorCountry,featureCountry,contextCountry,score,sort,sortFeatures,marketCodes:Object.freeze(Object.keys(C))});
})();