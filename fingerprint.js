/* DorkSearch PRO - Browser Fingerprint Test
 * 100% client-side. Nothing is sent anywhere unless the user clicks one of the
 * opt-in tests (public IP lookup / WebRTC leak test).
 */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  };
  const withTimeout = (p, ms) =>
    Promise.race([p, new Promise(res => setTimeout(() => res(null), ms))]);

  /* ---------- hashing ---------- */
  function cyrb53(str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0; i < str.length; i++) {
      const ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0));
  }

  async function sha256(str) {
    try {
      if (window.crypto && crypto.subtle) {
        const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
        return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
      }
    } catch (e) { /* fall through */ }
    return cyrb53(str).toString(16).padStart(16, '0');
  }

  const short = async s => (s ? (await sha256(s)).slice(0, 16) : null);

  /* ---------- individual probes ---------- */
  function canvasData() {
    try {
      const c = document.createElement('canvas');
      c.width = 280; c.height = 60;
      const x = c.getContext('2d');
      x.textBaseline = 'top';
      x.font = "16px Arial";
      x.fillStyle = '#f60';
      x.fillRect(100, 1, 62, 20);
      x.fillStyle = '#069';
      x.fillText('DorkSearch PRO fp \u{1F50D} \u2603', 2, 15);
      x.fillStyle = 'rgba(102,204,0,0.7)';
      x.font = '18px "Times New Roman"';
      x.fillText('Cwm fjordbank glyphs vext quiz', 4, 35);
      x.globalCompositeOperation = 'multiply';
      x.fillStyle = 'rgb(255,0,255)';
      x.beginPath(); x.arc(50, 50, 50, 0, Math.PI * 2, true); x.closePath(); x.fill();
      return c.toDataURL();
    } catch (e) { return null; }
  }

  function webglInfo() {
    try {
      const c = document.createElement('canvas');
      const gl = c.getContext('webgl') || c.getContext('experimental-webgl');
      if (!gl) return null;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      return {
        vendor: ext ? gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR),
        renderer: ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER),
        version: gl.getParameter(gl.VERSION),
        maxTexture: gl.getParameter(gl.MAX_TEXTURE_SIZE),
        extensions: (gl.getSupportedExtensions() || []).sort().join(','),
        extCount: (gl.getSupportedExtensions() || []).length,
        masked: !ext
      };
    } catch (e) { return null; }
  }

  async function audioHash() {
    const Ctx = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    if (!Ctx) return null;
    try {
      const ctx = new Ctx(1, 5000, 44100);
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = 10000;
      const comp = ctx.createDynamicsCompressor();
      [['threshold', -50], ['knee', 40], ['ratio', 12], ['attack', 0], ['release', 0.25]]
        .forEach(([k, v]) => { if (comp[k]) comp[k].value = v; });
      osc.connect(comp); comp.connect(ctx.destination); osc.start(0);
      const buf = await ctx.startRendering();
      const d = buf.getChannelData(0);
      let sum = 0;
      for (let i = 4500; i < 5000; i++) sum += Math.abs(d[i]);
      return sum.toString();
    } catch (e) { return null; }
  }

  const FONTS = [
    'Arial', 'Arial Black', 'Calibri', 'Cambria', 'Candara', 'Comic Sans MS', 'Consolas',
    'Courier New', 'Georgia', 'Helvetica', 'Impact', 'Lucida Console', 'Lucida Sans Unicode',
    'Microsoft Sans Serif', 'Palatino Linotype', 'Segoe UI', 'Tahoma', 'Times New Roman',
    'Trebuchet MS', 'Verdana', 'Century Gothic', 'Franklin Gothic Medium', 'Garamond',
    'Gill Sans', 'Futura', 'Menlo', 'Monaco', 'Optima', 'Avenir', 'Helvetica Neue',
    'American Typewriter', 'Didot', 'Geneva', 'Ubuntu', 'Cantarell', 'DejaVu Sans',
    'Liberation Sans', 'Noto Sans', 'Droid Sans', 'Roboto', 'Open Sans', 'Fira Code',
    'Source Code Pro', 'Cascadia Code', 'Segoe UI Emoji', 'Apple Color Emoji',
    'Noto Color Emoji', 'MS Gothic', 'SimSun', 'Meiryo', 'Malgun Gothic', 'Nirmala UI'
  ];

  function detectFonts() {
    const bases = ['monospace', 'sans-serif', 'serif'];
    const span = document.createElement('span');
    span.style.cssText = 'position:absolute;left:-9999px;top:-9999px;font-size:72px;visibility:hidden;white-space:nowrap';
    span.textContent = 'mmmmmmmmmmlli';
    document.body.appendChild(span);
    const ref = {};
    bases.forEach(b => { span.style.fontFamily = b; ref[b] = [span.offsetWidth, span.offsetHeight]; });
    const found = FONTS.filter(f => bases.some(b => {
      span.style.fontFamily = `"${f}",${b}`;
      return span.offsetWidth !== ref[b][0] || span.offsetHeight !== ref[b][1];
    }));
    span.remove();
    return found;
  }

  const mq = q => { try { return window.matchMedia(q).matches; } catch (e) { return false; } };

  function storageOk(kind) {
    try { const s = window[kind]; const k = '__fp'; s.setItem(k, '1'); s.removeItem(k); return true; }
    catch (e) { return false; }
  }

  /* ---------- collection ---------- */
  async function collect() {
    const A = [];
    const nav = navigator;
    const add = (group, label, value, bits = 0, opts = {}) => {
      const missing = value === undefined || value === null || value === '';
      A.push({
        group, label,
        value: missing ? 'Unavailable' : String(value),
        bits: missing ? 0 : bits,
        stable: opts.stable !== false,
        note: opts.note || ''
      });
    };

    /* Browser & OS */
    const G1 = 'Browser & Operating System';
    add(G1, 'User-Agent', nav.userAgent, 10);
    add(G1, 'Platform', (nav.userAgentData && nav.userAgentData.platform) || nav.platform, 2);
    add(G1, 'Languages', (nav.languages && nav.languages.length ? nav.languages : [nav.language]).join(', '), 5);
    const tz = (Intl.DateTimeFormat().resolvedOptions() || {}).timeZone;
    add(G1, 'Time zone', tz ? `${tz} (UTC${-new Date().getTimezoneOffset() >= 0 ? '+' : '-'}${Math.abs(new Date().getTimezoneOffset() / 60)})` : null, 3);
    add(G1, 'Vendor', nav.vendor, 1);
    if (nav.userAgentData && nav.userAgentData.getHighEntropyValues) {
      const hv = await withTimeout(nav.userAgentData.getHighEntropyValues(
        ['architecture', 'bitness', 'platformVersion', 'model', 'uaFullVersion']), 1500);
      if (hv) {
        add(G1, 'Client Hints', ['architecture', 'bitness', 'platformVersion', 'model', 'uaFullVersion']
          .filter(k => hv[k]).map(k => `${k}=${hv[k]}`).join('; '), 3,
          { note: 'High-entropy values that Chromium browsers hand to any script that asks.' });
      }
    }

    /* Screen */
    const G2 = 'Screen & Display';
    add(G2, 'Screen resolution', `${screen.width} x ${screen.height}`, 4.8);
    add(G2, 'Available area', `${screen.availWidth} x ${screen.availHeight}`, 2);
    add(G2, 'Color depth', `${screen.colorDepth}-bit`, 1);
    add(G2, 'Pixel ratio', window.devicePixelRatio, 3);
    add(G2, 'Window size (changes with resize)', `${innerWidth} x ${innerHeight}`, 0, { stable: false });

    /* Hardware */
    const G3 = 'Hardware';
    add(G3, 'CPU logical cores', nav.hardwareConcurrency, 2.5);
    add(G3, 'Device memory (GB, capped)', nav.deviceMemory, 2);
    add(G3, 'Max touch points', nav.maxTouchPoints, 1.5);

    /* Rendering */
    const G4 = 'Rendering (Canvas / WebGL / Audio)';
    const c1 = canvasData();
    const c2 = canvasData();
    const noise = !!(c1 && c2 && c1 !== c2);
    add(G4, 'Canvas fingerprint', await short(c1), 8,
      { note: 'Hash of how your GPU, drivers and fonts draw a hidden image.' });
    const gl = webglInfo();
    if (gl) {
      add(G4, 'GPU vendor', gl.vendor, 3);
      add(G4, 'GPU renderer', gl.renderer, 6,
        { note: gl.masked ? 'Your browser hides the real GPU string.' : 'Reveals your exact graphics card/driver.' });
      add(G4, 'WebGL version', gl.version, 1);
      add(G4, 'WebGL extensions', `${gl.extCount} (hash ${await short(gl.extensions)})`, 4);
      add(G4, 'Max texture size', gl.maxTexture, 1.5);
    } else {
      add(G4, 'WebGL', null);
    }
    const a1 = await withTimeout(audioHash(), 2000);
    add(G4, 'Audio fingerprint', await short(a1), 5,
      { note: 'Hash of how your audio stack processes a synthetic signal.' });
    const a2 = a1 ? await withTimeout(audioHash(), 2000) : null;
    const audioNoise = !!(a1 && a2 && a1 !== a2);

    /* Fonts */
    const G5 = 'Fonts';
    const fonts = detectFonts();
    add(G5, `Installed fonts (${FONTS.length} tested)`,
      fonts.length ? `${fonts.length} found: ${fonts.join(', ')}` : '0 found (fonts may be standardized)',
      fonts.length ? 7 : 1,
      { note: 'The set of installed fonts is one of the strongest identifiers.' });

    /* Privacy signals */
    const G6 = 'Privacy Signals';
    const dnt = nav.doNotTrack || window.doNotTrack || nav.msDoNotTrack;
    add(G6, 'Do Not Track', dnt === '1' || dnt === 'yes' ? 'Enabled' : dnt === '0' ? 'Disabled' : 'Not set', 1.5);
    add(G6, 'Global Privacy Control', nav.globalPrivacyControl ? 'Enabled' : 'Not set', 1);
    add(G6, 'Cookies enabled', nav.cookieEnabled, 0.2);
    add(G6, 'Automation flag (webdriver)', nav.webdriver ? 'true (automated browser)' : 'false', 0.5);
    let brave = false;
    try { brave = !!(nav.brave && (await nav.brave.isBrave())); } catch (e) { /* ignore */ }
    add(G6, 'Brave browser', brave ? 'Yes' : 'No', 0.5);
    add(G6, 'Built-in PDF viewer', nav.pdfViewerEnabled, 0.5);
    add(G6, 'Plugins listed', nav.plugins ? nav.plugins.length : null, 2);

    /* Preferences & media */
    const G7 = 'Preferences & Media';
    add(G7, 'Color scheme', mq('(prefers-color-scheme: dark)') ? 'dark' : 'light', 1);
    add(G7, 'Reduced motion', mq('(prefers-reduced-motion: reduce)'), 0.5);
    add(G7, 'High contrast', mq('(prefers-contrast: more)'), 0.5);
    add(G7, 'Forced colors', mq('(forced-colors: active)'), 0.5);
    add(G7, 'Primary pointer / hover', `${mq('(pointer: fine)') ? 'fine' : mq('(pointer: coarse)') ? 'coarse' : 'none'} / ${mq('(hover: hover)') ? 'hover' : 'no hover'}`, 1.5);
    add(G7, 'Color gamut', mq('(color-gamut: rec2020)') ? 'rec2020' : mq('(color-gamut: p3)') ? 'p3' : 'srgb', 1.5);
    add(G7, 'HDR', mq('(dynamic-range: high)'), 1);

    /* Capabilities */
    const G8 = 'Capabilities & Storage';
    add(G8, 'Storage', `localStorage=${storageOk('localStorage')}, sessionStorage=${storageOk('sessionStorage')}, indexedDB=${!!window.indexedDB}`, 1);
    const feat = {
      WebAssembly: typeof WebAssembly === 'object', WebGPU: !!nav.gpu, WebRTC: !!window.RTCPeerConnection,
      ServiceWorker: 'serviceWorker' in nav, Bluetooth: !!nav.bluetooth, USB: !!nav.usb,
      WebXR: !!nav.xr, Notifications: 'Notification' in window, Gamepad: !!nav.getGamepads
    };
    add(G8, 'API support', Object.entries(feat).map(([k, v]) => `${k}:${v ? 'yes' : 'no'}`).join(' '), 3);

    /* Network */
    const G9 = 'Network';
    const cn = nav.connection || nav.mozConnection || nav.webkitConnection;
    add(G9, 'Connection hints', cn ? `${cn.effectiveType || '?'}, ~${cn.downlink || '?'} Mbps, rtt ${cn.rtt || '?'} ms${cn.saveData ? ', save-data' : ''}` : null, 0, { stable: false });
    add(G9, 'Online status', nav.onLine, 0, { stable: false });

    return { attrs: A, noise, audioNoise, fonts, brave, gl, dnt, gpc: !!nav.globalPrivacyControl };
  }

  /* ---------- scoring ---------- */
  const riskOf = b => (b >= 6 ? 'high' : b >= 3 ? 'med' : 'low');

  function verdict(bits) {
    if (bits >= 33) return { level: 'high', title: 'HIGHLY IDENTIFIABLE', text: 'Combined, these signals could single you out even among billions of browsers. Trackers can recognize you without cookies.' };
    if (bits >= 22) return { level: 'med', title: 'EASILY RECOGNIZABLE', text: 'Your browser is likely to be unique or part of a very small group. Cross-site tracking could follow you.' };
    return { level: 'low', title: 'RELATIVELY BLENDED-IN', text: 'Your configuration looks common or is being normalized. That makes you harder to single out.' };
  }

  function recommendations(d) {
    const out = [];
    if (!d.noise && !d.audioNoise)
      out.push(['fa-user-secret', 'No fingerprint randomization detected', 'Brave (Shields) and Firefox with resistFingerprinting add noise or standardize canvas/audio output. Tor Browser makes all users look alike.']);
    if (d.gl && !d.gl.masked)
      out.push(['fa-microchip', 'Your exact GPU is exposed', 'Browsers with fingerprint protection mask the WebGL vendor/renderer strings.']);
    if (d.fonts.length >= 8)
      out.push(['fa-font', `${d.fonts.length} detectable fonts`, 'A rare combination of installed fonts is a strong identifier. Avoid installing unusual fonts in your everyday browser profile.']);
    if (!d.gpc)
      out.push(['fa-hand-paper', 'Global Privacy Control is off', 'Enable GPC (Firefox, Brave, DuckDuckGo browser or an extension) so sites receive a legal opt-out signal.']);
    out.push(['fa-puzzle-piece', 'Be careful with extensions', 'Each extra extension can make you more unique. Prefer a small, popular set (e.g. uBlock Origin).']);
    out.push(['fa-expand', 'Avoid unusual window sizes', 'Maximized or letterboxed windows reduce the uniqueness of screen and window dimensions.']);
    out.push(['fa-code-branch', 'Keep your browser updated', 'Outdated versions have rarer user-agents and miss newer anti-fingerprinting features.']);
    return out;
  }

  /* ---------- rendering ---------- */
  let REPORT = null;

  function render(data, hash, totalBits) {
    const v = verdict(totalBits);

    const sum = $('#fp-summary');
    sum.className = `fp-summary fp-${v.level}`;
    $('#fp-verdict-title').textContent = v.title;
    $('#fp-verdict-text').textContent = v.text;
    $('#fp-bits').textContent = totalBits.toFixed(1);
    $('#fp-id').textContent = hash.slice(0, 32);
    $('#fp-id').title = hash;
    $('#fp-meter-bar').style.width = Math.min(100, (totalBits / 40) * 100) + '%';
    $('#fp-odds').textContent = totalBits >= 33
      ? 'about 1 in 8+ billion (more than the entire web population)'
      : `about 1 in ${Math.round(Math.pow(2, totalBits)).toLocaleString('en-US')}`;

    const flags = $('#fp-flags');
    flags.textContent = '';
    const flag = (ok, onText, offText) => {
      const s = el('span', `fp-flag ${ok ? 'good' : 'bad'}`);
      s.appendChild(el('i', `fas ${ok ? 'fa-shield-alt' : 'fa-exclamation-triangle'}`));
      s.appendChild(document.createTextNode(' ' + (ok ? onText : offText)));
      flags.appendChild(s);
    };
    flag(data.noise, 'Canvas randomization detected', 'Canvas is stable (no randomization)');
    flag(data.audioNoise, 'Audio randomization detected', 'Audio is stable (no randomization)');
    flag(data.gl ? data.gl.masked : true, 'GPU string masked', 'GPU string exposed');
    flag(data.gpc, 'GPC signal sent', 'GPC signal not sent');

    const wrap = $('#fp-groups');
    wrap.textContent = '';
    const groups = [...new Set(data.attrs.map(a => a.group))];
    if (window.FPExplain) window.FPExplain.render(wrap, data, totalBits, $('#fp-groups-2'));
    else groups.forEach(g => {
      const card = el('div', 'fp-card');
      const items = data.attrs.filter(a => a.group === g);
      const gbits = items.reduce((s, a) => s + a.bits, 0);
      const head = el('div', 'fp-card-head');
      head.appendChild(el('h3', '', g));
      head.appendChild(el('span', 'fp-card-bits', `${gbits.toFixed(1)} bits`));
      card.appendChild(head);
      items.forEach(a => {
        const row = el('div', 'fp-row');
        const left = el('div', 'fp-row-main');
        left.appendChild(el('span', 'fp-label', a.label));
        const val = el('span', 'fp-value', a.value);
        val.title = a.value;
        left.appendChild(val);
        if (a.note) left.appendChild(el('span', 'fp-note', a.note));
        const badge = el('span', `fp-badge fp-${riskOf(a.bits)}`, a.bits ? `${a.bits} bits` : '—');
        row.appendChild(left);
        row.appendChild(badge);
        card.appendChild(row);
      });
      wrap.appendChild(card);
    });

    const rec = $('#fp-recs');
    rec.textContent = '';
    recommendations(data).forEach(([icon, title, text]) => {
      const r = el('div', 'info-card');
      const h = el('div', 'info-card-header');
      h.appendChild(el('i', `fas ${icon}`));
      h.appendChild(el('h3', '', title));
      r.appendChild(h);
      r.appendChild(el('p', '', text));
      rec.appendChild(r);
    });

    $('#fp-results').classList.remove('hidden');
  }

  async function run() {
    const btn = $('#fp-run');
    btn.disabled = true;
    $('#fp-run-text').textContent = 'ANALYZING...';
    try {
      const data = await collect();
      const stable = data.attrs.filter(a => a.stable);
      const hash = await sha256(JSON.stringify(stable.map(a => [a.label, a.value])));
      const totalBits = data.attrs.reduce((s, a) => s + a.bits, 0);
      render(data, hash, totalBits);
      REPORT = {
        generated: new Date().toISOString(),
        fingerprintId: hash,
        estimatedBits: Number(totalBits.toFixed(1)),
        randomizationDetected: { canvas: data.noise, audio: data.audioNoise },
        attributes: data.attrs
      };
    } catch (e) {
      console.error(e);
      toast('Something went wrong during the analysis.', 'error');
    }
    btn.disabled = false;
    $('#fp-run-text').textContent = 'RUN AGAIN';
  }

  /* ---------- toast / export ---------- */
  function toast(msg, type = 'info') {
    const c = $('#toast-container');
    if (!c) return;
    const t = el('div', `toast toast-${type}`);
    const icon = type === 'success' ? 'fa-check' : type === 'error' ? 'fa-exclamation-triangle' : 'fa-info-circle';
    t.appendChild(el('i', `fas ${icon}`));
    t.appendChild(el('span', '', msg));
    c.appendChild(t);
    setTimeout(() => t.classList.add('show'), 10);
    setTimeout(() => {
      t.classList.remove('show');
      setTimeout(() => t.remove(), 300);
    }, 3000);
  }

  function copyReport() {
    if (!REPORT) return;
    const text = JSON.stringify(REPORT, null, 2);
    (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject())
      .then(() => toast('Report copied to clipboard', 'success'))
      .catch(() => toast('Could not copy. Try downloading instead.', 'error'));
  }

  function downloadReport() {
    if (!REPORT) return;
    const blob = new Blob([JSON.stringify(REPORT, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'browser-fingerprint-report.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  /* ---------- opt-in network tests ---------- */
  async function ipLookup() {
    const out = $('#fp-ip-out');
    out.textContent = 'Contacting api.ipify.org...';
    try {
      const r = await withTimeout(fetch('https://api.ipify.org?format=json'), 6000);
      if (!r) throw new Error('timeout');
      const j = await r.json();
      out.textContent = `Public IP seen by websites: ${j.ip}`;
    } catch (e) {
      out.textContent = 'Lookup failed (blocked by your browser, VPN or an extension).';
    }
  }

  function webrtcTest() {
    const out = $('#fp-rtc-out');
    out.textContent = 'Gathering ICE candidates via a Google STUN server...';
    if (!window.RTCPeerConnection) { out.textContent = 'WebRTC is disabled in this browser (good for privacy).'; return; }
    const found = new Set();
    let pc;
    try {
      pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
    } catch (e) { out.textContent = 'WebRTC could not be started.'; return; }
    pc.createDataChannel('fp');
    pc.onicecandidate = ev => {
      if (!ev.candidate) return;
      const m = ev.candidate.candidate.split(' ')[4];
      if (m) found.add(m);
    };
    pc.createOffer().then(o => pc.setLocalDescription(o)).catch(() => {});
    setTimeout(() => {
      pc.close();
      const list = [...found];
      if (!list.length) { out.textContent = 'No ICE candidates were exposed.'; return; }
      const lines = list.map(a => {
        if (a.endsWith('.local')) return `${a} (hidden by mDNS - protected)`;
        if (/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(a)) return `${a} (LOCAL network address exposed)`;
        return `${a} (public address exposed to scripts)`;
      });
      out.textContent = 'Candidates: ' + lines.join(' | ');
    }, 3000);
  }

  /* ---------- init ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    $('#fp-run').addEventListener('click', run);
    $('#fp-copy').addEventListener('click', copyReport);
    $('#fp-download').addEventListener('click', downloadReport);
    $('#fp-ip-btn').addEventListener('click', ipLookup);
    $('#fp-rtc-btn').addEventListener('click', webrtcTest);
  });
})();
