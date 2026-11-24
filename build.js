// Gera as páginas do site Hub Canoa Grande. Uso: node build.js <pasta-do-projeto>
const fs = require("fs"), path = require("path");
const OUT = process.argv[2];
const EMAIL = "hubcanoagrandeigarassu@gmail.com";

/* ---------- ícones (traço, 24x24) ---------- */
const I = {
  net:'<circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="18" r="2.5"/><circle cx="19" cy="18" r="2.5"/><path d="M11 7.2L6.3 15.8M13 7.2l4.7 8.6M7.5 18h9"/>',
  hands:'<path d="M3 12l4-4 4 3 2-2 4 4"/><path d="M7 8l-4 4 5 5c1 1 2.5 1 3.5 0l6-6"/><path d="M21 12l-4-4"/>',
  spark:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/>',
  sail:'<path d="M12 3v15"/><path d="M12 4l7 12h-7z"/><path d="M11 7L5 16h6"/><path d="M3 19c3 2 15 2 18 0"/>',
  cap:'<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5"/><path d="M22 9v6"/>',
  compass:'<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  light:'<path d="M9 21l1.5-12h3L15 21z"/><path d="M8 21h8"/><path d="M10 6h4l-.5 3h-3z"/><path d="M12 3v3"/><path d="M4 6l3 1M20 6l-3 1"/>',
  dock:'<path d="M3 13h18"/><path d="M5 13v7M10 13v7M14 13v7M19 13v7"/><path d="M8 13V9h8v4"/><path d="M12 9V4l4 2-4 2"/>',
  mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  pin:'<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  up:'<path d="M12 19V5M5 12l7-7 7 7"/>',
  down:'<path d="M12 5v14M5 12l7 7 7-7"/>',
};
const icon = (k) => `<div class="ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${I[k]}</svg></div>`;

/* ---------- conteúdo ---------- */
const ROTAS = [
  { slug:"ambientes-de-inovacao", nome:"Ambientes de Inovação", apelido:"O estaleiro",
    objetivo:"Fortalecer os mecanismos de inovação do município.",
    kr:"Processo de pré-incubação definido e em funcionamento para Igarassu.",
    sobre:"Como num estaleiro, é aqui que as ideias ganham casco: espaços, processos e apoio para que projetos saiam do papel." },
  { slug:"programas-e-acoes", nome:"Programas e Ações", apelido:"As velas",
    objetivo:"Melhorar a qualidade e ajudar no fomento à formalização de startups no ecossistema de inovação de Igarassu.",
    kr:"Aumentar a maturidade das startups locais.",
    sobre:"As velas são o que fazem o barco andar: programas e ações que dão impulso a quem já está empreendendo." },
  { slug:"ictis", nome:"ICTIs", apelido:"Os faróis",
    objetivo:"Ampliar o número e a participação das ICTIs na implementação da inovação no município.",
    kr:"Realizar 2 projetos de extensão com inovação.",
    sobre:"Instituições científicas, tecnológicas e de inovação iluminam o caminho, levando conhecimento para perto do território." },
  { slug:"politicas-publicas", nome:"Políticas Públicas", apelido:"A carta náutica",
    objetivo:"Fortalecer a normatização para a inovação.",
    kr:"Implementar um pacote de legislação que estimule e incentive o empreendedorismo inovador.",
    sobre:"A carta náutica mostra por onde é seguro navegar: leis e normas que abrem caminho para quem inova." },
  { slug:"capital", nome:"Capital", apelido:"O vento a favor",
    objetivo:"Estruturar a captação de recursos para empreendimentos inovadores.",
    kr:"Ter escritos e aprovados 4 projetos.",
    sobre:"Sem vento, ninguém sai do lugar: esta rota cuida de encontrar e organizar recursos para os projetos do território." },
  { slug:"governanca", nome:"Governança", apelido:"O leme",
    objetivo:"Difundir a inovação no ecossistema municipal e institucionalizar o Canoa Grande.",
    kr:"Plano de comunicação aplicado com, pelo menos, 3 ações em funcionamento. Instância de governança do Hub em funcionamento, com 5 reuniões executadas.",
    sobre:"O leme mantém o rumo: organização, comunicação e acompanhamento para que o Hub siga firme e transparente." },
];

const TRIPULACAO = [
  { ic:"cap", who:"Estudantes", nome:"Os grumetes",
    txt:"Do ensino médio, técnico e superior, em busca de experiência, projetos e orientação para a primeira viagem.",
    gets:["Projetos reais para aprender na prática","Contato com quem já empreende","Orientação para dar os primeiros passos"] },
  { ic:"compass", who:"Empreendedores", nome:"Os capitães",
    txt:"Quem já tem um negócio ou quer começar um, e procura rede, bússola e conhecimento.",
    gets:["Rede de parceiros no território","Apoio para formalizar e amadurecer o negócio","Caminhos para captar recursos"] },
  { ic:"light", who:"Escolas e instituições", nome:"Os faróis",
    txt:"Instituições de ensino que iluminam o caminho e querem aproximar a formação das demandas do território.",
    gets:["Parcerias para projetos de extensão","Aproximação entre formação e mercado","Visibilidade para o que já é feito"] },
  { ic:"dock", who:"Comunidade e poder público", nome:"O cais",
    txt:"Moradores, associações e órgãos que dão base firme para que as ideias atraquem e prosperem.",
    gets:["Participação nas decisões do ecossistema","Diálogo organizado com quem inova","Políticas construídas em conjunto"] },
];

