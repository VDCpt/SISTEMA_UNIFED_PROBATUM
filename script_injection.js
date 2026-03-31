/**
 * ============================================================================
 * UNIFED - PROBATUM · v13.5.0-PURE · INJEÇÃO DE CASO REAL ANONIMIZADO
 * ============================================================================
 * Ficheiro      : script_injection.js
 * Versão        : 13.5.0-PURE (FINAL ELITE – NIF UNIFICADO)
 * Sessão de ref.: UNIFED-MMLADX8Q-CV69L
 * Estado        : DEMO (demoMode: true) – Activação condicional por clique
 * Conformidade  : ISO/IEC 27037:2012 · DORA (UE) 2022/2554 · Art. 125.º CPP
 * ============================================================================
 */

'use strict';

(function _pureInjectionModule() {

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

        nonCommissionable: {
            campanhas:         405.00,
            gorjetas:          46.00,
            portagens:          0.15,
            cancelamentos:     58.10,
            totalNaoSujeitos: 451.15
        }
    };

    async function _syncPureDashboard() {
        console.info('[UNIFED-PURE] ⚖️ A injetar Prova Material: Caso MMLADX8Q...');

        const sys = window.UNIFEDSystem;
        if (!sys) {
            console.error('[UNIFED-PURE] ❌ UNIFEDSystem não definido.');
            return;
        }

        // 1. Identificação do Sujeito Passivo (Fonte Única)
        sys.client = sys.client || {};
        sys.client.name = _REAL_CASE_MMLADX8Q.client.name;
        sys.client.nif  = _REAL_CASE_MMLADX8Q.client.nif;
        sys.selectedPlatform = _REAL_CASE_MMLADX8Q.client.platform;
        sys.sessionId = _REAL_CASE_MMLADX8Q.sessionId;
        sys.demoMode = true;

        // Preservar estruturas existentes
        if (!sys.analysis) sys.analysis = {};
        const preservedTwoAxis = sys.analysis.twoAxis;
        const preservedEvidence = sys.analysis.evidenceIntegrity;

        sys.analysis.totals     = Object.assign({}, sys.analysis.totals,     _REAL_CASE_MMLADX8Q.analysis.totals);
        sys.analysis.crossings  = Object.assign({}, sys.analysis.crossings,  _REAL_CASE_MMLADX8Q.analysis.crossings);
        sys.analysis.verdict    = Object.assign({}, sys.analysis.verdict,    _REAL_CASE_MMLADX8Q.analysis.verdict);
        sys.analysis.metadata   = Object.assign({}, sys.analysis.metadata,   _REAL_CASE_MMLADX8Q.analysis.metadata);

        if (preservedTwoAxis)   sys.analysis.twoAxis = preservedTwoAxis;
        if (preservedEvidence)  sys.analysis.evidenceIntegrity = preservedEvidence;

        sys.monthlyData = {};
        _REAL_CASE_MMLADX8Q.analysis.metadata.monthlyData.forEach(m => {
            sys.monthlyData[m.month] = {
                ganhos: m.ganhos,
                despesas: m.despesas,
                ganhosLiq: m.ganhos - m.despesas
            };
        });
        sys.auditLog = _REAL_CASE_MMLADX8Q.analysis.metadata.auditLog || [];
        sys.nonCommissionable = Object.assign({}, _REAL_CASE_MMLADX8Q.nonCommissionable);

        if (typeof sys.generateForensicSeal === 'function') {
            await sys.generateForensicSeal();
        } else {
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

        // Atualizar UI (função existente em script.js)
        if (typeof window._updatePureUI === 'function') {
            window._updatePureUI();
        } else {
            console.warn('[UNIFED-PURE] _updatePureUI não definido – UI pode não refletir dados.');
        }

        console.log('[UNIFED-PURE] ✅ Dados injetados. Master Hash:', sys.masterHash);
    }

    window.UNIFEDSystem = window.UNIFEDSystem || {};
    window.UNIFEDSystem.loadAnonymizedRealCase = _syncPureDashboard;
    window._REAL_CASE_MMLADX8Q = Object.freeze(_REAL_CASE_MMLADX8Q);

    console.info('[UNIFED-PURE] v13.5.0-PURE · Módulo de Injeção pronto (NIF unificado).');
})();