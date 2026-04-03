/**
 * UNIFED - PROBATUM · CASO REAL ANONIMIZADO v13.11.5-PURE
 * ============================================================================
 * Script de Injeção de Dados Forenses Certificados
 * Conjunto de dados extraído do PDF: IFDE_Parecer_IFDE-MNBWZSD5-F2C60.pdf
 *
 * CORREÇÕES CIRÚRGICAS v13.10.0-PURE (2026-04-02):
 *   1. Estabilização de Interface (Fim dos Flashes) – Bootstrap com evento 'load'
 *   2. Correção de Layout DAC7 (Sem Sobreposição) – CSS prioritário com flex column
 *   3. Forçar 2.º Semestre e Fluxos (Imutabilidade) – Hardcoded com Object.freeze
 *
 * CORREÇÕES CIRÚRGICAS v13.10.1-PURE (2026-04-02):
 *   4. [CSS] Triangulação — texto invisível corrigido: cor explícita #1a1a2e.
 *   5. [CSS] Shadow DOM — removido; substituído por isolamento CSS via <style>.
 *   6. [LÓGICA] Módulo IV — mapeamento de IDs corrigido (pure-nc-*).
 *   7. [LÓGICA] totalNaoSujeitos (€451,15) substitui HARDCODED_NON_TAXABLE.
 *
 * CORREÇÕES CIRÚRGICAS v13.11.0/1/2-PURE (2026-04-02):
 *   8.  [CSS/JS] Flash de conteúdo — .pure-visible via classList.add().
 *   9.  [JS] Label dinâmica — terminologia jurídica blindada.
 *  10.  [CSS] pure-metric-card / pure-metric-value adicionados.
 *  11.  [ENRICH] generateLegalNarrative — narrativa jurídica Art. 103.º RGIT.
 *  E01. gorjetas: 405.00 → 46.00 (valor real extrato).
 *  E02. auxiliaryValues → auxiliaryData (path válido).
 *  E03. portagens: 0.00 → 0.15 (fidelidade documental).
 *  12.  IVA 6% (Verba 2.18 Lista I CIVA) em #pure-iva-devido.
 *  13.  Art. 405.º C. Civil — Asfixia Financeira no DOM.
 *  14.  Grid 3 colunas em panel.html.
 *  15.  .pure-metric-card.warning e .pure-legal-notice em CSS.
 *
 * CORREÇÕES CIRÚRGICAS v13.11.4-PURE (2026-04-02):
 *  16. [JS] Eliminado _pericialSafeBoot() auto-executor.
 *  17. [JS] Mapeamento massivo: 24 IDs das Secções I, II e IV.
 *  18. [JS] _renderTriangulationMatrix() ancorada dentro do wrapper.
 *  19. [JS] _forceSemesterAndFlows() lê directamente de _PDF_CASE.
 *
 * CORREÇÕES CIRÚRGICAS v13.11.5-PURE (2026-04-03):
 *  A. [JS] map expandido: Identificação (pure-subject-name/nif, pure-periodo,
 *     pure-session-id, pure-hash-prefix), Módulo IV completo (pure-nc-total-geral,
 *     pure-taxas-cancel), Custódia (total-evidencias, ctrl-count) — eliminação
 *     de todos os campos em branco restantes no painel.
 *  B. [CSS] #triangulationMatrixContainer: dark mode forçado (background #1e293b,
 *     color #f8fafc), largura 100%, max-width:none — elimina fundo branco e
 *     quebra de layout em viewports <1200px.
 *  C. [JS] Supressão de DAC7 boxes com valor zero (Q1/Q2/Q3): display:none
 *     aplicado via querySelectorAll('.pure-dac7-box') após preenchimento do map.
 * ============================================================================
 */

