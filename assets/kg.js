/* KITTED redesign: behaviour for the kg-* sections. Cart actions use Shopify's real cart and Ride's cart drawer. */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var money = function (cents) { return "$" + (cents / 100).toFixed(2); };

  /* ---------- Shopify cart: add items, then refresh Ride's cart drawer (or go to /cart) ---------- */
  function addItems(items, msgEl, btn) {
    var drawer = document.querySelector("cart-drawer");
    var body = { items: items };
    if (drawer && drawer.getSectionsToRender) {
      body.sections = drawer.getSectionsToRender().map(function (s) { return s.id; });
      body.sections_url = window.location.pathname;
    }
    if (btn) { btn.disabled = true; btn.setAttribute("aria-busy", "true"); }
    return fetch((window.routes && window.routes.cart_add_url ? window.routes.cart_add_url : "/cart/add") + ".js", {
      method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(body)
    }).then(function (r) { return r.json(); }).then(function (res) {
      if (res.status) { if (msgEl) { msgEl.textContent = res.description || res.message || "Could not add to cart."; msgEl.classList.add("is-warn"); } return false; }
      if (drawer && res.sections) {
        drawer.classList.remove("is-empty");
        drawer.renderContents(res);
      } else { window.location.href = (window.routes && window.routes.cart_url) || "/cart"; }
      return true;
    }).catch(function () { if (msgEl) { msgEl.textContent = "Could not add to cart. Please try again."; msgEl.classList.add("is-warn"); } return false; })
      .finally(function () { if (btn) { btn.disabled = false; btn.removeAttribute("aria-busy"); } });
  }
  window.kgAddItems = addItems;

