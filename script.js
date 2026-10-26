/* =====================================================================
   AL BARAKA — FOCUS + Cosmétique + Clothes
   1) MODIFIER ICI : WhatsApp, pixels, offres, produits, prix
   ===================================================================== */
const CONFIG = {
  whatsapp: '212706828446',
  metaPixel: '',     // Facebook / Instagram : votre Pixel ID, ex '1234567890123456'
  tiktokPixel: '',   // TikTok : votre Pixel ID
  currency: 'MAD',
  adMode: true       // true = les visiteurs venant d'une pub (utm / fbclid / ttclid) ne voient que FOCUS
};

/* Offres FOCUS : nombre de boîtes -> prix total */
const OFFERS = [
  {qty:1, price:199},
  {qty:2, price:349, tag:{ar:'الاختيار الأفضل',fr:'Meilleur choix'}},
  {qty:3, price:479, tag:{ar:'أكبر توفير',fr:'Plus grosse économie'}},
];
const UNIT = 199;
const DEFAULT_OFFER = 2;

const FOCUS = {id:'focus', img:'focus-bottle.png', bg:['#3a1c0d','#170a04'], name:{ar:'FOCUS · علبة 60 كبسولة', fr:'FOCUS · boîte de 60 gélules'}};

/* Ingrédients affichés autour de la boîte */
const LEAF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 19C5 10 11 5 20 4c0 9-5 15-14 15"/><path d="M5 19l8-8"/></svg>';
const INGS = [
  {ic:LEAF, ar:'جنكة', fr:'Ginkgo', dose:'150 mg'},
  {ic:'B12', ar:'فيتامين B12', fr:'Vitamine B12', dose:'2.5 µg'},
  {ic:LEAF, ar:'باكوبا', fr:'Bacopa', dose:'110 mg'},
  {ic:'Mg', ar:'مغنيسيوم', fr:'Magnésium', dose:'50 mg'},
  {ic:'Tyr', ar:'L‑Tyrosine', fr:'L‑Tyrosine', dose:'90 mg'},
  {ic:'B6', ar:'فيتامين B6', fr:'Vitamine B6', dose:'2 mg'},
];

/* Packs soin & vêtements — prix EXEMPLES à remplacer */
const PACKS = [
  {id:'pack-fresh', pack:true, price:99, old:130, color:'#2f7d62', accent:'#f7c978', bg:['#e9f3e9','#d2e6d6'], isNew:true,
   name:{fr:'Pack Fraîcheur',ar:'باك الانتعاش'}, scent:{fr:'Menthe & citron',ar:'نعناع وليمون'}, items:{fr:'1 shampoing + 1 gel douche',ar:'1 شامبو + 1 جل الاستحمام'}},
  {id:'pack-argan', pack:true, price:119, old:150, color:'#c27a2c', accent:'#2a1409', bg:['#fdf0dc','#f6dbb4'], isNew:true,
   name:{fr:'Pack Argan',ar:'باك الأركان'}, scent:{fr:"Argan & fleur d'oranger",ar:'أركان وزهر الليمون'}, items:{fr:'1 shampoing + 1 gel douche',ar:'1 شامبو + 1 جل الاستحمام'}},
  {id:'pack-family', pack:true, double:true, price:189, old:260, color:'#8a2f2a', accent:'#f7c978', bg:['#fbebe4','#f1d1c4'],
   name:{fr:'Pack Famille',ar:'باك العائلة'}, scent:{fr:'Musc & rose',ar:'مسك وورد'}, items:{fr:'2 shampoings + 2 gels douche',ar:'2 شامبو + 2 جل الاستحمام'}},
];
const SIZES = ['S','M','L','XL','XXL'];
const CLOTHES = [
  {id:'tee', type:'tshirt', cat:'hommes', price:129, color:'#8a4b2a', accent:'#f7c978', bg:['#fdf0dc','#f4dab6'], isNew:true, name:{fr:'T-shirt Essentiel',ar:'تيشيرت أساسي'}},
  {id:'hoodie', type:'hoodie', cat:'hommes', price:249, color:'#efe2cc', accent:'#2a1409', bg:['#fbf2e4','#efdcbf'], isNew:true, name:{fr:'Hoodie Baraka',ar:'هودي البركة'}},
  {id:'jean', type:'pants', cat:'hommes', price:279, color:'#34506e', accent:'#f7c978', bg:['#eef0f3','#d9dee6'], name:{fr:'Jean coupe droite',ar:'جينز قصة مستقيمة'}},
  {id:'caftan', type:'robe', cat:'traditionnel', price:449, color:'#8a2f2a', accent:'#f7c978', bg:['#fbebe4','#f1d1c4'], isNew:true, name:{fr:'Caftan moderne',ar:'قفطان عصري'}},
  {id:'veste', type:'jacket', cat:'femmes', price:329, color:'#c9a46a', accent:'#2a1409', bg:['#fbf2e4','#efdcbf'], name:{fr:'Veste légère',ar:'جاكيت خفيف'}},
  {id:'teeF', type:'tshirt', cat:'femmes', price:139, color:'#e8b9a8', accent:'#8a2f2a', bg:['#fdf0eb','#f4d8cf'], name:{fr:'T-shirt oversize',ar:'تيشيرت واسع'}},
  {id:'gandoura', type:'robe', cat:'traditionnel', price:299, color:'#f6efe3', accent:'#c27a2c', bg:['#fdf0dc','#f4dab6'], name:{fr:'Gandoura été',ar:'كندورة صيفية'}},
  {id:'cap', type:'cap', cat:'accessoires', price:89, color:'#2a1409', accent:'#f7c978', bg:['#fdf0dc','#f4dab6'], sizes:['Unique'], name:{fr:'Casquette brodée',ar:'قبعة مطرزة'}},
];
const CATS = [
  {id:'all',fr:'Tout',ar:'الكل'},{id:'hommes',fr:'Hommes',ar:'رجال'},{id:'femmes',fr:'Femmes',ar:'نساء'},
  {id:'traditionnel',fr:'Traditionnel',ar:'تقليدي'},{id:'accessoires',fr:'Accessoires',ar:'إكسسوارات'},
];
/* Melatonin — prix 199 DH la boîte */
const MELATONIN = {id:'melatonin', price:199, img:'melatonin-front.png', bg:['#3b1f5c','#160c22'], name:{ar:'Melatonin · علبة 60 كبسولة', fr:'Melatonin · boîte de 60 gélules'}};
/* Moringa (170 DH) et Omega 3 (189 DH) — marque online */
const MORINGA = {id:'moringa', price:170, img:'moringa-front.png', bg:['#2f5a2c','#0e1f10'], name:{ar:'Moringa · علبة 60 كبسولة', fr:'Moringa · boîte de 60 gélules'}};
const OMEGA = {id:'omega3', price:189, img:'omega-front.png', bg:['#8a5410','#2a1704'], name:{ar:'Omega 3 · علبة 60 كبسولة', fr:'Oméga 3 · boîte de 60 capsules'}};
const ALL = [FOCUS, MELATONIN, MORINGA, OMEGA, ...PACKS, ...CLOTHES];
const byId = id => ALL.find(p => p.id === id);

