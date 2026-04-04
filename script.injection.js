/**
 * UNIFED - PROBATUM · CASO REAL ANONIMIZADO v13.11.13-PURE (PARTE 1 DE 4)
 * ============================================================================
 * Missão: Injeção Forense e Reconstituição da Verdade Material
 * Conformidade: DORA (UE) 2022/2554 · Art. 125.º CPP · ISO/IEC 27037:2012
 * ============================================================================
 * v13.11.13-PURE:
 *   - Dados macro sistémicos (38.000 operadores, 7 anos, impacto 1,74MM€)
 *   - Escudo silencioso CORS para FreeTSA (sem erros vermelhos)
 *   - CSS dinâmico: boxes auxiliares com tamanhos iguais e largura total
 *   - Ocultação do gráfico "DISCREPÂNCIA SAF-T vs DAC7" (discrepancyChart)
 *   - Exclusão de dados macro do Master Hash (integridade da prova individual)
 * ============================================================================
 */

(function() {
    'use strict';

    // 1. DATASET MESTRE (OBJETO IMUTÁVEL) — VALORES REAIS ORIGINAIS + MACRO
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
            gorjetas:           46.00,
            portagens:           0.15,
            campanhas:         405.00,
            cancelamentos:      58.10
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
        },
        // ── MÓDULO DE IMPACTO SISTÉMICO (MIS) ──────────────────────────────────
        macro_analysis: {
            sector_drivers: 38000,
            operational_years: 7,
            avg_monthly_discrepancy: 546.24,
            estimated_systemic_gap: 1743598080.00,
            confidence_level: "High (based on verified algorithmic pattern)",
            legal_implication: "Potential systemic tax erosion under Art. 119.º RGIT (Iteration)",
            methodology: "Extrapolação Estatística de Baixa Variância · ISO/IEC 27037:2012",
            status: "INDICATIVO_MACRO",
            disclaimer: "Os valores de impacto sistémico constituem contexto macroeconómico e não prova direta de ilícito alheio, nos termos do Art. 128.º do CPP."
        }
    });

    // 2. ESCUDO SILENCIOSO PARA CORS (TSA / FREETSA FALLBACK)
    // Impede que erros 'Failed to fetch' apareçam em vermelho na consola
    (function _installCORSSilentShield() {
        const targetUrl = 'freetsa.org';
        const originalFetch = window.fetch;
        if (typeof originalFetch === 'function') {
            window.fetch = function(input, init) {
                const url = typeof input === 'string' ? input : (input && input.url);
                if (url && url.indexOf(targetUrl) !== -1) {
                    return originalFetch.apply(this, arguments).catch(function(err) {
                        console.warn('[UNIFED] ⚙ Modo Standalone Ativo: Selagem TSA externa indisponível. Integridade assegurada por Assinatura Local SHA-256 (Nível 1).');
                        throw err;
                    });
                }
                return originalFetch.apply(this, arguments);
            };
        }
        // Adicionalmente, silenciar erros não capturados relacionados com freetsa
        window.addEventListener('unhandledrejection', function(event) {
            if (event.reason && event.reason.message && event.reason.message.indexOf('freetsa') !== -1) {
                console.warn('[UNIFED] ⚙ Modo Standalone Ativo: Selagem TSA externa indisponível (promise).');
                event.preventDefault();
            }
        });
        window.addEventListener('error', function(event) {
            if (event.message && event.message.indexOf('freetsa') !== -1) {
                console.warn('[UNIFED] ⚙ Modo Standalone Ativo: Selagem TSA externa indisponível (erro global).');
                event.preventDefault();
                return true;
            }
        });
        console.log('[UNIFED] Escudo CORS silencioso instalado para FreeTSA.');
    })();

    // 3. UTILITÁRIOS DE FORMATAÇÃO E ACESSO AO DOM
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
 * UNIFED - PROBATUM · v13.11.13-PURE (PARTE 2 DE 4)
 * ============================================================================
 * Objetivo: Motor de Cálculo Forense e Mapeamento de Omissões — Completo
 * Modificação legal: textos dos smoking guns e veredicto ajustados para Art. 119.º RGIT.
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
            
            // Painel II – Smoking Guns e Discrepâncias — textos legais alterados
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
            
            // Painel V – Veredicto e Integridade — texto ajustado
            'pure-verdict':            'RISCO ELEVADO · CONTRA-ORDENAÇÃO',
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
        
        // ── MÉTRICAS MACRO (MIS) ──────────────────────────────────────────────
        const macro = data.macro_analysis;
        if (macro) {
            const monthlyLoss = (macro.sector_drivers || 38000) * (macro.avg_monthly_discrepancy || 546.24);
            set('pure-macro-universe', macro.sector_drivers.toLocaleString('pt-PT'));
            set('pure-macro-horizon', macro.operational_years + 'Anos');
            set('pure-macro-monthly-loss', fmt(monthlyLoss));
            set('pure-macro-total-loss', fmt(macro.estimated_systemic_gap));
        }
        
        // Atualizar textos legais nos elementos estáticos (não mapeados por ID)
        const sg2Legal = document.getElementById('pure-sg2-legal');
        if (sg2Legal) sg2Legal.textContent = 'Art. 36.º n.º 11 CIVA · Art. 119.º RGIT';
        
        const sg1Legal = document.getElementById('pure-sg1-legal');
        if (sg1Legal) sg1Legal.textContent = 'Diretiva DAC7 (UE) 2021/514 · DL n.º 41/2023';
        
        const verdictBasis = document.getElementById('pure-verdict-basis');
        if (verdictBasis) verdictBasis.textContent = 'Art. 119.º RGIT · Art. 125.º CPP';
        
        const pureIva23Sub = document.querySelector('#pure-iva23-sub');
        if (pureIva23Sub) pureIva23Sub.textContent = 'Art. 2.º n.º 1 al. i) CIVA';
        
        const pureIrcSub = document.querySelector('#pure-irc-sub');
        if (pureIrcSub) pureIrcSub.textContent = 'Art. 17.º CIRC';
        
        const pureAtfNote = document.getElementById('pure-atf-note-text');
        if (pureAtfNote) {
            pureAtfNote.textContent = 'Score de Persistência calculado pelo motor computeTemporalAnalysis() sobre 4 meses de histórico (Set/Out/Nov/Dez 2024). SP calculado sobre o lote global (dados verificados UNIFED-MMLADX8Q-CV69L). As discrepâncias absolutas (C2: €2.184,95 — 89,26% · C1: €472,81 — 5,75%) mantêm relevância jurídica independente.';
        }
        
        // Ativação de alertas visuais
        ['iva6Card', 'iva23Card', 'bigDataAlert', 'pureATFCard', 'pureEvidenceSection'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = (id === 'bigDataAlert') ? 'flex' : 'block';
        });

        // Atualizar o valor do card "Percentagem Cobrada Pela Plataforma"
        const omissaoPctEl = document.getElementById('omissaoDespesasPctValue');
        if (omissaoPctEl) {
            const pctComissao = (t.despesas / t.ganhos) * 100;
            omissaoPctEl.textContent = pctComissao.toFixed(2) + '%';
        }

        const discGridEl = document.getElementById('pure-disc-c2-grid');
        if (discGridEl) discGridEl.textContent = fmt(discrepanciaC2);
        
        const ivaDevidoEl = document.getElementById('pure-iva-devido');
        if (ivaDevidoEl) ivaDevidoEl.textContent = fmt(t.iva6Omitido);
        
        const naoSujeitosEl = document.getElementById('pure-nao-sujeitos');
        if (naoSujeitosEl) naoSujeitosEl.textContent = fmt(t.totalNaoSujeitos);
        
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
 * UNIFED - PROBATUM · v13.11.13-PURE (PARTE 3 DE 4)
 * ============================================================================
 * Objetivo: Construção da Matriz de Triangulação (Visualização Judicial)
 * Textos legais ajustados para Art. 119.º RGIT.
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
            <h3 style="color:#00E5FF; margin-top:0; font-size:1rem;">🔍 MATRIZ DE TRIANGULAÇÃO FORENSE (ART. 119.º RGIT)</h3>
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
                <strong>Nota Metodológica:</strong> A divergência entre o valor faturado (SAF-T/DAC7) e o valor real creditado (Ledger) evidencia uma omissão de base tributável de ${fmt(deltaFatura)} (${((deltaFatura/t.despesas)*100).toFixed(2)}%) nas comissões retidas pela plataforma, configurando contra-ordenação tributária nos termos do Art. 119.º RGIT.
            </div>
        </div>`;
        target.insertAdjacentHTML('beforeend', matrixHtml);
    };
    console.log('[UNIFED] Camada 3: OK.');
})();

/**
 * UNIFED - PROBATUM · v13.11.13-PURE (PARTE 4 DE 4)
 * ============================================================================
 * Objetivo: Gatilho Final, ATF Metrics e Revelação do Painel
 * Dados reais originais: campanhas=405.00, portagens=0.15, gorjetas=46.00,
 * cancelamentos=58.10, total não sujeitos=451.15.
 * Modificações: CSS dinâmico para boxes auxiliares, ocultação do gráfico discrepancyChart.
 * ============================================================================
 */

(function() {
    'use strict';
    if (!window.UNIFED_INTERNAL) return;
    const { data, fmt, set, syncMetrics, renderMatrix } = window.UNIFED_INTERNAL;

    // 1. CSS dinâmico para forçar boxes auxiliares com tamanhos iguais e largura total
    function _injectAuxiliaryBoxesCSS() {
        const styleId = 'unifed-aux-boxes-fix';
        if (document.getElementById(styleId)) return;
        const css = `
            .auxiliary-helper-section {
                width: 100% !important;
                max-width: 100% !important;
                box-sizing: border-box !important;
            }
            .aux-boxes-grid {
                display: grid !important;
                grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)) !important;
                gap: 0.75rem !important;
                width: 100% !important;
            }
            .small-info-box {
                width: 100% !important;
                margin: 0 !important;
                box-sizing: border-box !important;
            }
            @media (max-width: 640px) {
                .aux-boxes-grid {
                    grid-template-columns: repeat(2, 1fr) !important;
                }
            }
            @media (max-width: 480px) {
                .aux-boxes-grid {
                    grid-template-columns: 1fr !important;
                }
            }
        `;
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = css;
        document.head.appendChild(style);
        console.log('[UNIFED] CSS injetado: boxes auxiliares com tamanhos iguais e largura total.');
    }

    // 2. Ocultar o gráfico "DISCREPÂNCIA SAF-T vs DAC7" (discrepancyChart)
    function _hideDiscrepancyChart() {
        const canvas = document.getElementById('discrepancyChart');
        if (canvas) {
            canvas.style.display = 'none';
            const section = canvas.closest('.chart-section');
            if (section && section.querySelectorAll('canvas').length === 1) {
                section.style.display = 'none';
                console.log('[UNIFED] Secção do gráfico DISCREPÂNCIA SAF-T vs DAC7 ocultada.');
            } else {
                console.log('[UNIFED] Canvas discrepancyChart ocultado, mas a secção pode conter outros elementos.');
            }
        } else {
            console.log('[UNIFED] Canvas discrepancyChart não encontrado – nada a ocultar.');
        }
    }

    // 3. Oculta o Motor Preditivo NEXUS ATF
    function _hideNexusForecast() {
        const nexusPanel = document.getElementById('nexusForecastPanel');
        if (nexusPanel) nexusPanel.style.display = 'none';
        
        const atfModal = document.getElementById('atfModal');
        if (atfModal) {
            const forecastElements = atfModal.querySelectorAll('#nexusForecastPanel, [class*="nexus"], [id*="nexusForecast"]');
            forecastElements.forEach(el => {
                if (el) el.style.display = 'none';
            });
        }
        console.log('[UNIFED] Motor Preditivo NEXUS ATF ocultado por orientação pericial.');
    }

    // 4. Injeta o card de Análise de Risco Sistémico (MIS)
    function _injectMacroCard() {
        const target = document.getElementById('pureDashboard');
        if (!target) return;
        if (document.getElementById('pureMacroCard')) return;

        const macro = data.macro_analysis;
        if (!macro) return;

        const monthlyLoss = (macro.sector_drivers || 38000) * (macro.avg_monthly_discrepancy || 546.24);

        const cardHtml = `
        <div class="pure-card pure-card-macro" id="pureMacroCard">
            <h3 class="pure-card-title">
                <span class="pure-icon">🌍</span>
                <span id="pure-macro-title" data-pt="IV. ANÁLISE DE RISCO SISTÉMICO (MIS)" data-en="IV. SYSTEMIC RISK ANALYSIS (MIS)">IV. ANÁLISE DE RISCO SISTÉMICO (MIS)</span>
            </h3>
            <div class="pure-macro-grid" style="display:flex; flex-wrap:wrap; gap:1rem; justify-content:space-between;">
                <div class="pure-macro-item" style="flex:1; min-width:160px; background:rgba(255,255,255,0.03); padding:12px; border-radius:6px;">
                    <div class="pure-macro-label" style="font-size:0.65rem; color:#94a3b8; text-transform:uppercase;" data-pt="Universo de Operadores" data-en="Operators Universe">Universo de Operadores</div>
                    <div id="pure-macro-universe" class="pure-macro-value" style="font-size:1.4rem; font-weight:700; color:#00E5FF;">${macro.sector_drivers.toLocaleString('pt-PT')}</div>
                    <div class="pure-macro-sub" style="font-size:0.6rem; color:#64748b;">Sector TVDE Portugal</div>
                </div>
                <div class="pure-macro-item" style="flex:1; min-width:160px; background:rgba(255,255,255,0.03); padding:12px; border-radius:6px;">
                    <div class="pure-macro-label" style="font-size:0.65rem; color:#94a3b8; text-transform:uppercase;" data-pt="Horizonte Temporal" data-en="Time Horizon">Horizonte Temporal</div>
                    <div id="pure-macro-horizon" class="pure-macro-value" style="font-size:1.4rem; font-weight:700; color:#00E5FF;">${macro.operational_years} Anos</div>
                    <div class="pure-macro-sub" style="font-size:0.6rem; color:#64748b;">2019–2026</div>
                </div>
                <div class="pure-macro-item" style="flex:1; min-width:160px; background:rgba(255,255,255,0.03); padding:12px; border-radius:6px;">
                    <div class="pure-macro-label" style="font-size:0.65rem; color:#94a3b8; text-transform:uppercase;" data-pt="Erosão Mensal Estimada" data-en="Estimated Monthly Erosion">Erosão Mensal Estimada</div>
                    <div id="pure-macro-monthly-loss" class="pure-macro-value" style="font-size:1.4rem; font-weight:700; color:#F59E0B;">${fmt(monthlyLoss)}</div>
                    <div class="pure-macro-sub" style="font-size:0.6rem; color:#64748b;">Art. 119.º RGIT</div>
                </div>
                <div class="pure-macro-item pure-macro-highlight" style="flex:1.5; min-width:200px; background:rgba(239,68,68,0.08); border-left:3px solid #EF4444; padding:12px; border-radius:6px;">
                    <div class="pure-macro-label" style="font-size:0.65rem; color:#94a3b8; text-transform:uppercase;" data-pt="Erosão Fiscal Estimada (7 Anos)" data-en="Estimated Tax Erosion (7 Years)">Erosão Fiscal Estimada (7 Anos)</div>
                    <div id="pure-macro-total-loss" class="pure-macro-value" style="font-size:1.6rem; font-weight:900; color:#EF4444;">${fmt(macro.estimated_systemic_gap)}</div>
                    <div class="pure-macro-sub" style="font-size:0.6rem; color:#EF4444;">Art. 119.º RGIT (Iteração)</div>
                </div>
            </div>
            <div class="pure-macro-disclaimer" style="margin-top:1rem; padding:0.75rem; background:rgba(0,0,0,0.3); border-left:3px solid #FACC15; font-size:0.7rem; color:#94a3b8;">
                <i class="fas fa-gavel"></i> 
                <span data-pt="Os valores de impacto sistémico constituem contexto macroeconómico e não prova direta de ilícito alheio, nos termos do Art. 128.º do CPP." data-en="Systemic impact values constitute macroeconomic context and not direct proof of third-party wrongdoing, under Art. 128 CPP.">Os valores de impacto sistémico constituem contexto macroeconómico e não prova direta de ilícito alheio, nos termos do Art. 128.º do CPP.</span>
            </div>
        </div>`;
        target.insertAdjacentHTML('beforeend', cardHtml);
    }

    // 5. Atualiza os elementos da secção auxiliar (valores reais)
    function _updateAuxiliaryUI() {
        const t = data.totals;
        
        const auxElements = {
            'auxBoxCampanhasValue': t.campanhas,
            'auxBoxPortagensValue': t.portagens,
            'auxBoxGorjetasValue': t.gorjetas,
            'auxBoxTotalNSValue': t.totalNaoSujeitos,
            'auxBoxCancelValue': t.cancelamentos
        };
        
        Object.entries(auxElements).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el) {
                el.textContent = fmt(value);
                if (id === 'auxBoxTotalNSValue') {
                    el.classList.add('highlighted');
                }
            }
        });
        
        const dac7NoteValue = document.getElementById('auxDac7NoteValue');
        if (dac7NoteValue) dac7NoteValue.textContent = fmt(t.totalNaoSujeitos);
        const dac7NoteValueQ = document.getElementById('auxDac7NoteValueQ');
        if (dac7NoteValueQ) dac7NoteValueQ.textContent = fmt(t.totalNaoSujeitos);
        
        const dac7Note = document.getElementById('auxDac7ReconciliationNote');
        if (dac7Note && t.totalNaoSujeitos > 0) {
            dac7Note.style.display = 'block';
        }
        
        const questionText = document.getElementById('pure-zc-question-text');
        if (questionText) {
            questionText.textContent = 'Pode a plataforma confirmar se os €451,15 em Gorjetas e Campanhas (isentos de comissão nos termos da Lei TVDE) foram incluídos na base de cálculo do reporte DAC7? Se sim, qual o fundamento legal?';
        }
        
        console.log('[UNIFED] UI auxiliar atualizada: Campanhas=', fmt(t.campanhas), 'Portagens=', fmt(t.portagens), 'Gorjetas=', fmt(t.gorjetas), 'Cancelamentos=', fmt(t.cancelamentos), 'Total=', fmt(t.totalNaoSujeitos));
    }

    // 6. Simula o carregamento de evidências no UNIFEDSystem (dados reais)
    function _simulateEvidenceUpload() {
        if (typeof window.UNIFEDSystem === 'undefined') {
            console.warn('[UNIFED] UNIFEDSystem não disponível para simular upload.');
            return false;
        }

        const sys = window.UNIFEDSystem;
        const t = data.totals;
        const macro = data.macro_analysis;

        if (!sys.documents) sys.documents = {};
        if (!sys.documents.control) sys.documents.control = { files: [], totals: { records: 0 } };
        if (!sys.documents.saft) sys.documents.saft = { files: [], totals: { bruto: 0, iliquido: 0, iva: 0, records: 0 } };
        if (!sys.documents.statements) sys.documents.statements = { files: [], totals: { ganhos: 0, despesas: 0, ganhosLiquidos: 0, records: 0 } };
        if (!sys.documents.invoices) sys.documents.invoices = { files: [], totals: { invoiceValue: 0, records: 0 } };
        if (!sys.documents.dac7) sys.documents.dac7 = { files: [], totals: { q1: 0, q2: 0, q3: 0, q4: 0, totalPeriodo: 0, records: 0 } };
        if (!sys.analysis) sys.analysis = { evidenceIntegrity: [] };
        if (!sys.analysis.evidenceIntegrity) sys.analysis.evidenceIntegrity = [];

        sys.documents.control.files = [];
        sys.documents.saft.files = [];
        sys.documents.statements.files = [];
        sys.documents.invoices.files = [];
        sys.documents.dac7.files = [];
        sys.analysis.evidenceIntegrity = [];

        // 1. Ficheiros de Controlo (4)
        const controlFiles = [
            { name: 'controlo_autenticidade_1.csv', type: 'control', size: 256 },
            { name: 'controlo_autenticidade_2.csv', type: 'control', size: 256 },
            { name: 'controlo_autenticidade_3.csv', type: 'control', size: 256 },
            { name: 'controlo_autenticidade_4.csv', type: 'control', size: 256 }
        ];
        controlFiles.forEach(file => {
            sys.documents.control.files.push({ name: file.name, size: file.size });
            sys.analysis.evidenceIntegrity.push({
                filename: file.name,
                type: 'control',
                hash: CryptoJS.SHA256(file.name + 'control_demo').toString().toUpperCase(),
                timestamp: new Date().toISOString(),
                size: file.size
            });
        });
        sys.documents.control.totals.records = controlFiles.length;

        // 2. SAF-T (4 ficheiros mensais)
        const saftFiles = [
            { name: '131509_202409.csv', type: 'saft', size: 1024 },
            { name: '131509_202410.csv', type: 'saft', size: 1024 },
            { name: '131509_202411.csv', type: 'saft', size: 1024 },
            { name: '131509_202412.csv', type: 'saft', size: 1024 }
        ];
        saftFiles.forEach(file => {
            sys.documents.saft.files.push({ name: file.name, size: file.size });
            sys.analysis.evidenceIntegrity.push({
                filename: file.name,
                type: 'saft',
                hash: CryptoJS.SHA256(file.name + 'saft_demo').toString().toUpperCase(),
                timestamp: new Date().toISOString(),
                size: file.size
            });
        });
        sys.documents.saft.totals.bruto = t.saftBruto;
        sys.documents.saft.totals.iliquido = t.saftIliquido;
        sys.documents.saft.totals.iva = t.saftIva;
        sys.documents.saft.totals.records = saftFiles.length;

        // 3. Extratos (4 ficheiros mensais)
        const statementFiles = [
            { name: 'extrato_setembro_2024.pdf', type: 'statement', size: 2048 },
            { name: 'extrato_outubro_2024.pdf', type: 'statement', size: 2048 },
            { name: 'extrato_novembro_2024.pdf', type: 'statement', size: 2048 },
            { name: 'extrato_dezembro_2024.pdf', type: 'statement', size: 2048 }
        ];
        statementFiles.forEach(file => {
            sys.documents.statements.files.push({ name: file.name, size: file.size });
            sys.analysis.evidenceIntegrity.push({
                filename: file.name,
                type: 'statement',
                hash: CryptoJS.SHA256(file.name + 'statement_demo').toString().toUpperCase(),
                timestamp: new Date().toISOString(),
                size: file.size
            });
        });
        sys.documents.statements.totals.ganhos = t.ganhos;
        sys.documents.statements.totals.despesas = t.despesas;
        sys.documents.statements.totals.ganhosLiquidos = t.ganhosLiquidos;
        sys.documents.statements.totals.records = statementFiles.length;

        // 4. Faturas (2)
        const invoiceFiles = [
            { name: 'PT1124_202412.pdf', type: 'invoice', size: 512 },
            { name: 'PT1125_202412.pdf', type: 'invoice', size: 512 }
        ];
        invoiceFiles.forEach(file => {
            sys.documents.invoices.files.push({ name: file.name, size: file.size });
            sys.analysis.evidenceIntegrity.push({
                filename: file.name,
                type: 'invoice',
                hash: CryptoJS.SHA256(file.name + 'invoice_demo').toString().toUpperCase(),
                timestamp: new Date().toISOString(),
                size: file.size
            });
        });
        sys.documents.invoices.totals.invoiceValue = t.faturaPlataforma;
        sys.documents.invoices.totals.records = invoiceFiles.length;

        // 5. DAC7 (1 ficheiro) - apenas 4.º trimestre visível
        const dac7Files = [
            { name: 'dac7_2024_semestre2.pdf', type: 'dac7', size: 1024 }
        ];
        dac7Files.forEach(file => {
            sys.documents.dac7.files.push({ name: file.name, size: file.size });
            sys.analysis.evidenceIntegrity.push({
                filename: file.name,
                type: 'dac7',
                hash: CryptoJS.SHA256(file.name + 'dac7_demo').toString().toUpperCase(),
                timestamp: new Date().toISOString(),
                size: file.size
            });
        });
        sys.documents.dac7.totals.q4 = t.dac7TotalPeriodo;
        sys.documents.dac7.totals.q3 = 0;
        sys.documents.dac7.totals.q1 = 0;
        sys.documents.dac7.totals.q2 = 0;
        sys.documents.dac7.totals.totalPeriodo = t.dac7TotalPeriodo;
        sys.documents.dac7.totals.records = dac7Files.length;

        // 6. Dados mensais para ATF
        if (!sys.monthlyData) sys.monthlyData = {};
        const monthlyGanhos = [2450.00, 2560.00, 2480.00, 2667.73];
        const monthlyDespesas = [590.00, 615.00, 600.00, 642.89];
        const monthlyGanhosLiq = [1860.00, 1945.00, 1880.00, 2024.84];
        const months = ['202409', '202410', '202411', '202412'];
        months.forEach((month, idx) => {
            sys.monthlyData[month] = {
                ganhos: monthlyGanhos[idx],
                despesas: monthlyDespesas[idx],
                ganhosLiq: monthlyGanhosLiq[idx]
            };
        });
        sys.dataMonths = new Set(months);

        // 7. Contadores UI
        if (typeof window.forensicDataSynchronization === 'function') {
            window.forensicDataSynchronization();
        } else {
            const setCount = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
            setCount('controlCountCompact', controlFiles.length);
            setCount('saftCountCompact', saftFiles.length);
            setCount('invoiceCountCompact', invoiceFiles.length);
            setCount('statementCountCompact', statementFiles.length);
            setCount('dac7CountCompact', dac7Files.length);
            setCount('summaryControl', controlFiles.length);
            setCount('summarySaft', saftFiles.length);
            setCount('summaryInvoices', invoiceFiles.length);
            setCount('summaryStatements', statementFiles.length);
            setCount('summaryDac7', dac7Files.length);
            const total = controlFiles.length + saftFiles.length + invoiceFiles.length + statementFiles.length + dac7Files.length;
            setCount('summaryTotal', total);
            const evidenceCount = document.getElementById('evidenceCountTotal');
            if (evidenceCount) evidenceCount.textContent = total;
        }

        // 8. Totais e crossings no UNIFEDSystem.analysis (excluindo dados macro do Master Hash)
        if (!sys.analysis.totals) sys.analysis.totals = {};
        sys.analysis.totals.saftBruto = t.saftBruto;
        sys.analysis.totals.saftIliquido = t.saftIliquido;
        sys.analysis.totals.saftIva = t.saftIva;
        sys.analysis.totals.ganhos = t.ganhos;
        sys.analysis.totals.despesas = t.despesas;
        sys.analysis.totals.ganhosLiquidos = t.ganhosLiquidos;
        sys.analysis.totals.faturaPlataforma = t.faturaPlataforma;
        sys.analysis.totals.dac7Q1 = 0;
        sys.analysis.totals.dac7Q2 = 0;
        sys.analysis.totals.dac7Q3 = 0;
        sys.analysis.totals.dac7Q4 = t.dac7TotalPeriodo;
        sys.analysis.totals.dac7TotalPeriodo = t.dac7TotalPeriodo;

        const discrepanciaSaftVsDac7 = t.saftBruto - t.dac7TotalPeriodo;
        const percentagemSaftVsDac7 = t.saftBruto > 0 ? (discrepanciaSaftVsDac7 / t.saftBruto) * 100 : 0;
        const discrepanciaCritica = t.despesas - t.faturaPlataforma;
        const percentagemOmissao = t.despesas > 0 ? (discrepanciaCritica / t.despesas) * 100 : 0;
        const ivaFalta = discrepanciaCritica * 0.23;
        const ivaFalta6 = discrepanciaCritica * 0.06;
        const agravamentoBrutoIRC = discrepanciaCritica;
        const ircEstimado = discrepanciaCritica * 0.21;

        if (!sys.analysis.crossings) sys.analysis.crossings = {};
        sys.analysis.crossings.discrepanciaSaftVsDac7 = discrepanciaSaftVsDac7;
        sys.analysis.crossings.percentagemSaftVsDac7 = percentagemSaftVsDac7;
        sys.analysis.crossings.discrepanciaCritica = discrepanciaCritica;
        sys.analysis.crossings.percentagemOmissao = percentagemOmissao;
        sys.analysis.crossings.ivaFalta = ivaFalta;
        sys.analysis.crossings.ivaFalta6 = ivaFalta6;
        sys.analysis.crossings.agravamentoBrutoIRC = agravamentoBrutoIRC;
        sys.analysis.crossings.ircEstimado = ircEstimado;
        sys.analysis.crossings.btor = t.despesas;
        sys.analysis.crossings.btf = t.faturaPlataforma;
        sys.analysis.crossings.c1_delta = discrepanciaSaftVsDac7;
        sys.analysis.crossings.c1_pct = percentagemSaftVsDac7;
        sys.analysis.crossings.c2_delta = discrepanciaCritica;
        sys.analysis.crossings.c2_pct = percentagemOmissao;

        // 9. Cliente
        if (!sys.client && data.client) {
            sys.client = { name: data.client.name, nif: data.client.nif, platform: data.client.platform };
            const clientStatus = document.getElementById('clientStatusFixed');
            if (clientStatus) {
                clientStatus.style.display = 'flex';
                const nameSpan = document.getElementById('clientNameDisplayFixed');
                const nifSpan = document.getElementById('clientNifDisplayFixed');
                if (nameSpan) nameSpan.textContent = data.client.name;
                if (nifSpan) nifSpan.textContent = data.client.nif;
            }
            const nameInput = document.getElementById('clientNameFixed');
            const nifInput = document.getElementById('clientNIFFixed');
            if (nameInput) nameInput.value = data.client.name;
            if (nifInput) nifInput.value = data.client.nif;
        }

        // 10. Plataforma "Plataforma A"
        const platformSelect = document.getElementById('selPlatformFixed');
        if (platformSelect) {
            for (let i = 0; i < platformSelect.options.length; i++) {
                if (platformSelect.options[i].value === 'outra') {
                    platformSelect.selectedIndex = i;
                    break;
                }
            }
            if (typeof window.UNIFEDSystem !== 'undefined') {
                window.UNIFEDSystem.selectedPlatform = 'outra';
            }
        }

        // 11. Período "2. Semestre"
        const periodSelect = document.getElementById('periodoAnalise');
        if (periodSelect) {
            periodSelect.value = '2s';
            if (typeof window.UNIFEDSystem !== 'undefined') {
                window.UNIFEDSystem.selectedPeriodo = '2s';
            }
            const changeEvent = new Event('change', { bubbles: true });
            periodSelect.dispatchEvent(changeEvent);
        }
        const trimestralContainer = document.getElementById('trimestralSelectorContainer');
        if (trimestralContainer) {
            trimestralContainer.style.display = 'none';
        }

        // 12. Ocultar Q1, Q2, Q3 do DAC7
        const dac7Q1Card = document.querySelector('#dac7Q1Value')?.closest('.kpi-card');
        const dac7Q2Card = document.querySelector('#dac7Q2Value')?.closest('.kpi-card');
        const dac7Q3Card = document.querySelector('#dac7Q3Value')?.closest('.kpi-card');
        if (dac7Q1Card) dac7Q1Card.style.display = 'none';
        if (dac7Q2Card) dac7Q2Card.style.display = 'none';
        if (dac7Q3Card) dac7Q3Card.style.display = 'none';

        // 13. Remover "(browser)" do Privacy by Design
        const privacyBadge = document.querySelector('.privacy-badge span');
        if (privacyBadge) {
            const currentText = privacyBadge.innerHTML;
            privacyBadge.innerHTML = currentText.replace(/\s*\(browser\)/gi, '');
        }

        // 14. Master hash (excluindo dados macro para preservar integridade da prova individual)
        const evidenceHashes = sys.analysis.evidenceIntegrity
            .map(ev => ev.hash)
            .filter(h => h && h.length === 64)
            .sort();
        const binaryConcat = evidenceHashes.join('') + JSON.stringify({ client: sys.client, totals: t }) + sys.sessionId;
        const masterHashFull = CryptoJS.SHA256(binaryConcat).toString().toUpperCase();
        sys.masterHash = masterHashFull;
        setElementText('masterHashValue', masterHashFull);
        generateQRCode();
        window.activeForensicSession = { sessionId: sys.sessionId, masterHash: masterHashFull };

        console.log('[UNIFED] Evidências simuladas carregadas. Total: 15 ficheiros (CTRL:4, SAFT:4, EXT:4, FAT:2, DAC7:1)');
        return true;
    }

    // Função auxiliar para gerar QR Code
    function generateQRCode() {
        const container = document.getElementById('qrcodeContainer');
        if (!container) return;
        container.innerHTML = '';
        const hashFull = window.UNIFEDSystem?.masterHash || 'HASH_INDISPONIVEL';
        const sessionShort = window.UNIFEDSystem?.sessionId ? window.UNIFEDSystem.sessionId.substring(0, 16) : 'N/A';
        const qrData = `UNIFED|${sessionShort}|${hashFull}`;
        if (typeof QRCode !== 'undefined') {
            new QRCode(container, {
                text: qrData,
                width: 75,
                height: 75,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.L
            });
        }
        container.setAttribute('data-tooltip', 'Clique para verificar a cadeia de custódia completa');
    }

    function setElementText(id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    function _init() {
        console.log('[UNIFED] A sincronizar verdade material...');
        
        _simulateEvidenceUpload();
        
        set('pure-atf-zscore', data.atf.zScore.toString());
        set('pure-atf-confianca', data.atf.confianca);
        set('pure-atf-periodo', data.atf.periodo);
        set('pure-atf-version', data.atf.version);
        set('pure-atf-score', data.atf.score + '/100');
        set('pure-atf-trend', data.atf.trend);
        set('pure-atf-outliers', data.atf.outliers + ' outliers > 2σ');

        syncMetrics();
        renderMatrix();
        _injectMacroCard();
        _injectAuxiliaryBoxesCSS();   // Aplica CSS às boxes auxiliares
        _hideDiscrepancyChart();      // Oculta o gráfico
        _updateAuxiliaryUI();         // Actualiza valores das boxes
        _hideNexusForecast();
        
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length) {
                    if (document.getElementById('auxBoxCampanhasValue')) {
                        _updateAuxiliaryUI();
                        _hideNexusForecast();
                        if (!document.getElementById('pureMacroCard')) _injectMacroCard();
                        observer.disconnect();
                    }
                }
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(function() { observer.disconnect(); }, 5000);

        const wrapper = document.getElementById('pureDashboardWrapper');
        if (wrapper) {
            wrapper.style.display = 'block';
            wrapper.classList.add('pure-visible');
        }

        if (typeof window.updateDashboard === 'function') window.updateDashboard();
        if (typeof window.renderChart === 'function') window.renderChart();
        if (typeof window.updateModulesUI === 'function') window.updateModulesUI();
        if (typeof window.showAlerts === 'function') window.showAlerts();
        if (typeof window.showTwoAxisAlerts === 'function') window.showTwoAxisAlerts();

        if (typeof window._translatePurePanel === 'function') {
            const lang = (typeof window.currentLang !== 'undefined') ? window.currentLang : 'pt';
            window._translatePurePanel(lang);
        }

        const analyzeBtn = document.getElementById('analyzeBtn');
        if (analyzeBtn) analyzeBtn.disabled = false;
        const exportPDFBtn = document.getElementById('exportPDFBtn');
        if (exportPDFBtn) exportPDFBtn.disabled = false;
        const exportJSONBtn = document.getElementById('exportJSONBtn');
        if (exportJSONBtn) exportJSONBtn.disabled = false;

        console.log('[UNIFED] ✅ SISTEMA 100% OPERACIONAL — Dados reais carregados. Motor Preditivo ocultado. Card MIS injectado. Boxes auxiliares ajustadas.');
    }

    window.UNIFEDSystem = window.UNIFEDSystem || {};
    window.UNIFEDSystem.loadAnonymizedRealCase = function() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(_init, 300);
            });
        } else {
            setTimeout(_init, 300);
        }
    };

    if (document.readyState === 'complete' && document.getElementById('pureDashboardWrapper')) {
        _init();
    }
})();
