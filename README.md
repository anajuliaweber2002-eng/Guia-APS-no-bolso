# Kit APS de bolso

App web (PWA) com modelos SOAP, calculadoras e prescrições para a Atenção Primária. Funciona offline e pode ser instalado no celular ("Adicionar à tela inicial").

## Publicar uma atualização
1. Atualize o HTML do Kit e rode `python3 tools/build.py <kit-aps.html>` (mantém manifest e service worker).
2. Aumente `VERSION` em `sw.js` (ex.: `2026-10-21.1`). Sem isso, quem já instalou continua vendo a versão antiga até ficar online e recarregar.
3. Faça commit na branch `main`; o GitHub Pages publica em ~1 min.

Os textos que a pessoa edita dentro do app (modelos SOAP) ficam salvos só naquele navegador/aparelho.