/* ===================== prix FOCUS par paliers ===================== */
function focusPrice(q){
  let total = 0;
  while (q >= 3){ total += OFFERS[2].price; q -= 3; }
  if (q) total += OFFERS[q-1].price;
  return total;
}
const TIERED = ['focus','melatonin'];   // produits avec offres 1/2/3 boîtes
const itemTotal = i => TIERED.includes(i.id) ? focusPrice(i.qty) : byId(i.id).price * i.qty;
const itemFull  = i => TIERED.includes(i.id) ? UNIT * i.qty : byId(i.id).price * i.qty;
const tierName = i => (i.id === 'focus' ? 'FOCUS' : 'Melatonin') + ' · ' + boxLabel(i.qty);

/* ===================== textes (FR ; l'arabe est lu dans le HTML) ===================== */
const FR = {
  ann:'🚚 Livraison gratuite · 💵 Paiement à la livraison · 🎁 2 boîtes à 349 DH',
  nav1:'Composition', nav2:'Offres', nav3:'Soins', nav4:'Vêtements', nav5:'FAQ',
  heroEy:'✦ AL BARAKA SELECT · Complément alimentaire',
  heroH1:'Esprit clair.<br><span class="grad">Journée légère.</span>',
  heroLead:'<b>FOCUS</b> : 60 gélules au ginkgo, bacopa, L‑tyrosine, magnésium et vitamines B, pour soutenir la concentration, la mémoire et réduire la fatigue mentale.',
  cta:'Commander', ctaSub:'Paiement à la livraison — rien à payer maintenant',
  as1:'Paiement à la livraison', as2:'Livraison gratuite', as3:'Confirmation WhatsApp', as4:'Laboratoire agréé ONSSA',
  melOnssa:'🛡️ Fabriqué dans un laboratoire agréé ONSSA · Agrément <span dir="ltr">CAPV.26.1009.24</span>',
  stk:'DH<br>la boîte', cod1:'Payez à la réception', cod2:'Livraison offerte',
  iEy:'Telle qu’indiquée sur l’étiquette', iH2:'Qu’y a-t-il dans <span class="grad">FOCUS</span> ?', iLead:'6 ingrédients choisis dans chaque gélule, avec des doses claires.',
  bxEy:'La formule', bxT:'Des ingrédients choisis<br>pour votre routine', bxP:'Plantes connues + acide aminé + minéraux et vitamines.',
  g1:'Extrait de ginkgo', g2:'Extrait de bacopa', g3:'L-Tyrosine', g4:'Citrate de magnésium', g5:'Vitamine B6', g6:'Vitamine B12',
  useT:'Utilisation', use:'1 à 2 gélules 30 minutes avant le coucher avec un verre d’eau. Ne pas dépasser la dose recommandée.',
  warnT:'Précautions', warn:'Demandez l’avis d’un médecin en cas de grossesse, d’allaitement, de problème de santé ou de traitement. Tenir hors de portée des enfants.',
  bEy:'Pourquoi FOCUS ?', bH2:'Toujours <span class="grad">l’esprit présent</span>', bLead:'Selon les informations du produit, FOCUS est conçu pour soutenir la performance mentale au quotidien.',
  b1t:'Concentration', b1:'En cours ou au travail, pour rester concentré.', b2t:'Mémoire', b2:'Une routine quotidienne pour soutenir la mémoire.',
  b3t:'Moins de fatigue mentale', b3:'Aide à réduire la sensation de fatigue mentale.', b4t:'Clarté d’esprit', b4:'Pour un esprit clair, avec un mode de vie équilibré.',
  discS:'Complément alimentaire, pas un médicament. Ne vise pas à diagnostiquer ou traiter une maladie.',
  sEy:'Simple', sH2:'3 étapes, <span class="grad">c’est tout</span>',
  s1t:'Choisissez l’offre', s1:'1, 2 ou 3 boîtes, puis votre nom et numéro.', s2t:'On confirme', s2:'On vous contacte sur WhatsApp pour confirmer.', s3t:'Livré, vous payez', s3:'Livraison gratuite, paiement à la réception.',
  oEy:'Offres', oH2:'Plus vous prenez, <span class="grad">plus vous économisez</span>',
  fEy:'Dernière étape', fH2:'Finalisez <span class="grad">votre commande</span>', fLead:'Remplissez vos infos : un message WhatsApp s’ouvre avec toute la commande. Envoyez-le et on confirme.',
  sumT:'Votre commande', ship:'Livraison', free:'Gratuite', pay:'Paiement', payv:'À la livraison', saved:'Vous économisez', total:'Total',
  formT:'Infos de livraison', fName:'Nom complet', fPhone:'Téléphone', fCity:'Ville', fAddr:'Adresse', fNote:'Note', opt:'(facultatif)', ft3:'Rien à payer maintenant',
  fSubmit:'Confirmer sur WhatsApp', fPriv:'Le site n’enregistre pas vos informations : elles vont uniquement sur notre WhatsApp.',
  disc:'FOCUS est un complément alimentaire, pas un médicament. Ces informations ne visent pas à diagnostiquer ou traiter une maladie. Lisez l’étiquette avant usage.',
  cEy:'Nouveau · Packs soin', cH2:'Shampooing + gel douche. <span class="grad">Le duo parfait.</span>', cLead:'Des packs prêts à offrir ou pour tous les jours, moins chers qu’à l’unité.',
  wH2:'Portez votre style. <span class="grad">Avec la baraka.</span>', wLead:'Hommes, femmes, pièces modernes et tenues traditionnelles. Choisissez la taille et ajoutez au panier.', hint3d:'↔ Bougez la souris pour tourner',
  qEy:'Bon à savoir', qH2:'Questions <span class="grad">fréquentes</span>',
  q1:'Comment je paie ?', a1:'En espèces, à la réception de votre colis. Rien à payer sur le site.',
  q2:'Combien coûte la livraison ?', a2:'La livraison est gratuite. On confirme le délai sur WhatsApp selon votre ville.',
  q3:'Que contient FOCUS ?', a3:'D’après l’étiquette : ginkgo 150 mg, bacopa 110 mg, L‑tyrosine 90 mg, citrate de magnésium 50 mg, vitamine B6 (2 mg) et B12 (2,5 µg).',
  q4:'Comment l’utiliser ?', a4:'1 à 2 gélules 30 minutes avant le coucher avec un verre d’eau. Ne pas dépasser la dose.',
  q5:'FOCUS est-il un médicament ?', a5:'Non, c’est un complément alimentaire. En cas de problème de santé ou de traitement, demandez l’avis d’un médecin.',
  q6:'Le numéro ONSSA sur la boîte ?', a6:'Le numéro CAPV.26.1009.24 correspond, dans le registre ONSSA, à l’établissement fabricant — ce n’est pas un enregistrement propre au produit FOCUS.',
  finH:'Prêt à commencer ?', finP:'Commandez maintenant, payez à la réception, la livraison est pour nous.', finCta:'Commander FOCUS →',
  melOnly:'seulement', melDh:'DH', melEy:'🌙 Nouveau · SLEEP', melH:'Nuits paisibles', melH2:'réveil reposé',
  melLead:'<b>Melatonin</b> : une boîte de 60 gélules à la mélatonine, magnésium, racine de valériane, L‑théanine et safran, pour vous détendre avant le coucher.',
  mi1:'Mélatonine', mi2:'Citrate de magnésium', mi3:'Racine de valériane', mi5:'Extrait de safran',
  melUse:'1 à 2 gélules par jour · Complément alimentaire, pas un médicament', melCta:'Commander Melatonin →', melAdd:'Ajouter au panier',
  duoEy:'Nouveau chez AL BARAKA', duoH:'Et aussi <span class="grad">chez nous</span>', duoP:'Compléments alimentaires fabriqués dans un laboratoire agréé ONSSA, paiement à la livraison et livraison gratuite.',
  morTag:'🌿 Énergie & vitalité', morAr:'', morP:'Boîte de 60 gélules à la poudre de feuilles de moringa, extrait de curcuma et poivre noir.', mor1:'Poudre de feuilles de moringa', mor2:'Extrait de curcuma', mor3:'Extrait de poivre noir', morCta:'Commander Moringa · 170 DH',
  omTag:'🐟 Oméga 3 · EPA & DHA', omAr:'', omP:'Boîte de 60 capsules d’huile de poisson riche en EPA et DHA, avec vitamine E.', om1:'Huile de poisson (EPA & DHA)', om4:'Vitamine E', omCta:'Commander Oméga 3 · 189 DH', addCart:'Ajouter au panier',
  duoNote:'Tel qu’indiqué sur l’étiquette · 1 à 2 gélules par jour · Compléments alimentaires, pas des médicaments · 🛡️ Laboratoire agréé ONSSA (CAPV.26.1009.24)',
  stickyBtn:'Commander', cart:'Panier', toOrder:'Finaliser la commande'
};
const AR = {};
const DYN = {
  ar:{box1:'علبة واحدة',boxN:n=>`${n} علب`,perBox:'للعلبة',save:'وفّر',add:'زيد للسلة',added:'تزادت للسلة ✓',size:'المقاس',remove:'حيّد',isNew:'جديد',instead:'بدل',
      choose:'اختار هاد العرض',empty:'السلة خاوية. بدا بـ FOCUS:',addFocus:'زيد FOCUS',
      errPhone:'رقم الهاتف ماشي صحيح (مثال: 0612345678)',errFields:'عمّر الاسم، الهاتف والمدينة',errEmpty:'زيد شي منتج للسلة أولاً',
      sent:'تفتحات رسالة واتساب، صيفطها باش نأكدو ✓',lang:'Français',items:'منتجات',
      li:['التوصيل مجاني','الدفع عند الاستلام'],li2:'وفّر',li3:'تكفي لمدة أطول',
      mTitle:'طلب جديد من موقع AL BARAKA',mName:'الاسم',mPhone:'الهاتف',mCity:'المدينة',mAddr:'العنوان',mNote:'ملاحظة',mItems:'الطلب',mTotal:'المجموع',mPay:'الدفع عند الاستلام · التوصيل مجاني',mRef:'المصدر',
      b1:['الدفع عند الاستلام','التوصيل مجاني','FOCUS · 60 كبسولة','2 علب بـ349 درهم','3 علب بـ479 درهم'],
      b2:['AL BARAKA SELECT','جنكة · باكوبا · B6 · B12','مكمّل غذائي','تأكيد عبر واتساب']},
  fr:{box1:'1 boîte',boxN:n=>`${n} boîtes`,perBox:'la boîte',save:'Économisez',add:'Ajouter au panier',added:'Ajouté au panier ✓',size:'Taille',remove:'Retirer',isNew:'NOUVEAU',instead:'au lieu de',
      choose:'Choisir cette offre',empty:'Panier vide. Commencez par FOCUS :',addFocus:'Ajouter FOCUS',
      errPhone:'Numéro invalide (ex : 0612345678)',errFields:'Indiquez votre nom, téléphone et ville',errEmpty:'Ajoutez d’abord un produit',
      sent:'WhatsApp est ouvert : envoyez le message pour confirmer ✓',lang:'العربية',items:'articles',
      li:['Livraison gratuite','Paiement à la livraison'],li2:'Économisez',li3:'Dure plus longtemps',
      mTitle:'Nouvelle commande — site AL BARAKA',mName:'Nom',mPhone:'Téléphone',mCity:'Ville',mAddr:'Adresse',mNote:'Note',mItems:'Commande',mTotal:'Total',mPay:'Paiement à la livraison · Livraison gratuite',mRef:'Source',
      b1:['PAIEMENT À LA LIVRAISON','LIVRAISON GRATUITE','FOCUS · 60 GÉLULES','2 BOÎTES À 349 DH','3 BOÎTES À 479 DH'],
      b2:['AL BARAKA SELECT','GINKGO · BACOPA · B6 · B12','COMPLÉMENT ALIMENTAIRE','CONFIRMATION WHATSAPP']}
};

