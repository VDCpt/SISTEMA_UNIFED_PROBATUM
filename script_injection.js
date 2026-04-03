/**
 * UNIFED - PROBATUM · CASO REAL ANONIMIZADO v13.11.10-PURE (PARTE 1 DE 4)
 * ============================================================================
 * Missão: Injeção Forense e Reconstituição da Verdade Material
 * Conformidade: DORA (UE) 2022/2554 · Art. 125.º CPP · ISO/IEC 27037:2012
 * ============================================================================
 */

(function() {
    'use strict';

    // 1. DATASET MESTRE (OBJETO IMUTÁVEL)
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
            dac7TotalPeriodo:  0.00, // Forçado 0.00 para demonstração de omissão DAC7
            iva6Omitido:        131.10,
            iva23Omitido:       502.54,
            asfixiaFinanceira:  493.68,
            totalNaoSujeitos:   451.15,
            gorjetas:           125.40,
            portagens:           82.15,
            cancelamentos:       243.60
        },
        atf: {
            zScore: 2.45,
            confianca: "99.2%",
            periodo: "Q4 2024",
            anomalias: 4,
            version: "v13.5.0-PURE"
        }
    });

    // 2. UTILITÁRIOS DE FORMATAÇÃO E ACESSO AO DOM
    const _fmt = (v) => new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(v);
    
    const _set = (id, val) => {
        const el = document.getElementById(id);
        if (el) { el.textContent = val; return true; }
        return false;
    };

    // Namespace Global para intercomunicação entre partes
    window.UNIFED_INTERNAL = { data: _PDF_CASE, fmt: _fmt, set: _set };
    console.log('[UNIFED] Camada 1: OK.');
})();

/**
 * UNIFED - PROBATUM · v13.11.10-PURE (PARTE 2 DE 4)
 * ============================================================================
 * Objetivo: Motor de Cálculo Forense e Mapeamento de Omissões
 * ============================================================================
 */

(function() {
    'use strict';
    if (!window.UNIFED_INTERNAL) return;
    const { data, fmt, set } = window.UNIFED_INTERNAL;

    window.UNIFED_INTERNAL.syncMetrics = function() {
        const t = data.totals;
        
        // Mapeamento Integral de IDs (Paineis PURE e Legado)
        const map = {
            'pure-ganhos-extrato':   fmt(t.ganhos),
            'pure-despesas-extrato': fmt(t.despesas),
            'pure-saft-bruto-val':   fmt(t.saftBruto),
            'pure-dac7-val':         fmt(t.dac7TotalPeriodo),
            'pure-iva-6-omitido':    fmt(t.iva6Omitido),
            'pure-iva-23-omitido':   fmt(t.iva23Omitido),
            'pure-asfixia-val':      fmt(t.asfixiaFinanceira),
            'pure-nc-total-geral':   fmt(t.totalNaoSujeitos),
            'pure-nc-gorjetas':      fmt(t.gorjetas),
            'pure-nc-portagens':     fmt(t.portagens),
            'pure-nc-campanhas':     fmt(t.cancelamentos),
            'pure-subject-platform': data.client.platform,
            'pure-session-id':       data.sessionId,
            'pure-hash-prefix-verdict': data.masterHash.substring(0, 12) + "..."
        };

        Object.entries(map).forEach(([id, val]) => set(id, val));
        
        // Ativação de alertas visuais
        ['iva6Card', 'iva23Card', 'bigDataAlert', 'pureATFCard'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = (id === 'bigDataAlert') ? 'flex' : 'block';
        });
    };
    console.log('[UNIFED] Camada 2: OK.');
})();

/**
 * UNIFED - PROBATUM · v13.11.10-PURE (PARTE 3 DE 4)
 * ============================================================================
 * Objetivo: Construção da Matriz de Triangulação (Visualização Judicial)
 * ============================================================================
 */

