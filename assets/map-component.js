// ============================================================
// map-component.js — D3-powered SVG map for Pacha Tours
// Accurate Natural Earth TopoJSON + cinematic route animation
// ============================================================

const TOPO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const ISO_NUMERIC = {
  ZA:'710', ZW:'716', MZ:'508', ZM:'894', SZ:'748',
  LS:'426', BW:'072', NA:'516', TZ:'834', MG:'450',
};

const COUNTRY_COLORS = {
  ZA:'#c8d9a8', ZW:'#b8cc98', MZ:'#ccddb8',
  ZM:'#d4c8a0', SZ:'#ccc0d8', LS:'#b8ccd8',
  BW:'#dcd4b8', NA:'#d8d0b8',
};
const COUNTRY_HIGHLIGHT = {
  ZA:'#7a9e55', ZW:'#5a8e44', MZ:'#68924a',
  ZM:'#887840', SZ:'#7864a0', LS:'#486c8e',
};

const PIN_VISITED   = '#5a7a3e';
const PIN_ACTIVE    = '#f59e0b';
const PIN_ACTIVE_GLOW = 'rgba(245,158,11,0.35)';
const PIN_GLOW      = 'rgba(90,122,62,0.3)';
const ROUTE_SOLID   = '#5a7a3e';
const ROUTE_GLOW    = 'rgba(143,168,107,0.55)';

class PachaMap {
  constructor(containerId, options={}) {
    this.containerId      = containerId;
    this.options = {
      width:              options.width  || 700,
      height:             options.height || 450,
      highlightCountries: options.highlightCountries || [],
      routePins:          options.routePins || [],
      showLabels:         options.showLabels !== false,
      onReady:            options.onReady || null,
    };
    this.projection       = null;
    this.pathGenerator    = null;
    this._routePinCoords  = [];
    this.currentRouteStep = 0;
    this.isPlaying        = false;
    this.playInterval     = null;
    this._svgNode         = null;
  }

  async render() {
    const el = document.getElementById(this.containerId);
    if (!el) return;
    await this._loadDeps();
    if (!window._pachaTopoCache) {
      try {
        const r = await fetch(TOPO_URL);
        window._pachaTopoCache = await r.json();
      } catch(e) {
        el.innerHTML = this._fallback();
        return;
      }
    }
    this._build(el);
    if (this.options.onReady) this.options.onReady(this);
  }

  showStep(s) {
    const n = this._routePinCoords.length;
    if (!n) return;
    s = Math.max(0, Math.min(s, n-1));
    this.currentRouteStep = s;
    this._applyStep(s);
    return this._routePinCoords[s];
  }

  nextStep(cb) { const s = Math.min(this.currentRouteStep+1, this._routePinCoords.length-1); this.showStep(s); if(cb)cb(s,this._routePinCoords[s]); return s; }
  prevStep(cb) { const s = Math.max(this.currentRouteStep-1, 0);                              this.showStep(s); if(cb)cb(s,this._routePinCoords[s]); return s; }

  playRoute(ms=900, onStep) {
    if (this.isPlaying) { this.stopRoute(); return; }
    this.isPlaying = true;
    this.showStep(0);
    if (onStep) onStep(0, this._routePinCoords[0]);
    let s = 0;
    this.playInterval = setInterval(() => {
      s++;
      if (s >= this._routePinCoords.length) { this.stopRoute(); return; }
      this.showStep(s);
      if (onStep) onStep(s, this._routePinCoords[s]);
    }, ms);
  }

  stopRoute() { this.isPlaying=false; clearInterval(this.playInterval); this.playInterval=null; }