/* ===================== pixels publicitaires ===================== */
(function loadPixels(){
  if (CONFIG.metaPixel) {
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', CONFIG.metaPixel); fbq('track', 'PageView');
  }
  if (CONFIG.tiktokPixel) {
    !function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];
    ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
    ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
    ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=i;ttq._t=ttq._t||{};ttq._t[e]=+new Date;ttq._o=ttq._o||{};ttq._o[e]=n||{};
    var o=d.createElement("script");o.type="text/javascript";o.async=!0;o.src=i+"?sdkid="+e+"&lib="+t;var a=d.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
    ttq.load(CONFIG.tiktokPixel);ttq.page()}(window,document,'ttq');
  }
})();
const TT = {ViewContent:'ViewContent', AddToCart:'AddToCart', InitiateCheckout:'InitiateCheckout', Lead:'SubmitForm'};
function track(ev, data){
  try { if (window.fbq) fbq('track', ev, data); } catch(e){}
  try { if (window.ttq) ttq.track(TT[ev] || ev, data); } catch(e){}
}

/* ===================== illustrations (packs & vêtements) ===================== */
function garment(type,c,a){
  const logo=(x,y)=>`<use href="#mark" x="${x-11}" y="${y-14}" width="22" height="24"/>`;
  const sh=`<defs><linearGradient id="s" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".18"/><stop offset=".45" stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient></defs>`;
  const body=d=>`<path d="${d}" fill="${c}"/><path d="${d}" fill="url(#s)"/>`;
  const S={
    tshirt:body('M95 50 L128 36 Q150 60 172 36 L205 50 L258 96 L228 130 L205 112 L205 300 Q150 310 95 300 L95 112 L72 130 L42 96 Z')+`<path d="M128 36 Q150 60 172 36" fill="none" stroke="${a}" stroke-width="4"/>${logo(150,104)}`,
    hoodie:body('M92 62 L120 46 Q150 70 180 46 L208 62 L252 120 L268 270 L238 276 L222 150 L210 140 L210 305 Q150 314 90 305 L90 140 L78 150 L62 276 L32 270 L48 120 Z')+`<path d="M112 50 Q150 0 188 50 Q150 82 112 50 Z" fill="${c}" stroke="rgba(0,0,0,.15)" stroke-width="3"/><path d="M140 72 L138 118 M160 72 L162 118" stroke="${a}" stroke-width="3" stroke-linecap="round"/><path d="M112 220 H188 L196 270 H104 Z" fill="rgba(0,0,0,.08)"/>${logo(150,168)}`,
    pants:body('M90 36 H210 L228 310 H166 L150 118 L134 310 H72 Z')+`<path d="M90 36 H210 V56 H90 Z" fill="rgba(0,0,0,.12)"/><path d="M150 56 V118" stroke="${a}" stroke-width="2" stroke-dasharray="5 4"/><path d="M100 70 Q118 92 136 72 M200 70 Q182 92 164 72" fill="none" stroke="${a}" stroke-width="2"/>`,
    jacket:body('M92 50 L130 38 L150 70 L170 38 L208 50 L250 116 L262 278 L232 282 L222 150 L210 140 L210 300 H90 L90 140 L78 150 L68 282 L38 278 L50 116 Z')+`<path d="M130 38 L150 120 L170 38" fill="rgba(0,0,0,.12)"/><path d="M150 70 V300" stroke="${a}" stroke-width="3"/><circle cx="150" cy="150" r="4" fill="${a}"/><circle cx="150" cy="190" r="4" fill="${a}"/><circle cx="150" cy="230" r="4" fill="${a}"/>`,
    robe:body('M118 34 Q150 54 182 34 L212 56 L268 150 L238 170 L214 130 L236 320 Q150 334 64 320 L86 130 L62 170 L32 150 L88 56 Z')+`<path d="M118 34 Q150 54 182 34 L150 110 Z" fill="rgba(0,0,0,.1)"/><path d="M150 50 V318" stroke="${a}" stroke-width="5"/><path d="M159 60 V318 M141 60 V318" stroke="${a}" stroke-width="1.5" stroke-dasharray="2 6"/><path d="M70 312 Q150 326 230 312" fill="none" stroke="${a}" stroke-width="4"/>`,
    cap:`<ellipse cx="150" cy="232" rx="125" ry="30" fill="rgba(0,0,0,.12)"/>`+body('M58 200 Q60 92 150 88 Q240 92 242 200 Z')+`<path d="M150 88 V200 M104 100 Q120 150 116 200 M196 100 Q180 150 184 200" stroke="rgba(0,0,0,.15)" stroke-width="2" fill="none"/><path d="M50 200 Q150 222 268 196 Q284 214 258 226 Q150 248 46 214 Z" fill="${c}"/><path d="M50 200 Q150 222 268 196 Q284 214 258 226 Q150 248 46 214 Z" fill="rgba(0,0,0,.18)"/><circle cx="150" cy="88" r="7" fill="${a}"/>${logo(150,158)}`
  };
  return `<svg class="art-svg" direction="ltr" viewBox="0 0 300 340" aria-hidden="true">${sh}${S[type]||S.tshirt}</svg>`;
}
function packArt(p){
  const c=p.color,a=p.accent;
  const bottle=(x,w,y,h,rx,cap,label)=>`
    <rect x="${x+(w-cap)/2}" y="${y-30}" width="${cap}" height="34" rx="9" fill="${a}"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${c}"/>${label==='GEL DOUCHE'?`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="#fff" opacity=".28"/>`:''}
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="url(#pk)"/>
    <rect x="${x+9}" y="${y+16}" width="7" height="${h-40}" rx="3.5" fill="#fff" opacity=".3"/>
    <rect x="${x+10}" y="${y+60}" width="${w-20}" height="104" rx="7" fill="#fffaf2"/>
    <use href="#mark" x="${x+w/2-12}" y="${y+68}" width="24" height="27"/>
    <text x="${x+w/2}" y="${y+114}" text-anchor="middle" font-family="DM Sans,Arial" font-size="7.5" font-weight="700" letter-spacing="1" fill="#2a1409">${label}</text>
    <path d="M${x+22} ${y+124}H${x+w-22}" stroke="#c27a2c"/>
    <text x="${x+w/2}" y="${y+140}" text-anchor="middle" font-family="Georgia,serif" font-size="8" font-style="italic" fill="#a8641f">Al Baraka</text>`;
  const duo=bottle(50,80,92,220,28,52,'SHAMPOOING')+bottle(158,86,120,192,40,46,'GEL DOUCHE');
  return `<svg class="art-svg" direction="ltr" viewBox="0 0 300 340" aria-hidden="true">
    <defs><linearGradient id="pk" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".2"/><stop offset=".4" stop-color="#fff" stop-opacity=".1"/><stop offset="1" stop-color="#000" stop-opacity=".25"/></linearGradient></defs>
    <ellipse cx="150" cy="316" rx="125" ry="10" fill="#000" opacity=".12"/>
    ${p.double?`<g transform="translate(46 26) scale(.82)" opacity=".55">${duo}</g><g transform="translate(-14 4)">${duo}</g>`:duo}</svg>`;
}
const picOf = p => p.img ? `<img src="${p.img}" alt="" loading="lazy">` : p.pack ? packArt(p) : garment(p.type,p.color,p.accent);

