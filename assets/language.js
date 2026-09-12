(() => {
  const selector = document.getElementById("language-select");
  if (!selector) return;

  const storageKey = "combatglass.language";
  const supported = ["en", "de", "fr", "es-ES", "pt-BR", "ru"];
  const normalize = (locale) => {
    const value = String(locale || "").replace("_", "-").toLowerCase();
    if (value === "pt-br" || value.startsWith("pt-br-")) return "pt-BR";
    if (value === "de" || value.startsWith("de-")) return "de";
    if (value === "fr" || value.startsWith("fr-")) return "fr";
    if (value === "es" || value.startsWith("es-")) return "es-ES";
    if (value === "ru" || value.startsWith("ru-")) return "ru";
    return "en";
  };
  const routeFor = (code) => selector.querySelector(`option[data-code="${code}"]`)?.value;

  selector.addEventListener("change", () => {
    const code = selector.selectedOptions[0]?.dataset.code;
    if (!supported.includes(code)) return;
    try { localStorage.setItem(storageKey, code); } catch {}
    window.location.assign(selector.value);
  });

  if (document.body.dataset.defaultRoute !== "true") return;
  let choice;
  try { choice = localStorage.getItem(storageKey); } catch {}
  if (!supported.includes(choice)) {
    choice = (navigator.languages || [navigator.language]).map(normalize).find((code) => code !== "en") || "en";
  }
  if (choice !== "en") {
    const route = routeFor(choice);
    if (route) window.location.replace(route);
  }
})();
