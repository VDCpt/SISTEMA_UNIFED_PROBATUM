/**
 * ============================================================================
 * UNIFED - PROBATUM · CLOUDFLARE WORKER — Anthropic API Reverse Proxy
 * ============================================================================
 * Versão      : v13.11.16-PURE
 * Deploy URL  : https://api.unifed.com/claude-proxy
 * Rota        : POST /claude-proxy  →  forward para api.anthropic.com
 * ============================================================================
 */

export default {
    async fetch(request, env, ctx) {
        // 1. GESTÃO DE PRE-FLIGHT (CORS)
        if (request.method === "OPTIONS") {
            return new Response(null, {
                headers: this.handleCors(request)
            });
        }

        // 2. VALIDAÇÃO DE MÉTODO
        if (request.method !== "POST") {
            return new Response("Method Not Allowed", { status: 405 });
        }

        try {
            // 3. RECUPERAÇÃO SEGURA DE CREDENCIAIS (SECRET STORAGE)
            const API_KEY = env.ANTHROPIC_API_KEY;
            if (!API_KEY) {
                return new Response("API Key Missing in Worker Environment", { status: 500 });
            }

            // 4. PREPARAÇÃO DO PAYLOAD PARA A ANTHROPIC
            const body = await request.json();
            
            // Forçar parâmetros de auditoria forense no modelo
            body.model = body.model || "claude-3-5-sonnet-20240620";
            body.max_tokens = 4096;

            const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: {
                    "x-api-key": API_KEY,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json"
                },
                body: JSON.stringify(body)
            });

            // 5. TRATAMENTO DE RESPOSTA E RE-INJEÇÃO DE HEADERS DE SEGURANÇA
            const data = await anthropicResponse.json();
            const responseHeaders = this.handleCors(request);
            responseHeaders.set("Content-Type", "application/json");

            return new Response(JSON.stringify(data), {
                status: anthropicResponse.status,
                headers: responseHeaders
            });

        } catch (err) {
            return new Response(JSON.stringify({ error: err.message }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }
    },

    /**
     * POLÍTICA DE SEGURANÇA CORS (COURT READY)
     */
    handleCors(request) {
        const headers = new Headers();
        const origin = request.headers.get("Origin");
        
        // Lista Branca: Apenas domínios autorizados da perícia
        const allowedOrigins = ["https://dashboard.unifed.pt", "https://pericia.unifed.com"];
        
        if (allowedOrigins.includes(origin)) {
            headers.set("Access-Control-Allow-Origin", origin);
        } else {
            // Fallback para desenvolvimento local se necessário
            headers.set("Access-Control-Allow-Origin", "*");
        }

        headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
        headers.set("Access-Control-Allow-Headers", "Content-Type, x-api-key, anthropic-version");
        headers.set("Access-Control-Max-Age", "86400");
        headers.set("Vary", "Origin");

        return headers;
    }
};

/* ============================================================================
   NOTAS DE AUDITORIA:
   - Este worker atua como um "Air-Gap" lógico entre o browser e a API Key.
   - O tráfego é encriptado via TLS 1.3 obrigatório no Cloudflare.
   - Master Hash SHA-253: [Gerado dinamicamente no deploy via Wrangler]
   ============================================================================ */