  // ----------------------------------------------------------------
  _build(container) {
    const { width, height, highlightCountries, routePins, showLabels } = this.options;
    container.innerHTML = '';

    const countries = topojson.feature(window._pachaTopoCache, window._pachaTopoCache.objects.countries);
    const hlFeats   = countries.features.filter(f => highlightCountries.some(cc => ISO_NUMERIC[cc]===String(f.id)));
    const fitColl   = { type:'FeatureCollection', features: hlFeats.length ? hlFeats :
      [{ type:'Feature', geometry:{ type:'Polygon', coordinates:[[[10,-36],[42,-36],[42,-8],[10,-8],[10,-36]]] }}] };

    const proj = d3.geoMercator().fitExtent([[32,32],[width-32,height-32]], fitColl);
    this.projection    = proj;
    this.pathGenerator = d3.geoPath().projection(proj);
    const pg           = this.pathGenerator;
    const cid          = this.containerId;

    // ---- SVG root ----
    const svg = d3.create('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width','100%').attr('height','100%').style('display','block');
    this._svgNode = svg.node();

    // ---- Defs ----
    const defs = svg.append('defs');

    // Ocean radial gradient
    const og = defs.append('radialGradient').attr('id',`og-${cid}`).attr('cx','35%').attr('cy','35%').attr('r','75%');
    og.append('stop').attr('offset','0%').attr('stop-color','#cfe6f5');
    og.append('stop').attr('offset','100%').attr('stop-color','#90bcd8');

    // Glow drop-shadow for active pin & route
    const gf = defs.append('filter').attr('id',`gf-${cid}`).attr('x','-80%').attr('y','-80%').attr('width','260%').attr('height','260%');
    gf.append('feGaussianBlur').attr('in','SourceGraphic').attr('stdDeviation','5').attr('result','b');
    const fm = gf.append('feMerge');
    fm.append('feMergeNode').attr('in','b');
    fm.append('feMergeNode').attr('in','SourceGraphic');

    // Softer shadow for pins
    const sf = defs.append('filter').attr('id',`sf-${cid}`).attr('x','-50%').attr('y','-50%').attr('width','200%').attr('height','200%');
    sf.append('feDropShadow').attr('dx',0).attr('dy',2).attr('stdDeviation',3).attr('flood-color','rgba(0,0,0,0.3)');

    // ---- Ocean ----
    svg.append('rect').attr('width',width).attr('height',height).attr('fill',`url(#og-${cid})`);

    // ---- Grid ----
    const gridG = svg.append('g').attr('opacity',0.1);
    for (let lon=10;lon<=44;lon+=5) {
      const l={type:'LineString',coordinates:[[lon,-8],[lon,-37]]};
      gridG.append('path').datum(l).attr('d',pg).attr('fill','none').attr('stroke','#2a4a6a').attr('stroke-width',0.5);
    }
    for (let lat=-35;lat<=-8;lat+=5) {
      const l={type:'LineString',coordinates:[[10,lat],[44,lat]]};
      gridG.append('path').datum(l).attr('d',pg).attr('fill','none').attr('stroke','#2a4a6a').attr('stroke-width',0.5);
    }

    // ---- Countries ----
    const saIds = Object.values(ISO_NUMERIC);
    svg.append('g').selectAll('path')
      .data(countries.features.filter(f => saIds.includes(String(f.id))))
      .join('path')
      .attr('d', pg)
      .attr('fill', f => {
        const cc = Object.keys(ISO_NUMERIC).find(k=>ISO_NUMERIC[k]===String(f.id));
        const hl = cc && highlightCountries.includes(cc);
        return hl ? (COUNTRY_HIGHLIGHT[cc]||'#7a9a6a') : (cc ? COUNTRY_COLORS[cc] : '#e4dcc8');
      })
      .attr('stroke', f => {
        const cc = Object.keys(ISO_NUMERIC).find(k=>ISO_NUMERIC[k]===String(f.id));
        return (cc && highlightCountries.includes(cc)) ? '#6a8a50' : '#a8b898';
      })
      .attr('stroke-width', f => {
        const cc = Object.keys(ISO_NUMERIC).find(k=>ISO_NUMERIC[k]===String(f.id));
        return (cc && highlightCountries.includes(cc)) ? 0.9 : 0.4;
      });

    // ---- Country labels ----
    if (showLabels) {
      const lbls=[
        {cc:'ZA',text:'South Africa',lat:-29.0,lon:25.0},
        {cc:'ZW',text:'Zimbabwe',    lat:-19.5,lon:29.5},
        {cc:'MZ',text:'Mozambique',  lat:-18.5,lon:35.5},
        {cc:'ZM',text:'Zambia',      lat:-14.0,lon:27.5},
        {cc:'SZ',text:'Eswatini',    lat:-26.5,lon:31.5},
        {cc:'LS',text:'Lesotho',     lat:-29.6,lon:28.2},
        {cc:'BW',text:'Botswana',    lat:-22.0,lon:24.5},
        {cc:'NA',text:'Namibia',     lat:-22.0,lon:18.0},
      ];
      const lg = svg.append('g');
      lbls.forEach(({cc,text,lat,lon})=>{
        if (highlightCountries.length>0 && !highlightCountries.includes(cc)) return;
        const [x,y] = proj([lon,lat]);
        if (x<0||x>width||y<0||y>height) return;
        const hl = highlightCountries.includes(cc);
        const fs = hl ? 11.5 : 8;
        const fw = hl ? '700' : '400';
        // white halo
        lg.append('text').attr('x',x).attr('y',y).attr('text-anchor','middle')
          .attr('font-size',fs).attr('font-weight',fw).attr('fill','white').attr('opacity',0.65)
          .attr('font-family','Poppins,sans-serif').attr('pointer-events','none')
          .attr('dx',0.5).attr('dy',0.5).text(text);
        lg.append('text').attr('x',x).attr('y',y).attr('text-anchor','middle')
          .attr('font-size',fs).attr('font-weight',fw)
          .attr('fill', hl?'#1a2a08':'#445533')
          .attr('font-family','Poppins,sans-serif').attr('pointer-events','none').text(text);
      });
    }

    // ---- Route pins data ----
    this._routePinCoords = routePins.map(id => {
      const pin = TOUR_DATA.pins[id];
      if (!pin) return null;
      return { id, ...pin, proj: proj([pin.lon, pin.lat]) };
    }).filter(Boolean);

    if (this._routePinCoords.length >= 2) {
      const rg = svg.append('g').attr('class','route-group');
      this._routeGroup = rg;
      const n = this._routePinCoords.length;

      // Ghost trail
      for (let i=0;i<n-1;i++) {
        const a=this._routePinCoords[i], b=this._routePinCoords[i+1];
        rg.append('path').attr('d',this._arc(a.proj,b.proj))
          .attr('fill','none').attr('stroke','rgba(90,122,62,0.15)')
          .attr('stroke-width',1.5).attr('stroke-dasharray','4,5');
      }

      // Animated glow + solid segments
      for (let i=0;i<n-1;i++) {
        const a=this._routePinCoords[i], b=this._routePinCoords[i+1];
        const d=this._arc(a.proj,b.proj);
        // glow
        rg.append('path').attr('id',`sg-${cid}-${i}`).attr('d',d)
          .attr('fill','none').attr('stroke',ROUTE_GLOW)
          .attr('stroke-width',8).attr('stroke-linecap','round')
          .attr('opacity',0).attr('filter',`url(#gf-${cid})`);
        // line
        rg.append('path').attr('id',`sl-${cid}-${i}`).attr('d',d)
          .attr('fill','none').attr('stroke',ROUTE_SOLID)
          .attr('stroke-width',2.8).attr('stroke-linecap','round')
          .attr('opacity',0);
      }
    }

    // ---- Pins ----
    const pg2 = svg.append('g').attr('class','pins-layer');
    this._pinsGroup = pg2;

    this._routePinCoords.forEach((pd,i) => {
      const g = pg2.append('g')
        .attr('id',`pin-${cid}-${i}`)
        .attr('transform',`translate(${pd.proj[0]},${pd.proj[1]})`)
        .attr('opacity',0);

      // outer pulse ring
      g.append('circle').attr('class','pr').attr('r',18)
        .attr('fill',PIN_GLOW).attr('stroke','none');
      // inner ring
      g.append('circle').attr('class','ir').attr('r',11)
        .attr('fill','rgba(90,122,62,0.12)')
        .attr('stroke','rgba(90,122,62,0.35)').attr('stroke-width',1);
      // core
      g.append('circle').attr('class','pc').attr('r',7)
        .attr('fill',PIN_VISITED).attr('stroke','white').attr('stroke-width',2)
        .attr('filter',`url(#sf-${cid})`);
      // number
      g.append('text').attr('class','pn')
        .attr('text-anchor','middle').attr('dominant-baseline','central')
        .attr('font-size',7).attr('font-weight','800').attr('fill','white')
        .attr('pointer-events','none').text(i+1);
      // label
      const off = (i%2===0) ? -21 : 21;
      g.append('text').attr('class','pl').attr('y',off)
        .attr('text-anchor','middle').attr('font-size',9.5).attr('font-weight','700')
        .attr('fill','#1a2a08').attr('stroke','white').attr('stroke-width',3)
        .attr('paint-order','stroke').attr('pointer-events','none').text(pd.label);
    });

    // ---- Moving plane ----
    const planeG = svg.append('g').attr('id',`plane-${cid}`).attr('opacity',0);
    planeG.append('circle').attr('r',11)
      .attr('fill','white').attr('stroke',PIN_ACTIVE).attr('stroke-width',2.5)
      .attr('filter',`url(#sf-${cid})`);
    planeG.append('text').attr('text-anchor','middle').attr('dominant-baseline','central')
      .attr('font-size',11).attr('pointer-events','none').text('✈');

    // ---- Compass ----
    this._compass(svg, width-46, 46);

    container.appendChild(this._svgNode);

    // Inject pulse keyframes
    this._injectKeyframes(cid);

    // Show step 0
    this._applyStep(0);
  }

