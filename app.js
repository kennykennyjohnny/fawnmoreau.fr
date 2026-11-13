/*
  Pour ajouter une œuvre : déposer l'image dans images/ (grande) et images/m/ (640 px de large),
  puis ajouter une ligne ci-dessous.  [nom-du-fichier, "Légende"]
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

const $ = (id) => document.getElementById(id);
const all = [];
const fig = ([file, cap]) => {
  const i = all.push({ file, cap }) - 1;
  return `<div role="listitem"><figure>
    <button type="button" class="tile" data-i="${i}" aria-label="Agrandir : ${cap}">
      <img src="images/m/${file}.jpg" alt="" loading="lazy">
    </button>
    <figcaption>${cap}</figcaption></figure></div>`;
};

$("gallery").innerHTML = OEUVRES.map(fig).join("");
$("seasons").innerHTML = SAISONS.map(fig).join("");
$("strip").innerHTML = CARNET.map(fig).join("");
$("year").textContent = new Date().getFullYear();

/* Visionneuse : fermeture par le bouton, Échap, le bouton retour du téléphone,
   un glissement vers le bas ou un tap à côté de l'image */
const lb = $("lightbox"), img = $("lbImg");
let cur = 0, lastFocus = null, isOpen = false;
const show = (i) => {
  cur = (i + all.length) % all.length;
  const idx = cur, full = new Image();
  img.src = `images/m/${all[idx].file}.jpg`;
  full.onload = () => { if (cur === idx) img.src = full.src; };
  full.src = `images/${all[idx].file}.jpg`;
  img.alt = `${all[cur].cap}, peinture de Fawn Moreau`;
  $("lbCap").textContent = all[cur].cap;
  $("lbCount").textContent = `${cur + 1} / ${all.length}`;
  [cur - 1, cur + 1].forEach((k) => { const j = (k + all.length) % all.length; new Image().src = `images/${all[j].file}.jpg`; });
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
  if (!fromHistory && history.state && history.state.lb) history.back();
  if (lastFocus) lastFocus.focus({ preventScroll: true });
};
addEventListener("popstate", () => close(true));
document.addEventListener("click", (e) => {
  const t = e.target.closest(".tile");
  if (t) open(+t.dataset.i, t);
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
  burger.setAttribute("aria-expanded", o);
  burger.setAttribute("aria-label", o ? "Fermer le menu" : "Ouvrir le menu");
  if (o) menu.querySelector("a").focus();
};
burger.onclick = () => setMenu(!document.body.classList.contains("nav-open"));
menu.addEventListener("click", (e) => { if (e.target.tagName === "A") setMenu(false); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && document.body.classList.contains("nav-open")) { setMenu(false); burger.focus(); } });
const header = $("top");
const onScroll = () => header.classList.toggle("solid", scrollY > innerHeight * 0.6);
addEventListener("scroll", onScroll, { passive: true }); onScroll();

