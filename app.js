// Cadran-paysage peint en SVG, utilisé tant qu'aucune photo n'est fournie
function dial([sky, light, deep], seed = 1, big = false) {
  const r = (n) => { const x = Math.sin(seed * 9301 + n * 49297) * 233280; return x - Math.floor(x); };
  const id = "g" + Math.round(r(1) * 1e9);
  const peaks = (y, h, n) => {
    let d = `M 20 ${y}`;
    for (let i = 0; i <= n; i++) {
      const x = 20 + (160 / n) * i;
      const py = y - h * (0.35 + r(i + y) * 0.65) * (i % 2 ? 1 : 0.55);
      d += ` L ${x.toFixed(1)} ${py.toFixed(1)}`;
    }
    return d + " L 180 180 L 20 180 Z";
  };
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2;
    const r1 = i % 3 ? 74 : 70, r2 = 79;
    return `<line x1="${100 + Math.sin(a) * r1}" y1="${100 - Math.cos(a) * r1}" x2="${100 + Math.sin(a) * r2}" y2="${100 - Math.cos(a) * r2}" stroke="${light}" stroke-width="${i % 3 ? 1.2 : 2.6}" stroke-linecap="round" opacity=".9"/>`;
  }).join("");
  const hA = r(3) * 360, mA = r(4) * 360;
  return `
<svg viewBox="0 0 200 ${big ? 260 : 200}" xmlns="http://www.w3.org/2000/svg" role="img">
  <defs>
    <radialGradient id="${id}s" cx="50%" cy="30%" r="80%"><stop offset="0" stop-color="${light}"/><stop offset=".55" stop-color="${sky}"/><stop offset="1" stop-color="${deep}"/></radialGradient>
    <linearGradient id="${id}c" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#f4ead8"/><stop offset=".5" stop-color="#9a8a72"/><stop offset="1" stop-color="#3a3127"/></linearGradient>
    <clipPath id="${id}k"><circle cx="100" cy="100" r="80"/></clipPath>
  </defs>
  ${big ? `<rect x="78" y="4" width="44" height="26" rx="6" fill="${deep}" opacity=".85"/><rect x="78" y="170" width="44" height="86" rx="8" fill="${deep}" opacity=".85"/>` : ""}
  <circle cx="100" cy="100" r="92" fill="url(#${id}c)"/>
  <circle cx="100" cy="100" r="84" fill="${deep}"/>
  <g clip-path="url(#${id}k)">
    <rect x="0" y="0" width="200" height="200" fill="url(#${id}s)"/>
    <circle cx="${70 + r(5) * 60}" cy="${55 + r(6) * 20}" r="${8 + r(7) * 8}" fill="${light}" opacity=".85"/>
    <path d="${peaks(150, 70, 7)}" fill="${sky}" opacity=".55"/>
    <path d="${peaks(165, 60, 5)}" fill="${deep}" opacity=".85"/>
    <path d="M20 172 Q 100 ${155 + r(8) * 10} 180 172 L180 190 L20 190Z" fill="${light}" opacity=".25"/>
  </g>
  ${ticks}
  <g stroke="${light}" stroke-linecap="round">
    <line x1="100" y1="100" x2="${100 + Math.sin(hA * Math.PI / 180) * 40}" y2="${100 - Math.cos(hA * Math.PI / 180) * 40}" stroke-width="4"/>
    <line x1="100" y1="100" x2="${100 + Math.sin(mA * Math.PI / 180) * 62}" y2="${100 - Math.cos(mA * Math.PI / 180) * 62}" stroke-width="2.4"/>
  </g>
  <circle cx="100" cy="100" r="4" fill="${light}"/>
  <rect x="188" y="94" width="8" height="12" rx="2" fill="url(#${id}c)"/>
</svg>`;
}

const IG = (p) => `https://www.instagram.com/fawnmoreau/${p}/`;
const visual = (w, i) =>
  w.img
    ? `<img src="${w.img}" alt="${w.title} — peinture de Fawn Moreau" loading="lazy">`
    : `<div class="dial">${dial(w.palette, i + 3)}</div>`;

const badge = { dispo: "Disponible", vendu: "Vendue", commande: "Commande" };

document.getElementById("gridUnivers").innerHTML = UNIVERS.map((w, i) => `
  <a class="card" href="${IG(w.ig)}" target="_blank" rel="noopener">
    <div class="frame" style="--bg:${w.palette[2]}">${visual(w, i)}
      ${w.status ? `<span class="badge ${w.status}">${badge[w.status]}</span>` : ""}
    </div>
    <h3>${w.title}</h3>
    <p>${[w.tech, w.format].filter(Boolean).join(" · ")}</p>
  </a>`).join("");

document.getElementById("seasons").innerHTML = SAISONS.map((w, i) => `
  <a class="season" href="${IG(w.ig)}" target="_blank" rel="noopener" style="--bg:${w.palette[2]}">
    ${visual(w, i + 40)}
    <span>${w.title}</span>
  </a>`).join("");

document.getElementById("carnetList").innerHTML = CARNET.map(([name, ig], i) => `
  <a class="page" href="${IG(ig)}" target="_blank" rel="noopener">
    <span class="num">${String(i + 1).padStart(2, "0")}</span>
    <span class="name">${name}</span>
    <span class="arrow">↗</span>
  </a>`).join("");

document.getElementById("heroArt").innerHTML = dial(["#2c4a6e", "#f1e3c8", "#0d1626"], 7, true);
document.getElementById("year").textContent = new Date().getFullYear();

// Menu mobile
const burger = document.getElementById("burger"), links = document.getElementById("links");
burger.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  burger.setAttribute("aria-expanded", open);
});
links.addEventListener("click", (e) => { if (e.target.tagName === "A") links.classList.remove("open"); });
addEventListener("scroll", () => document.getElementById("nav").classList.toggle("scrolled", scrollY > 30));

// Apparition douce
const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")), { threshold: 0.12 });
document.querySelectorAll(".section, .card, .season").forEach((el) => io.observe(el));
