/* =========================================================
   FORMULÁRIO DE EMBARQUE — CONFIGURAÇÃO (troque só aqui)

   FORM_ENDPOINT é o endereço do serviço que recebe as inscrições
   e as encaminha para o e-mail do Hub. Funciona com:
     • Formspree  → "https://formspree.io/f/SEU_CODIGO"
     • Web3Forms  → "https://api.web3forms.com/submit"  (preencha também WEB3FORMS_KEY)
     • FormSubmit → "https://formsubmit.co/ajax/SEU_EMAIL"

   Enquanto FORM_ENDPOINT estiver vazio, o envio abre o aplicativo
   de e-mail da pessoa com a inscrição já escrita (plano B).
   ========================================================= */
var FORM_ENDPOINT = "https://formsubmit.co/ajax/hubcanoagrandeigarassu@gmail.com";
// FormSubmit (atual): não precisa de conta. Na PRIMEIRA inscrição, chega um e-mail
// de ativação na caixa acima; clique em "Activate Form" uma vez e pronto.
var WEB3FORMS_KEY = "";
var HUB_EMAIL = "hubcanoagrandeigarassu@gmail.com";

(function(){
  var form = document.getElementById("embarque");
  if(!form) return;
  var done = document.getElementById("formDone");
  var status = document.getElementById("formStatus");
  var summary = document.getElementById("formSummary");
  var btn = document.getElementById("sendBtn");
  var $ = function(id){ return document.getElementById(id); };

  // ---- vem de uma página de rota? marca a rota (como-embarcar.html?rota=capital) ----
  var rota = new URLSearchParams(location.search).get("rota");
  if(rota){
    var box = form.querySelector('input[data-slug="' + rota + '"]');
    if(box) box.checked = true;
  }

  // ---- máscara simples de telefone: (81) 9 9999-9999 ----
  $("f-whats").addEventListener("input", function(e){
    var d = e.target.value.replace(/\D/g, "").slice(0, 11), out = d;
    if(d.length > 2) out = "(" + d.slice(0,2) + ") " + d.slice(2);
    if(d.length > 3 && d.length === 11) out = "(" + d.slice(0,2) + ") " + d.slice(2,3) + " " + d.slice(3,7) + "-" + d.slice(7);
    else if(d.length > 6) out = "(" + d.slice(0,2) + ") " + d.slice(2,6) + "-" + d.slice(6);
    e.target.value = out;
  });

  // ---- validação ----
  var rules = [
    { el:"f-nome",   err:"e-nome",   test:function(v){ return v.trim().length >= 3; }, msg:"Informe seu nome completo." },
    { el:"f-email",  err:"e-email",  test:function(v){ return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim()); }, msg:"Informe um e-mail válido, como nome@exemplo.com." },
    { el:"f-whats",  err:"e-whats",  test:function(v){ return v.replace(/\D/g, "").length >= 10; }, msg:"Informe o WhatsApp com DDD." },
    { el:"f-cidade", err:"e-cidade", test:function(v){ return v.trim().length >= 2; }, msg:"Informe seu município." },
    { el:"f-perfil", err:"e-perfil", test:function(v){ return v !== ""; }, msg:"Escolha como você quer embarcar." },
  ];
  function setErr(input, errId, msg){
    $(errId).textContent = msg || "";
    if(input) input.setAttribute("aria-invalid", msg ? "true" : "false");
  }
  function validate(){
    var problems = [];
    rules.forEach(function(r){
      var el = $(r.el), ok = r.test(el.value);
      setErr(el, r.err, ok ? "" : r.msg);
      if(!ok) problems.push({ el:el, msg:r.msg });
    });
    var rotas = form.querySelectorAll('input[name="rotas"]:checked');
    setErr(null, "e-rotas", rotas.length ? "" : "Marque pelo menos uma rota.");
    if(!rotas.length) problems.push({ el:form.querySelector('input[name="rotas"]'), msg:"Marque pelo menos uma rota." });
    var ok = $("f-ok");
    setErr(ok, "e-ok", ok.checked ? "" : "É preciso concordar para enviarmos sua inscrição.");
    if(!ok.checked) problems.push({ el:ok, msg:"Confirme o uso dos dados para contato." });
    return problems;
  }
  // corrige o erro enquanto a pessoa digita, depois da primeira tentativa
  var tried = false;
  form.addEventListener("input", function(){ if(tried) validate(); });
  form.addEventListener("change", function(){ if(tried) validate(); });

  function collect(){
    var rotas = [].map.call(form.querySelectorAll('input[name="rotas"]:checked'), function(c){ return c.value; });
    return {
      nome: $("f-nome").value.trim(),
      email: $("f-email").value.trim(),
      whatsapp: $("f-whats").value.trim(),
      municipio: $("f-cidade").value.trim(),
      perfil: $("f-perfil").value,
      instituicao: $("f-org").value.trim() || "(pessoa física)",
      rotas: rotas.join(", "),
      mensagem: $("f-msg").value.trim() || "(sem mensagem)",
    };
  }
  function showDone(){
    form.hidden = true; done.hidden = false; done.focus();
    done.scrollIntoView({ block:"start" });
  }
  function mailtoFallback(d){
    var body = "Nome: " + d.nome + "\nE-mail: " + d.email + "\nWhatsApp: " + d.whatsapp + "\nMunicípio: " + d.municipio +
      "\nPerfil: " + d.perfil + "\nInstituição: " + d.instituicao + "\nRotas: " + d.rotas + "\n\n" + d.mensagem;
    try{ navigator.clipboard.writeText(body); }catch(e){}
    location.href = "mailto:" + HUB_EMAIL + "?subject=" + encodeURIComponent("Inscrição no Hub Canoa Grande — " + d.nome) + "&body=" + encodeURIComponent(body);
    status.textContent = "Abrimos seu aplicativo de e-mail com a inscrição pronta: é só enviar. Se nada abriu, o texto foi copiado; cole num e-mail para " + HUB_EMAIL + ".";
  }

  form.addEventListener("submit", function(e){
    e.preventDefault();
    tried = true;
    if(form._gotcha && form._gotcha.value) return; // robô
    var problems = validate();
    if(problems.length){
      summary.hidden = false;
      summary.innerHTML = "<b>Faltam " + problems.length + (problems.length > 1 ? " itens" : " item") + " para enviar:</b><ul>" +
        problems.map(function(p){ return "<li>" + p.msg + "</li>"; }).join("") + "</ul>";
      problems[0].el.focus();
      return;
    }
    summary.hidden = true;
    var data = collect();

    if(!FORM_ENDPOINT){ mailtoFallback(data); return; }

    // Formspree: _subject vira o assunto do e-mail; o campo "email" vira o "responder para"
    var assunto = "Nova inscrição no Hub Canoa Grande — " + data.nome;
    var payload = Object.assign({}, data, { _subject: assunto });
    if(WEB3FORMS_KEY){ payload = Object.assign({}, data, { access_key: WEB3FORMS_KEY, subject: assunto, from_name: "Site Hub Canoa Grande" }); }
    if(FORM_ENDPOINT.indexOf("formsubmit.co") > -1){ payload._template = "table"; payload._captcha = "false"; payload._replyto = data.email; }

    btn.disabled = true; btn.firstChild.textContent = "Enviando… ";
    status.textContent = "";
    fetch(FORM_ENDPOINT, {
      method:"POST",
      headers:{ "Content-Type":"application/json", "Accept":"application/json" },
      body: JSON.stringify(payload),
    }).then(function(r){
      if(!r.ok) throw new Error("HTTP " + r.status);
      return r.json().catch(function(){ return {}; });
    }).then(function(res){
      // FormSubmit responde 200 com success:"false" quando algo falha (ex.: formulário ainda não ativado)
      if(res && (res.success === false || res.success === "false")) throw new Error(res.message || "falhou");
      form.reset(); showDone();
    }).catch(function(){
      status.textContent = "Não conseguimos enviar agora. Verifique sua internet e tente de novo, ou escreva para " + HUB_EMAIL + ".";
    }).finally(function(){
      btn.disabled = false; btn.firstChild.textContent = "Enviar inscrição ";
    });
  });
})();
