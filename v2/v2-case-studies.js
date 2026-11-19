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

/* UI localisation is independent of the source language of evidence.
   Preserve official project titles and English source summaries verbatim. */
const CHOOSER_UI={
 en:{multiple:'View {count} case studies',heading:'Choose a case study',intro:'Explore verified work related to {partner}. Select a case study to read the original evidence.',close:'Close case studies',types:['Research','Creative work','Placement','Exchange','Project'],original:'Opens original source in a new tab',english:'Case-study summaries are provided in English.'},
 'zh-CN':{multiple:'查看 {count} 个案例',heading:'选择案例',intro:'探索与 {partner} 相关且有来源依据的成果。请选择一个案例查看原始资料。',close:'关闭案例列表',types:['研究','创意作品','实习','交流','项目'],original:'在新标签页中打开原始资料',english:'案例摘要以英语提供。'},
 'zh-TW':{multiple:'查看 {count} 個案例',heading:'選擇案例',intro:'探索與 {partner} 相關且有來源依據的成果。請選擇一個案例查看原始資料。',close:'關閉案例清單',types:['研究','創意作品','實習','交流','專案'],original:'在新分頁開啟原始資料',english:'案例摘要以英語提供。'},
 ja:{multiple:'{count}件の事例を見る',heading:'事例を選ぶ',intro:'{partner} に関連する検証済みの活動です。事例を選ぶと元の資料を開きます。',close:'事例一覧を閉じる',types:['研究','創作活動','インターンシップ','交換留学','プロジェクト'],original:'元の資料を新しいタブで開く',english:'事例の概要は英語で表示されます。'},
 ko:{multiple:'사례 {count}건 보기',heading:'사례 선택',intro:'{partner} 관련 근거가 확인된 활동입니다. 사례를 선택하면 원본 자료가 열립니다.',close:'사례 목록 닫기',types:['연구','창작 활동','인턴십','교류','프로젝트'],original:'원본 자료를 새 탭에서 열기',english:'사례 요약은 영어로 제공됩니다.'},
 ms:{multiple:'Lihat {count} kajian kes',heading:'Pilih kajian kes',intro:'Terokai kerja yang disahkan berkaitan {partner}. Pilih kajian kes untuk membuka sumber asal.',close:'Tutup senarai kajian kes',types:['Penyelidikan','Karya kreatif','Penempatan','Pertukaran','Projek'],original:'Buka sumber asal dalam tab baharu',english:'Ringkasan kajian kes disediakan dalam bahasa Inggeris.'},
 'ms-Arab':{multiple:'ليهت {count} کاجين کيس',heading:'ڤيليه کاجين کيس',intro:'تروکاي کرجا يڠ دصحکن برکاءيتن {partner}. ڤيليه کاجين کيس اونتوق ممبوک سومبر اصل.',close:'توتوڤ سناراي کاجين کيس',types:['ڤڽليديقن','کاريا کرياتيف','لاتيهن ايندوستري','ڤرتوقرن','ڤروجيک'],original:'بوک سومبر اصل دالم تاب بهارو',english:'رينݢکسن دسدياکن دالم بهاس ايڠݢريس.'},
 hi:{multiple:'{count} केस स्टडी देखें',heading:'केस स्टडी चुनें',intro:'{partner} से संबंधित प्रमाणित कार्य देखें। मूल स्रोत पढ़ने के लिए एक केस स्टडी चुनें।',close:'केस स्टडी सूची बंद करें',types:['शोध','रचनात्मक कार्य','इंटर्नशिप','विनिमय','परियोजना'],original:'मूल स्रोत नए टैब में खुलेगा',english:'केस स्टडी के सारांश अंग्रेज़ी में हैं।'},
 pa:{multiple:'{count} ਕੇਸ ਅਧਿਐਨ ਵੇਖੋ',heading:'ਕੇਸ ਅਧਿਐਨ ਚੁਣੋ',intro:'{partner} ਨਾਲ ਸੰਬੰਧਿਤ ਪ੍ਰਮਾਣਿਤ ਕੰਮ ਵੇਖੋ। ਮੂਲ ਸਰੋਤ ਖੋਲ੍ਹਣ ਲਈ ਕੋਈ ਕੇਸ ਚੁਣੋ।',close:'ਕੇਸ ਅਧਿਐਨ ਬੰਦ ਕਰੋ',types:['ਖੋਜ','ਰਚਨਾਤਮਕ ਕੰਮ','ਇੰਟਰਨਸ਼ਿਪ','ਅਦਲਾ-ਬਦਲੀ','ਪ੍ਰੋਜੈਕਟ'],original:'ਮੂਲ ਸਰੋਤ ਨਵੀਂ ਟੈਬ ਵਿੱਚ ਖੁੱਲ੍ਹੇਗਾ',english:'ਸਾਰ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਦਿੱਤੇ ਗਏ ਹਨ।'},
 bn:{multiple:'{count}টি কেস স্টাডি দেখুন',heading:'কেস স্টাডি বেছে নিন',intro:'{partner} সম্পর্কিত যাচাইকৃত কাজ দেখুন। মূল উৎস পড়তে একটি কেস স্টাডি বেছে নিন।',close:'কেস স্টাডির তালিকা বন্ধ করুন',types:['গবেষণা','সৃজনশীল কাজ','ইন্টার্নশিপ','বিনিময়','প্রকল্প'],original:'মূল উৎস নতুন ট্যাবে খুলবে',english:'কেস স্টাডির সারাংশ ইংরেজিতে দেওয়া হয়েছে।'},
 gu:{multiple:'{count} કેસ સ્ટડી જુઓ',heading:'કેસ સ્ટડી પસંદ કરો',intro:'{partner} સંબંધિત ચકાસેલું કાર્ય જુઓ. મૂળ સ્રોત વાંચવા માટે એક કેસ સ્ટડી પસંદ કરો.',close:'કેસ સ્ટડીની યાદી બંધ કરો',types:['સંશોધન','સર્જનાત્મક કાર્ય','ઇન્ટર્નશિપ','વિનિમય','પ્રોજેક્ટ'],original:'મૂળ સ્રોત નવી ટૅબમાં ખુલશે',english:'કેસ સ્ટડીના સારાંશ અંગ્રેજીમાં છે.'},
 ta:{multiple:'{count} கேஸ் ஸ்டடிகளைப் பார்க்கவும்',heading:'கேஸ் ஸ்டடியைத் தேர்ந்தெடுக்கவும்',intro:'{partner} தொடர்பான சரிபார்க்கப்பட்ட பணிகளைப் பாருங்கள். மூல ஆதாரத்தைத் திறக்க ஒரு கேஸ் ஸ்டடியைத் தேர்ந்தெடுக்கவும்.',close:'பட்டியலை மூடு',types:['ஆராய்ச்சி','படைப்புப் பணி','பயிற்சி','பரிமாற்றம்','திட்டம்'],original:'மூல ஆதாரம் புதிய தாவலில் திறக்கும்',english:'கேஸ் ஸ்டடி சுருக்கங்கள் ஆங்கிலத்தில் வழங்கப்படுகின்றன.'},
 te:{multiple:'{count} కేస్ స్టడీలు చూడండి',heading:'కేస్ స్టడీని ఎంచుకోండి',intro:'{partner} కు సంబంధించిన ధృవీకరించిన పనులను చూడండి. మూల ఆధారాన్ని తెరవడానికి ఒక కేస్ స్టడీని ఎంచుకోండి.',close:'జాబితాను మూసివేయండి',types:['పరిశోధన','సృజనాత్మక పని','ఇంటర్న్‌షిప్','మార్పిడి','ప్రాజెక్ట్'],original:'మూల ఆధారం కొత్త ట్యాబ్‌లో తెరుచుకుంటుంది',english:'కేస్ స్టడీ సారాంశాలు ఆంగ్లంలో అందుబాటులో ఉన్నాయి.'},
 mr:{multiple:'{count} केस स्टडी पाहा',heading:'केस स्टडी निवडा',intro:'{partner} संबंधित पडताळलेले काम पाहा. मूळ स्रोत उघडण्यासाठी केस स्टडी निवडा.',close:'केस स्टडी यादी बंद करा',types:['संशोधन','सर्जनशील कार्य','इंटर्नशिप','आदानप्रदान','प्रकल्प'],original:'मूळ स्रोत नवीन टॅबमध्ये उघडेल',english:'केस स्टडीचे सारांश इंग्रजीत उपलब्ध आहेत.'},
 ur:{multiple:'{count} کیس اسٹڈیز دیکھیں',heading:'کیس اسٹڈی منتخب کریں',intro:'{partner} سے متعلق تصدیق شدہ کام دیکھیں۔ اصل ماخذ کھولنے کے لیے کیس اسٹڈی منتخب کریں۔',close:'کیس اسٹڈیز بند کریں',types:['تحقیق','تخلیقی کام','انٹرن شپ','تبادلہ','منصوبہ'],original:'اصل ماخذ نئے ٹیب میں کھلے گا',english:'کیس اسٹڈیز کے خلاصے انگریزی میں ہیں۔'},
 ne:{multiple:'{count} केस स्टडी हेर्नुहोस्',heading:'केस स्टडी छान्नुहोस्',intro:'{partner} सँग सम्बन्धित प्रमाणित काम हेर्नुहोस्। मूल स्रोत खोल्न कुनै केस स्टडी छान्नुहोस्।',close:'केस स्टडी सूची बन्द गर्नुहोस्',types:['अनुसन्धान','सिर्जनात्मक काम','इन्टर्नशिप','आदानप्रदान','परियोजना'],original:'मूल स्रोत नयाँ ट्याबमा खुल्छ',english:'केस स्टडीका सारांश अंग्रेजीमा उपलब्ध छन्।'},
 ar:{multiple:'عرض {count} دراسات حالة',heading:'اختر دراسة حالة',intro:'استكشف الأعمال الموثقة المرتبطة بـ {partner}. اختر دراسة حالة لفتح المصدر الأصلي.',close:'إغلاق دراسات الحالة',types:['بحث','أعمال إبداعية','تدريب عملي','تبادل أكاديمي','مشروع'],original:'يفتح المصدر الأصلي في علامة تبويب جديدة',english:'ملخصات دراسات الحالة متاحة باللغة الإنجليزية.'}
};
const fmt=(template,vars={})=>String(template).replace(/\{(\w+)\}/g,(_,key)=>vars[key]??'');
const words=()=>CHOOSER_UI[currentLanguage()]||CHOOSER_UI.en;
const categories=['research','creative','placement','exchange','project'];
const actionText=(entry)=>entry.cases.length>1
 ?fmt(words().multiple,{count:entry.cases.length})
 :(CASE_STUDY_LABEL[currentLanguage()]||CASE_STUDY_LABEL.en);