  _applyStep(step) {
    const n   = this._routePinCoords.length;
    const cid = this.containerId;

    // Segments
    for (let i=0;i<n-1;i++) {
      const sg = document.getElementById(`sg-${cid}-${i}`);
      const sl = document.getElementById(`sl-${cid}-${i}`);
      const on = i < step;
      if (sg) sg.setAttribute('opacity', on?'1':'0');
      if (sl) sl.setAttribute('opacity', on?'1':'0');
    }

    // Pins
    for (let i=0;i<n;i++) {
      const g = document.getElementById(`pin-${cid}-${i}`);
      if (!g) continue;
      const vis    = i<=step;
      const active = i===step;
      g.setAttribute('opacity', vis?'1':'0');

      const pc = g.querySelector('.pc');
      const pr = g.querySelector('.pr');
      const ir = g.querySelector('.ir');

      if (pc) {
        pc.setAttribute('fill', active?PIN_ACTIVE:PIN_VISITED);
        pc.setAttribute('r',    active?'9':'7');
      }
      if (pr) {
        pr.setAttribute('fill', active?PIN_ACTIVE_GLOW:PIN_GLOW);
        pr.setAttribute('r',    active?'24':'18');
        pr.style.animation = active ? `pulseRing${cid.replace(/[^a-z0-9]/gi,'')} 1.5s ease-in-out infinite` : 'none';
      }
      if (ir) {
        ir.setAttribute('r',      active?'15':'11');
        ir.setAttribute('fill',   active?'rgba(245,158,11,0.12)':'rgba(90,122,62,0.12)');
        ir.setAttribute('stroke', active?'rgba(245,158,11,0.5)':'rgba(90,122,62,0.35)');
      }
    }

    // Plane
    this._movePlane(step);
  }

