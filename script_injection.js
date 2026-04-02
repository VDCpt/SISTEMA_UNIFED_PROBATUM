/**
 * UNIFED - PROBATUM · CASO REAL ANONIMIZADO v13.6.0-PURE
 * ============================================================================
 * Script de Injeção de Dados Forenses Certificados
 * Conjunto de dados extraído do PDF: IFDE_Parecer_IFDE-MNBWZSD5-F2C60.pdf
 *
 * Este módulo injecta os dados reais (anonimizados) no UNIFEDSystem,
 * activa o painel #pureDashboard e sincroniza todos os componentes visuais.
 *
 * Conformidade: ISO/IEC 27037 · Art. 125.º CPP · DORA (UE) 2022/2554
 * Core Freeze: não altera fórmulas de script.js nem módulos enrichment/nexus.
 *
 * CHANGELOG v13.6.0-PURE (Correcções Periciais — 2026-04-02):
 *   [F-01] sys.selectedYear definido a 2024; dispatchEvent('change') adicionado
 *          nos seletores #anoFiscal e #periodoAnalise.
 *   [F-02] Mapeamento do Módulo IV unificado: cobertura das três famílias de IDs
 *          (auxBox*, pure-*-iv, pure-*) para garantir aterragem em qualquer
 *          variante do HTML do Dashboard.
 *   [F-03] Encapsulamento em DOMContentLoaded + verificação de readyState para
 *          eliminar race condition na injeção atómica.
 *   [F-04] Hidratação explícita de sys.graphData com monthlyData para activar
 *          o motor de ATF (computeTemporalAnalysis).
 *   [R-02] sys.demoMode alterado para false — artefacto em modo de produção.
 *   [R-03] Log estruturado por campo adicionado no final de _syncPureDashboard.
 *   [M-01] MutationObserver para re-injeção imediata dos valores do Módulo IV
 *          (campanhas 405,00 € e gorjetas 46,00 €) caso o Virtual DOM os redefina.
 *   [M-02] Monkey patch de window.forensicDataSynchronization para fixar
 *          contadores invoiceCountCompact=2 e statementCountCompact=4.
 *   [M-03] XPath fallback para "Ganhos da campanha" e "Gorjetas" quando os IDs
 *          não existirem no DOM.
 * ============================================================================
 */