let chooser=null,chooserHeading=null,chooserSubtitle=null,chooserIntro=null,chooserItems=null,chooserEnglishNote=null,chooserClose=null;
let activeEntry=null,previousFocus=null;

function modalStructure(){
 if(chooser)return chooser;
 chooser=document.createElement('dialog');
 chooser.id='gcn-case-dialog';
 chooser.className='gcn-case-dialog';
 chooser.setAttribute('aria-labelledby','gcn-case-dialog-heading');
 chooser.setAttribute('aria-describedby','gcn-case-dialog-intro');
 const shell=document.createElement('div');
 shell.className='gcn-case-dialog-shell';
 const head=document.createElement('header');
 head.className='gcn-case-dialog-header';
 const headings=document.createElement('div');
 headings.className='gcn-case-dialog-heading-stack';
 const eyebrow=document.createElement('span');
 eyebrow.className='gcn-case-dialog-eyebrow';
 eyebrow.textContent='✦ Loughborough Global Creative Network';
 eyebrow.lang='en';
 chooserHeading=document.createElement('h2');
 chooserHeading.id='gcn-case-dialog-heading';
 chooserSubtitle=document.createElement('p');
 chooserSubtitle.className='gcn-case-dialog-partner';
 chooserSubtitle.dir='auto';
 headings.append(eyebrow,chooserHeading,chooserSubtitle);
 chooserClose=document.createElement('button');
 chooserClose.type='button';
 chooserClose.className='gcn-case-dialog-close';
 const cross=document.createElement('span');
 cross.setAttribute('aria-hidden','true');
 cross.textContent='×';
 chooserClose.append(cross);
 chooserClose.addEventListener('click',()=>chooser.close());
 head.append(headings,chooserClose);
 chooserIntro=document.createElement('p');
 chooserIntro.id='gcn-case-dialog-intro';
 chooserIntro.className='gcn-case-dialog-intro';
 chooserItems=document.createElement('ol');
 chooserItems.className='gcn-case-dialog-list';
 chooserEnglishNote=document.createElement('p');
 chooserEnglishNote.className='gcn-case-dialog-language-note';
 const scroller=document.createElement('div');
 scroller.className='gcn-case-dialog-content';
 scroller.append(chooserIntro,chooserItems,chooserEnglishNote);
 shell.append(head,scroller);
 chooser.append(shell);
 document.body.appendChild(chooser);
 chooser.addEventListener('close',()=>{
  activeEntry=null;
  if(previousFocus?.isConnected)previousFocus.focus({preventScroll:true});
  previousFocus=null;
 });
 chooser.addEventListener('click',event=>{
  if(event.target!==chooser)return;
  const box=chooser.getBoundingClientRect();
  if(event.clientX<box.left||event.clientX>box.right||
     event.clientY<box.top||event.clientY>box.bottom)chooser.close();
 });
 return chooser;
}
function renderChoices(entry){
 const menu=words(),locale=currentLanguage(),rtl=['ar','ur','ms-Arab'].includes(locale);
 const dialog=modalStructure();
 dialog.lang=CHOOSER_UI[locale]?locale:'en';
 dialog.dir=rtl?'rtl':'ltr';
 chooserHeading.textContent=menu.heading;
 chooserSubtitle.textContent=entry.name;
 chooserIntro.textContent=fmt(menu.intro,{partner:entry.name});
 chooserClose.setAttribute('aria-label',menu.close);
 chooserClose.title=menu.close;
 chooserItems.replaceChildren();
 for(const study of entry.cases){
  const li=document.createElement('li');
  li.className='gcn-case-dialog-list-item';
  const anchor=document.createElement('a');
  anchor.className='gcn-case-choice';
  anchor.href=study.url;
  anchor.target='_blank';
  anchor.rel='noopener noreferrer';
  anchor.setAttribute('aria-label',study.title+' — '+menu.original);
  const copy=document.createElement('div');
  copy.className='gcn-case-choice-copy';
  const meta=document.createElement('p');
  meta.className='gcn-case-choice-meta';
  const tag=document.createElement('span');
  tag.className='gcn-case-choice-category';
  tag.textContent=menu.types[categories.indexOf(study.kind)]||menu.types[4];
  meta.append(tag);
  if(study.year){
   const year=document.createElement('span');
   year.className='gcn-case-choice-year';
   year.textContent=String(study.year);
   year.lang='en';
   meta.append(year);
  }
  const title=document.createElement('h3');
  title.className='gcn-case-choice-title';
  title.textContent=study.title;
  title.lang='en';
  const description=document.createElement('p');
  description.className='gcn-case-choice-summary';
  // Summary comes from verified case-study research, not an inferred relationship.
  description.textContent=String(study.summary||('This case study describes '+study.title+'.')).replace(/\s+/g,' ').trim();
  description.lang='en';
  description.dir='auto';
  copy.append(meta,title,description);
  const arrow=document.createElement('span');
  arrow.className='gcn-case-choice-arrow';
  arrow.textContent='↗';
  arrow.setAttribute('aria-hidden','true');
  anchor.append(copy,arrow);
  li.append(anchor);
  chooserItems.append(li);
 }
 chooserEnglishNote.textContent=menu.english;
 chooserEnglishNote.hidden=locale==='en';
}
function openChooser(entry,trigger){
 if(!entry||entry.cases.length<2)return;
 window.SDCA_V2?.pauseTour?.();
 const dialog=modalStructure();
 previousFocus=trigger||document.activeElement;
 activeEntry=entry;
 renderChoices(entry);
 if(!dialog.open){
  if(typeof dialog.showModal==='function')dialog.showModal();
  else dialog.setAttribute('open','');
 }
 chooserClose.focus({preventScroll:true});
}
function applyLanguage(anchor,entry){
 const multi=entry.cases.length>1;
 const label=actionText(entry);
 anchor.textContent=label+(multi?' ›':' ↗');
 anchor.setAttribute('aria-label',multi
  ? label+' — '+entry.name
  : label+' — '+entry.cases[0].title+' ('+textFor('caseNewTab')+')');
 anchor.title=multi?fmt(words().intro,{partner:entry.name}):entry.cases[0].title;
 anchor.lang=CHOOSER_UI[currentLanguage()]?currentLanguage():'en';
 anchor.dir=['ar','ur','ms-Arab'].includes(currentLanguage())?'rtl':'auto';
}
function bindAction(anchor){
 if(anchor.dataset.gcnCaseBound)return;
 anchor.dataset.gcnCaseBound='1';
 anchor.addEventListener('click',event=>{
  if(anchor.dataset.gcnCaseMode!=='chooser'){
   window.SDCA_V2?.pauseTour?.();
   return;
  }
  event.preventDefault();
  const entry=partnerByName.get(cleanName(anchor.dataset.gcnCasePartner));
  if(entry)openChooser(entry,anchor);
 });
 anchor.addEventListener('keydown',event=>{
  if(anchor.dataset.gcnCaseMode==='chooser'&&event.key===' '){
   event.preventDefault();anchor.click();
  }
 });
}
function updateLink(anchor,feature,item){
 const entry=findPartner(feature,item);
 if(!entry){
  anchor.hidden=true;
  anchor.removeAttribute('href');
  anchor.removeAttribute('target');
  anchor.removeAttribute('role');
  anchor.removeAttribute('aria-haspopup');
  anchor.removeAttribute('aria-controls');
  delete anchor.dataset.gcnCaseId;
  delete anchor.dataset.gcnCaseMode;
  delete anchor.dataset.gcnCasePartner;
  return false;
 }
 const multi=entry.cases.length>1;
 anchor.dataset.gcnCaseId=entry.cases[0].id;
 anchor.dataset.gcnCasePartner=entry.name;
 anchor.dataset.gcnCaseMode=multi?'chooser':'direct';
 anchor.classList.add('gcn-case-link');
 if(multi){
  anchor.href='#gcn-case-dialog';
  anchor.removeAttribute('target');
  anchor.setAttribute('role','button');
  anchor.setAttribute('aria-haspopup','dialog');
  anchor.setAttribute('aria-controls','gcn-case-dialog');
  anchor.removeAttribute('rel');
 }else{
  anchor.href=entry.cases[0].url;
  anchor.target='_blank';
  anchor.rel='noopener noreferrer';
  anchor.removeAttribute('role');
  anchor.removeAttribute('aria-haspopup');
  anchor.removeAttribute('aria-controls');
 }
 anchor.hidden=false;
 bindAction(anchor);
 applyLanguage(anchor,entry);
 return true;
}
function createLink(feature,item,className){
 const anchor=document.createElement('a');
 anchor.className=className||'gcn-case-link';
 return updateLink(anchor,feature,item)?anchor:null;
}
function refreshLinks(root=document){
 root.querySelectorAll('.gcn-case-link[data-gcn-case-partner]').forEach(anchor=>{
  const entry=partnerByName.get(cleanName(anchor.dataset.gcnCasePartner));
  if(entry)applyLanguage(anchor,entry);
 });
 if(chooser?.open&&activeEntry)renderChoices(activeEntry);
}
window.SDCA_V2_CASE_STUDIES={findPartner,createLink,updateLink,refreshLinks,records:data.partners.length,cases:caseById.size};
document.getElementById('language-select')?.addEventListener('change',()=>refreshLinks());
})();