/* ===================== état ===================== */
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const store = {
  get(k,d){ try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch(e){ return d; } },
  set(k,v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} }
};
let lang = store.get('ab_lang','ar') === 'fr' ? 'fr' : 'ar';
let cat = 'all';
let cart = store.get('ab_cart', []).filter(i => byId(i.id) && i.qty > 0);
let offer = DEFAULT_OFFER;
let melOffer = DEFAULT_OFFER;
const chosen = {};
const fmt = n => (Math.round(n*100)/100).toLocaleString('fr-MA') + ' DH';
const t = k => DYN[lang][k];
const cartTotal = () => cart.reduce((s,i) => s + itemTotal(i), 0);
const cartFull  = () => cart.reduce((s,i) => s + itemFull(i), 0);
const cartCount = () => cart.reduce((s,i) => s + i.qty, 0);

/* source de la pub */
const qs = (() => { try { return new URLSearchParams(location.search); } catch(e){ return new Map(); } })();
const ref = (() => {
  try {
    const r = [qs.get('utm_source'), qs.get('utm_campaign'), qs.get('utm_content')].filter(Boolean).join(' / ') || (qs.get('fbclid') ? 'facebook' : qs.get('ttclid') ? 'tiktok' : '');
    if (r) sessionStorage.setItem('ab_ref', r);
    return r || sessionStorage.getItem('ab_ref') || '';
  } catch(e){ return ''; }
})();
if (CONFIG.adMode && (ref || qs.has('lp'))) document.documentElement.classList.add('admode');

