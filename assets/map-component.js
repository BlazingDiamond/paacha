// ============================================================
// map-component.js — Accurate D3-powered SVG map for Pacha Tours
// Uses Natural Earth TopoJSON data via CDN for real country shapes
// ============================================================

// TopoJSON source for Southern Africa countries from Natural Earth
const TOPO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// ISO numeric codes for TopoJSON country matching
const ISO_NUMERIC = {
  ZA: '710', ZW: '716', MZ: '508', ZM: '894', SZ: '748',
  LS: '426', BW: '072', NA: '516', TZ: '834', MG: '450',
};

// Country fill colours
const COUNTRY_COLORS = {
  ZA: '#d4e3c2', ZW: '#c8dbb0', MZ: '#dde8c8',
  ZM: '#e0d4b8', SZ: '#dcd0e8', LS: '#c8d8e8',
  BW: '#e8e0cc', NA: '#e4dcc8',
};
const COUNTRY_HIGHLIGHT = {
  ZA: '#8fa86b', ZW: '#6b9a52', MZ: '#7a9e5a',
  ZM: '#9a8654', SZ: '#8a72a6', LS: '#5a7a96',
};
const OCEAN_COLOR = '#c8dff0';
const LAND_OTHER_COLOR = '#e8e4dc';
const BORDER_COLOR = '#b8c4a8';

