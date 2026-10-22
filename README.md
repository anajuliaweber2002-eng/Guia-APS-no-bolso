# Kit APS de bolso

App web (PWA) com modelos SOAP, calculadoras e prescrições para a Atenção Primária. Funciona offline e pode ser instalado no celular ("Adicionar à tela inicial").

## Publicar uma atualização
1. Atualize o HTML do Kit e rode `python3 tools/build.py <kit-aps.html>` (mantém manifest e service worker).
2. Aumente `VERSION` em `sw.js` (ex.: `2026-10-21.1`). Sem isso, quem já instalou continua vendo a versão antiga até ficar online e recarregar.
3. Faça commit na branch `main`; o GitHub Pages publica em ~1 min.

Os textos que a pessoa edita dentro do app (modelos SOAP) ficam salvos só naquele navegador/aparelho.

## IA (opcional)
O botão **IA** no topo abre a tela da IA (só no app, não no artifact). Ela fala com um servidor seu no Cloudflare (`ia/worker.js`), que guarda a chave da API do Claude. Antes de enviar, o app troca nome, CPF, cartão SUS, telefone, e-mail, endereço, CEP, data de nascimento e números longos por marcadores e os recoloca na resposta no aparelho. O endereço do servidor e o código de acesso ficam em `kitaps:ia:cfg`, e o histórico (7 dias) em `kitaps:ia:hist`; nenhum dos dois entra no backup.
O código da IA fica depois do botão `upd` no fim do `index.html`, então `tools/build.py` o preserva.
