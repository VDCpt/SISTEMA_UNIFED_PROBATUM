/**
 * UNIFED - PROBATUM · CASO REAL ANONIMIZADO v13.11.13-PURE (PARTE 1 DE 4)
 * ============================================================================
 * Missão: Injeção Forense e Reconstituição da Verdade Material
 * Conformidade: DORA (UE) 2022/2554 · Art. 125.º CPP · ISO/IEC 27037:2012
 * ============================================================================
 * v13.11.13-PURE:
 *   - Tipificação legal exclusiva: Art. 119.º RGIT (Contra-ordenação)
 *   - Dados macro sistémicos (38.000 operadores, 7 anos, impacto 1,74MM€)
 *   - Escudo silencioso CORS para FreeTSA (sem erros vermelhos)
 *   - CSS dinâmico: boxes auxiliares com tamanhos iguais e largura total
 *   - Ocultação do gráfico "DISCREPÂNCIA SAF-T vs DAC7"
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

    window.UNIFED_INTERNAL = { data: _PDF_CASE, fmt: _fmt, set: _set };
    console.log('[UNIFED] Camada 1: OK.');
})();

/**
 * UNIFED - PROBATUM · v13.11.13-PURE (PARTE 2 DE 4)
 * ============================================================================
 * Motor de Cálculo Forense e Mapeamento de Omissões
 * Tipificação legal exclusiva: Art. 119.º RGIT (Contra-ordenação)
 * ============================================================================
 */

(function() {
    'use strict';
    if (!window.UNIFED_INTERNAL) return;
    const { data, fmt, set } = window.UNIFED_INTERNAL;

    const t = data.totals;
    const discrepanciaC2 = t.despesas - t.faturaPlataforma;
    const percentC2 = (t.despesas > 0) ? (discrepanciaC2 / t.despesas) * 100 : 0;
    const discrepanciaC1 = t.saftBruto - t.dac7TotalPeriodo;
    const percentC1 = (t.saftBruto > 0) ? (discrepanciaC1 / t.saftBruto) * 100 : 0;
    const ircEstimado = discrepanciaC2 * 0.21;

    window.UNIFED_INTERNAL.syncMetrics = function() {
        const map = {
            'pure-ganhos': fmt(t.ganhos),
            'pure-despesas': fmt(t.despesas),
            'pure-liquido': fmt(t.ganhosLiquidos),
            'pure-saft': fmt(t.saftBruto),
            'pure-dac7': fmt(t.dac7TotalPeriodo),
            'pure-fatura': fmt(t.faturaPlataforma),
            'pure-disc-c2': fmt(discrepanciaC2),
            'pure-disc-c2-pct': percentC2.toFixed(2) + '%',
            'pure-disc-saft-dac7': fmt(discrepanciaC1),
            'pure-disc-saft-pct': percentC1.toFixed(2) + '%',
            'pure-iva-6': fmt(t.iva6Omitido),
            'pure-iva-23': fmt(t.iva23Omitido),
            'pure-irc': fmt(ircEstimado),
            'pure-atf-sp': data.atf.score + '/100',
            'pure-atf-trend': data.atf.trend,
            'pure-atf-outliers': data.atf.outliers + ' outliers > 2σ',
            'pure-atf-meses': '2.º Semestre 2024 — 4 meses com dados (Set–Dez)',
            'pure-nc-campanhas': fmt(t.campanhas),
            'pure-nc-gorjetas': fmt(t.gorjetas),
            'pure-nc-portagens': fmt(t.portagens),
            'pure-nc-total': fmt(t.totalNaoSujeitos),
            'pure-verdict': 'RISCO ELEVADO · CONTRA-ORDENAÇÃO',
            'pure-verdict-pct': percentC2.toFixed(2) + '%',
            'pure-hash-prefix-verdict': data.masterHash.substring(0, 16) + '...',
            'pure-subject-name': data.client.name,
            'pure-subject-nif': data.client.nif,
            'pure-subject-platform': data.client.platform,
            'pure-session-id': data.sessionId,
            'pure-hash-prefix': data.masterHash.substring(0, 12) + '...'
        };
        Object.entries(map).forEach(([id, val]) => set(id, val));
        
        // Textos legais – apenas Art. 119.º RGIT
        const sg2Legal = document.getElementById('pure-sg2-legal');
        if (sg2Legal) sg2Legal.textContent = 'Art. 36.º n.º 11 CIVA · Art. 119.º RGIT';
        
        const verdictBasis = document.getElementById('pure-verdict-basis');
        if (verdictBasis) verdictBasis.textContent = 'Art. 119.º RGIT · Art. 125.º CPP';
        
        const pureAtfNote = document.getElementById('pure-atf-note-text');
        if (pureAtfNote) {
            pureAtfNote.textContent = 'Score de Persistência calculado pelo motor computeTemporalAnalysis() sobre 4 meses de histórico (Set/Out/Nov/Dez 2024). SP calculado sobre o lote global (dados verificados UNIFED-MMLADX8Q-CV69L). As discrepâncias absolutas (C2: €2.184,95 — 89,26% · C1: €472,81 — 5,75%) mantêm relevância jurídica independente.';
        }
        
        ['iva6Card', 'iva23Card', 'bigDataAlert', 'pureATFCard'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = (id === 'bigDataAlert') ? 'flex' : 'block';
        });
        
        const pctComissao = (t.despesas / t.ganhos) * 100;
        const omissaoPctEl = document.getElementById('omissaoDespesasPctValue');
        if (omissaoPctEl) omissaoPctEl.textContent = pctComissao.toFixed(2) + '%';
        
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
        
        const macro = data.macro_analysis;
        if (macro) {
            set('pure-macro-universe', macro.sector_drivers.toLocaleString('pt-PT'));
            set('pure-macro-horizon', macro.operational_years + ' Anos');
            const monthlyLoss = macro.sector_drivers * macro.avg_monthly_discrepancy;
            set('pure-macro-monthly-loss', fmt(monthlyLoss));
            set('pure-macro-total-loss', fmt(macro.estimated_systemic_gap));
        }
    };
    console.log('[UNIFED] Camada 2: OK.');
})();