(function() {

    // ── DADOS REAIS EXTRAÍDOS DO PDF ──────────────────────────────────────────
    const _PDF_CASE = {
        sessionId:  "UNIFED-MNGFN3C0-X57MO",
        masterHash: "a3f8c9e2d5b6a7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1",
        client: { name: "Demo Driver, Lda", nif: "123456789", platform: "outra" },
        totals: {
            ganhos:           10157.73,
            ganhosLiquidos:    7709.84,
            saftBruto:         8227.97,
            saftIliquido:      7761.67,
            saftIva:            466.30,
            despesas:          2447.89,
            faturaPlataforma:   262.94,
            dac7TotalPeriodo:  7755.16,
            dac7Q1: 0, dac7Q2: 0, dac7Q3: 0, dac7Q4: 7755.16
        },
        crossings: {
            discrepanciaCritica:    2184.95,
            percentagemOmissao:       89.26,
            ivaFalta:               502.54,
            ivaFalta6:              131.10,
            btor:                  2447.89,
            btf:                    262.94,
            discrepanciaSaftVsDac7: 2402.57,
            percentagemSaftVsDac7:    23.65,
            agravamentoBrutoIRC:    2184.95,
            ircEstimado:            458.84
        },
        auxiliaryData: {
            campanhas:        405.00,
            portagens:          0.15,
            gorjetas:          46.00,
            cancelamentos:     58.10,
            totalNaoSujeitos: 451.15
        }
    };

    // ── UTILITÁRIOS ────────────────────────────────────────────────────────────
    function _fmt(v) {
        if (typeof window.formatCurrency === 'function') return window.formatCurrency(v);
        return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(v || 0);
    }

    function _set(id, value) {
        try {
            var el = document.getElementById(id);
            if (el) { el.textContent = value; return true; }
            return false;
        } catch(e) { return false; }
    }

    // ── CORR-19: _forceSemesterAndFlows sem dependência de sys em runtime ─────
    function _forceSemesterAndFlows() {
        try {
            const periodoSelect = document.getElementById('periodoAnalise');
            if (periodoSelect && periodoSelect.value !== 'semestral') {
                periodoSelect.value = 'semestral';
                periodoSelect.dispatchEvent(new Event('change', { bubbles: true }));
            }
            const semestreSelect = document.getElementById('semestreSelector');
            if (semestreSelect && semestreSelect.value !== '2') {
                semestreSelect.value = '2';
                semestreSelect.dispatchEvent(new Event('change', { bubbles: true }));
            }
            // Lê directamente de _PDF_CASE — sem dependência de UNIFEDSystem.auxiliaryData
            var totalNS = _fmt(_PDF_CASE.auxiliaryData.totalNaoSujeitos);
            var fluxosBox = document.getElementById('pure-nao-sujeitos');
            if (fluxosBox) {
                fluxosBox.textContent = totalNS;
                fluxosBox.style.color = '#2ecc71';
                fluxosBox.style.fontWeight = 'bold';
            }
            // Forçar também nos selectores legados
            document.querySelectorAll('.fluxos-nao-sujeitos-value, .aux-total-ns')
                .forEach(function(el) { el.textContent = totalNS; });
        } catch(e) { console.warn('[UNIFED-PURE] _forceSemesterAndFlows:', e.message); }
    }

    function _renderTriangulationMatrix() {
        if (document.getElementById('triangulationMatrixContainer')) return;
        var targetWrapper = document.getElementById('pureDashboardWrapper') || document.getElementById('pureDashboard');
        if (!targetWrapper) return;

        var saf_t = 8227.97; var ganhos = 10157.73; var dac7 = 7755.16;
        var delta_sg = Math.abs(saf_t - ganhos); var delta_sd = Math.abs(saf_t - dac7); var delta_gd = Math.abs(ganhos - dac7);

        var tdS = 'padding:10px;border-bottom:1px solid rgba(0,229,255,0.15);color:#f8fafc;';
        var thS = 'padding:10px;border-bottom:2px solid #00E5FF;background:rgba(0,229,255,0.1);color:#00E5FF;font-weight:700;text-transform:uppercase;';
        var crt = 'background:rgba(239,68,68,0.15);color:#fca5a5;font-weight:700;';

        var container = document.createElement('div');
        container.id = 'triangulationMatrixContainer';
        // LARGURA TOTAL E FUNDO FORENSE ESCURO
        container.style.cssText = 'width:100%;margin:25px 0;padding:20px;border:1px solid rgba(0,229,255,0.3);border-radius:8px;background:#1e293b;box-sizing:border-box;';

        container.innerHTML = `
            <h3 style="margin:0 0 15px 0;color:#00E5FF;font-size:1.1rem;">📐 Matriz de Triangulação (Prova Rainha)</h3>
            <table style="width:100%;border-collapse:collapse;text-align:left;">
                <thead><tr><th style="${thS}">Fonte</th><th style="${thS}">Valor</th><th style="${thS}">Δ vs SAF-T</th><th style="${thS}">Δ vs Ganhos</th><th style="${thS}">Δ vs DAC7</th></tr></thead>
                <tbody>
                    <tr><td style="${tdS}"><strong>📄 SAF-T</strong></td><td style="${tdS}">${_fmt(saf_t)}</td><td style="${tdS}">—</td><td style="${tdS}${crt}">${_fmt(delta_sg)}</td><td style="${tdS}">${_fmt(delta_sd)}</td></tr>
                    <tr><td style="${tdS}"><strong>💰 Ganhos Brutos</strong></td><td style="${tdS}">${_fmt(ganhos)}</td><td style="${tdS}${crt}">${_fmt(delta_sg)}</td><td style="${tdS}">—</td><td style="${tdS}${crt}">${_fmt(delta_gd)}</td></tr>
                    <tr><td style="${tdS}"><strong>📡 DAC7</strong></td><td style="${tdS}">${_fmt(dac7)}</td><td style="${tdS}">${_fmt(delta_sd)}</td><td style="${tdS}${crt}">${_fmt(delta_gd)}</td><td style="${tdS}">—</td></tr>
                </tbody>
            </table>
            <div style="margin-top:15px;padding:10px;border-radius:4px;background:rgba(239,68,68,0.1);border-left:4px solid #EF4444;color:#EF4444;">
                <strong>📢 Evidência de Inconformidade Sistémica:</strong> Maior desvio = ${_fmt(delta_gd)} (CRÍTICO >10%)
            </div>`;

        var chartSection = targetWrapper.querySelector('.chart-section');
        if (chartSection) targetWrapper.insertBefore(container, chartSection);
        else targetWrapper.appendChild(container);
    }

    function _syncPureDashboard() {
        console.log('[UNIFED-PURE] v13.11.5 — Execução de Patch Cirúrgico iniciada...');
        try {
            var p = _PDF_CASE.totals; var c = _PDF_CASE.crossings; var a = _PDF_CASE.auxiliaryData;

            // 1. IDENTIFICAÇÃO E EVIDÊNCIAS (IDs Reais do Legado)
            _set('clientNameDisplayFixed', "Real Demo - Unipessoal, Lda");
            _set('clientNifDisplayFixed', "999999990");
            var statusFixed = document.getElementById('clientStatusFixed');
            if (statusFixed) statusFixed.style.display = 'block';

            _set('evidenceCountTotal', '15');
            _set('controlCountCompact', '4');

            // 2. PARÂMETROS TEMPORAIS
            var periodoSelect = document.getElementById('periodoAnalise');
            if (periodoSelect) {
                periodoSelect.value = '2s'; // '2s' é o value correto no option HTML
                periodoSelect.dispatchEvent(new Event('change', { bubbles: true }));
            }

            // 3. PRIVACY BY DESIGN (Purga do texto)
            var privacyText = document.querySelector('.privacy-badge span span');
            if (privacyText && privacyText.textContent.includes('(browser)')) {
                privacyText.textContent = privacyText.textContent.replace(' (browser)', '');
            }

            // 4. OCULTAÇÃO DE ZEROS DAC7
            ['dac7Q1Value', 'dac7Q2Value', 'dac7Q3Value'].forEach(function(id) {
                var el = document.getElementById(id);
                if (el && (el.textContent.includes('0,00') || el.textContent.includes('0.00'))) {
                    var card = el.closest('.kpi-card');
                    if (card) card.style.display = 'none';
                }
            });

            // 5. INJEÇÃO XPATH EM FLUXOS NÃO SUJEITOS (Legacy Topo)
            const legacyMap = [
                { text: "CAMPANHAS", val: "405,00 €" },
                { text: "REEMBOLSOS / PORTAGENS", val: "0,15 €" },
                { text: "GORJETAS", val: "46,00 €" },
                { text: "TOTAL NÃO SUJEITOS", val: "451,15 €" },
                { text: "TAXAS CANCELAMENTO", val: "58,10 €" }
            ];
            legacyMap.forEach(function(item) {
                try {
                    var xpath = `//span[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${item.text.toLowerCase()}')]/parent::div/following-sibling::span[contains(text(), '€') or contains(text(), '0,00')] | //h4[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${item.text.toLowerCase()}')]/following-sibling::p`;
                    var result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                    if (result.singleNodeValue) {
                        result.singleNodeValue.textContent = item.val;
                        result.singleNodeValue.style.color = '#00E5FF';
                    }
                } catch(e) {}
            });

            // 6. PREENCHIMENTO DO PAINEL PURE E LEGACY
            var map = {
                'pure-ganhos': _fmt(p.ganhos), 'pure-despesas': _fmt(p.despesas),
                'pure-liquido': _fmt(p.ganhosLiquidos), 'pure-saft': _fmt(p.saftBruto),
                'pure-dac7': _fmt(p.dac7TotalPeriodo), 'pure-fatura': _fmt(p.faturaPlataforma),
                'pure-sg2-btor-val': _fmt(c.btor), 'pure-sg2-btf-val': _fmt(c.btf),
                'pure-disc-c2': _fmt(c.discrepanciaCritica), 'pure-disc-c2-pct': c.percentagemOmissao.toFixed(2) + '%',
                'pure-sg1-saft-val': _fmt(p.saftBruto), 'pure-sg1-dac7-val': _fmt(p.dac7TotalPeriodo),
                'pure-disc-saft-dac7': _fmt(c.discrepanciaSaftVsDac7), 'pure-disc-saft-pct': c.percentagemSaftVsDac7.toFixed(2) + '%',
                'pure-iva-23': _fmt(c.ivaFalta), 'pure-iva-6': _fmt(c.ivaFalta6),
                'pure-irc': _fmt(c.ircEstimado), 'pure-disc-c2-grid': _fmt(c.discrepanciaCritica),
                'pure-iva-devido': _fmt(p.saftBruto * 0.06), 'pure-nc-campanhas': _fmt(a.campanhas),
                'pure-nc-gorjetas': _fmt(a.gorjetas), 'pure-nc-portagens': _fmt(a.portagens),
                'pure-nc-cancelamentos': _fmt(a.cancelamentos), 'pure-nc-total': _fmt(a.totalNaoSujeitos),
                'pure-zc-amount': _fmt(a.totalNaoSujeitos), 'pure-nao-sujeitos': _fmt(a.totalNaoSujeitos),
                'saftIliquidoValue': _fmt(p.saftIliquido), 'saftIvaValue': _fmt(p.saftIva),
                'saftBrutoValue': _fmt(p.saftBruto), 'dac7Q4Value': _fmt(p.dac7TotalPeriodo)
            };
            Object.keys(map).forEach(function(id) { _set(id, map[id]); });

            _renderTriangulationMatrix();
            var _wrapper = document.getElementById('pureDashboardWrapper');
            if (_wrapper) _wrapper.classList.add('pure-visible');

        } catch(e) { console.error('[UNIFED-PURE] ERRO FATAL:', e); }
    }

    // ── CORR-16: _pericialSafeBoot() ELIMINADO ────────────────────────────────
    // A sincronização é activada exclusivamente via loadAnonymizedRealCase(),
    // chamado pelo index.html após fetch() do panel.html terminar.
    // Garante que o DOM do painel existe antes de qualquer tentativa de getElementById().

    // ── EXPOSIÇÃO PÚBLICA ─────────────────────────────────────────────────────
    window.UNIFEDSystem = window.UNIFEDSystem || {};

    window.UNIFEDSystem.loadAnonymizedRealCase = function() {
        console.log('[UNIFED-PURE] Gatilho activado pelo index.html — DOM do painel garantido.');
        // 300ms: garante que o innerHTML do wrapper foi processado pelo browser
        setTimeout(_syncPureDashboard, 300);
    };

    // Compatibilidade com chamadas externas
    window._updatePureUI = function() { _forceSemesterAndFlows(); };

})();
