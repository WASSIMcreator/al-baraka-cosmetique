/**
 * AL BARAKA · Collagène marin 25 gommes
 * Receives orders from collagene/index.html, writes them FIRST to the
 * "Commandes Collagène" sheet (guaranteed backup), then creates them in
 * COD Marque Online (app.codmarqueonline.ma) and sends Meta Conversions API
 * events (Pixel 4547426528828820):
 *   - New order (doPost)               -> LEAD only (same event_id as the browser Lead).
 *   - "statut" set to Confirmé by hand -> PURCHASE, once per row (handleStatusEdit).
 *   - "statut" set to Livré by hand    -> PURCHASE only if none was sent yet (order never
 *                                         confirmed). Expédié / Livré after Confirmé send nothing.
 * A new order is never a Purchase: it is cash on delivery, nobody has paid yet.
 *
 * Setup (once):
 *  1. Open the Google Sheet > Extensions > Apps Script, paste this file.
 *  2. Project Settings (gear) > Script properties:
 *       - MO_API_KEY = <your Marque Online API key>
 *       - META_CAPI_TOKEN = <your Meta CAPI access token for Pixel 4547426528828820>
 *       - META_TEST_EVENT_CODE = <optional TEST12345 while testing; delete when live>
 *  3. Run setupTracking() once (adds the tracking columns and the statut list).
 *  4. Triggers (clock icon) > Add trigger > handleStatusEdit / Head / From spreadsheet / On edit.
 *  5. Deploy > Manage deployments > pencil icon > Version: New version > Deploy.
 */

