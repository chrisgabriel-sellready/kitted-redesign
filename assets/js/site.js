/* KITTED storefront mockup — shared behaviour */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var money = function (n) { return "$" + n.toFixed(2) + " USD"; };
  var FREE_SHIP = 100;

  /* ---------- storage (optional) ---------- */
  var mem = {};
  function load(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return mem[k] || d; } }
  function save(k, v) { mem[k] = v; try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  /* ---------- header height ---------- */
  var header = $(".site-header");
  function setH() { if (header) document.documentElement.style.setProperty("--header-h", header.offsetHeight + "px"); }
  setH(); window.addEventListener("resize", setH);

  /* ---------- announcement ---------- */
  var msgs = $$(".announce__msg"), mi = 0, mt;
  function showMsg(i) { msgs.forEach(function (m, j) { m.classList.toggle("is-on", j === i); }); mi = i; }
  function nextMsg(d) { showMsg((mi + (d || 1) + msgs.length) % msgs.length); }
  if (msgs.length) {
    showMsg(0);
    if (!reduce) mt = setInterval(nextMsg, 4500);
    $$(".announce__btn").forEach(function (b) {
      b.addEventListener("click", function () { clearInterval(mt); nextMsg(b.classList.contains("announce__btn--prev") ? -1 : 1); });
    });
  }

  /* ---------- drawers ---------- */
  var lastFocus;
  function openDrawer(id) {
    var d = document.getElementById(id); if (!d) return;
    lastFocus = document.activeElement;
    d.classList.add("is-open"); d.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    var f = $(".drawer__head button", d); if (f) setTimeout(function () { f.focus(); }, 50);
  }
  function closeDrawer(d) {
    d.classList.remove("is-open"); d.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $$("[data-open]").forEach(function (b) { b.addEventListener("click", function (e) { e.preventDefault(); openDrawer(b.getAttribute("data-open")); }); });
  $$(".drawer").forEach(function (d) {
    $$("[data-close]", d).forEach(function (b) { b.addEventListener("click", function () { closeDrawer(d); }); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") $$(".drawer.is-open").forEach(closeDrawer);
  });

  /* mega menu toggle for keyboard/touch */
  $$(".has-menu > button").forEach(function (b) {
    b.addEventListener("click", function () {
      var li = b.parentElement, open = !li.classList.contains("is-open");
      li.classList.toggle("is-open", open); b.setAttribute("aria-expanded", open);
    });
  });
  document.addEventListener("click", function (e) {
    $$(".has-menu.is-open").forEach(function (li) { if (!li.contains(e.target)) { li.classList.remove("is-open"); $("button", li).setAttribute("aria-expanded", "false"); } });
  });

  /* ---------- toast ---------- */
  var toastEl;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "toast"; toastEl.setAttribute("role", "status"); document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add("is-on");
    clearTimeout(toastEl._t); toastEl._t = setTimeout(function () { toastEl.classList.remove("is-on"); }, 2600);
  }

  /* ---------- cart ---------- */
  var cart = load("kitted-cart", []);
  function cartTotal() { return cart.reduce(function (s, l) { return s + l.price * l.qty; }, 0); }
  function cartCount() { return cart.reduce(function (s, l) { return s + l.qty; }, 0); }
  function renderCart() {
    $$(".cart-count").forEach(function (c) { var n = cartCount(); c.textContent = n; c.setAttribute("data-count", n); });
    var body = $("#cart-lines"); if (!body) return;
    var total = cartTotal(), left = Math.max(0, FREE_SHIP - total);
    $("#ship-text").innerHTML = left > 0 ? "You're <b>" + money(left).replace(" USD", "") + "</b> away from free domestic shipping." : "<b>You've unlocked free domestic shipping.</b>";
    $("#ship-bar").style.width = Math.min(100, total / FREE_SHIP * 100) + "%";
    if (!cart.length) {
      body.innerHTML = '<div class="cart-empty"><p>Your cart is empty.</p><a class="btn" href="collections-spingrip.html">Shop SpinGrip</a></div>';
    } else {
      body.innerHTML = cart.map(function (l, i) {
        return '<div class="cart-line"><img src="' + l.img + '" alt="" width="76" height="76" loading="lazy">' +
          '<div><p class="cart-line__name">' + l.name + '</p><p class="cart-line__meta">' + (l.variant || "") + '</p>' +
          '<div class="qty" aria-label="Quantity"><button type="button" data-q="' + i + '" data-d="-1" aria-label="Decrease">−</button><span>' + l.qty + '</span><button type="button" data-q="' + i + '" data-d="1" aria-label="Increase">+</button></div>' +
          '<button type="button" class="cart-remove" data-rm="' + i + '">Remove</button></div>' +
          '<p class="cart-line__price">' + money(l.price * l.qty).replace(" USD", "") + '</p></div>';
      }).join("");
    }
    $("#cart-subtotal").textContent = money(total);
    var co = $("#checkout"); if (co) co.disabled = !cart.length;
  }
  function addToCart(item) {
    var key = item.id + "|" + (item.variant || "");
    var ex = cart.filter(function (l) { return l.key === key; })[0];
    if (ex) ex.qty += item.qty || 1; else cart.push({ key: key, id: item.id, name: item.name, variant: item.variant, price: item.price, img: item.img, qty: item.qty || 1 });
    save("kitted-cart", cart); renderCart(); openDrawer("cart");
  }
  document.addEventListener("click", function (e) {
    var q = e.target.closest("[data-q]"), rm = e.target.closest("[data-rm]");
    if (q) { var l = cart[+q.dataset.q]; l.qty += +q.dataset.d; if (l.qty < 1) cart.splice(+q.dataset.q, 1); save("kitted-cart", cart); renderCart(); }
    if (rm) { cart.splice(+rm.dataset.rm, 1); save("kitted-cart", cart); renderCart(); }
    var quick = e.target.closest("[data-add]");
    if (quick) { e.preventDefault(); try { addToCart(JSON.parse(quick.getAttribute("data-add"))); } catch (err) {} }
  });
  var co = $("#checkout");
  if (co) co.addEventListener("click", function () { toast("Checkout is handled by Shopify on the live store."); });
  renderCart();

  /* ---------- hero slideshow ---------- */
  $$(".hero").forEach(function (hero) {
    var slides = $$(".hero__slide", hero), dots = $$(".hero__dot", hero), pause = $(".hero__pause", hero), i = 0, t, playing = true, DELAY = 6500;
    if (slides.length < 2) return;
    hero.style.setProperty("--hero-delay", DELAY + "ms");
    function go(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, j) { s.classList.toggle("is-on", j === i); s.setAttribute("aria-hidden", j === i ? "false" : "true"); $$("a,button", s).forEach(function (a) { a.tabIndex = j === i ? 0 : -1; }); });
      dots.forEach(function (d, j) { d.setAttribute("aria-current", j === i ? "true" : "false"); d.classList.remove("is-run"); });
      if (dots[i]) { void dots[i].offsetWidth; dots[i].classList.add("is-run"); }
    }
    function start() { clearInterval(t); hero.classList.toggle("is-paused", !playing); if (playing) t = setInterval(function () { go(i + 1); }, DELAY); }
    dots.forEach(function (d, j) { d.addEventListener("click", function () { go(j); start(); }); });
    if (pause) {
      var setIcon = function () { pause.innerHTML = playing ? '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>' : '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4l13 8-13 8z"/></svg>'; pause.setAttribute("aria-label", playing ? "Pause slideshow" : "Play slideshow"); };
      setIcon();
      pause.addEventListener("click", function () { playing = !playing; setIcon(); if (playing) go(i); start(); });
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
        var p = v.play(); if (p && p.catch) p.catch(function () { v.muted = true; v.play().catch(function () {}); if (snd) snd.innerHTML = soundIcon(false); });
        card.classList.add("is-playing"); current = card;
      } else { stopVideo(card); }
    }
    if (play) play.addEventListener("click", toggle);
    v.addEventListener("click", toggle);
    v.addEventListener("ended", function () { card.classList.remove("is-playing"); });
    if (snd) snd.addEventListener("click", function (e) { e.stopPropagation(); v.muted = !v.muted; snd.innerHTML = soundIcon(!v.muted); });
  });
  function soundIcon(on) {
    return on ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 010 7M19 5a10 10 0 010 14"/></svg>Sound on'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M23 9l-6 6M17 9l6 6"/></svg>Tap for sound';
  }
  /* autoplay muted loops when visible */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { var v = en.target; if (en.isIntersecting && !reduce) { v.play().catch(function () {}); } else { v.pause(); } });
    }, { threshold: .2 });
    $$("video[data-loop]").forEach(function (v) { io.observe(v); });
  }

  /* ---------- PDP ---------- */
  $$("[data-gallery]").forEach(function (g) {
    var main = $(".gallery__main img", g), thumbs = $$(".gallery__thumbs button", g), i = 0;
    function show(n) {
      i = (n + thumbs.length) % thumbs.length;
      var b = thumbs[i]; main.src = b.dataset.src; main.alt = b.dataset.alt || "";
      thumbs.forEach(function (t, j) { t.setAttribute("aria-current", j === i ? "true" : "false"); });
      b.scrollIntoView({ block: "nearest", inline: "nearest", behavior: reduce ? "auto" : "smooth" });
    }
    thumbs.forEach(function (t, j) { t.addEventListener("click", function () { show(j); }); });
    $$("[data-g]", g).forEach(function (b) { b.addEventListener("click", function () { show(i + (+b.dataset.g)); }); });
  });

  $$("form[data-buy]").forEach(function (f) {
    var p = JSON.parse(f.getAttribute("data-buy")), msg = $(".buy__msg", f), qtyEl = $("[data-qty]", f), qty = 1;
    $$("[data-qd]", f).forEach(function (b) { b.addEventListener("click", function () { qty = Math.max(1, qty + (+b.dataset.qd)); qtyEl.textContent = qty; }); });
    function variant() {
      var parts = [], missing = [];
      $$("fieldset.option", f).forEach(function (fs) {
        var c = $("input:checked", fs); if (c) parts.push(c.value); else missing.push(fs.dataset.label);
      });
      return { text: parts.join(" / "), missing: missing };
    }
    function refresh() {
      var v = variant(), btn = $("[type=submit]", f);
      if (v.missing.length) { btn.textContent = "Select " + v.missing[0]; msg.textContent = ""; }
      else btn.textContent = (p.digital ? "Get instant access — " : "Add to cart — ") + money(p.price * qty);
      var sb = $("#sticky-btn"); if (sb) sb.textContent = btn.textContent;
      /* pitcher/position swap for softball */
      var type = $('input[name="type"]:checked', f);
      if (type && f.dataset.typeSwap) {
        var sw = JSON.parse(f.dataset.typeSwap)[type.value];
        if (sw) { p.id = sw.id; p.name = sw.name; p.img = sw.img; }
      }
    }
    f.addEventListener("change", refresh);
    $$("[data-qd]", f).forEach(function (b) { b.addEventListener("click", refresh); });
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = variant();
      if (v.missing.length) { msg.textContent = "Choose a " + v.missing[0].toLowerCase() + " to continue."; msg.classList.add("is-warn"); var fs = $('fieldset[data-label="' + v.missing[0] + '"]', f); if (fs) fs.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" }); return; }
      msg.classList.remove("is-warn"); msg.textContent = "";
      addToCart({ id: p.id, name: p.name, variant: v.text || (p.digital ? "Instant digital access" : ""), price: p.price, img: p.img, qty: qty });
    });
    refresh();
  });
  var sticky = $(".sticky-buy"), buyForm = $("form[data-buy]");
  if (sticky && buyForm && "IntersectionObserver" in window) {
    var sio = new IntersectionObserver(function (es) { es.forEach(function (en) { sticky.classList.toggle("is-on", !en.isIntersecting && en.boundingClientRect.top < 0); }); });
    sio.observe($("[type=submit]", buyForm));
    $("#sticky-btn").addEventListener("click", function () { buyForm.requestSubmit ? buyForm.requestSubmit() : $("[type=submit]", buyForm).click(); });
  }

  /* ---------- packs builder ---------- */
  var pack = $("[data-pack]");
  if (pack) {
    var gloves = JSON.parse(pack.getAttribute("data-pack"));
    var slots = [], size = 2, disc = .10;
    var slotsEl = $("#slots"), countEl = $("#pack-count");
    function tier() { var c = $('input[name="tier"]:checked', pack); size = +c.value; disc = +c.dataset.disc; slots = slots.slice(0, size); render(); }
    function glove() { var g = $('input[name="glove"]:checked', pack).value; return gloves[g]; }
    function preview() { var g = glove(); $("#pv-img").src = g.img; $("#pv-name").textContent = g.name; $("#pv-desc").textContent = g.desc; }
    function render() {
      var html = "";
      for (var i = 0; i < size; i++) {
        var s = slots[i];
        html += s ? '<div class="slot is-filled"><span class="slot__n">' + String(i + 1).padStart(2, "0") + '</span><img src="' + s.img + '" alt=""><div>' + s.name + '<small>' + s.variant + '</small></div><button type="button" data-slot-rm="' + i + '">Remove</button></div>'
                  : '<div class="slot"><span class="slot__n">' + String(i + 1).padStart(2, "0") + '</span><span class="slot__empty">Empty slot</span></div>';
      }
      slotsEl.innerHTML = html;
      countEl.textContent = slots.length + " of " + size + " selected";
      var sub = slots.reduce(function (a, s) { return a + s.price; }, 0), sv = slots.length === size ? sub * disc : 0;
      $("#pk-sub").textContent = money(sub); $("#pk-save").textContent = "−" + money(sv); $("#pk-total").textContent = money(sub - sv);
      $("#pk-disc").textContent = Math.round(disc * 100);
      var btn = $("#pk-add"), left = size - slots.length;
      btn.disabled = left > 0; btn.textContent = left > 0 ? "Pick " + left + " more glove" + (left > 1 ? "s" : "") : "Add pack to cart — " + money(sub - sv);
      $("#pk-addslot").disabled = left === 0;
    }
    pack.addEventListener("change", function (e) { if (e.target.name === "tier") tier(); if (e.target.name === "glove") preview(); });
    $("#pk-addslot").addEventListener("click", function () {
      if (slots.length >= size) return;
      var g = glove(), sz = $('input[name="psize"]:checked', pack).value, hand = $('input[name="phand"]:checked', pack).value;
      slots.push({ name: g.name, img: g.img, price: g.price, variant: sz + " · " + hand }); render();
      toast(g.name + " added to your pack");
    });
    slotsEl.addEventListener("click", function (e) { var b = e.target.closest("[data-slot-rm]"); if (b) { slots.splice(+b.dataset.slotRm, 1); render(); } });
    $("#pk-add").addEventListener("click", function () {
      var sub = slots.reduce(function (a, s) { return a + s.price; }, 0);
      addToCart({ id: "pack-" + size + "-" + Date.now(), name: "SpinGrip " + size + "-Pack", variant: slots.map(function (s) { return s.name.replace("SpinGrip ", "") + " (" + s.variant + ")"; }).join(", "), price: +(sub * (1 - disc)).toFixed(2), img: slots[0].img, qty: 1 });
      slots = []; render();
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

  /* ---------- forms (mockup: no network) ---------- */
  $$("form[data-mock]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!f.checkValidity()) { f.reportValidity(); return; }
      var out = $(".form-msg", f) || $(".form-msg", f.parentElement);
      if (out) out.textContent = f.getAttribute("data-mock");
      f.reset();
      $$("[data-j-name]").forEach(function (t) { t.textContent = "YOUR NAME"; });
      $$("[data-j-num]").forEach(function (t) { t.textContent = "00"; });
    });
  });
})();
