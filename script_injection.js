/**
 * ============================================================================
 * UNIFED - PROBATUM · v13.5.0-PURE · INJEÇÃO DE CASO REAL ANONIMIZADO
 * ============================================================================
 * Ficheiro      : script_injection.js
 * Versão        : 13.5.0-PURE (CONSOLIDADA - RETIFICADA)
 * Sessão de ref.: UNIFED-MMLADX8Q-CV69L
 * Estado        : PRODUÇÃO (demoMode: false)
 * Conformidade  : ISO/IEC 27037:2012 · DORA (UE) 2022/2554 · Art. 125.º CPP
 * ============================================================================
 */

'use strict';

(function _pureInjectionModule() {

    // ============================================================================
    // SECÇÃO 1 — DADOS VERIFICADOS (DATA CORE)
    // Extraídos do JSON UNIFED-MMLADX8Q-CV69L para Reconstituição Material
    // ============================================================================
    const _REAL_CASE_MMLADX8Q = {
        sessionId:  "UNIFED-MMLADX8Q-CV69L",
        masterHash: "5150e7674b891d5d07ca990e4c7124fc66af40488452759aeebdf84976eaa8f6",
        version:    "v13.5.0-PURE",
        timestamp:  "2026-03-30T18:15:48.314Z",
        demoMode:   false, // [RETIFICAÇÃO: Boolean State Hardening aplicado para produção]
        
        client: {
            name: "SUJEITO PASSIVO ALFA (ANONIMIZADO)",
            nif:  "123456789",
            platform: "Plataforma A"
        },

        // Dados Financeiros Consolidados (Read-Only para o Dashboard)
        analysis: {
            totalGross: 86450.75,
            totalNet:   64838.06,
            totalTax:   21612.69,
            discrepancy: 14230.15,
            riskScore:  89.26,
            verdict:    "RISCO ELEVADO"
        },

        // Reconstituição de Série Temporal para o Motor ATF (6 Meses)
        monthlyData: [
            { month: "Jan", gross: 12450.00, net: 9337.50, tax: 3112.50, discrepancy: 1200.40 },
            { month: "Fev", gross: 13800.50, net: 10350.38, tax: 3450.12, discrepancy: 2150.80 },
            { month: "Mar", gross: 15200.25, net: 11400.19, tax: 3800.06, discrepancy: 4500.10 },
            { month: "Abr", gross: 14100.00, net: 10575.00, tax: 3525.00, discrepancy: 1800.35 },
            { month: "Mai", gross: 16900.00, net: 12675.00, tax: 4225.00, discrepancy: 3200.50 },
            { month: "Jun", gross: 14000.00, net: 10500.00, tax: 3500.00, discrepancy: 1378.00 }
        ]
    };

    // ============================================================================
    // SECÇÃO 2 — MÉTODO DE CARREGAMENTO ATÓMICO
    // Injeta os dados no UNIFEDSystem sem comprometer fórmulas de cálculo
    // ============================================================================
    const loadAnonymizedRealCase = function() {
        if (typeof UNIFEDSystem === 'undefined') {
            console.error('[UNIFED-PURE] Erro Crítico: Core System não detectado.');
            return;
        }

        console.info('[UNIFED-PURE] A iniciar sincronização de Caso Real: ' + _REAL_CASE_MMLADX8Q.sessionId);

        // Bloqueio de mutabilidade e sincronização de estado
        UNIFEDSystem.currentSession = {
            id: _REAL_CASE_MMLADX8Q.sessionId,
            hash: _REAL_CASE_MMLADX8Q.masterHash,
            isProduction: !_REAL_CASE_MMLADX8Q.demoMode
        };

        // Transferência de valores para o motor de análise
        UNIFEDSystem.analysis = Object.assign({}, _REAL_CASE_MMLADX8Q.analysis);
        UNIFEDSystem.monthlyData = JSON.parse(JSON.stringify(_REAL_CASE_MMLADX8Q.monthlyData));

        // Atualização dos metadados de sistema
        UNIFEDSystem.config = UNIFEDSystem.config || {};
        UNIFEDSystem.config.demoMode = _REAL_CASE_MMLADX8Q.demoMode;
        UNIFEDSystem.config.activeHash = _REAL_CASE_MMLADX8Q.masterHash;

        // Disparar sincronização visual
        _syncPureDashboard();
        
        console.info('[UNIFED-PURE] Sincronização concluída. Master Hash vinculado.');
    };

    // ============================================================================
    // SECÇÃO 3 — SINCRONIZAÇÃO DE UI (DASHBOARD PURE)
    // Atualiza os elementos visuais com os dados do caso real
    // ============================================================================
    const _syncPureDashboard = function() {
        const elements = {
            'pure-session-id': _REAL_CASE_MMLADX8Q.sessionId,
            'pure-client-name': _REAL_CASE_MMLADX8Q.client.name,
            'pure-client-nif': _REAL_CASE_MMLADX8Q.client.nif,
            'pure-hash-prefix': _REAL_CASE_MMLADX8Q.masterHash.substring(0, 8) + '...',
            'pure-hash-prefix-verdict': _REAL_CASE_MMLADX8Q.masterHash.substring(0, 8) + '...',
            'pure-verdict-value': _REAL_CASE_MMLADX8Q.analysis.verdict,
            'pure-verdict-pct': _REAL_CASE_MMLADX8Q.analysis.riskScore + '%'
        };

        for (const [id, value] of Object.entries(elements)) {
            const el = document.getElementById(id);
            if (el) {
                el.textContent = value;
                if (id === 'pure-verdict-value') {
                    el.style.color = '#EF4444'; // Cor de alerta forense
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

    // ============================================================================
    // SECÇÃO 4 — PERSISTÊNCIA DE SESSÃO
    // ============================================================================
    if (typeof window.activeForensicSession === 'undefined') {
        window.activeForensicSession = {
            sessionId:  _REAL_CASE_MMLADX8Q.sessionId,
            masterHash: _REAL_CASE_MMLADX8Q.masterHash
        };
        
        try {
            sessionStorage.setItem('currentSession', JSON.stringify(window.activeForensicSession));
        } catch (e) {
            console.warn('[UNIFED-PURE] SessionStorage não disponível.');
        }
    }

    // ============================================================================
    // SECÇÃO 5 — EXPOSIÇÃO GLOBAL E BOOTSTRAP
    // ============================================================================
    window.UNIFEDSystem = window.UNIFEDSystem || {};
    window.UNIFEDSystem.loadAnonymizedRealCase = loadAnonymizedRealCase;
    
    // Referências estáticas para auditoria
    window._REAL_CASE_MMLADX8Q = Object.freeze(_REAL_CASE_MMLADX8Q);
    window._syncPureDashboard   = _syncPureDashboard;

    console.info('[UNIFED-PURE] v13.5.0-PURE · Módulo de Injeção de Dados Retificado e Carregado.');

})();