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
    // ── DADOS REAIS EXTRAÍDOS DO PDF (IFDE-MNBWZSD5-F2C60) ───────────────────
    const _PDF_CASE = {
        sessionId: "UNIFED-MNGFN3C0-X57MO",          // Sessão da DEMO
        masterHash: "a3f8c9e2d5b6a7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1",
        client: {
            name: "Demo Driver, Lda",
            nif: "123456789",                         // NIF válido (checksum OK)
            platform: "bolt"
        },
        totals: {
            ganhos: 10157.73,                         // Ganhos Brutos (Extrato)
            ganhosLiquidos: 7709.84,                  // Ganhos - Despesas
            saftBruto: 10157.73,                      // Igual ao Ganhos (Bruto Auditado)
            despesas: 2447.89,                        // Comissões Retidas (BTOR)
            faturaPlataforma: 262.94,                 // Comissões Faturadas (BTF)
            dac7TotalPeriodo: 7755.16,                // Total DAC7 (Q1+Q2+Q3+Q4)
            dac7Q1: 1938.79,                          // Distribuição uniforme
            dac7Q2: 1938.79,
            dac7Q3: 1938.79,
            dac7Q4: 1938.79
        },
        crossings: {
            discrepanciaCritica: 2184.95,              // Despesas - Fatura (C2)
            percentagemOmissao: 89.26,                 // (2184.95 / 2447.89) * 100
            ivaFalta: 502.54,                         // 23% sobre 2184.95
            ivaFalta6: 131.10,                        // 6% sobre 2184.95
            btor: 2447.89,
            btf: 262.94,
            discrepanciaSaftVsDac7: 2402.57,           // Ganhos - DAC7 (C1)
            percentagemSaftVsDac7: 23.65,              // (2402.57 / 10157.73) * 100
            agravamentoBrutoIRC: 2184.95,
            ircEstimado: 458.84,                      // 21% sobre 2184.95
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
            campanhas: 0,
            portagens: 0,
            gorjetas: 0,
            cancelamentos: 0,
            totalNaoSujeitos: 0
        },
        evidenceIntegrity: [
            {
                filename: "IFDE_Parecer_IFDE-MNBWZSD5-F2C60.pdf",
                type: "pdf_report",
                hash: "77fad284e8358e8e...",
                timestamp: "2024-12-31 23:59:59"
            }
        ],
        monthlyData: {}                               // Dados mensais não disponíveis no PDF
    };

    // ── SISTEMA DE INJEÇÃO ATÓMICA ─────────────────────────────────────────────
    window._syncPureDashboard = function() {
        var sys = window.UNIFEDSystem;
        if (!sys) return;

        // Garantir que as propriedades essenciais existem
        if (!sys.analysis) sys.analysis = {};
        if (!sys.analysis.totals) sys.analysis.totals = {};
        if (!sys.analysis.crossings) sys.analysis.crossings = {};
        if (!sys.analysis.twoAxis) sys.analysis.twoAxis = {};
        if (!sys.auxiliaryData) sys.auxiliaryData = {};

        // Injetar dados reais
        sys.sessionId = _PDF_CASE.sessionId;
        sys.masterHash = _PDF_CASE.masterHash;
        sys.client = _PDF_CASE.client;
        sys.selectedPlatform = _PDF_CASE.client.platform;

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
        // Evidence Integrity
        sys.analysis.evidenceIntegrity = _PDF_CASE.evidenceIntegrity;
        // Monthly Data (vazio, para não induzir em erro)
        sys.monthlyData = {};

        // ── 1. Data-Binding Post-Injection ───────────────────────────────────
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

        // ── 2. Stateful UI Synchronization ───────────────────────────────────
        // Sincronizar ano fiscal
        var anoFiscalSelect = document.getElementById('anoFiscal');
        if (anoFiscalSelect && sys.selectedYear) {
            anoFiscalSelect.value = sys.selectedYear;
        }
        // Sincronizar período
        var periodoSelect = document.getElementById('periodoAnalise');
        if (periodoSelect && sys.selectedPeriodo) {
            periodoSelect.value = sys.selectedPeriodo;
            // Forçar visibilidade do seletor trimestral
            var triContainer = document.getElementById('trimestralSelectorContainer');
            if (triContainer) {
                triContainer.style.display = sys.selectedPeriodo === 'trimestral' ? 'flex' : 'none';
                triContainer.classList.toggle('show', sys.selectedPeriodo === 'trimestral');
            }
        }
        // Sincronizar trimestre (se existir)
        var triSelector = document.getElementById('trimestralSelector');
        if (triSelector && sys.selectedTrimestre) {
            triSelector.value = sys.selectedTrimestre;
        }

        // ── 3. Evidence Counter Reconciliation ───────────────────────────────
        if (typeof window.forensicDataSynchronization === 'function') {
            window.forensicDataSynchronization();
        } else {
            // Fallback manual
            var total = sys.analysis.evidenceIntegrity.length;
            var counterEl = document.getElementById('evidenceCountTotal');
            if (counterEl) counterEl.textContent = total;
        }

        // ── 4. Asynchronous Identity Validation Hook ─────────────────────────
        if (typeof window.validateNIF === 'function') {
            var nifValid = window.validateNIF(sys.client.nif);
            if (!nifValid) {
                console.warn('[UNIFED-PURE] NIF do cliente não é válido segundo o checksum.');
            }
        }

        // ── 5. Session Token Collision Remediation ───────────────────────────
        var sessionIdSpan = document.getElementById('sessionIdDisplay');
        if (sessionIdSpan) sessionIdSpan.textContent = sys.sessionId;
        var verdictSessionSpan = document.getElementById('verdictSessionId');
        if (verdictSessionSpan) verdictSessionSpan.textContent = sys.sessionId;

        // Atualizar QR Code e hash
        if (typeof window.generateQRCode === 'function') window.generateQRCode();
        var masterHashEl = document.getElementById('masterHashValue');
        if (masterHashEl) masterHashEl.textContent = sys.masterHash;

        // Atualizar painel #pureDashboard (se existir)
        if (typeof window._updatePureUI === 'function') window._updatePureUI();

        // 7. Sincronização do Dashboard Clássico (Top Widgets)
        if (typeof window.updateDashboard === 'function') window.updateDashboard();
        if (typeof window.updateModulesUI === 'function') window.updateModulesUI();
        if (typeof window.renderChart === 'function') window.renderChart();
        if (typeof window.renderDiscrepancyChart === 'function') window.renderDiscrepancyChart();
        if (typeof window.showTwoAxisAlerts === 'function') window.showTwoAxisAlerts();

        console.log('[UNIFED-PURE] ✅ Dados do PDF injetados e dashboard sincronizado.');
    };

    // ── EXPOSIÇÃO GLOBAL DO MÉTODO DE CARREGAMENTO ────────────────────────────
    window.UNIFEDSystem = window.UNIFEDSystem || {};
    window.UNIFEDSystem.loadAnonymizedRealCase = function() {
        console.log('[UNIFED-PURE] Carregando dados do PDF (IFDE-MNBWZSD5-F2C60)...');
        window._syncPureDashboard();
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

        // ── Totais e Smoking Guns (com bindings adicionados) ───────────────────
        set('pure-ganhos',          fmt(t.ganhos));
        set('pure-despesas',        fmt(t.despesas));
        set('pure-liquido',         fmt(t.ganhosLiquidos));
        set('pure-saft',            fmt(t.saftBruto   || t.bruto));
        set('pure-dac7',            fmt(t.dac7TotalPeriodo));
        set('pure-fatura',          fmt(t.faturaPlataforma));
        
        // Binding Smoking Guns (Faltantes)
        set('pure-sg2-btor-val',    fmt(t.despesas));
        set('pure-sg2-btf-val',     fmt(t.faturaPlataforma));
        set('pure-sg1-saft-val',    fmt(t.saftBruto));
        set('pure-sg1-dac7-val',    fmt(t.dac7TotalPeriodo));
        
        // Discrepâncias
        set('pure-disc-c2',         fmt(c.discrepanciaCritica));
        set('pure-disc-c2-pct',     ((c.percentagemOmissao || 0).toFixed(2)) + '%');
        set('pure-disc-c1',         fmt(c.discrepanciaSaftVsDac7));
        set('pure-disc-c1-pct',     ((c.percentagemSaftVsDac7 || 0).toFixed(2)) + '%');
        set('pure-iva-falta',       fmt(c.ivaFalta));
        set('pure-iva-falta6',      fmt(c.ivaFalta6));
        set('pure-btor',            fmt(c.btor));
        set('pure-btf',             fmt(c.btf));
        
        // Auxiliares
        set('pure-campanhas',       fmt(aux.campanhas));
        set('pure-portagens',       fmt(aux.portagens));
        set('pure-gorjetas',        fmt(aux.gorjetas));
        set('pure-cancelamentos',   fmt(aux.cancelamentos));
        set('pure-nao-sujeitos',    fmt(aux.totalNaoSujeitos));

        // Verdict
        var verdictEl = document.getElementById('pure-verdict');
        if (verdictEl && sys.analysis.verdict) {
            var lang = window.currentLang || 'pt';
            verdictEl.textContent = sys.analysis.verdict.level[lang] || sys.analysis.verdict.level.pt;
            verdictEl.className = 'pure-verdict-value ' + (sys.analysis.verdict.key || 'low');
        }

        // Hash prefix
        var hashEl = document.getElementById('pure-hash-prefix-verdict');
        if (hashEl && sys.masterHash) {
            hashEl.textContent = sys.masterHash.substring(0, 16).toUpperCase();
        }

        // Tradução do painel se disponível
        if (typeof window._translatePurePanel === 'function') {
            window._translatePurePanel(window.currentLang || 'pt');
        }
    };

    // Tentar sincronizar imediatamente se o UNIFEDSystem já estiver disponível
    if (typeof window.UNIFEDSystem !== 'undefined' && window.UNIFEDSystem.analysis) {
        window._syncPureDashboard();
    }
})();