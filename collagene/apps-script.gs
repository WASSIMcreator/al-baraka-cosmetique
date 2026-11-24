/**
 * AL BARAKA · Collagène marin 25 gommes
 * Receives orders from collagene/index.html, writes them FIRST to the
 * "Commandes Collagène" sheet (guaranteed backup), then creates them in
 * COD Marque Online (app.codmarqueonline.ma) and sends a deduplicated
 * server-side Purchase event to Meta Conversions API (Pixel 4547426528828820).
 *
 * Setup (once):
 *  1. Open the Google Sheet > Extensions > Apps Script, paste this file.
 *  2. Project Settings (gear) > Script properties:
 *       - MO_API_KEY = <your Marque Online API key>
 *       - META_CAPI_TOKEN = <your Meta CAPI access token for Pixel 4547426528828820>
 *       - META_TEST_EVENT_CODE = <optional TEST12345 while testing; delete when live>
 *  3. Deploy > Manage deployments > pencil icon > Version: New version > Deploy.
 */

var API = 'https://api.codmarqueonline.ma/api/merchant-api';
var PRODUCT_ID = '2d07949a-cfb2-4710-91c4-1f41ddd29e5c'; // كولاجين بحري Collagène Marin 25 gommes
var PRICES = { 1: 195, 2: 350 };                            // server-authoritative pricing
var SHEET_NAME = 'Commandes Collagène';
var HEAD = ['Date', 'Réf', 'Nom', 'Téléphone', 'Ville', 'Adresse', 'Boîtes', 'Total DH', 'Source', 'Marque Online', 'Détail', 'CAPI_Status'];
var MAX_PER_PHONE = 3;    // orders per phone in 6 hours (anti-spam)
var MAX_PER_HOUR = 120;   // global safety cap per hour across all phones
var META_PIXEL_ID = '4547426528828820';
var META_GRAPH_VER = 'v21.0';
var DEFAULT_SOURCE_URL = 'https://wassimcreator.github.io/al-baraka-cosmetique/collagene/';

