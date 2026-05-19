/**
 * 心潮 · 首页交互
 */

const STORAGE_KEY = "xinchao_letter_count";

function getLetterCount() {
  return parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
}

function incrementLetterCount() {
  const n = getLetterCount() + 1;
  localStorage.setItem(STORAGE_KEY, String(n));
  return n;
}

function encodeLetter(data) {
  const json = JSON.stringify(data);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function buildLetterUrl(data) {
  const base = new URL("letter.html", window.location.href).href;
  return `${base}#${encodeLetter(data)}`;
}

function getFormData(form) {
  const fd = new FormData(form);
  const anonymous = fd.get("anonymous") === "on";
  const useReveal = fd.get("useReveal") === "on";
  const revealAt = fd.get("revealAt");

  return {
    toName: (fd.get("toName") || "").trim(),
    fromName: anonymous
      ? "一个在意你的人"
      : (fd.get("fromName") || "").trim(),
    message: (fd.get("message") || "").trim(),
    revealAt: useReveal && revealAt ? new Date(revealAt).toISOString() : null,
    createdAt: new Date().toISOString(),
  };
}

function openModal() {
  const modal = document.getElementById("writeModal");
  modal.showModal();
  document.getElementById("letterForm").querySelector('[name="toName"]')?.focus();
}

function closeModal() {
  document.getElementById("writeModal").close();
}

function showResult(url) {
  document.getElementById("letterForm").hidden = true;
  const panel = document.getElementById("resultPanel");
  panel.hidden = false;
  const input = document.getElementById("generatedLink");
  input.value = url;
  document.getElementById("btnOpenPreview").href = url;
  incrementLetterCount();
  updateStats();
}

function resetForm() {
  document.getElementById("letterForm").reset();
  document.getElementById("letterForm").hidden = false;
  document.getElementById("resultPanel").hidden = true;
  document.getElementById("charCount").textContent = "0";
  document.getElementById("revealField").hidden = true;
}

function updateStats() {
  const el = document.getElementById("statLetters");
  if (el) el.textContent = String(getLetterCount());
}

document.addEventListener("DOMContentLoaded", () => {
  updateStats();

  ["btnHeroStart", "btnHeaderWrite"].forEach((id) => {
    document.getElementById(id)?.addEventListener("click", openModal);
  });

  document.getElementById("btnCloseModal")?.addEventListener("click", closeModal);

  document.getElementById("useReveal")?.addEventListener("change", (e) => {
    document.getElementById("revealField").hidden = !e.target.checked;
  });

  const textarea = document.querySelector('[name="message"]');
  const charCount = document.getElementById("charCount");
  textarea?.addEventListener("input", () => {
    charCount.textContent = String(textarea.value.length);
  });

  document.getElementById("letterForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    const data = getFormData(form);
    if (!data.toName || !data.message) return;

    if (data.revealAt && new Date(data.revealAt) <= new Date()) {
      alert("揭晓时间需要晚于现在，请重新选择。");
      return;
    }

    const url = buildLetterUrl(data);
    showResult(url);
  });

  document.getElementById("btnPreview")?.addEventListener("click", () => {
    const form = document.getElementById("letterForm");
    const data = getFormData(form);
    if (!data.toName || !data.message) {
      alert("请先填写称呼和想说的话，再预览。");
      return;
    }
    data.revealAt = null;
    window.open(buildLetterUrl(data), "_blank");
  });

  document.getElementById("btnCopy")?.addEventListener("click", async () => {
    const input = document.getElementById("generatedLink");
    try {
      await navigator.clipboard.writeText(input.value);
      const btn = document.getElementById("btnCopy");
      const orig = btn.textContent;
      btn.textContent = "已复制 ✓";
      setTimeout(() => (btn.textContent = orig), 2000);
    } catch {
      input.select();
      document.execCommand("copy");
    }
  });

  document.getElementById("btnWriteAnother")?.addEventListener("click", resetForm);

  document.getElementById("writeModal")?.addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeModal();
  });
});