/* ===================== rendu ===================== */
function applyLang(){
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  const dict = lang === 'ar' ? AR : FR;
  $$('[data-i18n]').forEach(el => { const v = dict[el.dataset.i18n]; if (v != null) el.innerHTML = v; });
  $('#langTxt').textContent = t('lang');
  const band = arr => { const w = arr.map(x => `<span>${x}</span>`).join(''); return w+w+w+w; };
  $('#t1').innerHTML = band(t('b1')); $('#t2').innerHTML = band(t('b2'));
  renderOrbit(); renderOffers(); renderMelOffers(); renderFilters(); renderGrid(); renderPacks(); renderCart();
  store.set('ab_lang', lang);
}
const boxLabel = q => q === 1 ? t('box1') : t('boxN')(q);
function renderOffers(){
  $('#heroOffers').innerHTML = OFFERS.map(o => `
    <label class="offer ${o.qty===offer?'on':''}">
      <input type="radio" name="offer" value="${o.qty}" ${o.qty===offer?'checked':''}>
      ${o.tag?`<span class="tag">${o.tag[lang]}</span>`:''}<span class="dot"></span>
      <span class="q">${boxLabel(o.qty)}</span>
      <span class="p">${o.price} <small>DH</small></span>
      ${o.qty>1?`<s>${UNIT*o.qty} DH</s><span class="save">${t('save')} ${UNIT*o.qty-o.price} DH</span>`:`<span class="save" style="color:#cfb39a">${t('perBox')}</span>`}
    </label>`).join('');
  $('#bigOffers').innerHTML = OFFERS.map(o => {
    const best = o.qty === 2;
    const per = Math.round(o.price/o.qty*100)/100;
    return `<div class="ob rv ${best?'best':''}">
      ${o.tag?`<span class="tag">${o.tag[lang]}</span>`:''}
      <div class="stack">${Array.from({length:o.qty}, () => `<img src="focus-bottle.png" alt="" loading="lazy">`).join('')}</div>
      <h3>${boxLabel(o.qty)}</h3>
      <div class="price">${o.price} <small>DH</small></div>
      ${o.qty>1?`<s>${UNIT*o.qty} DH</s>`:'<s style="visibility:hidden">0</s>'}
      <div class="per"><span dir="ltr">${fmt(per)}</span> ${t('perBox')}</div>
      <ul>${t('li').map(x=>`<li>${x}</li>`).join('')}${o.qty>1?`<li>${t('li2')} ${UNIT*o.qty-o.price} DH</li>`:''}</ul>
      <button type="button" class="btn ${best?'btn-fire':'btn-cream'} btn-block" style="${best?'':'background:var(--night);color:var(--cream)'}" data-offer="${o.qty}">${t('choose')}</button>
    </div>`;
  }).join('');
  updateCta();
  afterRender();
}
function updateCta(){
  const o = OFFERS.find(x => x.qty === offer);
  $('#ctaPrice').textContent = o.price + ' DH';
  if (!cart.length){ $('#stickyLbl').textContent = 'FOCUS · ' + boxLabel(offer); $('#stickyPrice').textContent = fmt(o.price); }
}
function renderOrbit(){
  $('#orbit').innerHTML = INGS.map(g => `<div class="ing-chip"><i>${g.ic}</i><span><b>${g[lang]}</b><small>${g.dose}</small></span></div>`).join('');
}
function cardHTML(p, i){
  const isPack = !!p.pack, sizes = p.sizes || SIZES;
  if (!isPack && !chosen[p.id]) chosen[p.id] = sizes.length > 1 ? sizes[1] : sizes[0];
  const sub = isPack ? p.scent[lang] : CATS.find(c => c.id === p.cat)[lang];
  return `<article class="card rv" style="transition-delay:${(i%4)*70}ms"><div class="card-in" data-tilt>
    <div class="pic" style="--bg1:${p.bg[0]};--bg2:${p.bg[1]}">${p.isNew?`<span class="badge b-new">${t('isNew')}</span>`:''}${isPack?`<span class="badge b-save">−${Math.round((1-p.price/p.old)*100)}%</span>`:''}${picOf(p)}<div class="shine"></div></div>
    <div class="info"><span class="cat">${sub}</span><h3>${p.name[lang]}</h3>${isPack?`<p>${p.items[lang]}</p>`:''}
      <div><span class="price">${fmt(p.price)}</span>${isPack?`<s class="old" aria-label="${t('instead')} ${fmt(p.old)}">${fmt(p.old)}</s>`:''}</div>
      ${isPack?'':`<div class="sizes" role="group" aria-label="${t('size')}">${sizes.map(s=>`<button type="button" class="size ${chosen[p.id]===s?'on':''}" data-p="${p.id}" data-size="${s}" aria-pressed="${chosen[p.id]===s}">${s}</button>`).join('')}</div>`}
      <button type="button" class="btn btn-fire" data-add="${p.id}">${t('add')}</button></div></div></article>`;
}
function renderFilters(){ $('#filters').innerHTML = CATS.map(c => `<button type="button" class="chip ${c.id===cat?'on':''}" data-cat="${c.id}">${c[lang]}</button>`).join(''); }
function renderGrid(){ $('#grid').innerHTML = CLOTHES.filter(p => cat==='all' || p.cat===cat).map(cardHTML).join(''); afterRender(); }
function renderPacks(){ $('#packGrid').innerHTML = PACKS.map(cardHTML).join(''); afterRender(); }
function lineHTML(i, k){
  const p = byId(i.id), tot = itemTotal(i), full = itemFull(i);
  const name = TIERED.includes(i.id) ? tierName(i) : p.name[lang];
  return `<div class="line"><div class="thumb" style="--bg1:${p.bg[0]};--bg2:${p.bg[1]}">${picOf(p)}</div>
    <div><b>${name}</b><small>${i.size ? t('size')+' : '+i.size : (i.id==='focus' ? '60 × '+i.qty : '')}</small>
      <div class="qty"><button type="button" data-q="${k}" data-d="-1" aria-label="-">−</button><span>${i.qty}</span><button type="button" data-q="${k}" data-d="1" aria-label="+">+</button></div></div>
    <div style="text-align:end"><div class="lp">${fmt(tot)}${full>tot?`<s>${fmt(full)}</s>`:''}</div><button type="button" class="rm" data-rm="${k}">${t('remove')}</button></div></div>`;
}
function renderCart(){
  const n = cartCount(), total = cartTotal(), saved = cartFull() - total;
  const c = $('#count'); c.textContent = n; c.classList.toggle('on', n > 0);
  const lines = cart.map(lineHTML).join('');
  const empty = `<div class="emptybox">${t('empty')}<img src="focus-bottle.png" alt="" loading="lazy"><button type="button" class="btn btn-fire" data-buy>${t('addFocus')} · ${OFFERS[offer-1].price} DH</button></div>`;
  $('#sumList').innerHTML = n ? lines : empty;
  $('#dList').innerHTML = n ? lines : empty;
  $('#sumTotal').textContent = $('#dTotal').textContent = fmt(total);
  $('#savedRow').hidden = !(saved > 0); $('#savedVal').textContent = fmt(saved);
  if (n){ $('#stickyLbl').textContent = `${n} ${t('items')}`; $('#stickyPrice').textContent = fmt(total); } else updateCta();
  store.set('ab_cart', cart);
}

