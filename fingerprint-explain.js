/* DorkSearch PRO - Browser Fingerprint Test
 * Plain-language presentation layer.
 * Turns the raw attributes collected by fingerprint.js into readable cards:
 * friendly titles, human values, a short explanation and a risk label.
 * Raw technical values stay available behind a "Technical value" toggle.
 */
(() => {
  'use strict';

  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  };

  /* ---------- helpers ---------- */
  function parseUA(ua) {
    let b = 'an unknown browser', v = '', m;
    if ((m = ua.match(/Edg\/(\d+)/))) { b = 'Microsoft Edge'; v = m[1]; }
    else if ((m = ua.match(/OPR\/(\d+)/))) { b = 'Opera'; v = m[1]; }
    else if ((m = ua.match(/Firefox\/(\d+)/))) { b = 'Firefox'; v = m[1]; }
    else if ((m = ua.match(/Chrome\/(\d+)/))) { b = 'Chrome'; v = m[1]; }
    else if ((m = ua.match(/Version\/(\d+).*Safari/))) { b = 'Safari'; v = m[1]; }

    let os = 'an unknown system', a;
    if (/Windows NT 10/.test(ua)) os = 'Windows 10/11';
    else if (/Windows/.test(ua)) os = 'Windows';
    else if ((a = ua.match(/Android ([\d.]+)/))) os = 'Android ' + a[1];
    else if (/iPhone|iPad|iPod/.test(ua)) os = 'iOS';
    else if (/Mac OS X/.test(ua)) os = 'macOS';
    else if (/CrOS/.test(ua)) os = 'ChromeOS';
    else if (/Linux/.test(ua)) os = 'Linux';
    return { browser: v ? `${b} ${v}` : b, os };
  }

  function langNames(v) {
    try {
      const dn = new Intl.DisplayNames(['en'], { type: 'language' });
      const seen = new Set();
      return v.split(',').map(s => s.trim()).filter(Boolean)
        .map(c => { try { return dn.of(c) || c; } catch (e) { return c; } })
        .filter(n => !seen.has(n) && seen.add(n)).join(', ');
    } catch (e) { return v; }
  }

  function gpuName(v) {
    if (!/^ANGLE \(/i.test(v)) return v;
    const parts = v.replace(/^ANGLE \(/i, '').replace(/\)$/, '').split(', ');
    const raw = parts[1] || parts[0];
    return raw.replace(/\s*\(0x[0-9a-f]+\).*$/i, '').replace(/\s+(Direct3D|OpenGL|Metal|Vulkan).*$/i, '').trim();
  }

  const size = v => v.replace(' x ', ' \u00d7 ') + ' pixels';
  const yesNo = v => (v === 'true' ? 'Yes' : 'No');
  const onOff = v => (v === 'true' ? 'On' : 'Off');

  /* ---------- group descriptions ---------- */
  const GROUPS = {
    'Browser & Operating System': { title: 'Your browser and system', icon: 'fa-desktop', blurb: 'Basic details every website receives automatically when you visit.' },
    'Screen & Display': { title: 'Your screen', icon: 'fa-display', blurb: 'The size and sharpness of your display.' },
    'Hardware': { title: 'Your device', icon: 'fa-microchip', blurb: 'What your computer or phone is made of.' },
    'Rendering (Canvas / WebGL / Audio)': { title: 'How your device draws and plays', icon: 'fa-palette', blurb: 'Tiny differences in your graphics card and sound system create a signature that is very hard to fake.' },
    'Fonts': { title: 'Your installed fonts', icon: 'fa-font', blurb: 'The set of fonts on your device is surprisingly personal.' },
    'Privacy Signals': { title: 'Your privacy settings', icon: 'fa-user-shield', blurb: 'Signals that tell websites how you want to be treated.' },
    'Preferences & Media': { title: 'Your display preferences', icon: 'fa-sliders-h', blurb: 'Choices you made in your system settings that websites can read.' },
    'Capabilities & Storage': { title: 'What your browser can do', icon: 'fa-puzzle-piece', blurb: 'Features supported by your browser version and configuration.' },
    'Network': { title: 'Your connection', icon: 'fa-wifi', blurb: 'Rough information about your internet connection.' }
  };

  /* ---------- per-attribute explanations ---------- */
  const META = {
    'User-Agent': { title: 'Browser and operating system', why: 'Sent to every site you visit. It names your browser, its version and your operating system.', human: v => { const p = parseUA(v); return `${p.browser} on ${p.os}`; } },
    'Platform': { title: 'System type', why: 'The kind of system your browser is running on.', human: v => v },
    'Languages': { title: 'Languages', why: 'Your preferred languages. An unusual combination narrows you down quickly.', human: v => langNames(v) },
    'Time zone': { title: 'Time zone', why: 'Shows the region of the world where you most likely are.', human: v => v },
    'Vendor': { title: 'Browser maker', why: 'Tells sites which company or engine is behind your browser.', human: v => v },
    'Client Hints': {
      title: 'Detailed system information',
      why: 'Chromium browsers hand over extra details such as your processor type and exact browser build to any script that asks.',
      human: (v, ctx) => {
        const kv = {};
        v.split(';').forEach(p => { const i = p.indexOf('='); if (i > 0) kv[p.slice(0, i).trim()] = p.slice(i + 1).trim(); });
        const parts = [];
        if (kv.bitness || kv.architecture) parts.push(`${kv.bitness ? kv.bitness + '-bit ' : ''}${kv.architecture || ''} processor`.trim());
        if (kv.uaFullVersion) parts.push(`exact browser build ${kv.uaFullVersion}`);
        if (ctx.get('Platform') === 'Windows' && kv.platformVersion) parts.push(parseInt(kv.platformVersion, 10) >= 13 ? 'Windows 11' : 'Windows 10');
        if (kv.model) parts.push(`device model ${kv.model}`);
        return parts.join(' \u00b7 ') || v;
      }
    },

    'Screen resolution': { title: 'Screen size', why: 'Your exact screen resolution. Uncommon sizes make you easier to recognize.', human: size },
    'Available area': { title: 'Usable screen area', why: 'The difference from the full screen reveals the size and position of your taskbar or dock.', human: size },
    'Color depth': { title: 'Color depth', why: 'How many colors your screen can show.', human: v => (v === '24-bit' ? '24-bit (16.7 million colors)' : v) },
    'Pixel ratio': { title: 'Screen sharpness', why: 'Shows whether you use a high-density display or a zoomed interface.', human: v => `${v}\u00d7 ${+v >= 2 ? '(high-density display)' : +v > 1 ? '(scaled display)' : '(standard display)'}` },
    'Window size (changes with resize)': { title: 'Browser window size', why: 'Changes whenever you resize the window, so it is not counted in your fingerprint.', human: size },

    'CPU logical cores': { title: 'Processor cores', why: 'The number of processing threads your device offers.', human: v => `${v} cores` },
    'Device memory (GB, capped)': { title: 'Memory (RAM)', why: 'An approximate amount of memory. Browsers round this value on purpose.', human: v => `About ${v} GB` },
    'Max touch points': { title: 'Touchscreen', why: 'Shows whether your device has a touchscreen.', human: v => (v === '0' ? 'No touchscreen' : `Touchscreen (up to ${v} fingers)`) },

    'Canvas fingerprint': { title: 'Graphics signature (canvas)', why: 'Your browser draws a hidden image. The exact pixels depend on your graphics card, drivers and fonts, producing a signature.', human: v => `Signature ${v.slice(0, 8)}\u2026` },
    'GPU vendor': { title: 'Graphics card maker', why: 'The company that makes your graphics hardware.', human: v => v },
    'GPU renderer': { title: 'Graphics card model', why: 'Websites can read the exact model of your graphics card, one of the strongest hardware identifiers.', human: v => gpuName(v) },
    'WebGL version': { title: '3D graphics support', why: 'The version of 3D graphics technology your browser supports.', human: v => v },
    'WebGL extensions': { title: '3D graphics features', why: 'The list of optional graphics features is specific to your graphics card and driver.', human: v => { const m = v.match(/^(\d+)/); return m ? `${m[1]} features supported` : v; } },
    'Max texture size': { title: 'Maximum image size for graphics', why: 'A limit set by your graphics card.', human: v => `${v} \u00d7 ${v} pixels` },
    'WebGL': { title: '3D graphics (WebGL)', why: 'Your browser blocks or does not support this feature, which hides hardware details.', human: v => v },
    'Audio fingerprint': { title: 'Sound signature', why: 'Your browser processes a silent test sound. Tiny differences in your audio system create a signature.', human: v => `Signature ${v.slice(0, 8)}\u2026` },

    __fonts: {
      title: 'Installed fonts',
      why: 'The exact combination of fonts on your device is rare and highly identifying.',
      human: v => { const m = v.match(/^(\d+) found/); return m ? `${m[1]} fonts detected${m[1] === '0' ? ' (your browser may be hiding them)' : ''}` : v; }
    },

    'Do Not Track': { title: 'Do Not Track', why: 'An old browser setting asking sites not to track you. Many sites ignore it.', human: v => (v === 'Enabled' ? 'Enabled \u2014 sites are asked not to track you' : v === 'Disabled' ? 'Disabled' : 'Not set \u2014 you have not asked sites to avoid tracking you') },
    'Global Privacy Control': { title: 'Global Privacy Control', why: 'A newer opt-out signal that is legally recognized in several regions.', human: v => (v === 'Enabled' ? 'Enabled \u2014 sites receive a legal opt-out signal' : 'Not sent \u2014 sites get no privacy opt-out from you') },
    'Cookies enabled': { title: 'Cookies allowed', why: 'Whether your browser accepts cookies.', human: yesNo },
    'Automation flag (webdriver)': { title: 'Automated browser', why: 'Sites check this to detect bots and testing tools.', human: v => (v.startsWith('true') ? 'Yes \u2014 looks like an automated browser' : 'No \u2014 looks like a normal browser') },
    'Brave browser': { title: 'Brave browser', why: 'Brave includes built-in fingerprint protection.', human: v => v },
    'Built-in PDF viewer': { title: 'PDF viewer', why: 'Whether your browser can open PDF files by itself.', human: v => (v === 'true' ? 'Enabled' : 'Disabled') },
    'Plugins listed': { title: 'Browser components', why: 'Modern browsers expose a fixed list. An unusual number can stand out.', human: v => `${v} listed` },

    'Color scheme': { title: 'Dark or light mode', why: 'Your system theme is visible to websites.', human: v => (v === 'dark' ? 'Dark mode' : 'Light mode') },
    'Reduced motion': { title: 'Reduce animations', why: 'An accessibility setting that websites can read.', human: onOff },
    'High contrast': { title: 'High contrast', why: 'An accessibility setting that websites can read.', human: onOff },
    'Forced colors': { title: 'Forced colors mode', why: 'An accessibility setting that websites can read.', human: onOff },
    'Primary pointer / hover': {
      title: 'Input device',
      why: 'Shows whether you mainly use a mouse or a touchscreen.',
      human: v => { const [p, h] = v.split(' / '); return `${p === 'fine' ? 'Mouse or trackpad' : p === 'coarse' ? 'Touchscreen' : 'No pointer'}${h === 'hover' ? ', supports hover' : ''}`; }
    },
    'Color gamut': { title: 'Range of colors', why: 'Wide-gamut screens are less common and easier to single out.', human: v => (v === 'srgb' ? 'Standard colors (sRGB)' : v === 'p3' ? 'Wide colors (Display P3)' : v) },
    'HDR': { title: 'HDR display', why: 'Shows whether your screen supports high dynamic range.', human: v => (v === 'true' ? 'Supported' : 'Not supported') },

    'Storage': {
      title: 'Data storage',
      why: 'Whether your browser lets sites save data locally. Blocking it can make you stand out.',
      human: v => { const bad = [...v.matchAll(/(\w+)=false/g)].map(m => m[1]); return bad.length ? `Blocked or unavailable: ${bad.join(', ')}` : 'All storage types available'; }
    },
    'API support': {
      title: 'Modern web features',
      why: 'Which advanced features your browser version supports.',
      human: v => { const all = v.split(' '); const yes = all.filter(x => x.endsWith(':yes')).length; return `${yes} of ${all.length} features supported`; }
    },
    'Connection hints': { title: 'Connection quality', why: 'A rough estimate of your connection speed. It changes often, so it is not counted.', human: v => v },
    'Online status': { title: 'Online status', why: 'Whether your browser believes it is online.', human: v => (v === 'true' ? 'Online' : 'Offline') }
  };

  function metaFor(a) {
    if (META[a.label]) return META[a.label];
    if (a.label.startsWith('Installed fonts')) return META.__fonts;
    return null;
  }

  const level = b => (b >= 6 ? ['high', 'Very revealing'] : b >= 3 ? ['med', 'Revealing'] : b > 0 ? ['low', 'Common'] : ['info', 'Info only']);

  /* ---------- rendering ---------- */
  function row(a, ctx) {
    const m = metaFor(a) || { title: a.label, why: a.note || '', human: v => v };
    let human;
    try { human = a.value === 'Unavailable' ? 'Not available in this browser' : m.human(a.value, ctx); }
    catch (e) { human = a.value; }

    const [lv, word] = level(a.bits);
    const r = el('div', 'fp-row');
    const main = el('div', 'fp-row-main');
    main.appendChild(el('span', 'fp-label', m.title));
    main.appendChild(el('span', 'fp-value', human));
    if (m.why) main.appendChild(el('span', 'fp-note', m.why));

    if (human !== a.value && a.value !== 'Unavailable') {
      const d = el('details', 'fp-tech');
      d.appendChild(el('summary', '', 'Technical value'));
      d.appendChild(el('code', '', a.value));
      main.appendChild(d);
    }

    r.appendChild(main);
    const badge = el('span', `fp-badge fp-${lv}`, word);
    badge.title = a.bits ? `${a.bits} bits of identifying information` : 'Not counted in your score';
    r.appendChild(badge);
    return r;
  }

  function intro(data, totalBits, ctx) {
    const box = el('div', 'fp-intro-panel');
    box.appendChild(el('h3', '', 'YOUR BROWSER IN PLAIN WORDS'));
    const ul = el('ul', 'fp-sentences');
    const add = t => ul.appendChild(el('li', '', t));

    const ua = ctx.get('User-Agent');
    if (ua && ua !== 'Unavailable') {
      const p = parseUA(ua);
      const scr = ctx.get('Screen resolution');
      const tz = ctx.get('Time zone');
      let s = `Any website can see that you use ${p.browser} on ${p.os}`;
      if (scr && scr !== 'Unavailable') s += `, with a ${scr.replace(' x ', ' \u00d7 ')} screen`;
      if (tz && tz !== 'Unavailable') s += `, in the ${tz} time zone`;
      add(s + '.');
    }
    const lang = ctx.get('Languages');
    if (lang && lang !== 'Unavailable') add(`Your browser tells every site that you speak ${langNames(lang)}.`);

    const gpu = ctx.get('GPU renderer');
    if (gpu && gpu !== 'Unavailable') add(`Your graphics card (${gpuName(gpu)}) is visible to the sites you open.`);

    const fonts = data.attrs.find(a => a.label.startsWith('Installed fonts'));
    const fm = fonts && fonts.value.match(/^(\d+) found/);
    if (fm && +fm[1] > 0) add(`${fm[1]} of the fonts we tested are installed on your device, and that exact mix is rarely shared by many people.`);

    if (ctx.get('Do Not Track') !== 'Enabled' && ctx.get('Global Privacy Control') !== 'Enabled')
      add('You are not sending any "do not track" or privacy opt-out signal.');

    const top = data.attrs.filter(a => a.bits > 0).slice().sort((x, y) => y.bits - x.bits).slice(0, 3)
      .map(a => `${(metaFor(a) || { title: a.label }).title} (${a.bits} bits)`);
    if (top.length) add(`Biggest giveaways: ${top.join(', ')}.`);

    box.appendChild(ul);

    const how = el('div', 'fp-how');
    how.appendChild(el('p', '', 'Each "bit" of information cuts in half the number of people you could be. Around 33 bits is enough to single out one person among 8 billion. The labels below show how much each detail helps to identify you.'));
    const legend = el('div', 'fp-legend');
    [['low', 'Common', 'shared by many people'], ['med', 'Revealing', 'shared by fewer people'], ['high', 'Very revealing', 'can help identify you']].forEach(([lv, word, desc]) => {
      const item = el('span', 'fp-legend-item');
      item.appendChild(el('span', `fp-badge fp-${lv}`, word));
      item.appendChild(document.createTextNode(' ' + desc));
      legend.appendChild(item);
    });
    how.appendChild(legend);
    box.appendChild(how);
    return box;
  }

  const SPLIT = 6; // number of category cards shown before the ad

  function render(wrap, data, totalBits, wrap2) {
    wrap.textContent = '';
    if (wrap2) wrap2.textContent = '';
    const attrs = data.attrs;
    const ctx = { get: l => { const a = attrs.find(x => x.label === l); return a ? a.value : ''; } };

    wrap.appendChild(intro(data, totalBits, ctx));

    [...new Set(attrs.map(a => a.group))].forEach((g, i) => {
      const meta = GROUPS[g] || { title: g, icon: 'fa-circle', blurb: '' };
      const items = attrs.filter(a => a.group === g).slice().sort((a, b) => b.bits - a.bits);
      const gbits = items.reduce((s, a) => s + a.bits, 0);
      const share = totalBits > 0 ? Math.round((gbits / totalBits) * 100) : 0;

      const card = el('div', 'fp-card');
      const head = el('div', 'fp-card-head');

      const left = el('div', 'fp-card-title');
      const h = el('h3');
      h.appendChild(el('i', `fas ${meta.icon}`));
      h.appendChild(document.createTextNode(meta.title));
      left.appendChild(h);
      if (meta.blurb) left.appendChild(el('p', 'fp-card-blurb', meta.blurb));
      head.appendChild(left);

      const right = el('div', 'fp-share');
      right.appendChild(el('span', 'fp-share-num', share + '%'));
      right.appendChild(el('span', 'fp-share-label', 'of your fingerprint'));
      const bar = el('div', 'fp-share-bar');
      const fill = el('div');
      fill.style.width = share + '%';
      bar.appendChild(fill);
      right.appendChild(bar);
      head.appendChild(right);

      card.appendChild(head);
      items.forEach(a => card.appendChild(row(a, ctx)));
      (wrap2 && i >= SPLIT ? wrap2 : wrap).appendChild(card);
    });

    const part2 = wrap2 && wrap2.closest('section');
    if (part2) part2.classList.toggle('hidden', !wrap2.children.length);
  }

  window.FPExplain = { render };
})();
