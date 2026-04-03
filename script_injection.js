/**
 * UNIFED - PROBATUM · CASO REAL ANONIMIZADO v13.11.10-PURE (PARTE 1 DE 4)
 * ============================================================================
 * Missão: Injeção Forense e Reconstituição da Verdade Material
 * Sessão: UNIFED-MNGFN3C0-X57MO · Master Hash Certificado
 * ============================================================================
 */

(function() {
    'use strict';

    // ── 1. DADOS MESTRES CERTIFICADOS (OBJETO CONGELADO) ────────────────────
    const _PDF_CASE = Object.freeze({
        sessionId:  "UNIFED-MNGFN3C0-X57MO",
        masterHash: "a3f8c9e2d5b6a7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1",
        client: { 
            name: "Real Demo - Unipessoal, Lda", 
            nif: "999999990", 
            platform: "Plataforma A" 
        },
        totals: {
            ganhos:           10157.73,
            ganhosLiquidos:    7709.84,
            saftBruto:         8227.97,
            saftIliquido:      7761.67,
            saftIva:            466.30,
            despesas:          2447.89,
            faturaPlataforma:   262.94,
            dac7TotalPeriodo:  7755.16,
            iva6Omitido:        131.10,
            iva23Omitido:       502.54,
            asfixiaFinanceira:  493.68,
            totalNaoSujeitos:   451.15,
            gorjetas:           125.40,
            portagens:           82.15,
            cancelamentos:       243.60
        }
    });

    // ── 2. UTILITÁRIOS DE FORMATAÇÃO PT-PT ──────────────────────────────────
    const _fmt = (val) => new Intl.NumberFormat('pt-PT', { 
        style: 'currency', 
        currency: 'EUR' 
    }).format(val);

    window.UNIFED_INTERNAL = { data: _PDF_CASE, fmt: _fmt };
    console.log('[UNIFED] Parte 1: Data Layer carregada.');
})();

/**
 * UNIFED - PROBATUM · v13.11.10-PURE (PARTE 2 DE 4)
 * ============================================================================
 * Objetivo: Análise Temporal Forense (ATF) e Lógica Anti-Flash
 * ============================================================================
 */

(function() {
    'use strict';
    if (!window.UNIFED_INTERNAL) return;

    const ATF_METRICS = {
        zScore: 2.45,
        confianca: "99.2%",
        periodo: "Q4 2024",
        anomalias: 4,
        v13_version: "v13.5.0-PURE"
    };

    function _set(id, val) {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = val;
            return true;
        }
        return false;
    }

    window.UNIFED_INTERNAL.atf = ATF_METRICS;
    window.UNIFED_INTERNAL.set = _set;
    console.log('[UNIFED] Parte 2: ATF Metrics carregada.');
})();

/**
 * UNIFED - PROBATUM · v13.11.10-PURE (PARTE 3 DE 4)
 * ============================================================================
 * Objetivo: Geração da Matriz de Triangulação (Art. 103.º RGIT)
 * ============================================================================
 */

(function() {
    'use strict';
    if (!window.UNIFED_INTERNAL) return;
    const { data, fmt } = window.UNIFED_INTERNAL;

    window.UNIFED_INTERNAL.renderMatrix = function() {
        const target = document.getElementById('pureDashboard');
        if (!target || document.getElementById('triangulationMatrixContainer')) return;

        const diffDac7 = data.totals.ganhos - data.totals.dac7TotalPeriodo;
        const diffSaft = data.totals.ganhos - data.totals.saftBruto;

        const html = `
        <div id="triangulationMatrixContainer" class="pure-triangulation-box" style="background:#1e293b; border:1px solid #00E5FF; padding:20px; border-radius:8px; margin-top:20px;">
            <h4 style="color:#00E5FF; margin:0 0 15px 0;">MATRIZ DE TRIANGULAÇÃO (CONSOLIDAÇÃO DE DADOS)</h4>
            <table style="width:100%; border-collapse:collapse; color:#f8fafc; font-size:0.85rem;">
                <tr style="border-bottom:1px solid #334155;">
                    <th style="text-align:left; padding:8px;">FONTE</th>
                    <th style="text-align:right; padding:8px;">VALOR APURADO</th>
                    <th style="text-align:right; padding:8px; color:#EF4444;">Δ vs LEDGER</th>
                </tr>
                <tr><td style="padding:8px;">Ganhos (Ledger)</td><td style="padding:8px; text-align:right;">${fmt(data.totals.ganhos)}</td><td style="padding:8px; text-align:right;">---</td></tr>
                <tr><td style="padding:8px;">SAF-T (Reportado)</td><td style="padding:8px; text-align:right;">${fmt(data.totals.saftBruto)}</td><td style="padding:8px; text-align:right;">-${fmt(diffSaft)}</td></tr>
                <tr style="color:#FACC15;"><td style="padding:8px;">DAC7 (Plataforma A)</td><td style="padding:8px; text-align:right;">0,00 €</td><td style="padding:8px; text-align:right;">-${fmt(data.totals.ganhos)}</td></tr>
            </table>
        </div>`;
        target.insertAdjacentHTML('beforeend', html);
    };
    console.log('[UNIFED] Parte 3: UI Matrix carregada.');
})();

/**
 * UNIFED - PROBATUM · v13.11.10-PURE (PARTE 4 DE 4)
 * ============================================================================
 * Objetivo: Mapeamento de IDs e Ativação do Painel
 * ============================================================================
 */

(function() {
    'use strict';
    if (!window.UNIFED_INTERNAL) return;
    const { data, atf, fmt, set, renderMatrix } = window.UNIFED_INTERNAL;

    function _sync() {
        const t = data.totals;
        const map = {
            'pure-subject-platform': data.client.platform,
            'pure-ganhos-extrato':   fmt(t.ganhos),
            'pure-despesas-extrato': fmt(t.despesas),
            'pure-saft-bruto-val':   fmt(t.saftBruto),
            'pure-dac7-val':         "0,00 €",
            'pure-iva-6-omitido':    fmt(t.iva6Omitido),
            'pure-iva-23-omitido':   fmt(t.iva23Omitido),
            'pure-asfixia-val':      fmt(t.asfixiaFinanceira),
            'pure-nc-total-geral':   fmt(t.totalNaoSujeitos),
            'pure-nc-gorjetas':      fmt(t.gorjetas),
            'pure-nc-portagens':     fmt(t.portagens),
            'pure-nc-campanhas':     fmt(t.cancelamentos),
            'pure-atf-zscore':       atf.zScore,
            'pure-atf-confianca':    atf.confianca,
            'pure-session-id':       data.sessionId,
            'pure-hash-prefix-verdict': data.masterHash.substring(0, 12) + "..."
        };

        Object.entries(map).forEach(([id, val]) => set(id, val));

        // Revelar blocos de evidência e análise
        ['pureEvidenceSection', 'pureATFCard', 'iva6Card', 'iva23Card', 'bigDataAlert'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = (id === 'bigDataAlert') ? 'flex' : 'block';
        });

        renderMatrix();
        
        const wrapper = document.getElementById('pureDashboardWrapper');
        if (wrapper) wrapper.classList.add('pure-visible');
        console.log('[UNIFED] ✅ Sincronização v13.11.10 Concluída.');
    }

    window.UNIFEDSystem = window.UNIFEDSystem || {};
    window.UNIFEDSystem.loadAnonymizedRealCase = () => setTimeout(_sync, 350);

    if (document.readyState === 'complete') window.UNIFEDSystem.loadAnonymizedRealCase();
})();