const PILARES = [
  { ic:"net", t:"Articular o ecossistema", p:"Aproximamos estudantes, empreendedores, escolas, instituições e poder público num mesmo porto." },
  { ic:"hands", t:"Remar junto", p:"Acreditamos no trabalho coletivo: cada pessoa traz um remo, e a canoa vai mais longe." },
  { ic:"spark", t:"Transformar ideias em projetos", p:"Oferecemos formação, mentoria e conexões para que boas ideias ganhem casco e saiam do porto." },
  { ic:"sail", t:"Dar vento ao que já existe", p:"Ampliamos a visibilidade e o alcance de iniciativas que já acontecem em Igarassu." },
];

const CICLO = [
  { t:"Ler a maré", p:"Escutamos o território e identificamos os desafios e oportunidades de Igarassu." },
  { t:"Reunir a tripulação", p:"Aproximamos quem tem o desafio de quem tem conhecimento, estrutura ou recurso." },
  { t:"Traçar a rota", p:"Planejamos juntos, em cada eixo, os caminhos possíveis para cada desafio." },
  { t:"Içar as velas", p:"Mobilizamos parceiros, editais e recursos para colocar as ações em movimento." },
  { t:"Conferir o rumo", p:"Acompanhamos os resultados e compartilhamos o que foi feito com todo o ecossistema." },
];

const PASSOS = [
  { t:"Chegue ao porto", p:"Conheça o Hub, veja as rotas e escolha a que mais combina com você." },
  { t:"Avise que vai embarcar", p:"Preencha o formulário contando quem você é, de onde vem e o que quer navegar." },
  { t:"Suba a bordo nos encontros", p:"Venha às atividades, conheça a tripulação e encontre parceiros de travessia." },
  { t:"Aproveite a maré", p:"Use a rede do Hub para testar, ajustar as velas e dar os próximos passos." },
];

