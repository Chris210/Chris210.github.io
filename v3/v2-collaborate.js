/* V2-only: collaboration pathways. Addresses were supplied by the SDCA project owner. */
(function(){
'use strict';
const root=document.getElementById('v2-root');
const home=document.getElementById('v2-home');
const recordsNote=home?.querySelector('.v2-data-note');
const languagePicker=document.getElementById('language-select');
if(!root||!recordsNote)return;

const EMAIL_ROUTES=[
 {email:'sdca-research@lboro.ac.uk',subject:'Loughborough SDCA — Research collaboration enquiry'},
 {email:'c.parker@lboro.ac.uk',subject:'Loughborough SDCA — Academic partnership enquiry'},
 {email:'SDCA-Dean@lboro.ac.uk',subject:'Loughborough SDCA — School collaboration enquiry'}
];
const MESSAGES={
 en:{cta:'Collaborate with us',heading:"Let’s create something together",intro:'Choose how you would like to collaborate with Loughborough’s School of Design and Creative Arts.',close:'Close collaboration options',hint:'Selecting an option opens an email draft in your email app.',options:[
  ['Collaborate on research','Joint research, creative practice and knowledge exchange'],
  ['Explore an academic partnership','University partnerships, international exchange and academic collaboration'],
  ['Work with our school','Student projects, industry opportunities and broader school collaboration']]},
 'zh-CN':{cta:'与我们合作',heading:'携手创造更多可能',intro:'选择您希望与拉夫堡大学设计与创意艺术学院开展的合作方式。',close:'关闭合作选项',hint:'选择后将在您的邮件应用中打开邮件草稿。',options:[
  ['开展科研合作','联合研究、创意实践与知识交流'],
  ['探索学术合作伙伴关系','大学间合作、国际交流与学术协作'],
  ['与学院合作','学生项目、行业机会及更广泛的学院合作']]},
 'zh-TW':{cta:'與我們合作',heading:'攜手創造更多可能',intro:'選擇您希望與拉夫堡大學設計與創意藝術學院合作的方式。',close:'關閉合作選項',hint:'選擇後將在您的電子郵件應用程式中開啟郵件草稿。',options:[
  ['開展研究合作','聯合研究、創意實踐與知識交流'],
  ['探索學術合作夥伴關係','大學合作、國際交流與學術協作'],
  ['與學院合作','學生專案、產業機會及其他學院合作']]},
 ja:{cta:'共同研究・連携',heading:'ともに新しい可能性を創造しましょう',intro:'ラフバラー大学デザイン・クリエイティブアーツ学部との連携方法をお選びください。',close:'連携メニューを閉じる',hint:'選択するとメールアプリで下書きが開きます。',options:[
  ['研究で連携する','共同研究、創造的実践、知識交流'],
  ['大学間連携を検討する','大学間協定、国際交流、学術連携'],
  ['本学部と協働する','学生プロジェクト、産業連携、その他の協働']]},
 ko:{cta:'협력하기',heading:'함께 새로운 가능성을 만듭니다',intro:'러프버러 대학교 디자인·창의예술대학과 협력할 분야를 선택하세요.',close:'협력 옵션 닫기',hint:'선택하면 이메일 앱에서 초안이 열립니다.',options:[
  ['연구 협력','공동 연구, 창의적 실무, 지식 교류'],
  ['학술 파트너십 모색','대학 간 협력, 국제 교류, 학술 협업'],
  ['우리 대학과 협력','학생 프로젝트, 산업 기회 및 폭넓은 협업']]},
 ms:{cta:'Bekerjasama dengan kami',heading:'Mari cipta sesuatu bersama',intro:'Pilih cara untuk bekerjasama dengan Sekolah Reka Bentuk dan Seni Kreatif Loughborough.',close:'Tutup pilihan kerjasama',hint:'Pilihan ini akan membuka draf e-mel dalam aplikasi e-mel anda.',options:[
  ['Bekerjasama dalam penyelidikan','Penyelidikan bersama, amalan kreatif dan perkongsian ilmu'],
  ['Teroka kerjasama akademik','Perkongsian universiti, pertukaran antarabangsa dan kerjasama akademik'],
  ['Bekerjasama dengan sekolah kami','Projek pelajar, peluang industri dan kerjasama lain']]},
 'ms-Arab':{cta:'بکرجاسام دڠن کامي',heading:'ماري منچيڤتا سسواتو برسام',intro:'ڤيليه چارا اونتوق بکرجاسام دڠن سکوله ريکا بنتوق دان سني کرياتيف لوغبورو.',close:'توتوڤ ڤيليهن کرجاسام',hint:'ڤيليهن اين ممبوک دراف اي-ميل دالم اڤليکاسي اي-ميل اندا.',options:[
  ['کرجاسام ڤڽليديقن','ڤڽليديقن برسام، عملن کرياتيف دان ڤرکوڠسين علمو'],
  ['تروکاي ڤرکونݢسين اکادميک','ڤرکونݢسين اونيۏرسيتي، ڤرتوقرن انتارابڠسا دان کرجاسام اکادميک'],
  ['بکرجاسام دڠن سکوله کامي','ڤروجيک ڤلاجر، ڤلواڠ ايندوستري دان کرجاسام لاين']]},
 hi:{cta:'हमारे साथ सहयोग करें',heading:'आइए साथ मिलकर कुछ नया करें',intro:'चुनें कि आप लफ़बरो विश्वविद्यालय के डिज़ाइन और क्रिएटिव आर्ट्स स्कूल के साथ कैसे सहयोग करना चाहते हैं।',close:'सहयोग विकल्प बंद करें',hint:'विकल्प चुनने पर आपके ईमेल ऐप में ड्राफ्ट खुल जाएगा।',options:[
  ['शोध में सहयोग करें','संयुक्त शोध, रचनात्मक अभ्यास और ज्ञान का आदान-प्रदान'],
  ['शैक्षणिक साझेदारी तलाशें','विश्वविद्यालय साझेदारी, अंतरराष्ट्रीय आदान-प्रदान और अकादमिक सहयोग'],
  ['हमारे स्कूल के साथ काम करें','छात्र परियोजनाएँ, उद्योग अवसर और अन्य सहयोग']]},
 pa:{cta:'ਸਾਡੇ ਨਾਲ ਸਹਿਯੋਗ ਕਰੋ',heading:'ਆਓ ਮਿਲ ਕੇ ਕੁਝ ਨਵਾਂ ਬਣਾਈਏ',intro:'ਲਫਬਰੋ ਯੂਨੀਵਰਸਿਟੀ ਦੇ ਡਿਜ਼ਾਈਨ ਅਤੇ ਕ੍ਰੀਏਟਿਵ ਆਰਟਸ ਸਕੂਲ ਨਾਲ ਸਹਿਯੋਗ ਦਾ ਤਰੀਕਾ ਚੁਣੋ।',close:'ਸਹਿਯੋਗ ਵਿਕਲਪ ਬੰਦ ਕਰੋ',hint:'ਚੁਣਨ ਨਾਲ ਤੁਹਾਡੀ ਈਮੇਲ ਐਪ ਵਿੱਚ ਡਰਾਫਟ ਖੁੱਲ੍ਹੇਗਾ।',options:[
  ['ਖੋਜ ਵਿੱਚ ਸਹਿਯੋਗ','ਸਾਂਝੀ ਖੋਜ, ਰਚਨਾਤਮਕ ਅਭਿਆਸ ਅਤੇ ਗਿਆਨ ਸਾਂਝਾ ਕਰਨਾ'],
  ['ਅਕਾਦਮਿਕ ਭਾਈਵਾਲੀ ਦੀ ਪੜਚੋਲ','ਯੂਨੀਵਰਸਿਟੀ ਭਾਈਵਾਲੀ, ਅੰਤਰਰਾਸ਼ਟਰੀ ਆਦਾਨ-ਪ੍ਰਦਾਨ ਅਤੇ ਅਕਾਦਮਿਕ ਸਹਿਯੋਗ'],
  ['ਸਾਡੇ ਸਕੂਲ ਨਾਲ ਕੰਮ ਕਰੋ','ਵਿਦਿਆਰਥੀ ਪ੍ਰੋਜੈਕਟ, ਉਦਯੋਗ ਦੇ ਮੌਕੇ ਅਤੇ ਹੋਰ ਸਹਿਯੋਗ']]},
 bn:{cta:'আমাদের সঙ্গে সহযোগিতা করুন',heading:'আসুন একসঙ্গে নতুন কিছু তৈরি করি',intro:'লাফবরো বিশ্ববিদ্যালয়ের ডিজাইন ও ক্রিয়েটিভ আর্টস স্কুলের সঙ্গে সহযোগিতার ধরন বেছে নিন।',close:'সহযোগিতার বিকল্প বন্ধ করুন',hint:'নির্বাচন করলে আপনার ইমেল অ্যাপে একটি খসড়া খুলবে।',options:[
  ['গবেষণায় সহযোগিতা','যৌথ গবেষণা, সৃজনশীল কাজ ও জ্ঞান বিনিময়'],
  ['একাডেমিক অংশীদারত্ব গড়ুন','বিশ্ববিদ্যালয় সহযোগিতা, আন্তর্জাতিক বিনিময় ও একাডেমিক অংশীদারত্ব'],
  ['আমাদের স্কুলের সঙ্গে কাজ করুন','শিক্ষার্থী প্রকল্প, শিল্পক্ষেত্রের সুযোগ ও অন্যান্য সহযোগিতা']]},
 gu:{cta:'અમારી સાથે સહયોગ કરો',heading:'ચાલો સાથે મળીને કંઈક નવું સર્જીએ',intro:'લફબરો યુનિવર્સિટીની સ્કૂલ ઑફ ડિઝાઇન એન્ડ ક્રિએટિવ આર્ટ્સ સાથે સહયોગ કરવાનો માર્ગ પસંદ કરો.',close:'સહયોગના વિકલ્પો બંધ કરો',hint:'પસંદ કરતાં તમારી ઈમેઇલ એપમાં ડ્રાફ્ટ ખુલશે.',options:[
  ['સંશોધનમાં સહયોગ','સંયુક્ત સંશોધન, સર્જનાત્મક અભ્યાસ અને જ્ઞાનનું આદાનપ્રદાન'],
  ['શૈક્ષણિક ભાગીદારી શોધો','યુનિવર્સિટી ભાગીદારી, આંતરરાષ્ટ્રીય વિનિમય અને શૈક્ષણિક સહયોગ'],
  ['અમારી સ્કૂલ સાથે કામ કરો','વિદ્યાર્થી પ્રોજેક્ટ, ઉદ્યોગની તકો અને અન્ય સહયોગ']]},
 ta:{cta:'எங்களுடன் இணைந்து பணியாற்றுங்கள்',heading:'ஒன்றாகப் புதியதை உருவாக்குவோம்',intro:'லஃப்பரோ பல்கலைக்கழகத்தின் வடிவமைப்பு மற்றும் படைப்புக் கலைகள் பள்ளியுடன் இணையும் வழியைத் தேர்ந்தெடுக்கவும்.',close:'ஒத்துழைப்பு விருப்பங்களை மூடு',hint:'தேர்வு செய்தால் உங்கள் மின்னஞ்சல் செயலியில் வரைவு திறக்கும்.',options:[
  ['ஆராய்ச்சியில் இணைந்து பணியாற்றுங்கள்','கூட்டு ஆராய்ச்சி, படைப்புப் பயிற்சி மற்றும் அறிவுப் பரிமாற்றம்'],
  ['கல்விசார் கூட்டாண்மையை ஆராயுங்கள்','பல்கலைக்கழகக் கூட்டாண்மை, சர்வதேச பரிமாற்றம் மற்றும் கல்விசார் ஒத்துழைப்பு'],
  ['எங்கள் பள்ளியுடன் பணியாற்றுங்கள்','மாணவர் திட்டங்கள், தொழில்துறை வாய்ப்புகள் மற்றும் பிற ஒத்துழைப்புகள்']]},
 te:{cta:'మాతో కలిసి పనిచేయండి',heading:'కలిసి కొత్త అవకాశాలను సృష్టిద్దాం',intro:'లఫ్‌బరో విశ్వవిద్యాలయం డిజైన్ మరియు క్రియేటివ్ ఆర్ట్స్ పాఠశాలతో సహకరించే మార్గాన్ని ఎంచుకోండి.',close:'సహకార ఎంపికలను మూసివేయండి',hint:'ఎంచుకున్నప్పుడు మీ ఈమెయిల్ యాప్‌లో డ్రాఫ్ట్ తెరుచుకుంటుంది.',options:[
  ['పరిశోధనలో సహకరించండి','సంయుక్త పరిశోధన, సృజనాత్మక సాధన మరియు జ్ఞాన మార్పిడి'],
  ['విద్యా భాగస్వామ్యాన్ని అన్వేషించండి','విశ్వవిద్యాలయ భాగస్వామ్యాలు, అంతర్జాతీయ మార్పిడి మరియు విద్యా సహకారం'],
  ['మా పాఠశాలతో పనిచేయండి','విద్యార్థి ప్రాజెక్టులు, పరిశ్రమ అవకాశాలు మరియు ఇతర సహకారం']]},
 mr:{cta:'आमच्यासोबत सहकार्य करा',heading:'चला एकत्र काहीतरी नवीन घडवूया',intro:'लफबरो विद्यापीठाच्या स्कूल ऑफ डिझाइन अँड क्रिएटिव्ह आर्ट्ससोबत सहकार्य करण्याचा मार्ग निवडा.',close:'सहकार्य पर्याय बंद करा',hint:'पर्याय निवडल्यावर तुमच्या ईमेल अॅपमध्ये मसुदा उघडेल.',options:[
  ['संशोधनात सहकार्य','संयुक्त संशोधन, सर्जनशील उपक्रम आणि ज्ञानाची देवाणघेवाण'],
  ['शैक्षणिक भागीदारी शोधा','विद्यापीठ भागीदारी, आंतरराष्ट्रीय देवाणघेवाण आणि शैक्षणिक सहकार्य'],
  ['आमच्या स्कूलसोबत काम करा','विद्यार्थी प्रकल्प, उद्योग संधी आणि इतर सहकार्य']]},
 ur:{cta:'ہمارے ساتھ تعاون کریں',heading:'آئیے مل کر کچھ نیا تخلیق کریں',intro:'لفبرو یونیورسٹی کے اسکول آف ڈیزائن اینڈ کریئیٹو آرٹس کے ساتھ تعاون کا طریقہ منتخب کریں۔',close:'تعاون کے اختیارات بند کریں',hint:'منتخب کرنے سے آپ کی ای میل ایپ میں مسودہ کھلے گا۔',options:[
  ['تحقیق میں تعاون کریں','مشترکہ تحقیق، تخلیقی سرگرمیاں اور علمی تبادلہ'],
  ['تعلیمی شراکت داری تلاش کریں','جامعات کے درمیان شراکت، بین الاقوامی تبادلہ اور تعلیمی تعاون'],
  ['ہمارے اسکول کے ساتھ کام کریں','طلبہ کے منصوبے، صنعت کے مواقع اور دیگر تعاون']]},
 ne:{cta:'हामीसँग सहकार्य गर्नुहोस्',heading:'आउनुहोस्, सँगै नयाँ काम गरौँ',intro:'लफबरो विश्वविद्यालयको डिजाइन तथा क्रिएटिभ आर्ट्स स्कुलसँग सहकार्य गर्ने तरिका छान्नुहोस्।',close:'सहकार्य विकल्प बन्द गर्नुहोस्',hint:'छानेपछि तपाईंको इमेल एपमा मस्यौदा खुल्नेछ।',options:[
  ['अनुसन्धानमा सहकार्य','संयुक्त अनुसन्धान, सिर्जनात्मक अभ्यास र ज्ञान आदानप्रदान'],
  ['शैक्षिक साझेदारी खोज्नुहोस्','विश्वविद्यालय साझेदारी, अन्तर्राष्ट्रिय आदानप्रदान र शैक्षिक सहकार्य'],
  ['हाम्रो स्कुलसँग काम गर्नुहोस्','विद्यार्थी परियोजना, उद्योगका अवसर र अन्य सहकार्य']]},
 ar:{cta:'تعاون معنا',heading:'لنبدع شيئاً معاً',intro:'اختر كيفية التعاون مع كلية التصميم والفنون الإبداعية بجامعة لوبورو.',close:'إغلاق خيارات التعاون',hint:'سيؤدي اختيار أحد الخيارات إلى فتح مسودة رسالة في تطبيق البريد الإلكتروني.',options:[
  ['تعاون في البحث العلمي','أبحاث مشتركة وممارسات إبداعية وتبادل المعرفة'],
  ['استكشف شراكة أكاديمية','شراكات جامعية وتبادل دولي وتعاون أكاديمي'],
  ['تعاون مع كليتنا','مشاريع طلابية وفرص صناعية وأشكال أخرى من التعاون']]}
};
const rtlLanguages=new Set(['ar','ur','ms-Arab']);
const make=(tag,cls,txt)=>{
 const el=document.createElement(tag);
 if(cls)el.className=cls;
 if(txt!==undefined)el.textContent=txt;
 return el;
};
const trigger=make('button','v2-collaborate-trigger');
trigger.id='v2-collaborate-trigger';
trigger.type='button';
trigger.setAttribute('aria-haspopup','dialog');
trigger.setAttribute('aria-controls','v2-collaborate-dialog');
trigger.setAttribute('aria-expanded','false');
const icon=make('span','v2-collaborate-trigger-icon','✧');
icon.setAttribute('aria-hidden','true');
const label=make('span','v2-collaborate-trigger-label');
trigger.append(icon,label);
// Keep this action immediately above the SDCA records date at the bottom of the card.
recordsNote.before(trigger);

const dialog=make('dialog','v2-collaborate-dialog');
dialog.id='v2-collaborate-dialog';
dialog.setAttribute('aria-labelledby','v2-collaborate-title');
dialog.setAttribute('aria-describedby','v2-collaborate-intro');
const shell=make('div','v2-collaborate-shell');
const top=make('div','v2-collaborate-top');
const titleWrap=make('div','v2-collaborate-title-group');
const overline=make('p','v2-collaborate-overline','Loughborough Global Creative Network');
overline.lang='en';
const heading=make('h2','v2-collaborate-title');
heading.id='v2-collaborate-title';
heading.tabIndex=-1;
const intro=make('p','v2-collaborate-intro');
intro.id='v2-collaborate-intro';
titleWrap.append(overline,heading,intro);
const close=make('button','v2-collaborate-close');
close.type='button';
const closeMark=make('span',null,'×');
closeMark.setAttribute('aria-hidden','true');
close.append(closeMark);
top.append(titleWrap,close);
const content=make('div','v2-collaborate-content');
const links=make('div','v2-collaborate-links');
const optionUI=EMAIL_ROUTES.map((route,index)=>{
 const link=make('a','v2-collaborate-option');
 link.href='mailto:'+route.email+'?subject='+encodeURIComponent(route.subject);
 const icon=make('span','v2-collaborate-option-index',String(index+1).padStart(2,'0'));
 icon.setAttribute('aria-hidden','true');
 const copy=make('span','v2-collaborate-option-copy');
 const name=make('strong','v2-collaborate-option-name');
 const description=make('span','v2-collaborate-option-description');
 const address=make('span','v2-collaborate-option-email',route.email);
 address.lang='en';
 copy.append(name,description,address);
 const arrow=make('span','v2-collaborate-option-arrow','↗');
 arrow.setAttribute('aria-hidden','true');
 link.append(icon,copy,arrow);
 links.append(link);
 link.addEventListener('click',()=>{if(dialog.open)dialog.close();});
 return {link,name,description,address,route};
});
const note=make('p','v2-collaborate-note');
content.append(links,note);
shell.append(top,content);
dialog.append(shell);
document.body.append(dialog);
let previousFocus=null;
function currentLanguage(){return languagePicker?.value||'en'}
function locale(){return MESSAGES[currentLanguage()]||MESSAGES.en}
function translate(){
 const lang=currentLanguage(),strings=locale();
 label.textContent=strings.cta;
 trigger.setAttribute('aria-label',strings.cta);
 dialog.lang=MESSAGES[lang]?lang:'en';
 dialog.dir=rtlLanguages.has(lang)?'rtl':'ltr';
 heading.textContent=strings.heading;
 intro.textContent=strings.intro;
 close.setAttribute('aria-label',strings.close);
 close.title=strings.close;
 note.textContent=strings.hint;
 optionUI.forEach((entry,index)=>{
  const values=strings.options[index];
  entry.name.textContent=values[0];
  entry.description.textContent=values[1];
  entry.link.setAttribute('aria-label',values[0]+'. '+entry.route.email+'. '+strings.hint);
 });
}
// The main card's existing view and mobile-drawer visibility control this button automatically.
function open(){
 previousFocus=document.activeElement;
 translate();
 if(typeof dialog.showModal==='function')dialog.showModal();
 else dialog.setAttribute('open','');
 trigger.setAttribute('aria-expanded','true');
 heading.focus({preventScroll:true});
}
trigger.addEventListener('click',open);
close.addEventListener('click',()=>dialog.close());
dialog.addEventListener('cancel',()=>{});
dialog.addEventListener('close',()=>{
 trigger.setAttribute('aria-expanded','false');
 if(previousFocus?.isConnected)previousFocus.focus({preventScroll:true});
 previousFocus=null;
});
dialog.addEventListener('click',event=>{
 if(event.target!==dialog)return;
 const box=dialog.getBoundingClientRect();
 if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();
});
// Keep the existing guided-tour and mobile-drawer key handlers out of a modal.
dialog.addEventListener('keydown',event=>event.stopPropagation());
languagePicker?.addEventListener('change',translate);
translate();
window.SDCA_V2_COLLABORATE={open,close:()=>dialog.close(),routeCount:EMAIL_ROUTES.length};
})();