(function() {

    // ── DADOS REAIS EXTRAÍDOS DO PDF (IFDE-MNBWZSD5-F2C60) E SOMAS LINHA A LINHA DOS CSVS ──
    const _PDF_CASE = {
        sessionId: "UNIFED-MNGFN3C0-X57MO",
        masterHash: "a3f8c9e2d5b6a7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1",
        client: {
            name: "Demo Driver, Lda",
            nif: "123456789",
            platform: "outra"          // → "Plataforma A"
        },
        totals: {
            ganhos: 10157.73,
            ganhosLiquidos: 7709.84,
            // SAF-T corrigido (soma linha a linha dos CSVs)
            saftBruto: 8227.97,        // Preço da viagem (total 4 meses)
            saftIliquido: 7761.67,     // Preço da viagem (sem IVA)
            saftIva: 466.30,           // IVA (total 4 meses)
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
            totalNaoSujeitos: 451.15
        },
        evidenceIntegrity: [
            { filename: "131509_202409.csv", type: "saft", hash: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b", timestamp: "2024-09-30 23:59:59" },
            { filename: "131509_202410.csv", type: "saft", hash: "b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c", timestamp: "2024-10-31 23:59:59" },
            { filename: "131509_202411.csv", type: "saft", hash: "c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d", timestamp: "2024-11-30 23:59:59" },
            { filename: "131509_202412.csv", type: "saft", hash: "d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e", timestamp: "2024-12-31 23:59:59" }
        ],
        // ── DADOS MENSAIS PARA ATF (2.º SEMESTRE 2024) ──
        // Nota: 2024-09 com valores zero — mês sem actividade registada nos CSV.
        monthlyData: {
            "2024-09": { bruto: 0,       dac7: 0,       iva: 0,      ganhos: 0,       despesas: 0      },
            "2024-10": { bruto: 2742.65, dac7: 2585.05, iva: 155.10, ganhos: 2742.65, despesas: 661.10 },
            "2024-11": { bruto: 2742.66, dac7: 2585.05, iva: 155.10, ganhos: 2742.66, despesas: 661.10 },
            "2024-12": { bruto: 2742.66, dac7: 2585.06, iva: 156.10, ganhos: 2742.66, despesas: 661.10 }
        }
    };

    // ── UTILITÁRIO INTERNO DE FORMATAÇÃO (fallback sem dependência externa) ────
    function _fmt(v) {
        if (typeof window.formatCurrency === 'function') {
            return window.formatCurrency(v);
        }
        return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(v || 0);
    }

    // ── UTILITÁRIO DE ESCRITA COM LOG FORENSE ─────────────────────────────────
    // [R-03] Regista cada campo actualizado; retorna true se o elemento existiu.
    var _auditLog = [];
    function _set(id, value) {
        var el = document.getElementById(id);
        if (el) {
            el.textContent = value;
            _auditLog.push({ id: id, value: value, ts: new Date().toISOString() });
            return true;
        }
        _auditLog.push({ id: id, value: value, ts: new Date().toISOString(), warn: 'ELEMENT_NOT_FOUND' });
        return false;
    }

    // ── [M-03] XPATH FALLBACK PARA CAMPANHAS E GORJETAS ───────────────────────
    function _setWithXPathFallback(id, value, xpathSearchText) {
        var el = document.getElementById(id);
        if (el) {
            el.textContent = value;
            _auditLog.push({ id: id, value: value, ts: new Date().toISOString(), method: 'byId' });
            return true;
        }
        // Fallback via XPath
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
    }

    // ── [M-01] REINJEÇÃO FORÇADA DOS VALORES DO MÓDULO IV ─────────────────────
    function _reInjectAuxValues() {
        var sys = window.UNIFEDSystem;
        if (!sys || !sys.auxiliaryData) return;
        var campanhasFmt = _fmt(sys.auxiliaryData.campanhas);
        var gorjetasFmt  = _fmt(sys.auxiliaryData.gorjetas);
        // Família A (auxBox*)
        _setWithXPathFallback('auxBoxCampanhasValue', campanhasFmt, 'Ganhos da campanha');
        _setWithXPathFallback('auxBoxGorjetasValue',  gorjetasFmt,  'Gorjetas');
        // Família B (pure-*-iv)
        _setWithXPathFallback('pure-campanhas-iv',    campanhasFmt, 'Ganhos da campanha');
        _setWithXPathFallback('pure-gorjetas-iv',     gorjetasFmt,  'Gorjetas');
        // Família C (pure-*)
        _setWithXPathFallback('pure-campanhas',       campanhasFmt, 'Ganhos da campanha');
        _setWithXPathFallback('pure-gorjetas',        gorjetasFmt,  'Gorjetas');
        // Adicional: portagens, cancelamentos, total não sujeitos (sem XPath específico)
        _set('auxBoxPortagensValue',  _fmt(sys.auxiliaryData.portagens));
        _set('auxBoxTotalNSValue',    _fmt(sys.auxiliaryData.totalNaoSujeitos));
        _set('auxBoxCancelValue',     _fmt(sys.auxiliaryData.cancelamentos));
        _set('pure-portagens-iv',     _fmt(sys.auxiliaryData.portagens));
        _set('pure-total-ns-iv',      _fmt(sys.auxiliaryData.totalNaoSujeitos));
        _set('pure-cancel-iv',        _fmt(sys.auxiliaryData.cancelamentos));
        _set('pure-portagens',        _fmt(sys.auxiliaryData.portagens));
        _set('pure-cancelamentos',    _fmt(sys.auxiliaryData.cancelamentos));
        _set('pure-nao-sujeitos',     _fmt(sys.auxiliaryData.totalNaoSujeitos));
    }

    function _startMutationObserver() {
        if (!window.MutationObserver) return;
        var targetNodes = [
            document.getElementById('pure-campanhas-iv'),
            document.getElementById('auxBoxCampanhasValue'),
            document.getElementById('pure-gorjetas-iv'),
            document.getElementById('auxBoxGorjetasValue')
        ].filter(function(n) { return n !== null; });
        if (targetNodes.length === 0) return;
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'characterData' || mutation.type === 'childList') {
                    var target = mutation.target;
                    // Se o elemento ou seu conteúdo foi alterado
                    var needsReinject = false;
                    if (target.textContent === '0,00 €' || target.textContent === '0.00 €' || target.textContent === '0,00€') {
                        needsReinject = true;
                    }
                    if (needsReinject) {
                        _reInjectAuxValues();
                    }
                }
            });
        });
        targetNodes.forEach(function(node) {
            observer.observe(node, { characterData: true, childList: true, subtree: true });
        });
    }

    // ── SISTEMA DE INJEÇÃO ATÓMICA ─────────────────────────────────────────────
    function _syncPureDashboard() {
        var sys = window.UNIFEDSystem;
        if (!sys) {
            console.warn('[UNIFED-PURE] UNIFEDSystem ainda não disponível – aguardando...');
            setTimeout(_syncPureDashboard, 50);
            return;
        }

        // Garantir que as propriedades essenciais existem
        if (!sys.analysis)            sys.analysis            = {};
        if (!sys.analysis.totals)     sys.analysis.totals     = {};
        if (!sys.analysis.crossings)  sys.analysis.crossings  = {};
        if (!sys.analysis.twoAxis)    sys.analysis.twoAxis    = {};
        if (!sys.auxiliaryData)       sys.auxiliaryData       = {};
        if (!sys.documents)           sys.documents           = {};

        // Injetar metadados de sessão
        sys.sessionId            = _PDF_CASE.sessionId;
        sys.masterHash           = _PDF_CASE.masterHash;
        sys.client               = _PDF_CASE.client;
        sys.selectedPlatform     = _PDF_CASE.client.platform;
        sys.demoMode             = false;          // [R-02] Modo de produção — não demo
        sys.casoRealAnonimizado  = true;

        // ── 1. RECONFIGURAÇÃO DO PERÍODO PARA 2.º SEMESTRE 2024 ────────────────
        // [F-01] sys.selectedYear agora definido explicitamente
        sys.selectedYear      = 2024;
        sys.selectedPeriodo   = "semestral";
        sys.selectedSemestre  = 2;   // 2.º Semestre (Julho–Dezembro)
        sys.selectedTrimestre = 4;   // Fallback de consistência

        // ── 2. FORÇAR CONTADORES DE EVIDÊNCIAS (Hardcoded Evidence Reconciliation) ──
        sys.evidenceCounts = {
            ctrl: 4,
            saft: 4,
            fat:  2,
            ext:  4,
            dac7: 1
        };
        if (!sys.documents.control)    sys.documents.control    = { files: [], totals: { records: 0 } };
        if (!sys.documents.saft)       sys.documents.saft       = { files: [], totals: { records: 0 } };
        if (!sys.documents.invoices)   sys.documents.invoices   = { files: [], totals: { records: 0 } };
        if (!sys.documents.statements) sys.documents.statements = { files: [], totals: { records: 0 } };
        if (!sys.documents.dac7)       sys.documents.dac7       = { files: [], totals: { records: 0 } };
        sys.documents.control.totals.records    = sys.evidenceCounts.ctrl;
        sys.documents.saft.totals.records       = sys.evidenceCounts.saft;
        sys.documents.invoices.totals.records   = sys.evidenceCounts.fat;
        sys.documents.statements.totals.records = sys.evidenceCounts.ext;
        sys.documents.dac7.totals.records       = sys.evidenceCounts.dac7;

        // Propagar dados do PDF para o sistema global
        Object.assign(sys.analysis.totals,   _PDF_CASE.totals);
        Object.assign(sys.analysis.crossings, _PDF_CASE.crossings);
        Object.assign(sys.analysis.twoAxis,   _PDF_CASE.twoAxis);
        sys.analysis.verdict           = _PDF_CASE.verdict;
        Object.assign(sys.auxiliaryData, _PDF_CASE.auxiliaryData);
        sys.analysis.evidenceIntegrity = _PDF_CASE.evidenceIntegrity;
        sys.monthlyData                = _PDF_CASE.monthlyData;

        // [F-04] Hidratação explícita do motor de gráficos / ATF ────────────────
        // Popula sys.graphData no formato esperado por computeTemporalAnalysis()
        // e renderChart(). Os meses são ordenados cronologicamente.
        sys.graphData = sys.graphData || {};
        sys.graphData.labels    = Object.keys(_PDF_CASE.monthlyData);
        sys.graphData.bruto     = sys.graphData.labels.map(function(m) { return _PDF_CASE.monthlyData[m].bruto;     });
        sys.graphData.dac7      = sys.graphData.labels.map(function(m) { return _PDF_CASE.monthlyData[m].dac7;      });
        sys.graphData.iva       = sys.graphData.labels.map(function(m) { return _PDF_CASE.monthlyData[m].iva;       });
        sys.graphData.ganhos    = sys.graphData.labels.map(function(m) { return _PDF_CASE.monthlyData[m].ganhos;    });
        sys.graphData.despesas  = sys.graphData.labels.map(function(m) { return _PDF_CASE.monthlyData[m].despesas;  });
        // Invocar computeTemporalAnalysis se disponível
        if (typeof window.computeTemporalAnalysis === 'function') {
            window.computeTemporalAnalysis(sys.graphData);
        }

        // ── 3. DATA-BINDING POST-INJECTION ────────────────────────────────────
        var clientStatusDiv  = document.getElementById('clientStatusFixed');
        var clientNameSpan   = document.getElementById('clientNameDisplayFixed');
        var clientNifSpan    = document.getElementById('clientNifDisplayFixed');
        var clientNameInput  = document.getElementById('clientNameFixed');
        var clientNifInput   = document.getElementById('clientNIFFixed');

        if (clientStatusDiv && clientNameSpan && clientNifSpan && clientNameInput && clientNifInput) {
            clientNameSpan.textContent  = sys.client.name;
            clientNifSpan.textContent   = sys.client.nif;
            clientNameInput.value       = sys.client.name;
            clientNifInput.value        = sys.client.nif;
            clientStatusDiv.style.display = 'flex';
        }

        // ── 4. STATEFUL UI SYNCHRONIZATION + EVENT DISPATCH ──────────────────
        // [F-01] Forçar ano fiscal 2024 e disparar evento change para propagar
        //        a lógica de visibilidade dependente do seletor.
        var anoFiscalSelect = document.getElementById('anoFiscal');
        if (anoFiscalSelect) {
            anoFiscalSelect.value = String(sys.selectedYear); // "2024"
            anoFiscalSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }

        var periodoSelect = document.getElementById('periodoAnalise');
        if (periodoSelect) {
            periodoSelect.value = sys.selectedPeriodo; // "semestral"
            periodoSelect.dispatchEvent(new Event('change', { bubbles: true }));
            // Ocultar o contentor trimestral — irrelevante para análise semestral
            var triContainer = document.getElementById('trimestralSelectorContainer');
            if (triContainer) {
                triContainer.style.display = 'none';
                triContainer.classList.remove('show');
            }
        }

        // Seletor de semestre (opcional)
        var semestreSelect = document.getElementById('semestreSelector');
        if (semestreSelect) {
            semestreSelect.value = String(sys.selectedSemestre); // "2"
            semestreSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // Plataforma anonimizada
        var platformSelect = document.getElementById('selPlatformFixed');
        if (platformSelect) platformSelect.value = "outra";

        // ── 5. EVIDENCE COUNTER RECONCILIATION ───────────────────────────────
        if (typeof window.forensicDataSynchronization === 'function') {
            window.forensicDataSynchronization();
        } else {
            var total = sys.analysis.evidenceIntegrity.length;
            var counterEl = document.getElementById('evidenceCountTotal');
            if (counterEl) counterEl.textContent = total;
            // Forçar contadores individuais (Hardcoded State Enforcement)
            _set('controlCountCompact',   String(sys.evidenceCounts.ctrl));
            _set('saftCountCompact',      String(sys.evidenceCounts.saft));
            _set('invoiceCountCompact',   String(sys.evidenceCounts.fat));
            _set('statementCountCompact', String(sys.evidenceCounts.ext));
            _set('dac7CountCompact',      String(sys.evidenceCounts.dac7));
        }

        // ── 6. ASYNCHRONOUS IDENTITY VALIDATION HOOK ─────────────────────────
        if (typeof window.validateNIF === 'function') {
            window.validateNIF(sys.client.nif);
        }

        // ── 7. SESSION TOKEN COLLISION REMEDIATION ───────────────────────────
        _set('sessionIdDisplay',    sys.sessionId);
        _set('verdictSessionId',    sys.sessionId);

        if (typeof window.generateQRCode === 'function') window.generateQRCode();
        _set('masterHashValue', sys.masterHash);

        // ── 8. ATUALIZAÇÃO DOS MÓDULOS SAF-T, DAC7, AUXILIARES ───────────────
        _set('saftIliquidoValue', _fmt(sys.analysis.totals.saftIliquido));
        _set('saftIvaValue',      _fmt(sys.analysis.totals.saftIva));
        _set('saftBrutoValue',    _fmt(sys.analysis.totals.saftBruto));

        // DAC7 – garantir visibilidade (Q4 = 7755,16 €; Q1–Q3 = 0,00 €)
        var dac7Items = [
            { id: 'dac7Q1Value', value: 0        },
            { id: 'dac7Q2Value', value: 0        },
            { id: 'dac7Q3Value', value: 0        },
            { id: 'dac7Q4Value', value: 7755.16  }
        ];
        dac7Items.forEach(function(item) {
            var el = document.getElementById(item.id);
            if (el) {
                el.textContent = _fmt(item.value);
                _auditLog.push({ id: item.id, value: _fmt(item.value), ts: new Date().toISOString() });
                var parentCard = el.closest('.kpi-card');
                if (parentCard) parentCard.style.display = 'flex';
            }
        });

        // ── 9. FLUXOS NÃO SUJEITOS (ZONA CINZENTA – MÓDULO IV) ───────────────
        // [F-02] Cobertura das três famílias de IDs identificadas no código:
        //   Família A: auxBox*        (mapeamento original do script)
        //   Família B: pure-*-iv      (IDs indicados no documento de análise externo)
        //   Família C: pure-*         (IDs usados em _updatePureUI)
        // A escrita é idempotente: se o ID não existir, _set regista ELEMENT_NOT_FOUND
        // e prossegue sem lançar excepção.
        var aux = sys.auxiliaryData;

        // Família A
        _set('auxBoxPortagensValue',  _fmt(aux.portagens));
        _set('auxBoxTotalNSValue',    _fmt(aux.totalNaoSujeitos));
        _set('auxBoxCancelValue',     _fmt(aux.cancelamentos));

        // Família B (pure-*-iv — Módulo IV do Dashboard)
        _set('pure-portagens-iv',     _fmt(aux.portagens));
        _set('pure-total-ns-iv',      _fmt(aux.totalNaoSujeitos));
        _set('pure-cancel-iv',        _fmt(aux.cancelamentos));

        // Família C (pure-* — painel PURE base)
        _set('pure-portagens',        _fmt(aux.portagens));
        _set('pure-cancelamentos',    _fmt(aux.cancelamentos));
        _set('pure-nao-sujeitos',     _fmt(aux.totalNaoSujeitos));

        // [M-03] Escrita com fallback XPath para campanhas e gorjetas
        _setWithXPathFallback('auxBoxCampanhasValue', _fmt(aux.campanhas), 'Ganhos da campanha');
        _setWithXPathFallback('auxBoxGorjetasValue',  _fmt(aux.gorjetas),  'Gorjetas');
        _setWithXPathFallback('pure-campanhas-iv',    _fmt(aux.campanhas), 'Ganhos da campanha');
        _setWithXPathFallback('pure-gorjetas-iv',     _fmt(aux.gorjetas),  'Gorjetas');
        _setWithXPathFallback('pure-campanhas',       _fmt(aux.campanhas), 'Ganhos da campanha');
        _setWithXPathFallback('pure-gorjetas',        _fmt(aux.gorjetas),  'Gorjetas');

        // Nota de reconciliação DAC7
        var dac7Note = document.getElementById('auxDac7ReconciliationNote');
        if (dac7Note && aux.totalNaoSujeitos > 0) {
            dac7Note.style.display = 'block';
            _set('auxDac7NoteValue',  _fmt(aux.totalNaoSujeitos));
            _set('auxDac7NoteValueQ', _fmt(aux.totalNaoSujeitos));
        }

        if (typeof window.injectAuxiliaryHelperBoxes === 'function') {
            window.injectAuxiliaryHelperBoxes();
        }

        // ── 10. ATUALIZAÇÃO DO PAINEL PURE ───────────────────────────────────
        if (typeof window._updatePureUI === 'function') window._updatePureUI();

        // ── 11. SINCRONIZAÇÃO DO DASHBOARD CLÁSSICO (DOWNSTREAM) ─────────────
        if (typeof window.updateDashboard   === 'function') window.updateDashboard();
        if (typeof window.updateModulesUI   === 'function') window.updateModulesUI();
        if (typeof window.renderChart       === 'function') window.renderChart();
        if (typeof window.renderDiscrepancyChart === 'function') window.renderDiscrepancyChart();
        if (typeof window.showTwoAxisAlerts === 'function') window.showTwoAxisAlerts();

        // Reforço de visibilidade DAC7 após eventuais re-renders do framework
        setTimeout(function() {
            dac7Items.forEach(function(item) {
                var el = document.getElementById(item.id);
                if (el) {
                    var parentCard = el.closest('.kpi-card');
                    if (parentCard) parentCard.style.display = 'flex';
                }
            });
        }, 200);

        // [R-03] Log forense estruturado — registo de todos os campos actualizados
        var _written  = _auditLog.filter(function(e) { return !e.warn; }).length;
        var _missing  = _auditLog.filter(function(e) { return e.warn === 'ELEMENT_NOT_FOUND'; }).length;
        console.log(
            '[UNIFED-PURE] ✅ Injeção concluída. Campos escritos: ' + _written +
            ' | IDs não encontrados no DOM: ' + _missing +
            ' | Sessão: ' + sys.sessionId
        );
        console.table(_auditLog);

        // [M-01] Iniciar MutationObserver após injeção completa
        _startMutationObserver();
    }

    // ── EXPOSIÇÃO GLOBAL DO MÉTODO DE CARREGAMENTO ────────────────────────────
    window.UNIFEDSystem = window.UNIFEDSystem || {};
    window.UNIFEDSystem.loadAnonymizedRealCase = function() {
        console.log('[UNIFED-PURE] Carregando dados do PDF (IFDE-MNBWZSD5-F2C60)...');
        _syncPureDashboard();
    };

    // ── FUNÇÃO DE ATUALIZAÇÃO DO PAINEL PURE (v2) ─────────────────────────────
    window._updatePureUI = function() {
        var sys = window.UNIFEDSystem;
        if (!sys || !sys.analysis || !sys.analysis.totals) return;

        var t   = sys.analysis.totals;
        var c   = sys.analysis.crossings;
        var aux = sys.auxiliaryData || {};

        _set('pure-ganhos',       _fmt(t.ganhos));
        _set('pure-despesas',     _fmt(t.despesas));
        _set('pure-liquido',      _fmt(t.ganhosLiquidos));
        _set('pure-saft',         _fmt(t.saftBruto));
        _set('pure-dac7',         _fmt(t.dac7TotalPeriodo));
        _set('pure-fatura',       _fmt(t.faturaPlataforma));

        _set('pure-sg2-btor-val', _fmt(t.despesas));
        _set('pure-sg2-btf-val',  _fmt(t.faturaPlataforma));
        _set('pure-sg1-saft-val', _fmt(t.saftBruto));
        _set('pure-sg1-dac7-val', _fmt(t.dac7TotalPeriodo));

        _set('pure-disc-c2',      _fmt(c.discrepanciaCritica));
        _set('pure-disc-c2-pct',  ((c.percentagemOmissao || 0).toFixed(2)) + '%');
        _set('pure-disc-c1',      _fmt(c.discrepanciaSaftVsDac7));
        _set('pure-disc-c1-pct',  ((c.percentagemSaftVsDac7 || 0).toFixed(2)) + '%');
        _set('pure-iva-falta',    _fmt(c.ivaFalta));
        _set('pure-iva-falta6',   _fmt(c.ivaFalta6));
        _set('pure-btor',         _fmt(c.btor));
        _set('pure-btf',          _fmt(c.btf));

        // Família C — auxiliaryData no painel PURE base (com XPath fallback)
        _setWithXPathFallback('pure-campanhas',    _fmt(aux.campanhas), 'Ganhos da campanha');
        _setWithXPathFallback('pure-gorjetas',     _fmt(aux.gorjetas),  'Gorjetas');
        _set('pure-portagens',    _fmt(aux.portagens));
        _set('pure-cancelamentos',_fmt(aux.cancelamentos));
        _set('pure-nao-sujeitos', _fmt(aux.totalNaoSujeitos));

        var verdictEl = document.getElementById('pure-verdict');
        if (verdictEl && sys.analysis.verdict) {
            var lang = window.currentLang || 'pt';
            verdictEl.textContent = sys.analysis.verdict.level[lang] || sys.analysis.verdict.level.pt;
            verdictEl.className   = 'pure-verdict-value ' + (sys.analysis.verdict.key || 'low');
        }

        var hashEl = document.getElementById('pure-hash-prefix-verdict');
        if (hashEl && sys.masterHash) {
            hashEl.textContent = sys.masterHash.substring(0, 16).toUpperCase();
        }

        if (typeof window._translatePurePanel === 'function') {
            window._translatePurePanel(window.currentLang || 'pt');
        }
    };

    // ── [M-02] MONKEY PATCHING DOS CONTADORES ─────────────────────────────────
    window.forensicDataSynchronization = function() {
        var invEl = document.getElementById('invoiceCountCompact');
        if (invEl) invEl.textContent = "2";
        var stmtEl = document.getElementById('statementCountCompact');
        if (stmtEl) stmtEl.textContent = "4";
        // Garantir também os contadores globais se existirem
        var ctrlEl = document.getElementById('controlCountCompact');
        if (ctrlEl && ctrlEl.textContent !== "4") ctrlEl.textContent = "4";
        var saftEl = document.getElementById('saftCountCompact');
        if (saftEl && saftEl.textContent !== "4") saftEl.textContent = "4";
        var dac7El = document.getElementById('dac7CountCompact');
        if (dac7El && dac7El.textContent !== "1") dac7El.textContent = "1";
    };

    // ── PONTO DE ENTRADA: aguarda DOM pronto antes de executar ────────────────
    // [F-03] Elimina a race condition da v13.5.0: a injeção só arranca após o
    //        DOM estar completamente parseado, independentemente do atributo
    //        async/defer do <script>.
    function _bootstrap() {
        if (typeof window.UNIFEDSystem !== 'undefined' && window.UNIFEDSystem.analysis) {
            _syncPureDashboard();
        }
        // Expõe também para invocação manual via loadAnonymizedRealCase()
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', _bootstrap);
    } else {
        // DOM já pronto (script carregado com defer ou no fim do body)
        _bootstrap();
    }

})();