// Arabic -> Marque Online Latin city aliases (top Moroccan cities + common spellings)
var AR_CITIES = {
  'الدار البيضاء': 'CASABLANCA', 'دار البيضاء': 'CASABLANCA', 'كازا': 'CASABLANCA', 'كازابلانكا': 'CASABLANCA',
  'الرباط': 'RABAT', 'رباط': 'RABAT',
  'سلا': 'SALE', 'سلا الجديدة': 'SALA AL JADIDA',
  'طنجة': 'TANGER', 'طنجه': 'TANGER',
  'مراكش': 'MARRAKECH',
  'فاس': 'FES',
  'مكناس': 'MEKNES',
  'اكادير': 'AGADIR', 'اڭادير': 'AGADIR', 'اغادير': 'AGADIR',
  'وجدة': 'OUJDA', 'وجده': 'OUJDA',
  'القنيطرة': 'KENITRA', 'قنيطرة': 'KENITRA', 'القنيطره': 'KENITRA', 'قنيطره': 'KENITRA',
  'تطوان': 'TETOUAN',
  'المحمدية': 'MOHAMMEDIA', 'محمدية': 'MOHAMMEDIA', 'المحمديه': 'MOHAMMEDIA',
  'اسفي': 'SAFI', 'اصفي': 'SAFI',
  'الجديدة': 'EL JADIDA', 'جديدة': 'EL JADIDA', 'الجديده': 'EL JADIDA',
  'بني ملال': 'BENI MELLAL',
  'الناظور': 'NADOR', 'ناظور': 'NADOR', 'الناضور': 'NADOR', 'ناضور': 'NADOR',
  'تازة': 'TAZA', 'تازه': 'TAZA',
  'سطات': 'SETTAT',
  'برشيد': 'BERRECHID',
  'خريبكة': 'KHOURIBGA', 'خريبكه': 'KHOURIBGA', 'خريبڭة': 'KHOURIBGA',
  'العيون': 'LAAYOUNE', 'عيون': 'LAAYOUNE',
  'الداخلة': 'DAKHLA', 'داخلة': 'DAKHLA', 'الداخله': 'DAKHLA',
  'العرائش': 'LARACHE', 'عرائش': 'LARACHE',
  'القصر الكبير': 'KSAR EL KEBIR', 'قصر الكبير': 'KSAR EL KEBIR',
  'الحسيمة': 'AL HOCEIMA', 'حسيمة': 'AL HOCEIMA', 'الحسيمه': 'AL HOCEIMA',
  'تارودانت': 'TAROUDANT',
  'انزكان': 'INEZGANE', 'انزڭان': 'INEZGANE',
  'ايت ملول': 'AIT MELLOUL',
  'تمارة': 'TEMARA', 'تماره': 'TEMARA',
  'الصويرة': 'ESSAOUIRA', 'صويرة': 'ESSAOUIRA', 'الصويره': 'ESSAOUIRA',
  'ورزازات': 'OUARZAZATE',
  'الراشيدية': 'ERRACHIDIA', 'راشيدية': 'ERRACHIDIA', 'الرشيدية': 'ERRACHIDIA', 'الراشيديه': 'ERRACHIDIA',
  'كلميم': 'GUELMIM', 'ڭلميم': 'GUELMIM',
  'تيزنيت': 'TIZNIT', 'تزنيت': 'TIZNIT',
  'شفشاون': 'CHEFCHAOUEN', 'الشاون': 'CHEFCHAOUEN', 'شاون': 'CHEFCHAOUEN',
  'تاوريرت': 'TAOURIRT',
  'بركان': 'BERKANE',
  'سيدي قاسم': 'SIDI KACEM',
  'سيدي سليمان': 'SIDI SLIMANE',
  'اليوسفية': 'YOUSSOUFIA', 'يوسفية': 'YOUSSOUFIA', 'اليوسفيه': 'YOUSSOUFIA',
  'بن جرير': 'BENGUERIR', 'بنجرير': 'BENGUERIR', 'بن ڭرير': 'BENGUERIR',
  'قلعة السراغنة': 'EL KELAA DES SRAGHNA', 'قلعه السراغنه': 'EL KELAA DES SRAGHNA',
  'خنيفرة': 'KHENIFRA', 'خنيفره': 'KHENIFRA',
  'الفقيه بن صالح': 'FQUIH BEN SALAH', 'فقيه بن صالح': 'FQUIH BEN SALAH',
  'سيدي بنور': 'SIDI BENNOUR',
  'اولاد تايمة': 'OULAD TEIMA', 'ولاد تايمة': 'OULAD TEIMA', 'اولاد تايمه': 'OULAD TEIMA',
  'تيفلت': 'TIFLET',
  'الخميسات': 'KHEMISSET', 'خميسات': 'KHEMISSET',
  'افران': 'IFRANE',
  'ازرو': 'AZROU',
  'صفرو': 'SEFROU',
  'وزان': 'OUAZZANE',
  'الفنيدق': 'FNIDEQ', 'فنيدق': 'FNIDEQ',
  'المضيق': 'MDIQ', 'مضيق': 'MDIQ',
  'مرتيل': 'MARTIL',
  'اصيلة': 'ASILAH', 'اصيله': 'ASILAH',
  'بوزنيقة': 'BOUZNIKA', 'بوزنيقه': 'BOUZNIKA',
  'الصخيرات': 'SKHIRAT', 'صخيرات': 'SKHIRAT',
  'بنسليمان': 'BENSLIMANE',
  'السمارة': 'SMARA', 'سمارة': 'SMARA', 'السماره': 'SMARA',
  'طانطان': 'TAN TAN', 'طان طان': 'TAN TAN',
  'زاكورة': 'ZAGORA', 'زاڭورة': 'ZAGORA', 'زاكوره': 'ZAGORA',
  'تنغير': 'TINGHIR',
  'ميدلت': 'MIDELT',
  'جرسيف': 'GUERCIF', 'ڭرسيف': 'GUERCIF',
  'الدريوش': 'DRIOUCH', 'دريوش': 'DRIOUCH',
  'العروي': 'EL AROUI', 'عروي': 'EL AROUI',
  'ازمور': 'AZEMMOUR',
  'وادي زم': 'OUED ZEM', 'واد زم': 'OUED ZEM',
  'ابي الجعد': 'BEJAAD', 'بجعد': 'BEJAAD',
  'ازيلال': 'AZILAL',
  'دمنات': 'DEMNATE',
  'شيشاوة': 'CHICHAOUA', 'شيشاوه': 'CHICHAOUA',
  'بيوكرى': 'BIOUGRA', 'بيوڭرى': 'BIOUGRA', 'بيوكري': 'BIOUGRA',
  'الدشيرة': 'DCHEIRA', 'دشيرة': 'DCHEIRA',
  'بوسكورة': 'BOUSKOURA', 'بوسكوره': 'BOUSKOURA',
  'دار بوعزة': 'DAR BOUAZZA', 'دار بوعزه': 'DAR BOUAZZA',
  'سوق الاربعاء': 'SOUK EL ARBAA',
  'سيدي يحيى الغرب': 'SIDI YAHYA EL GHARB', 'سيدي يحيي الغرب': 'SIDI YAHYA EL GHARB'
};

