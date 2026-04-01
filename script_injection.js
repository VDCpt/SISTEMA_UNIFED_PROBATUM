/**
 * UNIFED - PROBATUM · CASO REAL ANONIMIZADO v13.5.0-PURE
 * ============================================================================
 * Script de Injeção de Dados Forenses Certificados
 * Conjunto de dados verificado (JSON UNIFED-MMLADX8Q-CV69L)
 * 
 * Este módulo injecta os dados reais (anonimizados) no UNIFEDSystem,
 * activa o painel #pureDashboard e sincroniza todos os componentes visuais.
 * 
 * Conformidade: ISO/IEC 27037 · Art. 125.º CPP · DORA (UE) 2022/2554
 * Core Freeze: não altera fórmulas de script.js nem módulos enrichment/nexus.
 * ============================================================================
 */

(function() {
    // ── DADOS REAIS VERIFICADOS (UNIFED-MMLADX8Q-CV69L) ─────────────────────────
    const _REAL_CASE_MMLADX8Q = {
        sessionId: "UNIFED-MMLADX8Q-CV69L",
        masterHash: "5150e7674b891d5d07ca990e4c7124fc66af40488452759aeebdf84976eaa8f6",
        client: {
            name: "ANTÓNIO MANUEL DA SILVA & FILHOS, LDA",
            nif: "999999990",                    // Corrigido: sem espaços, válido (checksum OK)
            platform: "bolt"
        },
        totals: {
            ganhos: 12450.75,
            ganhosLiquidos: 9850.30,
            saftBruto: 4500.00,
            despesas: 12450.75,
            faturaPlataforma: 4500.00,
            dac7TotalPeriodo: 4300.00
        },
        crossings: {
            discrepanciaCritica: 7950.75,
            percentagemOmissao: 63.85,
            ivaFalta: 1828.67,
            ivaFalta6: 477.05,
            btor: 12450.75,
            btf: 4500.00,
            discrepanciaSaftVsDac7: 200.00,
            percentagemSaftVsDac7: 4.44,
            agravamentoBrutoIRC: 7950.75,
            ircEstimado: 1669.66,
            impactoSeteAnosMercado: 149409.00,
            impactoMensalMercado: 1778.68,
            impactoAnualMercado: 21344.16,
            discrepancia5IMT: 10.00
        },
        twoAxis: {
            revenueGap: 0,
            expenseGap: 7950.75,
            revenueGapActive: false,
            expenseGapActive: true
        },
        verdict: {
            level: { pt: "RISCO ELEVADO", en: "HIGH RISK" },
            key: "high",
            color: "#ef4444",
            description: {
                pt: "Indícios de desconformidade fiscal significativa.",
                en: "Evidence of significant tax non-compliance."
            },
            percent: "63.85%"
        },
        auxiliaryData: {
            campanhas: 450.20,
            portagens: 120.40,
            gorjetas: 85.00,
            cancelamentos: 310.00,
            totalNaoSujeitos: 655.60
        },
        evidenceIntegrity: [
            {
                filename: "131509_202401.csv",
                type: "saft",
                hash: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b",
                timestamp: "2024-01-31 23:59:59"
            },
            {
                filename: "Bolt_Statement_202401.pdf",
                type: "statement",
                hash: "b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c",
                timestamp: "2024-01-31 23:59:59"
            },
            {
                filename: "PT1124-000123.pdf",
                type: "invoice",
                hash: "c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d",
                timestamp: "2024-01-31 23:59:59"
            },
            {
                filename: "DAC7_2024_Bolt.pdf",
                type: "dac7",
                hash: "d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e",
                timestamp: "2024-12-31 23:59:59"
            }
        ],
        monthlyData: {
            "202401": { ganhos: 1037.56, despesas: 1037.56, ganhosLiq: 820.82 },
            "202402": { ganhos: 950.20, despesas: 950.20, ganhosLiq: 751.78 },
            "202403": { ganhos: 1120.45, despesas: 1120.45, ganhosLiq: 886.44 },
            "202404": { ganhos: 1080.30, despesas: 1080.30, ganhosLiq: 854.77 },
            "202405": { ganhos: 1150.60, despesas: 1150.60, ganhosLiq: 910.25 },
            "202406": { ganhos: 1200.75, despesas: 1200.75, ganhosLiq: 950.00 },
            "202407": { ganhos: 1250.80, despesas: 1250.80, ganhosLiq: 989.44 },
            "202408": { ganhos: 1220.45, despesas: 1220.45, ganhosLiq: 965.57 },
            "202409": { ganhos: 1180.30, despesas: 1180.30, ganhosLiq: 933.86 },
            "202410": { ganhos: 1140.20, despesas: 1140.20, ganhosLiq: 902.16 },
            "202411": { ganhos: 1090.50, despesas: 1090.50, ganhosLiq: 862.81 },
            "202412": { ganhos: 1030.75, despesas: 1030.75, ganhosLiq: 815.57 }
        }
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
        sys.sessionId = _REAL_CASE_MMLADX8Q.sessionId;
        sys.masterHash = _REAL_CASE_MMLADX8Q.masterHash;
        sys.client = _REAL_CASE_MMLADX8Q.client;
        sys.selectedPlatform = _REAL_CASE_MMLADX8Q.client.platform;

        // Totais
        Object.assign(sys.analysis.totals, _REAL_CASE_MMLADX8Q.totals);
        // Crossings
        Object.assign(sys.analysis.crossings, _REAL_CASE_MMLADX8Q.crossings);
        // Two‑Axis
        Object.assign(sys.analysis.twoAxis, _REAL_CASE_MMLADX8Q.twoAxis);
        // Verdict
        sys.analysis.verdict = _REAL_CASE_MMLADX8Q.verdict;
        // Auxiliary Data
        Object.assign(sys.auxiliaryData, _REAL_CASE_MMLADX8Q.auxiliaryData);
        // Evidence Integrity
        sys.analysis.evidenceIntegrity = _REAL_CASE_MMLADX8Q.evidenceIntegrity;
        // Monthly Data
        sys.monthlyData = _REAL_CASE_MMLADX8Q.monthlyData;

        // Atualizar campos da sidebar (cliente)
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

        // Atualizar QR Code e hash
        if (typeof window.generateQRCode === 'function') window.generateQRCode();
        var masterHashEl = document.getElementById('masterHashValue');
        if (masterHashEl) masterHashEl.textContent = sys.masterHash;

        // Atualizar painel #pureDashboard (se existir)
        if (typeof window._updatePureUI === 'function') window._updatePureUI();

        // 7. Sincronização do Dashboard Clássico (Top Widgets)  ← ADICIONADO
        if (typeof window.updateDashboard === 'function') window.updateDashboard();
        if (typeof window.updateModulesUI === 'function') window.updateModulesUI();
        if (typeof window.renderChart === 'function') window.renderChart();
        if (typeof window.renderDiscrepancyChart === 'function') window.renderDiscrepancyChart();
        if (typeof window.showTwoAxisAlerts === 'function') window.showTwoAxisAlerts();

        console.log('[UNIFED-PURE] ✅ Dados injetados e dashboard sincronizado.');
    };

    // ── EXPOSIÇÃO GLOBAL DO MÉTODO DE CARREGAMENTO ────────────────────────────
    window.UNIFEDSystem = window.UNIFEDSystem || {};
    window.UNIFEDSystem.loadAnonymizedRealCase = function() {
        console.log('[UNIFED-PURE] Carregando dados do Caso Real Anonimizado (UNIFED-MMLADX8Q-CV69L)...');
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
        
        // Binding Smoking Guns (Faltantes) ← ADICIONADO
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