/* Animations du site. Tout est désactivé si l'appareil demande moins d'animations. */
(() => {
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (id) => document.getElementById(id);
  const isDesk = () => innerWidth > 900;

  /* Horloge vivante, heure de Paris (fonctionne même sans animations) */
  const clock = document.querySelector(".clock");
  if (clock) {
    const h = clock.querySelector(".ch"), m = clock.querySelector(".cm"), s = clock.querySelector(".cs");
    let secTurns = 0, lastSec = -1;
    const tick = () => {
      const p = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
        .formatToParts(new Date()).reduce((o, x) => ((o[x.type] = +x.value || x.value), o), {});
      const hh = +p.hour % 24, mm = +p.minute, ss = +p.second;
      if (ss < lastSec) secTurns++;
      lastSec = ss;
      h.style.transform = `rotate(${(hh % 12) * 30 + mm * 0.5}deg)`;
      m.style.transform = `rotate(${mm * 6 + ss * 0.1}deg)`;
      s.style.transform = `rotate(${secTurns * 360 + ss * 6}deg)`;
      $("clockTxt").textContent = `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
    };
    tick(); setInterval(tick, 1000);
  }

  /* Bandeau de mots */
  const words = ["Acrylique", "Aquarelle", "Sur mesure", "Pièces uniques", "Univers horlogers", "Paris"];
  const track = $("track");
  const run = words.map((w, i) => `<span class="${i % 2 ? "it" : ""}">${w}</span><b class="dial"></b>`).join("");
  track.innerHTML = run + run + run + run;

  if (reduce) { root.classList.add("still"); return; }
  root.classList.add("motion");

  /* Titres : découpe en lignes pour l'effet rideau */
  document.querySelectorAll(".hero h1, .intro h2, .about h2, .contact h2").forEach((h) => {
    const lines = h.innerHTML.split(/<br\s*\/?>/i);
    h.innerHTML = lines.map((l, i) => `<span class="line" style="--i:${i}"><span>${l.trim()}</span></span>`).join("");
    h.classList.add("rvh");
  });

  /* Éléments qui apparaissent au défilement */
  const fade = ".intro .kicker, .intro p:not(.kicker), .steps .n, .steps h3, .steps p, .formats, .about-txt p, .moments figcaption, .contact p, .contact .btn, .gallery figcaption, .seasons figcaption, .strip figcaption, .center .btn";
  const imgs = ".steps figure, .gallery figure, .seasons figure, .strip figure, .about-img, .moments figure, .contact-bg";
  document.querySelectorAll(fade).forEach((el) => el.classList.add("rv"));
  document.querySelectorAll(imgs).forEach((el) => el.classList.add("rvi"));
  document.querySelector(".about-img")?.classList.add("curtain");

  // léger décalage entre colonnes d'une même rangée
  const stagger = (sel, cols) => document.querySelectorAll(sel).forEach((el, i) => el.style.setProperty("--d", `${(i % cols()) * 0.06}s`));
  stagger(".steps li figure", () => (isDesk() ? 4 : 2));
  stagger(".gallery figure", () => (isDesk() ? 4 : 2));
  stagger(".seasons figure", () => (isDesk() ? 4 : 2));
  stagger(".strip figure", () => 3);
  stagger(".moments figure", () => 3);

  // une image masquée n'est jamais « visible » pour le navigateur : on surveille donc son conteneur
  const watched = new Map();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    const t = watched.get(e.target) || e.target;
    t.classList.add("in");
    if (t.classList.contains("formats")) countUp(t);
    io.unobserve(e.target);
  }), { rootMargin: "0px 0px -10% 0px", threshold: 0.01 });
  document.querySelectorAll(".rv, .rvi, .rvh").forEach((el) => {
    if (el.closest(".hero")) return;
    const w = el.classList.contains("rvi") ? el.parentElement : el;
    watched.set(w, el); io.observe(w);
  });

  /* Prix qui défilent jusqu'à leur valeur */
  function countUp(box) {
    box.querySelectorAll(".f-price").forEach((p, k) => {
      const target = parseInt(p.textContent, 10), t0 = performance.now() + k * 120, dur = 1400;
      const step = (t) => {
        const x = Math.min(1, Math.max(0, (t - t0) / dur)), e = 1 - Math.pow(1 - x, 4);
        p.textContent = `${Math.round(target * e)} €`;
        if (x < 1) requestAnimationFrame(step);
      };
      p.textContent = "0 €"; requestAnimationFrame(step);
    });
  }

  /* Ouverture de page */
  const start = () => requestAnimationFrame(() => document.body.classList.add("ready"));
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(start);
  setTimeout(start, 1200);

  /* Défilement : barre de progression, en-tête qui se range, profondeur, bandeau */
  const header = $("top"), bar = $("progress"), heroImg = document.querySelector(".hero-img img");
  const gal = $("gallery");
  let lastY = scrollY, vel = 0, mx = 0, ticking = false;
  const onScroll = () => {
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    const down = y > lastY;
    header.classList.toggle("hide", down && y > innerHeight && !document.body.classList.contains("nav-open"));
    vel += Math.min(40, Math.abs(y - lastY)) * 0.06;
    lastY = y;
    if (heroImg && y < innerHeight * 1.2) heroImg.style.transform = `translate3d(0, ${y * (isDesk() ? 0.12 : 0.28)}px, 0) scale(1.06)`;
    if (isDesk() && gal) {
      const r = gal.getBoundingClientRect();
      if (r.bottom > 0 && r.top < innerHeight) {
        const p = (innerHeight - r.top) / (innerHeight + r.height);
        gal.querySelectorAll(":scope > :nth-child(even)").forEach((el) => (el.style.transform = `translate3d(0, ${(0.5 - p) * 70}px, 0)`));
      }
    }
    ticking = false;
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  const loop = () => {
    vel *= 0.92;
    mx -= 0.45 + vel;
    const w = track.scrollWidth / 4;
    if (-mx >= w) mx += w;
    track.style.transform = `translate3d(${mx}px, 0, 0)`;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  /* Curseur « Voir » sur les œuvres (souris uniquement) */
  if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const c = $("cursor");
    root.classList.add("has-cursor");
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
    addEventListener("mousemove", (e) => { x = e.clientX; y = e.clientY; }, { passive: true });
    document.addEventListener("mouseover", (e) => c.classList.toggle("on", !!e.target.closest(".tile")));
    const follow = () => {
      cx += (x - cx) * 0.18; cy += (y - cy) * 0.18;
      c.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(follow);
    };
    requestAnimationFrame(follow);
  }
})();
