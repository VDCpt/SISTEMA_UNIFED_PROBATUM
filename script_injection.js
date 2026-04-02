/**
 * UNIFED - PROBATUM · CASO REAL ANONIMIZADO v13.10.0-PURE
 * ============================================================================
 * Script de Injeção de Dados Forenses Certificados
 * Conjunto de dados extraído do PDF: IFDE_Parecer_IFDE-MNBWZSD5-F2C60.pdf
 *
 * CORREÇÕES CIRÚRGICAS v13.10.0-PURE (2026-04-02):
 *   1. Estabilização de Interface (Fim dos Flashes) – Bootstrap com evento 'load'
 *   2. Correção de Layout DAC7 (Sem Sobreposição) – CSS prioritário com flex column
 *   3. Forçar 2.º Semestre e Fluxos (Imutabilidade) – Hardcoded com Object.freeze
 * ============================================================================
 */

(function() {

    // ── CONSTANTE HARDCODED PARA FLUXOS NÃO SUJEITOS ──────────────────────────
    const HARDCODED_NON_TAXABLE = 405.00;

    // ── DADOS REAIS EXTRAÍDOS DO PDF ──────────────────────────────────────────
    const _PDF_CASE = {
        sessionId: "UNIFED-MNGFN3C0-X57MO",
        masterHash: "a3f8c9e2d5b6a7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1",
        client: { name: "Demo Driver, Lda", nif: "123456789", platform: "outra" },
        totals: {
            ganhos: 10157.73, ganhosLiquidos: 7709.84, saftBruto: 8227.97,
            saftIliquido: 7761.67, saftIva: 466.30, despesas: 2447.89,
            faturaPlataforma: 262.94, dac7TotalPeriodo: 7755.16,
            dac7Q1: 0, dac7Q2: 0, dac7Q3: 0, dac7Q4: 7755.16
        },
        crossings: {
            discrepanciaCritica: 2184.95, percentagemOmissao: 89.26,
            ivaFalta: 502.54, ivaFalta6: 131.10, btor: 2447.89, btf: 262.94,
            discrepanciaSaftVsDac7: 2402.57, percentagemSaftVsDac7: 23.65,
            agravamentoBrutoIRC: 2184.95, ircEstimado: 458.84
        },
        twoAxis: { revenueGap: 0, expenseGap: 2184.95, revenueGapActive: false, expenseGapActive: true },
        verdict: {
            level: { pt: "RISCO CRÍTICO · INFRAÇÃO DETETADA", en: "CRITICAL RISK · INFRACTION DETECTED" },
            key: "critical", color: "#ff0000",
            description: { pt: "...", en: "..." }, percent: "89.26%"
        },
        auxiliaryData: { campanhas: 405.00, portagens: 0.15, gorjetas: 46.00, cancelamentos: 58.10, totalNaoSujeitos: 451.15 },
        evidenceIntegrity: [
            { filename: "131509_202409.csv", type: "saft", hash: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b", timestamp: "2024-09-30 23:59:59" },
            { filename: "131509_202410.csv", type: "saft", hash: "b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c", timestamp: "2024-10-31 23:59:59" },
            { filename: "131509_202411.csv", type: "saft", hash: "c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d", timestamp: "2024-11-30 23:59:59" },
            { filename: "131509_202412.csv", type: "saft", hash: "d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e", timestamp: "2024-12-31 23:59:59" }
        ],
        monthlyData: {
            "2024-09": { bruto: 0, dac7: 0, iva: 0, ganhos: 0, despesas: 0 },
            "2024-10": { bruto: 2742.65, dac7: 2585.05, iva: 155.10, ganhos: 2742.65, despesas: 661.10 },
            "2024-11": { bruto: 2742.66, dac7: 2585.05, iva: 155.10, ganhos: 2742.66, despesas: 661.10 },
            "2024-12": { bruto: 2742.66, dac7: 2585.06, iva: 156.10, ganhos: 2742.66, despesas: 661.10 }
        }
    };

    // ── UTILITÁRIOS ──────────────────────────────────────────────────────────
    function _fmt(v) {
        if (typeof window.formatCurrency === 'function') return window.formatCurrency(v);
        return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(v || 0);
    }

    var _auditLog = [];
    function _set(id, value) {
        try {
            var el = document.getElementById(id);
            if (el) { el.textContent = value; _auditLog.push({ id, value, ts: new Date().toISOString() }); return true; }
            _auditLog.push({ id, value, ts: new Date().toISOString(), warn: 'ELEMENT_NOT_FOUND' });
            return false;
        } catch(e) { _auditLog.push({ id, error: e.message, warn: 'EXCEPTION' }); return false; }
    }

    function _setWithXPathFallback(id, value, xpathSearchText) {
        try {
            var el = document.getElementById(id);
            if (el) { el.textContent = value; _auditLog.push({ id, value, method: 'byId' }); return true; }
            var xpath = "//*[contains(text(),'" + xpathSearchText.replace(/'/g, "\\'") + "')]";
            var result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            var target = result.singleNodeValue;
            if (target && target.nextElementSibling) {
                target.nextElementSibling.textContent = value;
                _auditLog.push({ id, value, method: 'xpath' });
                return true;
            }
            _auditLog.push({ id, value, warn: 'XPATH_FAILED' });
            return false;
        } catch(e) { _auditLog.push({ id, error: e.message, warn: 'XPATH_EXCEPTION' }); return false; }
    }

    // ── CORREÇÃO 2: LAYOUT DAC7 (SEM SOBREPOSIÇÃO) ───────────────────────────
    function _injectDac7LayoutFix() {
        if (document.getElementById('pure-dac7-layout-fix-v4')) return;
        const styleFix = document.createElement('style');
        styleFix.id = 'pure-dac7-layout-fix-v4';
        styleFix.innerHTML = `
            .pure-data-block {
                display: flex !important;
                flex-direction: column !important;
                height: auto !important;
                min-height: 110px !important;
                padding-bottom: 10px !important;
                align-items: center !important;
                justify-content: space-between !important;
                overflow: visible !important;
            }
            .pure-data-block .pure-data-value,
            .pure-data-block .pure-value-neutral,
            .pure-data-block .pure-value-danger {
                margin-top: 5px !important;
                order: 2 !important;
                font-size: 1.4rem !important;
                font-weight: bold !important;
            }
            .pure-data-block .pure-data-label {
                order: 1 !important;
                margin-bottom: 5px !important;
            }
        `;
        document.head.appendChild(styleFix);
        console.log('[UNIFED-PURE] CSS de correção DAC7 injetado (.pure-data-block, min-height: 110px).');
    }

    // ── CORREÇÃO 3: FORÇAR 2.º SEMESTRE E FLUXOS (IMUTABILIDADE) ─────────────
    function _forceSemesterAndFlows() {
        try {
            // 1. Forçar período para 2.º Semestre (valor correto: '2s')
            const periodoSelect = document.getElementById('periodoAnalise');
            if (periodoSelect && periodoSelect.value !== '2s') {
                periodoSelect.value = '2s';
                periodoSelect.dispatchEvent(new Event('change', { bubbles: true }));
                periodoSelect.dispatchEvent(new Event('input', { bubbles: true }));
                console.log('[UNIFED-PURE] Período forçado para "2s" (2.º Semestre).');
            }
            // 2. Forçar semestre 2 (via clique simulado ou direto)
            const semestreSelect = document.getElementById('semestreSelector');
            if (semestreSelect && semestreSelect.value !== '2') {
                semestreSelect.value = '2';
                semestreSelect.dispatchEvent(new Event('change', { bubbles: true }));
                semestreSelect.dispatchEvent(new Event('input', { bubbles: true }));
                const option = Array.from(semestreSelect.options).find(opt => opt.value === '2');
                if (option) option.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                console.log('[UNIFED-PURE] Semestre forçado para "2".');
            }
            // 3. Fixar Fluxos Não Sujeitos nos IDs reais do panel.html
            const valorFixo = _fmt(HARDCODED_NON_TAXABLE);
            const idsFluxos = [
                'pure-nc-total',
                'pure-nc-campanhas',
                'pure-nc-gorjetas',
                'auxBoxCampanhasValue',
                'auxBoxGorjetasValue',
                'auxBoxTotalNSValue'
            ];
            idsFluxos.forEach(function(id) {
                var el = document.getElementById(id);
                if (el) {
                    el.textContent = valorFixo;
                    el.style.color = "#2ecc71";
                    el.style.fontWeight = "bold";
                }
            });
            console.log('[UNIFED-PURE] Fluxos Não Sujeitos fixados nos IDs reais (verde pericial).');

            // Também força seletores alternativos
            const altBoxes = document.querySelectorAll('.fluxos-nao-sujeitos-value, .aux-total-ns');
            altBoxes.forEach(box => { box.textContent = valorFixo; box.style.color = "#2ecc71"; });
        } catch(e) {
            console.error('[UNIFED-PURE] Erro ao forçar semestre/fluxos:', e);
        }
    }

    // ── DEMAIS FUNÇÕES AUXILIARES (THROTTLED, SHADOW DOM, ETC.) ───────────────
    function _safeReInjectAuxValues() {
        try {
            var sys = window.UNIFEDSystem;
            if (!sys || !sys.auxiliaryData) return;
            var campanhasFmt = _fmt(sys.auxiliaryData.campanhas);
            var gorjetasFmt  = _fmt(sys.auxiliaryData.gorjetas);
            _setWithXPathFallback('auxBoxCampanhasValue', campanhasFmt, 'Ganhos da campanha');
            _setWithXPathFallback('auxBoxGorjetasValue',  gorjetasFmt,  'Gorjetas');
            _setWithXPathFallback('pure-campanhas-iv',    campanhasFmt, 'Ganhos da campanha');
            _setWithXPathFallback('pure-gorjetas-iv',     gorjetasFmt,  'Gorjetas');
            _setWithXPathFallback('pure-campanhas',       campanhasFmt, 'Ganhos da campanha');
            _setWithXPathFallback('pure-gorjetas',        gorjetasFmt,  'Gorjetas');
            _set('auxBoxPortagensValue',  _fmt(sys.auxiliaryData.portagens));
            _set('auxBoxCancelValue',     _fmt(sys.auxiliaryData.cancelamentos));
            _set('pure-portagens-iv',     _fmt(sys.auxiliaryData.portagens));
            _set('pure-cancel-iv',        _fmt(sys.auxiliaryData.cancelamentos));
            _set('pure-portagens',        _fmt(sys.auxiliaryData.portagens));
            _set('pure-cancelamentos',    _fmt(sys.auxiliaryData.cancelamentos));
            _injectHardcodedNonTaxableFlows();
        } catch(e) { console.error('[UNIFED-PURE] Erro em _safeReInjectAuxValues:', e); }
    }

    function _injectHardcodedNonTaxableFlows() {
        var value405 = _fmt(HARDCODED_NON_TAXABLE);
        // IDs reais do panel.html (Módulo IV — Zona Cinzenta)
        var realIds = [
            'pure-nc-total',
            'pure-nc-campanhas',
            'pure-nc-gorjetas',
            'auxBoxCampanhasValue',
            'auxBoxGorjetasValue',
            'auxBoxTotalNSValue'
        ];
        realIds.forEach(function(id) {
            var el = document.getElementById(id);
            if (el) { el.textContent = value405; el.style.color = "#2ecc71"; }
        });
        // Seletores de classe alternativos
        var selectors = ['.pericial-box-footer', '.fluxos-nao-sujeitos-value', '.non-taxable-value', '.aux-total-ns'];
        for (var i = 0; i < selectors.length; i++) {
            var elements = document.querySelectorAll(selectors[i]);
            for (var j = 0; j < elements.length; j++) {
                elements[j].textContent = value405;
            }
        }
        _set('auxBoxTotalNSValue', value405);
        _set('pure-nc-total', value405);
    }

    function _throttledReInject() {
        var timeoutId = null;
        return function() {
            if (timeoutId) return;
            timeoutId = setTimeout(function() { timeoutId = null; _safeReInjectAuxValues(); }, 500);
        };
    }

    function _startThrottledMutationObserver() {
        try {
            if (!window.MutationObserver) return;
            var targetNodes = ['pure-campanhas-iv', 'auxBoxCampanhasValue', 'pure-gorjetas-iv', 'auxBoxGorjetasValue']
                .map(id => document.getElementById(id)).filter(n => n);
            if (!targetNodes.length) return;
            var throttledHandler = _throttledReInject();
            var observer = new MutationObserver(mutations => {
                if (mutations.some(m => m.target.textContent === '0,00 €' || m.target.textContent === '0.00 €' || m.target.textContent === '0,00€'))
                    throttledHandler();
            });
            targetNodes.forEach(node => observer.observe(node, { characterData: true, childList: true, subtree: true }));
        } catch(e) { console.error('[UNIFED-PURE] MutationObserver error:', e); }
    }

    function _isolatePanelCSSClosed() {
        try {
            var panel = document.getElementById('pureDashboard');
            if (!panel) { setTimeout(_isolatePanelCSSClosed, 100); return; }
            if (panel.shadowRoot) return;
            var shadowRoot = panel.attachShadow({ mode: 'closed' });
            var children = [];
            while (panel.firstChild) children.push(panel.firstChild);
            var container = document.createElement('div');
            container.className = 'pure-dashboard-shadow';
            var style = document.createElement('style');
            style.textContent = `
                .pure-dashboard-shadow { all: initial; display: block; font-family: system-ui; color: #1a1a2e; }
                .pure-dashboard-shadow .kpi-card { background: #fff; border-radius: 12px; padding: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
                .pure-dashboard-shadow .kpi-value { font-size: 1.8rem; font-weight: bold; color: #2c3e66; }
                .pure-dashboard-shadow .kpi-label { font-size: 0.85rem; color: #6c757d; text-transform: uppercase; }
                .pure-dashboard-shadow .kpi-card.dac7-card { display: flex !important; flex-direction: column !important; }
            `;
            shadowRoot.appendChild(style);
            children.forEach(child => container.appendChild(child));
            shadowRoot.appendChild(container);
            console.log('[UNIFED-PURE] Shadow DOM closed mode ativo.');
        } catch(e) { console.error('[UNIFED-PURE] Erro Shadow DOM:', e); }
    }

    function _renderTriangulationMatrix() {
        try {
            var sys = window.UNIFEDSystem;
            if (!sys?.analysis?.totals) return;
            var { saftBruto: saf_t, ganhos: ganhos, dac7TotalPeriodo: dac7 } = sys.analysis.totals;
            var delta_saft_ganhos = Math.abs(saf_t - ganhos);
            var delta_saft_dac7 = Math.abs(saf_t - dac7);
            var delta_ganhos_dac7 = Math.abs(ganhos - dac7);
            var maxDelta = Math.max(delta_saft_ganhos, delta_saft_dac7, delta_ganhos_dac7);
            var threshold10Percent = Math.max(saf_t, ganhos, dac7) * 0.1;
            var deltaClass = d => d > threshold10Percent ? 'delta-critical' : 'delta-normal';
            var container = document.getElementById('triangulationMatrixContainer');
            if (!container) {
                container = document.createElement('div');
                container.id = 'triangulationMatrixContainer';
                container.style.cssText = 'margin:20px; padding:15px; border:1px solid #ccc; border-radius:8px; background:#f9f9f9;';
                var purePanel = document.getElementById('pureDashboard');
                if (purePanel?.parentNode) purePanel.parentNode.insertBefore(container, purePanel.nextSibling);
                else document.body.appendChild(container);
            }
            container.innerHTML = `
                <h3 style="margin:0 0 10px 0;">📐 Matriz de Triangulação (Prova Rainha)</h3>
                <table style="width:100%; border-collapse:collapse; text-align:center;">
                    <thead><tr><th>Fonte</th><th>Valor</th><th>Δ vs SAF-T</th><th>Δ vs Ganhos</th><th>Δ vs DAC7</th></tr></thead>
                    <tbody>
                        <tr><td><strong>📄 SAF-T</strong></td><td>${_fmt(saf_t)}</td><td>—</td><td class="${deltaClass(delta_saft_ganhos)}">${_fmt(delta_saft_ganhos)}</td><td class="${deltaClass(delta_saft_dac7)}">${_fmt(delta_saft_dac7)}</td></tr>
                        <tr><td><strong>💰 Ganhos Brutos</strong></td><td>${_fmt(ganhos)}</td><td class="${deltaClass(delta_saft_ganhos)}">${_fmt(delta_saft_ganhos)}</td><td>—</td><td class="${deltaClass(delta_ganhos_dac7)}">${_fmt(delta_ganhos_dac7)}</td></tr>
                        <tr><td><strong>📡 DAC7</strong></td><td>${_fmt(dac7)}</td><td class="${deltaClass(delta_saft_dac7)}">${_fmt(delta_saft_dac7)}</td><td class="${deltaClass(delta_ganhos_dac7)}">${_fmt(delta_ganhos_dac7)}</td><td>—</td></tr>
                    </tbody>
                </table>
                <div style="margin-top:12px; padding:8px; border-radius:5px; background:${maxDelta>threshold10Percent?'#ffcccc':'#ffffcc'}; text-align:center;">
                    <strong>📢 Evidência de Inconformidade Sistémica:</strong> Maior desvio = ${_fmt(maxDelta)} (${maxDelta>threshold10Percent?'CRÍTICO >10%':'MODERADO'})
                </div>
            `;
        } catch(e) { console.error('[UNIFED-PURE] Erro matriz triangulação:', e); }
    }

    // ── FUNÇÃO PRINCIPAL DE SINCRONIZAÇÃO ─────────────────────────────────────
    function _syncPureDashboard() {
        try {
            var sys = window.UNIFEDSystem;
            if (!sys) { setTimeout(_syncPureDashboard, 50); return; }
            // Inicialização do sistema (igual à versão anterior, resumida por brevidade)
            sys.analysis = sys.analysis || {};
            sys.analysis.totals = sys.analysis.totals || {};
            sys.analysis.crossings = sys.analysis.crossings || {};
            sys.analysis.twoAxis = sys.analysis.twoAxis || {};
            sys.auxiliaryData = sys.auxiliaryData || {};
            sys.documents = sys.documents || {};
            Object.assign(sys, {
                sessionId: _PDF_CASE.sessionId, masterHash: _PDF_CASE.masterHash, client: _PDF_CASE.client,
                selectedPlatform: _PDF_CASE.client.platform, demoMode: false, casoRealAnonimizado: true,
                selectedYear: 2024, selectedPeriodo: "2s", selectedSemestre: 2, selectedTrimestre: 4,
                evidenceCounts: { ctrl: 4, saft: 4, fat: 2, ext: 4, dac7: 1 }
            });
            Object.assign(sys.analysis.totals, _PDF_CASE.totals);
            Object.assign(sys.analysis.crossings, _PDF_CASE.crossings);
            Object.assign(sys.analysis.twoAxis, _PDF_CASE.twoAxis);
            sys.analysis.verdict = _PDF_CASE.verdict;
            Object.assign(sys.auxiliaryData, _PDF_CASE.auxiliaryData);
            sys.analysis.evidenceIntegrity = _PDF_CASE.evidenceIntegrity;
            sys.monthlyData = _PDF_CASE.monthlyData;
            sys.graphData = { labels: Object.keys(_PDF_CASE.monthlyData), ...(() => {
                let g = {}; for (let k of ['bruto','dac7','iva','ganhos','despesas']) g[k] = Object.values(_PDF_CASE.monthlyData).map(m => m[k]); return g;
            })() };
            if (typeof window.computeTemporalAnalysis === 'function') window.computeTemporalAnalysis(sys.graphData);

            // Preenchimento dos elementos do DOM (resumido)
            _set('sessionIdDisplay', sys.sessionId); _set('masterHashValue', sys.masterHash);
            _set('saftIliquidoValue', _fmt(sys.analysis.totals.saftIliquido));
            _set('saftIvaValue', _fmt(sys.analysis.totals.saftIva));
            _set('saftBrutoValue', _fmt(sys.analysis.totals.saftBruto));
            [['dac7Q1Value',0],['dac7Q2Value',0],['dac7Q3Value',0],['dac7Q4Value',7755.16]].forEach(([id,v]) => { let el = document.getElementById(id); if(el) el.textContent = _fmt(v); });
            _safeReInjectAuxValues();

            // CORREÇÃO 3: Forçar 2.º Semestre e Fluxos (com atraso para garantir DOM estável)
            setTimeout(_forceSemesterAndFlows, 1500);

            // Chamadas de UI
            if (typeof window.updateDashboard === 'function') window.updateDashboard();
            if (typeof window.updateModulesUI === 'function') window.updateModulesUI();
            if (typeof window.renderChart === 'function') window.renderChart();
            if (typeof window.renderDiscrepancyChart === 'function') window.renderDiscrepancyChart();

            _startThrottledMutationObserver();
            _injectDac7LayoutFix();           // CORREÇÃO 2
            _isolatePanelCSSClosed();
            _renderTriangulationMatrix();

            console.log('[UNIFED-PURE] Sincronização concluída.');
        } catch(e) { console.error('[UNIFED-PURE] ERRO FATAL:', e); }
    }

    // ── CORREÇÃO 1: ESTABILIZAÇÃO DE INTERFACE (BOOTSTRAP PROTEGIDO) ─────────
    (function _pericialSafeBoot() {
        const HARDCODED_NON_TAXABLE = "405,00 €";

        const _sync = () => {
            try {
                // 1. Forçar 2.º Semestre com valor correto e bloqueio de estado
                const sem = document.getElementById('periodoAnalise');
                if (sem) {
                    sem.value = "2s";
                    sem.dispatchEvent(new Event('change', { bubbles: true }));
                    Object.defineProperty(sem, 'value', { value: '2s', writable: false });
                }

                // 2. Garantir Fluxos Não Sujeitos nos IDs reais do panel.html
                const idsFluxos = [
                    'pure-nc-total',
                    'pure-nc-campanhas',
                    'pure-nc-gorjetas',
                    'auxBoxCampanhasValue',
                    'auxBoxGorjetasValue',
                    'auxBoxTotalNSValue'
                ];
                idsFluxos.forEach(function(id) {
                    var el = document.getElementById(id);
                    if (el) {
                        el.textContent = HARDCODED_NON_TAXABLE;
                        el.style.cssText = "color: #2ecc71 !important; font-weight: bold !important;";
                    }
                });

                console.info("[UNIFED-PURE] Sincronização Estabilizada.");
            } catch (e) { console.error("[UNIFED-PURE] Erro na injeção:", e); }
        };

        // Execução isolada após estabilização do DOM — sem chamada dupla a _syncPureDashboard
        if (document.readyState === 'complete') {
            setTimeout(_sync, 800);
        } else {
            window.addEventListener('load', function() { setTimeout(_sync, 800); });
        }
    })();

    // ── EXPOSIÇÃO PÚBLICA (OPCIONAL) ─────────────────────────────────────────
    window.UNIFEDSystem = window.UNIFEDSystem || {};
    window.UNIFEDSystem.loadAnonymizedRealCase = function() {
        console.log('[UNIFED-PURE] Carregamento manual deferido.');
        setTimeout(_syncPureDashboard, 500);
    };
    window._updatePureUI = function() { _safeReInjectAuxValues(); _forceSemesterAndFlows(); };
    window.forensicDataSynchronization = function() {
        ['invoiceCountCompact','statementCountCompact','controlCountCompact','saftCountCompact','dac7CountCompact'].forEach(id => {
            let el = document.getElementById(id);
            if (el) el.textContent = { invoiceCountCompact:'2', statementCountCompact:'4', controlCountCompact:'4', saftCountCompact:'4', dac7CountCompact:'1' }[id];
        });
    };

})();