/* ===================== effets ===================== */
const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
const fineHover = matchMedia('(hover:hover) and (pointer:fine)').matches && !reduce;
const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }), {rootMargin:'0px 0px -6% 0px'}) : null;
function afterRender(){
  $$('.rv:not(.in)').forEach(el => io ? io.observe(el) : el.classList.add('in'));
  if (!fineHover) return;
  $$('[data-tilt]:not([data-b])').forEach(el => {
    el.dataset.b = 1;
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect(), x = (e.clientX-r.left)/r.width, y = (e.clientY-r.top)/r.height;
      el.style.transform = `perspective(900px) rotateY(${(x-.5)*12}deg) rotateX(${(.5-y)*10}deg) translateZ(6px)`;
      el.style.setProperty('--mx', x*100+'%'); el.style.setProperty('--my', y*100+'%');
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}

/* orbite 3D des ingrédients autour de la boîte */
(function orbit(){
  const stage = $('#stage'), wrap = $('#bottleWrap');
  let visible = true, tx = 0, ty = 0, rx = 0, ry = 0, start = performance.now();
  if (io) new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(stage);
  if (fineHover){
    stage.addEventListener('pointermove', e => { const r = stage.getBoundingClientRect(); tx = (e.clientX-r.left)/r.width-.5; ty = (e.clientY-r.top)/r.height-.5; });
    stage.addEventListener('pointerleave', () => { tx = 0; ty = 0; });
  }
  function frame(now){
    if (!reduce) requestAnimationFrame(frame);
    if (!visible) return;
    const chips = $$('#orbit .ing-chip'); if (!chips.length) return;
    const w = stage.clientWidth, h = stage.clientHeight;
    const RX = Math.min(w*0.42, w/2 - 66, 300), RY = Math.min(h*0.13, 82), CY = h*0.06;
    const time = reduce ? 0 : (now - start) / 1000;
    rx += (tx - rx) * .06; ry += (ty - ry) * .06;
    chips.forEach((el, i) => {
      const a = time * 0.32 + i / chips.length * Math.PI * 2;
      const s = Math.sin(a), cz = (s + 1) / 2;               // 0 = back, 1 = front
      const x = Math.cos(a) * RX + rx * 30, y = s * RY + CY + (i % 2 ? -1 : 1) * (h * 0.17) * (1 - cz * .35) + ry * 20;
      const sc = 0.72 + cz * 0.38;
      el.style.transform = `translate(-50%,-50%) translate(${x}px,${y}px) scale(${sc})`;
      el.style.zIndex = cz > 0.5 ? 7 : 3;
      el.style.opacity = (0.45 + cz * 0.55).toFixed(2);
      el.style.filter = cz < 0.35 ? `blur(${((0.35 - cz) * 4).toFixed(1)}px)` : '';
    });
    wrap.style.transform = `rotateY(${rx * 22}deg) rotateX(${-ry * 12}deg)`;
  }
  requestAnimationFrame(frame);
})();

/* ===================== actions ===================== */
let toastT;
function toast(m){ const el = $('#toast'); el.textContent = m; el.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), 2300); }
function bump(){ const c = $('#count'); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump'); }
function setFocusQty(q){
  const ex = cart.find(i => i.id === 'focus');
  if (ex) ex.qty = q; else cart.unshift({id:'focus', size:'', qty:q});
  renderCart(); bump();
  track('AddToCart', {content_ids:['focus'], content_name:'FOCUS', content_type:'product', value:focusPrice(q), currency:CONFIG.currency, num_items:q});
}
function addToCart(id, size){
  if (id === 'focus'){ const ex = cart.find(i => i.id === 'focus'); return setFocusQty(ex ? ex.qty + 1 : offer); }
  const ex = cart.find(i => i.id === id && i.size === size);
  ex ? ex.qty++ : cart.push({id, size, qty:1});
  renderCart(); bump(); toast(t('added'));
  const p = byId(id);
  track('AddToCart', {content_ids:[id], content_name:p.name.fr, content_type:'product', value:p.price, currency:CONFIG.currency});
}
function openCart(on){ $('#drawer').classList.toggle('on', on); $('#veil').classList.toggle('on', on); }
let checkoutTracked = false;
function goOrder(){
  openCart(false);
  $('#order').scrollIntoView({behavior: reduce ? 'auto' : 'smooth'});
  if (!checkoutTracked && cart.length){ checkoutTracked = true; track('InitiateCheckout', {value:cartTotal(), currency:CONFIG.currency, num_items:cartCount()}); }
  setTimeout(() => { const f = $('#orderForm [name=name]'); if (f && !f.value && fineHover) f.focus({preventScroll:true}); }, 800);
}
function buy(q){ setFocusQty(q || offer); goOrder(); }

document.addEventListener('change', e => {
  if (e.target.name === 'meloffer'){ melOffer = +e.target.value; $$('#melOffers .offer').forEach(l => l.classList.toggle('on', l.contains(e.target))); $('#melPrice').textContent = OFFERS[melOffer-1].price + ' DH'; }
  if (e.target.name === 'offer'){ offer = +e.target.value; $$('#heroOffers .offer').forEach(l => l.classList.toggle('on', l.contains(e.target))); updateCta(); }
});
document.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.buyProd){ const id = b.dataset.buyProd; if (!cart.some(i => i.id === id)) addToCart(id, ''); return goOrder(); }
  if (b.hasAttribute('data-buy-mel')){ setTierQty('melatonin', melOffer); return goOrder(); }
  if (b.hasAttribute('data-buy')) return buy(cart.find(i=>i.id==='focus') && b.closest('.sticky,.drawer') ? cart.find(i=>i.id==='focus').qty : offer);
  if (b.dataset.offer){ offer = +b.dataset.offer; renderOffers(); return buy(offer); }
  if (b.dataset.cat){ cat = b.dataset.cat; renderFilters(); renderGrid(); return; }
  if (b.dataset.size){
    chosen[b.dataset.p] = b.dataset.size;
    b.parentElement.querySelectorAll('.size').forEach(s => { const on = s === b; s.classList.toggle('on', on); s.setAttribute('aria-pressed', on); });
    return;
  }
  if (b.dataset.add){ addToCart(b.dataset.add, chosen[b.dataset.add] || ''); return; }
  if (b.dataset.q){ const i = cart[+b.dataset.q]; i.qty += +b.dataset.d; if (i.qty < 1) cart.splice(+b.dataset.q, 1); renderCart(); return; }
  if (b.dataset.rm){ cart.splice(+b.dataset.rm, 1); renderCart(); return; }
});
$('#cartBtn').onclick = () => openCart(true);
$('#closeCart').onclick = () => openCart(false);
$('#veil').onclick = () => openCart(false);
$('#toOrder').onclick = () => { if (!cart.length) setFocusQty(offer); goOrder(); };
document.addEventListener('keydown', e => { if (e.key === 'Escape') openCart(false); });
$('#lang').onclick = () => { lang = lang === 'ar' ? 'fr' : 'ar'; applyLang(); };