(function() {
    'use strict';
    if (!window.UNIFED_INTERNAL) return;
    const { data, fmt } = window.UNIFED_INTERNAL;

    window.UNIFED_INTERNAL.renderMatrix = function() {
        const target = document.getElementById('pureDashboard');
        if (!target || document.getElementById('triangulationMatrixContainer')) return;

        const deltaSaft = data.totals.ganhos - data.totals.saftBruto;
        const deltaDac7 = data.totals.ganhos - data.totals.dac7TotalPeriodo;

        const matrixHtml = `
        <div id="triangulationMatrixContainer" class="pure-triangulation-box" style="margin:30px 0; border:1px solid #00E5FF; background:rgba(15,23,42,0.8); padding:20px; border-radius:12px;">
            <h3 style="color:#00E5FF; margin-top:0; font-size:1rem;">🔍 MATRIZ DE TRIANGULAÇÃO FORENSE (ART. 103.º RGIT)</h3>
            <table style="width:100%; border-collapse:collapse; font-size:0.85rem;">
                <thead>
                    <tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
                        <th style="text-align:left; padding:10px;">FONTE DE PROVA</th>
                        <th style="text-align:right; padding:10px;">VALOR</th>
                        <th style="text-align:right; padding:10px; color:#EF4444;">DISCREPÂNCIA</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td style="padding:10px;">📄 SAF-T PT (Faturação)</td><td style="padding:10px; text-align:right;">${fmt(data.totals.saftBruto)}</td><td style="padding:10px; text-align:right;">-${fmt(deltaSaft)}</td></tr>
                    <tr style="background:rgba(239,68,68,0.05);"><td style="padding:10px;">🌐 DAC7 (Plataforma A)</td><td style="padding:10px; text-align:right;">${fmt(data.totals.dac7TotalPeriodo)}</td><td style="padding:10px; text-align:right;">-${fmt(deltaDac7)}</td></tr>
                    <tr style="border-top:2px solid #00E5FF;"><td style="padding:10px; font-weight:bold;">💰 LEDGER (Ganhos Reais)</td><td style="padding:10px; text-align:right; font-weight:bold;">${fmt(data.totals.ganhos)}</td><td style="padding:10px; text-align:right;">---</td></tr>
                </tbody>
            </table>
        </div>`;
        target.insertAdjacentHTML('beforeend', matrixHtml);
    };
    console.log('[UNIFED] Camada 3: OK.');
})();

/**
 * UNIFED - PROBATUM · v13.11.10-PURE (PARTE 4 DE 4)
 * ============================================================================
 * Objetivo: Gatilho Final, ATF Metrics e Revelação do Painel
 * ============================================================================
 */

(function() {
    'use strict';
    if (!window.UNIFED_INTERNAL) return;
    const { data, set, syncMetrics, renderMatrix } = window.UNIFED_INTERNAL;

    function _init() {
        console.log('[UNIFED] A sincronizar verdade material...');
        
        // 1. Injetar Métricas ATF
        set('pure-atf-zscore', data.atf.zScore);
        set('pure-atf-confianca', data.atf.confianca);
        set('pure-atf-periodo', data.atf.periodo);
        set('pure-atf-version', data.atf.version);

        // 2. Executar Sincronização Geral
        syncMetrics();
        renderMatrix();

        // 3. Revelar Interface (Fim do estado 'loading')
        const wrapper = document.getElementById('pureDashboardWrapper');
        if (wrapper) wrapper.classList.add('pure-visible');

        // 4. Executar gatilhos de compatibilidade (Gráficos legados)
        if (typeof window.updateDashboard === 'function') window.updateDashboard();
        if (typeof window.renderChart === 'function') window.renderChart();

        console.log('[UNIFED] ✅ SISTEMA 100% OPERACIONAL.');
    }

    // Exportação do comando de ativação para o index.html
    window.UNIFEDSystem = window.UNIFEDSystem || {};
    window.UNIFEDSystem.loadAnonymizedRealCase = function() {
        setTimeout(_init, 300);
    };

    // Auto-boot se o DOM estiver pronto
    if (document.readyState === 'complete') _init();
})();