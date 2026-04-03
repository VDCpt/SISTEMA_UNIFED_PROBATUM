/**
 * UNIFED - PROBATUM · v13.5.0-PURE · DATA INJECTION ENGINE
 * ============================================================================
 * Integridade: SHA-256 Validada para Caso Real Anonimizado
 * Padrão:      Write-Only sobre DOM — NÃO altera UNIFEDSystem.analysis
 * Dependência: Carregado APÓS script.js e enrichment.js (vide index.html)
 * ============================================================================
 */
'use strict';

window.UNIFEDSystem = window.UNIFEDSystem || {};

// ---------------------------------------------------------------------------
// Dados mestres do caso real anonimizado — 2.º Semestre 2024
// ---------------------------------------------------------------------------
const REAL_CASE_DATA = {
    ganhosExtrato:     '10.157,73 €',
    despesasExtrato:   '2.447,89 €',
    saftBruto:         '8.227,97 €',
    dac7Total:         '7.755,16 €',
    iva6Omitido:       '131,10 €',
    iva23Omitido:      '502,54 €',
    asfixiaFinanceira: '493,68 €',
    naoSujeitos:       '451,15 €'
};

// ---------------------------------------------------------------------------
// Mapeamento ID-DOM → valor
// ---------------------------------------------------------------------------
function _syncPureDashboard() {
    console.log('🔬 [UNIFED-PURE] Sincronização de Verdade Material iniciada...');

    const mappings = {
        'pure-ganhos-extrato':   REAL_CASE_DATA.ganhosExtrato,
        'pure-despesas-extrato': REAL_CASE_DATA.despesasExtrato,
        'pure-saft-bruto-val':   REAL_CASE_DATA.saftBruto,
        'pure-dac7-val':         REAL_CASE_DATA.dac7Total,
        'pure-iva-6-omitido':    REAL_CASE_DATA.iva6Omitido,
        'pure-iva-23-omitido':   REAL_CASE_DATA.iva23Omitido,
        'pure-asfixia-val':      REAL_CASE_DATA.asfixiaFinanceira,
        'pure-nc-total-geral':   REAL_CASE_DATA.naoSujeitos
    };

    Object.entries(mappings).forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = val;
        } else {
            console.warn('[UNIFED-PURE] Elemento não encontrado no DOM: #' + id);
        }
    });

    _renderTriangulationMatrix();
}

// ---------------------------------------------------------------------------
// Matriz de Triangulação — Prova Rainha
// Anti-duplicação por verificação de ID antes de injecção
// ---------------------------------------------------------------------------
function _renderTriangulationMatrix() {
    if (document.getElementById('triangulationMatrixContainer')) return;

    const matrixHtml = `
        <div id="triangulationMatrixContainer">
            <h3 style="color:#00E5FF; margin-bottom:15px; font-family:'Inter',system-ui,sans-serif;">
                📐 Matriz de Triangulação (Prova Rainha)
            </h3>
            <table>
                <thead>
                    <tr>
                        <th>Fonte</th>
                        <th>Valor</th>
                        <th>Δ vs SAF-T</th>
                        <th>Δ vs Ganhos</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>📄 SAF-T</td>
                        <td>8.227,97 €</td>
                        <td style="color:#64748b;">---</td>
                        <td style="color:#EF4444;">1.929,76 €</td>
                    </tr>
                    <tr>
                        <td>📊 DAC7</td>
                        <td>7.755,16 €</td>
                        <td style="color:#F59E0B;">−472,81 €</td>
                        <td style="color:#EF4444;">2.402,57 €</td>
                    </tr>
                    <tr>
                        <td>💰 Ganhos Brutos</td>
                        <td>10.157,73 €</td>
                        <td style="color:#EF4444;">1.929,76 €</td>
                        <td style="color:#64748b;">---</td>
                    </tr>
                </tbody>
            </table>
            <div style="margin-top:15px; font-size:0.85rem; color:#EF4444; font-weight:bold;">
                📢 EVIDÊNCIA CRÍTICA: Desvio de 2.402,57 € detetado entre DAC7 e Ganhos Reais
                · Desvio de 472,81 € entre SAF-T e DAC7.
            </div>
        </div>
    `;

    const dashboard = document.getElementById('pureDashboard');
    if (dashboard) {
        const div = document.createElement('div');
        div.innerHTML = matrixHtml;
        dashboard.appendChild(div.firstChild);
        console.log('✅ [UNIFED-PURE] Matriz de Triangulação injectada em #pureDashboard.');
    } else {
        console.warn('[UNIFED-PURE] #pureDashboard não encontrado — Matriz de Triangulação não renderizada.');
    }
}

// ---------------------------------------------------------------------------
// Auto-inicialização segura
// ---------------------------------------------------------------------------
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _syncPureDashboard);
} else {
    _syncPureDashboard();
}

// Exposição global para chamada manual a partir de index.html
window.UNIFEDSystem.loadAnonymizedRealCase = _syncPureDashboard;