/* formulaire -> WhatsApp */
const normPhone = v => v.replace(/[\s.\-()]/g,'');
const phoneOk = v => /^(?:\+?212|0)[5-7]\d{8}$/.test(normPhone(v));
$('#orderForm').addEventListener('input', e => { if (e.target.name) e.target.removeAttribute('aria-invalid'); });
$('#orderForm').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target, msg = $('#formMsg'); msg.className = 'err';
  const val = n => (f.elements[n].value || '').trim();
  if (!cart.length) setFocusQty(offer);
  let bad = null;
  ['name','phone','city'].forEach(n => { const ok = n === 'phone' ? phoneOk(val(n)) : val(n).length > 1; f.elements[n].setAttribute('aria-invalid', !ok); if (!ok && !bad) bad = n; });
  if (bad){ msg.textContent = bad === 'phone' && val('phone') ? t('errPhone') : t('errFields'); f.elements[bad].focus(); return; }
  const lines = cart.map(i => { const p = byId(i.id); const nm = TIERED.includes(i.id) ? tierName(i) : `${p.name[lang]}${i.size ? ' — '+t('size')+' '+i.size : ''} × ${i.qty}`; return `• ${nm} = ${fmt(itemTotal(i))}`; });
  const text = [
    `*${t('mTitle')}*`, '',
    `${t('mName')}: ${val('name')}`, `${t('mPhone')}: ${normPhone(val('phone'))}`, `${t('mCity')}: ${val('city')}`,
    val('address') ? `${t('mAddr')}: ${val('address')}` : null, val('notes') ? `${t('mNote')}: ${val('notes')}` : null, '',
    `*${t('mItems')}:*`, ...lines, '', `*${t('mTotal')}: ${fmt(cartTotal())}*`, t('mPay'),
    ref ? `${t('mRef')}: ${ref}` : null
  ].filter(l => l !== null).join('\n');
  track('Lead', {value:cartTotal(), currency:CONFIG.currency, content_ids:cart.map(i=>i.id), num_items:cartCount()});
  window.open('https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
  msg.className = 'err ok'; msg.textContent = t('sent');
});

/* barre mobile + bulle WhatsApp cachées sur le formulaire et en haut de page */
if (io){
  let inOrder = false, inHero = true;
  const upd = () => { const hide = inOrder || inHero; $('#sticky').classList.toggle('hide', hide); $('#waFloat').classList.toggle('hide', inOrder); };
  new IntersectionObserver(es => { inOrder = es[0].isIntersecting; upd(); }, {threshold:.12}).observe($('#order'));
  new IntersectionObserver(es => { inHero = es[0].isIntersecting; upd(); }, {threshold:0}).observe($('.cta-row'));
}

/* ===================== init ===================== */
$$('[data-i18n]').forEach(el => { AR[el.dataset.i18n] = el.innerHTML; });
$('#year').textContent = new Date().getFullYear();
$('#fallback').innerHTML = garment('hoodie', '#8a4b2a', '#f7c978');
applyLang();
track('ViewContent', {content_ids:['focus'], content_name:'FOCUS', content_type:'product', value:UNIT, currency:CONFIG.currency});

/* ===================== scène 3D vêtements (chargée à la demande) ===================== */
(function lazy3D(){
  const stage = $('#stage3d');
  if (!stage || !io || document.documentElement.classList.contains('admode')) return;
  const obs = new IntersectionObserver(es => {
    if (!es[0].isIntersecting) return;
    obs.disconnect();
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    s.onload = () => init3D(stage);
    document.head.appendChild(s);
  }, {rootMargin:'400px'});
  obs.observe(stage);
})();

