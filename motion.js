/*
  Mouvement du site. Quatre règles :
  1. Une seule vraie entrée en scène : l'accueil.
  2. Une section apparaît d'un seul geste (titre et texte ensemble), jamais élément par élément.
  3. Les photos ne bougent presque pas. Trois moments seulement ont leur propre mouvement,
     choisi pour ce qu'il raconte : les Saisons (le temps qui passe, de gauche à droite),
     le portrait de Fawn (un rideau) et la photo de l'atelier en bas (elle se pose lentement).
  4. Rien ne bouge si l'appareil demande moins d'animations.
*/
(() => {
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (id) => document.getElementById(id);
  const desk = matchMedia("(min-width: 901px)");

  /* Horloge vivante, heure de Paris (fonctionne même sans animations) */
  const clock = document.querySelector(".clock");
  if (clock) {
    const h = clock.querySelector(".ch"), m = clock.querySelector(".cm"), s = clock.querySelector(".cs");
    const fmt = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
    let secTurns = 0, lastSec = -1;
    const tick = () => {
      const p = fmt.formatToParts(new Date()).reduce((o, x) => ((o[x.type] = x.value), o), {});
      const hh = +p.hour % 24, mm = +p.minute, ss = +p.second;
      if (ss < lastSec) secTurns++;
      lastSec = ss;
      h.style.transform = `rotate(${(hh % 12) * 30 + mm * 0.5}deg)`;
      m.style.transform = `rotate(${mm * 6 + ss * 0.1}deg)`;
      s.style.transform = `rotate(${secTurns * 360 + ss * 6}deg)`;
      $("clockTxt").textContent = `${p.hour}:${p.minute}`;
    };
    tick(); setInterval(tick, 1000);
  }

  /* Bandeau de mots (le défilement lui-même est en CSS) */
  const words = ["Acrylique", "Aquarelle", "Sur mesure", "Pièces uniques", "Univers horlogers", "Paris"];
  const run = words.map((w, i) => `<span class="${i % 2 ? "it" : ""}">${w}</span><b class="dial"></b>`).join("");
  $("track").innerHTML = run + run + run + run;

  if (reduce || !("IntersectionObserver" in window)) return;
  root.classList.add("motion");

  /* Titres : découpe en lignes pour qu'elles montent l'une après l'autre */
  document.querySelectorAll(".hero h1, .intro h2, .about h2, .contact h2").forEach((t) => {
    t.innerHTML = t.innerHTML.split(/<br\s*\/?>/i)
      .map((l, i) => `<span class="line" style="--i:${i}"><span>${l.trim()}</span></span>`).join("");
  });

  /* Ce qui se révèle, et comment */
  const plan = [
    [".intro, .about-txt, .contact-txt", "text"],   // un bloc de texte entier
    [".steps li", "rise"],                           // les 4 étapes, en séquence
    [".formats", "draw"],                            // le trait se trace, les prix apparaissent
    [".seasons figure", "wipe"],                     // le temps passe, de gauche à droite
    [".about-img", "curtain"],                       // le portrait
    [".contact-img", "settle"],                      // l'atelier se pose
  ];
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    io.unobserve(e.target);
  }), { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

  for (const [sel, kind] of plan) {
    document.querySelectorAll(sel).forEach((el) => { el.classList.add("rv", `rv-${kind}`); io.observe(el); });
  }
  // décalage par colonne : une rangée se lit de gauche à droite, jamais en cascade sur toute la page
  const byColumn = (sel, step) => document.querySelectorAll(sel).forEach((el, i) => {
    el.style.setProperty("--d", `${(i % (desk.matches ? 4 : 2)) * step}s`);
  });
  byColumn(".steps li", 0.09);
  byColumn(".seasons figure", 0.16);

  /* Les vignettes chargées tard apparaissent en douceur au lieu de surgir d'un coup */
  document.querySelectorAll('img[loading="lazy"]').forEach((im) => {
    if (im.complete) return;
    im.classList.add("loading");
    const done = () => im.classList.remove("loading");
    im.addEventListener("load", done, { once: true });
    im.addEventListener("error", done, { once: true });
  });

  /* Ouverture de page : on n'attend pas les polices plus de 300 ms */
  let started = false;
  const start = () => { if (!started) { started = true; requestAnimationFrame(() => document.body.classList.add("ready")); } };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(start);
  setTimeout(start, 300);

  /* Défilement : barre de progression, en-tête qui se range, légère profondeur */
  const header = $("top"), bar = $("progress"), heroImg = document.querySelector(".hero-img img");
  const evens = [...document.querySelectorAll("#gallery > :nth-child(even)")], gal = $("gallery");
  let lastY = scrollY, ticking = false;
  const onScroll = () => {
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    if (!document.body.classList.contains("nav-open") && y !== lastY) header.classList.toggle("hide", y > lastY && y > innerHeight);
    lastY = y;
    if (heroImg && y < innerHeight * 1.2) heroImg.style.transform = `translate3d(0, ${y * (desk.matches ? 0.1 : 0.18)}px, 0)`;
    if (desk.matches) {
      // dans la galerie, une colonne sur deux glisse un peu moins vite : un relief discret
      const r = gal.getBoundingClientRect();
      if (r.bottom > 0 && r.top < innerHeight) {
        const p = (innerHeight - r.top) / (innerHeight + r.height);
        evens.forEach((el) => (el.style.transform = `translate3d(0, ${(0.5 - p) * 40}px, 0)`));
      }
    }
    ticking = false;
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  // après un saut vers une partie du site, l'en-tête reste visible comme sur une nouvelle page
  document.addEventListener("pagejump", () => {
    lastY = scrollY; header.classList.remove("hide");
    bar.classList.add("glide"); setTimeout(() => bar.classList.remove("glide"), 850);
  });
  desk.addEventListener("change", () => { evens.forEach((el) => (el.style.transform = "")); onScroll(); });
  onScroll();

  /* Curseur « Voir » sur les œuvres (souris uniquement) */
  if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const c = $("cursor");
    root.classList.add("has-cursor");
    let x = 0, y = 0, cx = 0, cy = 0, on = false, raf = 0;
    const follow = () => {
      cx += (x - cx) * 0.2; cy += (y - cy) * 0.2;
      c.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.3 || on ? requestAnimationFrame(follow) : 0;
    };
    addEventListener("mousemove", (e) => {
      x = e.clientX; y = e.clientY;
      if (!on) { cx = x; cy = y; }
      if (!raf) raf = requestAnimationFrame(follow);
    }, { passive: true });
    document.addEventListener("mouseover", (e) => {
      on = !!e.target.closest(".tile");
      c.classList.toggle("on", on);
      if (on && !raf) raf = requestAnimationFrame(follow);
    });
  }
})();
