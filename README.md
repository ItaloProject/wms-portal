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

## Deploy

### Vercel (recomendado)

O projeto já inclui `vercel.json`. O build usa `base: /` (caminho raiz), ideal para domínio próprio ou `*.vercel.app`.

**Opção 1 — Importar pelo GitHub**

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Importe **ItaloProject/wms-portal**
3. Confirme:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. Clique em **Deploy** (não defina `BASE_PATH`)

**Opção 2 — CLI**

```bash
npm i -g vercel
vercel login
vercel          # preview
vercel --prod   # produção
```

Cada push na `main` pode gerar deploy automático após vincular o repositório na Vercel.

### GitHub Pages (alternativo)

O workflow em `.github/workflows/deploy.yml` publica em:

**https://italoproject.github.io/wms-portal/**

Esse ambiente usa `BASE_PATH=/wms-portal/` no build. Não use essa variável na Vercel.

Build local igual ao GitHub Pages:

```bash
# PowerShell
$env:BASE_PATH="/wms-portal/"; npm run build

# Bash
BASE_PATH=/wms-portal/ npm run build
```

## Estrutura

```
public/          imagens (logo, equipe, Shopping da Ilha)
src/             estilos, scripts e efeitos
scripts/         utilitários (processamento da logo)
index.html       página principal
```
