/**
 * 告白信揭晓页
 */

function decodeLetter(hash) {
  if (!hash || hash.length < 2) return null;
  try {
    let b64 = hash.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";
    const binary = atob(b64);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function formatCountdown(ms) {
  if (ms <= 0) return "00:00:00";
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h, m, sec].map((n) => String(n).padStart(2, "0")).join(":");
}

function spawnHearts(count = 12) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const el = document.createElement("span");
      el.className = "heart-float";
      el.textContent = "♥";
      el.style.left = `${10 + Math.random() * 80}%`;
      el.style.bottom = `${20 + Math.random() * 30}%`;
      el.style.animationDelay = `${Math.random() * 0.5}s`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 4500);
    }, i * 200);
  }
}

function renderError(root) {
  root.innerHTML = `
    <div class="error-box">
      <h2>这封信无法打开</h2>
      <p style="color: var(--text-muted); margin: 1rem 0">链接可能不完整或已损坏。</p>
      <a href="index.html">返回首页写一封新的 →</a>
    </div>
  `;
}

function renderCountdown(root, data) {
  const revealTime = new Date(data.revealAt).getTime();

  function tick() {
    const left = revealTime - Date.now();
    if (left <= 0) {
      renderLetter(root, data, true);
      return;
    }
    const timer = root.querySelector(".countdown-timer");
    if (timer) timer.textContent = formatCountdown(left);
  }

  root.innerHTML = `
    <div class="countdown-box">
      <h2>致 ${escapeHtml(data.toName)}</h2>
      <p>有一封信，正在潮汐中向你靠近……</p>
      <div class="countdown-timer">${formatCountdown(revealTime - Date.now())}</div>
      <p style="font-size: 0.85rem; margin-top: 1rem; color: var(--text-muted)">
        揭晓后即可阅读全文
      </p>
    </div>
  `;

  tick();
  const interval = setInterval(() => {
    if (revealTime - Date.now() <= 0) {
      clearInterval(interval);
      renderLetter(root, data, true);
    } else {
      tick();
    }
  }, 1000);
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function renderLetter(root, data, animate = false) {
  root.innerHTML = `
    <article class="letter-reveal ${animate ? "" : "visible"}" id="letterContent">
      <p class="letter-to">致 · ${escapeHtml(data.toName)}</p>
      <h1 class="letter-heading">有一份心意，<br/>想对你说</h1>
      <div class="letter-body">${escapeHtml(data.message)}</div>
      <p class="letter-from">—— <em>${escapeHtml(data.fromName)}</em></p>
    </article>
  `;

  if (animate) {
    requestAnimationFrame(() => {
      const el = document.getElementById("letterContent");
      el?.classList.add("visible");
      spawnHearts();
    });
  } else {
    document.getElementById("letterContent")?.classList.add("visible");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("letterRoot");
  const hash = window.location.hash.slice(1);
  const data = decodeLetter(hash);

  if (!data || !data.toName || !data.message) {
    renderError(root);
    return;
  }

  document.title = `致 ${data.toName} · 心潮`;

  const revealTime = data.revealAt ? new Date(data.revealAt).getTime() : 0;
  const now = Date.now();

  if (revealTime > now) {
    renderCountdown(root, data);
  } else {
    renderLetter(root, data, true);
  }
});
