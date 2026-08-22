(function () {
  "use strict";

  /* ---------- mobile nav ---------- */
  var navToggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-main-nav]");
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- article grid: filter + search (index page) ---------- */
  var grid = document.querySelector("[data-article-grid]");
  if (grid) {
    var cards = Array.prototype.slice.call(grid.querySelectorAll("[data-category]"));
    var chips = document.querySelectorAll("[data-filter-chip]");
    var searchInput = document.querySelector("[data-search-input]");
    var emptyState = document.querySelector("[data-empty-state]");
    var countEl = document.querySelector("[data-result-count]");
    var activeCategory = "all";

    function applyFilters() {
      var query = (searchInput && searchInput.value || "").trim().toLowerCase();
      var visible = 0;

      cards.forEach(function (card) {
        var matchesCategory =
          activeCategory === "all" || card.getAttribute("data-category") === activeCategory;
        var haystack = card.getAttribute("data-search") || "";
        var matchesQuery = query === "" || haystack.toLowerCase().indexOf(query) !== -1;
        var show = matchesCategory && matchesQuery;
        card.style.display = show ? "" : "none";
        if (show) visible++;
      });

      if (emptyState) emptyState.classList.toggle("is-visible", visible === 0);
      if (countEl) countEl.textContent = visible + "件";
    }

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.classList.remove("is-active"); });
        chip.classList.add("is-active");
        activeCategory = chip.getAttribute("data-filter-chip");
        applyFilters();
      });
    });

    if (searchInput) {
      searchInput.addEventListener("input", applyFilters);
    }

    function selectCategory(cat) {
      var target = document.querySelector('[data-filter-chip="' + cat + '"]');
      if (!target) return;
      chips.forEach(function (c) { c.classList.remove("is-active"); });
      target.classList.add("is-active");
      activeCategory = cat;
      applyFilters();
    }

    document.querySelectorAll("[data-cat-link]").forEach(function (link) {
      link.addEventListener("click", function () {
        selectCategory(link.getAttribute("data-cat-link"));
      });
    });

    if (location.hash) {
      selectCategory(location.hash.slice(1));
    }

    applyFilters();
  }

  /* ---------- reading progress + back to top (article pages) ---------- */
  var progressBar = document.querySelector("[data-reading-progress]");
  var backTop = document.querySelector("[data-back-top]");

  function onScroll() {
    if (progressBar) {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = pct + "%";
    }
    if (backTop) {
      backTop.classList.toggle("is-visible", window.scrollY > 480);
    }
  }

  if (progressBar || backTop) {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  if (backTop) {
    backTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- tap-to-expand product detail ---------- */
  document.querySelectorAll(".item-card.has-detail .item-card-head").forEach(function (head) {
    head.setAttribute("role", "button");
    head.setAttribute("tabindex", "0");
    head.setAttribute("aria-expanded", "false");
    function toggle() {
      var card = head.closest(".item-card");
      var open = card.classList.toggle("is-open");
      head.setAttribute("aria-expanded", open ? "true" : "false");
    }
    head.addEventListener("click", toggle);
    head.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    });
  });

  /* ---------- current year in footer ---------- */
  document.querySelectorAll("[data-current-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
