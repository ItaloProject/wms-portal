# WMS Gerenciamento — Portal Contábil

Portal corporativo do escritório **WMS Gerenciamento** (contabilidade), com sede no Shopping da Ilha — São Luís/MA.

## Desenvolvimento

```bash
npm install
npm run dev       # http://localhost:3456
npm run build     # gera a pasta dist/
npm run preview   # preview da build
npm run process-logo  # recorta fundo da logo (sharp)
```

## Stack

- Vite 6
- HTML + CSS + JavaScript (vanilla)
- Animações leves com CSS e Intersection Observer

## Deploy na Vercel (recomendado)

O projeto já inclui `vercel.json`. A Vercel detecta **Vite** automaticamente.

### Opção 1 — Importar pelo GitHub

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Importe o repositório **ItaloProject/wms-portal**
3. Confirme:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. Clique em **Deploy**

Cada push na branch `main` gera um deploy de produção automaticamente.

### Opção 2 — CLI

```bash
npm i -g vercel
vercel login
vercel link
vercel --prod
```

### Variáveis de ambiente

Não é necessário configurar variáveis para este projeto. O build na Vercel usa `base: '/'` (padrão do Vite).

---

## Deploy (GitHub Pages)

Workflow em `.github/workflows/deploy.yml` — publica em:

**https://italoproject.github.io/wms-portal/**

Build local com o base path da Pages:

```powershell
$env:BASE_PATH="/wms-portal/"; npm run build
```

```bash
BASE_PATH=/wms-portal/ npm run build
```

---

## Estrutura

```
public/          imagens (logo, equipe, Shopping da Ilha)
src/             estilos, scripts e efeitos
scripts/         utilitários (processamento da logo)
index.html       página principal
vercel.json      configuração de deploy na Vercel
```
