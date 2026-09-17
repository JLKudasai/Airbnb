(function () {
  "use strict";

  const AIRBNB_URL = "https://www.airbnb.fr/rooms/53414747";
  const SVG_NS = "http://www.w3.org/2000/svg";

  function buildIcon(name, extraClass) {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", "icon " + (extraClass || ""));
    const use = document.createElementNS(SVG_NS, "use");
    use.setAttributeNS("http://www.w3.org/1999/xlink", "href", "images/icons.svg#" + name);
    use.setAttribute("href", "images/icons.svg#" + name);
    svg.appendChild(use);
    return svg;
  }

  const TOTAL_PHOTOS = 46;
  const PHOTOS = Array.from({ length: TOTAL_PHOTOS }, (_, i) => `images/photo-${String(i + 1).padStart(2, "0")}.jpeg`);

  const ICON_ANIM = {
    "ic-wave": "icon-sway", "ic-valley": "icon-float", "ic-pan": "icon-float", "ic-fridge": "icon-float",
    "ic-oven": "icon-float", "ic-coffee": "icon-float", "ic-wine": "icon-float", "ic-fire": "icon-flicker",
    "ic-cutlery": "icon-float", "ic-basket": "icon-float", "ic-bed": "icon-float", "ic-pillow": "icon-float",
    "ic-iron": "icon-wiggle", "ic-lock": "icon-float", "ic-door": "icon-float", "ic-hairdryer": "icon-wiggle",
    "ic-bottle": "icon-float", "ic-shower": "icon-float", "ic-tv": "icon-float", "ic-speaker": "icon-pulse",
    "ic-books": "icon-float", "ic-snow": "icon-spin-slow", "ic-tree": "icon-sway", "ic-chair": "icon-float",
    "ic-umbrella": "icon-sway", "ic-wifi": "icon-pulse", "ic-extinguisher": "icon-float", "ic-car": "icon-float",
    "ic-shield": "icon-wiggle", "ic-calendar": "icon-float", "ic-broom": "icon-wiggle", "ic-key": "icon-bob"
  };

  const AMENITIES = [
    { cat: { fr: "Vues panoramiques", en: "Views" }, items: [
      { fr: "Vue sur la baie", en: "Bay view", icon: "ic-wave" },
      { fr: "Vue sur la mer", en: "Sea view", icon: "ic-wave" },
      { fr: "Vue sur la vallée", en: "Valley view", icon: "ic-valley" }
    ]},
    { cat: { fr: "Cuisine et salle à manger", en: "Kitchen & dining" }, items: [
      { fr: "Cuisine entièrement équipée", en: "Fully equipped kitchen", icon: "ic-pan" },
      { fr: "Réfrigérateur, congélateur", en: "Fridge, freezer", icon: "ic-fridge" },
      { fr: "Four à micro-ondes, four", en: "Microwave, oven", icon: "ic-oven" },
      { fr: "Cafetière filtre & Nespresso", en: "Filter coffee & Nespresso maker", icon: "ic-coffee" },
      { fr: "Bouilloire, grille-pain, verres à vin", en: "Kettle, toaster, wine glasses", icon: "ic-wine" },
      { fr: "Barbecue et ustensiles", en: "BBQ & utensils", icon: "ic-fire" },
      { fr: "Table à manger", en: "Dining table", icon: "ic-cutlery" }
    ]},
    { cat: { fr: "Chambre et linge", en: "Bedroom & laundry" }, items: [
      { fr: "Lave-linge gratuit", en: "Free washer", icon: "ic-basket" },
      { fr: "Linge de lit en coton égyptien", en: "Egyptian cotton linens", icon: "ic-bed" },
      { fr: "Oreillers et couvertures supplémentaires", en: "Extra pillows & blankets", icon: "ic-pillow" },
      { fr: "Fer à repasser, étendoir", en: "Iron, drying rack", icon: "ic-iron" },
      { fr: "Coffre-fort, moustiquaire", en: "Safe, mosquito net", icon: "ic-lock" },
      { fr: "Dressing, placard, armoire", en: "Closet & wardrobe space", icon: "ic-door" }
    ]},
    { cat: { fr: "Salle de bain", en: "Bathroom" }, items: [
      { fr: "Sèche-cheveux", en: "Hair dryer", icon: "ic-hairdryer" },
      { fr: "Produits de bain 100% naturels", en: "100% natural bath products", icon: "ic-bottle" },
      { fr: "Eau chaude, gel douche", en: "Hot water, shower gel", icon: "ic-shower" }
    ]},
    { cat: { fr: "Divertissement & confort", en: "Entertainment & comfort" }, items: [
      { fr: "TV HD avec Netflix, Prime Video", en: "HD TV with Netflix, Prime Video", icon: "ic-tv" },
      { fr: "Système audio Bluetooth", en: "Bluetooth sound system", icon: "ic-speaker" },
      { fr: "Tapis de yoga, livres", en: "Yoga mat, books", icon: "ic-books" },
      { fr: "Climatisation + ventilateur de plafond", en: "AC + ceiling fan", icon: "ic-snow" }
    ]},
    { cat: { fr: "Extérieur", en: "Outdoor" }, items: [
      { fr: "Patio / balcon privé, arrière-cour clôturée", en: "Private patio/balcony, fenced backyard", icon: "ic-tree" },
      { fr: "Mobilier extérieur, cuisine extérieure", en: "Outdoor furniture & kitchen", icon: "ic-chair" },
      { fr: "Chaises longues, matériel de plage", en: "Loungers & beach gear", icon: "ic-umbrella" }
    ]},
    { cat: { fr: "Internet, sécurité & parking", en: "Internet, safety & parking" }, items: [
      { fr: "Wifi + espace de travail dédié", en: "Wifi + dedicated workspace", icon: "ic-wifi" },
      { fr: "Extincteur, trousse de premiers secours", en: "Fire extinguisher, first aid kit", icon: "ic-extinguisher" },
      { fr: "2 places de parking gratuites sur place", en: "2 free on-site parking spots", icon: "ic-car" },
      { fr: "Entrée privée, résidence protégée", en: "Private entrance, gated residence", icon: "ic-shield" }
    ]},
    { cat: { fr: "Services", en: "Services" }, items: [
      { fr: "Séjours longue durée (28+ nuits)", en: "Long-term stays (28+ nights)", icon: "ic-calendar" },
      { fr: "Service de ménage disponible (supplément)", en: "Cleaning service available (extra fee)", icon: "ic-broom" },
      { fr: "Clés remises par l'hôte", en: "Keys handed over by host", icon: "ic-key" }
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
      const item = document.createElement("div");
      item.className = "g-item reveal";
      const img = document.createElement("img");
      img.src = src;
      img.loading = "lazy";
      img.alt = `Bungalow Serenity — photo ${i + 1}`;
      const zoom = document.createElement("span");
      zoom.className = "g-zoom";
      zoom.appendChild(buildIcon("ic-zoom", "icon-md"));
      item.appendChild(img);
      item.appendChild(zoom);
      item.addEventListener("click", () => openLightbox(i));
      if (i >= VISIBLE) item.classList.add("gallery-hidden");
      grid.appendChild(item);
    });
    const more = document.createElement("div");
    more.className = "g-more";
    more.appendChild(buildIcon("ic-zoom", "icon-md"));
    const moreLabel = document.createElement("span");
    moreLabel.textContent = `+${PHOTOS.length - VISIBLE}`;
    more.appendChild(moreLabel);
    more.addEventListener("click", () => {
      document.querySelectorAll(".gallery-hidden").forEach((el) => el.classList.remove("gallery-hidden"));
      more.remove();
      initReveal();
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
      div.className = "amenity-cat reveal";
      const h3 = document.createElement("h3");
      h3.className = "amenity-cat-title";
      h3.setAttribute("data-fr", cat.cat.fr);
      h3.setAttribute("data-en", cat.cat.en);
      h3.textContent = cat.cat.fr;
      div.appendChild(h3);
      const ul = document.createElement("ul");
      cat.items.forEach((item) => {
        const li = document.createElement("li");
        li.appendChild(buildIcon(item.icon, "icon-sm a-ico " + (ICON_ANIM[item.icon] || "icon-float")));
        const labelSpan = document.createElement("span");
        labelSpan.className = "amenity-item-label";
        labelSpan.setAttribute("data-fr", item.fr);
        labelSpan.setAttribute("data-en", item.en);
        labelSpan.textContent = item.fr;
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
      div.className = "rb-item reveal";
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
    const map = L.map("map", { scrollWheelZoom: false, zoomControl: false }).setView(coords, 14);

    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}", {
      attribution: "&copy; Esri &mdash; Esri, DeLorme, NAVTEQ",
      maxZoom: 16
    }).addTo(map);
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 16
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    L.circle(coords, { radius: 260, color: "#3f6e6a", weight: 1, fillColor: "#3f6e6a", fillOpacity: 0.08 }).addTo(map);

    const pin = L.divIcon({
      className: "map-pin",
      html: '<span class="map-pin-dot"><svg class="icon icon-sm"><use href="images/icons.svg#ic-palm"></use></svg></span><span class="map-pin-tail"></span>',
      iconSize: [40, 48],
      iconAnchor: [20, 46]
    });
    L.marker(coords, { icon: pin }).addTo(map)
      .bindPopup('<strong>Bungalow Serenity</strong><br>Les Terres Basses, Saint-Martin');
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

  let revealObserver = null;
  function initReveal() {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in-view"));
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    }
    document.querySelectorAll(".reveal:not(.in-view)").forEach((el) => revealObserver.observe(el));
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
    initReveal();
  });
})();
