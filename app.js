/*
  Pour ajouter une œuvre : déposer l'image (1000 px de large, en .jpg) dans images/,
  lancer « python3 outils/images.py », puis ajouter une ligne ci-dessous.  [nom-du-fichier, "Légende"]
*/
const OEUVRES = [
  ["oeuvre-reverso-ocean", "Reverso, l'océan"],
  ["oeuvre-planete", "La Terre"],
  ["oeuvre-disco", "Disco"],
  ["oeuvre-squelette-or", "Squelette d'or"],
  ["oeuvre-eclat", "Cristaux"],
  ["oeuvre-orange", "Ciel d'or"],
  ["oeuvre-serpent", "Nuit"],
  ["oeuvre-nuage-rose", "Nuage rose"],
  ["oeuvre-nautilus-rose", "Or rose"],
  ["portrait-oeuvre", "Petit format"],
  ["process-fleurs", "En cours, fleurs de cerisier"],
  ["portrait-automne", "Automne"],
];

const SAISONS = [
  ["saison-printemps", "Printemps"],
  ["saison-ete", "Été"],
  ["saison-automne", "Automne"],
  ["saison-hiver", "Hiver"],
];

const CARNET = [
  ["carnet-van-cleef", "Van Cleef & Arpels"],
  ["carnet-fp-journe", "F.P. Journe"],
  ["carnet-hermes", "Hermès"],
  ["carnet-voutilainen", "Voutilainen"],
  ["carnet-vacheron", "Vacheron Constantin"],
  ["carnet-commande-bleue", "Commande, aquarelle"],
];

/* Actualiser la page ramène toujours en haut.
   Sans ça, le téléphone rouvre la page là où on était, ou saute à l'ancre
   restée dans l'adresse (#contact après un tap sur « Commander »). */
const navEntry = performance.getEntriesByType && performance.getEntriesByType("navigation")[0];
const cleanUrl = () => history.replaceState(null, "", location.pathname + location.search);
const toTop = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" });
if (navEntry && navEntry.type === "reload") {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  if (location.hash) cleanUrl();
  toTop();
  addEventListener("load", toTop);
}
const $ = (id) => document.getElementById(id);
const webp = (file) => [400, 640, 1000].map((w) => `images/w/${file}-${w}.webp ${w}w`).join(", ");
const COLLECTIONS = {
  gallery: { name: "Œuvres", items: OEUVRES, sizes: "(max-width:900px) 46vw, 23vw" },
  seasons: { name: "Les Quatre Saisons", items: SAISONS, sizes: "(max-width:900px) 46vw, 23vw" },
  strip: { name: "Carnet", items: CARNET, sizes: "(max-width:900px) 68vw, 20vw" },
};
for (const [id, c] of Object.entries(COLLECTIONS)) {
  $(id).innerHTML = c.items.map(([file, cap], i) => `<div role="listitem"><figure>
    <button type="button" class="tile" data-c="${id}" data-i="${i}" aria-label="Agrandir : ${cap}">
      <picture><source type="image/webp" srcset="${webp(file)}" sizes="${c.sizes}"><img src="images/m/${file}.jpg" alt="" loading="lazy" decoding="async"></picture>
    </button>
    <figcaption>${cap}</figcaption></figure></div>`).join("");
}
$("year").textContent = new Date().getFullYear();

/* Visionneuse : fermeture par le bouton, Échap, le bouton retour du téléphone,
   un glissement vers le bas ou un tap à côté de l'image */
