/* V2-only theme explorer. Uses the full authoritative partner index, not map viewport. */
(function(){
'use strict';
const api=window.SDCA_V2_BRIDGE;
const themes=window.SDCA_V2_THEMES;
const qsSource=window.SDCA_V2_QS_RANKINGS;
const caseSource=window.SDCA_V2_CASE_STUDY_DATA;
if(!api||!themes)return;
const COPY={
 en:{eyebrow:'EXPLORE A THEME',count:'other partners share this theme',filter:'Search these partners',placeholder:'Filter by partner name or location',loading:'Finding partners across the global network…',none:'No other partners match this theme.',noFilter:'No partners match your search.',more:'Show more partners',close:'Close theme explorer',unmapped:'Location not mapped',view:'View partner',provisional:'Suggested area',note:'Themes reflect documented work or areas of interest; a matching tag does not necessarily mean a joint project.',university:'University',industry:'Industry partner',ordered:'Curated for Art & Design reputation · not an official QS ranking',qs:'QS Art & Design',study:'published case study',studies:'published case studies'},
 'zh-CN':{eyebrow:'探索主题',count:'个其他合作伙伴涉及此主题',filter:'搜索相关合作伙伴',placeholder:'按名称或地点筛选',loading:'正在查找全球合作伙伴…',none:'没有其他合作伙伴符合此主题。',noFilter:'没有符合搜索条件的合作伙伴。',more:'显示更多合作伙伴',close:'关闭主题浏览',unmapped:'地点暂未标注',view:'查看合作伙伴',provisional:'建议的主题',note:'主题依据公开的合作成果或机构关注领域整理；相同主题不一定表示双方开展过联合项目。',university:'大学',industry:'行业合作伙伴',ordered:'按艺术与设计领域声誉排序 · 非QS官方排名',qs:'QS 艺术与设计',study:'已发表案例',studies:'已发表案例'},
 'zh-TW':{eyebrow:'探索主題',count:'個其他合作夥伴涉及此主題',filter:'搜尋相關合作夥伴',placeholder:'按名稱或地點篩選',loading:'正在尋找全球合作夥伴…',none:'沒有其他合作夥伴符合此主題。',noFilter:'沒有符合搜尋條件的合作夥伴。',more:'顯示更多合作夥伴',close:'關閉主題瀏覽',unmapped:'地點尚未標示',view:'查看合作夥伴',provisional:'建議主題',note:'主題反映已公開的合作成果或機構關注領域；相同主題不一定代表共同研究計畫。',university:'大學',industry:'業界合作夥伴',ordered:'按藝術與設計領域聲譽排序 · 非QS官方排名',qs:'QS 藝術與設計',study:'已公開案例',studies:'已公開案例'},
 ja:{eyebrow:'テーマを探す',count:'件の関連パートナー',filter:'パートナーを検索',placeholder:'名称・所在地で絞り込む',loading:'世界のパートナーを検索中…',none:'同じテーマの他のパートナーはいません。',noFilter:'該当するパートナーがありません。',more:'さらに表示',close:'テーマ一覧を閉じる',unmapped:'所在地未登録',view:'パートナーを見る',provisional:'暫定的なテーマ',note:'テーマは公開された活動や関心分野に基づきます。同じテーマでも共同研究を意味するものではありません。',university:'大学',industry:'企業パートナー',ordered:'アート＆デザイン分野の評判を考慮した編集上の順序です（QS公式順位ではありません）',qs:'QS アート＆デザイン',study:'公開事例',studies:'公開事例'},
 ar:{eyebrow:'استكشف الموضوع',count:'شريك آخر في هذا المجال',filter:'ابحث عن الشركاء',placeholder:'البحث بالاسم أو الموقع',loading:'جارٍ البحث عن الشركاء عالميًا…',none:'لا يوجد شركاء آخرون في هذا الموضوع.',noFilter:'لا توجد نتائج مطابقة.',more:'عرض المزيد من الشركاء',close:'إغلاق قائمة الموضوع',unmapped:'الموقع غير محدد على الخريطة',view:'عرض الشريك',provisional:'موضوع مقترح',note:'تستند الموضوعات إلى أعمال موثّقة أو اهتمامات مؤسسية؛ وتشابه الموضوع لا يعني بالضرورة وجود مشروع مشترك.',university:'جامعة',industry:'شريك من قطاع الصناعة',ordered:'ترتيب تحريري بحسب السمعة في الفن والتصميم، وليس تصنيف QS رسميًا',qs:'QS الفنون والتصميم',study:'دراسة حالة منشورة',studies:'دراسات حالة منشورة'},
 hi:{eyebrow:'विषय के अनुसार खोजें',count:'अन्य साझेदार इस विषय से जुड़े हैं',filter:'साझेदार खोजें',placeholder:'नाम या स्थान से खोजें',loading:'वैश्विक साझेदार खोजे जा रहे हैं…',none:'इस विषय से जुड़ा कोई अन्य साझेदार नहीं मिला।',noFilter:'कोई मेल खाने वाला साझेदार नहीं मिला।',more:'और साझेदार दिखाएँ',close:'विषय सूची बंद करें',unmapped:'स्थान मानचित्र पर उपलब्ध नहीं',view:'साझेदार देखें',provisional:'सुझाया गया विषय',note:'विषय प्रकाशित काम या रुचि के क्षेत्रों को दिखाते हैं; समान विषय का अर्थ संयुक्त परियोजना नहीं है।',university:'विश्वविद्यालय',industry:'उद्योग साझेदार',ordered:'कला एवं डिज़ाइन प्रतिष्ठा के लिए संपादकीय क्रम · आधिकारिक QS रैंकिंग नहीं',qs:'QS कला एवं डिज़ाइन',study:'प्रकाशित केस स्टडी',studies:'प्रकाशित केस स्टडीज़'}
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
// Country fallback derived from current directory coordinates using Natural Earth
// 1:110m admin-0 country polygons (public domain). Coordinate keys prevent changed
// locations from inheriting stale country assignments.
const countryByCoordinate={"-0.09461,51.43314":"United Kingdom","-1.323596,52.350531":"United Kingdom","-0.878004676,52.27681039":"United Kingdom","-1.336501076,51.23094078":"United Kingdom","54.54112171,24.39528956":"United Arab Emirates","24.96060921,60.18214538":"Finland","10.75463858,59.92539106":"Norway","-0.082185257,51.51163205":"United Kingdom","-0.09893,51.52449":"United Kingdom","139.7280135,35.63939252":"Japan","-7.550965574,43.01373834":"Spain","-2.50424,51.41289":"United Kingdom","1.382258,43.626259":"France","-0.095202,51.506401":"United Kingdom","0.835833126,51.66168615":"United Kingdom","-2.281835816,53.77805031":"United Kingdom","-0.7359,51.50794":"United Kingdom","-1.342231372,52.69740212":"United Kingdom","0.71726,51.56187":"United Kingdom","-1.136485589,52.6530737":"United Kingdom","-1.96473,51.8722":"United Kingdom","-0.667112989,51.65253556":"United Kingdom","-1.28416,51.79412":"United Kingdom","-2.140147218,51.35380358":"United Kingdom","-3.27125,55.94125":"United Kingdom","-1.30406,53.4905":"United Kingdom","-2.892406701,53.74950118":"United Kingdom","-0.1451,51.51256":"United Kingdom","-0.708443203,51.08900437":"United Kingdom","-0.678559747,52.30659936":"United Kingdom","-2.741262,54.214097":"United Kingdom","-2.47224,53.1059":"United Kingdom","-0.312742491,51.49869104":"United Kingdom","-0.863164389,52.27378725":"United Kingdom","-0.055891192,51.53530968":"United Kingdom","-0.74309,51.51632":"United Kingdom","-0.14569,51.5206":"United Kingdom","8.437290362,47.1621034":"Switzerland","7.557734097,47.20971757":"Switzerland","1.003401,52.184292":"United Kingdom","-0.78078,51.61658":"United Kingdom","-0.11623,51.49994":"United Kingdom","-2.9968,53.4174":"United Kingdom","-1.54684,53.79713":"United Kingdom","-0.112933976,51.51167391":"United Kingdom","98.37029602,7.950793252":"Thailand","-1.49514,52.99454":"United Kingdom","-0.131364301,51.50748283":"United Kingdom","-0.42598,51.75558":"United Kingdom","-0.10610317,51.53079124":"United Kingdom","2.260992,48.846261":"France","-1.50776,53.80414":"United Kingdom","0.14456,52.23226":"United Kingdom","-0.50692,51.43608":"United Kingdom","-3.44806,56.40546":"United Kingdom","-0.90813,52.88882":"United Kingdom","-1.91055,52.29121":"United Kingdom","-1.25735,54.57919":"United Kingdom","-2.70319,53.75832":"United Kingdom","0.87522,51.88516":"United Kingdom","-0.36255,51.04436":"United Kingdom","-0.145831189,51.47249169":"United Kingdom","114.1721732,22.34081554":"China","-0.338441003,51.44417373":"United Kingdom","-1.54699,52.27672":"United Kingdom","100.6107765,13.69088907":"Thailand","-0.6308,52.06982":"United Kingdom","0.01888,51.48875":"United Kingdom","-1.091706374,52.62807044":"United Kingdom","-2.58421,51.45003":"United Kingdom","-2.99088,53.40953":"United Kingdom","115.8919818,-32.00523742":"Australia","-0.073793845,51.65932203":"United Kingdom","-1.826907731,52.44653779":"United Kingdom","-1.58768,52.28169":"United Kingdom","2.362244053,48.8668326":"France","-0.33814,50.8225":"United Kingdom","4.373630241,52.0023636":"Netherlands","-0.10778,51.51596":"United Kingdom","-0.39438,51.68031":"United Kingdom","-2.24733056,53.4795084":"United Kingdom","-3.477114074,53.2548006":"United Kingdom","9.481242726,55.48650437":"Denmark","-0.61685,51.48302":"United Kingdom","-0.94965,52.80168":"United Kingdom","-1.270399462,52.08815311":"United Kingdom","-0.13917,51.51465":"United Kingdom","-1.21314,52.78173":"United Kingdom","-0.08365,51.52562":"United Kingdom","-1.138893545,52.62348865":"United Kingdom","-0.2227,51.49164":"United Kingdom","-6.27068282,53.38087096":"Ireland","-0.09357,51.53066":"United Kingdom","-1.14019,52.03552":"United Kingdom","-2.20696,53.35547":"United Kingdom","-0.09016,51.52101":"United Kingdom","-0.60841,51.48018":"United Kingdom","-2.21832,51.74274":"United Kingdom","-2.103762,51.594842":"United Kingdom","-1.79762,52.68486":"United Kingdom","114.12915,22.28082":"China","-0.03964,51.46522":"United Kingdom","-1.229343418,52.785794":"United Kingdom","-0.96242,51.14913":"United Kingdom","-0.08014,51.4994":"United Kingdom","26.51077886,42.62660369":"Bulgaria","0.719503457,51.3452589":"United Kingdom","55.28041107,25.21162328":"United Arab Emirates","-1.09585,52.71044":"United Kingdom","-0.08006,51.49965":"United Kingdom","-0.608,51.492":"United Kingdom","17.96055097,59.35919113":"Sweden","13.46009846,52.49845967":"Germany","-1.20769,53.16802":"United Kingdom","-0.24226,51.49369":"United Kingdom","-2.3305,53.46294":"United Kingdom","4.882090811,52.37178288":"Netherlands","-99.192374,19.41134":"Mexico","-0.07532,51.50352":"United Kingdom","-0.03077,51.80916":"United Kingdom","-0.099311989,51.36800825":"United Kingdom","-110.9171157,32.26566876":"United States","-0.11771,51.51093":"United Kingdom","-0.808462859,51.2119911":"United Kingdom","-0.33121,51.30194":"United Kingdom","0.474567698,51.75235203":"United Kingdom","-0.99726546,51.09409056":"United Kingdom","-1.89594,52.48379":"United Kingdom","-1.145010831,52.94027412":"United Kingdom","-0.014,51.505":"United Kingdom","-1.444433929,53.396253":"United Kingdom","5.480190549,51.43648864":"Netherlands","113.560449,23.41815868":"China","-0.46512,51.35147":"United Kingdom","-0.18433,51.55519":"United Kingdom","113.9131574,22.48701153":"China","-0.188595072,51.58143481":"United Kingdom","-0.14954,51.57241":"United Kingdom","120.2211958,30.20903094":"China","-1.204693431,53.19873025":"United Kingdom","-1.46797,54.00913":"United Kingdom","-0.928781857,51.4606672":"United Kingdom","-0.78238,51.40999":"United Kingdom","-0.115997936,51.50319839":"United Kingdom","0.292754497,51.16101931":"United Kingdom","-1.46299,50.98262":"United Kingdom","-1.192990389,52.60180273":"United Kingdom","-2.38133,53.30263":"United Kingdom","-1.19767,52.76572":"United Kingdom","-1.794373301,51.07159828":"United Kingdom","-2.24114,53.48017":"United Kingdom","114.046,22.5074":"China","-0.015031705,51.5041098":"United Kingdom","0.6832,51.172362":"United Kingdom","-0.08231156,51.52461815":"United Kingdom","18.072624,59.30973892":"Sweden","-1.876275645,52.51708016":"United Kingdom","-4.205953145,55.76643016":"United Kingdom","1.071,51.274":"United Kingdom","9.219975913,56.61690136":"Denmark","-1.4914,52.38374":"United Kingdom","-0.14458,51.44504":"United Kingdom","0.24632,50.85944":"United Kingdom","-0.391584103,51.66505737":"United Kingdom","-1.495096704,53.41313603":"United Kingdom","139.3896952,35.54805351":"Japan","-122.132097,47.580975":"United States","135.5107369,34.77345814":"Japan","-94.58341663,39.04686504":"United States","-1.6875,53.76055":"United Kingdom","-2.05459,51.90677":"United Kingdom","12.191467,48.98406":"Germany","-0.75209,51.31534":"United Kingdom","-0.83447,51.72807":"United Kingdom","-0.05863,51.53388":"United Kingdom","-2.36843,51.86674":"United Kingdom","9.132400102,55.7220709":"Denmark","-1.18477,52.5919":"United Kingdom","-0.1398,51.51744":"United Kingdom","-1.16311723,51.36140964":"United Kingdom","-71.41146437,41.81847":"United States","-0.02126,51.54069":"United Kingdom","-1.13617,52.63256":"United Kingdom","2.343148453,48.85905275":"France","-0.09765,51.50467":"United Kingdom","-1.22947,52.76487":"United Kingdom","12.49351483,55.83619281":"Denmark","139.6765243,35.63375515":"Japan","-2.34722,53.38901":"United Kingdom","-0.581411,51.484333":"United Kingdom","-0.5476,51.34608":"United Kingdom","-1.922499645,52.41556222":"United Kingdom","-2.07475,52.2981":"United Kingdom","-3.47565,50.72762":"United Kingdom","-0.12434,51.50281":"United Kingdom","-1.14511,52.88264":"United Kingdom","32.78004351,39.88992778":"Türkiye","-0.09805,51.52103":"United Kingdom","0.998696038,52.58043539":"United Kingdom","-1.30887636,52.64920588":"United Kingdom","-0.48026,51.55586":"United Kingdom","-2.325548718,51.35775967":"United Kingdom","-0.703940491,52.02079614":"United Kingdom","-0.069756543,52.21970892":"United Kingdom","103.6830596,1.348588771":"Malaysia","-1.952,51.077":"United Kingdom","11.5569413,48.12771699":"Germany","6.834783522,46.4816099":"Switzerland","-106.7490533,32.27951544":"United States","-0.73749,51.4111":"United Kingdom","-0.122978874,51.57759319":"United Kingdom","-0.08944,51.50974":"United Kingdom","-1.486426631,55.00365484":"United Kingdom","10.40181307,63.419755":"Norway","-2.94913,50.87061":"United Kingdom","-0.72746,52.66999":"United Kingdom","-0.235805373,51.76922413":"United Kingdom","-3.12139,54.15904":"United Kingdom","-0.115645032,51.51352699":"United Kingdom","-0.41254,50.83144":"United Kingdom","11.73228135,51.13127406":"Germany","-1.3395,52.85066":"United Kingdom","114.2238108,22.309294":"China","-0.93954,51.45984":"United Kingdom","-0.143487412,51.94570081":"United Kingdom","-1.32616,51.40577":"United Kingdom","-0.07272,51.55085":"United Kingdom","-0.10032,51.52385":"United Kingdom","0.09347,51.53314":"United Kingdom","114.1946049,22.40141391":"China","-0.068918232,51.53157271":"United Kingdom","11.30389849,48.04076989":"Germany","-0.78939,51.61159":"United Kingdom","5.457456249,51.41281379":"Netherlands","-1.020724433,51.95070293":"United Kingdom","0.985111441,52.04117539":"United Kingdom","-0.043738632,51.57068411":"United Kingdom","14.29193548,46.64817052":"Austria","-1.301033976,51.40126207":"United Kingdom","9.227133175,45.47916916":"Italy","114.1481943,22.28579307":"China","-0.62632,52.2941":"United Kingdom","-0.10762,51.5216":"United Kingdom","114.2185189,22.31225534":"China","-0.17382,51.46128":"United Kingdom","-1.85482,50.78486":"United Kingdom","-0.21336,51.65586":"United Kingdom","-1.245959089,51.69245089":"United Kingdom","-1.52343,51.96358":"United Kingdom","8.216520913,50.08058491":"Germany","-3.597352389,50.35110158":"United Kingdom","-1.14465,52.95279":"United Kingdom","-0.745576647,50.85379932":"United Kingdom","-1.75246,51.89372":"United Kingdom","-2.40232,51.38568":"United Kingdom","-1.98221,53.33278":"United Kingdom","-1.996817101,52.31804285":"United Kingdom","-1.15488,52.95612":"United Kingdom","-0.742695189,52.67147629":"United Kingdom","-0.08043,51.51666":"United Kingdom","12.90329208,41.46228027":"Italy","-0.40267,51.56057":"United Kingdom","-1.15793,52.97857":"United Kingdom","-0.74819,52.40945":"United Kingdom","0.063145655,51.76486871":"United Kingdom","10.68469913,53.87871046":"Germany","5.368701742,52.16579218":"Netherlands","0.195453084,51.26637483":"United Kingdom","-0.22563,51.49274":"United Kingdom","-0.97667,51.45511":"United Kingdom","4.35861577,50.85037945":"Belgium","139.7948935,35.66077725":"Japan","-0.14177,51.49237":"United Kingdom","9.214493353,45.44129773":"Italy","-0.272215132,51.95034437":"United Kingdom","4.892049769,52.38011796":"Netherlands","0.06314,51.76428":"United Kingdom","-0.0874,51.51503":"United Kingdom","-1.504489089,52.34307714":"United Kingdom","-0.36574,52.76139":"United Kingdom","-4.421762053,36.72361122":"Spain","151.1999331,-33.93864486":"Australia","-0.45902,51.83426":"United Kingdom","-0.15543,51.46518":"United Kingdom","-1.273357036,51.77804142":"United Kingdom","-0.15478,51.47363":"United Kingdom","-3.41681666,56.0474323":"United Kingdom","-1.58109,54.97093":"United Kingdom","-0.638552289,51.52585796":"United Kingdom","-1.240871171,53.43255881":"United Kingdom","14.17632887,46.65881892":"Austria","-1.377167555,53.09031416":"United Kingdom","-1.377497272,53.08899743":"United Kingdom","55.37742755,25.12190656":"United Arab Emirates","-0.2053,51.47578":"United Kingdom","4.893334628,52.40422259":"Netherlands","-2.113647558,52.45853805":"United Kingdom","-2.608583857,51.44720842":"United Kingdom","-1.512668903,53.66689928":"United Kingdom","0.171742,52.072163":"United Kingdom","-0.44253,51.76491":"United Kingdom","-1.171973068,51.08189579":"United Kingdom","-0.20817,51.52602":"United Kingdom","-3.152616731,53.4049611":"United Kingdom","-0.10145,51.52032":"United Kingdom","-1.716860048,51.44453483":"United Kingdom","-2.75751762,51.12592801":"United Kingdom","-1.50328,52.70901":"United Kingdom","0.021724,52.090643":"United Kingdom","114.135514,22.36432515":"China","4.800915669,52.45327824":"Netherlands","-0.08015,51.49276":"United Kingdom","13.379055,52.506064":"Germany","-83.73819637,42.27734343":"United States","9.181037397,45.46890747":"Italy","-73.61372702,45.50577347":"Canada","-1.659415788,42.80159512":"Spain","151.2005368,-33.88347554":"Australia","7.150036681,51.24522495":"Germany","-0.901023706,41.64216008":"Spain","-0.078270545,51.54299915":"United Kingdom","-0.725241403,52.58811876":"United Kingdom","-3.582686845,50.35113546":"United Kingdom","-4.269971915,53.17880056":"United Kingdom","-0.6098,51.69872":"United Kingdom","-0.07108,51.52528":"United Kingdom","151.203954,-33.869795":"Australia","-0.328033796,53.78271116":"United Kingdom","-1.186104087,52.93735863":"United Kingdom","-80.42335233,37.22854658":"United States","-2.97339,53.38011":"United Kingdom","-0.16714,51.13318":"United Kingdom","11.64570336,52.2340388":"Germany","-0.097158263,51.54669751":"United Kingdom","-0.26321,51.52739":"United Kingdom","-1.928728101,52.89531672":"United Kingdom","9.200568403,45.46844169":"Italy","-0.08892,51.52727":"United Kingdom","-2.510074189,52.7025926":"United Kingdom","116.4996133,40.02230939":"China","-0.321297789,52.53859278":"United Kingdom","-0.88448,51.43681":"United Kingdom","114.02752,22.61337":"China","-0.127647,51.5073":"United Kingdom","-1.149646,52.953419":"United Kingdom","-1.206163,52.772102":"United Kingdom","-0.728124,52.67047":"United Kingdom","-1.427393,53.23586":"United Kingdom","-1.133079,52.63614":"United Kingdom","10.91741,49.579095":"Germany","-1.547372,52.577522":"United Kingdom","-2.701376,53.759697":"United Kingdom","-1.161341,51.09059":"United Kingdom","-5.930276,54.596441":"United Kingdom","-1.510477,52.408181":"United Kingdom","-3.834905,51.017727":"United Kingdom","-2.220658,52.191185":"United Kingdom","-1.543094,53.993736":"United Kingdom","-3.188375,55.953346":"United Kingdom","-2.597298,51.453802":"United Kingdom","-2.245115,53.479489":"United Kingdom","-0.205921,51.23765":"United Kingdom","-2.97019,56.460594":"United Kingdom","-0.359332,51.468834":"United Kingdom","-1.471825,52.746967":"United Kingdom","-2.127567,52.584765":"United Kingdom","-0.07935,51.52075":"United Kingdom","-2.20183,51.318718":"United Kingdom","-0.901533,52.331135":"United Kingdom","-1.464853,54.973342":"United Kingdom","-4.248879,55.860982":"United Kingdom","0.123582,52.203482":"United Kingdom","-0.023287,52.976616":"United Kingdom","-1.986181,50.714058":"United Kingdom","-1.476149,52.921262":"United Kingdom","-3.179193,51.481655":"United Kingdom","1.230922,6.132853":"Togo","-2.991665,53.407154":"United Kingdom","-2.745675,54.328354":"United Kingdom","-73.123873,42.438517":"United States","0.281777,51.451157":"United Kingdom","-0.140374,50.821026":"United Kingdom","-1.0867,51.262432":"United Kingdom","-2.754795,52.70726":"United Kingdom","-3.327171,50.906277":"United Kingdom","-0.242734,52.572577":"United Kingdom","0.648386,51.542744":"United Kingdom","26.102684,44.436141":"Romania","-2.703756,54.849808":"United Kingdom","8.531208,52.018917":"Germany","-6.260559,53.34938":"Ireland","-3.102856,51.014896":"United Kingdom","-2.592407,53.389088":"United Kingdom","-0.885737,52.764256":"United Kingdom","-1.132309,53.52273":"United Kingdom","-1.78202,53.6464":"United Kingdom","-1.543794,53.797418":"United Kingdom","-2.245,53.789696":"United Kingdom","-2.157589,51.992477":"United Kingdom","-0.54513,51.431915":"United Kingdom","-2.890895,53.190887":"United Kingdom","9.188558,45.463945":"Italy","103.808053,1.351616":"Malaysia","4.9,52.378":"Netherlands","-1.557113,54.68935":"United Kingdom","0.191575,51.270943":"United Kingdom","2.348392,48.853495":"France","-2.137909,51.37355":"United Kingdom","-2.24894,52.38794":"United Kingdom","12.918421,43.750893":"Italy","0.473644,51.733253":"United Kingdom","12.569734,55.675313":"Denmark","0.730225,52.03827":"United Kingdom","-1.575854,54.776415":"United Kingdom","-0.608021,51.482986":"United Kingdom","6.773766,51.22615":"Germany","-0.278073,51.94771":"United Kingdom","-1.777595,52.412758":"United Kingdom","-79.642784,43.589054":"Canada","114.05471,22.535383":"China","-1.751919,53.794423":"United Kingdom","-0.937271,51.00362":"United Kingdom","72.87872,19.077793":"India","-2.715173,52.055381":"United Kingdom","-0.225825,51.763466":"United Kingdom","-0.749504,51.4167":"United Kingdom","114.170806,22.28017":"China","-2.201855,51.724763":"United Kingdom","-0.399059,51.27126":"United Kingdom","-1.470228,53.380663":"United Kingdom","-1.91589,52.48491":"United Kingdom","-1.902691,52.479699":"United Kingdom","-1.16312,52.57648":"United Kingdom","-0.921053,52.47796":"United Kingdom","114.16255,22.279356":"China","-0.757416,52.043182":"United Kingdom","-0.972165,51.455647":"United Kingdom","-0.777712,50.836395":"United Kingdom","0.522622,51.275127":"United Kingdom","-2.843595,53.487613":"United Kingdom","-2.445733,53.097829":"United Kingdom","-2.245819,51.865371":"United Kingdom","-1.21189,52.587536":"United Kingdom","-1.613157,54.973847":"United Kingdom","5.480267,51.43773":"Netherlands","-1.731982,53.017883":"United Kingdom","-1.632841,53.71417":"United Kingdom","-2.245819,51.865353":"United Kingdom","-1.316242,51.063354":"United Kingdom","0.897737,51.888554":"United Kingdom","-0.398881,51.655445":"United Kingdom","-0.722244,52.086823":"United Kingdom","-1.205036,52.649666":"United Kingdom","-1.675035,48.093193":"France","-0.692194,52.30292":"United Kingdom","-0.74455,50.8536":"United Kingdom","-2.48445,53.748093":"United Kingdom","-1.782255,51.559284":"United Kingdom","-0.10617,51.000088":"United Kingdom","-0.377195,52.768204":"United Kingdom","1.15469,52.05716":"United Kingdom","-2.073932,51.900513":"United Kingdom","-1.262117,52.373035":"United Kingdom","-0.895914,52.238144":"United Kingdom","-0.306069,51.45954":"United Kingdom","151.20695,-33.86873":"Australia","-2.117623,52.806293":"United Kingdom","-2.437106,50.71316":"United Kingdom","-118.308108,34.182075":"United States","-2.359696,51.381386":"United Kingdom","-0.468511,52.13685":"United Kingdom","-5.052056,50.26337":"United Kingdom","-1.535539,52.290363":"United Kingdom","-1.587552,52.281216":"United Kingdom","-0.189221,53.940395":"United Kingdom","0.150491,51.44169":"United Kingdom","-0.190115,51.11604":"United Kingdom","-2.181261,53.016201":"United Kingdom","-0.812757,51.81684":"United Kingdom","18.06902,59.324337":"Sweden","-0.47904,51.54588":"United Kingdom","-2.59687,51.45577":"United Kingdom","-0.977537,51.148518":"United Kingdom","-8.549347,41.537958":"Portugal","-74.005994,40.712749":"United States","-0.751436,51.629547":"United Kingdom","139.692526,35.68882":"Japan","-1.258646,51.75355":"United Kingdom","54.377438,24.453524":"United Arab Emirates","-2.150379,52.267091":"United Kingdom","116.46313818465818,39.98483474118227":"China","121.50663194444444,31.2827":"China","72.91373737,19.13204165":"India","120.15587,30.2455":"China","46.71712409,24.85189031":"Saudi Arabia","0.926,51.315":"United Kingdom","-2.157,53.41":"United Kingdom","-1.316,51.0629":"United Kingdom","-0.9781,51.4543":"United Kingdom","0.061,51.823":"United Kingdom","31.204,30.058":"Egypt","0.521,51.611":"United Kingdom","1.194608,51.221003":"United Kingdom"};
const countryNames={"fiji":"Fiji","tanzania":"Tanzania","united republic of tanzania":"Tanzania","western sahara":"Western Sahara","w. sahara":"Western Sahara","canada":"Canada","united states":"United States","united states of america":"United States","kazakhstan":"Kazakhstan","uzbekistan":"Uzbekistan","papua new guinea":"Papua New Guinea","indonesia":"Indonesia","argentina":"Argentina","chile":"Chile","congo - kinshasa":"Congo - Kinshasa","democratic republic of the congo":"Congo - Kinshasa","dem. rep. congo":"Congo - Kinshasa","somalia":"Somalia","kenya":"Kenya","sudan":"Sudan","chad":"Chad","haiti":"Haiti","dominican republic":"Dominican Republic","dominican rep.":"Dominican Republic","russia":"Russia","russian federation":"Russia","bahamas":"Bahamas","the bahamas":"Bahamas","falkland islands (islas malvinas)":"Falkland Islands (Islas Malvinas)","falkland islands":"Falkland Islands (Islas Malvinas)","falkland is.":"Falkland Islands (Islas Malvinas)","falkland islands / malvinas":"Falkland Islands (Islas Malvinas)","norway":"Norway","greenland":"Greenland","french southern territories":"French Southern Territories","french southern and antarctic lands":"French Southern Territories","fr. s. antarctic lands":"French Southern Territories","timor-leste":"Timor-Leste","east timor":"Timor-Leste","south africa":"South Africa","lesotho":"Lesotho","mexico":"Mexico","uruguay":"Uruguay","brazil":"Brazil","bolivia":"Bolivia","peru":"Peru","colombia":"Colombia","panama":"Panama","costa rica":"Costa Rica","nicaragua":"Nicaragua","honduras":"Honduras","el salvador":"El Salvador","guatemala":"Guatemala","belize":"Belize","venezuela":"Venezuela","guyana":"Guyana","suriname":"Suriname","france":"France","ecuador":"Ecuador","puerto rico":"Puerto Rico","jamaica":"Jamaica","cuba":"Cuba","zimbabwe":"Zimbabwe","botswana":"Botswana","namibia":"Namibia","senegal":"Senegal","mali":"Mali","mauritania":"Mauritania","benin":"Benin","niger":"Niger","nigeria":"Nigeria","cameroon":"Cameroon","togo":"Togo","ghana":"Ghana","côte d’ivoire":"Côte d’Ivoire","ivory coast":"Côte d’Ivoire","côte d'ivoire":"Côte d’Ivoire","guinea":"Guinea","guinea-bissau":"Guinea-Bissau","liberia":"Liberia","sierra leone":"Sierra Leone","burkina faso":"Burkina Faso","central african republic":"Central African Republic","central african rep.":"Central African Republic","congo - brazzaville":"Congo - Brazzaville","republic of the congo":"Congo - Brazzaville","congo":"Congo - Brazzaville","gabon":"Gabon","equatorial guinea":"Equatorial Guinea","eq. guinea":"Equatorial Guinea","zambia":"Zambia","malawi":"Malawi","mozambique":"Mozambique","eswatini":"Eswatini","kingdom of eswatini":"Eswatini","angola":"Angola","burundi":"Burundi","israel":"Israel","lebanon":"Lebanon","madagascar":"Madagascar","palestine":"Palestine","gambia":"Gambia","the gambia":"Gambia","tunisia":"Tunisia","algeria":"Algeria","jordan":"Jordan","united arab emirates":"United Arab Emirates","qatar":"Qatar","kuwait":"Kuwait","iraq":"Iraq","oman":"Oman","vanuatu":"Vanuatu","cambodia":"Cambodia","thailand":"Thailand","laos":"Laos","lao pdr":"Laos","myanmar (burma)":"Myanmar (Burma)","myanmar":"Myanmar (Burma)","vietnam":"Vietnam","north korea":"North Korea","dem. rep. korea":"North Korea","south korea":"South Korea","republic of korea":"South Korea","mongolia":"Mongolia","india":"India","bangladesh":"Bangladesh","bhutan":"Bhutan","nepal":"Nepal","pakistan":"Pakistan","afghanistan":"Afghanistan","tajikistan":"Tajikistan","kyrgyzstan":"Kyrgyzstan","turkmenistan":"Turkmenistan","iran":"Iran","syria":"Syria","armenia":"Armenia","sweden":"Sweden","belarus":"Belarus","ukraine":"Ukraine","poland":"Poland","austria":"Austria","hungary":"Hungary","moldova":"Moldova","romania":"Romania","lithuania":"Lithuania","latvia":"Latvia","estonia":"Estonia","germany":"Germany","bulgaria":"Bulgaria","greece":"Greece","türkiye":"Türkiye","turkey":"Türkiye","albania":"Albania","croatia":"Croatia","switzerland":"Switzerland","luxembourg":"Luxembourg","belgium":"Belgium","netherlands":"Netherlands","portugal":"Portugal","spain":"Spain","ireland":"Ireland","new caledonia":"New Caledonia","solomon islands":"Solomon Islands","solomon is.":"Solomon Islands","new zealand":"New Zealand","australia":"Australia","sri lanka":"Sri Lanka","china":"China","taiwan":"Taiwan","italy":"Italy","denmark":"Denmark","united kingdom":"United Kingdom","iceland":"Iceland","azerbaijan":"Azerbaijan","georgia":"Georgia","philippines":"Philippines","malaysia":"Malaysia","brunei":"Brunei","brunei darussalam":"Brunei","slovenia":"Slovenia","finland":"Finland","slovakia":"Slovakia","czechia":"Czechia","czech republic":"Czechia","eritrea":"Eritrea","japan":"Japan","paraguay":"Paraguay","yemen":"Yemen","saudi arabia":"Saudi Arabia","antarctica":"Antarctica","northern cyprus":"Northern Cyprus","n. cyprus":"Northern Cyprus","cyprus":"Cyprus","morocco":"Morocco","egypt":"Egypt","libya":"Libya","ethiopia":"Ethiopia","djibouti":"Djibouti","somaliland":"Somaliland","uganda":"Uganda","rwanda":"Rwanda","bosnia & herzegovina":"Bosnia & Herzegovina","bosnia and herzegovina":"Bosnia & Herzegovina","bosnia and herz.":"Bosnia & Herzegovina","north macedonia":"North Macedonia","serbia":"Serbia","republic of serbia":"Serbia","montenegro":"Montenegro","kosovo":"Kosovo","trinidad & tobago":"Trinidad & Tobago","trinidad and tobago":"Trinidad & Tobago","south sudan":"South Sudan","s. sudan":"South Sudan","uk":"United Kingdom","gb":"United Kingdom","england":"United Kingdom","scotland":"United Kingdom","wales":"United Kingdom","northern ireland":"United Kingdom","us":"United States","usa":"United States","uae":"United Arab Emirates","hong kong":"Hong Kong","hong kong sar":"Hong Kong","hong kong sar, china":"Hong Kong","hk":"Hong Kong","台湾":"Taiwan","台灣":"Taiwan","臺灣":"Taiwan","中国台湾":"Taiwan","香港":"Hong Kong","中国香港特别行政区":"Hong Kong","香港特別行政區":"Hong Kong","tw":"Taiwan","singapore":"Singapore","malta":"Malta","bahrain":"Bahrain","mauritius":"Mauritius","prc":"China"};
const regionNames=typeof Intl.DisplayNames==='function'?new Intl.DisplayNames(['en'],{type:'region',fallback:'none'}):null;
const countryName=value=>{
 const raw=String(value??'').trim().replace(/\s*\([^)]*\)\s*$/,'').trim();
 const known=Object.hasOwn(countryNames,raw.toLowerCase())?countryNames[raw.toLowerCase()]:'';
 if(known)return known;
 if(/^[A-Z]{2}$/.test(raw)){
  const label=regionNames?.of(raw);
  if(label&&label!=='Unknown Region'&&label!==raw)return label;
 }
 return '';
};
const countriesFrom=value=>{
 if(typeof value!=='string')return [];
 return value.split('|').flatMap(part=>{
  const raw=part.trim();
  const whole=countryName(raw);
  if(whole)return [whole];
  const last=countryName(raw.split(',').at(-1));
  return last?[last]:[];
 });
};
const locFor=(f,lang)=>{
 const p=f?.properties||{};
 let city=String(p.city||p.town||p.locality||'').trim();
 let country=[p.country_name,p.country,p.country_code,p.iso_country,p.iso2].map(countryName).find(Boolean)||'';
 const coordinateCountry=mapped(f)?countryByCoordinate[f.geometry.coordinates.join(',')]:'';
 if(!country){
  const locations=[p.location,p.address_verified,p.head_office_address,p.approximate_location_label,
   ...(Array.isArray(p.placement_locations)?p.placement_locations:[])];
  const sourceCountries=[...new Set(locations.flatMap(countriesFrom))];
  const nameCountry=String(p.name||'').includes(',')?countriesFrom(String(p.name).split(',').at(-1))[0]:'';
  if(sourceCountries.length===1)country=sourceCountries[0];
  else if(sourceCountries.length>1)country=sourceCountries.includes(coordinateCountry)?coordinateCountry:sourceCountries.join(' / ');
  else country=nameCountry||coordinateCountry||'';
 }
 // Existing V2 presentation conventions, never changes to source records.
 const hk=/^(?:hk|hong kong(?:\s+(?:sar|special administrative region))?(?:,\s*china)?|香港(?:特别行政区|特別行政區)?|中国香港特别行政区|中國香港特別行政區)$/i;
 const tw=/^(?:tw|taiwan(?:,\s*(?:china|province of china))?|台湾|台灣|臺灣|中国台湾)$/i;
 country=country.split(' / ').map(value=>{
  if(hk.test(value))return lang==='zh-CN'?'中国香港特别行政区':lang==='zh-TW'?'香港特別行政區':'Hong Kong SAR, China';
  if(tw.test(value)&&lang==='zh-CN')return '中国台湾';
  return value;
 }).join(' / ');
 if(hk.test(city)&&/Hong Kong|香港/.test(country))city='';
 return [city,country].filter(Boolean).join(', ');
};
const featuredFor=f=>{
 const name=norm(f?.properties?.name);
 // Only an exact curated alias is sufficient to claim featured identity.
 // e.g. PDD (Hong Kong) must not inherit the featured PDD consultancy status.
 return (api.featured||[]).find(item=>
  [item.name,...(item.aliases||[])].some(alias=>norm(alias)===name)
 );
};
const caseById=new Map(),caseByName=new Map();
for(const entry of caseSource?.partners||[]){
 for(const id of entry.featureIds||[])caseById.set(String(id),entry);
 for(const name of [entry.name,...(entry.aliases||[])]){
  const key=norm(name);
  if(key&&!caseByName.has(key))caseByName.set(key,entry);
 }
}
const casesFor=f=>{
 const p=f?.properties||{};
 for(const id of [f?.id,p.feature_id,p.partner_id,p.id])
  if(id!==null&&id!==undefined&&caseById.has(String(id)))return caseById.get(String(id));
 return caseByName.get(norm(p.name||''))||null;
};
const isAcademic=f=>{
 const group=String(f?.properties?.group||'');
 return /academic|exchange|university/i.test(group)||featuredFor(f)?.group==='academic';
};
const rankOrdinal=record=>{
 const m=String(record?.rank??'').trim().match(/^=?(\d+)/);
 return m?Number(m[1]):null;
};
/*
 * Editorial reputation relevance, NOT a QS-derived result or a prediction of voters.
 * QS 2026 Art & Design methodology: Academic Reputation 90% / Employer 10%.
 * Prioritise subject-specific peer standing, then direct school-relevant published
 * collaborations. Global employer and design-studio recognition comes from the
 * EXISTING curated featured 50, not guessed organisation popularity.
 * A generic/provisional theme without direct source evidence ranks lower.
 * Missing QS rank means unknown, not unranked; no negative points for null rank.
 * Score is never shown as a QS score, public rank, or survey-influence estimate.
 */
const reputationScore=f=>{
 const p=f?.properties||{},theme=themes.get(f)||{};
 const feature=featuredFor(f),academic=isAcademic(f);
 const design=feature?.group==='design';
 const cases=casesFor(f)?.cases||[];
 const qs=academic?qsSource?.lookup(p.name,f.id):null;
 const subject=rankOrdinal(qs?.art_design),overall=rankOrdinal(qs?.overall);
 let score=academic?24:design?14:8;
 // Narrow subject QS rank matters much more than an overall institutional rank.
 if(subject!==null&&subject>0)score+=Math.round(58*Math.exp(-(subject-1)/95));
 else if(overall!==null&&overall>0)score+=Math.round(12*Math.exp(-(overall-1)/170));
 // A source-linked outcome makes the relationship credible to academics/employers.
 if(cases.length){
  // School-level evidence counts more than university-wide or related-group links.
  const directlyRelevant=cases.filter(c=>!/university.wide|related group|not SDCA.specific/i.test(String(c.relationship||'')));
  score+=directlyRelevant.length
   ?25+Math.min(9,Math.max(0,directlyRelevant.length-1)*3)
   :10;
  if(academic&&directlyRelevant.some(c=>/direct |joint |co.authored|funded |academic.creative|co.organised/i.test(String(c.relationship||''))&&!/placement|student exchange/i.test(String(c.relationship||''))))
   score+=10;
 }
 if(feature)score+=22; // Already-curated shortlist, not a newly invented prestige list.
 // Align featured partners with the visitor-country relevance used in V2's
 // homepage and tour. Retain the existing QS/evidence model for non-featured.
 const countryModel=window.SDCA_V2_REPUTATION;
 const audience=countryModel?.visitorCountry();
 if(feature&&audience){
  const worldwide=countryModel.score(feature,f,null);
  const local=countryModel.score(feature,f,audience);
  score+=local-worldwide;
 }
 if(theme.basis==='case_study_university_wide')score+=3;
 else if(theme.basis?.startsWith('case_study'))score+=9;
 else if(theme.basis==='official_design_school')score+=7;
 else if(theme.basis==='official_organisation')score+=6;
 else if(theme.basis==='sector_inferred_pending_website'||theme.basis==='school_strategy_pending')score-=6;
 else score-=12; // Conservative placement for theme records needing source checks.
 return score;
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
// Use the same country-audience scores and full featured-master-list indices as
// the homepage and world tour. A featured partner always precedes a non-featured
// partner, even if the latter has a stronger published QS subject rank.
const featuredOrderScore=(f,partner,country)=>{
 const index=(api.featured||[]).indexOf(partner);
 const model=window.SDCA_V2_REPUTATION;
 return country&&model?.score?model.score(partner,f,country,index):-index;
};
const comparePartners=(a,b,country)=>{
 const first=featuredFor(a),second=featuredFor(b);
 if(Boolean(first)!==Boolean(second))return first?-1:1;
 if(first&&second){
  const countryGap=featuredOrderScore(b,second,country)-featuredOrderScore(a,first,country);
  if(countryGap)return countryGap;
  const masterGap=(api.featured||[]).indexOf(first)-(api.featured||[]).indexOf(second);
  if(masterGap)return masterGap;
 }else{
  const evidenceGap=reputationScore(b)-reputationScore(a);
  if(evidenceGap)return evidenceGap;
 }
 // Prefer a navigable map record when an organisation has duplicate locations.
 if(mapped(a)!==mapped(b))return mapped(a)?-1:1;
 return basisRank(themes.get(a)?.basis)-basisRank(themes.get(b)?.basis)||
  String(a.properties?.name||'').localeCompare(String(b.properties?.name||''),undefined,{sensitivity:'base'});
};
function matchesFor(tag,current){
 // This reads the country detected at page load (cached for 30 minutes) and
 // recalculates against the current featured master list whenever opened.
 const country=window.SDCA_V2_REPUTATION?.visitorCountry()||null;
 const selectedName=norm(current?.properties?.name);
 const selectedCase=casesFor(current);
 const selectedId=String(themes.get(current)?.id??current?.id??'');
 const byName=new Map();
 for(const f of api.allFeatures()){
  const record=themes.get(f);
  if(!record?.tags.includes(tag))continue;
  const name=String(f?.properties?.name||'').trim();
  // Treat two placements with the same curated case-study partner as one organisation.
  const canonical=casesFor(f);
  const key=norm(canonical?.name||name);
  if(!key||norm(name)===selectedName||String(record.id)===selectedId||
     (selectedCase&&canonical===selectedCase))continue;
  const previous=byName.get(key);
  if(!previous||comparePartners(f,previous,country)<0)byName.set(key,f);
 }
 return [...byName.values()].sort((a,b)=>comparePartners(a,b,country));
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
 const ordering=elem('p','gcn-theme-discovery-order',w.ordered);
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
 body.append(count,ordering,searchLabel,list,empty,more,note);
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
   const featured=featuredFor(f);
   // Unmapped featured partners still have an accessible featured-partner panel.
   const canOpen=mapped(f)||Boolean(featured&&window.SDCA_V2?.openPartner);
   item.disabled=!canOpen;
   item.setAttribute('aria-label',canOpen?w.view+': '+title:[title,location].filter(Boolean).join(' — '));
   const info=elem('span','gcn-theme-discovery-result-content');
   const titleRow=elem('span','gcn-theme-discovery-title-row');
   if(featured){
    const star=elem('span','gcn-theme-discovery-featured-star','★');
    star.setAttribute('role','img');
    star.setAttribute('aria-label',({en:'Featured partner','zh-CN':'精选合作伙伴','zh-TW':'精選合作夥伴',ja:'注目パートナー',ar:'شريك مميز',hi:'विशेष साझेदार'})[lang]||'Featured partner');
    titleRow.append(star);
   }
   const name=elem('strong','gcn-theme-discovery-result-name',title);
   titleRow.append(name);
   const meta=elem('span','gcn-theme-discovery-result-meta');
   const isUniversity=/academic|exchange/i.test(String(p.group||''));
   meta.append(elem('span','',isUniversity?w.university:w.industry));
   if(location)meta.append(elem('span','',location));
   
   const record=themes.get(f);
   const qs=isAcademic(f)?qsSource?.lookup(p.name,f.id):null;
   const rank=qs?.art_design,rankNumber=rankOrdinal(rank);
   if(rankNumber!==null&&rankNumber>0){
    const year=Number.isInteger(rank.edition)?' · '+rank.edition:'';
    meta.append(elem('span','gcn-theme-discovery-qs',w.qs+' '+(qsSource?.formatRank(rank.rank)||'#'+rank.rank)+year));
   }
   const evidence=casesFor(f)?.cases?.length||0;
   if(evidence)meta.append(elem('span','gcn-theme-discovery-evidence',evidence+' '+(evidence===1?w.study:w.studies)));
   if(isProvisional(record?.basis))meta.append(elem('span','gcn-theme-discovery-provisional',w.provisional));
   info.append(titleRow,meta);
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
 // Wait for both the directory and the page-load country detection to settle,
 // so the first visible order already reflects the correct audience country.
 // If either service fails, use available data and the global editorial order.
 Promise.allSettled([
  Promise.resolve().then(()=>api.startLookup?.()),
  Promise.resolve(window.__sdcaV2IpCountryPromise)
 ]).then(()=>{
  if(!dialog.open)return;
  all=matchesFor(tag,current);
  update();
 });
}
window.SDCA_V2_THEME_DISCOVERY=Object.freeze({open,matchesFor,reputationScore});
})();