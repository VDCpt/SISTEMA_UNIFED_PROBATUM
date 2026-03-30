/**
 * ============================================================================
 * UNIFED - PROBATUM · v13.5.0-PURE · INJEÇÃO DE CASO REAL ANONIMIZADO
 * ============================================================================
 * Ficheiro      : script_injection.js
 * Versão        : 13.5.0-PURE (FINAL ELITE)
 * Sessão de ref.: UNIFED-MMLADX8Q-CV69L
 * Estado        : DEMO (demoMode: true) – Activação condicional por clique
 * Conformidade  : ISO/IEC 27037:2012 · DORA (UE) 2022/2554 · Art. 125.º CPP
 * ============================================================================
 *
 * NOTA: Este módulo só injecta dados quando o botão "CASO REAL ANONIMIZADO"
 *       for clicado. O NIF utilizado é 999 999 990 (modo de demonstração).
 * ============================================================================
 */

'use strict';

(function _pureInjectionModule() {

    // ============================================================================
    // SECÇÃO 1 — DADOS VERIFICADOS (ESTRUTURA DO CASO REAL)
    // ============================================================================
    const _REAL_CASE_MMLADX8Q = {
        sessionId:  "UNIFED-MMLADX8Q-CV69L",
        version:    "v13.5.0-PURE",
        timestamp:  "2026-03-30T18:15:48.314Z",
        demoMode:   true,
        
        client: {
            name: "SUJEITO PASSIVO ALFA (ANONIMIZADO)",
            nif:  "999 999 990",
            platform: "Plataforma A"
        },

        // Dados Financeiros Consolidados (Read-Only)
        analysis: {
            totals: {
                bruto:           10157.73,
                iliquido:         9582.76,
                iva:              574.97,
                ganhos:          10157.73,
                despesas:         2447.89,
                ganhosLiquidos:   7709.84,
                faturaPlataforma:  262.94,
                dac7TotalPeriodo: 7755.16
            },
            crossings: {
                discrepanciaCritica:      2184.95,
                percentagemOmissao:       89.26,
                discrepanciaSaftVsDac7:   2402.57,
                percentagemSaftVsDac7:    23.65,
                ivaFalta:                 502.54,
                ivaFalta6:               131.10,
                ircEstimado:             458.84
            },
            verdict: {
                level: { pt: "RISCO ELEVADO", en: "HIGH RISK" },
                key: "high",
                color: "#EF4444",
                percent: "89.26%"
            },
            metadata: {
                monthlyData: [
                    { month: "202409", ganhos: 2031.55, despesas: 489.58, discrepancy: 0 },
                    { month: "202410", ganhos: 3047.32, despesas: 734.37, discrepancy: 0 },
                    { month: "202411", ganhos: 2539.43, despesas: 611.97, discrepancy: 0 },
                    { month: "202412", ganhos: 2539.43, despesas: 611.97, discrepancy: 0 }
                ],
                auditLog: [
                    { date: "2024-09-30", ganhos: 2031.55, despesas: 489.58, discrepancia: 0 },
                    { date: "2024-10-31", ganhos: 3047.32, despesas: 734.37, discrepancia: 0 },
                    { date: "2024-11-30", ganhos: 2539.43, despesas: 611.97, discrepancia: 0 },
                    { date: "2024-12-31", ganhos: 2539.43, despesas: 611.97, discrepancia: 0 }
                ]
            }
        },

        // ZONA CINZENTA — valores não sujeitos a comissão
        nonCommissionable: {
            campanhas:         405.00,
            gorjetas:          46.00,
            portagens:          0.15,
            cancelamentos:     58.10,
            totalNaoSujeitos: 451.15
        }
    };

    // ============================================================================
    // SECÇÃO 2 — FUNÇÃO DE SINCRONIZAÇÃO (ACTIVAÇÃO POR CLIQUE)
    // ============================================================================
    async function _syncPureDashboard() {
        console.info('[UNIFED-PURE] ⚖️ A injetar Prova Material: Caso MMLADX8Q...');

        const sys = window.UNIFEDSystem;
        if (!sys) {
            console.error('[UNIFED-PURE] ❌ UNIFEDSystem não definido.');
            return;
        }

        // 1. Identificação do Sujeito Passivo
        sys.client = sys.client || {};
        sys.client.name = _REAL_CASE_MMLADX8Q.client.name;
        sys.client.nif  = _REAL_CASE_MMLADX8Q.client.nif;
        sys.selectedPlatform = _REAL_CASE_MMLADX8Q.client.platform;
        sys.sessionId = _REAL_CASE_MMLADX8Q.sessionId;
        sys.demoMode = true;

        // 2. Preservar estruturas existentes (twoAxis, evidenceIntegrity)
        if (!sys.analysis) sys.analysis = {};
        const preservedTwoAxis = sys.analysis.twoAxis;
        const preservedEvidence = sys.analysis.evidenceIntegrity;

        // 3. Fundir os dados do caso real
        sys.analysis.totals     = Object.assign({}, sys.analysis.totals,     _REAL_CASE_MMLADX8Q.analysis.totals);
        sys.analysis.crossings  = Object.assign({}, sys.analysis.crossings,  _REAL_CASE_MMLADX8Q.analysis.crossings);
        sys.analysis.verdict    = Object.assign({}, sys.analysis.verdict,    _REAL_CASE_MMLADX8Q.analysis.verdict);
        sys.analysis.metadata   = Object.assign({}, sys.analysis.metadata,   _REAL_CASE_MMLADX8Q.analysis.metadata);

        // Restaurar twoAxis e evidenceIntegrity
        if (preservedTwoAxis)   sys.analysis.twoAxis = preservedTwoAxis;
        if (preservedEvidence)  sys.analysis.evidenceIntegrity = preservedEvidence;

        // 4. Dados mensais e auditLog
        sys.monthlyData = {};
        _REAL_CASE_MMLADX8Q.analysis.metadata.monthlyData.forEach(m => {
            sys.monthlyData[m.month] = {
                ganhos: m.ganhos,
                despesas: m.despesas,
                ganhosLiq: m.ganhos - m.despesas
            };
        });
        sys.auditLog = _REAL_CASE_MMLADX8Q.analysis.metadata.auditLog || [];

        // 5. ZONA CINZENTA
        sys.nonCommissionable = Object.assign({}, _REAL_CASE_MMLADX8Q.nonCommissionable);

        // 6. Gerar hash dinâmico (se a função existir)
        if (typeof sys.generateForensicSeal === 'function') {
            await sys.generateForensicSeal();
        } else {
            // Fallback: criar um hash com base nos dados carregados
            const encoder = new TextEncoder();
            const payload = JSON.stringify({
                monthlyData: sys.monthlyData,
                analysis: sys.analysis,
                sessionId: sys.sessionId,
                client: sys.client,
                nonCommissionable: sys.nonCommissionable
            });
            const data = encoder.encode(payload);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            sys.masterHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        }

        // 7. Atualizar elementos do painel PURE
        const _fmt = (v) => {
            const lang = (typeof window.currentLang !== 'undefined') ? window.currentLang : 'pt';
            const locale = lang === 'en' ? 'en-GB' : 'pt-PT';
            return new Intl.NumberFormat(locale, {
                style: 'currency', currency: 'EUR',
                minimumFractionDigits: 2, maximumFractionDigits: 2
            }).format(v || 0);
        };

        const setText = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };

        const totals = sys.analysis.totals;
        const crossings = sys.analysis.crossings;
        const verdict = sys.analysis.verdict;
        const nc = sys.nonCommissionable;

        setText('pure-session-id', sys.sessionId);
        setText('pure-client-name', sys.client.name);
        setText('pure-client-nif', sys.client.nif);
        setText('pure-hash-prefix', (sys.masterHash || '').substring(0, 8) + '...');
        setText('pure-hash-prefix-verdict', (sys.masterHash || '').substring(0, 8) + '...');
        setText('pure-verdict-value', verdict.level.pt);
        setText('pure-verdict-pct', verdict.percent);
        setText('pure-total-omission', _fmt(crossings.discrepanciaCritica));

        setText('pure-ganhos', _fmt(totals.ganhos));
        setText('pure-despesas', _fmt(totals.despesas));
        setText('pure-liquido', _fmt(totals.ganhosLiquidos));
        setText('pure-saft', _fmt(totals.bruto));
        setText('pure-dac7', _fmt(totals.dac7TotalPeriodo));
        setText('pure-fatura', _fmt(totals.faturaPlataforma));

        setText('pure-disc-c2', _fmt(crossings.discrepanciaCritica));
        setText('pure-disc-c2-pct', crossings.percentagemOmissao.toFixed(2) + '%');
        setText('pure-disc-saft-dac7', _fmt(crossings.discrepanciaSaftVsDac7));
        setText('pure-disc-saft-pct', crossings.percentagemSaftVsDac7.toFixed(2) + '%');
        setText('pure-iva-23', _fmt(crossings.ivaFalta));
        setText('pure-iva-6', _fmt(crossings.ivaFalta6));
        setText('pure-irc', _fmt(crossings.ircEstimado));
        setText('pure-sg2-btor-val', _fmt(totals.despesas));
        setText('pure-sg2-btf-val', _fmt(totals.faturaPlataforma));
        setText('pure-sg1-saft-val', _fmt(totals.bruto));
        setText('pure-sg1-dac7-val', _fmt(totals.dac7TotalPeriodo));

        setText('pure-nc-campanhas', _fmt(nc.campanhas));
        setText('pure-nc-gorjetas', _fmt(nc.gorjetas));
        setText('pure-nc-portagens', _fmt(nc.portagens));
        setText('pure-nc-cancelamentos', _fmt(nc.cancelamentos));
        setText('pure-nc-total', _fmt(nc.totalNaoSujeitos));
        setText('pure-zc-amount', _fmt(nc.totalNaoSujeitos));

        // Atualizar Score de Persistência (ATF)
        if (typeof window.computeTemporalAnalysis === 'function') {
            const atf = window.computeTemporalAnalysis(sys.monthlyData, sys.analysis);
            const spEl = document.getElementById('pure-atf-sp');
            if (spEl) spEl.innerHTML = (atf.persistenceScore || 40) + '<span style="font-size:1rem;opacity:0.6">/100</span>';
            const statusEl = document.getElementById('pure-atf-status');
            if (statusEl) statusEl.textContent = atf.persistenceLabel || '';
            const trendEl = document.getElementById('pure-atf-trend');
            if (trendEl) trendEl.textContent = atf.trend === 'ascending' ? '📈 ASCENDENTE' : (atf.trend === 'descending' ? '📉 DESCENDENTE' : '➡️ ESTÁVEL');
        }

        // Atualizar flag visual de modo de operação
        const modeIndicator = document.querySelector('.pure-mode-indicator');
        if (modeIndicator) {
            modeIndicator.textContent = 'MODO PERICIAL ATIVO';
            modeIndicator.style.background = 'rgba(239, 68, 68, 0.1)';
            modeIndicator.style.color = '#EF4444';
        }

        console.log('[UNIFED-PURE] ✅ Dados injetados. Master Hash:', sys.masterHash);
    }

    // ============================================================================
    // SECÇÃO 3 — EXPOSIÇÃO GLOBAL
    // ============================================================================
    window.UNIFEDSystem = window.UNIFEDSystem || {};
    window.UNIFEDSystem.loadAnonymizedRealCase = _syncPureDashboard;
    window._REAL_CASE_MMLADX8Q = Object.freeze(_REAL_CASE_MMLADX8Q);

    console.info('[UNIFED-PURE] v13.5.0-PURE · Módulo de Injeção pronto para acionamento manual.');

})();