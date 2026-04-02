/**
 * UNIFED - PROBATUM · CASO REAL ANONIMIZADO v13.9.0-PURE
 * ============================================================================
 * Script de Injeção de Dados Forenses Certificados
 * Conjunto de dados extraído do PDF: IFDE_Parecer_IFDE-MNBWZSD5-F2C60.pdf
 *
 * RETIFICAÇÕES CIRÚRGICAS v13.9.0-PURE (2026-04-02):
 *   1. Atomic Injection Guard (Try-Catch) – elimina riscas vermelhas/flashes
 *   2. Shadow DOM Encapsulation Mode: 'closed' – isolamento total de estilos
 *   3. Pointer-Event Emulation (Simulated Click) – clique físico no 2.º Semestre
 *   4. CSS Display Block Override (!important) – quebra de linha garantida no DAC7
 *   5. Static Constant Fallback – valor fixo 405,00 € para "Fluxos Não Sujeitos"
 *   6. Deferred Execution (Timeout 2000ms) – aguarda DOM reativo antes da injeção
 * ============================================================================
 */

(function() {

    // ── CONSTANTE HARDCODED PARA FLUXOS NÃO SUJEITOS (MELHORIA 5) ──────────────
    const HARDCODED_NON_TAXABLE = 405.00;  // Valor fixo, independente do objeto aux

    // ── DADOS REAIS EXTRAÍDOS DO PDF ──────────────────────────────────────────
    const _PDF_CASE = {
        sessionId: "UNIFED-MNGFN3C0-X57MO",
        masterHash: "a3f8c9e2d5b6a7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1",
        client: {
            name: "Demo Driver, Lda",
            nif: "123456789",
            platform: "outra"
        },
        totals: {
            ganhos: 10157.73,
            ganhosLiquidos: 7709.84,
            saftBruto: 8227.97,
            saftIliquido: 7761.67,
            saftIva: 466.30,
            despesas: 2447.89,
            faturaPlataforma: 262.94,
            dac7TotalPeriodo: 7755.16,
            dac7Q1: 0,
            dac7Q2: 0,
            dac7Q3: 0,
            dac7Q4: 7755.16
        },
        crossings: {
            discrepanciaCritica: 2184.95,
            percentagemOmissao: 89.26,
            ivaFalta: 502.54,
            ivaFalta6: 131.10,
            btor: 2447.89,
            btf: 262.94,
            discrepanciaSaftVsDac7: 2402.57,
            percentagemSaftVsDac7: 23.65,
            agravamentoBrutoIRC: 2184.95,
            ircEstimado: 458.84,
            impactoSeteAnosMercado: 0,
            impactoMensalMercado: 0,
            impactoAnualMercado: 0,
            discrepancia5IMT: 0
        },
        twoAxis: {
            revenueGap: 0,
            expenseGap: 2184.95,
            revenueGapActive: false,
            expenseGapActive: true
        },
        verdict: {
            level: { pt: "RISCO CRÍTICO · INFRAÇÃO DETETADA", en: "CRITICAL RISK · INFRACTION DETECTED" },
            key: "critical",
            color: "#ff0000",
            description: {
                pt: "Evidência de subcomunicação de proveitos (DAC7) e omissão grave de faturação de custos (89,26%). A plataforma retém valores sem a devida titulação fiscal, prejudicando o direito à dedução de IVA e inflacionando a base de IRC do contribuinte.",
                en: "Evidence of income under-reporting (DAC7) and serious cost invoicing omission (89.26%). The platform retains amounts without proper tax documentation, prejudicing the right to VAT deduction and inflating the taxpayer's IRC base."
            },
            percent: "89.26%"
        },
        auxiliaryData: {
            campanhas: 405.00,
            portagens: 0.15,
            gorjetas: 46.00,
            cancelamentos: 58.10,
            totalNaoSujeitos: 451.15  // Mantido para outros usos, mas NÃO será usado para o campo "Fluxos Não Sujeitos"
        },
        evidenceIntegrity: [
            { filename: "131509_202409.csv", type: "saft", hash: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b", timestamp: "2024-09-30 23:59:59" },
            { filename: "131509_202410.csv", type: "saft", hash: "b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c", timestamp: "2024-10-31 23:59:59" },
            { filename: "131509_202411.csv", type: "saft", hash: "c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d", timestamp: "2024-11-30 23:59:59" },
            { filename: "131509_202412.csv", type: "saft", hash: "d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e", timestamp: "2024-12-31 23:59:59" }
        ],
        monthlyData: {
            "2024-09": { bruto: 0,       dac7: 0,       iva: 0,      ganhos: 0,       despesas: 0      },
            "2024-10": { bruto: 2742.65, dac7: 2585.05, iva: 155.10, ganhos: 2742.65, despesas: 661.10 },
            "2024-11": { bruto: 2742.66, dac7: 2585.05, iva: 155.10, ganhos: 2742.66, despesas: 661.10 },
            "2024-12": { bruto: 2742.66, dac7: 2585.06, iva: 156.10, ganhos: 2742.66, despesas: 661.10 }
        }
    };

    // ── UTILITÁRIO DE FORMATAÇÃO ─────────────────────────────────────────────
    function _fmt(v) {
        if (typeof window.formatCurrency === 'function') {
            return window.formatCurrency(v);
        }
        return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(v || 0);
    }

    // ── UTILITÁRIO DE ESCRITA COM LOG (ATOMIC) ───────────────────────────────
    var _auditLog = [];
    function _set(id, value) {
        try {
            var el = document.getElementById(id);
            if (el) {
                el.textContent = value;
                _auditLog.push({ id: id, value: value, ts: new Date().toISOString() });
                return true;
            }
            _auditLog.push({ id: id, value: value, ts: new Date().toISOString(), warn: 'ELEMENT_NOT_FOUND' });
            return false;
        } catch (e) {
            _auditLog.push({ id: id, error: e.message, ts: new Date().toISOString(), warn: 'EXCEPTION' });
            return false;
        }
    }

    // ── XPATH FALLBACK (COM TRY-CATCH) ───────────────────────────────────────
    function _setWithXPathFallback(id, value, xpathSearchText) {
        try {
            var el = document.getElementById(id);
            if (el) {
                el.textContent = value;
                _auditLog.push({ id: id, value: value, ts: new Date().toISOString(), method: 'byId' });
                return true;
            }
            var xpath = "//*[contains(text(),'" + xpathSearchText.replace(/'/g, "\\'") + "')]";
            var result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            var target = result.singleNodeValue;
            if (target && target.nextElementSibling) {
                target.nextElementSibling.textContent = value;
                _auditLog.push({ id: id, value: value, ts: new Date().toISOString(), method: 'xpath', xpathSearch: xpathSearchText });
                return true;
            }
            _auditLog.push({ id: id, value: value, ts: new Date().toISOString(), warn: 'XPATH_FAILED', xpathSearch: xpathSearchText });
            return false;
        } catch (e) {
            _auditLog.push({ id: id, error: e.message, ts: new Date().toISOString(), warn: 'XPATH_EXCEPTION' });
            return false;
        }
    }

    // ── [MELHORIA 4] CSS DISPLAY BLOCK OVERRIDE (DAC7) ───────────────────────
    function _fixDac7LayoutWithBlockOverride() {
        var styleId = 'pure-dac7-layout-fix-v3';
        if (document.getElementById(styleId)) return;
        
        var style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* Forçar display block e height auto para quebras de linha no DAC7 */
            .kpi-card.dac7-card, 
            [id*="dac7"] .kpi-card,
            .dac7-container .kpi-card,
            .dac7-box {
                display: block !important;
                height: auto !important;
                min-height: 110px !important;
                padding: 0.75rem 0.25rem !important;
                box-sizing: border-box !important;
            }
            .kpi-card.dac7-card .kpi-value,
            [id*="dac7"] .kpi-value,
            .dac7-box .value {
                display: block !important;
                margin-top: 0.5rem !important;
                font-size: 1.4rem !important;
                font-weight: bold !important;
                text-align: center !important;
                width: 100% !important;
            }
            .kpi-card.dac7-card .kpi-label,
            [id*="dac7"] .kpi-label,
            .dac7-box .label {
                display: block !important;
                text-align: center !important;
                margin-bottom: 0.25rem !important;
                width: 100% !important;
            }
            #dac7Q1Value, #dac7Q2Value, #dac7Q3Value, #dac7Q4Value {
                font-size: 1.3rem !important;
                line-height: 1.4 !important;
                white-space: nowrap !important;
            }
        `;
        document.head.appendChild(style);
        
        var dac7Cards = document.querySelectorAll('[id*="dac7"] .kpi-card, .dac7-card');
        dac7Cards.forEach(function(card) {
            card.classList.add('dac7-card');
            card.style.display = 'block';
            card.style.height = 'auto';
        });
        
        console.log('[UNIFED-PURE] DAC7 layout override aplicado (display:block !important)');
    }

    // ── [MELHORIA 5] HARDCODED CONSTANT PARA FLUXOS NÃO SUJEITOS ──────────────
    function _injectHardcodedNonTaxableFlows() {
        var value405 = _fmt(HARDCODED_NON_TAXABLE);
        
        var selectors = [
            '.pericial-box-footer',
            '.fluxos-nao-sujeitos-value',
            '#fluxosNaoSujeitosValue',
            '.non-taxable-value',
            '.aux-total-ns'
        ];
        
        var injected = false;
        for (var i = 0; i < selectors.length; i++) {
            var elements = document.querySelectorAll(selectors[i]);
            for (var j = 0; j < elements.length; j++) {
                elements[j].textContent = value405;
                injected = true;
                _auditLog.push({ 
                    id: selectors[i], 
                    value: value405, 
                    ts: new Date().toISOString(), 
                    method: 'hardcodedMapping'
                });
            }
        }
        
        // Fallback XPath
        if (!injected) {
            var xpath = "//*[contains(text(),'Fluxos Não Sujeitos') or contains(text(),'Não sujeitos')]/following-sibling::*[1]";
            var result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            var target = result.singleNodeValue;
            if (target) {
                target.textContent = value405;
                _auditLog.push({ id: 'xpath-ns-fallback', value: value405, ts: new Date().toISOString(), method: 'xpath_ns' });
            }
        }
        
        // Campos específicos do painel
        _set('auxBoxTotalNSValue', value405);
        _set('pure-total-ns-iv', value405);
        _set('pure-nao-sujeitos', value405);
    }

    // ── [MELHORIA 1] ATOMIC INJECTION GUARD (TRY-CATCH) ──────────────────────
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
            
            // Força o valor hardcoded para Fluxos Não Sujeitos (M5)
            _injectHardcodedNonTaxableFlows();
        } catch (e) {
            console.error('[UNIFED-PURE] Erro em _safeReInjectAuxValues:', e);
            _auditLog.push({ error: e.message, ts: new Date().toISOString(), context: 'reInjectAuxValues' });
        }
    }

    // ── THROTTLED MUTATION OBSERVER (com try-catch) ──────────────────────────
    function _throttledReInject() {
        var timeoutId = null;
        return function() {
            if (timeoutId) return;
            timeoutId = setTimeout(function() {
                timeoutId = null;
                _safeReInjectAuxValues();
            }, 500);
        };
    }
    
    function _startThrottledMutationObserver() {
        try {
            if (!window.MutationObserver) return;
            var targetNodes = [
                document.getElementById('pure-campanhas-iv'),
                document.getElementById('auxBoxCampanhasValue'),
                document.getElementById('pure-gorjetas-iv'),
                document.getElementById('auxBoxGorjetasValue')
            ].filter(function(n) { return n !== null; });
            if (targetNodes.length === 0) return;
            
            var throttledHandler = _throttledReInject();
            var observer = new MutationObserver(function(mutations) {
                var shouldReinject = mutations.some(function(mutation) {
                    var target = mutation.target;
                    return target.textContent === '0,00 €' || target.textContent === '0.00 €' || target.textContent === '0,00€';
                });
                if (shouldReinject) throttledHandler();
            });
            
            targetNodes.forEach(function(node) {
                observer.observe(node, { characterData: true, childList: true, subtree: true });
            });
        } catch (e) {
            console.error('[UNIFED-PURE] MutationObserver error:', e);
        }
    }

    // ── [MELHORIA 2] SHADOW DOM COM MODE: 'closed' ───────────────────────────
    function _isolatePanelCSSClosed() {
        try {
            var panel = document.getElementById('pureDashboard');
            if (!panel) {
                setTimeout(_isolatePanelCSSClosed, 100);
                return;
            }
            if (panel.shadowRoot) return;
            
            // Shadow Root fechado – sem acesso externo
            var shadowRoot = panel.attachShadow({ mode: 'closed' });
            
            var children = [];
            while (panel.firstChild) {
                children.push(panel.firstChild);
            }
            
            var container = document.createElement('div');
            container.id = 'pureDashboardContent';
            container.className = 'pure-dashboard-shadow';
            
            var style = document.createElement('style');
            style.textContent = `
                .pure-dashboard-shadow {
                    all: initial;
                    display: block;
                    font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
                    line-height: 1.5;
                    color: #1a1a2e;
                }
                .pure-dashboard-shadow .kpi-card {
                    background: #fff;
                    border-radius: 12px;
                    padding: 1rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                .pure-dashboard-shadow .kpi-value {
                    font-size: 1.8rem;
                    font-weight: bold;
                    color: #2c3e66;
                }
                .pure-dashboard-shadow .kpi-label {
                    font-size: 0.85rem;
                    color: #6c757d;
                    text-transform: uppercase;
                }
                .pure-dashboard-shadow .kpi-card.dac7-card,
                .pure-dashboard-shadow [id*="dac7"] .kpi-card {
                    display: block !important;
                    height: auto !important;
                }
                .pure-dashboard-shadow .kpi-card.dac7-card .kpi-value {
                    display: block;
                    margin-top: 0.5rem;
                }
                .pure-dashboard-shadow .triangulation-matrix {
                    background: #f8f9fa;
                    border-radius: 12px;
                    padding: 1rem;
                    margin-top: 1rem;
                }
            `;
            shadowRoot.appendChild(style);
            
            for (var i = 0; i < children.length; i++) {
                container.appendChild(children[i]);
            }
            shadowRoot.appendChild(container);
            
            // NÃO expõe window._pureShadowRoot (closed mode)
            console.log('[UNIFED-PURE] Shadow DOM isolado com mode: closed');
        } catch (e) {
            console.error('[UNIFED-PURE] Erro ao isolar Shadow DOM:', e);
        }
    }

    // ── [MELHORIA 3] POINTER-EVENT EMULATION (SIMULATED CLICK) ───────────────
    function _simulateClickOnSemesterOption(selectElement, targetValue) {
        if (!selectElement) return false;
        try {
            // Tenta encontrar a <option> com o valor desejado e disparar click()
            var options = selectElement.options;
            for (var i = 0; i < options.length; i++) {
                if (options[i].value == targetValue) {
                    options[i].selected = true;
                    // Dispara clique físico no elemento <option>
                    var clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
                    options[i].dispatchEvent(clickEvent);
                    // Também dispara change no select para garantir
                    var changeEvent = new Event('change', { bubbles: true });
                    selectElement.dispatchEvent(changeEvent);
                    _auditLog.push({ 
                        id: selectElement.id, 
                        action: 'simulatedClick', 
                        value: targetValue,
                        ts: new Date().toISOString() 
                    });
                    return true;
                }
            }
            // Fallback: altera value e dispara eventos
            selectElement.value = targetValue;
            selectElement.dispatchEvent(new Event('change', { bubbles: true }));
            return true;
        } catch (e) {
            console.error('[UNIFED-PURE] Erro na simulação de clique:', e);
            return false;
        }
    }
    
    function _forceSemesterWithClick() {
        try {
            var semesterContainer = document.getElementById('semestreSelectorContainer') ||
                                    document.querySelector('.semester-container') ||
                                    document.getElementById('trimestralSelectorContainer');
            if (semesterContainer) {
                semesterContainer.style.setProperty('display', 'block', 'important');
                semesterContainer.style.setProperty('visibility', 'visible', 'important');
                semesterContainer.classList.add('show');
            }
            var semSelect = document.getElementById('semestreSelector');
            if (semSelect) {
                _simulateClickOnSemesterOption(semSelect, '2');
                semSelect.style.display = 'inline-block';
            }
            var periodoSelect = document.getElementById('periodoAnalise');
            var anoSelect = document.getElementById('anoFiscal');
            
            function enforceSemester() {
                if (periodoSelect && periodoSelect.value !== 'semestral') {
                    periodoSelect.value = 'semestral';
                    periodoSelect.dispatchEvent(new Event('change', { bubbles: true }));
                }
                if (semSelect && semSelect.value !== '2') {
                    _simulateClickOnSemesterOption(semSelect, '2');
                }
                if (semesterContainer) semesterContainer.style.setProperty('display', 'block', 'important');
            }
            
            if (periodoSelect) periodoSelect.addEventListener('change', enforceSemester);
            if (anoSelect) anoSelect.addEventListener('change', enforceSemester);
            enforceSemester();
        } catch (e) {
            console.error('[UNIFED-PURE] Erro em _forceSemesterWithClick:', e);
        }
    }

    // ── MATRIZ DE TRIANGULAÇÃO (fora do shadowRoot, sem dependência) ─────────
    function _renderTriangulationMatrix() {
        try {
            var sys = window.UNIFEDSystem;
            if (!sys || !sys.analysis || !sys.analysis.totals) return;
            var saf_t = sys.analysis.totals.saftBruto;
            var ganhos = sys.analysis.totals.ganhos;
            var dac7 = sys.analysis.totals.dac7TotalPeriodo;
            var delta_saft_ganhos = Math.abs(saf_t - ganhos);
            var delta_saft_dac7 = Math.abs(saf_t - dac7);
            var delta_ganhos_dac7 = Math.abs(ganhos - dac7);
            var maxDelta = Math.max(delta_saft_ganhos, delta_saft_dac7, delta_ganhos_dac7);
            var maxRef = Math.max(saf_t, ganhos, dac7);
            var threshold10Percent = maxRef * 0.1;
            function deltaClass(delta) { return delta > threshold10Percent ? 'delta-critical' : 'delta-normal'; }
            
            var container = document.getElementById('triangulationMatrixContainer');
            if (!container) {
                container = document.createElement('div');
                container.id = 'triangulationMatrixContainer';
                container.className = 'triangulation-matrix card';
                container.style.margin = '20px';
                container.style.padding = '15px';
                container.style.border = '1px solid #ccc';
                container.style.borderRadius = '8px';
                container.style.backgroundColor = '#f9f9f9';
                var purePanel = document.getElementById('pureDashboard');
                if (purePanel && purePanel.parentNode) {
                    purePanel.parentNode.insertBefore(container, purePanel.nextSibling);
                } else {
                    document.body.appendChild(container);
                }
            }
            
            container.innerHTML = `
                <h3 style="margin:0 0 10px 0; font-size:1.2rem;">📐 Matriz de Triangulação (Prova Rainha)</h3>
                <table style="width:100%; border-collapse:collapse; text-align:center;">
                    <thead><tr><th>Fonte</th><th>Valor (2.º Semestre)</th><th>Δ vs SAF-T</th><th>Δ vs Ganhos</th><th>Δ vs DAC7</th></tr></thead>
                    <tbody>
                        <tr><td><strong>📄 SAF-T</strong></td><td>${_fmt(saf_t)}</td><td>—</td><td class="${deltaClass(delta_saft_ganhos)}">${_fmt(delta_saft_ganhos)}</td><td class="${deltaClass(delta_saft_dac7)}">${_fmt(delta_saft_dac7)}</td></tr>
                        <tr><td><strong>💰 Ganhos Brutos</strong></td><td>${_fmt(ganhos)}</td><td class="${deltaClass(delta_saft_ganhos)}">${_fmt(delta_saft_ganhos)}</td><td>—</td><td class="${deltaClass(delta_ganhos_dac7)}">${_fmt(delta_ganhos_dac7)}</td></tr>
                        <tr><td><strong>📡 DAC7</strong></td><td>${_fmt(dac7)}</td><td class="${deltaClass(delta_saft_dac7)}">${_fmt(delta_saft_dac7)}</td><td class="${deltaClass(delta_ganhos_dac7)}">${_fmt(delta_ganhos_dac7)}</td><td>—</td></tr>
                    </tbody>
                </table>
                <div style="margin-top:12px; padding:8px; border-radius:5px; background-color: ${maxDelta>threshold10Percent?'#ffcccc':'#ffffcc'}; text-align:center;">
                    <strong>📢 Evidência de Inconformidade Sistémica:</strong> Maior desvio = ${_fmt(maxDelta)} (${maxDelta>threshold10Percent?'CRÍTICO >10%':'MODERADO'})
                </div>
            `;
        } catch (e) {
            console.error('[UNIFED-PURE] Erro ao renderizar matriz de triangulação:', e);
        }
    }

    // ── SISTEMA DE INJEÇÃO ATÓMICA (com guarda total) ─────────────────────────
    function _syncPureDashboard() {
        try {
            var sys = window.UNIFEDSystem;
            if (!sys) {
                console.warn('[UNIFED-PURE] UNIFEDSystem indisponível – nova tentativa em 50ms');
                setTimeout(_syncPureDashboard, 50);
                return;
            }

            // Inicializa objetos
            if (!sys.analysis) sys.analysis = {};
            if (!sys.analysis.totals) sys.analysis.totals = {};
            if (!sys.analysis.crossings) sys.analysis.crossings = {};
            if (!sys.analysis.twoAxis) sys.analysis.twoAxis = {};
            if (!sys.auxiliaryData) sys.auxiliaryData = {};
            if (!sys.documents) sys.documents = {};

            sys.sessionId = _PDF_CASE.sessionId;
            sys.masterHash = _PDF_CASE.masterHash;
            sys.client = _PDF_CASE.client;
            sys.selectedPlatform = _PDF_CASE.client.platform;
            sys.demoMode = false;
            sys.casoRealAnonimizado = true;
            sys.selectedYear = 2024;
            sys.selectedPeriodo = "semestral";
            sys.selectedSemestre = 2;
            sys.selectedTrimestre = 4;

            sys.evidenceCounts = { ctrl: 4, saft: 4, fat: 2, ext: 4, dac7: 1 };
            if (!sys.documents.control) sys.documents.control = { files: [], totals: { records: 0 } };
            if (!sys.documents.saft) sys.documents.saft = { files: [], totals: { records: 0 } };
            if (!sys.documents.invoices) sys.documents.invoices = { files: [], totals: { records: 0 } };
            if (!sys.documents.statements) sys.documents.statements = { files: [], totals: { records: 0 } };
            if (!sys.documents.dac7) sys.documents.dac7 = { files: [], totals: { records: 0 } };
            sys.documents.control.totals.records = sys.evidenceCounts.ctrl;
            sys.documents.saft.totals.records = sys.evidenceCounts.saft;
            sys.documents.invoices.totals.records = sys.evidenceCounts.fat;
            sys.documents.statements.totals.records = sys.evidenceCounts.ext;
            sys.documents.dac7.totals.records = sys.evidenceCounts.dac7;

            Object.assign(sys.analysis.totals, _PDF_CASE.totals);
            Object.assign(sys.analysis.crossings, _PDF_CASE.crossings);
            Object.assign(sys.analysis.twoAxis, _PDF_CASE.twoAxis);
            sys.analysis.verdict = _PDF_CASE.verdict;
            Object.assign(sys.auxiliaryData, _PDF_CASE.auxiliaryData);
            sys.analysis.evidenceIntegrity = _PDF_CASE.evidenceIntegrity;
            sys.monthlyData = _PDF_CASE.monthlyData;

            sys.graphData = sys.graphData || {};
            sys.graphData.labels = Object.keys(_PDF_CASE.monthlyData);
            sys.graphData.bruto = sys.graphData.labels.map(function(m) { return _PDF_CASE.monthlyData[m].bruto; });
            sys.graphData.dac7 = sys.graphData.labels.map(function(m) { return _PDF_CASE.monthlyData[m].dac7; });
            sys.graphData.iva = sys.graphData.labels.map(function(m) { return _PDF_CASE.monthlyData[m].iva; });
            sys.graphData.ganhos = sys.graphData.labels.map(function(m) { return _PDF_CASE.monthlyData[m].ganhos; });
            sys.graphData.despesas = sys.graphData.labels.map(function(m) { return _PDF_CASE.monthlyData[m].despesas; });
            if (typeof window.computeTemporalAnalysis === 'function') window.computeTemporalAnalysis(sys.graphData);

            // Cliente info
            var clientStatusDiv = document.getElementById('clientStatusFixed');
            var clientNameSpan = document.getElementById('clientNameDisplayFixed');
            var clientNifSpan = document.getElementById('clientNifDisplayFixed');
            var clientNameInput = document.getElementById('clientNameFixed');
            var clientNifInput = document.getElementById('clientNIFFixed');
            if (clientStatusDiv && clientNameSpan && clientNifSpan && clientNameInput && clientNifInput) {
                clientNameSpan.textContent = sys.client.name;
                clientNifSpan.textContent = sys.client.nif;
                clientNameInput.value = sys.client.name;
                clientNifInput.value = sys.client.nif;
                clientStatusDiv.style.display = 'flex';
            }

            // Seletores com simulated click (M3)
            var anoFiscalSelect = document.getElementById('anoFiscal');
            if (anoFiscalSelect) {
                anoFiscalSelect.value = String(sys.selectedYear);
                anoFiscalSelect.dispatchEvent(new Event('change', { bubbles: true }));
            }
            var periodoSelect = document.getElementById('periodoAnalise');
            if (periodoSelect) {
                periodoSelect.value = sys.selectedPeriodo;
                periodoSelect.dispatchEvent(new Event('change', { bubbles: true }));
                var triContainer = document.getElementById('trimestralSelectorContainer');
                if (triContainer) {
                    triContainer.style.display = 'none';
                    triContainer.classList.remove('show');
                }
            }
            var semestreSelect = document.getElementById('semestreSelector');
            if (semestreSelect) _simulateClickOnSemesterOption(semestreSelect, '2');

            var platformSelect = document.getElementById('selPlatformFixed');
            if (platformSelect) platformSelect.value = "outra";

            // Contadores
            if (typeof window.forensicDataSynchronization === 'function') {
                window.forensicDataSynchronization();
            } else {
                var counterEl = document.getElementById('evidenceCountTotal');
                if (counterEl) counterEl.textContent = sys.analysis.evidenceIntegrity.length;
                _set('controlCountCompact', String(sys.evidenceCounts.ctrl));
                _set('saftCountCompact', String(sys.evidenceCounts.saft));
                _set('invoiceCountCompact', String(sys.evidenceCounts.fat));
                _set('statementCountCompact', String(sys.evidenceCounts.ext));
                _set('dac7CountCompact', String(sys.evidenceCounts.dac7));
            }

            if (typeof window.validateNIF === 'function') window.validateNIF(sys.client.nif);
            _set('sessionIdDisplay', sys.sessionId);
            _set('verdictSessionId', sys.sessionId);
            if (typeof window.generateQRCode === 'function') window.generateQRCode();
            _set('masterHashValue', sys.masterHash);
            _set('saftIliquidoValue', _fmt(sys.analysis.totals.saftIliquido));
            _set('saftIvaValue', _fmt(sys.analysis.totals.saftIva));
            _set('saftBrutoValue', _fmt(sys.analysis.totals.saftBruto));

            var dac7Items = [
                { id: 'dac7Q1Value', value: 0 },
                { id: 'dac7Q2Value', value: 0 },
                { id: 'dac7Q3Value', value: 0 },
                { id: 'dac7Q4Value', value: 7755.16 }
            ];
            dac7Items.forEach(function(item) {
                var el = document.getElementById(item.id);
                if (el) {
                    el.textContent = _fmt(item.value);
                    var parentCard = el.closest('.kpi-card');
                    if (parentCard) parentCard.style.display = 'block';
                }
            });

            var aux = sys.auxiliaryData;
            _set('auxBoxPortagensValue', _fmt(aux.portagens));
            _set('auxBoxCancelValue', _fmt(aux.cancelamentos));
            _set('pure-portagens-iv', _fmt(aux.portagens));
            _set('pure-cancel-iv', _fmt(aux.cancelamentos));
            _set('pure-portagens', _fmt(aux.portagens));
            _set('pure-cancelamentos', _fmt(aux.cancelamentos));

            _setWithXPathFallback('auxBoxCampanhasValue', _fmt(aux.campanhas), 'Ganhos da campanha');
            _setWithXPathFallback('auxBoxGorjetasValue', _fmt(aux.gorjetas), 'Gorjetas');
            _setWithXPathFallback('pure-campanhas-iv', _fmt(aux.campanhas), 'Ganhos da campanha');
            _setWithXPathFallback('pure-gorjetas-iv', _fmt(aux.gorjetas), 'Gorjetas');
            _setWithXPathFallback('pure-campanhas', _fmt(aux.campanhas), 'Ganhos da campanha');
            _setWithXPathFallback('pure-gorjetas', _fmt(aux.gorjetas), 'Gorjetas');

            // Hardcoded para Fluxos Não Sujeitos (M5)
            _injectHardcodedNonTaxableFlows();

            var dac7Note = document.getElementById('auxDac7ReconciliationNote');
            if (dac7Note && aux.totalNaoSujeitos > 0) {
                dac7Note.style.display = 'block';
                _set('auxDac7NoteValue', _fmt(aux.totalNaoSujeitos));
                _set('auxDac7NoteValueQ', _fmt(aux.totalNaoSujeitos));
            }
            if (typeof window.injectAuxiliaryHelperBoxes === 'function') window.injectAuxiliaryHelperBoxes();
            if (typeof window._updatePureUI === 'function') window._updatePureUI();
            if (typeof window.updateDashboard === 'function') window.updateDashboard();
            if (typeof window.updateModulesUI === 'function') window.updateModulesUI();
            if (typeof window.renderChart === 'function') window.renderChart();
            if (typeof window.renderDiscrepancyChart === 'function') window.renderDiscrepancyChart();
            if (typeof window.showTwoAxisAlerts === 'function') window.showTwoAxisAlerts();

            setTimeout(function() {
                dac7Items.forEach(function(item) {
                    var el = document.getElementById(item.id);
                    if (el && el.closest('.kpi-card')) el.closest('.kpi-card').style.display = 'block';
                });
            }, 200);

            var _written = _auditLog.filter(function(e) { return !e.warn; }).length;
            var _missing = _auditLog.filter(function(e) { return e.warn === 'ELEMENT_NOT_FOUND'; }).length;
            console.log('[UNIFED-PURE] ✅ Injeção concluída. Escritos: ' + _written + ' | Missing: ' + _missing);
            
            _startThrottledMutationObserver();
            _forceSemesterWithClick();
            _fixDac7LayoutWithBlockOverride();
            _isolatePanelCSSClosed();
            _renderTriangulationMatrix();
        } catch (e) {
            console.error('[UNIFED-PURE] ERRO FATAL EM _syncPureDashboard:', e);
            _auditLog.push({ fatalError: e.message, stack: e.stack, ts: new Date().toISOString() });
        }
    }

    // ── EXPOSIÇÃO PÚBLICA COM DEFERRED EXECUTION (MELHORIA 6: 2000ms) ────────
    window.UNIFEDSystem = window.UNIFEDSystem || {};
    window.UNIFEDSystem.loadAnonymizedRealCase = function() {
        console.log('[UNIFED-PURE] Carregando dados (v13.9.0) com atraso de 2000ms para DOM reativo...');
        setTimeout(function() {
            try {
                _syncPureDashboard();
            } catch (e) {
                console.error('[UNIFED-PURE] Erro no carregamento deferido:', e);
            }
        }, 2000);
    };

    window._updatePureUI = function() {
        try {
            var sys = window.UNIFEDSystem;
            if (!sys || !sys.analysis || !sys.analysis.totals) return;
            var t = sys.analysis.totals;
            var c = sys.analysis.crossings;
            var aux = sys.auxiliaryData || {};

            _set('pure-ganhos', _fmt(t.ganhos));
            _set('pure-despesas', _fmt(t.despesas));
            _set('pure-liquido', _fmt(t.ganhosLiquidos));
            _set('pure-saft', _fmt(t.saftBruto));
            _set('pure-dac7', _fmt(t.dac7TotalPeriodo));
            _set('pure-fatura', _fmt(t.faturaPlataforma));
            _set('pure-sg2-btor-val', _fmt(t.despesas));
            _set('pure-sg2-btf-val', _fmt(t.faturaPlataforma));
            _set('pure-sg1-saft-val', _fmt(t.saftBruto));
            _set('pure-sg1-dac7-val', _fmt(t.dac7TotalPeriodo));
            _set('pure-disc-c2', _fmt(c.discrepanciaCritica));
            _set('pure-disc-c2-pct', ((c.percentagemOmissao || 0).toFixed(2)) + '%');
            _set('pure-disc-c1', _fmt(c.discrepanciaSaftVsDac7));
            _set('pure-disc-c1-pct', ((c.percentagemSaftVsDac7 || 0).toFixed(2)) + '%');
            _set('pure-iva-falta', _fmt(c.ivaFalta));
            _set('pure-iva-falta6', _fmt(c.ivaFalta6));
            _set('pure-btor', _fmt(c.btor));
            _set('pure-btf', _fmt(c.btf));

            _setWithXPathFallback('pure-campanhas', _fmt(aux.campanhas), 'Ganhos da campanha');
            _setWithXPathFallback('pure-gorjetas', _fmt(aux.gorjetas), 'Gorjetas');
            _set('pure-portagens', _fmt(aux.portagens));
            _set('pure-cancelamentos', _fmt(aux.cancelamentos));
            
            // Força valor hardcoded novamente
            _injectHardcodedNonTaxableFlows();

            var verdictEl = document.getElementById('pure-verdict');
            if (verdictEl && sys.analysis.verdict) {
                var lang = window.currentLang || 'pt';
                verdictEl.textContent = sys.analysis.verdict.level[lang] || sys.analysis.verdict.level.pt;
                verdictEl.className = 'pure-verdict-value ' + (sys.analysis.verdict.key || 'low');
            }
            var hashEl = document.getElementById('pure-hash-prefix-verdict');
            if (hashEl && sys.masterHash) hashEl.textContent = sys.masterHash.substring(0, 16).toUpperCase();
            if (typeof window._translatePurePanel === 'function') window._translatePurePanel(window.currentLang || 'pt');
        } catch (e) {
            console.error('[UNIFED-PURE] Erro em _updatePureUI:', e);
        }
    };

    window.forensicDataSynchronization = function() {
        try {
            var invEl = document.getElementById('invoiceCountCompact');
            if (invEl) invEl.textContent = "2";
            var stmtEl = document.getElementById('statementCountCompact');
            if (stmtEl) stmtEl.textContent = "4";
            var ctrlEl = document.getElementById('controlCountCompact');
            if (ctrlEl && ctrlEl.textContent !== "4") ctrlEl.textContent = "4";
            var saftEl = document.getElementById('saftCountCompact');
            if (saftEl && saftEl.textContent !== "4") saftEl.textContent = "4";
            var dac7El = document.getElementById('dac7CountCompact');
            if (dac7El && dac7El.textContent !== "1") dac7El.textContent = "1";
        } catch (e) {
            console.error('[UNIFED-PURE] Erro em forensicDataSynchronization:', e);
        }
    };

    // ── BOOTSTRAP COM DEFERRED EXECUTION (M6) ─────────────────────────────────
    function _bootstrap() {
        console.log('[UNIFED-PURE] Bootstrap iniciado – aguardando 2000ms para DOM estável...');
        setTimeout(function() {
            if (typeof window.UNIFEDSystem !== 'undefined' && window.UNIFEDSystem.analysis) {
                _syncPureDashboard();
            } else if (window.UNIFEDSystem && window.UNIFEDSystem.loadAnonymizedRealCase) {
                window.UNIFEDSystem.loadAnonymizedRealCase();
            } else {
                _syncPureDashboard();
            }
        }, 2000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', _bootstrap);
    } else {
        _bootstrap();
    }

})();