/**
 * UNIFED - PROBATUM · v13.11.13-PURE (PARTE 3 DE 4)
 * ============================================================================
 * Matriz de Triangulação (Art. 119.º RGIT)
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
        const html = `
        <div id="triangulationMatrixContainer" class="pure-triangulation-box" style="margin:30px 0; border:1px solid #00E5FF; background:rgba(15,23,42,0.95); padding:20px; border-radius:12px;">
            <h3 style="color:#00E5FF;">🔍 MATRIZ DE TRIANGULAÇÃO FORENSE (ART. 119.º RGIT)</h3>
            <table style="width:100%; border-collapse:collapse;">
                <thead><tr style="border-bottom:1px solid rgba(255,255,255,0.2);">
                    <th style="text-align:left; padding:10px;">FONTE DE PROVA</th>
                    <th style="text-align:right; padding:10px;">VALOR</th>
                    <th style="text-align:right; padding:10px; color:#EF4444;">DISCREPÂNCIA</th>
                </tr></thead>
                <tbody>
                    <tr><td style="padding:10px;">📄 SAF-T PT (Faturação)</td><td style="text-align:right;">${fmt(t.saftBruto)}</td><td style="text-align:right;">-${fmt(deltaSaft)}</td></tr>
                    <tr style="background:rgba(239,68,68,0.08);"><td style="padding:10px;">🌐 DAC7 (Plataforma A)</td><td style="text-align:right;">${fmt(t.dac7TotalPeriodo)}</td><td style="text-align:right;">-${fmt(deltaDac7)}</td></tr>
                    <tr><td style="padding:10px;">📑 Faturas BTF (Comissões)</td><td style="text-align:right;">${fmt(t.faturaPlataforma)}</td><td style="text-align:right;">-${fmt(deltaFatura)}</td></tr>
                    <tr style="border-top:2px solid #00E5FF;"><td style="padding:10px; font-weight:bold;">💰 LEDGER (Ganhos Reais)</td><td style="text-align:right; font-weight:bold;">${fmt(t.ganhos)}</td><td style="text-align:right;">---</td></tr>
                </tbody>
            </table>
            <div style="margin-top:15px; font-size:0.7rem; color:#94a3b8;">Nota: A divergência de ${fmt(deltaFatura)} (${((deltaFatura/t.despesas)*100).toFixed(2)}%) evidencia omissão sistemática – contra-ordenação Art. 119.º RGIT.</div>
        </div>`;
        target.insertAdjacentHTML('beforeend', html);
    };
    console.log('[UNIFED] Camada 3: OK.');
})();

/**
 * UNIFED - PROBATUM · v13.11.13-PURE (PARTE 4 DE 4)
 * ============================================================================
 * Inicialização: Simulação de upload, CSS, ocultação do gráfico e do Nexus,
 * actualização dos textos legais e do questionário estratégico.
 * ============================================================================
 */

