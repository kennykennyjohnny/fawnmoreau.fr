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
const fig = ([file, cap], cls = "") => {
  const i = all.push({ file, cap }) - 1;
  return `<figure class="${cls}" data-i="${i}" tabindex="0">
    <img src="images/m/${file}.jpg" alt="${cap}, peinture de Fawn Moreau" loading="lazy">
    <figcaption>${cap}</figcaption></figure>`;
};

$("gallery").innerHTML = OEUVRES.map((o) => fig(o)).join("");
$("seasons").innerHTML = SAISONS.map((o) => fig(o)).join("");
$("strip").innerHTML = CARNET.map((o) => fig(o)).join("");
$("year").textContent = new Date().getFullYear();

/* Visionneuse */
const lb = $("lightbox");
let cur = 0;
const show = (i) => {
  cur = (i + all.length) % all.length;
  $("lbImg").src = `images/${all[cur].file}.jpg`;
  $("lbImg").alt = all[cur].cap;
  $("lbCap").textContent = all[cur].cap;
};
const open = (i) => { show(i); lb.classList.add("on"); lb.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; };
const close = () => { lb.classList.remove("on"); lb.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; };
document.addEventListener("click", (e) => { const f = e.target.closest("figure[data-i]"); if (f) open(+f.dataset.i); });
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") { const f = document.activeElement.closest?.("figure[data-i]"); if (f) open(+f.dataset.i); }
  if (!lb.classList.contains("on")) return;
  if (e.key === "Escape") close();
  if (e.key === "ArrowRight") show(cur + 1);
  if (e.key === "ArrowLeft") show(cur - 1);
});
$("lbClose").onclick = close;
$("lbNext").onclick = () => show(cur + 1);
$("lbPrev").onclick = () => show(cur - 1);
lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
let x0 = null;
lb.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
lb.addEventListener("touchend", (e) => {
  if (x0 === null) return;
  const dx = e.changedTouches[0].clientX - x0;
  if (Math.abs(dx) > 40) show(cur + (dx < 0 ? 1 : -1));
  x0 = null;
});

/* Menu */
const burger = $("burger"), menu = $("menu");
burger.onclick = () => { const o = document.body.classList.toggle("nav-open"); burger.setAttribute("aria-expanded", o); };
menu.addEventListener("click", (e) => { if (e.target.tagName === "A") document.body.classList.remove("nav-open"); });
const header = $("top");
const onScroll = () => header.classList.toggle("solid", scrollY > innerHeight * 0.6);
addEventListener("scroll", onScroll, { passive: true }); onScroll();

/* Apparition douce */
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
document.querySelectorAll(".intro, .steps li, .gallery figure, .seasons figure, .about, .moments figure, .formats").forEach((el) => io.observe(el));
