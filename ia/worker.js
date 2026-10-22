/* Kit APS: servidor da IA (Cloudflare Worker).
   Guarda a chave da API do Claude e repassa os pedidos do app. Não grava nada.
   Precisa de dois segredos no Cloudflare (Settings > Variables and Secrets):
     ANTHROPIC_API_KEY  a chave criada em platform.claude.com
     CODIGO_APP         uma senha inventada por você, digitada uma vez no app */

const MODELO = 'claude-opus-5-5';
const ORIGENS = ['https://anajuliaweber2002-eng.github.io'];

export default {
  async fetch(req, env) {
    const origin = req.headers.get('Origin') || '';
    const cors = {
      'Access-Control-Allow-Origin': ORIGENS.includes(origin) ? origin : ORIGENS[0],
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Codigo',
      'Access-Control-Max-Age': '86400',
      'Vary': 'Origin',
    };
    const erro = (status, msg) => new Response(JSON.stringify({erro: msg}), {status, headers: {...cors, 'Content-Type': 'application/json'}});

    if (req.method === 'OPTIONS') return new Response(null, {status: 204, headers: cors});
    if (req.method !== 'POST') return erro(405, 'O servidor da IA está no ar. Use pelo app.');
    if (!ORIGENS.includes(origin)) return erro(403, 'Origem não permitida');
    if (!env.ANTHROPIC_API_KEY || !env.CODIGO_APP) return erro(500, 'Falta configurar ANTHROPIC_API_KEY ou CODIGO_APP no Cloudflare');
    if ((req.headers.get('X-Codigo') || '') !== env.CODIGO_APP) return erro(401, 'Código de acesso errado');

    const bruto = await req.text();
    if (bruto.length > 200000) return erro(413, 'Texto grande demais');
    let b;
    try { b = JSON.parse(bruto) } catch (e) { return erro(400, 'Pedido inválido') }
    if (typeof b.system !== 'string' || !Array.isArray(b.messages) || !b.messages.length) return erro(400, 'Pedido inválido');

    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2026-10-21',
        'anthropic-beta': 'server-side-fallback-2026-07-01',
      },
      body: JSON.stringify({
        model: MODELO,
        max_tokens: 16000,
        stream: true,
        fallbacks: 'default',
        output_config: {effort: ['low', 'medium', 'high'].includes(b.effort) ? b.effort : 'medium'},
        system: b.system,
        messages: b.messages.map(m => ({role: m.role === 'assistant' ? 'assistant' : 'user', content: String(m.content)})),
      }),
    });
    if (!resp.ok) {
      let msg = '';
      try { msg = (await resp.json()).error.message } catch (e) {}
      return erro(resp.status, 'Erro da API do Claude (' + resp.status + ')' + (msg ? ': ' + msg : ''));
    }
    return new Response(resp.body, {headers: {...cors, 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-store'}});
  },
};
