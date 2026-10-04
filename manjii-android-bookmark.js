/* MANJII VVIP Android Chrome Bookmark Launcher
 * Login/branding/session helper for an authorized site.
 * Replace GAS_URL with your existing Google Apps Script Web App /exec URL.
 * Does not alter dice/game outcomes.
 */
(function () {
  'use strict';
  const GAS_URL = 'https://script.google.com/macros/s/AKfycbwS73ooXtnfY_2BFeeMSGIjz-6TCuVvuNdNopn2upuNEyxqsfRKmACrP_Yuf9us5_Mx3A/exec';
  const STORE = 'MANJII_VVIP_ANDROID_SESSION_V1';
  const DEVICE_KEY = 'MANJII_VVIP_ANDROID_DEVICE_V1';
  const old = document.getElementById('manjii-vvip-android-root');
  if (old) { old.remove(); return; }

  const root = document.createElement('div');
  root.id = 'manjii-vvip-android-root';
  root.style.cssText = 'position:fixed;inset:0;z-index:2147483647;background:rgba(3,7,18,.94);display:flex;align-items:center;justify-content:center;padding:16px;overflow:auto;font-family:Arial,sans-serif;color:#edf7ff;box-sizing:border-box;';
  root.innerHTML = `
    <div style="width:min(100%,440px);max-height:94vh;overflow:auto;background:#111827;border:1px solid #2876a8;border-radius:24px;padding:20px;box-sizing:border-box;box-shadow:0 0 35px #0ea5e933">
      <button id="m-close" style="float:right;background:#1f2937;border:1px solid #334155;color:#dbeafe;border-radius:12px;padding:8px 12px;font-size:18px">Ã</button>
      <div style="display:flex;align-items:center;gap:12px;margin:10px 0 18px">
        <img id="m-logo" alt="" style="width:56px;height:56px;object-fit:contain;border-radius:14px;display:none">
        <div><div id="m-title" style="font-weight:900;font-size:23px;letter-spacing:1px;color:#7dd3fc">MANJII VVIP</div><div style="font-size:11px;letter-spacing:1.4px;color:#9caec2;margin-top:5px">SECURE ACCOUNT AUTHENTICATION</div></div>
      </div>
      <img id="m-banner" alt="Banner website" style="width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:16px;border:1px solid #334155;display:none;margin-bottom:18px">
      <div id="m-msg" style="display:none;padding:12px;border-radius:12px;background:#17283c;border:1px solid #28577c;color:#bae6fd;font-size:14px;margin-bottom:14px;overflow-wrap:anywhere"></div>
      <form id="m-form">
        <label style="display:block;font-size:12px;font-weight:800;letter-spacing:1px;color:#aabbd0;margin:14px 0 7px">USERNAME</label>
        <input id="m-user" autocomplete="username" placeholder="Masukkan username" required style="width:100%;box-sizing:border-box;padding:15px;border-radius:13px;border:1px solid #2b3648;background:#070d17;color:white;font-size:16px">
        <label style="display:block;font-size:12px;font-weight:800;letter-spacing:1px;color:#aabbd0;margin:14px 0 7px">PASSWORD</label>
        <input id="m-pass" type="password" autocomplete="current-password" placeholder="Masukkan password" required style="width:100%;box-sizing:border-box;padding:15px;border-radius:13px;border:1px solid #2b3648;background:#070d17;color:white;font-size:16px">
        <label style="display:block;font-size:12px;font-weight:800;letter-spacing:1px;color:#aabbd0;margin:14px 0 7px">LICENSE KEY</label>
        <input id="m-key" autocomplete="off" placeholder="Masukkan license key" required style="width:100%;box-sizing:border-box;padding:15px;border-radius:13px;border:1px solid #2b3648;background:#070d17;color:white;font-size:16px">
        <button id="m-submit" type="submit" style="width:100%;margin-top:18px;padding:16px;border:0;border-radius:13px;background:linear-gradient(100deg,#38bdf8,#2563eb);color:#06111f;font-weight:900;font-size:16px;letter-spacing:1px">LOGIN & VERIFY</button>
      </form>
      <div id="m-active" style="display:none;margin-top:12px;font-size:13px;color:#b7c9dd;overflow-wrap:anywhere"></div>
      <button id="m-logout" style="display:none;width:100%;margin-top:12px;padding:13px;border-radius:12px;background:#1f2937;color:#dbeafe;border:1px solid #475569;font-weight:700">LOGOUT / LEPAS SESI</button>
      <div style="text-align:center;font-size:10px;letter-spacing:1.2px;color:#718096;margin-top:20px">MANJII VIP Â· CLOUD SESSION CHECK</div>
    </div>`;
  document.documentElement.appendChild(root);

  const $ = id => root.querySelector('#' + id);
  const message = (s, bad) => {
    $('m-msg').style.display = 'block';
    $('m-msg').style.borderColor = bad ? '#9f3d50' : '#28577c';
    $('m-msg').style.color = bad ? '#fecdd3' : '#bae6fd';
    $('m-msg').textContent = s;
  };
  const device = () => {
    let v = localStorage.getItem(DEVICE_KEY);
    if (!v) { v = 'android-' + (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)); localStorage.setItem(DEVICE_KEY, v); }
    return v;
  };
  async function api(payload) {
    if (!GAS_URL.startsWith('https://script.google.com/macros/s/')) throw new Error('Isi GAS_URL dengan URL Web App Google Apps Script yang benar.');
    const res = await fetch(GAS_URL, {method:'POST', headers:{'Content-Type':'text/plain;charset=utf-8'}, body:JSON.stringify(payload), redirect:'follow'});
    const data = await res.json();
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return data;
  }
  function setBrand(settings) {
    const map = {};
    (Array.isArray(settings) ? settings : []).forEach(pair => { if (Array.isArray(pair)) map[pair[0]] = pair[1]; });
    if (map.SiteName) $('m-title').textContent = map.SiteName;
    if (map.LogoURL) { $('m-logo').src = map.LogoURL; $('m-logo').style.display = 'block'; $('m-logo').onerror = () => $('m-logo').style.display = 'none'; }
    if (map.BannerURL) { $('m-banner').src = map.BannerURL; $('m-banner').style.display = 'block'; $('m-banner').onerror = () => $('m-banner').style.display = 'none'; }
  }
  function showSession(s) {
    $('m-form').style.display = 'none';
    $('m-active').style.display = 'block';
    $('m-active').textContent = 'Login aktif sebagai ' + s.username + '. Sesi diperiksa melalui backend.';
    $('m-logout').style.display = 'block';
  }
  function showForm() { $('m-form').style.display = 'block'; $('m-active').style.display = 'none'; $('m-logout').style.display = 'none'; }
  $('m-close').onclick = () => root.remove();
  $('m-form').onsubmit = async ev => {
    ev.preventDefault();
    $('m-submit').disabled = true; $('m-submit').textContent = 'MEMERIKSA...';
    try {
      const username = $('m-user').value.trim();
      const result = await api({action:'user_login', username, password:$('m-pass').value, key:$('m-key').value.trim(), device:device(), mode:'android-chrome-bookmarklet'});
      if (result.status !== 'success') throw new Error(result.message || 'Login gagal.');
      const session = {username, token:result.token, device:device(), lastSeen:Date.now()};
      localStorage.setItem(STORE, JSON.stringify(session));
      setBrand(result.settings);
      message('Login berhasil. Sesi tersimpan dan diperiksa oleh backend.', false);
      showSession(session);
    } catch (e) { message(e.message || 'Tidak dapat terhubung ke backend.', true); }
    finally { $('m-submit').disabled = false; $('m-submit').textContent = 'LOGIN & VERIFY'; }
  };
  $('m-logout').onclick = async () => {
    try {
      const s = JSON.parse(localStorage.getItem(STORE) || 'null');
      if (s) {
        const result = await api({action:'user_logout', username:s.username, token:s.token, device:s.device});
        if (result.status !== 'success') throw new Error(result.message || 'Logout gagal.');
      }
      localStorage.removeItem(STORE); showForm(); message('Sesi lokal dihapus. Backend sudah menerima logout jika sesi masih valid.', false);
    } catch(e) { message('Logout belum terkonfirmasi: ' + (e.message || 'kesalahan koneksi') + '. Jangan anggap key sudah dilepas sebelum backend mengonfirmasi.', true); }
  };
  (async () => {
    try {
      const settings = await api({action:'get_settings'});
      if (settings.status === 'success') setBrand(settings.settings);
    } catch(e) { message('Pengaturan website belum termuat: ' + e.message, true); }
    try {
      const s = JSON.parse(localStorage.getItem(STORE) || 'null');
      if (!s) return;
      const ping = await api({action:'user_ping', username:s.username, token:s.token, device:s.device, mode:'android-chrome-bookmarklet'});
      if (ping.status === 'success') { s.lastSeen=Date.now(); localStorage.setItem(STORE, JSON.stringify(s)); setBrand(ping.settings); showSession(s); message('Sesi aktif terverifikasi oleh backend.', false); }
      else { localStorage.removeItem(STORE); message('Sesi sebelumnya sudah tidak valid. Silakan login lagi.', true); }
    } catch(e) { /* Do not erase a session solely because the network is unavailable. */ }
  })();
})();
