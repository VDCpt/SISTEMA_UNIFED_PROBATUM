/**
 * ============================================================================
 * UNIFED - PROBATUM · v13.5.0-PURE · INJEÇÃO DE CASO REAL ANONIMIZADO
 * ============================================================================
 * Ficheiro      : script_injection.js
 * Versão        : 13.5.0-PURE (COM ZONA CINZENTA)
 * Sessão de ref.: UNIFED-MMLADX8Q-CV69L
 * Estado        : PRODUÇÃO (demoMode: false)
 * Conformidade  : ISO/IEC 27037:2012 · DORA (UE) 2022/2554 · Art. 125.º CPP
 * ============================================================================
 */

'use strict';

(function _pureInjectionModule() {

    // ============================================================================
    // SECÇÃO 1 — DADOS VERIFICADOS (DATA CORE + ZONA CINZENTA)
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
        },

        // ZONA CINZENTA — valores não sujeitos a comissão (extraídos dos extratos)
        nonCommissionable: {
            campanhas:    405.00,   // Ganhos da campanha (total período)
            gorjetas:      46.00,   // Gorjetas dos passageiros
            portagens:      0.15,   // Reembolso de portagens / despesas
            cancelamentos: 58.10,   // Taxas de cancelamento
            totalNaoSujeitos: 451.15 // Soma: campanhas + gorjetas + portagens
        }
    };

    // ============================================================================
    // SECÇÃO 2 — MÉTODO DE CARREGAMENTO ATÓMICO (FUSÃO, NÃO SUBSTITUIÇÃO)
    // ============================================================================
    const loadAnonymizedRealCase = async function() {
        console.log('[UNIFED-PURE] ⏳ A iniciar carregamento do Caso Real...');

        if (typeof UNIFEDSystem === 'undefined') {
            console.error('[UNIFED-PURE] ❌ UNIFEDSystem não definido. Abortando.');
            return;
        }

        // 1. Sincronizar metadados da sessão
        UNIFEDSystem.currentSession = {
            id: _REAL_CASE_MMLADX8Q.sessionId,
            isProduction: !_REAL_CASE_MMLADX8Q.demoMode
        };
        UNIFEDSystem.sessionId = _REAL_CASE_MMLADX8Q.sessionId;
        UNIFEDSystem.client = UNIFEDSystem.client || {};
        UNIFEDSystem.client.name = _REAL_CASE_MMLADX8Q.client.name;
        UNIFEDSystem.client.nif  = _REAL_CASE_MMLADX8Q.client.nif;
        UNIFEDSystem.selectedPlatform = _REAL_CASE_MMLADX8Q.client.platform;

        // 2. Garantir que UNIFEDSystem.analysis existe com as sub‑estruturas essenciais
        if (!UNIFEDSystem.analysis) {
            UNIFEDSystem.analysis = {};
        }

        // Preservar twoAxis e evidenceIntegrity se já existirem
        const preservedTwoAxis = UNIFEDSystem.analysis.twoAxis;
        const preservedEvidence = UNIFEDSystem.analysis.evidenceIntegrity;

        // Se não existirem, criar estruturas vazias (mas não sobrescrever se existirem)
        if (!preservedTwoAxis) {
            UNIFEDSystem.analysis.twoAxis = {
                revenueGap: 0,
                expenseGap: 0,
                revenueGapActive: false,
                expenseGapActive: false
            };
        }
        if (!preservedEvidence) {
            UNIFEDSystem.analysis.evidenceIntegrity = [];
        }

        // 3. Fundir os dados do caso real nas sub‑estruturas existentes
        UNIFEDSystem.analysis.totals     = Object.assign({}, UNIFEDSystem.analysis.totals,     _REAL_CASE_MMLADX8Q.analysis.totals);
        UNIFEDSystem.analysis.crossings  = Object.assign({}, UNIFEDSystem.analysis.crossings,  _REAL_CASE_MMLADX8Q.analysis.crossings);
        UNIFEDSystem.analysis.verdict    = Object.assign({}, UNIFEDSystem.analysis.verdict,    _REAL_CASE_MMLADX8Q.analysis.verdict);
        UNIFEDSystem.analysis.metadata   = Object.assign({}, UNIFEDSystem.analysis.metadata,   _REAL_CASE_MMLADX8Q.analysis.metadata);

        // Restaurar twoAxis e evidenceIntegrity (já estão preservados)
        if (preservedTwoAxis) {
            UNIFEDSystem.analysis.twoAxis = preservedTwoAxis;
        }
        if (preservedEvidence) {
            UNIFEDSystem.analysis.evidenceIntegrity = preservedEvidence;
        }

        // 4. Dados mensais (monthlyData) e auditLog
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

        // 5. ZONA CINZENTA — valores não sujeitos a comissão
        UNIFEDSystem.nonCommissionable = Object.assign({}, _REAL_CASE_MMLADX8Q.nonCommissionable);

        // 6. Configuração
        UNIFEDSystem.config = UNIFEDSystem.config || {};
        UNIFEDSystem.config.demoMode = _REAL_CASE_MMLADX8Q.demoMode;

        // 7. Garantir a função generateForensicSeal
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
                    auditLog: this.auditLog,
                    nonCommissionable: this.nonCommissionable
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

        // 8. Calcular hash dinâmico
        await UNIFEDSystem.generateForensicSeal();

        // 9. Sincronizar UI
        _syncPureDashboard();

        // 10. Log de confirmação
        console.log('[UNIFED-PURE] ✅ Dados injetados:');
        console.log('   - totals.ganhos:', UNIFEDSystem.analysis.totals.ganhos);
        console.log('   - totals.despesas:', UNIFEDSystem.analysis.totals.despesas);
        console.log('   - crossings.discrepanciaCritica:', UNIFEDSystem.analysis.crossings.discrepanciaCritica);
        console.log('   - nonCommissionable.campanhas:', UNIFEDSystem.nonCommissionable.campanhas);
        console.log('   - nonCommissionable.gorjetas:', UNIFEDSystem.nonCommissionable.gorjetas);
        console.log('   - masterHash:', UNIFEDSystem.masterHash);
    };

    // ============================================================================
    // SECÇÃO 3 — SINCRONIZAÇÃO DE UI (DASHBOARD PURE + ZONA CINZENTA)
    // ============================================================================
    const _syncPureDashboard = function() {
        const sys = window.UNIFEDSystem;
        if (!sys || !sys.analysis) {
            console.warn('[UNIFED-PURE] ⚠ sys.analysis não disponível para sincronização UI.');
            return;
        }

        const totals = sys.analysis.totals || {};
        const crossings = sys.analysis.crossings || {};
        const verdict = sys.analysis.verdict || {};
        const nc = sys.nonCommissionable || {};

        const elements = {
            // Metadados e veredicto
            'pure-session-id': sys.sessionId || '',
            'pure-client-name': sys.client?.name || '',
            'pure-client-nif': sys.client?.nif || '',
            'pure-hash-prefix': (sys.masterHash || '').substring(0, 8) + '...',
            'pure-hash-prefix-verdict': (sys.masterHash || '').substring(0, 8) + '...',
            'pure-verdict-value': (verdict.level?.pt || verdict.level?.en || 'N/A'),
            'pure-verdict-pct': (verdict.percent || '0.00%'),
            'pure-total-omission': _fmtEur(crossings.discrepanciaCritica || 0),

            // Painel I – Reconstituição financeira
            'pure-ganhos': _fmtEur(totals.ganhos),
            'pure-despesas': _fmtEur(totals.despesas),
            'pure-liquido': _fmtEur(totals.ganhosLiquidos),
            'pure-saft': _fmtEur(totals.bruto),
            'pure-dac7': _fmtEur(totals.dac7TotalPeriodo),
            'pure-fatura': _fmtEur(totals.faturaPlataforma),

            // Painel II – Discrepâncias
            'pure-disc-c2': _fmtEur(crossings.discrepanciaCritica),
            'pure-disc-c2-pct': (crossings.percentagemOmissao || 0).toFixed(2) + '%',
            'pure-disc-saft-dac7': _fmtEur(crossings.discrepanciaSaftVsDac7),
            'pure-disc-saft-pct': (crossings.percentagemSaftVsDac7 || 0).toFixed(2) + '%',
            'pure-iva-23': _fmtEur(crossings.ivaFalta),
            'pure-iva-6': _fmtEur(crossings.ivaFalta6),
            'pure-irc': _fmtEur(crossings.ircEstimado),
            'pure-sg2-btor-val': _fmtEur(totals.despesas),
            'pure-sg2-btf-val': _fmtEur(totals.faturaPlataforma),
            'pure-sg1-saft-val': _fmtEur(totals.bruto),
            'pure-sg1-dac7-val': _fmtEur(totals.dac7TotalPeriodo),

            // Painel IV – ZONA CINZENTA
            'pure-nc-campanhas': _fmtEur(nc.campanhas || 0),
            'pure-nc-gorjetas': _fmtEur(nc.gorjetas || 0),
            'pure-nc-portagens': _fmtEur(nc.portagens || 0),
            'pure-nc-cancelamentos': _fmtEur(nc.cancelamentos || 0),
            'pure-nc-total': _fmtEur(nc.totalNaoSujeitos || 0),

            // Valor textual de suporte (exibido no parágrafo)
            'pure-zc-amount': _fmtEur(nc.totalNaoSujeitos || 0)
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

        // Atualizar o Score de Persistência no painel (se houver ATF)
        if (typeof window.computeTemporalAnalysis === 'function') {
            const atf = window.computeTemporalAnalysis(sys.monthlyData || {}, sys.analysis);
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

        console.log('[UNIFED-PURE] ✅ Painel sincronizado (inclui zona cinzenta).');
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
                auditLog: this.auditLog,
                nonCommissionable: this.nonCommissionable
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

    console.info('[UNIFED-PURE] v13.5.0-PURE · Módulo de Injeção de Dados com Hashing Dinâmico e Zona Cinzenta Carregado.');

})();