var API = 'https://api.codmarqueonline.ma/api/merchant-api';
var PRODUCT_ID = '2d07949a-cfb2-4710-91c4-1f41ddd29e5c'; // كولاجين بحري Collagène Marin 25 gommes
var PRICES = { 1: 195, 2: 350 };                            // server-authoritative pricing
var SHEET_NAME = 'Commandes Collagène';
// CAPI_Status (column 12) = last Meta answer for the row. On rows made by the OLD script it starts
// with "OK": that old script already sent a Purchase at order time, so those rows never send another.
var HEAD = ['Date', 'Réf', 'Nom', 'Téléphone', 'Ville', 'Adresse', 'Boîtes', 'Total DH', 'Source', 'Marque Online', 'Détail', 'CAPI_Status'];
// Tracking columns, added after the last used column when missing (existing columns never move).
var TRACK_COLS = ['external_reference', 'statut', 'fbp', 'fbc', 'user_agent', 'event_source_url', 'lead_sent', 'purchase_sent', 'purchase_sent_at'];
// Statuts that send the row's ONE Purchase: Confirmé first; Livré only as a fallback, since
// purchase_sent is already TRUE once Confirmé got HTTP 200. Same event_id either way.
var PURCHASE_STATUTS = ['confirmé', 'confirme', 'livré', 'livre'];
var CAPI_EVENTS = ['Lead', 'Purchase'];
var STATUTS = ['Nouveau', 'Confirmé', 'Expédié', 'Livré', 'Retour', 'Annulé'];
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
  var nom = clean_(o.nom, 80);
  var phone = normPhone_(o.tel);
  var ville = clean_(o.ville, 60);
  var adresse = clean_(o.adresse, 200);
  var src = clean_(o.src, 120);
  var q = o.q == 2 ? 2 : 1;
  var total = PRICES[q];
  var ref = 'ALB-' + String(o.id || '').replace(/[^\w-]/g, '').slice(0, 30);
  // Browser Lead's event_id: the server Lead must use the SAME one so Meta counts one Lead.
  var eventId = clean_(o.event_id, 80).replace(/[^\w-]/g, '') || ('lead_' + ref);
  var fbp = clean_(o.fbp, 120), fbc = clean_(o.fbc, 300);
  var userAgent = clean_(o.user_agent || o.client_user_agent, 500); // client_user_agent = pages still cached
  var sourceUrl = clean_(o.event_source_url, 500) || DEFAULT_SOURCE_URL;

  // Honeypot triggered: log to Sheet as SPAM? (never silently lose a real autofilled order), skip Marque Online & CAPI
  if (o.hp) {
    try {
      var hpLock = LockService.getScriptLock();
      if (hpLock.tryLock(10000)) {
        try {
          sheet_().appendRow([new Date(), ref || 'ALB-hp', nom, "'" + phone.local, ville, adresse, q, total, src, 'SPAM?', 'Honeypot rempli (à vérifier)', 'SKIP (honeypot)']);
        } finally { hpLock.releaseLock(); }
      }
    } catch (_) {}
    return out({ ok: true });
  }

  if (nom.length < 2 || !phone.valid || !ville || adresse.length < 3 || ref.length < 8) {
    return out({ ok: false, error: 'missing fields' });
  }

  var cache = CacheService.getScriptCache();
  var done = cache.get('ref:' + ref); // same click sent twice
  if (done) return out({ ok: true, order: done, dedup: true });

  // Rate limits: per normalized phone (6h) + global hourly safety cap (log to Sheet as LIMITE so no order is lost)
  var phoneKey = 'tel:' + phone.e164;
  var hourKey = 'hr:' + Utilities.formatDate(new Date(), 'Africa/Casablanca', 'yyyyMMddHH');
  var nPhone = +(cache.get(phoneKey) || 0);
  var nHour = +(cache.get(hourKey) || 0);
  if (nPhone >= MAX_PER_PHONE || nHour >= MAX_PER_HOUR) {
    var limitErr = nPhone >= MAX_PER_PHONE ? 'too many' : 'too many orders this hour';
    try {
      var limLock = LockService.getScriptLock();
      if (limLock.tryLock(10000)) {
        try {
          sheet_().appendRow([new Date(), ref, nom, "'" + phone.local, ville, adresse, q, total, src, 'LIMITE', limitErr, 'SKIP (limite)']);
        } finally { limLock.releaseLock(); }
      }
    } catch (_) {}
    return out({ ok: false, error: limitErr });
  }
  cache.put(phoneKey, String(nPhone + 1), 21600);
  cache.put(hourKey, String(nHour + 1), 3600);

  // Resolve Marque Online city safely (never throw)
  var city = null;
  try { city = findCity_(ville); } catch (_) { city = null; }
  var displayCity = city ? city.name : ville;

  // 1) GUARANTEED BACKUP FIRST: write the row to Google Sheet BEFORE calling Marque Online
  var rowIndex = 0;
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) return out({ ok: false, error: 'busy' });
  try {
    var sh = sheet_();
    sh.appendRow([new Date(), ref, nom, "'" + phone.local, displayCity, adresse, q, total, src, 'EN COURS', '', '']);
    rowIndex = sh.getLastRow();
    // Tracking data kept on the row, for the Purchase sent later on delivery (same person, same click).
    // A failure here must never cost the order: the row above is already saved.
    try {
      var c = trackCols_(sh);
      sh.getRange(rowIndex, c.statut).setDataValidation(statutRule_()).setValue('Nouveau');
      setCells_(sh, rowIndex, c, {
        external_reference: ref, fbp: safe_(fbp), fbc: safe_(fbc), user_agent: safe_(userAgent),
        event_source_url: safe_(sourceUrl), lead_sent: false, purchase_sent: false
      });
    } catch (trackErr) { console.warn('tracking columns: ' + trackErr); }
  } finally {
    lock.releaseLock();
  }

  // 2) Send order to COD Marque Online (wrapped in try/catch so a timeout/network error never loses the row)
  var status = '', detail = '', orderNumber = '';
  try {
    var res = UrlFetchApp.fetch(API + '/orders', {
      method: 'post', contentType: 'application/json', muteHttpExceptions: true,
      headers: { Authorization: 'Bearer ' + key_() },
      payload: JSON.stringify({
        externalReference: ref, fullName: nom, phoneNumber: phone.local, city: displayCity || ville,
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

  // 3) Server-side LEAD to Meta (never Purchase here), same event_id as the browser Lead.
  var lead = sendCapi_('Lead', {
    eventId: eventId, externalId: ref, nom: nom, phoneE164: phone.e164, city: displayCity, q: q, total: total,
    fbp: fbp, fbc: fbc, userAgent: userAgent, sourceUrl: sourceUrl
  });

  // 4) Update the exact Sheet row with Marque Online + CAPI results
  if (rowIndex > 1) {
    var lock2 = LockService.getScriptLock();
    try {
      if (!lock2.tryLock(20000)) throw new Error('lock2 busy');
      var sh2 = sheet_();
      if (String(sh2.getRange(rowIndex, 2).getValue()) !== ref) rowIndex = findRow_(sh2, ref); // the sheet was sorted
      if (rowIndex > 1) {
        sh2.getRange(rowIndex, 10, 1, 3).setValues([[status, detail, 'Lead ' + lead.text]]);
        setCells_(sh2, rowIndex, trackCols_(sh2), { lead_sent: lead.ok }); // TRUE only on HTTP 200
      }
    } catch (rowErr) {
      console.warn('row update: ' + rowErr);
    } finally {
      try { lock2.releaseLock(); } catch (_) {}
    }
  }

  cache.put('ref:' + ref, orderNumber || status, 21600);
  // The order is safely in the sheet either way, so the client gets confirmation.
  return out({ ok: true, order: orderNumber, sent: status === 'ENVOYÉE', capi: lead.ok });
}

// =====================================================================================
// Meta Conversions API
// Test mode: put META_TEST_EVENT_CODE (e.g. TEST12345, from Events Manager > Test events) in the
// Script properties; every event then shows in "Test events". Delete the property to go live.
// =====================================================================================

// Sends one Lead or Purchase (same payload builder for both).
// Returns { ok: true only on HTTP 200, text: what to show in the sheet }.
// Never throws: a Meta problem must never cost an order.
function sendCapi_(eventName, info) {
  try {
    if (CAPI_EVENTS.indexOf(eventName) < 0) return { ok: false, text: 'ERR bad event ' + eventName };
    var props = PropertiesService.getScriptProperties();
    var token = props.getProperty('META_CAPI_TOKEN');
    if (!token) return { ok: false, text: 'SKIP (no META_CAPI_TOKEN)' };
    if (!/^212[5-7]\d{8}$/.test(String(info.phoneE164 || ''))) return { ok: false, text: 'ERR phone' };
    if (!(+info.total > 0)) return { ok: false, text: 'ERR value' };
    var testCode = (props.getProperty('META_TEST_EVENT_CODE') || '').trim();

    var ev = {
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: String(info.eventId),
      // Meta refuses a "website" event without the browser's user agent: old rows that have none go as system_generated.
      action_source: info.userAgent ? 'website' : 'system_generated',
      event_source_url: info.sourceUrl || DEFAULT_SOURCE_URL,
      user_data: userData_(info),
      custom_data: {
        currency: 'MAD',
        value: +info.total,
        content_ids: ['collagene-25'],
        content_name: 'Collagène marin · 25 gommes',
        content_type: 'product',
        num_items: +info.q || 1
      }
    };
    var payload = { data: [ev] };
    if (testCode) payload.test_event_code = testCode;

    var url = 'https://graph.facebook.com/' + META_GRAPH_VER + '/' + META_PIXEL_ID + '/events?access_token=' + encodeURIComponent(token);
    var res = UrlFetchApp.fetch(url, {
      method: 'post', contentType: 'application/json', muteHttpExceptions: true,
      payload: JSON.stringify(payload)
    });
    var code = res.getResponseCode();
    var when = Utilities.formatDate(new Date(), 'Africa/Casablanca', 'yyyy-MM-dd HH:mm');
    if (code === 200) return { ok: true, text: 'OK' + (testCode ? ' (test ' + testCode + ')' : '') + ' ' + when };
    return { ok: false, text: 'ERR ' + code + ' ' + when + ': ' + String(res.getContentText() || '').slice(0, 200) };
  } catch (err) {
    return { ok: false, text: 'ERR: ' + String(err || '').slice(0, 200) };
  }
}

// Hashed as Meta asks: lowercase, trimmed, SHA-256. Phone = 212XXXXXXXXX (no +, no spaces).
// external_id = the order reference (ALB-…), hashed, the same on the Lead and the Purchase.
// fbp, fbc and the user agent are sent unhashed.
function userData_(info) {
  var words = String(info.nom || '').trim().toLowerCase().split(/\s+/).filter(Boolean);
  var ud = { ph: [sha256_(info.phoneE164)], country: [sha256_('ma')] };
  var xid = String(info.externalId || '').trim().toLowerCase();
  if (xid) ud.external_id = [sha256_(xid)];
  if (words.length) ud.fn = [sha256_(words[0])];
  if (words.length > 1) ud.ln = [sha256_(words.slice(1).join(' '))];
  var ct = norm_(info.city).toLowerCase().replace(/\s+/g, '');
  if (ct) ud.ct = [sha256_(ct)];
  if (info.fbp) ud.fbp = String(info.fbp);
  if (info.fbc) ud.fbc = String(info.fbc);
  if (info.userAgent) ud.client_user_agent = String(info.userAgent);
  return ud;
}

// =====================================================================================
// Statut set by hand: Confirmé -> the row's one Purchase (Livré only if none was sent yet).
// =====================================================================================

// For an INSTALLABLE "On edit" trigger (a simple onEdit may not call Meta).
// Edits made by this script (doPost) never fire it, only edits made by a person.
function handleStatusEdit(e) {
  if (!e || !e.range) return;
  var sh = e.range.getSheet();
  if (sh.getName() !== SHEET_NAME) return;
  var c = trackCols_(sh), col = c.statut;
  // phone, address, notes, any other column: nothing happens
  if (e.range.getColumn() > col || e.range.getLastColumn() < col) return;
  var lock = LockService.getScriptLock(); // two quick edits of the same row must not both send
  if (!lock.tryLock(30000)) { console.warn('handleStatusEdit: busy, set the statut again'); return; }
  try {
    for (var r = Math.max(2, e.range.getRow()); r <= e.range.getLastRow(); r++) {
      try { statusRow_(sh, c, r); } catch (err) { console.warn('statut row ' + r + ': ' + err); }
    }
  } finally {
    lock.releaseLock();
  }
}

function statusRow_(sh, c, r) {
  var v = sh.getRange(r, 1, 1, sh.getLastColumn()).getValues()[0]; // read AFTER the lock: fresh values
  var get = function (name) { return c[name] ? v[c[name] - 1] : ''; };
  if (!isPurchaseStatut_(get('statut'))) return;                   // Nouveau, Expédié, Retour…: nothing
  if (isTrue_(get('purchase_sent'))) return;                       // sent on Confirmé (or Livré): never twice
  if (/^OK/.test(String(get('CAPI_Status')))) {                    // old script already sent a Purchase
    setCells_(sh, r, c, { purchase_sent_at: 'déjà envoyé à la commande (ancien script)' });
    return;
  }
  var ref = String(get('external_reference') || get('Réf') || '').trim();
  var phone = normPhone_(String(get('Téléphone')).replace(/^'/, ''));
  var total = +String(get('Total DH')).replace(',', '.').replace(/[^\d.]/g, '');
  if (!ref || !phone.valid || !(total > 0)) {
    sh.getRange(r, 12).setValue('Purchase ERR: Réf, Téléphone ou Total DH invalide. Corrigez puis remettez le statut');
    return;
  }
  var res = sendCapi_('Purchase', {
    eventId: 'purchase_' + ref, externalId: ref,
    nom: get('Nom'), phoneE164: phone.e164, city: get('Ville'), q: get('Boîtes'), total: total,
    fbp: String(get('fbp') || ''), fbc: String(get('fbc') || ''),
    userAgent: String(get('user_agent') || ''), sourceUrl: String(get('event_source_url') || '')
  });
  sh.getRange(r, 12).setValue('Purchase ' + res.text);
  if (res.ok) setCells_(sh, r, c, { purchase_sent: true, purchase_sent_at: new Date() }); // only on HTTP 200
}

// "Confirmé", " CONFIRME ", "Livré", "livre" -> true. Anything else -> false.
function isPurchaseStatut_(v) {
  return PURCHASE_STATUTS.indexOf(String(v == null ? '' : v).normalize('NFC').trim().toLowerCase()) >= 0;
}
function isTrue_(v) { return v === true || /^(true|vrai)$/i.test(String(v).trim()); }

// Column number of each header; missing TRACK_COLS are added after the last used column.
function trackCols_(sh) {
  var last = Math.max(sh.getLastColumn(), HEAD.length);
  var names = sh.getRange(1, 1, 1, last).getValues()[0].map(function (n) { return String(n).trim(); });
  var missing = TRACK_COLS.filter(function (n) { return names.indexOf(n) < 0; });
  if (missing.length) {
    sh.getRange(1, last + 1, 1, missing.length).setValues([missing]).setFontWeight('bold');
    names = names.concat(missing);
  }
  var c = {};
  names.forEach(function (n, i) { if (n && !c[n]) c[n] = i + 1; });
  return c;
}

function setCells_(sh, r, c, values) {
  Object.keys(values).forEach(function (k) { if (c[k]) sh.getRange(r, c[k]).setValue(values[k]); });
}

function statutRule_() { return SpreadsheetApp.newDataValidation().requireValueInList(STATUTS, true).setAllowInvalid(false).build(); }

// Text from the browser starting with = + - @ would be read by Sheets as a formula.
function safe_(v) { v = String(v == null ? '' : v); return /^[=+\-@]/.test(v) ? "'" + v : v; }

function findRow_(sh, ref) {
  var last = sh.getLastRow();
  if (last < 2) return 0;
  var refs = sh.getRange(2, 2, last - 1, 1).getValues();
  for (var i = refs.length - 1; i >= 0; i--) if (String(refs[i][0]) === ref) return i + 2;
  return 0;
}

/** Run ONCE from the editor: adds the tracking columns and the statut list on every order row. */
function setupTracking() {
  var sh = sheet_(), c = trackCols_(sh), last = sh.getLastRow();
  if (last >= 2) sh.getRange(2, c.statut, last - 1, 1).setDataValidation(statutRule_());
  Logger.log('Colonnes prêtes. Token Meta : ' + !!PropertiesService.getScriptProperties().getProperty('META_CAPI_TOKEN') +
    ' · Mode test : ' + (PropertiesService.getScriptProperties().getProperty('META_TEST_EVENT_CODE') || 'non'));
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

/** Run once from the editor to check META_CAPI_TOKEN + META_TEST_EVENT_CODE (sends a test Lead). */
function testCapi() {
  var status = sendCapi_('Lead', {
    eventId: 'lead_test_' + Date.now(),
    externalId: 'ALB-test',
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
  Logger.log(status.text);
}
