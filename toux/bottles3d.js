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

  /* photo of a cylinder (x = sin θ) -> flat label (u linear in θ). Front fills θ∈[-90°,90°], back the rest. */
  async function labelTexture(front, back, W, H){
    const [f, b] = await Promise.all([img(front), img(back)]);
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const ctx = cv.getContext('2d');
    const half = W/2;
    [[f, half/2], [b, half/2 + half]].forEach(([im, center]) => {
      for (let x = 0; x < half; x++){
        const th = (x/half - .5) * Math.PI;                 // -90°..90°
        const m = im.width*.035, iw = im.width - 2*m;      // skip the photo edges (background shows there)
        const sx = m + (Math.sin(th)*.5 + .5) * iw;
        const sw = Math.max(1, Math.cos(th) * iw/half * Math.PI/2);
        let dx = center - half/2 + x; dx = (dx % W + W) % W;
        ctx.drawImage(im, Math.min(m+iw-1, sx), 0, Math.max(1, Math.min(sw, m+iw - sx)), im.height, dx, 0, 1.6, H);
      }
    });
    const t = new THREE.CanvasTexture(cv);
    t.encoding = THREE.sRGBEncoding; t.wrapS = THREE.RepeatWrapping;
    return t;
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
    const tex = await labelTexture('tex-sirop-f.jpg', 'tex-sirop-b.jpg', 2048, 1280);
    const label = new THREE.Mesh(new THREE.CylinderGeometry(1.012, 1.012, 2.53, 128, 1, true),
      new THREE.MeshLambertMaterial({map:tex}));
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
    const tex = await labelTexture('tex-caps-f.jpg', 'tex-caps-b.jpg', 2048, 1312);
    const label = new THREE.Mesh(new THREE.CylinderGeometry(1.01, 1.01, 2.6, 128, 1, true),
      new THREE.MeshLambertMaterial({map:tex}));
    label.position.y = .18 + 1.3; group.add(label);
    const cap = ridgedCap(.8, .68, white, 56); cap.position.y = 3.1 + .34; group.add(cap);
    group.position.y = -1.85;
  }

  function stage(el){
    let renderer;
    try { renderer = new THREE.WebGLRenderer({antialias:true, alpha:true}); } catch(e){ return; }
    if (!renderer.getContext()) return;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    
    const cv = renderer.domElement; cv.setAttribute('aria-hidden', 'true');
    el.prepend(cv);

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(30, 1, .1, 100); cam.position.set(0, .4, 11.5);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x7f9a9a, .55));
    const key = new THREE.DirectionalLight(0xffffff, .75); key.position.set(4, 5, 6); scene.add(key);
    const fill = new THREE.DirectionalLight(0xbfe9f0, .3); fill.position.set(-5, 1, 3); scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffffff, .5); rim.position.set(-2, 3, -6); scene.add(rim);

    const group = new THREE.Group(), spin = new THREE.Group();
    spin.add(group); scene.add(spin);
    (el.dataset['3d'] === 'sirop' ? buildSirop(group) : buildCaps(group))
      .then(() => { el.classList.add('on'); dirty = true; })
      .catch(() => { cv.remove(); });

    // drag to turn (horizontal), page still scrolls vertically on phones
    let rot = -Math.PI/2 + .3, vel = reduce ? 0 : .0045, drag = null, last = 0, dirty = true, visible = false;
    cv.addEventListener('pointerdown', e => { drag = {x:e.clientX, r:rot}; last = e.clientX; vel = 0; el.classList.add('touched'); cv.setPointerCapture(e.pointerId); });
    cv.addEventListener('pointermove', e => { if (!drag) return; const w = cv.clientWidth; rot = drag.r + (e.clientX - drag.x)/w*Math.PI*1.6; vel = (e.clientX - last)/w*Math.PI*.5; last = e.clientX; dirty = true; });
    const up = () => { if (!drag) return; drag = null; if (!reduce && Math.abs(vel) < .003) vel = .0045 * Math.sign(vel || 1); };
    cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);

    function resize(){ const w = el.clientWidth, h = el.clientHeight; if (!w || !h) return; renderer.setSize(w, h, false); cam.aspect = w/h; cam.updateProjectionMatrix(); dirty = true; }
    new ResizeObserver(resize).observe(el); resize();
    new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(el);

    const clock = new THREE.Clock();
    (function frame(){
      requestAnimationFrame(frame);
      if (!visible) return;
      const t = clock.getElapsedTime();
      if (!drag){ rot += vel; if (Math.abs(vel) > .0046) vel *= .96; }
      spin.rotation.y = rot;
      spin.position.y = reduce ? 0 : Math.sin(t*1.2)*.08;
      spin.rotation.z = reduce ? 0 : Math.sin(t*.8)*.025;
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