const lb = $("lightbox"), img = $("lbImg");
let col = COLLECTIONS.gallery, cur = 0, lastFocus = null, isOpen = false;
const big = (file) => `images/w/${file}-1000.webp`;
const show = (i) => {
  const list = col.items;
  cur = (i + list.length) % list.length;
  const idx = cur, [file, cap] = list[idx], full = new Image();
  img.src = `images/w/${file}-640.webp`;
  full.onload = () => { if (cur === idx && isOpen) img.src = full.src; };
  full.src = big(file);
  img.alt = `${cap}, ${col === COLLECTIONS.strip ? "aquarelle" : "peinture"} de Fawn Moreau`;
  $("lbCap").textContent = cap;
  $("lbCount").textContent = `${col.name} · ${cur + 1} / ${list.length}`;
  [cur - 1, cur + 1].forEach((k) => { new Image().src = big(list[(k + list.length) % list.length][0]); });
};
const open = (i, trigger) => {
  lastFocus = trigger || document.activeElement;
  const thumb = trigger && trigger.querySelector("img");
  const from = thumb && thumb.getBoundingClientRect();
  show(i);
  lb.hidden = false;
  requestAnimationFrame(() => {
    const to = img.getBoundingClientRect();
    if (from && to.width && document.documentElement.classList.contains("motion")) {
      img.style.transition = "none";
      img.style.transformOrigin = "0 0";
      img.style.transform = `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width})`;
      img.getBoundingClientRect();
      img.style.transition = "transform .7s cubic-bezier(.2,.8,.2,1)";
      img.style.transform = "";
      img.addEventListener("transitionend", () => { img.style.transition = ""; img.style.transformOrigin = ""; }, { once: true });
    }
    lb.classList.add("on");
  });
  document.body.classList.add("lb-open");
  isOpen = true;
  history.pushState({ lb: true }, "");
  $("lbClose").focus();
};
const close = (fromHistory = false) => {
  if (!isOpen) return;
  isOpen = false;
  lb.classList.remove("on");
  img.style.transform = ""; img.style.opacity = "0";
  document.body.classList.remove("lb-open");
  setTimeout(() => { if (!isOpen) { lb.hidden = true; img.style.opacity = ""; } }, 350);
  if (!fromHistory && history.state && history.state.lb) { skipPop = true; history.back(); }
  if (lastFocus) lastFocus.focus({ preventScroll: true });
};
let skipPop = false;
addEventListener("popstate", (e) => {
  if (isOpen) return close(true);
  if (skipPop) { skipPop = false; return; }
  if (e.state && typeof e.state.y === "number") go(e.state.y, null);
});
document.addEventListener("click", (e) => {
  const t = e.target.closest(".tile");
  if (t) { col = COLLECTIONS[t.dataset.c]; open(+t.dataset.i, t); }
});
$("lbClose").addEventListener("click", () => close());
$("lbNext").addEventListener("click", () => show(cur + 1));
$("lbPrev").addEventListener("click", () => show(cur - 1));
lb.addEventListener("click", (e) => {
  if (e.target === lb || e.target.id === "lbStage" || e.target.classList.contains("lb-nav")) close();
});
document.addEventListener("keydown", (e) => {
  if (!isOpen) return;
  if (e.key === "Escape") { e.preventDefault(); close(); }
  else if (e.key === "ArrowRight") show(cur + 1);
  else if (e.key === "ArrowLeft") show(cur - 1);
  else if (e.key === "Tab") {
    const f = [$("lbClose"), $("lbPrev"), $("lbNext")];
    const k = f.indexOf(document.activeElement);
    e.preventDefault();
    f[(k + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
  }
});
let t0 = null;
lb.addEventListener("touchstart", (e) => { t0 = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }, { passive: true });
lb.addEventListener("touchmove", (e) => {
  if (!t0) return;
  const dy = e.touches[0].clientY - t0.y, dx = e.touches[0].clientX - t0.x;
  if (dy > 0 && Math.abs(dy) > Math.abs(dx)) { img.style.transform = `translateY(${dy}px)`; img.style.opacity = Math.max(0.3, 1 - dy / 400); }
}, { passive: true });
lb.addEventListener("touchend", (e) => {
  if (!t0) return;
  const dx = e.changedTouches[0].clientX - t0.x, dy = e.changedTouches[0].clientY - t0.y;
  img.style.transform = ""; img.style.opacity = "";
  if (dy > 90 && Math.abs(dy) > Math.abs(dx)) close();
  else if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(cur + (dx < 0 ? 1 : -1));
  t0 = null;
});

/* Menu */
const burger = $("burger"), menu = $("menu");
const setMenu = (o) => {
  document.body.classList.toggle("nav-open", o);
  if (o) $("top").classList.remove("hide");
  burger.setAttribute("aria-expanded", o);
  burger.setAttribute("aria-label", o ? "Fermer le menu" : "Ouvrir le menu");
  if (o) menu.querySelector("a").focus();
};
burger.onclick = () => setMenu(!document.body.classList.contains("nav-open"));
menu.addEventListener("click", (e) => { const a = e.target.closest("a"); if (a && !a.getAttribute("href").startsWith("#")) setMenu(false); });
matchMedia("(min-width: 901px)").addEventListener("change", (m) => { if (m.matches) setMenu(false); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && document.body.classList.contains("nav-open")) { setMenu(false); burger.focus(); } });
const header = $("top");
const onScroll = () => header.classList.toggle("solid", scrollY > innerHeight * 0.6);
addEventListener("scroll", onScroll, { passive: true }); onScroll();


/* Navigation : chaque partie s'ouvre comme une page à part, et l'en-tête reste en place.
   Une goutte d'aquarelle s'étale depuis l'endroit touché et recouvre le contenu
   (lavis bleu nuit ou sépia selon la destination), on saute directement à la partie,
   puis le lavis s'efface pendant que la nouvelle partie apparaît. Le tout dure 0,6 s.
   Le retour arrière ramène d'où l'on vient. */
const still = matchMedia("(prefers-reduced-motion: reduce)");
let bloom = false;
// la taille de la goutte doit pouvoir s'animer ; sinon, simple fondu
try { CSS.registerProperty({ name: "--s", syntax: "<length>", inherits: false, initialValue: "0px" }); bloom = true; } catch (err) { bloom = false; }
const veil = document.createElement("div");
veil.className = "veil";
veil.setAttribute("aria-hidden", "true");
document.body.appendChild(veil);
addEventListener("load", () => ["lavis-clair", "lavis-nuit", "goutte"].forEach((n) => { new Image().src = `images/${n}.webp`; }), { once: true });
let busy = false;

const topOf = (el) => Math.min(Math.round(el.getBoundingClientRect().top + scrollY), document.documentElement.scrollHeight - innerHeight);
const isDark = (el) => {
  const m = getComputedStyle(el).backgroundColor.match(/[\d.]+/g);
  return !!m && !(m[3] !== undefined && +m[3] === 0) && +m[0] + +m[1] + +m[2] < 200;
};
const land = (y, target) => {
  window.scrollTo({ top: y, left: 0, behavior: "instant" });
  document.dispatchEvent(new CustomEvent("pagejump"));
  if (target) { target.setAttribute("tabindex", "-1"); target.focus({ preventScroll: true }); }
};
const phase = (name) => new Promise((done) => {
  veil.addEventListener("animationend", done, { once: true });
  veil.dataset.phase = name;
});
// le menu du téléphone se ferme d'un coup, caché sous le lavis
const shutMenu = () => {
  if (!document.body.classList.contains("nav-open")) return;
  menu.style.transition = "none";
  setMenu(false);
  requestAnimationFrame(() => requestAnimationFrame(() => { menu.style.transition = ""; }));
};
async function go(y, target, from) {
  if (busy) return;
  const inMenu = document.body.classList.contains("nav-open");
  if (still.matches) { shutMenu(); return land(y, target); }
  busy = true;
  veil.classList.toggle("over", inMenu);
  const x = from ? from.x : innerWidth / 2, yy = from ? from.y : innerHeight / 2;
  // la goutte doit couvrir l'écran entier, jusqu'au coin le plus éloigné (son bord le plus creux, flou compris, est à 34 % de sa taille)
  const far = Math.max(Math.hypot(x, yy), Math.hypot(innerWidth - x, yy), Math.hypot(x, innerHeight - yy), Math.hypot(innerWidth - x, innerHeight - yy));
  veil.style.setProperty("--x", `${x}px`);
  veil.style.setProperty("--y", `${yy}px`);
  veil.style.setProperty("--full", `${Math.ceil(far / 0.34)}px`);
  veil.classList.toggle("nuit", isDark(target || document.querySelector(".hero")));
  veil.classList.toggle("fade", !bloom);
  $("top").classList.add("solid");
  $("top").classList.remove("hide");
  await phase("in");
  shutMenu();
  land(y, target);
  if (target) { target.classList.add("arrive"); setTimeout(() => target.classList.remove("arrive"), 1400); }
  await phase("out");
  delete veil.dataset.phase;
  veil.classList.remove("over");
  busy = false;
}

document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#"], #logo');
  if (!a || a.classList.contains("skip") || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const id = a.id === "logo" ? "" : a.getAttribute("href").slice(1);
  const target = id ? document.getElementById(id) : null;
  if (id && !target) return;
  e.preventDefault();
  const y = target ? topOf(target) : 0;
  if (Math.abs(y - scrollY) < 2) return;
  history.replaceState({ ...(history.state || {}), y: Math.round(scrollY) }, "");
  history.pushState({ y }, "");
  // les images de la destination se chargent pendant que la goutte s'étale, pour qu'elles soient là à l'arrivée
  if (target) target.querySelectorAll('img[loading="lazy"]').forEach((im) => { im.loading = "eager"; });
  const r = a.getBoundingClientRect();
  // la goutte part du doigt (ou du centre du lien au clavier)
  go(y, target, e.detail ? { x: e.clientX, y: e.clientY } : { x: r.left + r.width / 2, y: r.top + r.height / 2 });
});