/* ---------- hero slideshow ---------- */
  $$(".hero").forEach(function (hero) {
    var slides = $$(".hero__slide", hero), dots = $$(".hero__dot", hero), pause = $(".hero__pause", hero), i = 0, t, playing = true, DELAY = 7000, remaining = DELAY, startedAt = 0;
    if (slides.length < 2) return;
    hero.style.setProperty("--hero-delay", DELAY + "ms");
    function go(n) {
      i = (n + slides.length) % slides.length;
      remaining = DELAY;
      var ring = pause && $(".hero__pause-progress", pause);
      if (ring) { ring.classList.remove("is-counting"); void ring.getBoundingClientRect(); ring.classList.add("is-counting"); }
      slides.forEach(function (s, j) { s.classList.toggle("is-on", j === i); s.setAttribute("aria-hidden", j === i ? "false" : "true"); $$("a,button", s).forEach(function (a) { a.tabIndex = j === i ? 0 : -1; }); });
      dots.forEach(function (d, j) { d.setAttribute("aria-current", j === i ? "true" : "false"); d.classList.remove("is-run"); });
      if (dots[i]) { void dots[i].offsetWidth; dots[i].classList.add("is-run"); }
    }
    function start() {
      clearTimeout(t); hero.classList.toggle("is-paused", !playing);
      if (playing) { startedAt = Date.now(); t = setTimeout(function () { go(i + 1); start(); }, remaining); }
    }
    dots.forEach(function (d, j) { d.addEventListener("click", function () { go(j); start(); }); });
    if (pause) {
      pause.innerHTML = '<span class="hero__pause-backdrop" aria-hidden="true"></span><svg class="hero__pause-ring" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" stroke-opacity=".3" stroke-width="2"/><circle class="hero__pause-progress" cx="12" cy="12" r="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="69.12"/></svg><svg class="hero__pause-icon" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"></svg>';
      var setIcon = function () { $(".hero__pause-icon", pause).innerHTML = playing ? '<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>' : '<polygon points="6 3 20 12 6 21 6 3"/>'; pause.setAttribute("aria-label", playing ? "Pause slideshow" : "Play slideshow"); };
      setIcon();
      pause.addEventListener("click", function () {
        if (playing) remaining = Math.max(0, remaining - (Date.now() - startedAt));
        playing = !playing; setIcon(); start();
      });
    }
    var x0 = null;
    hero.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener("touchend", function (e) { if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) { go(i + (dx < 0 ? 1 : -1)); start(); } x0 = null; });
    go(0); start();
  });

  /* ---------- carousels ---------- */
  $$(".carousel").forEach(function (c) {
    var track = $(".carousel__track", c), id = c.id, prev = $('[data-car="' + id + '"][data-dir="-1"]'), next = $('[data-car="' + id + '"][data-dir="1"]');
    function upd() {
      if (!prev || !next) return;
      prev.disabled = track.scrollLeft < 4;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    }
    [prev, next].forEach(function (b) {
      if (!b) return;
      b.addEventListener("click", function () {
        var item = track.firstElementChild; var step = item ? item.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 16) : track.clientWidth;
        track.scrollBy({ left: step * (+b.dataset.dir) * (window.innerWidth < 640 ? 1 : 2), behavior: reduce ? "auto" : "smooth" });
      });
    });
    track.addEventListener("scroll", function () { window.requestAnimationFrame(upd); }, { passive: true });
    window.addEventListener("resize", upd); upd();
  });

  /* ---------- video cards ---------- */
  var current;
  function stopVideo(card) {
    var v = $("video", card); if (!v) return;
    v.pause(); card.classList.remove("is-playing");
  }
  $$("[data-video]").forEach(function (card) {
    var v = $("video", card), play = $(".vcard__play", card), snd = $(".vcard__sound", card);
    if (!v) return;
    function toggle() {
      if (v.paused) {
        if (current && current !== card) stopVideo(current);
        v.muted = false; if (snd) snd.innerHTML = soundIcon(true);
        var p = v.play(); if (p && p.catch) p.catch(function () { v.muted = true; v.play().catch(function () { stopVideo(card); }); if (snd) snd.innerHTML = soundIcon(false); });
        card.classList.add("is-playing"); current = card;
      } else { stopVideo(card); }
    }
    if (play) play.addEventListener("click", toggle);
    v.addEventListener("click", toggle);
    function playbackState() {
      card.classList.toggle("is-playing", !v.paused);
      if (play) {
        play.setAttribute("aria-pressed", v.paused ? "false" : "true");
        if (play.dataset.playLabel) play.setAttribute("aria-label", v.paused ? play.dataset.playLabel : play.dataset.pauseLabel);
      }
    }
    v.addEventListener("play", playbackState);
    v.addEventListener("pause", playbackState);
    v.addEventListener("error", function () { stopVideo(card); });
    v.addEventListener("ended", function () { card.classList.remove("is-playing"); });
    if (snd) snd.addEventListener("click", function (e) { e.stopPropagation(); v.muted = !v.muted; snd.innerHTML = soundIcon(!v.muted); });
  });
  function soundIcon(on) {
    return on ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 010 7M19 5a10 10 0 010 14"/></svg>Sound on'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M23 9l-6 6M17 9l6 6"/></svg>Tap for sound';
  }
  var loopVideos = new Set();
  function syncLoop(v) {
    var r = v.getBoundingClientRect(), hero = v.closest(".shero__media");
    var visible = r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < window.innerHeight;
    var allowed = hero ? !hero.kgPaused : true; /* muted ambient loops always autoplay, like kittedgear.com; heroes keep their pause button */
    if (visible && allowed && !document.hidden) {
      var p = v.play(); if (p && p.catch) p.catch(function () {});
    } else { v.pause(); }
  }
  var loopObserver = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) { syncLoop(entry.target); });
  }, { threshold: 0 }) : null;
  function setupLoops(root) {
    $$("video[data-loop]", root).forEach(function (v) {
      if (loopVideos.has(v)) return;
      loopVideos.add(v);
      var hero = v.closest(".shero__media"), button = hero && $("[data-hero-toggle]", hero);
      function label() {
        if (!button || !v.getClientRects().length) return;
        button.textContent = v.paused ? button.dataset.playLabel : button.dataset.pauseLabel;
        button.setAttribute("aria-pressed", v.paused ? "false" : "true");
      }
      if (button) {
        v.addEventListener("play", label); v.addEventListener("pause", label);
        if (!button.kgReady) {
          button.kgReady = true;
          button.addEventListener("click", function () {
            var active = $$("video[data-hero-video]", hero).find(function (item) { return item.getClientRects().length; });
            if (!active) return;
            hero.kgPaused = !active.paused; hero.kgMotionAllowed = true;
            $$("video[data-hero-video]", hero).forEach(syncLoop);
          });
        }
      }
      if (loopObserver) loopObserver.observe(v);
      syncLoop(v);
    });
  }
  function syncLoops() {
    loopVideos.forEach(function (v) {
      if (!v.isConnected) { if (loopObserver) loopObserver.unobserve(v); loopVideos.delete(v); }
      else syncLoop(v);
    });
  }
  setupLoops(document);
  document.addEventListener("shopify:section:load", function (event) { setupLoops(event.target); });
  document.addEventListener("shopify:section:unload", syncLoops);
  document.addEventListener("visibilitychange", syncLoops);
  window.addEventListener("resize", syncLoops);
  if (!loopObserver) window.addEventListener("scroll", syncLoops, { passive: true });

    /* ---------- product: gallery, variant picker, add to cart ---------- */
  $$("[data-gallery]").forEach(function (g) {
    var panels = $$("[data-gallery-media]", g), thumbs = $$(".gallery__thumbs button", g), i = Math.max(0, thumbs.findIndex(function (t) { return t.getAttribute("aria-current") === "true"; }));
    function show(n) {
      if (!thumbs.length) return;
      i = (n + thumbs.length) % thumbs.length;
      var b = thumbs[i];
      panels.forEach(function (panel) {
        var selected = panel.dataset.galleryMedia === b.dataset.mediaId;
        if (!selected) {
          $$("video", panel).forEach(function (v) { v.pause(); });
          $$("iframe", panel).forEach(function (frame) { if (!panel.hidden) frame.src = frame.src; });
        }
        panel.hidden = !selected;
      });
      thumbs.forEach(function (t, j) { t.setAttribute("aria-current", j === i ? "true" : "false"); });
      b.scrollIntoView({ block: "nearest", inline: "nearest", behavior: reduce ? "auto" : "smooth" });
    }
    g.kgShowMedia = function (id) { var k = thumbs.findIndex(function (t) { return t.dataset.mediaId === String(id); }); if (k > -1) show(k); };
    thumbs.forEach(function (t, j) { t.addEventListener("click", function () { show(j); }); });
    $$("[data-g]", g).forEach(function (b) { b.addEventListener("click", function () { show(i + (+b.dataset.g)); }); });
  });

  $$("form[data-kg-buy]").forEach(function (f) {
    var data = JSON.parse($("script[data-product-json]", f.closest("[data-kg-product]") || f).textContent);
    var msg = $(".buy__msg", f), qtyEl = $("[data-qty]", f), qty = 1, idIn = $("input[name=id]", f), btn = $("[type=submit]", f);
    var priceEl = $("[data-price]", f.closest("[data-kg-product]")), gallery = $("[data-gallery]", f.closest("[data-kg-product]"));
    var digital = f.dataset.kgDigital === "true";
    $$("[data-qd]", f).forEach(function (b) { b.addEventListener("click", function () { qty = Math.max(1, qty + (+b.dataset.qd)); qtyEl.textContent = qty; refresh(); }); });
    function chosen() {
      var vals = [], missing = [];
      $$("fieldset.option", f).forEach(function (fs) { var c = $("input:checked", fs); if (c) vals.push(c.value); else { vals.push(null); missing.push(fs.dataset.label); } });
      return { vals: vals, missing: missing };
    }
    function findVariant(vals) {
      if (!data.options.length || data.variants.length === 1) return data.variants[0];
      return data.variants.filter(function (v) { return v.options.every(function (o, k) { return o === vals[k]; }); })[0];
    }
    function refresh(changed) {
      var c = chosen(), v = c.missing.length ? null : findVariant(c.vals);
      if (v) {
        idIn.value = v.id;
        if (priceEl) priceEl.textContent = money(v.price) + " USD";
        if (changed && v.featured_media && gallery && gallery.kgShowMedia) gallery.kgShowMedia(v.featured_media.id);
      }
      var label;
      if (c.missing.length) label = "Select " + c.missing[0];
      else if (!v || !v.available) label = "Sold out";
      else label = (digital ? "Get instant access — " : "Add to cart — ") + money(v.price * qty);
      btn.textContent = label; btn.disabled = !c.missing.length && (!v || !v.available);
      var sb = $("#sticky-btn"); if (sb) sb.textContent = label;
      return v;
    }
    f.addEventListener("change", function () { refresh(true); });
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var c = chosen();
      if (c.missing.length) {
        msg.textContent = "Choose a " + c.missing[0].toLowerCase() + " to continue."; msg.classList.add("is-warn");
        var fs = $('fieldset[data-label="' + c.missing[0] + '"]', f); if (fs) fs.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
        return;
      }
      var v = refresh(); if (!v || !v.available) return;
      msg.classList.remove("is-warn"); msg.textContent = "";
      addItems([{ id: v.id, quantity: qty }], msg, btn).then(function () { refresh(); });
    });
    refresh();
  });
  var sticky = $(".sticky-buy"), buyForm = $("form[data-kg-buy]");
  if (sticky && buyForm && "IntersectionObserver" in window) {
    var sio = new IntersectionObserver(function (es) { es.forEach(function (en) { sticky.classList.toggle("is-on", !en.isIntersecting && en.boundingClientRect.top < 0); }); });
    sio.observe($("[type=submit]", buyForm));
    $("#sticky-btn").addEventListener("click", function () { buyForm.requestSubmit ? buyForm.requestSubmit() : $("[type=submit]", buyForm).click(); });
  }

  /* ---------- quick add buttons on product cards ---------- */
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-quick-add]"); if (!b) return;
    e.preventDefault(); addItems([{ id: +b.dataset.quickAdd, quantity: 1 }], null, b);
  });

  /* ---------- pack builder (real variants; pack discount = Shopify automatic discount) ---------- */
  var pack = $("[data-pack]");
  if (pack) {
    var gloves = JSON.parse($("script[data-pack-json]", pack).textContent);
    var slots = [], size = 2, disc = .10;
    var slotsEl = $("#slots"), countEl = $("#pack-count");
    function glove() { var c = $('input[name="glove"]:checked', pack); return gloves[c ? c.value : 0]; }
    function optionsUI() {
      var g = glove(), box = $("#pk-options");
      box.innerHTML = g.options.map(function (o, k) {
        return '<fieldset class="option"><legend>' + o.name + '</legend><div class="chips">' + o.values.map(function (val, n) {
          return '<label class="chip"><input type="radio" name="pk-opt-' + k + '" value="' + val.replace(/"/g, "&quot;") + '"' + (n === 0 ? " checked" : "") + '><span>' + val + '</span></label>';
        }).join("") + '</div></fieldset>';
      }).join("");
    }
    function tier() { var c = $('input[name="tier"]:checked', pack); size = +c.value; disc = +c.dataset.disc; slots = slots.slice(0, size); render(); }
    function preview() { var g = glove(); $("#pv-img").src = g.img; $("#pv-name").textContent = g.title; $("#pv-desc").textContent = g.desc || ""; optionsUI(); }
    function render() {
      var html = "";
      for (var i = 0; i < size; i++) {
        var s = slots[i];
        html += s ? '<div class="slot is-filled"><span class="slot__n">' + String(i + 1).padStart(2, "0") + '</span><img src="' + s.img + '" alt=""><div>' + s.title + '<small>' + s.label + '</small></div><button type="button" data-slot-rm="' + i + '">Remove</button></div>'
                  : '<div class="slot"><span class="slot__n">' + String(i + 1).padStart(2, "0") + '</span><span class="slot__empty">Empty slot</span></div>';
      }
      slotsEl.innerHTML = html;
      countEl.textContent = slots.length + " of " + size + " selected";
      var sub = slots.reduce(function (a, s) { return a + s.price; }, 0), sv = slots.length === size ? Math.round(sub * disc) : 0;
      $("#pk-sub").textContent = money(sub); $("#pk-save").textContent = "−" + money(sv); $("#pk-total").textContent = money(sub - sv);
      $("#pk-disc").textContent = Math.round(disc * 100);
      var b = $("#pk-add"), left = size - slots.length;
      b.disabled = left > 0; b.textContent = left > 0 ? "Pick " + left + " more glove" + (left > 1 ? "s" : "") : "Add pack to cart — " + money(sub - sv);
      $("#pk-addslot").disabled = left === 0;
    }
    pack.addEventListener("change", function (e) { if (e.target.name === "tier") tier(); if (e.target.name === "glove") preview(); });
    $("#pk-addslot").addEventListener("click", function () {
      if (slots.length >= size) return;
      var g = glove(), vals = g.options.map(function (o, k) { var c = $('input[name="pk-opt-' + k + '"]:checked', pack); return c ? c.value : o.values[0]; });
      var v = g.variants.filter(function (x) { return x.options.every(function (o, k) { return o === vals[k]; }); })[0];
      var m = $("#pk-msg");
      if (!v || !v.available) { m.textContent = "That size and hand is sold out. Pick another."; return; }
      m.textContent = "";
      slots.push({ id: v.id, title: g.title, img: g.img, price: v.price, label: vals.join(" · ") }); render();
    });
    slotsEl.addEventListener("click", function (e) { var b = e.target.closest("[data-slot-rm]"); if (b) { slots.splice(+b.dataset.slotRm, 1); render(); } });
    $("#pk-add").addEventListener("click", function () {
      var byId = {}; slots.forEach(function (s) { byId[s.id] = (byId[s.id] || 0) + 1; });
      addItems(Object.keys(byId).map(function (id) { return { id: +id, quantity: byId[id] }; }), $("#pk-msg"), $("#pk-add"))
        .then(function (added) { if (added) slots = []; render(); });
    });
    tier(); preview();
  }

/* ---------- jersey ---------- */
  $$("[data-jersey]").forEach(function (form) {
    var svg = $("svg.jersey-svg", form.closest("[data-jersey-scope]") || document);
    if (!svg) return;
    var nameIn = $("[name=fullname]", form), numIn = $("[name=number]", form);
    function upd() {
      var n = (nameIn.value || "").trim().split(/\s+/).pop().toUpperCase().slice(0, 12) || "YOUR NAME";
      var num = (numIn.value || "").replace(/\D/g, "").slice(0, 2) || "00";
      $$("[data-j-name]", svg).forEach(function (t) { t.textContent = n; });
      $$("[data-j-num]", svg).forEach(function (t) { t.textContent = num; });
      svg.setAttribute("aria-label", "KITTED jersey " + n + " number " + num);
    }
    nameIn.addEventListener("input", upd); numIn.addEventListener("input", function () { numIn.value = numIn.value.replace(/\D/g, "").slice(0, 2); upd(); });
  });

  /* ---------- award confetti ---------- */
  $$(".award__confetti").forEach(function (box) {
    var colors = ["#f6b10a", "#3ccf8e", "#ec4c97", "#b31b2c", "#d7e43a", "#9a6a00"];
    var h = box.parentElement.offsetHeight + 40;
    for (var k = 0; k < 26; k++) {
      var c = document.createElement("i");
      c.style.left = (Math.random() * 100).toFixed(1) + "%";
      c.style.background = colors[k % colors.length];
      c.style.setProperty("--fall", h + "px");
      c.style.animationDuration = (7 + Math.random() * 7).toFixed(1) + "s";
      c.style.animationDelay = (-Math.random() * 14).toFixed(1) + "s";
      box.appendChild(c);
    }
  });

  /* ---------- video pop-up ---------- */
  var vm = document.getElementById("vmodal");
  if (vm && vm.showModal) {
    var vv = $(".vmodal__video", vm);
    $$("[data-vmodal]").forEach(function (b) {
      b.addEventListener("click", function () {
        vv.src = b.dataset.vmodal; if (b.dataset.poster) vv.poster = b.dataset.poster;
        vm.showModal(); vv.play().catch(function () {});
      });
    });
    $(".vmodal__close", vm).addEventListener("click", function () { vm.close(); });
    vm.addEventListener("click", function (e) { if (e.target === vm) vm.close(); });
    vm.addEventListener("close", function () { vv.pause(); });
  }
})();
