// Dependency-free browser checks for this static site. Requires Node 22+ and Chrome/Edge.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { access, readFile, writeFile, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, '.jez/artifacts/redesign');
await mkdir(out, { recursive: true });
const candidates = [process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/chromium', '/usr/bin/google-chrome'].filter(Boolean);
let executable;
for (const candidate of candidates) { try { await access(candidate); executable = candidate; break; } catch {} }
assert(executable, 'Install Chrome/Edge or set CHROME_PATH to its executable.');
const contentTypes = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.woff2': 'font/woff2' };
const server = createServer(async (req, res) => {
  try {
    const name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).replace(/^\//, '') || 'index.html';
    if (!['index.html', 'style.css', 'script.js'].includes(name) && !name.startsWith('images/') && !name.startsWith('assets/')) {
      res.writeHead(404); res.end(); return;
    }
    const file = path.resolve(root, name);
    if (!file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
    const bytes = await readFile(file);
    res.writeHead(200, { 'Content-Type': contentTypes[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(bytes);
  } catch { res.writeHead(404); res.end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const profile = await mkdtemp(path.join(tmpdir(), 'mjp-site-review-'));
const browser = spawn(executable, ['--headless=new', '--remote-debugging-port=0', '--user-data-dir=' + profile,
  '--disable-background-networking', '--no-first-run', '--no-default-browser-check', '--disable-extensions', '--disable-sync', 'about:blank'],
  { windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] });
let socket;
const deadline = setTimeout(() => browser.kill(), 60000);
const failures = [], errors = [], requests = [], checks = [], viewports = [];
try {
  const endpoint = await new Promise((resolve, reject) => {
    let log = '';
    browser.stderr.on('data', data => { log += data; const match = log.match(/DevTools listening on (ws:\/\/\S+)/); if (match) resolve(match[1]); });
    browser.on('error', reject); browser.on('exit', code => reject(new Error('Browser exited before connection: ' + code)));
  });
  socket = new WebSocket(endpoint);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  let id = 0;
  const pending = new Map();
  socket.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const job = pending.get(message.id); pending.delete(message.id);
      if (message.error) job.reject(new Error(JSON.stringify(message.error))); else job.resolve(message.result);
    }
    if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text);
    if (message.method === 'Log.entryAdded' && message.params.entry.level === 'error') errors.push(message.params.entry.text);
    if (message.method === 'Network.responseReceived' && message.params.response.status >= 400) failures.push(message.params.response.url);
    if (message.method === 'Network.requestWillBeSent') requests.push(message.params.request.url);
  };
  const call = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const requestId = ++id; pending.set(requestId, { resolve, reject });
    socket.send(JSON.stringify({ id: requestId, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
  const { targetId } = await call('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await call('Target.attachToTarget', { targetId, flatten: true });
  const page = (method, params) => call(method, params, sessionId);
  const evaluate = async (expression) => {
    const response = await page('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    assert(!response.exceptionDetails, JSON.stringify(response.exceptionDetails));
    return response.result.value;
  };
  const key = async (key, code = key, windowsVirtualKeyCode) => {
    await page('Input.dispatchKeyEvent', { type: 'keyDown', key, code, windowsVirtualKeyCode, ...(key === 'Enter' ? { text: '\r', unmodifiedText: '\r' } : {}) });
    await page('Input.dispatchKeyEvent', { type: 'keyUp', key, code, windowsVirtualKeyCode });
  };
  const click = async (selector) => {
    const point = await evaluate(`(() => { const e=document.querySelector(${JSON.stringify(selector)}); e.scrollIntoView({block:'center',behavior:'instant'}); const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}; })()`);
    await page('Input.dispatchMouseEvent', { type: 'mousePressed', ...point, button: 'left', clickCount: 1 });
    await page('Input.dispatchMouseEvent', { type: 'mouseReleased', ...point, button: 'left', clickCount: 1 });
  };
  await page('Page.enable'); await page('Runtime.enable'); await page('Network.enable'); await page('Log.enable');
  await page('Network.setBlockedURLs', { urls: ['https://*'] });
  await page('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  const resize = (width, height = 900) => page('Emulation.setDeviceMetricsOverride', { width, height, screenWidth: width, screenHeight: height, deviceScaleFactor: 1, mobile: width < 600 });
  const load = async () => {
    await page('Page.navigate', { url: origin });
    for (let i = 0; i < 60; i++) {
      if (await evaluate("document.readyState === 'complete'")) break;
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    await evaluate('document.fonts.ready.then(() => true)');
  };
  const measure = () => evaluate(`(() => ({
    viewport:innerWidth, clientWidth:document.documentElement.clientWidth, contentWidth:document.documentElement.scrollWidth,
    projects:[...document.querySelectorAll('#project article')].map(e=>({visible:getComputedStyle(e).display!=='none'&&e.getBoundingClientRect().width>0,title:e.querySelector('h3').textContent})),
    fonts:[...document.fonts].map(f=>({family:f.family,status:f.status})),
    rootFont:getComputedStyle(document.documentElement).fontSize
  }))()`);
  for (const width of [320, 375, 390, 768, 1024, 1440]) {
    await resize(width); await load();
    const metric = await measure(); viewports.push({ width, ...metric });
    assert(metric.contentWidth <= metric.clientWidth + 1, `Horizontal overflow at ${width}: ${metric.contentWidth}/${metric.clientWidth}`);
    assert.equal(metric.projects.length, 3); assert(metric.projects.every(p => p.visible), `Project hidden at ${width}`);
    assert(metric.fonts.length === 2 && metric.fonts.every(f => f.status === 'loaded'), 'Local font loading failed');
    if (width === 375 || width === 1440) {
      const contrastIssues = await evaluate(`(() => {
        const parse = c => c.match(/[\\d.]+/g).map(Number);
        const luminance = c => c.slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
        const issues=[];
        for(const e of document.body.querySelectorAll('*')) {
          if(e.closest('[aria-hidden="true"],svg') || !e.getClientRects().length || ![...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())) continue;
          const style=getComputedStyle(e); if(style.visibility==='hidden') continue;
          let bg=e, color;
          while(bg) { color=parse(getComputedStyle(bg).backgroundColor); if(color.length===3||color[3]>0) break; bg=bg.parentElement; }
          if(!bg) color=[255,255,255];
          const fg=luminance(parse(style.color)), back=luminance(color);
          const ratio=(Math.max(fg,back)+.05)/(Math.min(fg,back)+.05);
          const large=parseFloat(style.fontSize)>=24||(parseFloat(style.fontSize)>=18.66&&parseFloat(style.fontWeight)>=700);
          if(ratio<(large?3:4.5)) issues.push({text:e.textContent.trim().slice(0,60),ratio});
        }
        return issues;
      })()`);
      assert.deepEqual(contrastIssues, [], `Text contrast failure at ${width}`);
      const heroShot = await page('Page.captureScreenshot', { format: 'png' });
      await writeFile(path.join(out, `first-screen-${width}.png`), Buffer.from(heroShot.data, 'base64'));
    }
    const { contentSize } = await page('Page.getLayoutMetrics');
    const shot = await page('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width, height: Math.ceil(contentSize.height), scale: 1 } });
    await writeFile(path.join(out, `viewport-${width}.png`), Buffer.from(shot.data, 'base64'));
  }
  checks.push('All three projects visible; no horizontal overflow; both local fonts loaded at six widths.');
  checks.push('Visible text contrast meets AA thresholds at 375px and 1440px on the current solid-color surfaces; decorative text excluded.');

  await resize(375); await load();
  assert.equal(await evaluate("getComputedStyle(document.querySelector('#primary-nav')).display"), 'none');
  await evaluate("document.querySelector('.menu-toggle').focus()");
  await key('Enter', 'Enter', 13);
  assert.equal(await evaluate("document.querySelector('.menu-toggle').getAttribute('aria-expanded')"), 'true');
  await key('Tab', 'Tab', 9);
  assert(await evaluate("document.activeElement.matches('#primary-nav a')"), 'Menu links not keyboard reachable');
  await key('Escape', 'Escape', 27);
  assert(await evaluate("document.activeElement.matches('.menu-toggle') && document.querySelector('.menu-toggle').getAttribute('aria-expanded')==='false'"));
  await click('.menu-toggle'); await click('#primary-nav a[href="#project"]');
  assert.equal(await evaluate('location.hash'), '#project');
  assert.equal(await evaluate("document.querySelector('.menu-toggle').getAttribute('aria-expanded')"), 'false');
  await click('.menu-toggle'); await resize(1024);
  assert.equal(await evaluate("document.querySelector('.menu-toggle').getAttribute('aria-expanded')"), 'false');
  assert.notEqual(await evaluate("getComputedStyle(document.querySelector('#primary-nav')).display"), 'none');
  checks.push('Mobile menu: Enter, Tab, Escape/focus return, link activation, and desktop resize passed.');

  await resize(390); await load();
  for (let i = 0; i < 3; i++) {
    await evaluate(`document.querySelectorAll('.project-details')[${i}].querySelector('summary').focus()`);
    await key('Enter', 'Enter', 13);
    assert(await evaluate(`document.querySelectorAll('.project-details')[${i}].open`));
    assert(await evaluate(`document.querySelectorAll('.project-details')[${i}].querySelector('a').getAttribute('href').startsWith('images/')`));
    await key('Enter', 'Enter', 13);
    assert.equal(await evaluate(`document.querySelectorAll('.project-details')[${i}].open`), false);
  }
  checks.push('All three native project disclosures open/close using the keyboard and link to real local documents.');
  assert(await evaluate("document.querySelector('a[href^=\"mailto:\"]').href==='mailto:mjprudente25@gmail.com'"));
  assert(await evaluate("document.querySelector('a[href^=\"tel:\"]').href==='tel:+639777136757'"));
  assert.equal(await evaluate('document.querySelectorAll("h1").length'), 1);
  assert(await evaluate("[...document.querySelectorAll('img')].every(i=>i.getAttribute('alt')?.length>0)"));
  assert.equal(await evaluate("getComputedStyle(document.documentElement).scrollBehavior"), 'auto');
  checks.push('Contact destinations, one h1, informative image alt text, and reduced-motion scroll behavior passed.');

  assert.equal(await evaluate("getComputedStyle(document.querySelector('.coil-container')).animationName"), 'none');
  await page('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
  await load();
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.coil-container')).animationName"), 'reactor-anim');
  assert.equal(await evaluate("document.querySelector('.motion-toggle')"), null);
  const typedAt = async time => evaluate(`(() => {
    const letters=[...document.querySelectorAll('.wordmark-typing>span')];
    letters.forEach(e=>{const a=e.getAnimations()[0];a.pause();a.currentTime=${time};});
    return letters.map(e=>getComputedStyle(e).opacity);
  })()`);
  assert.deepEqual(await typedAt(1200), ['1','1','1','1']);
  assert.deepEqual(await typedAt(3450), ['0','0','0','0']);
  assert.deepEqual(await typedAt(5200), ['1','1','1','1']);
  const cursorPositions = [];
  for (const time of [1200, 2850, 3050, 3250, 3450]) {
    await typedAt(time);
    cursorPositions.push(await evaluate("document.querySelector('.wordmark-typing').getBoundingClientRect().right"));
  }
  assert(cursorPositions.every((x,i)=>i===0 || x<cursorPositions[i-1]), 'Cursor must retreat with each erased character');

  await page('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await load();
  checks.push('Arc reactor animates and respects reduced motion; pause button removed; header types, erases, and repeats across cycles.');

  await page('Page.setFontSizes', { fontSizes: { standard: 32 } });
  for (const width of [320, 768]) {
    await resize(width); await load(); const metric = await measure();
    assert.equal(metric.rootFont, '32px');
    if (metric.contentWidth > metric.clientWidth + 1) {
      console.error(await evaluate(`JSON.stringify([...document.body.querySelectorAll('*')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.right>document.documentElement.clientWidth+1}).map(e=>({tag:e.tagName,class:e.className,right:e.getBoundingClientRect().right,width:e.getBoundingClientRect().width})))`));
    }
    assert(metric.contentWidth <= metric.clientWidth + 1, `Text resizing overflow at ${width}: ${JSON.stringify(metric)}`);
    assert(metric.projects.every(p=>p.visible));
  }
  checks.push('200% default text size: no horizontal overflow or hidden project entries at 320px and 768px.');
  await page('Page.setFontSizes', { fontSizes: { standard: 16 } });
  await page('Emulation.setScriptExecutionDisabled', { value: true });
  await resize(375); await load();
  assert.notEqual(await evaluate("getComputedStyle(document.querySelector('#primary-nav')).display"), 'none');
  assert(await evaluate("document.querySelector('h1').textContent.includes('Prudente') && [...document.querySelectorAll('#project article')].every(e=>e.getBoundingClientRect().width>0)"));
  checks.push('Without JavaScript: identity, navigation, and all project entries remain available.');
  const external = [...new Set(requests.filter(url => /^https?:/.test(url) && !url.startsWith(origin + '/')))];
  assert.deepEqual(external, []); assert.deepEqual(failures, []); assert.deepEqual(errors, []);
  checks.push('No external runtime requests, failed resources, JavaScript exceptions, or browser error logs.');
  await writeFile(path.join(out, 'verification.json'), JSON.stringify({ date: '2026-10-28', browser: await call('Browser.getVersion'), checks, viewports, externalRequests: external, failedResources: failures, errors }, null, 2));
  checks.forEach(check => console.log('PASS ' + check));
  await call('Browser.close');
} finally {
  clearTimeout(deadline); socket?.close();
  if (browser.exitCode === null) browser.kill();
  await new Promise(resolve => server.close(resolve));
  // Remove only the exact temporary profile created above, after checking its location.
  const resolvedProfile = path.resolve(profile);
  assert(resolvedProfile.startsWith(path.resolve(tmpdir()) + path.sep) && path.basename(resolvedProfile).startsWith('mjp-site-review-'));
  await rm(resolvedProfile, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 }).catch(() => {});
}