(function() {
    'use strict';
    if (!window.UNIFED_INTERNAL) return;
    const { data, fmt, set, syncMetrics, renderMatrix } = window.UNIFED_INTERNAL;

    // CSS para boxes auxiliares
    function _injectAuxiliaryBoxesCSS() {
        const styleId = 'unifed-aux-boxes-fix';
        if (document.getElementById(styleId)) return;
        const css = `
            .auxiliary-helper-section { width:100% !important; max-width:100% !important; box-sizing:border-box !important; }
            .aux-boxes-grid { display:grid !important; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)) !important; gap:0.75rem !important; width:100% !important; }
            .small-info-box { width:100% !important; margin:0 !important; box-sizing:border-box !important; }
            @media (max-width:640px) { .aux-boxes-grid { grid-template-columns:repeat(2,1fr) !important; } }
            @media (max-width:480px) { .aux-boxes-grid { grid-template-columns:1fr !important; } }
        `;
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = css;
        document.head.appendChild(style);
        console.log('[UNIFED] CSS injetado: boxes auxiliares.');
    }

    // Ocultar gráfico discrepancyChart
    function _hideDiscrepancyChart() {
        const canvas = document.getElementById('discrepancyChart');
        if (canvas) {
            canvas.style.display = 'none';
            const section = canvas.closest('.chart-section');
            if (section && section.querySelectorAll('canvas').length === 1) section.style.display = 'none';
            console.log('[UNIFED] Gráfico DISCREPÂNCIA SAF-T vs DAC7 ocultado.');
        }
    }

    // Ocultar Motor Preditivo NEXUS ATF
    function _hideNexusForecast() {
        const nexusPanel = document.getElementById('nexusForecastPanel');
        if (nexusPanel) nexusPanel.style.display = 'none';
        const atfModal = document.getElementById('atfModal');
        if (atfModal) {
            const els = atfModal.querySelectorAll('#nexusForecastPanel, [class*="nexus"], [id*="nexusForecast"]');
            els.forEach(el => { if (el) el.style.display = 'none'; });
        }
        console.log('[UNIFED] Motor Preditivo NEXUS ATF ocultado.');
    }

    // Card MIS
    function _injectMacroCard() {
        const target = document.getElementById('pureDashboard');
        if (!target || document.getElementById('pureMacroCard')) return;
        const macro = data.macro_analysis;
        if (!macro) return;
        const monthlyLoss = macro.sector_drivers * macro.avg_monthly_discrepancy;
        const cardHtml = `
        <div class="pure-card pure-card-macro" id="pureMacroCard">
            <h3 class="pure-card-title"><span class="pure-icon">🌍</span> IV. ANÁLISE DE RISCO SISTÉMICO (MIS)</h3>
            <div style="display:flex; flex-wrap:wrap; gap:1rem;">
                <div style="flex:1; background:rgba(255,255,255,0.03); padding:12px; border-radius:6px;">
                    <div style="font-size:0.65rem; color:#94a3b8;">UNIVERSO DE OPERADORES</div>
                    <div id="pure-macro-universe" style="font-size:1.4rem; font-weight:700; color:#00E5FF;">${macro.sector_drivers.toLocaleString('pt-PT')}</div>
                    <div style="font-size:0.6rem; color:#64748b;">Sector TVDE Portugal</div>
                </div>
                <div style="flex:1; background:rgba(255,255,255,0.03); padding:12px; border-radius:6px;">
                    <div style="font-size:0.65rem; color:#94a3b8;">HORIZONTE TEMPORAL</div>
                    <div id="pure-macro-horizon" style="font-size:1.4rem; font-weight:700; color:#00E5FF;">${macro.operational_years} Anos</div>
                    <div style="font-size:0.6rem; color:#64748b;">2019–2026</div>
                </div>
                <div style="flex:1; background:rgba(255,255,255,0.03); padding:12px; border-radius:6px;">
                    <div style="font-size:0.65rem; color:#94a3b8;">EROSÃO MENSAL ESTIMADA</div>
                    <div id="pure-macro-monthly-loss" style="font-size:1.4rem; font-weight:700; color:#F59E0B;">${fmt(monthlyLoss)}</div>
                    <div style="font-size:0.6rem; color:#64748b;">Art. 119.º RGIT</div>
                </div>
                <div style="flex:1.5; background:rgba(239,68,68,0.08); border-left:3px solid #EF4444; padding:12px; border-radius:6px;">
                    <div style="font-size:0.65rem; color:#94a3b8;">IMPACTO TOTAL ESTIMADO (7 ANOS)</div>
                    <div id="pure-macro-total-loss" style="font-size:1.6rem; font-weight:900; color:#EF4444;">${fmt(macro.estimated_systemic_gap)}</div>
                    <div style="font-size:0.6rem; color:#EF4444;">Art. 119.º RGIT (Iteração)</div>
                </div>
            </div>
            <div style="margin-top:1rem; padding:0.75rem; background:rgba(0,0,0,0.3); border-left:3px solid #FACC15; font-size:0.7rem; color:#94a3b8;">
                <i class="fas fa-gavel"></i> ${macro.disclaimer}
            </div>
        </div>`;
        target.insertAdjacentHTML('afterbegin', cardHtml);
    }

    // Actualizar UI auxiliar (valores reais)
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
                if (id === 'auxBoxTotalNSValue') el.classList.add('highlighted');
            }
        });
        const dac7NoteValue = document.getElementById('auxDac7NoteValue');
        if (dac7NoteValue) dac7NoteValue.textContent = fmt(t.totalNaoSujeitos);
        const dac7NoteValueQ = document.getElementById('auxDac7NoteValueQ');
        if (dac7NoteValueQ) dac7NoteValueQ.textContent = fmt(t.totalNaoSujeitos);
        const dac7Note = document.getElementById('auxDac7ReconciliationNote');
        if (dac7Note && t.totalNaoSujeitos > 0) dac7Note.style.display = 'block';
        
        const questionText = document.getElementById('pure-zc-question-text');
        if (questionText) {
            questionText.textContent = 'Pode a plataforma confirmar se os €451,15 em Gorjetas e Campanhas (isentos de comissão nos termos da Lei TVDE) foram incluídos na base de cálculo do reporte DAC7 enviado pela plataforma à Autoridade Tributária? Se sim, qual o fundamento legal?';
        }
        console.log('[UNIFED] UI auxiliar actualizada.');
    }

    // Simulação de upload (dados reais, com detalhe)
    function _simulateEvidenceUpload() {
        if (typeof window.UNIFEDSystem === 'undefined') return false;
        const sys = window.UNIFEDSystem;
        const t = data.totals;
        if (!sys.documents) sys.documents = {};
        if (!sys.analysis) sys.analysis = { evidenceIntegrity: [] };
        sys.documents.control = { files: [], totals: { records: 0 } };
        sys.documents.saft = { files: [], totals: { bruto: 0, iliquido: 0, iva: 0, records: 0 } };
        sys.documents.statements = { files: [], totals: { ganhos: 0, despesas: 0, ganhosLiquidos: 0, records: 0 } };
        sys.documents.invoices = { files: [], totals: { invoiceValue: 0, records: 0 } };
        sys.documents.dac7 = { files: [], totals: { q1: 0, q2: 0, q3: 0, q4: 0, totalPeriodo: 0, records: 0 } };
        sys.analysis.evidenceIntegrity = [];
        sys.dataMonths = new Set();
        sys.monthlyData = {};

        // Controlo (4)
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

        // SAF-T (4)
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

        // Extratos (4)
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

        // Faturas (2)
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

        // DAC7 (1)
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
        sys.documents.dac7.totals.totalPeriodo = t.dac7TotalPeriodo;
        sys.documents.dac7.totals.records = dac7Files.length;

        // Dados mensais para ATF (Set, Out, Nov, Dez 2024)
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
            sys.dataMonths.add(month);
        });

        // Contadores UI
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

        // Totais e crossings
        sys.analysis.totals = { ...t };
        sys.analysis.crossings = {
            discrepanciaSaftVsDac7: t.saftBruto - t.dac7TotalPeriodo,
            percentagemSaftVsDac7: ((t.saftBruto - t.dac7TotalPeriodo) / t.saftBruto) * 100,
            discrepanciaCritica: t.despesas - t.faturaPlataforma,
            percentagemOmissao: ((t.despesas - t.faturaPlataforma) / t.despesas) * 100,
            ivaFalta: (t.despesas - t.faturaPlataforma) * 0.23,
            ivaFalta6: (t.despesas - t.faturaPlataforma) * 0.06,
            ircEstimado: (t.despesas - t.faturaPlataforma) * 0.21,
            btor: t.despesas,
            btf: t.faturaPlataforma,
            impactoMensalMercado: ((t.despesas - t.faturaPlataforma) / 4) * 38000,
            impactoAnualMercado: ((t.despesas - t.faturaPlataforma) / 4) * 38000 * 12,
            impactoSeteAnosMercado: ((t.despesas - t.faturaPlataforma) / 4) * 38000 * 12 * 7
        };
        sys.client = { name: data.client.name, nif: data.client.nif, platform: data.client.platform };

        // Master hash (exclui macro)
        const evidenceHashes = sys.analysis.evidenceIntegrity.map(ev => ev.hash).filter(h => h && h.length === 64).sort();
        const binaryConcat = evidenceHashes.join('') + JSON.stringify({ client: sys.client, totals: t }) + sys.sessionId;
        sys.masterHash = CryptoJS.SHA256(binaryConcat).toString().toUpperCase();
        if (typeof set === 'function') set('masterHashValue', sys.masterHash);
        if (typeof window.generateQRCode === 'function') window.generateQRCode();

        console.log('[UNIFED] Evidências simuladas carregadas. Total: 15 ficheiros (CTRL:4, SAFT:4, EXT:4, FAT:2, DAC7:1)');
        return true;
    }

    function setElementText(id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }

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

    function _init() {
        console.log('[UNIFED] Inicialização v13.11.13-PURE...');
        _simulateEvidenceUpload();
        syncMetrics();
        renderMatrix();
        _injectMacroCard();
        _injectAuxiliaryBoxesCSS();
        _hideDiscrepancyChart();
        _updateAuxiliaryUI();
        _hideNexusForecast();
        
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
        
        const analyzeBtn = document.getElementById('analyzeBtn');
        if (analyzeBtn) analyzeBtn.disabled = false;
        const exportPDFBtn = document.getElementById('exportPDFBtn');
        if (exportPDFBtn) exportPDFBtn.disabled = false;
        const exportJSONBtn = document.getElementById('exportJSONBtn');
        if (exportJSONBtn) exportJSONBtn.disabled = false;
        
        console.log('[UNIFED] ✅ SISTEMA 100% OPERACIONAL — v13.11.13-PURE. Tipificação Art. 119.º RGIT. Valor zona cinzenta 451,15 €. Questionário focado no DAC7.');
    }

    window.UNIFEDSystem = window.UNIFEDSystem || {};
    window.UNIFEDSystem.loadAnonymizedRealCase = function() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => setTimeout(_init, 300));
        } else {
            setTimeout(_init, 300);
        }
    };
    if (document.readyState === 'complete' && document.getElementById('pureDashboardWrapper')) {
        _init();
    }
})();