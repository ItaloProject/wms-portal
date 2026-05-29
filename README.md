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

## Deploy (GitHub Pages)

O workflow em `.github/workflows/deploy.yml` publica automaticamente a branch `main` em:

**https://italoproject.github.io/wms-portal/**

Para publicar:

1. Faça push na branch `main`
2. Em **Settings → Pages** do repositório, confirme que a origem é **GitHub Actions**

Build local com o mesmo base path da Pages:

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
