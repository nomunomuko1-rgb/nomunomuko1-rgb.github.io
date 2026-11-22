document.addEventListener("DOMContentLoaded", () => {
  // 1. Character counter for prompt buffers
  document.querySelectorAll("[data-count-target]").forEach((el) => {
    const target = document.getElementById(el.dataset.countTarget);
    if (target) {
      el.textContent = `${target.textContent.trim().length} CHARS`;
    }
  });

  // 2. Copy buttons
  document.querySelectorAll(".js-z-copy").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.copyTarget;
      const target = document.getElementById(targetId);
      if (!target) return;
      const text = target.innerText.trim();
      const orig = btn.dataset.origLabel || btn.textContent;
      btn.dataset.origLabel = orig;

      const onSuccess = () => {
        btn.textContent = "COPIED ✓";
        btn.classList.add("copied");
        setTimeout(() => {
          btn.textContent = orig;
          btn.classList.remove("copied");
        }, 2000);
      };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(onSuccess).catch(() => fallbackCopy(text, onSuccess));
      } else {
        fallbackCopy(text, onSuccess);
      }
    });
  });

  // 3. Tabs (for pages with All-ages / R-18 switch)
  document.querySelectorAll("[data-tab-group]").forEach((group) => {
    const buttons = group.querySelectorAll(".z-tab");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const panelId = btn.dataset.panel;
        buttons.forEach((b) => b.classList.toggle("active", b === btn));
        const root = group.closest(".z-win") || document;
        root.querySelectorAll(".z-panel").forEach((p) => {
          p.classList.toggle("active", p.id === panelId);
        });
      });
    });
  });
});

function fallbackCopy(text, onSuccess) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.top = "-9999px";
  ta.style.left = "-9999px";
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand("copy");
    onSuccess();
  } catch (e) {
    console.error("Copy failed", e);
  }
  document.body.removeChild(ta);
}
