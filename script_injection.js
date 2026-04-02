/**
 * UNIFED - PROBATUM · CASO REAL ANONIMIZADO v13.5.0-PURE
 * ============================================================================
 * Script de Injeção de Dados Forenses Certificados
 * Conjunto de dados extraído do PDF: IFDE_Parecer_IFDE-MNBWZSD5-F2C60.pdf
 * 
 * Este módulo injecta os dados reais (anonimizados) no UNIFEDSystem,
 * activa o painel #pureDashboard e sincroniza todos os componentes visuais.
 * 
 * Conformidade: ISO/IEC 27037 · Art. 125.º CPP · DORA (UE) 2022/2554
 * Core Freeze: não altera fórmulas de script.js nem módulos enrichment/nexus.
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
        monthlyData: {
            "2024-09": { bruto: 0, dac7: 0, iva: 0, ganhos: 0, despesas: 0 },
            "2024-10": { bruto: 2742.65, dac7: 2585.05, iva: 155.10, ganhos: 2742.65, despesas: 661.10 },
            "2024-11": { bruto: 2742.66, dac7: 2585.05, iva: 155.10, ganhos: 2742.66, despesas: 661.10 },
            "2024-12": { bruto: 2742.66, dac7: 2585.06, iva: 156.10, ganhos: 2742.66, despesas: 661.10 }
        }
    };

    // ── SISTEMA DE INJEÇÃO ATÓMICA ─────────────────────────────────────────────
    function _syncPureDashboard() {
        var sys = window.UNIFEDSystem;
        if (!sys) {
            console.warn('[UNIFED-PURE] UNIFEDSystem ainda não disponível – aguardando...');
            setTimeout(_syncPureDashboard, 50);
            return;
        }

        // Garantir que as propriedades essenciais existem
        if (!sys.analysis) sys.analysis = {};
        if (!sys.analysis.totals) sys.analysis.totals = {};
        if (!sys.analysis.crossings) sys.analysis.crossings = {};
        if (!sys.analysis.twoAxis) sys.analysis.twoAxis = {};
        if (!sys.auxiliaryData) sys.auxiliaryData = {};
        if (!sys.documents) sys.documents = {};

        // Injetar dados reais
        sys.sessionId = _PDF_CASE.sessionId;
        sys.masterHash = _PDF_CASE.masterHash;
        sys.client = _PDF_CASE.client;
        sys.selectedPlatform = _PDF_CASE.client.platform;
        sys.demoMode = true;
        sys.casoRealAnonimizado = true;

        // ── 1. RECONFIGURAÇÃO DO PERÍODO PARA 2.º SEMESTRE ─────────────────────
        sys.selectedPeriodo = "semestral";
        sys.selectedSemestre = 2;          // 2.º Semestre (Julho a Dezembro)
        sys.selectedTrimestre = 4;          // Manter consistência para fallback

        // ── 2. FORÇAR CONTADORES DE EVIDÊNCIAS (Hardcoded Evidence Reconciliation) ──
        sys.evidenceCounts = {
            ctrl: 4,
            saft: 4,
            fat: 2,
            ext: 4,
            dac7: 1
        };
        // Reflectir nos documentos
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

        // Totais
        Object.assign(sys.analysis.totals, _PDF_CASE.totals);
        // Crossings
        Object.assign(sys.analysis.crossings, _PDF_CASE.crossings);
        // Two‑Axis
        Object.assign(sys.analysis.twoAxis, _PDF_CASE.twoAxis);
        // Verdict
        sys.analysis.verdict = _PDF_CASE.verdict;
        // Auxiliary Data
        Object.assign(sys.auxiliaryData, _PDF_CASE.auxiliaryData);
        // Evidence Integrity (lista de ficheiros)
        sys.analysis.evidenceIntegrity = _PDF_CASE.evidenceIntegrity;
        // Monthly Data (para ATF)
        sys.monthlyData = _PDF_CASE.monthlyData;

        // ── 3. DATA-BINDING POST-INJECTION ───────────────────────────────────
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

        // ── 4. STATEFUL UI SYNCHRONIZATION ───────────────────────────────────
        var anoFiscalSelect = document.getElementById('anoFiscal');
        if (anoFiscalSelect && sys.selectedYear) {
            anoFiscalSelect.value = sys.selectedYear;
        }
        var periodoSelect = document.getElementById('periodoAnalise');
        if (periodoSelect && sys.selectedPeriodo) {
            periodoSelect.value = sys.selectedPeriodo;
            var triContainer = document.getElementById('trimestralSelectorContainer');
            if (triContainer) {
                triContainer.style.display = 'none'; // Semestre não mostra trimestres
                triContainer.classList.remove('show');
            }
        }
        // Se existir seletor de semestre (opcional)
        var semestreSelect = document.getElementById('semestreSelector');
        if (semestreSelect && sys.selectedSemestre) {
            semestreSelect.value = sys.selectedSemestre;
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
            // Forçar contadores individuais
            var setCounter = function(id, val) {
                var el = document.getElementById(id);
                if (el) el.textContent = val;
            };
            setCounter('controlCountCompact', sys.evidenceCounts.ctrl);
            setCounter('saftCountCompact', sys.evidenceCounts.saft);
            setCounter('invoiceCountCompact', sys.evidenceCounts.fat);
            setCounter('statementCountCompact', sys.evidenceCounts.ext);
            setCounter('dac7CountCompact', sys.evidenceCounts.dac7);
        }

        // ── 6. ASYNCHRONOUS IDENTITY VALIDATION HOOK ─────────────────────────
        if (typeof window.validateNIF === 'function') {
            window.validateNIF(sys.client.nif);
        }

        // ── 7. SESSION TOKEN COLLISION REMEDIATION ───────────────────────────
        var sessionIdSpan = document.getElementById('sessionIdDisplay');
        if (sessionIdSpan) sessionIdSpan.textContent = sys.sessionId;
        var verdictSessionSpan = document.getElementById('verdictSessionId');
        if (verdictSessionSpan) verdictSessionSpan.textContent = sys.sessionId;

        if (typeof window.generateQRCode === 'function') window.generateQRCode();
        var masterHashEl = document.getElementById('masterHashValue');
        if (masterHashEl) masterHashEl.textContent = sys.masterHash;

        // ── 8. ATUALIZAÇÃO DOS MÓDULOS SAF-T, DAC7, AUXILIARES ───────────────
        var saftIliquidoEl = document.getElementById('saftIliquidoValue');
        var saftIvaEl = document.getElementById('saftIvaValue');
        var saftBrutoEl = document.getElementById('saftBrutoValue');
        if (saftIliquidoEl) saftIliquidoEl.textContent = window.formatCurrency(sys.analysis.totals.saftIliquido);
        if (saftIvaEl) saftIvaEl.textContent = window.formatCurrency(sys.analysis.totals.saftIva);
        if (saftBrutoEl) saftBrutoEl.textContent = window.formatCurrency(sys.analysis.totals.saftBruto);

        // DAC7 – garantir visibilidade (Q4 = 7755.16, restantes 0)
        var dac7Items = [
            { id: 'dac7Q1Value', value: 0 },
            { id: 'dac7Q2Value', value: 0 },
            { id: 'dac7Q3Value', value: 0 },
            { id: 'dac7Q4Value', value: 7755.16 }
        ];
        dac7Items.forEach(function(item) {
            var el = document.getElementById(item.id);
            if (el) {
                el.textContent = window.formatCurrency(item.value);
                var parentCard = el.closest('.kpi-card');
                if (parentCard) parentCard.style.display = 'flex';
            }
        });

        // ── 9. FLUXOS NÃO SUJEITOS (ZONA CINZENTA – MÓDULO IV) ────────────────
        var auxMapping = {
            campanhas: 'auxBoxCampanhasValue',
            portagens: 'auxBoxPortagensValue',
            gorjetas: 'auxBoxGorjetasValue',
            totalNaoSujeitos: 'auxBoxTotalNSValue',
            cancelamentos: 'auxBoxCancelValue'
        };
        for (var key in auxMapping) {
            var el = document.getElementById(auxMapping[key]);
            if (el && sys.auxiliaryData[key] !== undefined) {
                el.textContent = window.formatCurrency(sys.auxiliaryData[key]);
            }
        }
        // Nota de reconciliação DAC7
        var dac7Note = document.getElementById('auxDac7ReconciliationNote');
        if (dac7Note && sys.auxiliaryData.totalNaoSujeitos > 0) {
            dac7Note.style.display = 'block';
            var noteVal = document.getElementById('auxDac7NoteValue');
            if (noteVal) noteVal.textContent = window.formatCurrency(sys.auxiliaryData.totalNaoSujeitos);
            var noteValQ = document.getElementById('auxDac7NoteValueQ');
            if (noteValQ) noteValQ.textContent = window.formatCurrency(sys.auxiliaryData.totalNaoSujeitos);
        }
        // Garantir injeção das caixas de apoio pericial
        if (typeof window.injectAuxiliaryHelperBoxes === 'function') {
            window.injectAuxiliaryHelperBoxes();
        }

        // ── 10. ATUALIZAÇÃO DO PAINEL PURE ────────────────────────────────────
        if (typeof window._updatePureUI === 'function') window._updatePureUI();

        // ── 11. SINCRONIZAÇÃO DO DASHBOARD CLÁSSICO (DOWNSTREAM) ──────────────
        if (typeof window.updateDashboard === 'function') window.updateDashboard();
        if (typeof window.updateModulesUI === 'function') window.updateModulesUI();
        if (typeof window.renderChart === 'function') window.renderChart();
        if (typeof window.renderDiscrepancyChart === 'function') window.renderDiscrepancyChart();
        if (typeof window.showTwoAxisAlerts === 'function') window.showTwoAxisAlerts();

        // Reforço para manter DAC7 visível após eventuais alterações
        setTimeout(function() {
            dac7Items.forEach(function(item) {
                var el = document.getElementById(item.id);
                if (el) {
                    var parentCard = el.closest('.kpi-card');
                    if (parentCard) parentCard.style.display = 'flex';
                }
            });
        }, 200);

        console.log('[UNIFED-PURE] ✅ Dados do PDF injetados e dashboard sincronizado (2.º Semestre).');
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

        var t = sys.analysis.totals;
        var c = sys.analysis.crossings;
        var aux = sys.auxiliaryData || {};

        var fmt = function(v) {
            return (typeof window.formatCurrency === 'function')
                ? window.formatCurrency(v)
                : new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(v || 0);
        };

        var set = function(id, value) {
            var el = document.getElementById(id);
            if (el) el.textContent = value;
        };

        set('pure-ganhos',          fmt(t.ganhos));
        set('pure-despesas',        fmt(t.despesas));
        set('pure-liquido',         fmt(t.ganhosLiquidos));
        set('pure-saft',            fmt(t.saftBruto));
        set('pure-dac7',            fmt(t.dac7TotalPeriodo));
        set('pure-fatura',          fmt(t.faturaPlataforma));
        
        set('pure-sg2-btor-val',    fmt(t.despesas));
        set('pure-sg2-btf-val',     fmt(t.faturaPlataforma));
        set('pure-sg1-saft-val',    fmt(t.saftBruto));
        set('pure-sg1-dac7-val',    fmt(t.dac7TotalPeriodo));
        
        set('pure-disc-c2',         fmt(c.discrepanciaCritica));
        set('pure-disc-c2-pct',     ((c.percentagemOmissao || 0).toFixed(2)) + '%');
        set('pure-disc-c1',         fmt(c.discrepanciaSaftVsDac7));
        set('pure-disc-c1-pct',     ((c.percentagemSaftVsDac7 || 0).toFixed(2)) + '%');
        set('pure-iva-falta',       fmt(c.ivaFalta));
        set('pure-iva-falta6',      fmt(c.ivaFalta6));
        set('pure-btor',            fmt(c.btor));
        set('pure-btf',             fmt(c.btf));
        
        set('pure-campanhas',       fmt(aux.campanhas));
        set('pure-portagens',       fmt(aux.portagens));
        set('pure-gorjetas',        fmt(aux.gorjetas));
        set('pure-cancelamentos',   fmt(aux.cancelamentos));
        set('pure-nao-sujeitos',    fmt(aux.totalNaoSujeitos));

        var verdictEl = document.getElementById('pure-verdict');
        if (verdictEl && sys.analysis.verdict) {
            var lang = window.currentLang || 'pt';
            verdictEl.textContent = sys.analysis.verdict.level[lang] || sys.analysis.verdict.level.pt;
            verdictEl.className = 'pure-verdict-value ' + (sys.analysis.verdict.key || 'low');
        }

        var hashEl = document.getElementById('pure-hash-prefix-verdict');
        if (hashEl && sys.masterHash) {
            hashEl.textContent = sys.masterHash.substring(0, 16).toUpperCase();
        }

        if (typeof window._translatePurePanel === 'function') {
            window._translatePurePanel(window.currentLang || 'pt');
        }
    };

    if (typeof window.UNIFEDSystem !== 'undefined' && window.UNIFEDSystem.analysis) {
        _syncPureDashboard();
    }
})();