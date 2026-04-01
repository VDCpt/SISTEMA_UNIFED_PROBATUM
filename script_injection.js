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
 * RECTIFICAÇÕES v13.5.0-PURE (2026-04-01):
 *   [FIX-D] Guard de versão adicionado à redefinição de window._updatePureUI
 *           para evitar sobreposição com versão do script.js quando este
 *           carregar em último lugar. Versão semântica _version = 2 (18 campos).
 *   [FIX-D2] Verificação de existência de UNIFEDSystem antes de atribuição
 *             de loadAnonymizedRealCase para eliminar race condition de bootstrap.
 * ============================================================================
 */

'use strict';

(function _pureInjectionModule() {

    // ── DADOS DO CASO REAL ANONIMIZADO ───────────────────────────────────────
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
                iva:               574.97,
                ganhos:          10157.73,
                despesas:         2447.89,
                ganhosLiquidos:   7709.84,
                faturaPlataforma:  262.94,
                saftBruto:       10157.73,
                saftIliquido:     9582.76,
                saftIva:           574.97,
                dac7TotalPeriodo: 7755.16,
                dac7Q1:              0.00,
                dac7Q2:              0.00,
                dac7Q3:           2031.55,
                dac7Q4:           5723.61
            },
            crossings: {
                discrepanciaCritica:      2184.95,
                percentagemOmissao:       89.26,
                discrepanciaSaftVsDac7:   2402.57,
                percentagemSaftVsDac7:    23.65,
                ivaFalta:                  502.54,
                ivaFalta6:                 131.10,
                ircEstimado:               458.84,
                persistenciaScore:          40,
                delta:                    2402.57,
                comissaoDivergencia:      2184.95,
                btor:                     2447.89,
                btf:                       262.94,
                agravamentoBrutoIRC:      2184.95,
                discrepancia5IMT:         2402.57,
                impactoMensalMercado:   546237.50,
                impactoAnualMercado:   6554850.00,
                impactoSeteAnosMercado: 45883950.00
            },
            verdict: {
                level: { pt: "RISCO ELEVADO", en: "HIGH RISK" },
                key:   "high",
                color: "#EF4444",
                percent: "89.26%",
                description: {
                    pt: "Evidência de subcomunicação de proveitos (DAC7) e omissão grave de faturação de custos (89,26%). A plataforma retém valores sem a devida titulação fiscal, prejudicando o direito à dedução de IVA e inflacionando a base de IRC do contribuinte.",
                    en: "Evidence of income under-reporting (DAC7) and serious cost invoicing omission (89.26%). The platform retains amounts without proper tax documentation, prejudicing the right to VAT deduction and inflating the taxpayer's IRC base."
                }
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
            gorjetas:           46.00,
            portagens:           0.15,
            cancelamentos:      58.10,
            totalNaoSujeitos:  451.15
        }
    };

    // ── SINCRONIZAÇÃO DO PAINEL DEMO ─────────────────────────────────────────
    async function _syncPureDashboard() {
        console.info('[UNIFED-PURE] ⚖️ A injetar Prova Material: Caso MMLADX8Q...');

        const sys = window.UNIFEDSystem;
        if (!sys) {
            console.error('[UNIFED-PURE] ❌ UNIFEDSystem não definido.');
            return;
        }

        // 1. Identificação do Sujeito Passivo (Fonte Única)
        sys.client           = sys.client || {};
        sys.client.name      = _REAL_CASE_MMLADX8Q.client.name;
        sys.client.nif       = _REAL_CASE_MMLADX8Q.client.nif;
        sys.selectedPlatform = _REAL_CASE_MMLADX8Q.client.platform;
        sys.sessionId        = _REAL_CASE_MMLADX8Q.sessionId;
        sys.demoMode         = true;
        sys.casoRealAnonimizado = true;

        // 2. Preservar estruturas existentes antes de mesclar
        if (!sys.analysis) sys.analysis = {};
        const preservedTwoAxis   = sys.analysis.twoAxis;
        const preservedEvidence  = sys.analysis.evidenceIntegrity;

        sys.analysis.totals   = Object.assign({}, sys.analysis.totals,   _REAL_CASE_MMLADX8Q.analysis.totals);
        sys.analysis.crossings = Object.assign({}, sys.analysis.crossings, _REAL_CASE_MMLADX8Q.analysis.crossings);
        sys.analysis.verdict   = Object.assign({}, sys.analysis.verdict,   _REAL_CASE_MMLADX8Q.analysis.verdict);
        sys.analysis.metadata  = Object.assign({}, sys.analysis.metadata,  _REAL_CASE_MMLADX8Q.analysis.metadata);

        if (preservedTwoAxis)  sys.analysis.twoAxis           = preservedTwoAxis;
        if (preservedEvidence) sys.analysis.evidenceIntegrity = preservedEvidence;

        // 3. Construir monthlyData e auditLog
        sys.monthlyData = {};
        _REAL_CASE_MMLADX8Q.analysis.metadata.monthlyData.forEach(m => {
            sys.monthlyData[m.month] = {
                ganhos:    m.ganhos,
                despesas:  m.despesas,
                ganhosLiq: m.ganhos - m.despesas
            };
        });
        sys.auditLog = _REAL_CASE_MMLADX8Q.analysis.metadata.auditLog || [];
        sys.nonCommissionable = Object.assign({}, _REAL_CASE_MMLADX8Q.nonCommissionable);

        // 4. Gerar selo forense
        if (typeof sys.generateForensicSeal === 'function') {
            await sys.generateForensicSeal();
        } else {
            const encoder = new TextEncoder();
            const payload = JSON.stringify({
                monthlyData:          sys.monthlyData,
                analysis:             sys.analysis,
                sessionId:            sys.sessionId,
                client:               sys.client,
                nonCommissionable:    sys.nonCommissionable
            });
            const data        = encoder.encode(payload);
            const hashBuffer  = await crypto.subtle.digest('SHA-256', data);
            const hashArray   = Array.from(new Uint8Array(hashBuffer));
            sys.masterHash    = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        }

        // 5. Actualizar UI — usa sempre a versão de maior _version disponível
        if (typeof window._updatePureUI === 'function') {
            window._updatePureUI();
        } else {
            console.warn('[UNIFED-PURE] _updatePureUI não definido – UI pode não reflectir dados.');
        }

        // 6. Propagar activeForensicSession para o módulo de exportação
        window.activeForensicSession = {
            sessionId:  sys.sessionId,
            masterHash: sys.masterHash
        };
        try {
            sessionStorage.setItem('currentSession', JSON.stringify(window.activeForensicSession));
        } catch (_e) { /* sessionStorage indisponível em modo privado */ }

        console.log('[UNIFED-PURE] ✅ Dados injetados. Master Hash:', sys.masterHash);
    }

    // ── FUNÇÃO DE ACTUALIZAÇÃO DO PAINEL PURE ─────────────────────────────
    // [FIX-D] Guard de versão: só redefine se a versão actual for inferior a 2.
    // Desta forma, se script.js carregar depois e definir _version=1,
    // a versão mais completa (18 campos, _version=2) mantém-se activa.
    if (
        typeof window._updatePureUI === 'undefined' ||
        !window._updatePureUI._version ||
        window._updatePureUI._version < 2
    ) {
        window._updatePureUI = function _updatePureUI_v2() {
            const sys = window.UNIFEDSystem;
            if (!sys || !sys.analysis) return;

            // Resolver formatCurrency de forma defensiva
            const fmt = (typeof window.UNIFED_FormatCurrency === 'function')
                ? window.UNIFED_FormatCurrency
                : (typeof window.formatCurrency === 'function')
                    ? window.formatCurrency
                    : function(v) {
                        return new Intl.NumberFormat(
                            (typeof window.currentLang !== 'undefined' && window.currentLang === 'en') ? 'en-GB' : 'pt-PT',
                            { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 }
                        ).format(v || 0);
                    };

            const t  = sys.analysis.totals;
            const c  = sys.analysis.crossings;
            const nc = sys.nonCommissionable;

            // Função auxiliar de acesso seguro ao DOM
            const pure = (id) => document.getElementById(id);
            const set  = (id, val) => { const el = pure(id); if (el) el.textContent = val; };

            // ── Totais ───────────────────────────────────────────────────────
            set('pure-ganhos',          fmt(t.ganhos));
            set('pure-despesas',        fmt(t.despesas));
            set('pure-liquido',         fmt(t.ganhosLiquidos));
            set('pure-saft',            fmt(t.saftBruto   || t.bruto));
            set('pure-dac7',            fmt(t.dac7TotalPeriodo));
            set('pure-fatura',          fmt(t.faturaPlataforma));

            // ── Cruzamentos críticos ─────────────────────────────────────────
            set('pure-disc-c2',         fmt(c.discrepanciaCritica));
            set('pure-disc-c2-pct',     (c.percentagemOmissao || 0).toFixed(2) + '%');
            set('pure-disc-saft-dac7',  fmt(c.discrepanciaSaftVsDac7));
            set('pure-iva-23',          fmt(c.ivaFalta));
            set('pure-iva-6',           fmt(c.ivaFalta6));
            set('pure-irc',             fmt(c.ircEstimado));

            // ── Não sujeitos a comissão ──────────────────────────────────────
            if (nc) {
                set('pure-nc-campanhas', fmt(nc.campanhas));
                set('pure-nc-gorjetas',  fmt(nc.gorjetas));
                set('pure-nc-portagens', fmt(nc.portagens));
                set('pure-nc-total',     fmt(nc.totalNaoSujeitos));
            }

            // ── Análise Temporal Forense (ATF) ───────────────────────────────
            const persistScore = (typeof c.persistenciaScore !== 'undefined') ? c.persistenciaScore : 40;
            const atfSp = pure('pure-atf-sp');
            if (atfSp) {
                atfSp.innerHTML = persistScore + '<span style="font-size:1rem;opacity:0.6">/100</span>';
            }

            set('pure-atf-status',
                c.percentagemOmissao > 80
                    ? 'OMISSÃO SISTEMÁTICA / RISCO ELEVADO'
                    : 'OMISSÃO PONTUAL / RISCO MODERADO'
            );

            const atfTrend = pure('pure-atf-trend');
            if (atfTrend) atfTrend.innerHTML = '📉 DESCENDENTE';

            const atfOutliers = pure('pure-atf-outliers');
            if (atfOutliers) atfOutliers.innerHTML = '0 outliers > 2σ';

            const atfMeses = pure('pure-atf-meses');
            if (atfMeses) atfMeses.innerHTML = '2.º Semestre 2024 — 4 meses com dados (Set–Dez)';

            // ── Veredicto ────────────────────────────────────────────────────
            const verdictEl = pure('pure-verdict');
            if (verdictEl) {
                verdictEl.textContent = (t.ganhos > 10000) ? 'RISCO ELEVADO' : 'RISCO CRÍTICO';
            }

            const verdictPct = pure('pure-verdict-pct');
            if (verdictPct) {
                verdictPct.innerHTML = c.percentagemOmissao.toFixed(2) + '%';
            }

            // ── Hash prefix no painel ────────────────────────────────────────
            if (sys.masterHash) {
                const hashEl = pure('pure-hash-prefix-verdict');
                if (hashEl) hashEl.textContent = sys.masterHash.substring(0, 16).toUpperCase();
            }
        };

        // Marca semântica de versão para o guard de sobreposição
        window._updatePureUI._version = 2;
    }

    // ── EXPOSIÇÃO GLOBAL ──────────────────────────────────────────────────────
    // [FIX-D2] Guard de existência de UNIFEDSystem para eliminar race condition
    window.UNIFEDSystem = window.UNIFEDSystem || {};
    window.UNIFEDSystem.loadAnonymizedRealCase = _syncPureDashboard;

    // Congelar o objecto de caso real — imutabilidade forense
    window._REAL_CASE_MMLADX8Q = Object.freeze(_REAL_CASE_MMLADX8Q);

    console.info('[UNIFED-PURE] v13.5.0-PURE · Módulo de Injeção pronto (NIF unificado · FIX-D activo).');

})();