function doGet(e) {
  if (e && e.parameter && e.parameter.action === 'cities') {
    return out({ ok: true, cities: cities_().map(function (c) { return c.name; }) });
  }
  return out({ ok: true });
}

function doPost(e) {
  var o;
  try { o = JSON.parse((e && e.postData && e.postData.contents) || '{}'); } catch (_) { return out({ ok: false, error: 'bad json' }); }
  if (o.hp) return out({ ok: true }); // hidden field: only robots fill it

  var nom = clean_(o.nom, 80);
  var phone = normPhone_(o.tel);
  var ville = clean_(o.ville, 60);
  var adresse = clean_(o.adresse, 200);
  var src = clean_(o.src, 120);
  var q = o.q == 2 ? 2 : 1;
  var total = PRICES[q];
  var ref = 'ALB-' + String(o.id || '').replace(/[^\w-]/g, '').slice(0, 30);
  var eventId = clean_(o.event_id, 80) || (ref + '-pur');

  if (nom.length < 2 || !phone.valid || !ville || adresse.length < 3 || ref.length < 8) {
    return out({ ok: false, error: 'missing fields' });
  }

  var cache = CacheService.getScriptCache();
  var done = cache.get('ref:' + ref); // same click sent twice
  if (done) return out({ ok: true, order: done, dedup: true });

  // Rate limits: per normalized phone (6h) + global hourly safety cap
  var phoneKey = 'tel:' + phone.e164;
  var hourKey = 'hr:' + Utilities.formatDate(new Date(), 'Africa/Casablanca', 'yyyyMMddHH');
  var nPhone = +(cache.get(phoneKey) || 0);
  var nHour = +(cache.get(hourKey) || 0);
  if (nPhone >= MAX_PER_PHONE) return out({ ok: false, error: 'too many' });
  if (nHour >= MAX_PER_HOUR) return out({ ok: false, error: 'too many orders this hour' });
  cache.put(phoneKey, String(nPhone + 1), 21600);
  cache.put(hourKey, String(nHour + 1), 3600);

  // Resolve Marque Online city safely (never throw)
  var city = null;
  try { city = findCity_(ville); } catch (_) { city = null; }
  var displayCity = city ? city.name : ville;

  // 1) GUARANTEED BACKUP FIRST: write the row to Google Sheet BEFORE calling Marque Online
  var rowIndex = 0;
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sh = sheet_();
    sh.appendRow([new Date(), ref, nom, "'" + phone.local, displayCity, adresse, q, total, src, 'EN COURS', '', '']);
    rowIndex = sh.getLastRow();
  } finally {
    lock.releaseLock();
  }

  // 2) Send order to COD Marque Online (wrapped in try/catch so a timeout/network error never loses the row)
  var status = '', detail = '', orderNumber = '';
  if (!city) {
    status = 'ERREUR VILLE';
    detail = 'Ville introuvable dans Marque Online (' + ville + '): ajoutez la commande à la main';
  } else {
    try {
      var res = UrlFetchApp.fetch(API + '/orders', {
        method: 'post', contentType: 'application/json', muteHttpExceptions: true,
        headers: { Authorization: 'Bearer ' + key_() },
        payload: JSON.stringify({
          externalReference: ref, fullName: nom, phoneNumber: phone.local, cityId: city.cityId,
          address: adresse, customerAmount: total, requiresConfirmation: true,
          note: (q === 2 ? 'Offre 2 boîtes = 350 DH' : '1 boîte = 195 DH') + (src ? ' · ' + src : ''),
          items: [{ productId: PRODUCT_ID, quantity: q }]
        })
      });
      var code = res.getResponseCode(), body = res.getContentText();
      if (code >= 200 && code < 300) {
        try { orderNumber = JSON.parse(body).orderNumber || 'OK'; } catch (_) { orderNumber = 'OK'; }
        status = 'ENVOYÉE';
        detail = orderNumber;
      } else {
        status = 'ERREUR ' + code;
        detail = String(body || '').slice(0, 400);
      }
    } catch (err) {
      status = 'ERREUR RÉSEAU';
      detail = String(err || '').slice(0, 400);
    }
  }

  // 3) Send server-side Purchase to Meta Conversions API (deduplicated with browser event_id)
  var capiStatus = sendCapiPurchase_({
    eventId: eventId,
    nom: nom,
    phoneE164: phone.e164,
    city: displayCity,
    q: q,
    total: total,
    fbp: clean_(o.fbp, 120),
    fbc: clean_(o.fbc, 200),
    sourceUrl: clean_(o.event_source_url, 500) || DEFAULT_SOURCE_URL,
    userAgent: clean_(o.client_user_agent, 500)
  });

  // 4) Update the exact Sheet row with Marque Online + CAPI results
  if (rowIndex > 1) {
    var lock2 = LockService.getScriptLock();
    try {
      lock2.waitLock(20000);
      sheet_().getRange(rowIndex, 10, 1, 3).setValues([[status, detail, capiStatus]]);
    } finally {
      try { lock2.releaseLock(); } catch (_) {}
    }
  }

  cache.put('ref:' + ref, orderNumber || status, 21600);
  // The order is safely in the sheet either way, so the client gets confirmation.
  return out({ ok: true, order: orderNumber, sent: status === 'ENVOYÉE', capi: capiStatus });
}

