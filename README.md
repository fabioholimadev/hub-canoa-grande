# Hub Canoa Grande

Site do **Hub Canoa Grande**, o hub de inovação de Igarassu (PE).

Site estático (HTML, CSS e JavaScript puros), sem dependências.

## Estrutura

| Caminho | O que é |
|---|---|
| `index.html`, `o-porto.html`, `rotas.html`, `projetos.html`, `como-embarcar.html`, `contato.html` | Páginas do site |
| `rotas/` | Uma página para cada rota (eixo de trabalho) |
| `assets/style.css` | Cores, fontes, espaçamentos e todo o visual |
| `assets/main.js` | Menu do celular, tema claro/escuro e filtro de projetos |
| `assets/form.js` | Formulário de embarque (envio por e-mail) |
| `build.js` | Gerador das páginas: cabeçalho, rodapé, textos, rotas e projetos |

## Editar textos, rotas ou projetos

Os textos ficam em `build.js`. Depois de editar, gere as páginas de novo:

```bash
node build.js .
```

> Não edite os arquivos `.html` direto: eles são sobrescritos pelo `build.js`.

## Formulário

As inscrições são enviadas pelo [FormSubmit](https://formsubmit.co) para o e-mail do Hub.
Na primeira inscrição chega um e-mail de ativação: clique em **Activate Form** uma vez.
Para trocar de serviço (Formspree, Web3Forms), edite `FORM_ENDPOINT` no topo de `assets/form.js`.

## Rodar localmente

```bash
npx http-server -p 5500
```

## Hospedagem

O arquivo `render.yaml` configura o site no [Render](https://render.com) como site estático:
no painel, **New > Blueprint** e escolha este repositório.