/* ---------- projetos (fontes públicas; revise e complete) ---------- */
const CATS = [
  { id:"startups",  nome:"Startups",              apelido:"A frota",          desc:"Empresas inovadoras nascidas ou aceleradas no ecossistema de Igarassu." },
  { id:"formacao",  nome:"Formação e capacitação", apelido:"A escola de remo",  desc:"Programas que preparam jovens e empreendedores para o mercado e para inovar." },
  { id:"municipio", nome:"Projetos no município",  apelido:"O cais",           desc:"Iniciativas com a prefeitura e parceiros que fortalecem o território." },
  { id:"eventos",   nome:"Eventos e conexões",     apelido:"As travessias",     desc:"Desafios de inovação e a presença de Igarassu em outros ecossistemas." },
];
const PROJETOS = [
  // startups
  { cat:"startups", nome:"Sofya For School", tipo:"Startup · educação",
    desc:"Startup local que surgiu no próprio Hub. Ministrou o curso intensivo de tecnologia e inovação para jovens de Igarassu.",
    fonte:"https://igarassu.pe.gov.br/igarassu-oferece-curso-intensivo-para-jovens-interessados-em-inovacao/" },
  { cat:"startups", nome:"Virla", tipo:"Startup · tecnologia",
    desc:"Tecnologia focada em conexões e demandas do território. Selecionada para a rodada de negócios do Rolê REC'n'Play 2026, em Caruaru.",
    fonte:"https://pordentrodetudo2016.wordpress.com/2026/08/14/igarassu-destaca-salto-no-numero-de-startups-durante-o-role-recnplay-em-caruaru/" },
  { cat:"startups", nome:"Projeto Rango", tipo:"Startup · alimentação",
    desc:"Soluções para alimentação e cultura alimentar. Selecionado para a rodada de negócios do Rolê REC'n'Play 2026.",
    fonte:"https://pordentrodetudo2016.wordpress.com/2026/08/14/igarassu-destaca-salto-no-numero-de-startups-durante-o-role-recnplay-em-caruaru/" },
  { cat:"startups", nome:"Capyvara", tipo:"Startup",
    desc:"Representou Igarassu no REC'n'Play Capítulo Saúde, no Recife, ao lado do Hub Canoa Grande.",
    fonte:"https://igarassu.pe.gov.br/igarassu-participa-do-recnplay-capitulo-saude-com-startups-e-hub-canoa-grande/" },
  { cat:"startups", nome:"Tascon", tipo:"Startup",
    desc:"Representou Igarassu no REC'n'Play Capítulo Saúde, no Recife, ao lado do Hub Canoa Grande.",
    fonte:"https://igarassu.pe.gov.br/igarassu-participa-do-recnplay-capitulo-saude-com-startups-e-hub-canoa-grande/" },
  // formação
  { cat:"formacao", nome:"Gera Jovem", tipo:"Programa de qualificação",
    desc:"Programa criado pelo Hub para qualificar jovens conforme a demanda das empresas. Em 2023, 65 participantes foram contratados por fornecedoras do polo automotivo de Goiana. A 14ª edição foi feita com Sebrae e Stellantis.",
    fonte:"https://portaldeprefeitura.com.br/pernambuco/programa-gera-jovem-igarassu-emprega-65-pessoas-apos-oferecer-qualific/500816/" },
  { cat:"formacao", nome:"Curso intensivo de inovação", tipo:"Capacitação",
    desc:"Treinamento em tecnologia e inovação com 80 vagas para jovens moradores de Igarassu, ministrado pela startup Sofya For School.",
    fonte:"https://igarassu.pe.gov.br/igarassu-oferece-curso-intensivo-para-jovens-interessados-em-inovacao/" },
  { cat:"formacao", nome:"Capacitações do CTEN", tipo:"Cursos gratuitos",
    desc:"O Complexo de Tecnologia, Empreendedorismo e Negócios oferece cursos gratuitos de qualificação e já capacitou centenas de jovens da cidade.",
    fonte:"https://portaldeprefeitura.com.br/regiao-metropolitana/igarassu/em-igarassu-programa-do-cten-capacita-mais-de-300-jovens/588816/" },
  // município
  { cat:"municipio", nome:"Hub Mulheres Empreendedoras", tipo:"Empreendedorismo feminino",
    desc:"Espaço criado com o Hub Canoa Grande e o Sebrae para conectar, apoiar e impulsionar as mulheres empreendedoras de Igarassu.",
    fonte:"https://portaldeprefeitura.com.br/regiao-metropolitana/igarassu/prefeitura-de-igarassu-hub-mulheres-empreendedoras/597111/" },
  { cat:"municipio", nome:"Empretec em Igarassu", tipo:"Formação empreendedora",
    desc:"Primeira edição do Empretec na cidade, realizada pela prefeitura em parceria com o Sebrae para fortalecer o empreendedorismo local.",
    fonte:"https://portaldeprefeitura.com.br/pernambuco/em-igarassu-primeiro-empretec-fortalece-empreendedorismo/631841/" },
  { cat:"municipio", nome:"Planejamento do ecossistema de inovação", tipo:"Parceria Prefeitura + Sebrae",
    desc:"Parceria que deu origem ao Hub, com um comitê de quatro hélices: governo municipal, empresas, organizações de apoio e instituições de ensino.",
    fonte:"https://igarassu.pe.gov.br/hub-de-inovacao-trara-melhorias-e-impulsiona-a-tecnologia-em-igarassu/" },
  { cat:"municipio", nome:"IFPE Campus Igarassu", tipo:"Instituição parceira (ICTI)",
    desc:"O Hub Canoa Grande foi lançado no campus, que segue como parceiro e integra a comitiva de Igarassu em eventos de inovação.",
    fonte:"https://portal.ifpe.edu.br/igarassu/noticias/lancado-hub-de-inovacao-canoa-grande-no-ifpe-campus-igarassu/" },
  // eventos
  { cat:"eventos", nome:"Maré de Inovação", tipo:"Ideathon + Hackathon",
    desc:"Desafio de inovação do Hub, com Ideathon e Hackathon abertos a jovens, empreendedores e inovadores. Dá nome à metodologia que ajudou a cidade a chegar a 23 startups.",
    fonte:"https://portaldeprefeitura.com.br/regiao-metropolitana/igarassu/prefeitura-de-igarassu-promove-mare-de-inovacao/598414/" },
  { cat:"eventos", nome:"ELI Summit · Petrolina", tipo:"Agosto de 2026",
    desc:"O Hub apresentou no painel \"Problemas ou Oportunidades\" o case da metodologia Maré de Inovação.",
    fonte:"https://blogdacris.com.br/brasil/estados/pernambuco/em-petrolina-hub-de-igarassu-compartilha-metodo-que-impulsionou-startups-na-cidade/" },
  { cat:"eventos", nome:"Rolê REC'n'Play · Caruaru", tipo:"Agosto de 2026",
    desc:"Comitiva com IFPE e startups locais no Porto Digital Caruaru, com rodada de negócios e apresentação dos resultados do CTEN.",
    fonte:"https://pordentrodetudo2016.wordpress.com/2026/08/14/igarassu-destaca-salto-no-numero-de-startups-durante-o-role-recnplay-em-caruaru/" },
  { cat:"eventos", nome:"REC'n'Play Capítulo Saúde · Recife", tipo:"Conexão com o setor de saúde",
    desc:"Startups de Igarassu participaram de rodadas de negócios com grandes empresas para apresentar soluções a desafios reais.",
    fonte:"https://igarassu.pe.gov.br/igarassu-participa-do-recnplay-capitulo-saude-com-startups-e-hub-canoa-grande/" },
];

