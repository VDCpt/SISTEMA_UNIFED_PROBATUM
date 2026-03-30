/**
 * ============================================================================
 * UNIFED - PROBATUM · v13.5.0-PURE · INJEÇÃO DE CASO REAL ANONIMIZADO
 * ============================================================================
 * Ficheiro      : script_injection.js
 * Versão        : 13.5.0-PURE (FUSÃO ATÓMICA)
 * Sessão de ref.: UNIFED-MMLADX8Q-CV69L
 * Estado        : PRODUÇÃO (demoMode: false)
 * Conformidade  : ISO/IEC 27037:2012 · DORA (UE) 2022/2554 · Art. 125.º CPP
 * ============================================================================
 */

'use strict';

(function _pureInjectionModule() {

    // ============================================================================
    // SECÇÃO 1 — DADOS VERIFICADOS (DATA CORE)
    // ============================================================================
    const _REAL_CASE_MMLADX8Q = {
        sessionId:  "UNIFED-MMLADX8Q-CV69L",
        version:    "v13.5.0-PURE",
        timestamp:  "2026-03-30T18:15:48.314Z",
        demoMode:   false,
        
        client: {
            name: "SUJEITO PASSIVO ALFA (ANONIMIZADO)",
            nif:  "123456789",
            platform: "Plataforma A"
        },

        // Dados Financeiros Consolidados (Read-Only)
        analysis: {
            totals: {
                bruto:      10157.73,
                iliquido:   9582.76,
                iva:        574.97,
                ganhos:     10157.73,
                despesas:   2447.89,
                ganhosLiquidos: 7709.84,
                faturaPlataforma: 262.94,
                dac7TotalPeriodo: 7755.16
            },
            crossings: {
                discrepanciaCritica: 2184.95,
                percentagemOmissao: 89.26,
                discrepanciaSaftVsDac7: 2402.57,
                percentagemSaftVsDac7: 23.65,
                ivaFalta: 502.54,
                ivaFalta6: 131.10,
                ircEstimado: 458.84
            },
            verdict: { level: { pt: "RISCO ELEVADO", en: "HIGH RISK" }, key: "high", color: "#EF4444", percent: "89.26%" },
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
        }
    };

    // ============================================================================
    // SECÇÃO 2 — MÉTODO DE CARREGAMENTO ATÓMICO (FUSÃO, NÃO SUBSTITUIÇÃO)
    // ============================================================================
    const loadAnonymizedRealCase = async function() {
        if (typeof UNIFEDSystem === 'undefined') {
            console.error('[UNIFED-PURE] Erro Crítico: Core System não detectado.');
            return;
        }

        console.info('[UNIFED-PURE] A iniciar sincronização de Caso Real: ' + _REAL_CASE_MMLADX8Q.sessionId);

        // Sincronização de estado
        UNIFEDSystem.currentSession = {
            id: _REAL_CASE_MMLADX8Q.sessionId,
            isProduction: !_REAL_CASE_MMLADX8Q.demoMode
        };

        // GARANTIR que UNIFEDSystem.analysis existe com as estruturas mínimas
        if (!UNIFEDSystem.analysis) {
            UNIFEDSystem.analysis = {};
        }

        // Preservar twoAxis e evidenceIntegrity se já existirem (importante)
        const preservedTwoAxis = UNIFEDSystem.analysis.twoAxis;
        const preservedEvidence = UNIFEDSystem.analysis.evidenceIntegrity;

        // Fundir os dados do caso real nas sub‑estruturas existentes
        UNIFEDSystem.analysis.totals     = Object.assign({}, UNIFEDSystem.analysis.totals,     _REAL_CASE_MMLADX8Q.analysis.totals);
        UNIFEDSystem.analysis.crossings  = Object.assign({}, UNIFEDSystem.analysis.crossings,  _REAL_CASE_MMLADX8Q.analysis.crossings);
        UNIFEDSystem.analysis.verdict    = Object.assign({}, UNIFEDSystem.analysis.verdict,    _REAL_CASE_MMLADX8Q.analysis.verdict);
        UNIFEDSystem.analysis.metadata   = Object.assign({}, UNIFEDSystem.analysis.metadata,   _REAL_CASE_MMLADX8Q.analysis.metadata);

        // Restaurar twoAxis e evidenceIntegrity se existiam (ou criar defaults)
        if (preservedTwoAxis) {
            UNIFEDSystem.analysis.twoAxis = preservedTwoAxis;
        } else {
            // Cria o objeto padrão caso não exista
            UNIFEDSystem.analysis.twoAxis = {
                revenueGap: 0,
                expenseGap: 0,
                revenueGapActive: false,
                expenseGapActive: false
            };
        }

        if (preservedEvidence) {
            UNIFEDSystem.analysis.evidenceIntegrity = preservedEvidence;
        } else {
            UNIFEDSystem.analysis.evidenceIntegrity = [];
        }

        // Dados mensais (monthlyData) e auditLog
        if (_REAL_CASE_MMLADX8Q.analysis.metadata.monthlyData) {
            UNIFEDSystem.monthlyData = {};
            _REAL_CASE_MMLADX8Q.analysis.metadata.monthlyData.forEach(m => {
                UNIFEDSystem.monthlyData[m.month] = {
                    ganhos: m.ganhos,
                    despesas: m.despesas,
                    ganhosLiq: m.ganhos - m.despesas
                };
            });
        }
        UNIFEDSystem.auditLog = _REAL_CASE_MMLADX8Q.analysis.metadata.auditLog || [];

        // Configuração
        UNIFEDSystem.config = UNIFEDSystem.config || {};
        UNIFEDSystem.config.demoMode = _REAL_CASE_MMLADX8Q.demoMode;

        // Garantir a função generateForensicSeal (se ainda não existir)
        if (typeof UNIFEDSystem.generateForensicSeal !== 'function') {
            UNIFEDSystem.generateForensicSeal = async function() {
                const encoder = new TextEncoder();
                const payload = JSON.stringify({
                    monthlyData: this.monthlyData,
                    analysis: this.analysis,
                    sessionId: this.sessionId,
                    version: this.version,
                    client: this.client,
                    selectedYear: this.selectedYear,
                    selectedPeriodo: this.selectedPeriodo,
                    selectedPlatform: this.selectedPlatform,
                    auditLog: this.auditLog
                });
                const data = encoder.encode(payload);
                const hashBuffer = await crypto.subtle.digest('SHA-256', data);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                this.masterHash = hashHex;
                window.activeForensicSession = window.activeForensicSession || {};
                window.activeForensicSession.masterHash = hashHex;
                try {
                    sessionStorage.setItem('currentSession', JSON.stringify({
                        sessionId: this.sessionId,
                        masterHash: hashHex
                    }));
                } catch (_) {}
                return hashHex;
            };
        }

        // Calcular hash dinâmico
        await UNIFEDSystem.generateForensicSeal();

        // Sincronizar UI
        _syncPureDashboard();

        console.info('[UNIFED-PURE] Sincronização concluída. Master Hash gerado dinamicamente:', UNIFEDSystem.masterHash);
    };

    // ============================================================================
    // SECÇÃO 3 — SINCRONIZAÇÃO DE UI (DASHBOARD PURE)
    // ============================================================================
    const _syncPureDashboard = function() {
        const sys = window.UNIFEDSystem;
        if (!sys || !sys.analysis) return;

        const totals = sys.analysis.totals || {};
        const crossings = sys.analysis.crossings || {};
        const verdict = sys.analysis.verdict || {};

        const elements = {
            'pure-session-id': sys.sessionId || '',
            'pure-client-name': sys.client?.name || '',
            'pure-client-nif': sys.client?.nif || '',
            'pure-hash-prefix': (sys.masterHash || '').substring(0, 8) + '...',
            'pure-hash-prefix-verdict': (sys.masterHash || '').substring(0, 8) + '...',
            'pure-verdict-value': (verdict.level?.pt || verdict.level?.en || 'N/A'),
            'pure-verdict-pct': (verdict.percent || '0.00%'),
            'pure-total-omission': _fmtEur(crossings.discrepanciaCritica || 0)
        };

        for (const [id, value] of Object.entries(elements)) {
            const el = document.getElementById(id);
            if (el) {
                el.textContent = value;
                if (id === 'pure-verdict-value') {
                    el.style.color = verdict.color || '#EF4444';
                }
            }
        }

        // Atualização da flag visual de modo de operação
        const modeIndicator = document.querySelector('.pure-mode-indicator');
        if (modeIndicator) {
            modeIndicator.textContent = 'MODO PERICIAL ATIVO';
            modeIndicator.style.background = 'rgba(239, 68, 68, 0.1)';
            modeIndicator.style.color = '#EF4444';
        }
    };

    function _fmtEur(v) {
        const lang = (typeof window.currentLang !== 'undefined') ? window.currentLang : 'pt';
        const locale = lang === 'en' ? 'en-GB' : 'pt-PT';
        return new Intl.NumberFormat(locale, {
            style: 'currency', currency: 'EUR',
            minimumFractionDigits: 2, maximumFractionDigits: 2
        }).format(v || 0);
    }

    // ============================================================================
    // SECÇÃO 4 — PERSISTÊNCIA DE SESSÃO
    // ============================================================================
    if (typeof window.activeForensicSession === 'undefined') {
        window.activeForensicSession = {
            sessionId:  _REAL_CASE_MMLADX8Q.sessionId,
            masterHash: ''
        };
    }

    // ============================================================================
    // SECÇÃO 5 — EXPOSIÇÃO GLOBAL E BOOTSTRAP
    // ============================================================================
    window.UNIFEDSystem = window.UNIFEDSystem || {};
    window.UNIFEDSystem.loadAnonymizedRealCase = loadAnonymizedRealCase;
    if (typeof window.UNIFEDSystem.generateForensicSeal !== 'function') {
        window.UNIFEDSystem.generateForensicSeal = async function() {
            const encoder = new TextEncoder();
            const payload = JSON.stringify({
                monthlyData: this.monthlyData,
                analysis: this.analysis,
                sessionId: this.sessionId,
                version: this.version,
                client: this.client,
                selectedYear: this.selectedYear,
                selectedPeriodo: this.selectedPeriodo,
                selectedPlatform: this.selectedPlatform,
                auditLog: this.auditLog
            });
            const data = encoder.encode(payload);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            this.masterHash = hashHex;
            window.activeForensicSession = window.activeForensicSession || {};
            window.activeForensicSession.masterHash = hashHex;
            try {
                sessionStorage.setItem('currentSession', JSON.stringify({
                    sessionId: this.sessionId,
                    masterHash: hashHex
                }));
            } catch (_) {}
            return hashHex;
        };
    }

    window._REAL_CASE_MMLADX8Q = Object.freeze(_REAL_CASE_MMLADX8Q);
    window._syncPureDashboard = _syncPureDashboard;

    console.info('[UNIFED-PURE] v13.5.0-PURE · Módulo de Injeção de Dados com Hashing Dinâmico Carregado.');

})();