function sendCapiPurchase_(info) {
  try {
    var props = PropertiesService.getScriptProperties();
    var token = props.getProperty('META_CAPI_TOKEN');
    if (!token) return 'SKIP (no META_CAPI_TOKEN)';
    var testCode = (props.getProperty('META_TEST_EVENT_CODE') || '').trim();

    var parts = String(info.nom || '').trim().split(/\s+/);
    var fn = parts[0] || '';
    var ln = parts.length > 1 ? parts.slice(1).join(' ') : '';

    var ud = {
      ph: [sha256_(info.phoneE164)],
      country: [sha256_('ma')]
    };
    if (fn) ud.fn = [sha256_(fn.toLowerCase())];
    if (ln) ud.ln = [sha256_(ln.toLowerCase())];
    var ct = norm_(info.city).toLowerCase().replace(/\s+/g, '');
    if (ct) ud.ct = [sha256_(ct)];
    if (info.fbp) ud.fbp = info.fbp;
    if (info.fbc) ud.fbc = info.fbc;
    if (info.userAgent) ud.client_user_agent = info.userAgent;

    var payload = {
      data: [{
        event_name: 'Purchase',
        event_time: Math.floor(Date.now() / 1000),
        event_id: info.eventId,
        action_source: 'website',
        event_source_url: info.sourceUrl,
        user_data: ud,
        custom_data: {
          currency: 'MAD',
          value: info.total,
          content_ids: ['collagene-25'],
          content_name: 'Collagène marin · 25 gommes',
          content_type: 'product',
          num_items: info.q
        }
      }]
    };
    if (testCode) payload.test_event_code = testCode;

    var url = 'https://graph.facebook.com/' + META_GRAPH_VER + '/' + META_PIXEL_ID + '/events?access_token=' + encodeURIComponent(token);
    var res = UrlFetchApp.fetch(url, {
      method: 'post', contentType: 'application/json', muteHttpExceptions: true,
      payload: JSON.stringify(payload)
    });
    var code = res.getResponseCode();
    if (code >= 200 && code < 300) {
      return 'OK' + (testCode ? ' (test ' + testCode + ')' : '') + ' ' + Utilities.formatDate(new Date(), 'Africa/Casablanca', 'yyyy-MM-dd HH:mm');
    }
    return 'ERR ' + code + ': ' + String(res.getContentText() || '').slice(0, 200);
  } catch (err) {
    return 'ERR: ' + String(err || '').slice(0, 200);
  }
}

