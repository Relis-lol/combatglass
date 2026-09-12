import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const translations = JSON.parse(await readFile(join(root, "locales", "site.json"), "utf8"));
const locales = [
  ["en", "", "English"],
  ["de", "de", "Deutsch"],
  ["fr", "fr", "Français"],
  ["es-ES", "es", "Español"],
  ["pt-BR", "pt-br", "Português (Brasil)"],
  ["ru", "ru", "Русский"],
];
const baseUrl = "https://relis-lol.github.io/combatglass/";

function flatten(value, prefix = "") {
  return Object.entries(value).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return child && typeof child === "object" ? flatten(child, path) : [path];
  });
}

const canonicalKeys = flatten(translations.en).sort();
for (const [code] of locales) {
  const keys = flatten(translations[code]).sort();
  if (JSON.stringify(keys) !== JSON.stringify(canonicalKeys)) {
    throw new Error(`Translation key mismatch for ${code}`);
  }
  for (const key of keys) {
    const value = key.split(".").reduce((object, part) => object[part], translations[code]);
    if (typeof value !== "string" || value.trim() === "") {
      throw new Error(`Empty translation: ${code}.${key}`);
    }
    for (const marker of ["{{", "}}", "%{", "TODO", "PLACEHOLDER"]) {
      if (value.includes(marker)) throw new Error(`Unresolved marker in ${code}.${key}: ${marker}`);
    }
  }
}

const escape = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

