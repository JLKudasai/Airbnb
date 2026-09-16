(function () {
  "use strict";

  const AIRBNB_URL = "https://www.airbnb.fr/rooms/53414747";
  const TOTAL_PHOTOS = 46;
  const PHOTOS = Array.from({ length: TOTAL_PHOTOS }, (_, i) => `images/photo-${String(i + 1).padStart(2, "0")}.jpeg`);

  const AMENITIES = [
    { cat: { fr: "Vues panoramiques", en: "Views" }, items: [
      { fr: "Vue sur la baie", en: "Bay view", icon: "🌊" },
      { fr: "Vue sur la mer", en: "Sea view", icon: "🌊" },
      { fr: "Vue sur la vallée", en: "Valley view", icon: "🏞️" }
    ]},
    { cat: { fr: "Cuisine et salle à manger", en: "Kitchen & dining" }, items: [
      { fr: "Cuisine entièrement équipée", en: "Fully equipped kitchen", icon: "🍳" },
      { fr: "Réfrigérateur, congélateur", en: "Fridge, freezer", icon: "🧊" },
      { fr: "Four à micro-ondes, four", en: "Microwave, oven", icon: "🍽️" },
      { fr: "Cafetière filtre & Nespresso", en: "Filter coffee & Nespresso maker", icon: "☕" },
      { fr: "Bouilloire, grille-pain, verres à vin", en: "Kettle, toaster, wine glasses", icon: "🍷" },
      { fr: "Barbecue et ustensiles", en: "BBQ & utensils", icon: "🔥" },
      { fr: "Table à manger", en: "Dining table", icon: "🍴" }
    ]},
    { cat: { fr: "Chambre et linge", en: "Bedroom & laundry" }, items: [
      { fr: "Lave-linge gratuit", en: "Free washer", icon: "🧺" },
      { fr: "Linge de lit en coton égyptien", en: "Egyptian cotton linens", icon: "🛏️" },
      { fr: "Oreillers et couvertures supplémentaires", en: "Extra pillows & blankets", icon: "🛌" },
      { fr: "Fer à repasser, étendoir", en: "Iron, drying rack", icon: "🧷" },
      { fr: "Coffre-fort, moustiquaire", en: "Safe, mosquito net", icon: "🔒" },
      { fr: "Dressing, placard, armoire", en: "Closet & wardrobe space", icon: "🚪" }
    ]},
    { cat: { fr: "Salle de bain", en: "Bathroom" }, items: [
      { fr: "Sèche-cheveux", en: "Hair dryer", icon: "💨" },
      { fr: "Produits de bain 100% naturels", en: "100% natural bath products", icon: "🧴" },
      { fr: "Eau chaude, gel douche", en: "Hot water, shower gel", icon: "🚿" }
    ]},
    { cat: { fr: "Divertissement & confort", en: "Entertainment & comfort" }, items: [
      { fr: "TV HD avec Netflix, Prime Video", en: "HD TV with Netflix, Prime Video", icon: "📺" },
      { fr: "Système audio Bluetooth", en: "Bluetooth sound system", icon: "🔊" },
      { fr: "Tapis de yoga, livres", en: "Yoga mat, books", icon: "📚" },
      { fr: "Climatisation + ventilateur de plafond", en: "AC + ceiling fan", icon: "❄️" }
    ]},
    { cat: { fr: "Extérieur", en: "Outdoor" }, items: [
      { fr: "Patio / balcon privé, arrière-cour clôturée", en: "Private patio/balcony, fenced backyard", icon: "🌳" },
      { fr: "Mobilier extérieur, cuisine extérieure", en: "Outdoor furniture & kitchen", icon: "🪑" },
      { fr: "Chaises longues, matériel de plage", en: "Loungers & beach gear", icon: "🏖️" }
    ]},
    { cat: { fr: "Internet, sécurité & parking", en: "Internet, safety & parking" }, items: [
      { fr: "Wifi + espace de travail dédié", en: "Wifi + dedicated workspace", icon: "💻" },
      { fr: "Extincteur, trousse de premiers secours", en: "Fire extinguisher, first aid kit", icon: "🧯" },
      { fr: "2 places de parking gratuites sur place", en: "2 free on-site parking spots", icon: "🚗" },
      { fr: "Entrée privée, résidence protégée", en: "Private entrance, gated residence", icon: "🛡️" }
    ]},
    { cat: { fr: "Services", en: "Services" }, items: [
      { fr: "Séjours longue durée (28+ nuits)", en: "Long-term stays (28+ nights)", icon: "🗓️" },
      { fr: "Service de ménage disponible (supplément)", en: "Cleaning service available (extra fee)", icon: "🧹" },
      { fr: "Clés remises par l'hôte", en: "Keys handed over by host", icon: "🔑" }
    ]}
  ];

  const CATEGORY_TRANSLATIONS = {
    "propreté": "Cleanliness", "précision": "Accuracy", "arrivée": "Check-in",
    "communication": "Communication", "emplacement": "Location", "qualité-prix": "Value"
  };
  const RATING_BARS = [
    { fr: "Propreté", en: "Cleanliness", score: "5,0" },
    { fr: "Précision", en: "Accuracy", score: "5,0" },
    { fr: "Arrivée", en: "Check-in", score: "5,0" },
    { fr: "Communication", en: "Communication", score: "5,0" },
    { fr: "Emplacement", en: "Location", score: "5,0" },
    { fr: "Qualité-prix", en: "Value", score: "5,0" }
  ];

  let lang = localStorage.getItem("bs_lang") || "fr";

  function applyLang() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-fr][data-en]").forEach((el) => {
      el.textContent = lang === "fr" ? el.getAttribute("data-fr") : el.getAttribute("data-en");
    });
    document.querySelectorAll(".lang-fr").forEach((el) => el.classList.toggle("active", lang === "fr"));
    document.querySelectorAll(".lang-en").forEach((el) => el.classList.toggle("active", lang === "en"));
    document.querySelectorAll(".review-card").forEach((card) => {
      const idx = Number(card.getAttribute("data-idx"));
      const r = REVIEWS[idx];
      card.querySelector(".rc-text").textContent = r.text[lang];
      card.querySelector(".rc-date").textContent = r.date[lang];
      const metaEl = card.querySelector(".rc-meta");
      metaEl.textContent = metaLabel(r.meta);
      const stayEl = card.querySelector(".rc-stay");
      if (stayEl) stayEl.textContent = r.stay ? STAY_MAP[r.stay][lang] : "";
    });
    document.querySelectorAll(".rb-label").forEach((el) => {
      el.textContent = lang === "fr" ? el.getAttribute("data-fr") : el.getAttribute("data-en");
    });
    document.querySelectorAll(".amenity-item-label").forEach((el) => {
      el.textContent = lang === "fr" ? el.getAttribute("data-fr") : el.getAttribute("data-en");
    });
    document.querySelectorAll(".amenity-cat-title").forEach((el) => {
      el.textContent = lang === "fr" ? el.getAttribute("data-fr") : el.getAttribute("data-en");
    });
  }

  function metaLabel(meta) {
    if (meta.type === "location") return meta.text;
    return lang === "fr" ? `${meta.years} ans sur Airbnb` : `${meta.years} years on Airbnb`;
  }

  function setupLangToggle() {
    const btn = document.getElementById("lang-toggle");
    btn.addEventListener("click", () => {
      lang = lang === "fr" ? "en" : "fr";
      localStorage.setItem("bs_lang", lang);
      applyLang();
    });
  }

  function setupCTAs() {
    ["cta-header", "cta-hero", "cta-final", "cta-footer"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.href = AIRBNB_URL;
    });
  }

  function buildGallery() {
    const grid = document.getElementById("gallery-grid");
    const VISIBLE = 8;
    PHOTOS.forEach((src, i) => {
      const img = document.createElement("img");
      img.src = src;
      img.loading = "lazy";
      img.alt = `Bungalow Serenity — photo ${i + 1}`;
      img.addEventListener("click", () => openLightbox(i));
      if (i >= VISIBLE) img.classList.add("gallery-hidden");
      grid.appendChild(img);
    });
    const more = document.createElement("div");
    more.className = "g-more";
    more.textContent = `+${PHOTOS.length - VISIBLE}`;
    more.addEventListener("click", () => {
      document.querySelectorAll(".gallery-hidden").forEach((el) => el.classList.remove("gallery-hidden"));
      more.remove();
    });
    grid.appendChild(more);
  }

  let lbIndex = 0;
  function openLightbox(i) {
    lbIndex = i;
    updateLightbox();
    document.getElementById("lightbox").classList.add("open");
  }
  function updateLightbox() {
    document.getElementById("lightbox-img").src = PHOTOS[lbIndex];
    document.getElementById("lightbox-count").textContent = `${lbIndex + 1} / ${PHOTOS.length}`;
  }
  function setupLightbox() {
    document.getElementById("lightbox-close").addEventListener("click", () => document.getElementById("lightbox").classList.remove("open"));
    document.getElementById("lightbox").addEventListener("click", (e) => { if (e.target.id === "lightbox") e.currentTarget.classList.remove("open"); });
    document.getElementById("lightbox-prev").addEventListener("click", () => { lbIndex = (lbIndex - 1 + PHOTOS.length) % PHOTOS.length; updateLightbox(); });
    document.getElementById("lightbox-next").addEventListener("click", () => { lbIndex = (lbIndex + 1) % PHOTOS.length; updateLightbox(); });
    document.addEventListener("keydown", (e) => {
      if (!document.getElementById("lightbox").classList.contains("open")) return;
      if (e.key === "Escape") document.getElementById("lightbox").classList.remove("open");
      if (e.key === "ArrowLeft") { lbIndex = (lbIndex - 1 + PHOTOS.length) % PHOTOS.length; updateLightbox(); }
      if (e.key === "ArrowRight") { lbIndex = (lbIndex + 1) % PHOTOS.length; updateLightbox(); }
    });
  }

  function buildAmenities() {
    const grid = document.getElementById("amenities-grid");
    AMENITIES.forEach((cat) => {
      const div = document.createElement("div");
      div.className = "amenity-cat";
      const h3 = document.createElement("h3");
      h3.className = "amenity-cat-title";
      h3.setAttribute("data-fr", cat.cat.fr);
      h3.setAttribute("data-en", cat.cat.en);
      h3.textContent = cat.cat.fr;
      div.appendChild(h3);
      const ul = document.createElement("ul");
      cat.items.forEach((item) => {
        const li = document.createElement("li");
        const icoSpan = document.createElement("span");
        icoSpan.className = "a-ico";
        icoSpan.textContent = item.icon;
        const labelSpan = document.createElement("span");
        labelSpan.className = "amenity-item-label";
        labelSpan.setAttribute("data-fr", item.fr);
        labelSpan.setAttribute("data-en", item.en);
        labelSpan.textContent = item.fr;
        li.appendChild(icoSpan);
        li.appendChild(labelSpan);
        ul.appendChild(li);
      });
      div.appendChild(ul);
      grid.appendChild(div);
    });
  }

  function buildRatingBars() {
    const wrap = document.getElementById("rating-bars");
    RATING_BARS.forEach((r) => {
      const div = document.createElement("div");
      div.className = "rb-item";
      const label = document.createElement("span");
      label.className = "rb-label";
      label.setAttribute("data-fr", r.fr);
      label.setAttribute("data-en", r.en);
      label.textContent = r.fr;
      const score = document.createElement("span");
      score.className = "rb-score";
      score.textContent = r.score + " ★";
      div.appendChild(label);
      div.appendChild(score);
      wrap.appendChild(div);
    });
  }

  function initials(name) { return name.trim().charAt(0).toUpperCase(); }

  function buildReviewCard(review, idx) {
    const card = document.createElement("div");
    card.className = "review-card";
    card.setAttribute("data-idx", idx);

    const top = document.createElement("div");
    top.className = "rc-top";
    const avatar = document.createElement("div");
    avatar.className = "rc-avatar";
    avatar.textContent = initials(review.name);
    const nameWrap = document.createElement("div");
    const name = document.createElement("div");
    name.className = "rc-name";
    name.textContent = review.name;
    const meta = document.createElement("div");
    meta.className = "rc-meta";
    meta.textContent = metaLabel(review.meta);
    nameWrap.appendChild(name);
    nameWrap.appendChild(meta);
    top.appendChild(avatar);
    top.appendChild(nameWrap);

    const stars = document.createElement("div");
    stars.className = "rc-stars";
    stars.textContent = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);

    const text = document.createElement("p");
    text.className = "rc-text";
    text.textContent = review.text[lang];

    const date = document.createElement("span");
    date.className = "rc-date";
    date.textContent = review.date[lang];

    card.appendChild(top);
    card.appendChild(stars);
    card.appendChild(text);
    card.appendChild(date);

    card.addEventListener("click", () => card.classList.toggle("expanded"));
    return card;
  }

  function buildReviewsMarquee() {
    const track1 = document.getElementById("reviews-track-1");
    const track2 = document.getElementById("reviews-track-2");
    const half = Math.ceil(REVIEWS.length / 2);
    const set1 = REVIEWS.slice(0, half);
    const set2 = REVIEWS.slice(half);

    function fill(track, subset, offset) {
      // duplicate the set twice so the marquee can loop seamlessly
      for (let loop = 0; loop < 2; loop++) {
        subset.forEach((r, i) => track.appendChild(buildReviewCard(r, offset + i)));
      }
    }
    fill(track1, set1, 0);
    fill(track2, set2, half);
  }

  function initMap() {
    if (typeof L === "undefined") return;
    const coords = [18.065794, -63.134973];
    const map = L.map("map", { scrollWheelZoom: false }).setView(coords, 14);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(map);
    L.marker(coords).addTo(map);
  }

  function setupNav() {
    const toggle = document.getElementById("nav-toggle");
    const nav = document.getElementById("main-nav");
    toggle.addEventListener("click", () => nav.classList.toggle("open"));
    nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => nav.classList.remove("open")));
  }

  function setupHero() {
    document.getElementById("hero-media").style.backgroundImage = `url('${PHOTOS[0]}')`;
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("year").textContent = new Date().getFullYear();
    setupCTAs();
    setupHero();
    buildGallery();
    setupLightbox();
    buildAmenities();
    buildRatingBars();
    buildReviewsMarquee();
    initMap();
    setupNav();
    setupLangToggle();
    applyLang();
  });
})();