function sha256_(s) {
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(s || ''), Utilities.Charset.UTF_8);
  var hex = '';
  for (var i = 0; i < bytes.length; i++) {
    var b = (bytes[i] + 256) % 256;
    hex += (b < 16 ? '0' : '') + b.toString(16);
  }
  return hex;
}

function toAsciiDigits_(s) {
  return String(s || '')
    .replace(/[\u0660-\u0669]/g, function (d) { return String(d.charCodeAt(0) - 0x0660); })
    .replace(/[\u06F0-\u06F9]/g, function (d) { return String(d.charCodeAt(0) - 0x06F0); });
}

function normPhone_(raw) {
  var s = toAsciiDigits_(raw).replace(/[^\d+]/g, '');
  if (s.indexOf('00212') === 0) s = '+212' + s.slice(5);
  var d = s.replace(/\D/g, '');
  var e164 = '';
  if (/^212[5-7]\d{8}$/.test(d)) e164 = d;
  else if (/^0[5-7]\d{8}$/.test(d)) e164 = '212' + d.slice(1);
  else if (/^[5-7]\d{8}$/.test(d)) e164 = '212' + d;
  return {
    valid: /^212[5-7]\d{8}$/.test(e164),
    e164: e164,
    local: e164 ? '0' + e164.slice(3) : s.slice(0, 15)
  };
}

function cities_() {
  var cache = CacheService.getScriptCache(), hit = cache.get('cities');
  if (hit) return JSON.parse(hit);
  var res = UrlFetchApp.fetch(API + '/cities/options', { headers: { Authorization: 'Bearer ' + key_() }, muteHttpExceptions: true });
  if (res.getResponseCode() !== 200) return [];
  var list = JSON.parse(res.getContentText());
  if (list && list.data) list = list.data;
  cache.put('cities', JSON.stringify(list), 21600);
  return list;
}

function normAr_(s) {
  return String(s || '')
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/\s+/g, ' ')
    .trim();
}

function findCity_(name) {
  var raw = String(name || '').trim();
  var arKey = normAr_(raw);
  var mapped = AR_CITIES[arKey] || AR_CITIES[arKey.replace(/^ال/, '')] || raw;
  var n = norm_(mapped);
  if (!n) return null;
  var list = cities_();
  for (var i = 0; i < list.length; i++) if (norm_(list[i].name) === n) return list[i];
  // Soft fallback: strip spaces (e.g. M'DIQ -> MDIQ, TAN-TAN -> TANTAN)
  var nCompact = n.replace(/\s+/g, '');
  for (var j = 0; j < list.length; j++) if (norm_(list[j].name).replace(/\s+/g, '') === nCompact) return list[j];
  return null;
}

function norm_(s) {
  return String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/[^A-Z0-9]+/g, ' ').trim();
}
function clean_(s, max) { return String(s || '').replace(/\s+/g, ' ').trim().slice(0, max); }
function key_() { return PropertiesService.getScriptProperties().getProperty('MO_API_KEY'); }

function sheet_() {
  var ss = SpreadsheetApp.getActive(), sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEAD);
    sh.setFrozenRows(1);
    return sh;
  }
  // Ensure trailing CAPI_Status column header exists on already-created sheets without moving old columns
  if (sh.getLastColumn() < HEAD.length || sh.getRange(1, HEAD.length).getValue() !== HEAD[HEAD.length - 1]) {
    sh.getRange(1, HEAD.length).setValue(HEAD[HEAD.length - 1]);
  }
  return sh;
}

function out(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }

/** Run once from the editor to check MO_API_KEY: logs how many cities Marque Online returns. */
function testKey() { CacheService.getScriptCache().remove('cities'); Logger.log(cities_().length + ' villes'); }

/** Run once from the editor to check META_CAPI_TOKEN + META_TEST_EVENT_CODE. */
function testCapi() {
  var status = sendCapiPurchase_({
    eventId: 'alb-test-' + Date.now(),
    nom: 'Test AlBaraka',
    phoneE164: '212612345678',
    city: 'Casablanca',
    q: 1,
    total: 195,
    fbp: '',
    fbc: '',
    sourceUrl: DEFAULT_SOURCE_URL,
    userAgent: 'AppsScript-Test'
  });
  Logger.log(status);
}
