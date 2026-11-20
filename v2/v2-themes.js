/* V2-only themes: visible topic chips and searchable topic vocabulary. */
(function(){
'use strict';
const data=window.SDCA_V2_THEME_DATA;
if(!data||!Array.isArray(data.entries)||!Array.isArray(data.themes))return;
const normalise=value=>String(value??'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/&/g,' and ').replace(/[^a-z0-9]+/g,' ').trim();
const byId=new Map(),byName=new Map();
for(const entry of data.entries){
 const row={id:String(entry[0]),name:entry[1],tags:entry[2].map(index=>data.themes[index]).filter(Boolean),basis:entry[3],source:entry[4]};
 byId.set(row.id,row);
 const key=normalise(row.name);
 if(!byName.has(key))byName.set(key,row);
}
const synonyms={
 'Inclusive Design':['accessibility','universal design','co design','human factors','ergonomics','social inclusion'],
 'UX & Interaction Design':['ux','ui','user experience','usability','interaction','human computer interaction','human centred','human centered','user research'],
 'Sustainability & Circularity':['sustainability','circular','environment','climate','recycling','green design','responsible design'],
 'Design for Health':['healthcare','wellbeing','medical design','health technology','patient','assistive technology'],
 'Creative Heritage & Culture':['heritage','museum','culture','archives','conservation','graphic heritage'],
 'Product & Industrial Design':['industrial design','product design','engineering design','prototyping','manufacturing'],
 'Digital & Emerging Technology':['artificial intelligence','ai','digital','innovation','robotics','virtual reality','3d printing'],
 'Visual Communication & Branding':['graphic design','visual identity','brand','advertising','communication','marketing','typography','packaging'],
 'Fashion & Textiles':['fashion','textiles','apparel','clothing','footwear','embroidery'],
 'Architecture & Environments':['architecture','interior','built environment','urban','spatial','furniture'],
 'Mobility & Transport':['transport','automotive','vehicle','aviation','rail','mobility'],
 'Service & Social Innovation':['service design','social design','design strategy','public policy','community','innovation'],
 'Arts & Creative Practice':['art','creative arts','fine art','craft','ceramics','exhibition','creative practice'],
 'Media & Entertainment':['film','animation','gaming','games','entertainment','media','music'],
 'Design Education & Research':['design education','teaching','research','pedagogy','academic exchange','design thinking'],
 'Sport & Leisure':['sport','sports','fitness','recreation','play','leisure','outdoor']
};
const get=feature=>{
 if(!feature)return null;
 const p=feature.properties||{};
 for(const id of [feature.id,p.feature_id,p.partner_id,p.id])if(id!==null&&id!==undefined&&byId.has(String(id)))return byId.get(String(id));
 return byName.get(normalise(p.name||feature.name))||null;
};
const themeMatches=(label,term)=>{
 const q=normalise(term);if(!q)return false;
 if(normalise(label).includes(q))return true;
 return (synonyms[label]||[]).some(s=>normalise(s)===q||(q.length>=3&&normalise(s).includes(q)));
};
const matchingTags=(feature,q)=>{
 const record=get(feature);return record?record.tags.filter(tag=>themeMatches(tag,q)):[];
};
const matches=(feature,q)=>matchingTags(feature,q).length>0;
const isProvisional=record=>record&&!/^(case_study|case_study_university_wide|official_design_school)$/.test(record.basis);
const render=(feature)=>{
 const record=get(feature);if(!record||record.tags.length!==3)return null;
 const wrap=document.createElement('section');wrap.className='gcn-themes';wrap.setAttribute('aria-label','Partner themes');
 const label=document.createElement('p');label.className='gcn-themes-label';
 label.textContent=record.basis.startsWith('case_study')?'Themes from published evidence':'Areas of expertise and interest';
 wrap.append(label);
 const chips=document.createElement('div');chips.className='gcn-theme-chips';
 for(const tag of record.tags){const chip=document.createElement('span');chip.className='gcn-theme-chip';chip.textContent=tag;chip.lang='en';chips.append(chip);}
 wrap.append(chips);
 if(isProvisional(record)){
  const note=document.createElement('p');note.className='gcn-themes-note';
  note.textContent='Suggested themes; individual source review pending.';
  wrap.append(note);
 }
 return wrap;
};
window.SDCA_V2_THEMES=Object.freeze({
 version:1,themeCount:data.themes.length,recordCount:byId.size,
 get,forFeature:feature=>get(feature)?.tags||[],
 matches,matchingTags,render,
 matchCount:(features,term)=>features.filter(feature=>matches(feature,term)).length
});
})();
