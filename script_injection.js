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

        // Atualizar UI através da função dedicada
        if (typeof window._updatePureUI === 'function') {
            window._updatePureUI();
        } else {
            console.warn('[UNIFED-PURE] _updatePureUI não definido – UI pode não refletir dados.');
        }

        console.log('[UNIFED-PURE] ✅ Dados injetados. Master Hash:', sys.masterHash);
    }

    // Função de actualização do painel PURE (corrigida)
    window._updatePureUI = function() {
        const sys = window.UNIFEDSystem;
        if (!sys || !sys.analysis) return;
        const fmt = window.UNIFED_FormatCurrency || window.formatCurrency;
        const t = sys.analysis.totals;
        const c = sys.analysis.crossings;
        const pure = (id) => document.getElementById(id);

        if (pure('pure-ganhos'))   pure('pure-ganhos').textContent = fmt(t.ganhos);
        if (pure('pure-despesas')) pure('pure-despesas').textContent = fmt(t.despesas);
        if (pure('pure-liquido'))  pure('pure-liquido').textContent = fmt(t.ganhosLiquidos);
        if (pure('pure-saft'))     pure('pure-saft').textContent = fmt(t.saftBruto);
        if (pure('pure-dac7'))     pure('pure-dac7').textContent = fmt(t.dac7TotalPeriodo);
        if (pure('pure-fatura'))   pure('pure-fatura').textContent = fmt(t.faturaPlataforma);
        if (pure('pure-disc-c2'))  pure('pure-disc-c2').textContent = fmt(c.discrepanciaCritica);
        if (pure('pure-disc-c2-pct')) pure('pure-disc-c2-pct').textContent = c.percentagemOmissao.toFixed(2) + '%';
        if (pure('pure-disc-saft-dac7')) pure('pure-disc-saft-dac7').textContent = fmt(c.discrepanciaSaftVsDac7);
        if (pure('pure-iva-23'))   pure('pure-iva-23').textContent = fmt(c.ivaFalta);
        if (pure('pure-iva-6'))    pure('pure-iva-6').textContent = fmt(c.ivaFalta6);
        if (pure('pure-irc'))      pure('pure-irc').textContent = fmt(c.ircEstimado);

        const nc = sys.nonCommissionable;
        if (pure('pure-nc-campanhas') && nc) pure('pure-nc-campanhas').textContent = fmt(nc.campanhas);
        if (pure('pure-nc-gorjetas') && nc)  pure('pure-nc-gorjetas').textContent = fmt(nc.gorjetas);
        if (pure('pure-nc-portagens') && nc) pure('pure-nc-portagens').textContent = fmt(nc.portagens);
        if (pure('pure-nc-total') && nc)     pure('pure-nc-total').textContent = fmt(nc.totalNaoSujeitos);

        // Actualizar valores do score de persistência, etc.
        if (pure('pure-atf-sp')) pure('pure-atf-sp').innerHTML = (typeof c.persistenciaScore !== 'undefined' ? c.persistenciaScore : 40) + '<span style="font-size:1rem;opacity:0.6">/100</span>';
        if (pure('pure-atf-status')) pure('pure-atf-status').textContent = c.percentagemOmissao > 80 ? 'OMISSÃO SISTEMÁTICA / RISCO ELEVADO' : 'OMISSÃO PONTUAL / RISCO MODERADO';
        if (pure('pure-atf-trend')) pure('pure-atf-trend').innerHTML = '📉 DESCENDENTE';
        if (pure('pure-atf-outliers')) pure('pure-atf-outliers').innerHTML = '0 outliers > 2σ';
        if (pure('pure-atf-meses')) pure('pure-atf-meses').innerHTML = '2.º Semestre 2024 — 4 meses com dados (Set–Dez)';
        if (pure('pure-verdict')) pure('pure-verdict').textContent = t.ganhos > 10000 ? 'RISCO ELEVADO' : 'RISCO CRÍTICO';
        if (pure('pure-verdict-pct')) pure('pure-verdict-pct').innerHTML = c.percentagemOmissao.toFixed(2) + '%';
    };

    window.UNIFEDSystem = window.UNIFEDSystem || {};
    window.UNIFEDSystem.loadAnonymizedRealCase = _syncPureDashboard;
    window._REAL_CASE_MMLADX8Q = Object.freeze(_REAL_CASE_MMLADX8Q);

    console.info('[UNIFED-PURE] v13.5.0-PURE · Módulo de Injeção pronto (NIF unificado).');
})();