/**
 * UNIFED - PROBATUM · CASO REAL ANONIMIZADO v13.11.12-PURE (PARTE 1 DE 4)
 * ============================================================================
 * Missão: Injeção Forense e Reconstituição da Verdade Material
 * Conformidade: DORA (UE) 2022/2554 · Art. 125.º CPP · ISO/IEC 27037:2012
 * ============================================================================
 * v13.11.12-PURE: Completude total dos dados da DEMO — todos os campos do
 * painel #pureDashboard são preenchidos com valores reais do caso anonimizado.
 * Nenhuma alteração nas fórmulas ou estrutura do dashboard.
 * ============================================================================
 */

(function() {
    'use strict';

    // 1. DATASET MESTRE (OBJETO IMUTÁVEL) — DADOS COMPLETOS VERIFICADOS
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
            dac7TotalPeriodo:  7755.16,   // Valor real do DAC7 (2.º Semestre 2024)
            iva6Omitido:        131.10,
            iva23Omitido:       502.54,
            asfixiaFinanceira:  493.68,
            totalNaoSujeitos:   451.15,
            gorjetas:           125.40,
            portagens:           82.15,
            campanhas:          243.60   // Antigo cancelamentos renomeado para campanhas
        },
        atf: {
            zScore: 2.45,
            confianca: "99.2%",
            periodo: "Q4 2024",
            anomalias: 4,
            version: "v13.5.0-PURE",
            score: 40,
            trend: "DESCENDENTE",
            outliers: 0
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
 * UNIFED - PROBATUM · v13.11.12-PURE (PARTE 2 DE 4)
 * ============================================================================
 * Objetivo: Motor de Cálculo Forense e Mapeamento de Omissões — Completo
 * ============================================================================
 */

(function() {
    'use strict';
    if (!window.UNIFED_INTERNAL) return;
    const { data, fmt, set } = window.UNIFED_INTERNAL;

    // Cálculos auxiliares baseados nos dados reais
    const t = data.totals;
    const discrepanciaC2 = t.despesas - t.faturaPlataforma;          // 2447.89 - 262.94 = 2184.95
    const percentC2 = (t.despesas > 0) ? (discrepanciaC2 / t.despesas) * 100 : 0; // 89.26%
    const discrepanciaC1 = t.saftBruto - t.dac7TotalPeriodo;         // 8227.97 - 7755.16 = 472.81
    const percentC1 = (t.saftBruto > 0) ? (discrepanciaC1 / t.saftBruto) * 100 : 0; // 5.75%
    const ircEstimado = discrepanciaC2 * 0.21;                       // 458.84

    window.UNIFED_INTERNAL.syncMetrics = function() {
        // Mapeamento Integral de IDs (Paineis PURE e Legado) — COMPLETO
        const map = {
            // Painel I – Reconciliação Financeira
            'pure-ganhos':           fmt(t.ganhos),
            'pure-despesas':         fmt(t.despesas),
            'pure-liquido':          fmt(t.ganhosLiquidos),
            'pure-saft':             fmt(t.saftBruto),
            'pure-dac7':             fmt(t.dac7TotalPeriodo),
            'pure-fatura':           fmt(t.faturaPlataforma),
            
            // Painel II – Smoking Guns e Discrepâncias
            'pure-disc-c2':           fmt(discrepanciaC2),
            'pure-disc-c2-pct':       percentC2.toFixed(2) + '%',
            'pure-disc-saft-dac7':    fmt(discrepanciaC1),
            'pure-disc-saft-pct':     percentC1.toFixed(2) + '%',
            'pure-iva-6':             fmt(t.iva6Omitido),
            'pure-iva-23':            fmt(t.iva23Omitido),
            'pure-irc':               fmt(ircEstimado),
            
            // Painel III – ATF (Análise Temporal Forense)
            'pure-atf-sp':            data.atf.score + '/100',
            'pure-atf-trend':         data.atf.trend,
            'pure-atf-outliers':      data.atf.outliers + ' outliers > 2σ',
            'pure-atf-meses':         '2.º Semestre 2024 — 4 meses com dados (Set–Dez)',
            
            // Painel IV – Zona Cinzenta (Fluxos não sujeitos a comissão)
            'pure-nc-campanhas':       fmt(t.campanhas),
            'pure-nc-gorjetas':        fmt(t.gorjetas),
            'pure-nc-portagens':       fmt(t.portagens),
            'pure-nc-total':           fmt(t.totalNaoSujeitos),
            
            // Painel V – Veredicto e Integridade
            'pure-verdict':            'RISCO ELEVADO',
            'pure-verdict-pct':        percentC2.toFixed(2) + '%',
            'pure-hash-prefix-verdict': data.masterHash.substring(0, 16) + '...',
            
            // Cabeçalho e identificação
            'pure-subject-name':       data.client.name,
            'pure-subject-nif':        data.client.nif,
            'pure-subject-platform':   data.client.platform,
            'pure-session-id':         data.sessionId,
            'pure-hash-prefix':        data.masterHash.substring(0, 12) + '...',
            
            // Extras para compatibilidade com módulos legados
            'pure-ganhos-extrato':     fmt(t.ganhos),
            'pure-despesas-extrato':   fmt(t.despesas),
            'pure-ganhos-liquidos-extrato': fmt(t.ganhosLiquidos),
            'pure-saft-bruto-val':     fmt(t.saftBruto),
            'pure-dac7-val':           fmt(t.dac7TotalPeriodo),
            'pure-iva-6-omitido':      fmt(t.iva6Omitido),
            'pure-iva-23-omitido':     fmt(t.iva23Omitido),
            'pure-asfixia-val':        fmt(t.asfixiaFinanceira),
            'pure-nc-total-geral':     fmt(t.totalNaoSujeitos),
            'pure-nc-gorjetas':        fmt(t.gorjetas),
            'pure-nc-portagens':       fmt(t.portagens),
            'pure-nc-campanhas':       fmt(t.campanhas),
            'pure-atf-zscore':         data.atf.zScore.toString(),
            'pure-atf-confianca':      data.atf.confianca,
            'pure-atf-score-val':      data.atf.score + '/100',
            'pure-atf-trend-val':      data.atf.trend
        };

        Object.entries(map).forEach(([id, val]) => set(id, val));
        
        // Ativação de alertas visuais
        ['iva6Card', 'iva23Card', 'bigDataAlert', 'pureATFCard', 'pureEvidenceSection'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = (id === 'bigDataAlert') ? 'flex' : 'block';
        });

        // Atualizar o valor do card "Percentagem Cobrada Pela Plataforma" (se existir)
        const omissaoPctEl = document.getElementById('omissaoDespesasPctValue');
        if (omissaoPctEl) {
            const pctComissao = (t.despesas / t.ganhos) * 100;
            omissaoPctEl.textContent = pctComissao.toFixed(2) + '%';
        }

        // Atualizar o bloco de "Diferencial de Fluxo Auditado" na grid pericial
        const discGridEl = document.getElementById('pure-disc-c2-grid');
        if (discGridEl) discGridEl.textContent = fmt(discrepanciaC2);
        
        const ivaDevidoEl = document.getElementById('pure-iva-devido');
        if (ivaDevidoEl) ivaDevidoEl.textContent = fmt(t.iva6Omitido);
        
        const naoSujeitosEl = document.getElementById('pure-nao-sujeitos');
        if (naoSujeitosEl) naoSujeitosEl.textContent = fmt(t.totalNaoSujeitos);
        
        // Atualizar valores específicos dos Smoking Guns (SG2 e SG1)
        const sg2BtorEl = document.getElementById('pure-sg2-btor-val');
        if (sg2BtorEl) sg2BtorEl.textContent = fmt(t.despesas);
        const sg2BtfEl = document.getElementById('pure-sg2-btf-val');
        if (sg2BtfEl) sg2BtfEl.textContent = fmt(t.faturaPlataforma);
        const sg2DeltaEl = document.getElementById('pure-disc-c2');
        if (sg2DeltaEl) sg2DeltaEl.textContent = fmt(discrepanciaC2);
        const sg2PctEl = document.getElementById('pure-disc-c2-pct');
        if (sg2PctEl) sg2PctEl.textContent = percentC2.toFixed(2) + '%';
        
        const sg1SaftEl = document.getElementById('pure-sg1-saft-val');
        if (sg1SaftEl) sg1SaftEl.textContent = fmt(t.saftBruto);
        const sg1Dac7El = document.getElementById('pure-sg1-dac7-val');
        if (sg1Dac7El) sg1Dac7El.textContent = fmt(t.dac7TotalPeriodo);
        const sg1DeltaEl = document.getElementById('pure-disc-saft-dac7');
        if (sg1DeltaEl) sg1DeltaEl.textContent = fmt(discrepanciaC1);
        const sg1PctEl = document.getElementById('pure-disc-saft-pct');
        if (sg1PctEl) sg1PctEl.textContent = percentC1.toFixed(2) + '%';
    };
    console.log('[UNIFED] Camada 2: OK.');
})();

/**
 * UNIFED - PROBATUM · v13.11.12-PURE (PARTE 3 DE 4)
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

        const t = data.totals;
        const deltaSaft = t.ganhos - t.saftBruto;
        const deltaDac7 = t.ganhos - t.dac7TotalPeriodo;
        const deltaFatura = t.despesas - t.faturaPlataforma;

        const matrixHtml = `
        <div id="triangulationMatrixContainer" class="pure-triangulation-box" style="margin:30px 0; border:1px solid #00E5FF; background:rgba(15,23,42,0.95); padding:20px; border-radius:12px;">
            <h3 style="color:#00E5FF; margin-top:0; font-size:1rem;">🔍 MATRIZ DE TRIANGULAÇÃO FORENSE (ART. 103.º RGIT)</h3>
            <table style="width:100%; border-collapse:collapse; font-size:0.85rem;">
                <thead>
                    <tr style="border-bottom:1px solid rgba(255,255,255,0.2);">
                        <th style="text-align:left; padding:10px;">FONTE DE PROVA</th>
                        <th style="text-align:right; padding:10px;">VALOR</th>
                        <th style="text-align:right; padding:10px; color:#EF4444;">DISCREPÂNCIA</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td style="padding:10px;">📄 SAF-T PT (Faturação)</td><td style="padding:10px; text-align:right;">${fmt(t.saftBruto)}</td><td style="padding:10px; text-align:right;">-${fmt(deltaSaft)}</td></tr>
                    <tr style="background:rgba(239,68,68,0.08);"><td style="padding:10px;">🌐 DAC7 (Plataforma A)</td><td style="padding:10px; text-align:right;">${fmt(t.dac7TotalPeriodo)}</td><td style="padding:10px; text-align:right;">-${fmt(deltaDac7)}</td></tr>
                    <tr><td style="padding:10px;">📑 Faturas BTF (Comissões)</td><td style="padding:10px; text-align:right;">${fmt(t.faturaPlataforma)}</td><td style="padding:10px; text-align:right;">-${fmt(deltaFatura)}</td></tr>
                    <tr style="border-top:2px solid #00E5FF;"><td style="padding:10px; font-weight:bold;">💰 LEDGER (Ganhos Reais)</td><td style="padding:10px; text-align:right; font-weight:bold;">${fmt(t.ganhos)}</td><td style="padding:10px; text-align:right;">---</td></tr>
                </tbody>
            </table>
            <div style="margin-top: 15px; font-size: 0.7rem; color: #94a3b8; border-top: 1px solid rgba(0,229,255,0.2); padding-top: 10px;">
                <strong>Nota Metodológica:</strong> A divergência entre o valor faturado (SAF-T/DAC7) e o valor real creditado (Ledger) evidencia uma omissão de base tributável de ${fmt(deltaFatura)} (${((deltaFatura/t.despesas)*100).toFixed(2)}%) nas comissões retidas pela plataforma.
            </div>
        </div>`;
        target.insertAdjacentHTML('beforeend', matrixHtml);
    };
    console.log('[UNIFED] Camada 3: OK.');
})();

/**
 * UNIFED - PROBATUM · v13.11.12-PURE (PARTE 4 DE 4)
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
        
        // 1. Injetar Métricas ATF adicionais
        set('pure-atf-zscore', data.atf.zScore.toString());
        set('pure-atf-confianca', data.atf.confianca);
        set('pure-atf-periodo', data.atf.periodo);
        set('pure-atf-version', data.atf.version);
        set('pure-atf-score', data.atf.score + '/100');
        set('pure-atf-trend', data.atf.trend);
        set('pure-atf-outliers', data.atf.outliers + ' outliers > 2σ');

        // 2. Executar Sincronização Geral
        syncMetrics();
        renderMatrix();

        // 3. Revelar Interface (Fim do estado 'loading')
        const wrapper = document.getElementById('pureDashboardWrapper');
        if (wrapper) {
            wrapper.style.display = 'block';
            wrapper.classList.add('pure-visible');
        }

        // 4. Executar gatilhos de compatibilidade (Gráficos legados)
        if (typeof window.updateDashboard === 'function') window.updateDashboard();
        if (typeof window.renderChart === 'function') window.renderChart();
        if (typeof window.updateModulesUI === 'function') window.updateModulesUI();
        if (typeof window.showAlerts === 'function') window.showAlerts();
        if (typeof window.showTwoAxisAlerts === 'function') window.showTwoAxisAlerts();

        // 5. Forçar tradução do painel (se disponível)
        if (typeof window._translatePurePanel === 'function') {
            const lang = (typeof window.currentLang !== 'undefined') ? window.currentLang : 'pt';
            window._translatePurePanel(lang);
        }

        console.log('[UNIFED] ✅ SISTEMA 100% OPERACIONAL — Dados da DEMO completos.');
    }

    // Exportação do comando de ativação para o index.html
    window.UNIFEDSystem = window.UNIFEDSystem || {};
    window.UNIFEDSystem.loadAnonymizedRealCase = function() {
        // Aguardar que o DOM esteja pronto e o wrapper exista
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(_init, 300);
            });
        } else {
            setTimeout(_init, 300);
        }
    };

    // Auto-boot se o DOM estiver pronto e o wrapper já existir
    if (document.readyState === 'complete' && document.getElementById('pureDashboardWrapper')) {
        _init();
    }
})();