  _movePlane(step) {
    const cid   = this.containerId;
    const plane = document.getElementById(`plane-${cid}`);
    if (!plane || !this._routePinCoords.length) return;
    const cur = this._routePinCoords[step];
    if (!cur) return;

    if (step === 0) {
      plane.setAttribute('opacity','1');
      plane.setAttribute('transform',`translate(${cur.proj[0]},${cur.proj[1]})`);
      return;
    }

    const prev = this._routePinCoords[step-1];
    const DURATION = 650;
    const start = performance.now();

    const tick = (now) => {
      const raw = Math.min((now-start)/DURATION, 1);
      const t = raw<0.5 ? 2*raw*raw : -1+(4-2*raw)*raw; // ease-in-out
      const [x,y] = this._arcPoint(prev.proj, cur.proj, t);
      const dx = cur.proj[0]-prev.proj[0];
      const dy = cur.proj[1]-prev.proj[1];
      const angle = Math.atan2(dy,dx)*180/Math.PI;
      plane.setAttribute('opacity','1');
      plane.setAttribute('transform',`translate(${x},${y}) rotate(${angle})`);
      if (raw<1) requestAnimationFrame(tick);
      else plane.setAttribute('transform',`translate(${cur.proj[0]},${cur.proj[1]})`);
    };
    requestAnimationFrame(tick);
  }

