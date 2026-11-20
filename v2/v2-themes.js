/* V2-only themes: visible topic chips and searchable topic vocabulary. */
(function(){
'use strict';
const data=window.SDCA_V2_THEME_DATA;
if(!data||!Array.isArray(data.entries)||!Array.isArray(data.themes))return;
const normalise=value=>String(value??'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/&/g,' and ').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
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

/* Display translations preserve the same sixteen canonical English categories. */
const translated={
 'zh-CN':['包容性设计','用户体验与交互设计','可持续与循环设计','健康设计','创意遗产与文化','产品与工业设计','数字与新兴技术','视觉传达与品牌','时尚与纺织','建筑与环境','出行与交通','服务与社会创新','艺术与创意实践','媒体与娱乐','设计教育与研究','体育与休闲'],
 'zh-TW':['共融設計','使用者體驗與互動設計','永續與循環設計','健康設計','創意文化遺產','產品與工業設計','數位與新興科技','視覺傳達與品牌','時尚與紡織','建築與環境','交通與移動','服務與社會創新','藝術與創意實踐','媒體與娛樂','設計教育與研究','運動與休閒'],
 ja:['インクルーシブデザイン','UX・インタラクションデザイン','サステナビリティと循環設計','ヘルスケアデザイン','文化遺産と文化','プロダクト・工業デザイン','デジタル・先端技術','ビジュアルコミュニケーションとブランディング','ファッション・テキスタイル','建築と環境','モビリティと交通','サービス・社会イノベーション','芸術と創作活動','メディアとエンターテインメント','デザイン教育と研究','スポーツとレジャー'],
 ar:['التصميم الشامل','تجربة المستخدم والتصميم التفاعلي','الاستدامة والتصميم الدائري','التصميم من أجل الصحة','التراث الإبداعي والثقافة','تصميم المنتجات والتصميم الصناعي','التقنيات الرقمية والناشئة','الاتصال البصري والعلامات التجارية','الأزياء والمنسوجات','العمارة والبيئات','التنقل والنقل','تصميم الخدمات والابتكار الاجتماعي','الفنون والممارسة الإبداعية','الإعلام والترفيه','تعليم التصميم والبحث','الرياضة والترفيه'],
 hi:['समावेशी डिज़ाइन','उपयोगकर्ता अनुभव और इंटरैक्शन डिज़ाइन','स्थिरता और परिपत्र डिज़ाइन','स्वास्थ्य के लिए डिज़ाइन','रचनात्मक विरासत और संस्कृति','उत्पाद और औद्योगिक डिज़ाइन','डिजिटल और उभरती तकनीक','दृश्य संचार और ब्रांडिंग','फ़ैशन और वस्त्र','वास्तुकला और पर्यावरण','गतिशीलता और परिवहन','सेवा और सामाजिक नवाचार','कला और रचनात्मक अभ्यास','डिज़ाइन शिक्षा और अनुसंधान','खेल और अवकाश']
};
const headings={
 en:['Themes','Themes','Suggested themes; individual source review pending.'],
 'zh-CN':['主题','主题','建议主题；仍需核查机构的官方资料。'],
 'zh-TW':['主題','主題','建議主題；仍需核對機構的官方資料。'],
 ja:['テーマ','テーマ','暫定的なテーマです。公式情報の確認が必要です。'],
 ar:['الموضوعات','الموضوعات','موضوعات مقترحة؛ يلزم مراجعة المصدر الرسمي.'],
 hi:['विषय','विषय','सुझाए गए विषय; आधिकारिक स्रोत की समीक्षा लंबित है।']
};
const locale=()=>document.getElementById('language-select')?.value||'en';
const displayLabel=(tag,lang=locale())=>{
 const index=data.themes.indexOf(tag);
 return index<0?tag:(translated[lang]?.[index]||tag);
};

const get=feature=>{
 if(!feature)return null;
 const p=feature.properties||{};
 for(const id of [feature.id,p.feature_id,p.partner_id,p.id])if(id!==null&&id!==undefined&&byId.has(String(id)))return byId.get(String(id));
 return byName.get(normalise(p.name||feature.name))||null;
};
const themeMatches=(label,term)=>{
 const q=normalise(term);if(!q)return false;
 if([label,...Object.values(translated).map(list=>list[data.themes.indexOf(label)])].some(s=>s&&normalise(s).includes(q)))return true;
 return (synonyms[label]||[]).some(s=>normalise(s)===q||(q.length>=3&&normalise(s).includes(q)));
};
const matchingTags=(feature,q)=>{
 const record=get(feature);return record?record.tags.filter(tag=>themeMatches(tag,q)):[];
};
const matches=(feature,q)=>matchingTags(feature,q).length>0;
const isProvisional=record=>record&&!/^(case_study|case_study_university_wide|official_design_school|official_organisation)$/.test(record.basis);
const render=(feature)=>{
 const record=get(feature);if(!record||record.tags.length!==3)return null;
 const wrap=document.createElement('section');wrap.className='gcn-themes';wrap.setAttribute('aria-label','Partner themes');
 const lang=locale(),words=headings[lang]||headings.en;wrap.lang=lang;wrap.dir=lang==='ar'?'rtl':'auto';
 const label=document.createElement('p');label.className='gcn-themes-label';
 label.textContent=record.basis.startsWith('case_study')?words[0]:words[1];
 wrap.append(label);
 const chips=document.createElement('div');chips.className='gcn-theme-chips';
 for(const tag of record.tags){const chip=document.createElement('span');chip.className='gcn-theme-chip';chip.textContent=displayLabel(tag,lang);chip.lang=lang;chips.append(chip);}
 wrap.append(chips);
 if(isProvisional(record)){
  const note=document.createElement('p');note.className='gcn-themes-note';
  note.textContent=words[2];
  wrap.append(note);
 }
 return wrap;
};
window.SDCA_V2_THEMES=Object.freeze({
 version:1,themeCount:data.themes.length,recordCount:byId.size,
 get,forFeature:feature=>get(feature)?.tags||[],
 displayForFeature:feature=>(get(feature)?.tags||[]).map(tag=>displayLabel(tag)),
 displayLabel,
 matches,matchingTags,render,
 matchCount:(features,term)=>features.filter(feature=>matches(feature,term)).length
});
})();
