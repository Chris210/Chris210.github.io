/* V2-only evidence of excellence, faithfully adapted from supplied SDCA achievement graphics. */
(function(){
'use strict';
const host=document.getElementById('v2-root');
const picker=document.getElementById('language-select');
if(!host||!picker)return;
const facts=[
 {value:'100%',key:'impact',source:'REF 2021',tone:'pink'},
 {value:'1ST',key:'prospects',source:'The Guardian University Guide 2027',tone:'purple'},
 {value:'4TH',key:'ukRank',source:'The Times and Sunday Times Good University Guide 2027',tone:'purple'},
 {value:'£21M',key:'building',source:'',tone:'pink'},
 {value:'93%',key:'support',source:'National Student Survey 2026',tone:'purple'},
 {value:'2ND',key:'salary',source:'Longitudinal Education Outcomes · Performing arts',tone:'purple'}
];
const translations={
 en:{
 heading:'Evidence of excellence',previous:'Previous achievements',next:'Next achievements',
 impact:'of research impact in Art and Design rated “world-leading” or “internationally excellent”',
 prospects:'for Graduate Prospects in Product Design',
 ukRank:'in the UK for Art and Design',
 building:'Purpose-built Design building',
 support:'of Design students were positive about academic support on their course',
 salary:'in the UK for median average salary five years after graduation'
 },
 'zh-CN':{
 heading:'卓越成就',previous:'上一组成就',next:'下一组成就',
 impact:'艺术与设计研究影响力获评“世界领先”或“国际卓越”',
 prospects:'产品设计专业毕业生就业前景排名',ukRank:'英国艺术与设计专业排名',
 building:'专为设计学科建造的教学大楼',support:'设计专业学生对课程学术支持持积极评价',
 salary:'英国表演艺术专业毕业五年后薪资中位数排名'
 },
 'zh-TW':{
 heading:'卓越成就',previous:'上一組成就',next:'下一組成就',
 impact:'藝術與設計研究影響力獲評「世界領先」或「國際卓越」',
 prospects:'產品設計專業畢業生就業前景排名',ukRank:'英國藝術與設計專業排名',
 building:'專為設計學科建造的教學大樓',support:'設計專業學生對課程學術支援持正面評價',
 salary:'英國表演藝術專業畢業五年後薪資中位數排名'
 },
 ja:{
 heading:'優れた実績',previous:'前の実績',next:'次の実績',
 impact:'アート＆デザイン分野の研究インパクトが「世界トップレベル」または「国際的に卓越」と評価',
 prospects:'プロダクトデザイン分野の卒業後の進路で第1位',
 ukRank:'英国のアート＆デザイン分野で第4位',
 building:'デザイン専用に建設された校舎',
 support:'デザイン専攻の学生が授業での学習支援を高く評価',
 salary:'英国の舞台芸術分野で卒業5年後の給与中央値が第2位'
 },
 ko:{
 heading:'탁월한 성과',previous:'이전 성과',next:'다음 성과',
 impact:'예술·디자인 연구 영향력이 세계 선도 수준 또는 국제 우수 수준으로 평가',
 prospects:'제품 디자인 졸업생 진로 전망 1위',
 ukRank:'영국 예술·디자인 분야 4위',
 building:'디자인을 위해 특별히 건립된 건물',
 support:'디자인 전공 학생들이 학업 지원에 긍정적으로 응답',
 salary:'영국 공연예술 분야 졸업 5년 후 급여 중앙값 2위'
 }
};
const block=document.createElement('section');
block.id='v2-achievements';
block.setAttribute('aria-label','Evidence of excellence');
block.innerHTML='<div class="v2-achievements-head"><span class="v2-achievements-heading"></span><div class="v2-achievements-controls"><button type="button" class="v2-achievements-prev" aria-label="Previous achievements">‹</button><span class="v2-achievements-count" aria-live="off"></span><button type="button" class="v2-achievements-next" aria-label="Next achievements">›</button></div></div><div class="v2-achievements-cards" aria-live="polite"></div>';
host.append(block);
let page=0;
const mobile=window.matchMedia('(max-width: 1240px)');
const rows=()=>mobile.matches?1:3;
const current=()=>translations[picker.value]||translations.en;
const txt=key=>current()[key]||translations.en[key]||key;
const medal='<svg viewBox="0 0 28 30" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" focusable="false" aria-hidden="true"><path d="m14 2.5 2.7 2.4 3.4-.2.6 3.4 2.7 2-1.7 3 1.1 3.3-3.3 1.3-1.7 2.8-3.8-1-3.8 1-1.7-2.8-3.3-1.3 1.1-3.3-1.7-3 2.7-2 .6-3.4 3.4.2Z"/><circle cx="14" cy="12.6" r="4.3"/><path d="m10.5 20.4-2.2 7 5.7-2.7 5.7 2.7-2.2-7"/></svg>';
function render(){
 const perPage=rows(),pages=Math.ceil(facts.length/perPage);
 page=(page+pages)%pages;
 block.lang=picker.value;
 block.dir=['ar','ur','ms-Arab'].includes(picker.value)?'rtl':'ltr';
 block.setAttribute('aria-label',txt('heading'));
 block.querySelector('.v2-achievements-heading').textContent=txt('heading');
 block.querySelector('.v2-achievements-prev').setAttribute('aria-label',txt('previous'));
 block.querySelector('.v2-achievements-next').setAttribute('aria-label',txt('next'));
 block.querySelector('.v2-achievements-count').textContent=(page+1)+' / '+pages;
 const cards=block.querySelector('.v2-achievements-cards');
 cards.replaceChildren();
 facts.slice(page*perPage,(page+1)*perPage).forEach(f=>{
  const card=document.createElement('article');
  card.className='v2-achievement-card v2-achievement-'+f.tone;
  const badge=document.createElement('span');badge.className='v2-achievement-rosette';badge.innerHTML=medal;badge.setAttribute('aria-hidden','true');
  const content=document.createElement('div');content.className='v2-achievement-content';
  const value=document.createElement('strong');value.className='v2-achievement-value';value.textContent=f.value;
  const desc=document.createElement('span');desc.className='v2-achievement-description';desc.textContent=txt(f.key);
  content.append(value,desc);
  card.append(badge,content);
  if(f.source){const cite=document.createElement('small');cite.className='v2-achievement-source';cite.textContent=f.source;card.append(cite);}
  cards.append(card);
 });
}
block.querySelector('.v2-achievements-prev').addEventListener('click',()=>{page--;render();});
block.querySelector('.v2-achievements-next').addEventListener('click',()=>{page++;render();});
picker.addEventListener('change',render);
document.addEventListener('sdca-v2-viewchange',e=>{
 block.hidden=e.detail.mode!=='home'||Boolean(e.detail.minimised);
});
const resizer=()=>{page=0;render();};
if(mobile.addEventListener)mobile.addEventListener('change',resizer);
else mobile.addListener(resizer);
block.hidden=Boolean(document.getElementById('v2-home')?.hidden);
render();
})();