function init3D(stage){
  if (!window.THREE) return;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({antialias:true, alpha:true}); } catch(e){ return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  stage.prepend(renderer.domElement);
  $('#fallback').style.display = 'none';
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, .1, 100); camera.position.set(0, 0, 9.5);
  scene.add(new THREE.AmbientLight(0xfff0dd, .75));
  const key = new THREE.DirectionalLight(0xffffff, .9); key.position.set(3,4,6); scene.add(key);
  const rim = new THREE.PointLight(0xffb060, 1.3, 20); rim.position.set(-4,-1,3); scene.add(rim);
  const cv = document.createElement('canvas'); cv.width = 1024; cv.height = 1280;
  const ctx = cv.getContext('2d');
  function paint(){
    const W = cv.width, H = cv.height;
    const gr = ctx.createLinearGradient(0,0,W,H); gr.addColorStop(0,'#7a3a18'); gr.addColorStop(1,'#2a1206');
    ctx.fillStyle = gr; ctx.fillRect(0,0,W,H);
    ctx.globalAlpha = .06; ctx.strokeStyle = '#fff'; ctx.lineWidth = 1;
    for (let i=0;i<W;i+=6){ ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,H); ctx.stroke(); }
    for (let j=0;j<H;j+=6){ ctx.beginPath(); ctx.moveTo(0,j); ctx.lineTo(W,j); ctx.stroke(); }
    ctx.globalAlpha = .18; ctx.strokeStyle = '#f7c978'; ctx.lineWidth = 2;
    for (let y=60;y<H;y+=160) for (let x=(y/160%2)*80+40;x<W;x+=160){ ctx.save(); ctx.translate(x,y); for (let r=0;r<2;r++){ ctx.rotate(Math.PI/4); ctx.strokeRect(-22,-22,44,44); } ctx.restore(); }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = '#f7c978'; ctx.lineWidth = 6; ctx.strokeRect(50,50,W-100,H-100); ctx.lineWidth = 2; ctx.strokeRect(70,70,W-140,H-140);
    ctx.save(); ctx.translate(W/2-80, H/2-345); ctx.scale(2.5,2.5);
    ctx.beginPath(); ctx.moveTo(8,68); ctx.lineTo(8,30); ctx.arc(32,30,24,Math.PI,0); ctx.lineTo(56,68); ctx.strokeStyle='#f7c978'; ctx.lineWidth=2.6; ctx.stroke();
    ctx.fillStyle='#f7c978'; ctx.translate(32,30); ctx.fillRect(-6.5,-6.5,13,13); ctx.rotate(Math.PI/4); ctx.fillRect(-6.5,-6.5,13,13); ctx.rotate(-Math.PI/4);
    ctx.font='700 13px "Playfair Display",Georgia,serif'; ctx.textAlign='center'; ctx.fillText('AB',0,28);
    ctx.restore();
    ctx.fillStyle = '#f7c978'; ctx.textAlign = 'center';
    ctx.font = '600 132px "Playfair Display",Georgia,serif'; ctx.fillText('AL BARAKA', W/2, H/2-20);
    ctx.font = '700 54px "DM Sans",Arial,sans-serif';
    if ('letterSpacing' in ctx) ctx.letterSpacing = '26px';
    ctx.fillText('CLOTHES', W/2+13, H/2+80);
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
    ctx.fillStyle = 'rgba(247,201,120,.85)'; ctx.font = 'italic 40px "Playfair Display",Georgia,serif';
    ctx.fillText('Collection 2026', W/2, H/2+220);
  }
  paint();
  const tex = new THREE.CanvasTexture(cv); tex.encoding = THREE.sRGBEncoding; tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { paint(); tex.needsUpdate = true; frame.done = false; });
  const group = new THREE.Group(); scene.add(group);
  const CW = 3.4, CH = 4.25;
  const geo = new THREE.PlaneGeometry(CW, CH, 48, 60);
  const base = geo.attributes.position.array.slice();
  group.add(new THREE.Mesh(geo, new THREE.MeshStandardMaterial({map:tex, side:THREE.DoubleSide, roughness:.85, metalness:.05})));
  const gold = new THREE.MeshStandardMaterial({color:0xe0a85a, metalness:.9, roughness:.25});
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,CW+.7,32), gold); rod.rotation.z = Math.PI/2; rod.position.y = CH/2+.04; group.add(rod);
  [-1,1].forEach(s => { const b = new THREE.Mesh(new THREE.SphereGeometry(.13,32,16), gold); b.position.set(s*(CW/2+.38), CH/2+.04, 0); group.add(b); });
  const hook = new THREE.Mesh(new THREE.TorusGeometry(.32,.04,16,48,Math.PI*1.3), gold); hook.position.set(0, CH/2+.42, 0); hook.rotation.z = -Math.PI*.15; group.add(hook);
  const bits = [], shapes = [new THREE.OctahedronGeometry(.16), new THREE.TorusGeometry(.14,.045,12,32), new THREE.IcosahedronGeometry(.13)];
  for (let i=0;i<12;i++){ const m = new THREE.Mesh(shapes[i%3], gold); m.userData = {a:i/12*Math.PI*2, r:2.6+Math.random()*.8, y:(Math.random()-.5)*4, s:.2+Math.random()*.3}; scene.add(m); bits.push(m); }
  let tx=0, ty=0, rx=0, ry=0, drag=null;
  stage.addEventListener('pointermove', e => {
    const r = stage.getBoundingClientRect(), nx = (e.clientX-r.left)/r.width-.5, ny = (e.clientY-r.top)/r.height-.5;
    if (drag !== null) tx = drag.t + (e.clientX-drag.x)/r.width*Math.PI*1.6; else if (e.pointerType === 'mouse') tx = nx*1.1;
    ty = ny*.35;
  });
  stage.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse') drag = {x:e.clientX, t:tx}; });
  addEventListener('pointerup', () => { drag = null; });
  stage.addEventListener('pointerleave', () => { if (drag === null){ tx = 0; ty = 0; } });
  function resize(){ const w = stage.clientWidth, h = stage.clientHeight; renderer.setSize(w,h,false); camera.aspect = w/h; camera.position.z = w/h < .8 ? 11.5 : 9.5; camera.updateProjectionMatrix(); frame.done = false; }
  new ResizeObserver(resize).observe(stage);
  let visible = true;
  new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(stage);
  const pos = geo.attributes.position;
  function wave(tm){
    for (let i=0;i<pos.count;i++){
      const x = base[i*3], y = base[i*3+1], k = (CH/2-y)/CH;
      pos.array[i*3+2] = (Math.sin(x*1.7+tm*1.9)*.22 + Math.sin(y*2.3+tm*1.3)*.12 + Math.sin((x+y)*3+tm*2.6)*.05)*k;
      pos.array[i*3] = x*(1-k*.04*Math.sin(tm*1.1));
    }
    pos.needsUpdate = true; geo.computeVertexNormals();
  }
  const clock = new THREE.Clock();
  function frame(){
    requestAnimationFrame(frame);
    if (!visible || (reduce && frame.done)) return;
    const tm = reduce ? 1.2 : clock.getElapsedTime();
    wave(tm);
    rx += (ty-rx)*.06; ry += (tx-ry)*.06;
    group.rotation.y = ry + (reduce ? 0 : Math.sin(tm*.4)*.18);
    group.rotation.x = rx*.5;
    group.position.y = reduce ? 0 : Math.sin(tm*.9)*.08;
    bits.forEach(b => { const u = b.userData, a = u.a+tm*u.s*.6; b.position.set(Math.cos(a)*u.r, u.y+Math.sin(tm+u.a)*.25, Math.sin(a)*u.r*.6-.5); b.rotation.x = tm*u.s*2; b.rotation.y = tm*u.s*3; });
    renderer.render(scene, camera);
    frame.done = true;
  }
  resize(); frame();
}

/* ===================== offres Melatonin ===================== */
function renderMelOffers(){
  const box = document.getElementById('melOffers'); if (!box) return;
  box.innerHTML = OFFERS.map(o => `
    <label class="offer ${o.qty===melOffer?'on':''}">
      <input type="radio" name="meloffer" value="${o.qty}" ${o.qty===melOffer?'checked':''}>
      ${o.tag?`<span class="tag">${o.tag[lang]}</span>`:''}<span class="dot"></span>
      <span class="q">${boxLabel(o.qty)}</span>
      <span class="p">${o.price} <small>DH</small></span>
      ${o.qty>1?`<s>${UNIT*o.qty} DH</s><span class="save">${t('save')} ${UNIT*o.qty-o.price} DH</span>`:`<span class="save" style="color:#cfb39a">${t('perBox')}</span>`}
    </label>`).join('');
  const pb = document.getElementById('melPrice'); if (pb) pb.textContent = OFFERS[melOffer-1].price + ' DH';
}
function setTierQty(id, q){
  const ex = cart.find(i => i.id === id);
  if (ex) ex.qty = q; else cart.push({id, size:'', qty:q});
  renderCart(); bump();
  track('AddToCart', {content_ids:[id], content_name:id, content_type:'product', value:focusPrice(q), currency:CONFIG.currency, num_items:q});
}
renderMelOffers();
