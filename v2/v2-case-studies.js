/* V2-only runtime: exact-match case-study actions shared by native map, spotlight and tour.
   Publication data lives separately in case-studies-data.js so monthly updates need no UI code edits. */
(function(){
'use strict';
const data=window.SDCA_V2_CASE_STUDY_DATA;
if(!data||!Array.isArray(data.partners))return;

const TEXT={
 en:['Explore the research','See the creative work','Read the placement story','Explore the exchange','Explore the project','opens in a new tab'],
 'zh-CN':['探索相关研究','查看创意作品','阅读实习经历','了解交流项目','查看项目成果','在新标签页中打开'],
 'zh-TW':['探索相關研究','欣賞創意作品','閱讀實習經歷','了解交流計畫','查看專案成果','在新分頁中開啟'],
 ja:['研究内容を見る','創作作品を見る','実習体験を読む','交流プログラムを見る','プロジェクトを見る','新しいタブで開きます'],
 ko:['연구 내용 살펴보기','창작 작품 보기','현장 실습 사례 읽기','교류 프로그램 살펴보기','프로젝트 살펴보기','새 탭에서 열림'],
 ms:['Terokai penyelidikan','Lihat karya kreatif','Baca kisah latihan industri','Terokai program pertukaran','Terokai projek','dibuka dalam tab baharu'],
 'ms-Arab':['ليهت ڤڽليديقن','ليهت کاريا کرياتيف','باچ چريتا لاتيهن ايندوستري','ليهت ڤروݢرم ڤرتوقرن','ليهت ڤروجيک','دبوک دالم تاب بهارو'],
 hi:['शोध देखें','रचनात्मक कार्य देखें','इंटर्नशिप का अनुभव पढ़ें','विनिमय कार्यक्रम देखें','परियोजना देखें','नए टैब में खुलता है'],
 pa:['ਖੋਜ ਵੇਖੋ','ਰਚਨਾਤਮਕ ਕੰਮ ਵੇਖੋ','ਇੰਟਰਨਸ਼ਿਪ ਦਾ ਅਨੁਭਵ ਪੜ੍ਹੋ','ਐਕਸਚੇਂਜ ਪ੍ਰੋਗਰਾਮ ਵੇਖੋ','ਪ੍ਰੋਜੈਕਟ ਵੇਖੋ','ਨਵੀਂ ਟੈਬ ਵਿੱਚ ਖੁੱਲ੍ਹਦਾ ਹੈ'],
 bn:['গবেষণা দেখুন','সৃজনশীল কাজ দেখুন','ইন্টার্নশিপের অভিজ্ঞতা পড়ুন','বিনিময় কর্মসূচি দেখুন','প্রকল্পটি দেখুন','নতুন ট্যাবে খুলবে'],
 gu:['સંશોધન જુઓ','સર્જનાત્મક કાર્ય જુઓ','ઇન્ટર્નશિપનો અનુભવ વાંચો','વિનિમય કાર્યક્રમ જુઓ','પ્રોજેક્ટ જુઓ','નવી ટેબમાં ખુલશે'],
 ta:['ஆராய்ச்சியைக் காண்க','படைப்புப் பணிகளைக் காண்க','பயிற்சி அனுபவத்தை வாசிக்கவும்','பரிமாற்றத் திட்டத்தை அறிக','திட்டத்தைப் பார்க்கவும்','புதிய தாவலில் திறக்கும்'],
 te:['పరిశోధనను చూడండి','సృజనాత్మక పనిని చూడండి','ఇంటర్న్‌షిప్ అనుభవాన్ని చదవండి','మార్పిడి కార్యక్రమాన్ని చూడండి','ప్రాజెక్ట్‌ను చూడండి','కొత్త ట్యాబ్‌లో తెరుచుకుంటుంది'],
 mr:['संशोधन पाहा','सर्जनशील काम पाहा','इंटर्नशिपचा अनुभव वाचा','विनिमय कार्यक्रम पाहा','प्रकल्प पाहा','नवीन टॅबमध्ये उघडते'],
 ur:['تحقیق دیکھیے','تخلیقی کام دیکھیے','انٹرن شپ کا تجربہ پڑھیے','تبادلہ پروگرام دیکھیے','منصوبہ دیکھیے','نئے ٹیب میں کھلتا ہے'],
 ne:['अनुसन्धान हेर्नुहोस्','सिर्जनात्मक काम हेर्नुहोस्','इन्टर्नशिपको अनुभव पढ्नुहोस्','आदानप्रदान कार्यक्रम हेर्नुहोस्','परियोजना हेर्नुहोस्','नयाँ ट्याबमा खुल्छ'],
 ar:['استكشف البحث','شاهد الأعمال الإبداعية','اقرأ تجربة التدريب','استكشف برنامج التبادل','استكشف المشروع','يُفتح في علامة تبويب جديدة']
};
const KEYS=['caseResearch','caseCreative','casePlacement','caseExchange','caseProject','caseNewTab'];
const i18n=window.SDCA_V2_I18N;
if(i18n){
 for(const [language,terms] of Object.entries(TEXT)){
  const target=language==='en'?i18n.en:i18n.locales?.[language];
  if(!target)continue;
  KEYS.forEach((key,i)=>{target[key]=terms[i]});
 }
}
const cleanName=value=>String(value||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('en').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
const partnerByName=new Map(),partnerById=new Map(),caseById=new Map();
const ordered=(xs)=>xs.slice().sort((a,b)=>
  (a.priority==='P0'?0:a.priority==='P1'?1:2)-(b.priority==='P0'?0:b.priority==='P1'?1:2));
for(const partner of data.partners){
 if(!partner||!Array.isArray(partner.cases))continue;
 const valid=ordered(partner.cases.filter(study=>{
  try {
   const u=new URL(study.url);
   return /^GCN-CS-\d+$/.test(study.id)&&u.protocol==='https:'&&u.hostname.includes('.')&&typeof study.title==='string';
  }catch(_){return false}
 }));
 if(!valid.length)continue;
 const entry={name:partner.name,cases:valid};
 for(const study of valid)caseById.set(study.id,{partner:entry.name,...study});
 for(const name of [partner.name,...(partner.aliases||[])]){
  const key=cleanName(name);
  if(!key)continue;
  // Conflicting aliases must not silently link the wrong organisation.
  if(partnerByName.has(key)&&partnerByName.get(key)!==entry)partnerByName.set(key,null);
  else if(!partnerByName.has(key))partnerByName.set(key,entry);
 }
 for(const id of partner.featureIds||[]){
  const key=String(id);
  if(partnerById.has(key)&&partnerById.get(key)!==entry)partnerById.set(key,null);
  else if(!partnerById.has(key))partnerById.set(key,entry);
 }
}
function findPartner(feature,item){
 const id=feature?.id??feature?.properties?.id;
 if(id!==null&&id!==undefined&&partnerById.has(String(id)))return partnerById.get(String(id));
 for(const name of [feature?.properties?.name,item?.name,...(item?.aliases||[])]){
  const entry=partnerByName.get(cleanName(name));
  if(entry)return entry;
 }
 return null;
}
const currentLanguage=()=>document.getElementById('language-select')?.value||'en';
function textFor(key){
 const lang=currentLanguage();
 const fallback=i18n?.translate(lang,key);
 if(fallback&&fallback!==key)return fallback;
 const locale=TEXT[lang]||TEXT.en;
 return locale[KEYS.indexOf(key)]||TEXT.en[KEYS.indexOf(key)]||key;
}
// Consistent discoverable CTA: evidence type remains in the accessible case-study title.
const CASE_STUDY_LABEL={
 en:'View case study',
 'zh-CN':'查看案例',
 'zh-TW':'查看案例',
 ja:'事例を見る',
 ko:'사례 보기',
 ms:'Lihat kajian kes',
 'ms-Arab':'ليهت کاجين کيس',
 hi:'केस स्टडी देखें',
 pa:'ਕੇਸ ਅਧਿਐਨ ਵੇਖੋ',
 bn:'কেস স্টাডি দেখুন',
 gu:'કેસ સ્ટડી જુઓ',
 ta:'கேஸ் ஸ்டடியைப் பார்க்கவும்',
 te:'కేస్ స్టడీని చూడండి',
 mr:'केस स्टडी पाहा',
 ur:'کیس اسٹڈی دیکھیں',
 ne:'केस स्टडी हेर्नुहोस्',
 ar:'عرض دراسة الحالة'
};
function applyLanguage(anchor,study){
 const label=CASE_STUDY_LABEL[currentLanguage()]||CASE_STUDY_LABEL.en;
 anchor.textContent=label+' ↗';
 anchor.setAttribute('aria-label',label+' — '+study.title+' ('+textFor('caseNewTab')+')');
 anchor.setAttribute('title',study.title);
 anchor.lang=(i18n?.locales?.[currentLanguage()]||currentLanguage()==='en')?currentLanguage():'en';
 anchor.dir=['ar','ur','ms-Arab'].includes(currentLanguage())?'rtl':'auto';
}
function updateLink(anchor,feature,item){
 const entry=findPartner(feature,item);
 const study=entry?.cases?.[0];
 if(!study){
  anchor.hidden=true;
  anchor.removeAttribute('href');
  delete anchor.dataset.gcnCaseId;
  return false;
 }
 anchor.href=study.url;
 anchor.target='_blank';
 anchor.rel='noopener noreferrer';
 anchor.dataset.gcnCaseId=study.id;
 anchor.classList.add('gcn-case-link');
 anchor.hidden=false;
 applyLanguage(anchor,{...study,partner:entry.name});
 return true;
}
function createLink(feature,item,className){
 const anchor=document.createElement('a');
 anchor.className=className||'gcn-case-link';
 return updateLink(anchor,feature,item)?anchor:null;
}
function refreshLinks(root=document){
 root.querySelectorAll('.gcn-case-link[data-gcn-case-id]').forEach(anchor=>{
  const study=caseById.get(anchor.dataset.gcnCaseId);
  if(study)applyLanguage(anchor,study);
 });
}
window.SDCA_V2_CASE_STUDIES={findPartner,createLink,updateLink,refreshLinks,records:data.partners.length,cases:caseById.size};
document.getElementById('language-select')?.addEventListener('change',()=>refreshLinks());
})();
