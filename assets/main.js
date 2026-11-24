/* Hub Canoa Grande — comportamento comum a todas as páginas */
(function(){
  var root = document.documentElement;
  function store(k, v){ try{ if(v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); }catch(e){ return null; } }

  // ---- tema claro/escuro (o tema salvo já é aplicado no <head>) ----
  var themeBtn = document.getElementById("themeBtn");
  if(themeBtn) themeBtn.addEventListener("click", function(){
    var dark = root.getAttribute("data-theme") === "dark" ||
      (!root.getAttribute("data-theme") && matchMedia("(prefers-color-scheme: dark)").matches);
    var next = dark ? "light" : "dark";
    root.setAttribute("data-theme", next); store("hub-theme", next);
  });

  // ---- menu do celular ----
  var nav = document.getElementById("nav"), mb = document.getElementById("menuBtn");
  function setMenu(open){
    nav.classList.toggle("open", open);
    mb.setAttribute("aria-expanded", open);
    mb.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    mb.textContent = open ? "✕" : "☰";
  }
  if(nav && mb){
    mb.addEventListener("click", function(){ setMenu(!nav.classList.contains("open")); });
    nav.addEventListener("click", function(e){ if(e.target.tagName === "A") setMenu(false); });
    document.addEventListener("keydown", function(e){ if(e.key === "Escape") setMenu(false); });
  }
})();

/* ---- filtro da página Projetos ---- */
(function(){
  var bar = document.querySelector(".filters");
  if(!bar) return;
  var chips = bar.querySelectorAll(".chip"), groups = document.querySelectorAll(".proj-group"), status = document.getElementById("filterStatus");
  function apply(f, scroll){
    chips.forEach(function(c){ var on = c.dataset.filter === f; c.setAttribute("aria-pressed", on); if(on && bar.scrollWidth > bar.clientWidth) bar.scrollLeft = c.offsetLeft - 24; });
    var n = 0;
    groups.forEach(function(g){ var show = f === "todos" || g.dataset.group === f; g.hidden = !show; if(show) n += g.querySelectorAll(".proj:not(.proj-cta)").length; });
    if(status) status.textContent = n + " projetos exibidos";
    if(scroll) bar.scrollIntoView({ block:"start" });
  }
  bar.addEventListener("click", function(e){
    var c = e.target.closest(".chip"); if(!c) return;
    apply(c.dataset.filter, false);
    history.replaceState(null, "", c.dataset.filter === "todos" ? location.pathname : "#" + c.dataset.filter);
  });
  function fromHash(){ var h = location.hash.slice(1); if(h && bar.querySelector('[data-filter="' + h + '"]')) apply(h, true); }
  window.addEventListener('hashchange', fromHash);
  fromHash();
})();
