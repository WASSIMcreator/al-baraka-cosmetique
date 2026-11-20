/**
 * AL BARAKA · Collagène marin 25 gommes
 * Receives orders from collagene/index.html and creates them in COD Marque Online
 * (app.codmarqueonline.ma) through its merchant API. Every order is also written to the
 * "Commandes Collagène" sheet, so nothing is lost if the API refuses it.
 *
 * Setup (once):
 *  1. Open a new Google Sheet > Extensions > Apps Script, paste this file.
 *  2. Project Settings (gear) > Script properties > add  MO_API_KEY = <your Marque Online API key>.
 *     The key never goes in the page: anyone could read it there.
 *  3. Deploy > New deployment > Web app > Execute as: Me, Who has access: Anyone > Deploy.
 *  4. Put the /exec link in CONFIG.script in collagene/index.html.
 */

var API = 'https://api.codmarqueonline.ma/api/merchant-api';
var PRODUCT_ID = '2d07949a-cfb2-4710-91c4-1f41ddd29e5c'; // كولاجين بحري Collagène Marin 25 gommes
var PRICES = { 1: 195, 2: 350 };                            // the price is set here, never trusted from the page
var SHEET_NAME = 'Commandes Collagène';
var HEAD = ['Date', 'Réf', 'Nom', 'Téléphone', 'Ville', 'Adresse', 'Boîtes', 'Total DH', 'Source', 'Marque Online', 'Détail'];
var MAX_PER_PHONE = 3;   // orders per phone in 6 hours (anti-spam)

function doGet(e) {
  if (e && e.parameter && e.parameter.action === 'cities') {
    return out({ ok: true, cities: cities_().map(function (c) { return c.name; }) });
  }
  return out({ ok: true });
}

function doPost(e) {
  var o;
  try { o = JSON.parse((e && e.postData && e.postData.contents) || '{}'); } catch (_) { return out({ ok: false, error: 'bad json' }); }
  if (o.hp) return out({ ok: true });                       // hidden field: only robots fill it
  var nom = clean_(o.nom, 80), tel = String(o.tel || '').replace(/[^\d+]/g, '').slice(0, 15);
  var ville = clean_(o.ville, 60), adresse = clean_(o.adresse, 200), src = clean_(o.src, 120);
  var q = o.q == 2 ? 2 : 1, total = PRICES[q];
  var ref = 'ALB-' + String(o.id || '').replace(/[^\w-]/g, '').slice(0, 30);
  if (nom.length < 2 || tel.replace(/\D/g, '').length < 9 || !ville || adresse.length < 3 || ref.length < 8) {
    return out({ ok: false, error: 'missing fields' });
  }

  var cache = CacheService.getScriptCache();
  var done = cache.get('ref:' + ref);                        // the same click sent twice
  if (done) return out({ ok: true, order: done });
  var key = 'tel:' + tel, n = +(cache.get(key) || 0);
  if (n >= MAX_PER_PHONE) return out({ ok: false, error: 'too many' });
  cache.put(key, String(n + 1), 21600);

  var city = findCity_(ville);
  var status = '', detail = '', orderNumber = '';
  if (!city) {
    status = 'NON ENVOYÉE'; detail = 'Ville introuvable dans Marque Online: ajoutez la commande à la main';
  } else {
    var res = UrlFetchApp.fetch(API + '/orders', {
      method: 'post', contentType: 'application/json', muteHttpExceptions: true,
      headers: { Authorization: 'Bearer ' + key_() },
      payload: JSON.stringify({
        externalReference: ref, fullName: nom, phoneNumber: tel, cityId: city.cityId,
        address: adresse, customerAmount: total, requiresConfirmation: true,
        note: (q === 2 ? 'Offre 2 boîtes = 350 DH' : '1 boîte = 195 DH') + (src ? ' · ' + src : ''),
        items: [{ productId: PRODUCT_ID, quantity: q }]
      })
    });
    var code = res.getResponseCode(), body = res.getContentText();
    if (code >= 200 && code < 300) {
      try { orderNumber = JSON.parse(body).orderNumber || 'OK'; } catch (_) { orderNumber = 'OK'; }
      status = orderNumber;
    } else {
      status = 'ERREUR ' + code; detail = body.slice(0, 400);
    }
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    sheet_().appendRow([new Date(), ref, nom, "'" + tel, city ? city.name : ville, adresse, q, total, src, status, detail]);
  } finally { lock.releaseLock(); }

  cache.put('ref:' + ref, status, 21600);
  // the order is in the sheet either way, so the client always gets a thank-you;
  // you see "NON ENVOYÉE" / "ERREUR" rows in the sheet and add them by hand.
  return out({ ok: true, order: orderNumber, sent: !!orderNumber });
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

function findCity_(name) {
  var n = norm_(name), list = cities_();
  for (var i = 0; i < list.length; i++) if (norm_(list[i].name) === n) return list[i];
  return null;
}

function norm_(s) {
  return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^A-Z0-9]+/g, ' ').trim();
}
function clean_(s, max) { return String(s || '').replace(/\s+/g, ' ').trim().slice(0, max); }
function key_() { return PropertiesService.getScriptProperties().getProperty('MO_API_KEY'); }
function sheet_() {
  var ss = SpreadsheetApp.getActive(), sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) { sh = ss.insertSheet(SHEET_NAME); sh.appendRow(HEAD); sh.setFrozenRows(1); }
  return sh;
}
function out(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }

/** Run once from the editor to check the key: it logs how many cities Marque Online returns. */
function testKey() { CacheService.getScriptCache().remove('cities'); Logger.log(cities_().length + ' villes'); }