  _arcPoint(from, to, t) {
    const dist = Math.sqrt((to[0]-from[0])**2+(to[1]-from[1])**2);
    const cx   = (from[0]+to[0])/2;
    const cy   = (from[1]+to[1])/2 - dist*0.22;
    return [
      (1-t)*(1-t)*from[0]+2*(1-t)*t*cx+t*t*to[0],
      (1-t)*(1-t)*from[1]+2*(1-t)*t*cy+t*t*to[1],
    ];
  }

  _arc(from, to) {
    const dist = Math.sqrt((to[0]-from[0])**2+(to[1]-from[1])**2);
    const cx   = (from[0]+to[0])/2;
    const cy   = (from[1]+to[1])/2 - dist*0.22;
    return `M ${from[0]} ${from[1]} Q ${cx} ${cy} ${to[0]} ${to[1]}`;
  }

  _compass(svg, x, y) {
    const g = svg.append('g').attr('transform',`translate(${x},${y})`);
    g.append('circle').attr('r',18).attr('fill','white').attr('opacity',0.9).attr('stroke','#c8c0b0').attr('stroke-width',0.6);
    g.append('polygon').attr('points','0,-15 3.5,-5 -3.5,-5').attr('fill','#5a7a3e');
    g.append('polygon').attr('points','0,15 3.5,5 -3.5,5').attr('fill','#ccc');
    g.append('text').attr('text-anchor','middle').attr('y',-6).attr('font-size',7.5).attr('font-weight','700').attr('fill','#1a2a08').text('N');
    g.append('text').attr('text-anchor','middle').attr('y',20).attr('font-size',6).attr('fill','#aaa').text('S');
  }

  _injectKeyframes(cid) {
    const safe = cid.replace(/[^a-z0-9]/gi,'');
    if (document.getElementById(`kf-${cid}`)) return;
    const s = document.createElement('style');
    s.id = `kf-${cid}`;
    s.textContent = `
      @keyframes pulseRing${safe} {
        0%,100% { r:24; opacity:0.5; }
        50%      { r:34; opacity:0.1; }
      }
    `;
    document.head.appendChild(s);
  }

  async _loadDeps() {
    if (!window.d3)       await this._script('https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js');
    if (!window.topojson) await this._script('https://cdn.jsdelivr.net/npm/topojson-client@3/dist/topojson-client.min.js');
  }

  _script(src) {
    return new Promise((res,rej) => {
      if (document.querySelector(`script[src="${src}"]`)) { res(); return; }
      const s = document.createElement('script');
      s.src=src; s.onload=res; s.onerror=rej;
      document.head.appendChild(s);
    });
  }

  _fallback() {
    return `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f0ede8;border-radius:12px;color:#999;font-size:13px;font-family:Poppins,sans-serif;">Map loading…</div>`;
  }
}

function createMap(containerId, options) {
  const m = new PachaMap(containerId, options);
  m.render();
  return m;
}