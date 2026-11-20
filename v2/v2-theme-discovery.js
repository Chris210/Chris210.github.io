/* V2-only theme explorer. Uses the full authoritative partner index, not map viewport. */
(function(){
'use strict';
const api=window.SDCA_V2_BRIDGE;
const themes=window.SDCA_V2_THEMES;
if(!api||!themes)return;
const COPY={
 en:{eyebrow:'EXPLORE A THEME',count:'other partners share this theme',filter:'Search these partners',placeholder:'Filter by partner name or location',loading:'Finding partners across the global network…',none:'No other partners match this theme.',noFilter:'No partners match your search.',more:'Show more partners',close:'Close theme explorer',unmapped:'Location not mapped',view:'View partner',provisional:'Suggested area',note:'Themes reflect documented work or areas of interest; a matching tag does not necessarily mean a joint project.',university:'University',industry:'Industry partner'},
 'zh-CN':{eyebrow:'探索主题',count:'个其他合作伙伴涉及此主题',filter:'搜索相关合作伙伴',placeholder:'按名称或地点筛选',loading:'正在查找全球合作伙伴…',none:'没有其他合作伙伴符合此主题。',noFilter:'没有符合搜索条件的合作伙伴。',more:'显示更多合作伙伴',close:'关闭主题浏览',unmapped:'地点暂未标注',view:'查看合作伙伴',provisional:'建议的主题',note:'主题依据公开的合作成果或机构关注领域整理；相同主题不一定表示双方开展过联合项目。',university:'大学',industry:'行业合作伙伴'},
 'zh-TW':{eyebrow:'探索主題',count:'個其他合作夥伴涉及此主題',filter:'搜尋相關合作夥伴',placeholder:'按名稱或地點篩選',loading:'正在尋找全球合作夥伴…',none:'沒有其他合作夥伴符合此主題。',noFilter:'沒有符合搜尋條件的合作夥伴。',more:'顯示更多合作夥伴',close:'關閉主題瀏覽',unmapped:'地點尚未標示',view:'查看合作夥伴',provisional:'建議主題',note:'主題反映已公開的合作成果或機構關注領域；相同主題不一定代表共同研究計畫。',university:'大學',industry:'業界合作夥伴'},
 ja:{eyebrow:'テーマを探す',count:'件の関連パートナー',filter:'パートナーを検索',placeholder:'名称・所在地で絞り込む',loading:'世界のパートナーを検索中…',none:'同じテーマの他のパートナーはいません。',noFilter:'該当するパートナーがありません。',more:'さらに表示',close:'テーマ一覧を閉じる',unmapped:'所在地未登録',view:'パートナーを見る',provisional:'暫定的なテーマ',note:'テーマは公開された活動や関心分野に基づきます。同じテーマでも共同研究を意味するものではありません。',university:'大学',industry:'企業パートナー'},
 ar:{eyebrow:'استكشف الموضوع',count:'شريك آخر في هذا المجال',filter:'ابحث عن الشركاء',placeholder:'البحث بالاسم أو الموقع',loading:'جارٍ البحث عن الشركاء عالميًا…',none:'لا يوجد شركاء آخرون في هذا الموضوع.',noFilter:'لا توجد نتائج مطابقة.',more:'عرض المزيد من الشركاء',close:'إغلاق قائمة الموضوع',unmapped:'الموقع غير محدد على الخريطة',view:'عرض الشريك',provisional:'موضوع مقترح',note:'تستند الموضوعات إلى أعمال موثّقة أو اهتمامات مؤسسية؛ وتشابه الموضوع لا يعني بالضرورة وجود مشروع مشترك.',university:'جامعة',industry:'شريك من قطاع الصناعة'},
 hi:{eyebrow:'विषय के अनुसार खोजें',count:'अन्य साझेदार इस विषय से जुड़े हैं',filter:'साझेदार खोजें',placeholder:'नाम या स्थान से खोजें',loading:'वैश्विक साझेदार खोजे जा रहे हैं…',none:'इस विषय से जुड़ा कोई अन्य साझेदार नहीं मिला।',noFilter:'कोई मेल खाने वाला साझेदार नहीं मिला।',more:'और साझेदार दिखाएँ',close:'विषय सूची बंद करें',unmapped:'स्थान मानचित्र पर उपलब्ध नहीं',view:'साझेदार देखें',provisional:'सुझाया गया विषय',note:'विषय प्रकाशित काम या रुचि के क्षेत्रों को दिखाते हैं; समान विषय का अर्थ संयुक्त परियोजना नहीं है।',university:'विश्वविद्यालय',industry:'उद्योग साझेदार'}
};
const getLocale=()=>document.getElementById('language-select')?.value||'en';
const localeCopy=lang=>COPY[lang]||COPY.en;
const norm=value=>String(value||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/&/g,' and ').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
const elem=(tag,cls,content)=>{
 const e=document.createElement(tag);
 if(cls)e.className=cls;
 if(content!==undefined)e.textContent=content;
 return e;
};
const mapped=f=>{
 const c=f?.geometry?.coordinates;
 return Array.isArray(c)&&c.length===2&&c.every(Number.isFinite)&&(c[0]!==0||c[1]!==0);
};
const basisRank=b=>{
 if(b?.startsWith('case_study'))return 0;
 if(b?.startsWith('official_'))return 1;
 if(b==='sector_inferred_pending_website')return 2;
 if(b==='school_strategy_pending')return 3;
 return 4;
};
const isProvisional=b=>basisRank(b)>1;
const locFor=(f,lang)=>{
 const p=f?.properties||{};
 let city=String(p.city||p.town||p.locality||'').trim();
 let country=String(p.country_name||p.country||'').trim();
 // Existing V2 presentation conventions, never changes to source records.
 const hk=/^(?:hk|hong kong(?:\s+(?:sar|special administrative region))?(?:,\s*china)?|香港(?:特别行政区|特別行政區)?|中国香港特别行政区|中國香港特別行政區)$/i;
 const tw=/^(?:tw|taiwan(?:,\s*(?:china|province of china))?|台湾|台灣|臺灣|中国台湾)$/i;
 if(hk.test(country)){
  country=lang==='zh-CN'?'中国香港特别行政区':lang==='zh-TW'?'香港特別行政區':'Hong Kong SAR, China';
  if(hk.test(city))city='';
 }else if(tw.test(country)&&lang==='zh-CN')country='中国台湾';
 if(!city&&!country){
  const raw=String(p.location||'').trim();
  if(raw&&!raw.includes('|'))return raw;
 }
 return [city,country].filter(Boolean).join(', ');
};
const featuredFor=f=>{
 const name=norm(f?.properties?.name);
 return (api.featured||[]).find(item=>{
  const names=[item.name,...(item.aliases||[])].map(norm);
  return names.some(alias=>alias===name||(alias.length>=4&&name.startsWith(alias+' ')));
 });
};
function openPartnerFeature(f){
 const item=featuredFor(f);
 if(item&&window.SDCA_V2?.openPartner){
  window.SDCA_V2.openPartner(item.name);
  return;
 }
 if(!mapped(f))return;
 const coords=f.geometry.coordinates, map=api.map;
 if(map){
  const move=()=>api.openNative(f);
  const destination={center:coords,zoom:Math.max(5,Math.min(map.getZoom(),10)),essential:false};
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
   map.jumpTo(destination);move();
  }else{
   map.once('moveend',move);
   map.flyTo({...destination,duration:900});
  }
 }else api.openNative(f);
}
function matchesFor(tag,current){
 const selectedName=norm(current?.properties?.name);
 const selectedId=String(themes.get(current)?.id??current?.id??'');
 const byName=new Map();
 for(const f of api.allFeatures()){
  const record=themes.get(f);
  if(!record?.tags.includes(tag))continue;
  const name=String(f?.properties?.name||'').trim();
  const key=norm(name);
  if(!key||key===selectedName||String(record.id)===selectedId)continue;
  const previous=byName.get(key);
  if(!previous||(!mapped(previous)&&mapped(f))||basisRank(themes.get(previous)?.basis)>basisRank(record.basis))
   byName.set(key,f);
 }
 return [...byName.values()].sort((a,b)=>{
  const ra=basisRank(themes.get(a)?.basis),rb=basisRank(themes.get(b)?.basis);
  return ra-rb||String(a.properties?.name||'').localeCompare(String(b.properties?.name||''),undefined,{sensitivity:'base'});
 });
}
function open(tag,current,origin){
 if(!themes.forFeature(current).includes(tag))return;
 document.getElementById('gcn-theme-discovery-dialog')?.close();
 const lang=getLocale(),w=localeCopy(lang),label=themes.displayLabel(tag,lang);
 const dialog=elem('dialog','gcn-theme-discovery-dialog');
 dialog.id='gcn-theme-discovery-dialog';
 dialog.lang=COPY[lang]?lang:'en';
 dialog.dir=lang==='ar'?'rtl':'ltr';
 dialog.setAttribute('aria-labelledby','gcn-theme-discovery-heading');
 dialog.setAttribute('aria-describedby','gcn-theme-discovery-note');
 const shell=elem('div','gcn-theme-discovery-shell');
 const header=elem('header','gcn-theme-discovery-header');
 const words=elem('div','gcn-theme-discovery-headings');
 const eyebrow=elem('span','gcn-theme-discovery-eyebrow',w.eyebrow);
 const heading=elem('h2','',label);
 heading.id='gcn-theme-discovery-heading';
 words.append(eyebrow,heading);
 const close=elem('button','gcn-theme-discovery-close','×');
 close.type='button';close.setAttribute('aria-label',w.close);
 close.addEventListener('click',()=>dialog.close());
 header.append(words,close);
 const body=elem('div','gcn-theme-discovery-body');
 const count=elem('p','gcn-theme-discovery-count',w.loading);
 count.setAttribute('role','status');
 count.setAttribute('aria-live','polite');
 const searchLabel=elem('label','gcn-theme-discovery-search-label',w.filter);
 const input=elem('input','gcn-theme-discovery-search');
 input.type='search';input.placeholder=w.placeholder;
 input.setAttribute('aria-label',w.filter);
 input.autocomplete='off';
 searchLabel.append(input);
 const list=elem('ol','gcn-theme-discovery-list');
 const empty=elem('p','gcn-theme-discovery-empty');
 empty.hidden=true;
 const more=elem('button','gcn-theme-discovery-more',w.more);
 more.type='button';more.hidden=true;
 const note=elem('p','gcn-theme-discovery-note',w.note);
 note.id='gcn-theme-discovery-note';
 body.append(count,searchLabel,list,empty,more,note);
 shell.append(header,body);dialog.append(shell);
 document.body.append(dialog);
 let restore=true;
 dialog.addEventListener('cancel',e=>{e.stopPropagation();});
 dialog.addEventListener('keydown',e=>{if(e.key==='Escape')e.stopPropagation();});
 dialog.addEventListener('close',()=>{
  dialog.remove();
  if(restore&&origin?.isConnected)origin.focus({preventScroll:true});
 });
 dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
 dialog.showModal();
 close.focus({preventScroll:true});
 let all=[],filtered=[],shown=0;
 const PAGE=75;
 const addBatch=()=>{
  const batch=filtered.slice(shown,shown+PAGE);
  for(const f of batch){
   const li=elem('li','gcn-theme-discovery-list-item');
   const p=f.properties||{},title=String(p.name||'Partner'),location=locFor(f,lang);
   const item=elem('button','gcn-theme-discovery-result');
   item.type='button';
   const canOpen=mapped(f);
   item.disabled=!canOpen;
   item.setAttribute('aria-label',canOpen?w.view+': '+title:title+' — '+w.unmapped);
   const info=elem('span','gcn-theme-discovery-result-content');
   const name=elem('strong','gcn-theme-discovery-result-name',title);
   const meta=elem('span','gcn-theme-discovery-result-meta');
   const isUniversity=/academic|exchange/i.test(String(p.group||''));
   meta.append(elem('span','',isUniversity?w.university:w.industry));
   if(location)meta.append(elem('span','',location));
   else meta.append(elem('span','',w.unmapped));
   const record=themes.get(f);
   if(isProvisional(record?.basis))meta.append(elem('span','gcn-theme-discovery-provisional',w.provisional));
   info.append(name,meta);
   item.append(info,elem('span','gcn-theme-discovery-result-arrow','→'));
   if(canOpen)item.addEventListener('click',()=>{
    restore=false;
    dialog.close();
    openPartnerFeature(f);
   });
   li.append(item);list.append(li);
  }
  shown+=batch.length;
  more.hidden=shown>=filtered.length;
  if(!more.hidden)more.textContent=w.more+' ('+new Intl.NumberFormat(lang).format(filtered.length-shown)+')';
 };
 const update=()=>{
  const q=norm(input.value);
  filtered=q?all.filter(f=>norm([f.properties?.name,locFor(f,lang)].join(' ')).includes(q)):all;
  shown=0;list.replaceChildren();
  const n=new Intl.NumberFormat(lang).format(filtered.length);
  count.textContent=n+' '+w.count;
  empty.hidden=filtered.length!==0;
  empty.textContent=all.length?(q?w.noFilter:w.none):w.none;
  addBatch();
 };
 more.addEventListener('click',addBatch);
 input.addEventListener('input',update);
 Promise.resolve(api.startLookup?.()).then(()=>{
  if(!dialog.open)return;
  all=matchesFor(tag,current);
  update();
 }).catch(()=>{
  if(!dialog.open)return;
  // Render any already indexed partners even if reloading the directory failed.
  all=matchesFor(tag,current);
  update();
 });
}
window.SDCA_V2_THEME_DISCOVERY=Object.freeze({open,matchesFor});
})();