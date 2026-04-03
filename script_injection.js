/**
 * UNIFED - PROBATUM · SCRIPT INJECTION · v13.11.3-PURE
 * Sincronização do dashboard PURE e renderização da Matriz de Triangulação.
 * Padrão: injeção inside #pureDashboard · anti-duplicação por ID · Read-Only.
 */

'use strict';

function _syncPureDashboard() {
    console.log('🔬 [UNIFED-PURE] A sincronizar verdade material...');

    // Dados mestres extraídos da última sessão validada
    const masterData = {
        'pure-ganhos-extrato':   '10.157,73 €',
        'pure-despesas-extrato': '2.447,89 €',
        'pure-saft-bruto-val':   '8.227,97 €',
        'pure-dac7-val':         '7.755,16 €',
        'pure-iva-6-omitido':    '131,10 €',
        'pure-iva-23-omitido':   '502,54 €',
        'pure-asfixia-val':      '493,68 €',
        'pure-nc-total-geral':   '451,15 €'
    };

    // Aplicação de valores aos elementos do DOM
    Object.entries(masterData).forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    });

    _renderTriangulationMatrix();
}

function _renderTriangulationMatrix() {
    // Anti-duplicação: verificar se contentor já existe
    if (document.getElementById('triangulationMatrixContainer')) return;

    const matrixHtml = `
        <div id="triangulationMatrixContainer">
            <h3 style="color:#00E5FF; margin-bottom:15px;">📐 Matriz de Triangulação (Prova Rainha)</h3>
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
                        <td>---</td>
                        <td>1.929,76 €</td>
                    </tr>
                    <tr>
                        <td>💰 Ganhos Brutos</td>
                        <td>10.157,73 €</td>
                        <td>1.929,76 €</td>
                        <td>---</td>
                    </tr>
                </tbody>
            </table>
            <div style="margin-top:15px; font-size:0.8rem; color:#EF4444;">
                <strong>📢 Evidência:</strong> Discrepância de 2.402,57 € detetada entre DAC7 e Ganhos Brutos.
            </div>
        </div>
    `;

    const container = document.createElement('div');
    container.innerHTML = matrixHtml;

    // CORREÇÃO: Injetar DENTRO do dashboard, antes do rodapé, para manter o fundo dark
    const dashboard = document.getElementById('pureDashboard');
    if (dashboard) {
        dashboard.appendChild(container.firstChild);
    }
}

// Auto-inicialização: aguardar DOM pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _syncPureDashboard);
} else {
    _syncPureDashboard();
}
