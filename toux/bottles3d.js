/* AL BARAKA · 3D bottle (sirop) and jar (capsules) for the toux page.
   Labels come from real photos: front half + back half, unprojected onto a cylinder.
   Falls back to the photo already in the card if WebGL or three.js is missing. */
(function(){
  const stages = [...document.querySelectorAll('[data-3d]')];
  if (!stages.length) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function loadThree(cb){
    if (window.THREE) return cb();
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    s.onload = cb; document.head.appendChild(s);
  }
  const img = src => new Promise((ok, ko) => { const i = new Image(); i.onload = () => ok(i); i.onerror = ko; i.src = src; });

  /* Front half: real photo of the label (x = sin θ), unprojected so u is linear in θ.
     Back half: the back label redrawn as sharp text (the back photos are too small to read in 3D). */
  const labelCache = {};
  async function labelTexture(front, drawBack, W, H){
    labelCache[front] = labelCache[front] || paintLabel(front, drawBack, W, H);   // hero + card share one painted label
    const t = new THREE.CanvasTexture(await labelCache[front]);
    t.encoding = THREE.sRGBEncoding; t.wrapS = THREE.RepeatWrapping; t.anisotropy = MAX_ANISO;
    return t;
  }
  async function paintLabel(front, drawBack, W, H){
    const f = await img(front);
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const ctx = cv.getContext('2d');
    const half = W/2;
    const m = f.width*.035, iw = f.width - 2*m;          // skip the photo edges (background shows there)
    for (let x = 0; x < half; x++){
      const th = (x/half - .5) * Math.PI;                  // -90°..90°
      const sx = m + (Math.sin(th)*.5 + .5) * iw;
      const sw = Math.max(1, Math.cos(th) * iw/half * Math.PI/2);
      ctx.drawImage(f, Math.min(m+iw-1, sx), 0, Math.max(1, Math.min(sw, m+iw - sx)), f.height, x, 0, 1.6, H);
    }
    ctx.save(); ctx.translate(half, 0); drawBack(ctx, half, H); ctx.restore();
    return cv;
  }
  let MAX_ANISO = 4;
  const FONT = 'Arial, Helvetica, sans-serif';
  function rrect(c, x, y, w, h, r){ c.beginPath(); c.moveTo(x+r, y); c.arcTo(x+w, y, x+w, y+h, r); c.arcTo(x+w, y+h, x, y+h, r); c.arcTo(x, y+h, x, y, r); c.arcTo(x, y, x+w, y, r); c.closePath(); }
  function fitText(c, s, x, y, max, size, weight, align){
    let f = size; c.font = `${weight} ${f}px ${FONT}`;
    while (c.measureText(s).width > max && f > 10){ f -= 1; c.font = `${weight} ${f}px ${FONT}`; }
    c.textAlign = align || 'left'; c.fillText(s, x, y);
  }

  /* back of the capsule jar: white label, brown bands, ingredients box, lab box */
  function backCaps(c, W, H){
    c.fillStyle = '#f7f7f5'; c.fillRect(0, 0, W, H);
    const band = (y, h) => { c.fillStyle = '#4a2e1e'; c.fillRect(0, y, W, h); c.fillStyle = '#1e120b'; c.fillRect(0, y === 0 ? h : y - 6, W, 6); };
    band(0, H*.05); band(H*.95, H*.05);
    const cw = W*.76, x0 = (W - cw)/2;
    c.fillStyle = '#111';
    let y = H*.12;
    c.lineWidth = 5; c.strokeStyle = '#111'; c.strokeRect(x0, y, cw, H*.47);
    const px = x0 + 26, pw = cw - 52;
    fitText(c, 'INGREDIENTS', px, y + 96, pw, 96, 800);
    fitText(c, 'Portions : 2 à 3 capsules par jour', px, y + 158, pw, 46, 700);
    fitText(c, 'Portions par boîte : 60 capsules', px, y + 214, pw, 46, 700);
    c.fillRect(px, y + 238, pw, 18);
    fitText(c, 'Ingrédients :', px, y + 318, pw, 44, 700);
    ['Extrait de Ginkgo Biloba', 'Vitamine C', 'Gélatine, glycérine, eau purifiée'].forEach((s, i) => fitText(c, s, px, y + 374 + i*56, pw, 44, 400));
    y = H*.63;
    const g = c.createLinearGradient(0, y, 0, y + H*.27); g.addColorStop(0, '#e2e2e2'); g.addColorStop(1, '#c4c4c4');
    rrect(c, x0, y, cw, H*.27, 14); c.fillStyle = g; c.fill(); c.lineWidth = 4; c.strokeStyle = '#555'; c.stroke();
    const cx = W/2;
    c.fillStyle = '#5a3a26'; fitText(c, 'marque', cx - 6, y + 62, cw, 44, 700, 'right');
    c.fillStyle = '#e8662a'; fitText(c, 'online', cx + 6, y + 62, cw, 44, 700, 'left');
    c.fillStyle = '#222';
    fitText(c, 'Fabriqué par un laboratoire certifié', cx, y + 112, cw - 40, 36, 400, 'center');
    fitText(c, 'Agrément ONSSA CAPV.26.1009.24', cx, y + 164, cw - 40, 44, 800, 'center');
    fitText(c, 'LABO BEAUTY PHARMACOS · Aït Melloul, Agadir', cx, y + 214, cw - 40, 34, 400, 'center');
    fitText(c, 'Pr : 02/2025      Ex : 02/2028', cx, y + 266, cw - 40, 38, 700, 'center');
  }

  /* back of the sirop: teal label, ingredient table, warning, lab box */
  function backSirop(c, W, H){
    const g = c.createLinearGradient(0, 0, W, 0); g.addColorStop(0, '#0c4f59'); g.addColorStop(.5, '#0f5d68'); g.addColorStop(1, '#0c4f59');
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    c.fillStyle = 'rgba(70,215,235,.55)';
    for (let r = 0; r < 6; r++) for (let k = 0; k < 4; k++){ c.beginPath(); c.arc(W*.1 + k*26, H*.56 + r*30, 5, 0, 7); c.fill(); c.beginPath(); c.arc(W*.9 - k*26, H*.12 + r*30, 5, 0, 7); c.fill(); }
    const cw = W*.76, x0 = (W - cw)/2;
    rrect(c, x0 - 22, H*.03, cw + 44, H*.94, 34); c.fillStyle = '#0a3138'; c.fill();
    const rows = [['Miel naturel','30%'],['Gingembre frais (extrait)','15%'],['Citron (jus naturel)','10%'],['Huile d’eucalyptus','5%'],['Fenouil (Babsas)','15%'],['Extrait d’anis','10%'],['Eau chaude ou eau distillée','10%'],['Alcool (optionnel, < 1%)','1%'],['Total','100%']];
    const top = H*.06, rh = 62, hh = 78, cqx = x0 + cw*.74;
    c.fillStyle = '#ffffff'; c.fillRect(x0, top, cw, hh);
    c.fillStyle = '#0b4f59'; fitText(c, 'Ingrédient', x0 + 18, top + 54, cw*.6, 46, 700); fitText(c, 'Quantité (%)', cqx + 14, top + 52, cw*.26 - 20, 32, 700);
    c.strokeStyle = '#ffffff'; c.lineWidth = 3;
    c.strokeRect(x0, top, cw, hh + rows.length*rh);
    c.beginPath(); c.moveTo(cqx, top); c.lineTo(cqx, top + hh + rows.length*rh); c.stroke();
    rows.forEach(([a, b], i) => {
      const y = top + hh + i*rh;
      c.beginPath(); c.moveTo(x0, y); c.lineTo(x0 + cw, y); c.stroke();
      c.fillStyle = '#ffffff';
      fitText(c, a, x0 + 18, y + 45, cw*.7 - 24, 42, i === rows.length - 1 ? 800 : 500);
      fitText(c, b, cqx + 18, y + 45, cw*.26 - 24, 42, 700);
    });
    let y = top + hh + rows.length*rh + 70;
    c.fillStyle = '#ffd34d'; fitText(c, '⚠ Avertissement important', W/2, y, cw, 36, 800, 'center');
    c.fillStyle = '#d6eef1';
    ['Ce produit n’est pas destiné à diagnostiquer, traiter,', 'guérir ou prévenir une quelconque maladie.', 'Ceci n’est pas un médicament.'].forEach((s, i) => fitText(c, s, W/2, y + 46 + i*38, cw, 28, 400, 'center'));
    y += 180;
    rrect(c, x0 + 20, y, cw - 40, H - y - H*.06, 18); c.fillStyle = '#44d3e6'; c.fill();
    c.fillStyle = '#063038';
    fitText(c, 'Fabriqué par un laboratoire certifié', W/2, y + 46, cw - 80, 32, 800, 'center');
    fitText(c, 'Agrément ONSSA CAPV.26.1009.24', W/2, y + 88, cw - 80, 30, 700, 'center');
    fitText(c, 'LABO BEAUTY PHARMACOS · Z.I. Aït Melloul, Agadir', W/2, y + 126, cw - 80, 26, 400, 'center');
    fitText(c, 'Pr : 09/2025      Ex : 09/2028', W/2, y + 166, cw - 80, 28, 700, 'center');
  }

  function ridgedCap(r, h, mat, ridges){
    const g = new THREE.CylinderGeometry(r, r, h, ridges*4, 1, false);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++){
      const x = p.getX(i), z = p.getZ(i), y = p.getY(i);
      if (Math.abs(Math.abs(y) - h/2) < 1e-4 && Math.hypot(x, z) < r*.5) continue; // cap centre
      const a = Math.atan2(z, x), k = 1 + (Math.cos(a*ridges) > 0 ? .018 : 0);
      if (Math.hypot(x, z) > r*.5){ p.setX(i, x*k); p.setZ(i, z*k); }
    }
    g.computeVertexNormals();
    return new THREE.Mesh(g, mat);
  }

  async function buildSirop(group){
    // dark glass body made with a lathe (profile from the photo, body radius = 1)
    const pts = [[0,0],[.93,0],[1,.08],[1,3.02],[.97,3.25],[.86,3.5],[.7,3.72],[.6,3.82],[.6,4.05]].map(([x,y]) => new THREE.Vector2(x, y));
    const glass = new THREE.MeshStandardMaterial({color:0x2e1c18, roughness:.32, metalness:.1});
    group.add(new THREE.Mesh(new THREE.LatheGeometry(pts, 96), glass));
    const tex = await labelTexture('tex-sirop-f.jpg', backSirop, 2048, 1280);
    const label = new THREE.Mesh(new THREE.CylinderGeometry(1.012, 1.012, 2.53, 128, 1, true),
      new THREE.MeshLambertMaterial({map:tex, emissive:0xffffff, emissiveMap:tex, emissiveIntensity:.3}));
    label.position.y = .24 + 2.53/2; group.add(label);
    // clear plastic cap with ridges
    const capMat = new THREE.MeshPhysicalMaterial({color:0xdfe7ea, roughness:.15, transmission:.6, transparent:true, opacity:.7, clearcoat:1});
    const cap = ridgedCap(.63, 1.0, capMat, 40); cap.position.y = 3.95 + .5; group.add(cap);
    group.position.y = -2.45;
  }

  async function buildCaps(group){
    const white = new THREE.MeshStandardMaterial({color:0xf4f4f2, roughness:.38, metalness:0});
    const pts = [[0,0],[.95,0],[1,.07],[1,2.86],[.97,2.96],[.88,3.02],[.8,3.06],[.8,3.12]].map(([x,y]) => new THREE.Vector2(x, y));
    group.add(new THREE.Mesh(new THREE.LatheGeometry(pts, 96), white));
    const tex = await labelTexture('tex-caps-f.jpg', backCaps, 2048, 1312);
    const label = new THREE.Mesh(new THREE.CylinderGeometry(1.01, 1.01, 2.6, 128, 1, true),
      new THREE.MeshLambertMaterial({map:tex, emissive:0xffffff, emissiveMap:tex, emissiveIntensity:.3}));
    label.position.y = .18 + 1.3; group.add(label);
    const cap = ridgedCap(.8, .68, white, 56); cap.position.y = 3.1 + .34; group.add(cap);
    group.position.y = -1.85;
  }

  function stage(el){
    let renderer;
    try { renderer = new THREE.WebGLRenderer({antialias:true, alpha:true}); } catch(e){ return; }
    if (!renderer.getContext()) return;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    MAX_ANISO = renderer.capabilities.getMaxAnisotropy();
    renderer.outputEncoding = THREE.sRGBEncoding;
    
    const cv = renderer.domElement; cv.setAttribute('aria-hidden', 'true');
    el.prepend(cv);

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(30, 1, .1, 100);
    const kind = el.dataset['3d'];
    cam.position.set(0, .1, kind === 'sirop' ? 11.4 : kind === 'duo' ? 16 : 9.2);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x7f9a9a, .55));
    const key = new THREE.DirectionalLight(0xffffff, .75); key.position.set(4, 5, 6); scene.add(key);
    const fill = new THREE.DirectionalLight(0xbfe9f0, .3); fill.position.set(-5, 1, 3); scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffffff, .5); rim.position.set(-2, 3, -6); scene.add(rim);

    // one turning group per product; 'duo' = jar on the left, bottle on the right, standing on the same floor
    const parts = kind === 'duo' ? [[buildCaps, -1.5], [buildSirop, 1.5]] : [[kind === 'sirop' ? buildSirop : buildCaps, 0]];
    const spins = parts.map(([build, x]) => {
      const group = new THREE.Group(), s = new THREE.Group();
      s.add(group); s.position.x = x; scene.add(s);
      return build(group).then(() => { if (kind === 'duo') group.position.y = -2.45; return s; });
    });
    let spin = {rotation:{}, position:{}};
    Promise.all(spins).then(list => {
      spin = { set rotY(v){ list.forEach((s, i) => s.rotation.y = v + i*.25); }, set floatY(v){ list.forEach((s, i) => s.position.y = i ? v : -v); }, set tiltZ(v){ list.forEach(s => s.rotation.z = v); } };
      el.classList.add('on'); dirty = true;
    }).catch(() => { cv.remove(); });

    // drag to turn (horizontal), page still scrolls vertically on phones
    // turns by itself until the visitor takes it; after that it only moves by hand (drag or the arrows)
    let rot = -Math.PI/2 + .3, vel = reduce ? 0 : .0045, drag = null, last = 0, dirty = true, visible = false, manual = false, target = null;
    const take = () => { manual = true; vel = 0; target = null; el.classList.add('touched'); };
    el.addEventListener('pointerdown', e => {
      if (e.target.closest('.turn')) return;
      take(); drag = {x:e.clientX, r:rot}; last = e.clientX;
      try { el.setPointerCapture(e.pointerId); } catch(_){}
    });
    el.addEventListener('pointermove', e => {
      if (!drag) return;
      const w = el.clientWidth;
      rot = drag.r + (e.clientX - drag.x)/w*Math.PI*1.8;
      vel = (e.clientX - last)/w*Math.PI*.9; last = e.clientX; dirty = true;
    });
    const up = () => { drag = null; };
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up); el.addEventListener('lostpointercapture', up);
    // arrow buttons: a quarter turn each press (also works with the keyboard)
    [['‹', 1, 'دوّر لليسار'], ['›', -1, 'دوّر لليمين']].forEach(([s, dir, label]) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'turn ' + (dir > 0 ? 'turn-l' : 'turn-r'); b.textContent = s; b.setAttribute('aria-label', label);
      b.addEventListener('click', () => { take(); target = (target ?? rot) + dir*Math.PI/2; });
      el.appendChild(b);
    });

    function resize(){ const w = el.clientWidth, h = el.clientHeight; if (!w || !h) return; renderer.setSize(w, h, false); cam.aspect = w/h; cam.updateProjectionMatrix(); dirty = true; }
    new ResizeObserver(resize).observe(el); resize();
    new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(el);

    const clock = new THREE.Clock();
    (function frame(){
      requestAnimationFrame(frame);
      if (!visible) return;
      const t = clock.getElapsedTime();
      if (!drag){
        if (target !== null){ rot += (target - rot)*.12; if (Math.abs(target - rot) < .002){ rot = target; target = null; } }
        else { rot += vel; if (manual) vel *= .92; else if (Math.abs(vel) > .0046) vel *= .96; }
      }
      spin.rotY = rot;
      spin.floatY = reduce ? 0 : Math.sin(t*1.2)*.08;
      spin.tiltZ = reduce ? 0 : Math.sin(t*.8)*.025;
      if (!reduce || drag || dirty){ renderer.render(scene, cam); dirty = false; }
    })();
  }

  // load three.js only when the cards get close to the screen
  const io = new IntersectionObserver(es => {
    if (!es.some(e => e.isIntersecting)) return;
    io.disconnect();
    loadThree(() => { if (window.THREE) stages.forEach(stage); });
  }, {rootMargin:'400px'});
  stages.forEach(s => io.observe(s));
})();