/* ---------- peças compartilhadas ---------- */
const NAV = [
  ["index.html","Início"],["o-porto.html","O porto"],["rotas.html","Rotas"],["projetos.html","Projetos"],["como-embarcar.html","Como embarcar"],["contato.html","Contato"],
];
function formBtn(b, label="Quero embarcar", cls="btn"){
  return `<a class="${cls}" data-form href="${b}como-embarcar.html#formulario">${label} <span class="arr" aria-hidden="true">→</span></a>`;
}
function layout({ b="", file, title, desc, body, form=false }){
  const current = file.startsWith("rotas/") ? "rotas.html" : file;
  const nav = NAV.map(([h,l]) => `<a href="${b}${h}"${h===current?' aria-current="page"':''}>${l}</a>`).join("\n      ");
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="theme-color" content="#0b3f37">
<link rel="icon" href="${b}assets/logo.png">
<script>try{var t=localStorage.getItem("hub-theme");if(t)document.documentElement.setAttribute("data-theme",t)}catch(e){}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${b}assets/style.css">
</head>
<body>
<a class="skip" href="#conteudo">Pular para o conteúdo</a>

<header class="top">
  <div class="wrap">
    <a class="brand" href="${b}index.html" aria-label="Hub Canoa Grande — início"><img src="${b}assets/logo.png" alt="Canoa Grande — hub de inovação" width="104" height="46"></a>
    <nav class="main" id="nav" aria-label="Principal">
      ${nav}
      <a class="nav-cta" data-form href="${b}como-embarcar.html#formulario">Quero embarcar →</a>
    </nav>
    <div class="tools">
      ${formBtn(b,"Quero embarcar","btn sm")}
      <button class="icon-btn" id="themeBtn" type="button" aria-label="Alternar tema claro e escuro">◐</button>
      <button class="icon-btn" id="menuBtn" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="nav">☰</button>
    </div>
  </div>
</header>

<main id="conteudo">
${body}
</main>

<footer>
  <div class="wrap">
    <div class="cols">
      <div>
        <img class="logo" src="${b}assets/logo.png" alt="Canoa Grande — hub de inovação" width="117" height="52">
        <p>O porto de inovação de Igarassu. Quem conhece a maré, sabe a hora de zarpar.</p>
      </div>
      <div>
        <h4>Navegue</h4>
        <ul>${NAV.map(([h,l])=>`<li><a href="${b}${h}">${l}</a></li>`).join("")}</ul>
      </div>
      <div>
        <h4>Rotas</h4>
        <ul>${ROTAS.map(r=>`<li><a href="${b}rotas/${r.slug}.html">${r.nome}</a></li>`).join("")}</ul>
      </div>
      <div>
        <h4>Contato</h4>
        <ul><li><a href="mailto:${EMAIL}">${EMAIL.replace("@","@<wbr>")}</a></li><li>Igarassu — PE, Brasil</li><li><a data-form href="${b}como-embarcar.html#formulario">Formulário de embarque</a></li></ul>
      </div>
    </div>
    <div class="base"><span>© 2026 Hub Canoa Grande. Todos os direitos reservados.</span><a href="#conteudo">Voltar ao topo ↑</a></div>
  </div>
</footer>
<script src="${b}assets/main.js"></script>${form?`\n<script src="${b}assets/form.js"></script>`:""}
</body>
</html>
`;
}
const pageHero = (b, crumbs, eyebrow, h1, lead) => `<div class="page-hero">
  <div class="wrap">
    <ol class="crumbs" aria-label="Você está em"><li><a href="${b}index.html">Início</a></li>${crumbs.map(([h,l])=>h?`<li><a href="${b}${h}">${l}</a></li>`:`<li aria-current="page">${l}</li>`).join("")}</ol>
    <span class="eyebrow">${eyebrow}</span>
    <h1>${h1}</h1>
    <p>${lead}</p>
  </div>
</div>`;

const routeCard = (b, r, i) => `<a class="card route" href="${b}rotas/${r.slug}.html">
        <div class="tag">${r.apelido} <i>0${i+1}</i></div>
        <h3>${r.nome}</h3>
        <p>${r.objetivo}</p>
        <div class="kr"><strong>Resultado-chave · até novembro</strong>${r.kr}</div>
        <span class="more">Saiba mais <span class="arr" aria-hidden="true">→</span><span class="skip"> sobre a rota ${r.nome}</span></span>
      </a>`;

const crewCards = () => TRIPULACAO.map(c => `<div class="card crew-card">
        ${icon(c.ic)}
        <span class="who">${c.who}</span><h3>${c.nome}</h3>
        <p>${c.txt}</p>
        <div class="gets"><b>O que encontra aqui</b><ul class="checklist">${c.gets.map(g=>`<li>${g}</li>`).join("")}</ul></div>
      </div>`).join("\n      ");

const pillars = () => PILARES.map(p => `<div class="pillar">${icon(p.ic)}<div><h3>${p.t}</h3><p>${p.p}</p></div></div>`).join("\n      ");
const cycle = () => `<ol class="cycle">${CICLO.map((c,i)=>`<li><span class="n">0${i+1}</span><h3>${c.t}</h3><p>${c.p}</p></li>`).join("")}</ol>
    <p class="note">O Hub Canoa Grande atua como articulador do ecossistema. As ações e programas podem ser executados por instituições parceiras, empresas, organizações sociais, órgãos públicos e pela própria tripulação.</p>`;
const steps = () => `<ol class="steps">${PASSOS.map(s=>`<li><div><h3>${s.t}</h3><p>${s.p}</p></div></li>`).join("")}</ol>`;
const ctaBand = (b) => `<section class="cta-band">
  <div class="wrap">
    <h2>Canoa Grande só zarpa com quem vive Canoa Grande</h2>
    <p>Tem tempo, conhecimento, espaço ou vontade de remar junto? Existe um lugar para você no convés.</p>
    <div class="actions">${formBtn(b)}<a class="btn alt" href="${b}contato.html">Falar com o Hub</a></div>
  </div>
</section>`;

/* ---------- páginas ---------- */
const pages = [];

// INÍCIO
pages.push({ file:"index.html", title:"Hub Canoa Grande — Inovação que navega a partir de Igarassu",
  desc:"O Hub Canoa Grande é o porto onde estudantes, empreendedores, escolas e instituições de Igarassu embarcam juntos rumo a novas ideias.",
  body:(b)=>`<div class="hero">
  <div class="wrap">
    <div>
      <span class="eyebrow">Hub de inovação de Igarassu · PE</span>
      <h1>A maré traz ideias.<br><em>Canoa Grande</em> leva longe.</h1>
      <p class="lead">O porto de Igarassu onde estudantes, empreendedores, escolas e instituições se encontram para remar juntos, aproveitar a maré e levar projetos além da foz.</p>
      <div class="actions">${formBtn(b)}<a class="btn alt" href="rotas.html">Conheça as rotas</a></div>
    </div>
    <div class="scene" aria-hidden="true">
      <div class="sun"></div>
      <svg viewBox="0 0 360 120">
        <g class="canoe">
          <g fill="#0b3f37" stroke="#0b3f37" stroke-width="5" stroke-linecap="round">
            <circle cx="120" cy="32" r="9" stroke="none"/><line x1="120" y1="44" x2="122" y2="70"/>
            <circle cx="180" cy="28" r="9" stroke="none"/><line x1="180" y1="40" x2="182" y2="70"/>
            <circle cx="240" cy="32" r="9" stroke="none"/><line x1="240" y1="44" x2="242" y2="70"/>
          </g>
          <g stroke="#7a4a1c" stroke-width="4" stroke-linecap="round">
            <line x1="104" y1="40" x2="140" y2="104"/><line x1="164" y1="36" x2="200" y2="104"/><line x1="224" y1="40" x2="260" y2="104"/>
          </g>
          <path d="M40 66 Q180 74 320 66 Q300 96 250 98 L110 98 Q60 96 40 66Z" fill="#7a4a1c"/>
          <path d="M40 66 Q180 74 320 66 L314 74 Q180 82 46 74Z" fill="#a8692e"/>
        </g>
        <path d="M0 100 C 60 90, 120 90, 180 100 S 300 110, 360 100 L360 120 L0 120Z" fill="#3fbfa6" opacity=".55"/>
      </svg>
    </div>
  </div>
  <svg class="tide" viewBox="0 0 1200 130" preserveAspectRatio="none" aria-hidden="true">
    <path class="wave" d="M-60 70 C 100 20, 220 20, 380 70 S 660 120, 820 70 S 1100 20, 1260 70 L1260 130 L-60 130Z" fill="#0f6b5c" opacity=".55"/>
    <path class="wave" style="animation-delay:-5s" d="M-60 90 C 120 50, 260 50, 420 90 S 700 130, 860 90 S 1120 50, 1260 90 L1260 130 L-60 130Z" fill="#3fbfa6" opacity=".45"/>
    <path d="M0 108 C 200 80, 340 80, 520 108 S 860 136, 1040 108 S 1160 90, 1200 98 L1200 130 L0 130Z" fill="var(--bg)"/>
  </svg>
</div>

<div class="goals">
  <div class="wrap">
    <div class="panel">
      <p>Onde queremos chegar até novembro</p>
      <ul>
        <li><b>2</b><span>projetos de extensão com inovação junto às ICTIs</span></li>
        <li><b>4</b><span>projetos de captação de recursos escritos e aprovados</span></li>
        <li><b>3</b><span>ações do plano de comunicação em funcionamento</span></li>
        <li><b>5</b><span>reuniões da instância de governança do Hub</span></li>
      </ul>
    </div>
  </div>
</div>

<section id="o-que-e">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">O porto</span>
      <h2>O que é o Hub Canoa Grande?</h2>
      <p>Um porto seguro para quem quer zarpar: o Hub articula o ecossistema de inovação de Igarassu e aproxima quem tem uma ideia de quem pode ajudar a navegá-la.</p>
    </div>
    <div class="grid-2">
      ${pillars()}
    </div>
    <div class="section-foot"><a class="link" href="o-porto.html">Conhecer o porto por dentro <span class="arr" aria-hidden="true">→</span></a></div>
  </div>
</section>

<section class="purpose">
  <div class="wrap">
    <span class="eyebrow">Nosso propósito</span>
    <div>
      <blockquote>Inovar começa pelo lugar onde a gente vive, estuda e trabalha.</blockquote>
      <p>Quem conhece a maré, sabe a hora de zarpar. Nosso compromisso é com as pessoas que vivem, estudam, empreendem e constroem Igarassu todos os dias.</p>
    </div>
  </div>
</section>

<section id="rotas" class="tint">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Rotas</span>
      <h2>Nossas rotas de navegação</h2>
      <p>Seis eixos de trabalho organizam a agenda do Hub. Cada rota tem um objetivo e um resultado que queremos alcançar até novembro.</p>
    </div>
    <div class="grid-3">
      ${ROTAS.map((r,i)=>routeCard(b,r,i)).join("\n      ")}
    </div>
    <div class="section-foot"><a class="btn alt" href="rotas.html">Ver todas as rotas <span class="arr" aria-hidden="true">→</span></a></div>
  </div>
</section>

<section id="tripulacao">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Tripulação</span>
      <h2>Quem faz parte</h2>
      <p>Todo mundo que quer remar a favor do desenvolvimento de Igarassu tem um lugar no convés. Cada parte da tripulação traz algo, e leva algo de volta.</p>
    </div>
    <div class="grid-4">
      ${crewCards()}
    </div>
    <div class="section-foot"><a class="link" href="como-embarcar.html">Ver o que você traz e o que encontra <span class="arr" aria-hidden="true">→</span></a></div>
  </div>
</section>

<section class="tint">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Projetos</span>
      <h2>O que já está navegando</h2>
      <p>De 1 para 23 startups, mais de mil jovens formados: veja algumas das iniciativas do ecossistema de Igarassu.</p>
    </div>
    <div class="grid-4">
      ${CATS.map(c=>`<a class="card proj hover" href="projetos.html#${c.id}"><span class="proj-type">${c.apelido}</span><h3>${c.nome}</h3><p>${c.desc}</p><span class="more link">${PROJETOS.filter(p=>p.cat===c.id).length} iniciativas <span class="arr" aria-hidden="true">→</span></span></a>`).join("\n      ")}
    </div>
    <div class="section-foot"><a class="btn alt" href="projetos.html">Ver todos os projetos <span class="arr" aria-hidden="true">→</span></a></div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Como navegamos</span>
      <h2>Nosso jeito de remar</h2>
      <p>O Hub trabalha em ciclo: escuta o território, reúne quem pode ajudar e acompanha o que foi feito.</p>
    </div>
    ${cycle()}
  </div>
</section>

<section class="tint">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Embarque</span>
      <h2>Como embarcar</h2>
      <p>Quatro passos, do primeiro contato até tirar seu projeto do porto.</p>
    </div>
    ${steps()}
    <div class="section-foot">${formBtn(b,"Preencher o formulário")}<p>Leva cerca de 3 minutos.</p></div>
  </div>
</section>

${ctaBand(b)}`});

// O PORTO
pages.push({ file:"o-porto.html", title:"O porto — Hub Canoa Grande",
  desc:"Conheça o Hub Canoa Grande: o que é, nosso propósito e como navegamos.",
  body:(b)=>`${pageHero(b,[["","O porto"]],"O porto","Um porto seguro para quem quer zarpar","O Hub nasce em Canoa Grande, em Igarassu, para articular o ecossistema municipal de inovação.")}

<section>
  <div class="wrap split">
    <div class="prose">
      <h2>De onde viemos</h2>
      <p>O Hub nasce em Canoa Grande, em Igarassu, para articular o ecossistema municipal de inovação e aproximar quem tem uma ideia de quem pode ajudar a navegá-la: formação, mentoria, conexões e um cais onde todo mundo trabalha em conjunto.</p>
      <p>Aqui, o aluno do ensino técnico conversa com quem já empreende. A escola encontra parceiros de travessia. O negócio do bairro ganha vento a favor. E o conhecimento circula como a maré, indo e voltando, sempre renovando o território.</p>
    </div>
    <blockquote class="quote">Inovar começa pelo lugar onde a gente vive, estuda e trabalha. Quem conhece a maré, sabe a hora de zarpar.</blockquote>
  </div>
</section>

<section class="tint">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">O que fazemos</span>
      <h2>Quatro compromissos do Hub</h2>
    </div>
    <div class="grid-2">
      ${pillars()}
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Como navegamos</span>
      <h2>Nosso jeito de remar</h2>
      <p>O Hub trabalha em ciclo: escuta o território, reúne quem pode ajudar e acompanha o que foi feito.</p>
    </div>
    ${cycle()}
  </div>
</section>

${ctaBand(b)}`});

// ROTAS (lista)
pages.push({ file:"rotas.html", title:"Rotas — Hub Canoa Grande",
  desc:"Os seis eixos de trabalho do Hub Canoa Grande, com objetivos e resultados-chave.",
  body:(b)=>`${pageHero(b,[["","Rotas"]],"Rotas","Nossas rotas de navegação","Seis eixos de trabalho organizam a agenda do Hub. Cada rota reúne pessoas e instituições em torno de um objetivo e de um resultado que queremos alcançar até novembro.")}

<section>
  <div class="wrap">
    <div class="grid-3">
      ${ROTAS.map((r,i)=>routeCard(b,r,i)).join("\n      ")}
    </div>
  </div>
</section>

${ctaBand(b)}`});

// ROTAS (uma página por rota)
ROTAS.forEach((r,i)=>{
  const prev = ROTAS[i-1], next = ROTAS[i+1];
  pages.push({ file:`rotas/${r.slug}.html`, b:"../", title:`${r.nome} — Rotas — Hub Canoa Grande`,
    desc:`Rota ${r.nome} do Hub Canoa Grande: ${r.objetivo}`,
    body:(b)=>`${pageHero(b,[["rotas.html","Rotas"],["",r.nome]],`Rota 0${i+1} · ${r.apelido}`,r.nome,r.sobre)}

<section>
  <div class="wrap route-detail">
    <div>
      <h2>Objetivo</h2>
      <p class="prose" style="font-size:1.15rem">${r.objetivo}</p>
      <h2 style="margin-top:var(--s7)">Resultado-chave</h2>
      <div class="kr"><strong>Previsto até novembro</strong>${r.kr}</div>
      <nav class="pager" aria-label="Outras rotas">
        ${prev?`<a href="${prev.slug}.html"><small>← Rota anterior</small><b>${prev.nome}</b></a>`:`<a href="../rotas.html"><small>← Voltar</small><b>Todas as rotas</b></a>`}
        ${next?`<a class="next" href="${next.slug}.html"><small>Próxima rota →</small><b>${next.nome}</b></a>`:`<a class="next" href="../rotas.html"><small>Ver tudo →</small><b>Todas as rotas</b></a>`}
      </nav>
    </div>
    <aside class="card aside-card">
      <h3>Quer remar nesta rota?</h3>
      <p>Preencha o formulário de embarque e conte como você pode contribuir com ${r.apelido.toLowerCase()}. Esta rota já vem marcada.</p>
      <a class="btn" href="${b}como-embarcar.html?rota=${r.slug}#formulario">Quero embarcar <span class="arr" aria-hidden="true">→</span></a>
    </aside>
  </div>
</section>

<section class="tint">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">Outras rotas</span><h2>Continue navegando</h2></div>
    <div class="grid-3">
      ${ROTAS.map((o,j)=>[o,j]).filter(([o])=>o!==r).slice(0,3).map(([o,j])=>routeCard(b,o,j)).join("\n      ")}
    </div>
  </div>
</section>`});
});

// PROJETOS
const projCard = (p) => `<article class="card proj" data-cat="${p.cat}">
        <span class="proj-type">${p.tipo}</span>
        <h3>${p.nome}</h3>
        <p>${p.desc}</p>
        <a class="link proj-src" href="${p.fonte}" target="_blank" rel="noopener">Ver notícia <span class="arr" aria-hidden="true">↗</span><span class="skip"> sobre ${p.nome} (abre em nova aba)</span></a>
      </article>`;
pages.push({ file:"projetos.html", title:"Projetos — Hub Canoa Grande",
  desc:"Startups, programas de formação, projetos no município e eventos do ecossistema de inovação de Igarassu.",
  body:(b)=>`${pageHero(b,[["","Projetos"]],"Projetos","O que já está navegando em Igarassu","Startups, programas de formação, projetos no município e travessias por outros ecossistemas: a frota que o Hub Canoa Grande ajuda a colocar no mar.")}

<div class="goals">
  <div class="wrap">
    <div class="panel">
      <p>O ecossistema em números, segundo a Prefeitura de Igarassu</p>
      <ul>
        <li><b>23</b><span>startups ativas no portfólio do CTEN</span></li>
        <li><b>1.006</b><span>jovens formados pelo Gera Jovem</span></li>
        <li><b>306</b><span>empregos diretos gerados pelo programa</span></li>
        <li><b>1º</b><span>hub de inovação do Litoral Norte de Pernambuco</span></li>
      </ul>
    </div>
  </div>
</div>

<section class="proj-section">
  <div class="wrap">
    <div class="filters" role="group" aria-label="Filtrar projetos por categoria">
      <button type="button" class="chip" aria-pressed="true" data-filter="todos">Todos <span>${PROJETOS.length}</span></button>
      ${CATS.map(c=>`<button type="button" class="chip" aria-pressed="false" data-filter="${c.id}">${c.nome} <span>${PROJETOS.filter(p=>p.cat===c.id).length}</span></button>`).join("\n      ")}
    </div>
    <p class="filter-status skip" id="filterStatus" role="status"></p>

    ${CATS.map(c=>`<div class="proj-group" id="${c.id}" data-group="${c.id}">
      <div class="group-head"><span class="eyebrow">${c.apelido}</span><h2>${c.nome}</h2><p>${c.desc}</p></div>
      <div class="grid-3">
      ${PROJETOS.filter(p=>p.cat===c.id).map(projCard).join("\n      ")}
      ${c.id==="startups"?`<a class="card proj proj-cta" data-cat="startups" href="${b}como-embarcar.html#formulario"><span class="proj-type">E mais ${23-PROJETOS.filter(p=>p.cat==="startups").length} no portfólio do CTEN</span><h3>Sua startup é de Igarassu?</h3><p>Queremos conhecer e mostrar quem está inovando na cidade.</p><span class="link">Embarque no Hub <span class="arr" aria-hidden="true">→</span></span></a>`:""}
      </div>
    </div>`).join("\n\n    ")}

    <p class="note">As informações desta página vêm de notícias públicas da Prefeitura de Igarassu e de veículos de imprensa. Tem um projeto que deveria estar aqui? <a href="${b}contato.html">Fale com a gente</a>.</p>
  </div>
</section>

${ctaBand(b)}`});

// COMO EMBARCAR
pages.push({ file:"como-embarcar.html", title:"Como embarcar — Hub Canoa Grande",
  desc:"Saiba como participar do Hub Canoa Grande e preencha o formulário de embarque.", form:true,
  body:(b)=>`${pageHero(b,[["","Como embarcar"]],"Como embarcar","Existe um lugar para você no convés","Embarcar é simples: conte quem você é, escolha as rotas que mais combinam com você e diga como pode contribuir.")}

<section class="tint">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">Passo a passo</span><h2>Do porto ao mar aberto</h2></div>
    ${steps()}
  </div>
</section>

<section>
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Via de mão dupla</span>
      <h2>O que você traz, o que você encontra</h2>
      <p>Participar não é doar tempo a fundo perdido. Quem rema junto também chega mais longe.</p>
    </div>
    <div class="exchange">
      <div class="card"><h3>${icon("up").replace('class="ico"','class="ico"')} O que você traz</h3><ul class="checklist">
        <li>Ideias, desafios e demandas reais</li><li>Tempo e disposição para participar dos encontros</li><li>Conhecimento, experiência e competências</li><li>Espaços, estrutura ou recursos</li><li>Conexões com outras pessoas e instituições</li></ul></div>
      <div class="card"><h3>${icon("down")} O que você encontra</h3><ul class="checklist">
        <li>Uma rede de parceiros no território</li><li>Formação, mentoria e orientação</li><li>Apoio para formalizar e amadurecer projetos</li><li>Caminhos para captar recursos</li><li>Visibilidade para o que você já faz</li></ul></div>
    </div>
    <div style="margin-top:var(--s7)">
      <h2 style="font-size:1.4rem">Quem pode embarcar</h2>
      <div class="grid-4">
        ${crewCards()}
      </div>
    </div>
  </div>
</section>

<section id="formulario" class="tint">
  <div class="wrap form-layout">
    <div class="form-intro">
      <span class="eyebrow">Formulário de embarque</span>
      <h2>Avise que vai embarcar</h2>
      <p>Leva cerca de 3 minutos. A tripulação do Hub lê cada resposta e entra em contato pelo e-mail ou WhatsApp informado.</p>
      <ul class="checklist">
        <li>Você pode participar como pessoa ou representando uma instituição.</li>
        <li>Pode escolher mais de uma rota.</li>
        <li>Os campos com <b>*</b> são obrigatórios.</li>
      </ul>
    </div>

    <form id="embarque" class="hub-form card" novalidate>
      <div class="form-summary" id="formSummary" role="alert" tabindex="-1" hidden></div>

      <fieldset>
        <legend><span>1</span> Seus dados</legend>
        <div class="row">
          <div class="field"><label for="f-nome">Nome completo *</label>
            <input id="f-nome" name="nome" autocomplete="name" required aria-describedby="e-nome"><p class="err" id="e-nome"></p></div>
          <div class="field"><label for="f-email">E-mail *</label>
            <input id="f-email" name="email" type="email" autocomplete="email" required aria-describedby="e-email"><p class="err" id="e-email"></p></div>
        </div>
        <div class="row">
          <div class="field"><label for="f-whats">WhatsApp *</label>
            <input id="f-whats" name="whatsapp" type="tel" inputmode="tel" autocomplete="tel" placeholder="(81) 9 9999-9999" required aria-describedby="h-whats e-whats"><p class="hint" id="h-whats">Com DDD.</p><p class="err" id="e-whats"></p></div>
          <div class="field"><label for="f-cidade">Município *</label>
            <input id="f-cidade" name="municipio" autocomplete="address-level2" value="Igarassu" required aria-describedby="e-cidade"><p class="err" id="e-cidade"></p></div>
        </div>
      </fieldset>

      <fieldset>
        <legend><span>2</span> Seu vínculo</legend>
        <div class="row">
          <div class="field"><label for="f-perfil">Como você quer embarcar? *</label>
            <select id="f-perfil" name="perfil" required aria-describedby="e-perfil">
              <option value="">Selecione uma opção</option>
              <option>Estudante</option>
              <option>Empreendedor(a) ou startup</option>
              <option>Escola ou instituição de ensino e pesquisa</option>
              <option>Poder público</option>
              <option>Comunidade, associação ou coletivo</option>
              <option>Outro</option>
            </select><p class="err" id="e-perfil"></p></div>
          <div class="field"><label for="f-org">Instituição, escola ou negócio</label>
            <input id="f-org" name="instituicao" autocomplete="organization" aria-describedby="h-org"><p class="hint" id="h-org">Se participa como pessoa, deixe em branco.</p></div>
        </div>
      </fieldset>

      <fieldset aria-describedby="e-rotas">
        <legend><span>3</span> Rotas de interesse *</legend>
        <p class="hint" style="margin-top:0">Marque uma ou mais.</p>
        <div class="choices">
          ${ROTAS.map(r=>`<label class="choice"><input type="checkbox" name="rotas" value="${r.nome}" data-slug="${r.slug}"><span><b>${r.nome}</b><small>${r.apelido}</small></span></label>`).join("\n          ")}
        </div>
        <p class="err" id="e-rotas"></p>
      </fieldset>

      <fieldset>
        <legend><span>4</span> Sua contribuição</legend>
        <div class="field"><label for="f-msg">Como você quer contribuir ou o que quer navegar com o Hub?</label>
          <textarea id="f-msg" name="mensagem" rows="5" placeholder="Conte sua ideia, seu projeto ou o que você pode oferecer: tempo, conhecimento, espaço, contatos…"></textarea></div>
      </fieldset>

      <label class="consent"><input type="checkbox" id="f-ok" name="consentimento" value="sim" required aria-describedby="e-ok">
        <span>Concordo que o Hub Canoa Grande use estes dados apenas para entrar em contato comigo sobre a participação. *</span></label>
      <p class="err" id="e-ok"></p>

      <input class="trap" type="text" name="_gotcha" tabindex="-1" autocomplete="off" aria-hidden="true">
      <button class="btn" type="submit" id="sendBtn">Enviar inscrição <span class="arr" aria-hidden="true">→</span></button>
      <p class="form-status" id="formStatus" role="status"></p>
    </form>

    <div class="form-done card" id="formDone" tabindex="-1" hidden>
      ${icon("sail")}
      <h2>Inscrição recebida!</h2>
      <p>Obrigado por embarcar. A tripulação do Hub vai entrar em contato em breve pelo e-mail ou WhatsApp que você informou.</p>
      <a class="btn alt" href="${b}rotas.html">Enquanto isso, conheça as rotas</a>
    </div>
  </div>
</section>`});

// CONTATO
pages.push({ file:"contato.html", title:"Contato — Hub Canoa Grande",
  desc:"Fale com a equipe do Hub Canoa Grande, em Igarassu (PE).",
  body:(b)=>`${pageHero(b,[["","Contato"]],"Contato","Fale com a tripulação","Dúvidas, parcerias ou ideias? Escreva para a gente. Para participar do Hub, use o formulário de embarque.")}

<section>
  <div class="wrap">
    <div class="grid-3">
      <div class="card contact-card">${icon("mail")}<div><h3>E-mail</h3><p><a href="mailto:${EMAIL}">${EMAIL}</a></p></div></div>
      <div class="card contact-card">${icon("pin")}<div><h3>Onde estamos</h3><p>Canoa Grande, Igarassu — Pernambuco, Brasil</p></div></div>
      <div class="card contact-card">${icon("sail")}<div><h3>Quer participar?</h3><p>Preencha o <a data-form href="${b}como-embarcar.html#formulario">formulário de embarque</a>.</p></div></div>
    </div>
  </div>
</section>

${ctaBand(b)}`});

/* ---------- gravação ---------- */
for(const p of pages){
  const b = p.b || "";
  const html = layout({ b, file:p.file, title:p.title, desc:p.desc, body:p.body(b), form:!!p.form });
  const dest = path.join(OUT, p.file);
  fs.mkdirSync(path.dirname(dest), { recursive:true });
  fs.writeFileSync(dest, html);
  console.log("ok", p.file);
}