function render(code, directory) {
  const t = translations[code];
  const prefix = directory ? "../" : "";
  const canonical = `${baseUrl}${directory ? `${directory}/` : ""}`;
  const alternates = locales.map(([alternateCode, alternateDirectory]) =>
    `  <link rel="alternate" hreflang="${alternateCode}" href="${baseUrl}${alternateDirectory ? `${alternateDirectory}/` : ""}">`
  ).join("\n");
  const options = locales.map(([optionCode, optionDirectory, label]) => {
    let value;
    if (!directory) value = optionDirectory ? `${optionDirectory}/` : "./";
    else if (!optionDirectory) value = "../";
    else value = optionDirectory === directory ? "./" : `../${optionDirectory}/`;
    return `<option data-code="${optionCode}" value="${value}"${optionCode === code ? " selected" : ""}>${escape(label)}</option>`;
  }).join("");
  const flow = t.flow.map((item) => `<article><span>${escape(item.label)}</span><h3>${escape(item.title)}</h3><p>${escape(item.body)}</p></article>`).join("");
  const trust = t.trust.cards.map((item, index) => `<article><div class="number">0${index + 1}</div><h3>${escape(item.title)}</h3><p>${escape(item.body)}</p></article>`).join("");
  const faq = t.faq.items.map((item) => `<details><summary>${escape(item.question)}</summary><p>${escape(item.answer)}</p></details>`).join("");
  return `<!doctype html>
<html lang="${code}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escape(t.meta.description)}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escape(t.meta.title)}">
  <meta property="og:description" content="${escape(t.meta.description)}">
  <meta property="og:url" content="${canonical}">
  <link rel="canonical" href="${canonical}">
${alternates}
  <link rel="alternate" hreflang="x-default" href="${baseUrl}">
  <title>${escape(t.meta.title)}</title>
  <link rel="icon" href="${prefix}assets/combatglass-mark.svg" type="image/svg+xml">
  <link rel="stylesheet" href="${prefix}styles.css">
</head>
<body data-default-route="${directory ? "false" : "true"}">
  <a class="skip" href="#main">${escape(t.nav.skip)}</a>
  <header class="topbar">
    <a class="brand" href="#top" aria-label="CombatGlass">
      <img src="${prefix}assets/combatglass-mark.svg" width="38" height="38" alt=""><span>CombatGlass</span>
    </a>
    <div class="header-actions"><nav aria-label="${escape(t.nav.aria)}"><a href="#trust">${escape(t.nav.trust)}</a><a href="#status">${escape(t.nav.status)}</a><a href="#faq">FAQ</a><a href="https://github.com/Relis-lol/combatglass">GitHub</a></nav><label class="language"><span>${escape(t.nav.language)}</span><select id="language-select" aria-label="${escape(t.nav.language)}">${options}</select></label></div>
  </header>
  <main id="main">
    <section class="hero" id="top">
      <div class="hero-copy"><div class="eyebrow">${escape(t.hero.eyebrow)}</div><h1>See the fight.<br><span>Touch nothing.</span></h1><p class="lede">${escape(t.hero.description)}</p><p class="positioning">${escape(t.hero.positioning)}</p><div class="trustline" aria-label="${escape(t.hero.promises_aria)}"><span>${escape(t.hero.local)}</span><span>${escape(t.hero.account)}</span><span>${escape(t.hero.telemetry)}</span><span>${escape(t.hero.free)}</span></div><div class="notice"><span aria-hidden="true"></span><strong>${escape(t.hero.preview)}</strong> — ${escape(t.hero.notice)}</div><div class="actions"><a class="button primary" href="#interface">${escape(t.hero.primary)}</a><a class="button" href="${prefix}PRIVACY.md">${escape(t.hero.privacy)}</a></div></div>
      <figure class="hero-product"><img src="${prefix}assets/product-preview.svg" alt="${escape(t.hero.image_alt)}"><figcaption><strong>Demo Mode</strong><span>${escape(t.hero.image_note)}</span></figcaption></figure>
    </section>
    <section class="interface" id="interface" aria-labelledby="interface-title"><div class="section-copy"><div class="eyebrow">${escape(t.interface.eyebrow)}</div><h2 id="interface-title">${escape(t.interface.title)}</h2><p>${escape(t.interface.body)}</p></div><div class="flow">${flow}</div></section>
    <section class="principles" id="trust" aria-labelledby="trust-title"><div class="section-copy"><div class="eyebrow">${escape(t.trust.eyebrow)}</div><h2 id="trust-title">${escape(t.trust.title)}</h2></div><div class="grid">${trust}</div></section>
    <section class="status" id="status" aria-labelledby="status-title"><div><div class="eyebrow">${escape(t.status.eyebrow)}</div><h2 id="status-title">${escape(t.status.title)}</h2><p>${escape(t.status.body)}</p></div><ol><li class="done"><span>01</span><div><strong>${escape(t.status.foundation)}</strong><small>${escape(t.status.foundation_note)}</small></div></li><li class="active"><span>02</span><div><strong>${escape(t.status.validation)}</strong><small>${escape(t.status.validation_note)}</small></div></li><li><span>03</span><div><strong>${escape(t.status.release)}</strong><small>${escape(t.status.release_note)}</small></div></li></ol></section>
    <section class="faq" id="faq" aria-labelledby="faq-title"><div class="section-copy"><div class="eyebrow">FAQ</div><h2 id="faq-title">${escape(t.faq.title)}</h2></div><div class="faq-list">${faq}</div></section>
    <section class="support-panel"><div><div class="eyebrow">${escape(t.support.eyebrow)}</div><h2>${escape(t.support.title)}</h2><p>${escape(t.support.body)}</p><p class="languages-note">${escape(t.support.languages)}</p></div><a class="button" href="https://github.com/Relis-lol/combatglass">${escape(t.support.action)}</a></section>
    <section class="legal-note"><strong>${escape(t.disclaimer.title)}</strong><p>${escape(t.disclaimer.body)}</p><a href="${prefix}DISCLAIMER.md">${escape(t.disclaimer.english_link)}</a></section>
  </main>
  <footer><span>${escape(t.footer.independent)}</span><span><a href="${prefix}SECURITY.md">${escape(t.footer.security)}</a><a href="${prefix}PRIVACY.md">${escape(t.footer.privacy)}</a><a href="${prefix}SUPPORT.md">${escape(t.footer.support)}</a></span></footer>
  <script src="${prefix}assets/language.js" defer></script>
</body>
</html>
`;
}

const checkOnly = process.argv.includes("--check");
for (const [code, directory] of locales) {
  const output = render(code, directory);
  const path = join(root, directory, "index.html");
  if (checkOnly) {
    const existing = await readFile(path, "utf8");
    if (existing !== output) throw new Error(`Generated page is stale: ${path}`);
  } else {
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, output, "utf8");
  }
}

console.log(checkOnly ? "Localized site pages are current." : "Localized site pages generated.");