class PachaMap {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.options = {
      width: options.width || 600,
      height: options.height || 500,
      highlightCountries: options.highlightCountries || [],  // e.g. ['ZA','ZW']
      pins: options.pins || [],       // array of pin ids from TOUR_DATA.pins
      routePins: options.routePins || [],  // ordered array of pin ids for animated route
      showLabels: options.showLabels !== false,
      animateRoute: options.animateRoute || false,
      onReady: options.onReady || null,
      viewBox: options.viewBox || null,  // override viewbox
    };
    this.topoData = null;
    this.projection = null;
    this.pathGenerator = null;
    this.currentRouteStep = 0;
    this.isPlaying = false;
    this.playInterval = null;
  }

  async render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    // Load D3 and TopoJSON if not already loaded
    await this._loadDependencies();

    // Fetch topology
    if (!window._pachaTopoCache) {
      try {
        const res = await fetch(TOPO_URL);
        window._pachaTopoCache = await res.json();
      } catch(e) {
        console.error('Failed to load map data:', e);
        container.innerHTML = this._fallbackMap();
        return;
      }
    }
    this.topoData = window._pachaTopoCache;
    this._buildMap(container);

    if (this.options.onReady) this.options.onReady(this);
  }

  async _loadDependencies() {
    // Load D3 if not present
    if (!window.d3) {
      await this._loadScript('https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js');
    }
    // Load topojson if not present
    if (!window.topojson) {
      await this._loadScript('https://cdn.jsdelivr.net/npm/topojson-client@3/dist/topojson-client.min.js');
    }
  }

  _loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  _buildMap(container) {
    const { width, height, highlightCountries, pins, routePins, showLabels } = this.options;
    container.innerHTML = '';

    // Determine which pins to use for extent
    const allPinIds = [...new Set([...pins, ...routePins])];
    const pinObjects = allPinIds.map(id => TOUR_DATA.pins[id]).filter(Boolean);

    // Determine projection based on highlighted countries or provided viewBox
    const countries = topojson.feature(this.topoData, this.topoData.objects.countries);
    const highlightedFeatures = countries.features.filter(f =>
      highlightCountries.some(cc => ISO_NUMERIC[cc] === String(f.id))
    );
    const featuresForFit = highlightedFeatures.length > 0 ? highlightedFeatures : countries.features;

    // Build a collection to fit
    const fitCollection = {
      type: 'FeatureCollection',
      features: highlightedFeatures.length > 0 ? highlightedFeatures : [
        // Default: southern africa bounding box
        { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[10,-36],[42,-36],[42,-8],[10,-8],[10,-36]]] } }
      ]
    };

    const projection = d3.geoMercator()
      .fitExtent([[20, 20], [width - 20, height - 20]], fitCollection);

    this.projection = projection;
    this.pathGenerator = d3.geoPath().projection(projection);

    // Create SVG
    const svg = d3.create('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', '100%')
      .style('background', OCEAN_COLOR);

    // Ocean background
    svg.append('rect')
      .attr('width', width).attr('height', height)
      .attr('fill', OCEAN_COLOR);

    // Subtle grid lines
    const gridStep = 5;
    const gridGroup = svg.append('g').attr('opacity', 0.15);
    for (let lon = 10; lon <= 42; lon += gridStep) {
      const line = { type: 'LineString', coordinates: [[lon, -8], [lon, -36]] };
      gridGroup.append('path').datum(line).attr('d', this.pathGenerator).attr('fill', 'none').attr('stroke', '#6a8aaa').attr('stroke-width', 0.4);
    }
    for (let lat = -35; lat <= -8; lat += gridStep) {
      const line = { type: 'LineString', coordinates: [[10, lat], [42, lat]] };
      gridGroup.append('path').datum(line).attr('d', this.pathGenerator).attr('fill', 'none').attr('stroke', '#6a8aaa').attr('stroke-width', 0.4);
    }

    // Draw all countries in region
    const southernAfricaIds = Object.values(ISO_NUMERIC);
    const countriesGroup = svg.append('g').attr('class', 'countries');

    countries.features.forEach(feature => {
      const isoNum = String(feature.id);
      const cc = Object.keys(ISO_NUMERIC).find(k => ISO_NUMERIC[k] === isoNum);
      const isHighlighted = cc && highlightCountries.includes(cc);
      const isRegion = southernAfricaIds.includes(isoNum);

      if (!isRegion) return; // skip countries outside our region

      const fill = isHighlighted
        ? (COUNTRY_HIGHLIGHT[cc] || '#7a9a6a')
        : (cc ? COUNTRY_COLORS[cc] : LAND_OTHER_COLOR);

      countriesGroup.append('path')
        .datum(feature)
        .attr('d', this.pathGenerator)
        .attr('fill', fill)
        .attr('stroke', BORDER_COLOR)
        .attr('stroke-width', isHighlighted ? 1 : 0.5)
        .attr('class', `country ${isHighlighted ? 'highlighted' : ''}`);
    });

    // Country name labels
    if (showLabels) {
      const labelsGroup = svg.append('g').attr('class', 'country-labels');
      const labelData = [
        { cc: 'ZA', text: 'South Africa', lat: -29.0, lon: 25.0 },
        { cc: 'ZW', text: 'Zimbabwe',     lat: -19.5, lon: 29.5 },
        { cc: 'MZ', text: 'Mozambique',   lat: -18.5, lon: 35.5 },
        { cc: 'ZM', text: 'Zambia',       lat: -14.0, lon: 27.5 },
        { cc: 'SZ', text: 'Eswatini',     lat: -26.5, lon: 31.5 },
        { cc: 'LS', text: 'Lesotho',      lat: -29.6, lon: 28.2 },
        { cc: 'BW', text: 'Botswana',     lat: -22.0, lon: 24.5 },
        { cc: 'NA', text: 'Namibia',      lat: -22.0, lon: 18.0 },
      ];
      labelData.forEach(({ cc, text, lat, lon }) => {
        if (!highlightCountries.includes(cc) && highlightCountries.length > 0) return;
        const [x, y] = projection([lon, lat]);
        if (x < 0 || x > width || y < 0 || y > height) return;
        labelsGroup.append('text')
          .attr('x', x).attr('y', y)
          .attr('text-anchor', 'middle')
          .attr('font-size', highlightCountries.includes(cc) ? 11 : 7)
          .attr('font-weight', highlightCountries.includes(cc) ? '700' : '400')
          .attr('fill', highlightCountries.includes(cc) ? '#2d3d1a' : '#6a7a5a')
          .attr('font-family', 'Poppins, sans-serif')
          .attr('pointer-events', 'none')
          .text(text);
      });
    }

    // ---- ROUTE LINE ----
    if (routePins.length >= 2) {
      const routeGroup = svg.append('g').attr('class', 'route-group');
      this._routeGroup = routeGroup;
      this._routePinCoords = routePins.map(id => {
        const pin = TOUR_DATA.pins[id];
        if (!pin) return null;
        return { id, ...pin, proj: projection([pin.lon, pin.lat]) };
      }).filter(Boolean);

      // Draw completed segments (all dashed initially)
      for (let i = 0; i < this._routePinCoords.length - 1; i++) {
        const a = this._routePinCoords[i];
        const b = this._routePinCoords[i + 1];
        // Create arc path
        const arcPath = this._buildArcPath(a.proj, b.proj);
        routeGroup.append('path')
          .attr('id', `route-seg-${this.containerId}-${i}`)
          .attr('d', arcPath)
          .attr('fill', 'none')
          .attr('stroke', '#8fa86b')
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', '5,3')
          .attr('opacity', 0.3)
          .attr('class', 'route-seg-bg');

        routeGroup.append('path')
          .attr('id', `route-seg-active-${this.containerId}-${i}`)
          .attr('d', arcPath)
          .attr('fill', 'none')
          .attr('stroke', '#5a7a3e')
          .attr('stroke-width', 2.5)
          .attr('stroke-linecap', 'round')
          .attr('opacity', 0)
          .attr('class', 'route-seg-active');
      }
    }

    // ---- PINS ----
    const pinsGroup = svg.append('g').attr('class', 'pins-group');
    this._pinsGroup = pinsGroup;

    // Draw all regular pins
    pinObjects.forEach(pin => {
      this._drawPin(pinsGroup, pin, projection, false);
    });

    // ---- ROUTE PINS (start hidden, revealed by animation) ----
    if (routePins.length > 0) {
      this._routePinCoords?.forEach((pinData, i) => {
        const g = pinsGroup.append('g')
          .attr('id', `route-pin-${this.containerId}-${i}`)
          .attr('transform', `translate(${pinData.proj[0]}, ${pinData.proj[1]})`)
          .attr('opacity', 0)
          .attr('class', 'route-pin');

        // Outer pulse ring
        g.append('circle').attr('r', 10).attr('fill', '#5a7a3e').attr('opacity', 0.15);
        // Pin dot
        g.append('circle').attr('r', 5).attr('fill', '#5a7a3e').attr('stroke', 'white').attr('stroke-width', 1.5);
        // Day number
        g.append('text')
          .attr('text-anchor', 'middle').attr('dy', '0.35em')
          .attr('font-size', 6).attr('font-weight', '700')
          .attr('fill', 'white').attr('pointer-events', 'none')
          .text(i + 1);

        // Label
        const labelY = i % 2 === 0 ? -14 : 14;
        g.append('text')
          .attr('text-anchor', 'middle')
          .attr('y', labelY)
          .attr('font-size', 8).attr('font-weight', '600')
          .attr('fill', '#2d3d1a')
          .attr('stroke', 'white').attr('stroke-width', 2).attr('paint-order', 'stroke')
          .attr('pointer-events', 'none')
          .text(pinData.label);
      });

      // Show first pin immediately
      const firstPin = document.getElementById(`route-pin-${this.containerId}-0`);
      if (firstPin) firstPin.setAttribute('opacity', '1');
    }

    // Compass rose
    this._drawCompass(svg, width - 38, 35);

    container.appendChild(svg.node());
  }

  _buildArcPath(from, to) {
    const mx = (from[0] + to[0]) / 2;
    const my = (from[1] + to[1]) / 2 - Math.abs(to[0] - from[0]) * 0.2;
    return `M ${from[0]} ${from[1]} Q ${mx} ${my} ${to[0]} ${to[1]}`;
  }

  _drawPin(group, pin, projection, dimmed = false) {
    const [x, y] = projection([pin.lon, pin.lat]);
    const g = group.append('g').attr('transform', `translate(${x},${y})`).attr('opacity', dimmed ? 0.4 : 1);
    g.append('circle').attr('r', 6).attr('fill', '#8fa86b').attr('stroke', 'white').attr('stroke-width', 1.5);
    g.append('circle').attr('r', 10).attr('fill', '#8fa86b').attr('opacity', 0.2);
    if (pin.label) {
      g.append('text')
        .attr('text-anchor', 'middle').attr('y', -12)
        .attr('font-size', 8).attr('font-weight', '600')
        .attr('fill', '#2d3d1a')
        .attr('stroke', 'white').attr('stroke-width', 2.5).attr('paint-order', 'stroke')
        .text(pin.label);
    }
  }

  _drawCompass(svg, x, y) {
    const g = svg.append('g').attr('transform', `translate(${x},${y})`);
    g.append('circle').attr('r', 14).attr('fill', 'white').attr('opacity', 0.85).attr('stroke', '#ccc').attr('stroke-width', 0.5);
    g.append('text').attr('text-anchor', 'middle').attr('y', -5).attr('font-size', 8).attr('font-weight', '700').attr('fill', '#8fa86b').text('N');
    g.append('polygon').attr('points', '0,-12 2.5,-4 -2.5,-4').attr('fill', '#8fa86b');
    g.append('polygon').attr('points', '0,12 2.5,4 -2.5,4').attr('fill', '#bbb');
    g.append('text').attr('text-anchor', 'middle').attr('y', 16).attr('font-size', 6).attr('fill', '#bbb').text('S');
  }

  // Animate route step by step
  showStep(stepIndex) {
    if (!this._routePinCoords) return;
    const n = this._routePinCoords.length;
    stepIndex = Math.max(0, Math.min(stepIndex, n - 1));
    this.currentRouteStep = stepIndex;

    // Show/animate segments
    for (let i = 0; i < n - 1; i++) {
      const activeSeg = document.getElementById(`route-seg-active-${this.containerId}-${i}`);
      if (activeSeg) activeSeg.setAttribute('opacity', i < stepIndex ? '1' : '0');
    }

    // Show pins
    for (let i = 0; i < n; i++) {
      const pinEl = document.getElementById(`route-pin-${this.containerId}-${i}`);
      if (pinEl) {
        pinEl.setAttribute('opacity', i <= stepIndex ? '1' : '0');
        if (i === stepIndex) {
          pinEl.classList.add('active-pin');
        } else {
          pinEl.classList.remove('active-pin');
        }
      }
    }

    return this._routePinCoords[stepIndex];
  }

  playRoute(intervalMs = 1000, onStep) {
    if (this.isPlaying) { this.stopRoute(); return; }
    this.isPlaying = true;
    this.showStep(0);
    let step = 0;
    if (onStep) onStep(step, this._routePinCoords[step]);
    this.playInterval = setInterval(() => {
      step++;
      if (step >= this._routePinCoords.length) {
        this.stopRoute();
        return;
      }
      this.showStep(step);
      if (onStep) onStep(step, this._routePinCoords[step]);
    }, intervalMs);
  }

  stopRoute() {
    this.isPlaying = false;
    clearInterval(this.playInterval);
    this.playInterval = null;
  }

  nextStep(onStep) {
    const next = Math.min(this.currentRouteStep + 1, (this._routePinCoords?.length || 1) - 1);
    this.showStep(next);
    if (onStep) onStep(next, this._routePinCoords[next]);
    return next;
  }

  prevStep(onStep) {
    const prev = Math.max(this.currentRouteStep - 1, 0);
    this.showStep(prev);
    if (onStep) onStep(prev, this._routePinCoords[prev]);
    return prev;
  }

  _fallbackMap() {
    return `<div class="w-full h-full flex items-center justify-center bg-stone-100 rounded-2xl text-gray-400 text-sm">
      <span>Map loading...</span>
    </div>`;
  }
}

// Factory function for convenience
function createMap(containerId, options) {
  const map = new PachaMap(containerId, options);
  map.render();
  return map;
}
