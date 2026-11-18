/* V2: localised text for the original QS excellence box in View all 50.
   Statistics and sources are supplied by the project's achievement graphics.
   This module creates no UI, carousel, event handlers, or map overlays. */
(function(){
'use strict';
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
 ms:{
 heading:'Bukti kecemerlangan',previous:'Pencapaian sebelumnya',next:'Pencapaian seterusnya',
 impact:'impak penyelidikan Seni dan Reka Bentuk dinilai “terkemuka di dunia” atau “cemerlang di peringkat antarabangsa”',
 prospects:'bagi Prospek Graduan dalam Reka Bentuk Produk',
 ukRank:'di UK bagi Seni dan Reka Bentuk',
 building:'Bangunan Reka Bentuk yang dibina khas',
 support:'pelajar Reka Bentuk memberikan maklum balas positif tentang sokongan akademik dalam kursus mereka',
 salary:'di UK bagi gaji median lima tahun selepas tamat pengajian dalam Seni Persembahan'
 },
 'ms-Arab':{
 heading:'بوکتي کچمرلڠن',previous:'ڤنچاڤاين سبالومڽ',next:'ڤنچاڤاين ستروسڽ',
 impact:'ايمڤق ڤڽليديقن سني دان ريکا بنتوق دينيلاءي ترباءيق دنيا اتاو چمرلڠ انتارابڠسا',
 prospects:'باݢي ڤروسڤيک ݢرادوان دالم ريکا بنتوق ڤرودوک',
 ukRank:'دي UK باݢي سني دان ريکا بنتوق',
 building:'باڠونن ريکا بنتوق يڠ دبينا خاص',
 support:'ڤلاجر ريکا بنتوق منيبري ماکلوم بالس ڤوسيتيف تنتڠ سوکوڠن اکادميک',
 salary:'دي UK باݢي ݢاجي ميدين ليما تاهون سلڤس تامت ڤڠاجين دالم سني ڤرسيمبهن'
 },
 hi:{
 heading:'उत्कृष्टता के प्रमाण',previous:'पिछली उपलब्धियाँ',next:'अगली उपलब्धियाँ',
 impact:'कला और डिज़ाइन में शोध के प्रभाव को “विश्व-अग्रणी” या “अंतरराष्ट्रीय स्तर पर उत्कृष्ट” दर्जा मिला',
 prospects:'प्रोडक्ट डिज़ाइन में स्नातक करियर संभावनाओं के लिए',
 ukRank:'कला और डिज़ाइन के लिए ब्रिटेन में',
 building:'विशेष रूप से निर्मित डिज़ाइन भवन',
 support:'डिज़ाइन के विद्यार्थियों ने अपने पाठ्यक्रम में शैक्षणिक सहयोग को सकारात्मक बताया',
 salary:'परफ़ॉर्मिंग आर्ट्स में स्नातक होने के पाँच साल बाद औसत मध्यिका वेतन के लिए ब्रिटेन में'
 },
 pa:{
 heading:'ਉੱਤਮਤਾ ਦੇ ਸਬੂਤ',previous:'ਪਿਛਲੀਆਂ ਪ੍ਰਾਪਤੀਆਂ',next:'ਅਗਲੀਆਂ ਪ੍ਰਾਪਤੀਆਂ',
 impact:'ਕਲਾ ਅਤੇ ਡਿਜ਼ਾਈਨ ਖੋਜ ਦੇ ਪ੍ਰਭਾਵ ਨੂੰ “ਵਿਸ਼ਵ-ਅਗੇਤਰੀ” ਜਾਂ “ਅੰਤਰਰਾਸ਼ਟਰੀ ਪੱਧਰ ਤੇ ਸ਼ਾਨਦਾਰ” ਮੰਨਿਆ ਗਿਆ',
 prospects:'ਉਤਪਾਦ ਡਿਜ਼ਾਈਨ ਵਿੱਚ ਗ੍ਰੈਜੂਏਟਾਂ ਦੇ ਕਰੀਅਰ ਮੌਕਿਆਂ ਲਈ',
 ukRank:'ਕਲਾ ਅਤੇ ਡਿਜ਼ਾਈਨ ਲਈ ਯੂਕੇ ਵਿੱਚ',
 building:'ਖਾਸ ਤੌਰ ਤੇ ਬਣਾਈ ਗਈ ਡਿਜ਼ਾਈਨ ਇਮਾਰਤ',
 support:'ਡਿਜ਼ਾਈਨ ਦੇ ਵਿਦਿਆਰਥੀਆਂ ਨੇ ਕੋਰਸ ਵਿੱਚ ਅਕਾਦਮਿਕ ਮਦਦ ਨੂੰ ਚੰਗਾ ਦੱਸਿਆ',
 salary:'ਪਰਫਾਰਮਿੰਗ ਆਰਟਸ ਵਿੱਚ ਗ੍ਰੈਜੂਏਸ਼ਨ ਤੋਂ ਪੰਜ ਸਾਲ ਬਾਅਦ ਦਰਮਿਆਨੀ ਤਨਖਾਹ ਲਈ ਯੂਕੇ ਵਿੱਚ'
 },
 bn:{
 heading:'উৎকর্ষের প্রমাণ',previous:'আগের অর্জন',next:'পরের অর্জন',
 impact:'শিল্প ও নকশার গবেষণার প্রভাবকে “বিশ্বসেরা” বা “আন্তর্জাতিকভাবে উৎকৃষ্ট” হিসেবে মূল্যায়ন করা হয়েছে',
 prospects:'প্রোডাক্ট ডিজাইনে স্নাতকদের কর্মজীবনের সম্ভাবনায়',
 ukRank:'শিল্প ও নকশায় যুক্তরাজ্যে',
 building:'বিশেষভাবে নির্মিত ডিজাইন ভবন',
 support:'ডিজাইন শিক্ষার্থীরা কোর্সে একাডেমিক সহায়তায় ইতিবাচক মত দিয়েছেন',
 salary:'পারফর্মিং আর্টসে স্নাতক হওয়ার পাঁচ বছর পর মধ্যম বেতনের ক্ষেত্রে যুক্তরাজ্যে'
 },
 gu:{
 heading:'ઉત્કૃષ્ટતાના પુરાવા',previous:'અગાઉની સિદ્ધિઓ',next:'આગળની સિદ્ધિઓ',
 impact:'કલા અને ડિઝાઇનના સંશોધનની અસરને “વિશ્વ-અગ્રણી” અથવા “આંતરરાષ્ટ્રીય સ્તરે ઉત્તમ” ગણવામાં આવી',
 prospects:'પ્રોડક્ટ ડિઝાઇનમાં સ્નાતકોની કારકિર્દીની તકો માટે',
 ukRank:'કલા અને ડિઝાઇન માટે યુકેમાં',
 building:'ખાસ તૈયાર કરાયેલ ડિઝાઇન બિલ્ડિંગ',
 support:'ડિઝાઇનના વિદ્યાર્થીઓએ અભ્યાસક્રમમાં શૈક્ષણિક સહાય વિશે સકારાત્મક પ્રતિભાવ આપ્યો',
 salary:'પર્ફોર્મિંગ આર્ટ્સમાં સ્નાતક થયા પછી પાંચ વર્ષે મધ્યમ પગાર માટે યુકેમાં'
 },
 ta:{
 heading:'சிறப்பிற்கான சான்றுகள்',previous:'முந்தைய சாதனைகள்',next:'அடுத்த சாதனைகள்',
 impact:'கலை மற்றும் வடிவமைப்பு ஆய்வின் தாக்கம் “உலகின் முன்னணி” அல்லது “சர்வதேச அளவில் சிறந்தது” என மதிப்பிடப்பட்டது',
 prospects:'தயாரிப்பு வடிவமைப்புப் பட்டதாரிகளின் எதிர்கால வாய்ப்புகளில்',
 ukRank:'கலை மற்றும் வடிவமைப்பில் ஐக்கிய இராச்சியத்தில்',
 building:'வடிவமைப்புக்காகவே கட்டப்பட்ட கட்டிடம்',
 support:'வடிவமைப்பு மாணவர்கள் தங்கள் பாடத்தின் கல்வி ஆதரவில் திருப்தி தெரிவித்தனர்',
 salary:'நிகழ்த்துக் கலைகளில் பட்டம் பெற்ற ஐந்து ஆண்டுகளுக்குப் பின் சராசரி நடுநிலை ஊதியத்தில் ஐக்கிய இராச்சியத்தில்'
 },
 te:{
 heading:'అత్యుత్తమ విజయాల సాక్ష్యాలు',previous:'మునుపటి విజయాలు',next:'తదుపరి విజయాలు',
 impact:'కళలు మరియు డిజైన్ పరిశోధన ప్రభావం “ప్రపంచ స్థాయి అగ్రగామి” లేదా “అంతర్జాతీయంగా అత్యుత్తమం”గా గుర్తింపు పొందింది',
 prospects:'ప్రొడక్ట్ డిజైన్‌లో పట్టభద్రుల ఉపాధి అవకాశాలకు',
 ukRank:'కళలు మరియు డిజైన్‌లో యూకేలో',
 building:'డిజైన్ కోసం ప్రత్యేకంగా నిర్మించిన భవనం',
 support:'డిజైన్ విద్యార్థులు తమ కోర్సులో విద్యా మద్దతుపై సానుకూలంగా స్పందించారు',
 salary:'ప్రదర్శన కళల్లో పట్టా పొందిన ఐదేళ్ల తర్వాత మధ్యస్థ వేతనంలో యూకేలో'
 },
 mr:{
 heading:'उत्कृष्टतेचे पुरावे',previous:'मागील यश',next:'पुढील यश',
 impact:'कला आणि डिझाइन संशोधनाचा प्रभाव “जागतिक अग्रणी” किंवा “आंतरराष्ट्रीय स्तरावर उत्कृष्ट” मानला गेला',
 prospects:'प्रॉडक्ट डिझाइनमधील पदवीधरांच्या करिअर संधींसाठी',
 ukRank:'कला आणि डिझाइनसाठी यूकेमध्ये',
 building:'डिझाइनसाठी खास बांधलेली इमारत',
 support:'डिझाइन विद्यार्थ्यांनी अभ्यासक्रमातील शैक्षणिक मदतीबद्दल सकारात्मक मत दिले',
 salary:'परफॉर्मिंग आर्ट्समध्ये पदवी घेतल्यानंतर पाच वर्षांनी मध्यक वेतनासाठी यूकेमध्ये'
 },
 ur:{
 heading:'عمدہ کارکردگی کے شواہد',previous:'پچھلی کامیابیاں',next:'اگلی کامیابیاں',
 impact:'آرٹ اور ڈیزائن کی تحقیق کے اثرات کو “عالمی سطح پر نمایاں” یا “بین الاقوامی طور پر بہترین” قرار دیا گیا',
 prospects:'پروڈکٹ ڈیزائن میں فارغ التحصیل طلبہ کے کیریئر امکانات کے لیے',
 ukRank:'آرٹ اور ڈیزائن میں برطانیہ میں',
 building:'ڈیزائن کے لیے خصوصی طور پر تعمیر کردہ عمارت',
 support:'ڈیزائن کے طلبہ نے اپنے کورس میں تعلیمی مدد کے بارے میں مثبت رائے دی',
 salary:'پرفارمنگ آرٹس میں گریجویشن کے پانچ سال بعد درمیانی تنخواہ کے لحاظ سے برطانیہ میں'
 },
 ne:{
 heading:'उत्कृष्टताको प्रमाण',previous:'अघिल्ला उपलब्धिहरू',next:'अर्का उपलब्धिहरू',
 impact:'कला तथा डिजाइन अनुसन्धानको प्रभाव “विश्वस्तरीय अग्रणी” वा “अन्तर्राष्ट्रिय रूपमा उत्कृष्ट” मूल्याङ्कन',
 prospects:'प्रोडक्ट डिजाइनमा स्नातकको करिअर सम्भावनाका लागि',
 ukRank:'कला तथा डिजाइनमा बेलायतमा',
 building:'डिजाइनका लागि विशेष रूपमा निर्माण गरिएको भवन',
 support:'डिजाइनका विद्यार्थीले पाठ्यक्रमको शैक्षिक सहयोगलाई सकारात्मक मूल्याङ्कन गरे',
 salary:'प्रदर्शन कलामा स्नातक भएको पाँच वर्षपछि मध्यम तलबका लागि बेलायतमा'
 },
 ar:{
 heading:'دلائل التميز',previous:'الإنجازات السابقة',next:'الإنجازات التالية',
 impact:'من تأثير أبحاث الفن والتصميم صُنّف «رائدًا عالميًا» أو «متميزًا دوليًا»',
 prospects:'في فرص الخريجين بتخصص تصميم المنتجات',
 ukRank:'في المملكة المتحدة في الفن والتصميم',
 building:'مبنى مخصص للتصميم',
 support:'من طلاب التصميم عبّروا عن رضاهم عن الدعم الأكاديمي في مقرراتهم',
 salary:'في المملكة المتحدة في متوسط الراتب الوسيط بعد خمس سنوات من التخرج في الفنون الأدائية'
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

window.SDCA_V2_EXCELLENCE={facts,translations};
})();
