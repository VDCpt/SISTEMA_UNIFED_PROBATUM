/**
 * UNIFED - PROBATUM · CASO REAL ANONIMIZADO v13.11.8-PURE (LOTE DEFINITIVO)
 * ============================================================================
 * Missão: Injeção Forense e Reconstituição da Verdade Material
 * Conformidade: DORA (UE) 2022/2554 · Art. 125.º CPP · ISO/IEC 27037:2012
 * * INTEGRIDADE ASSEGURADA: Zero truncamentos. Mapeamento 1:1 do DOM legado 
 * e do painel PURE. Semântica legal preservada.
 * ============================================================================
 */

(function() {
    'use strict';

    // ── 1. DADOS MESTRES CERTIFICADOS (IMUTÁVEIS) ───────────────────────────
    const _PDF_CASE = Object.freeze({
        sessionId:  "UNIFED-MNGFN3C0-X57MO",
        masterHash: "a3f8c9e2d5b6a7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1",
        client: { 
            name: "Real Demo - Unipessoal, Lda", 
            nif: "999999990", 
            platform: "outra" // Corresponde a "Plataforma A" no HTML
        },
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
        },
        evidence: {
            ctrl: 4, saft: 4, fat: 2, ext: 4, dac7: 1, total: 15
        }
    });

    // ── 2. UTILITÁRIOS FORENSES ─────────────────────────────────────────────
    function _fmt(v) {
        if (typeof window.formatCurrency === 'function') return window.formatCurrency(v);
        return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(v || 0);
    }

    function _set(id, value) {
        try {
            var el = document.getElementById(id);
            if (el) { 
                el.textContent = value; 
                return true; 
            }
        } catch(e) {} 
        return false;
    }

    // ── 3. MATRIZ DE TRIANGULAÇÃO (PROVA RAINHA) ────────────────────────────
    function _renderTriangulationMatrix() {
        if (document.getElementById('triangulationMatrixContainer')) return;
        
        var targetCard = document.getElementById('pureVerdictCard');
        if (!targetCard) return;

        var saf_t = _PDF_CASE.totals.saftBruto; 
        var ganhos = _PDF_CASE.totals.ganhos; 
        var dac7 = _PDF_CASE.totals.dac7TotalPeriodo;
        var delta_sg = Math.abs(saf_t - ganhos); 
        var delta_sd = Math.abs(saf_t - dac7); 
        var delta_gd = Math.abs(ganhos - dac7);

        var tdS = 'padding:12px;border-bottom:1px solid rgba(0,229,255,0.2);color:#f8fafc;';
        var thS = 'padding:12px;border-bottom:2px solid #00E5FF;background:rgba(0,229,255,0.1);color:#00E5FF;font-weight:700;text-transform:uppercase;';
        var crt = 'background:rgba(239,68,68,0.15);color:#fca5a5;font-weight:700;';

        var container = document.createElement('div');
        container.id = 'triangulationMatrixContainer';
        
        // RETIFICAÇÃO CIRÚRGICA: Largura máxima e fundo opaco Dark Mode
        container.style.cssText = 'width:100%;max-width:none;margin:20px 0;padding:20px;border:1px solid rgba(0,229,255,0.3);border-radius:8px;background:#1e293b;box-sizing:border-box;display:block;';

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
            <div style="margin-top:15px;padding:10px;border-radius:4px;background:rgba(239,68,68,0.1);border-left:4px solid #EF4444;color:#fca5a5;font-size:0.9rem;">
                <strong>📢 Evidência de Inconformidade Sistémica:</strong> Maior desvio = ${_fmt(delta_gd)} (CRÍTICO >10%)
            </div>`;
        
        targetCard.parentNode.insertBefore(container, targetCard);
    }

    // ── 4. SINCRONIZAÇÃO MACRO (ORQUESTRAÇÃO DO DOM) ────────────────────────
    function _syncPureDashboard() {
        console.log('[UNIFED-PURE] v13.11.8 — Sincronização Integral e Sem Omissões Iniciada.');
        
        try {
            var p = _PDF_CASE.totals; 
            var c = _PDF_CASE.crossings; 
            var a = _PDF_CASE.auxiliaryData;
            var ev = _PDF_CASE.evidence;

            // RESTAURO DO OBJETO DE MEMÓRIA (UNIFEDSystem)
            if (window.UNIFEDSystem) {
                window.UNIFEDSystem.analysis = window.UNIFEDSystem.analysis || {};
                window.UNIFEDSystem.analysis.totals = p;
                window.UNIFEDSystem.analysis.crossings = c;
                window.UNIFEDSystem.auxiliaryData = a;
                window.UNIFEDSystem.client = _PDF_CASE.client;
                window.UNIFEDSystem.masterHash = _PDF_CASE.masterHash;
                window.UNIFEDSystem.sessionId = _PDF_CASE.sessionId;
            }

            // ── BLOCO A: PARÂMETROS, IDENTIDADE E EVIDÊNCIAS (DASHBOARD ESQUERDO) ──
            
            // Sujeito Passivo
            _set('clientNameDisplayFixed', _PDF_CASE.client.name);
            _set('clientNifDisplayFixed', _PDF_CASE.client.nif);
            var clientNameInput = document.getElementById('clientNameFixed');
            var clientNifInput = document.getElementById('clientNIFFixed');
            if (clientNameInput) clientNameInput.value = _PDF_CASE.client.name;
            if (clientNifInput) clientNifInput.value = _PDF_CASE.client.nif;
            
            var statusFixed = document.getElementById('clientStatusFixed');
            if (statusFixed) statusFixed.style.display = 'block';
            var btnGroupFixed = document.querySelector('.btn-group-fixed');
            if (btnGroupFixed) btnGroupFixed.style.display = 'none';

            // Parâmetros Temporais e Plataforma
            var selPlatform = document.getElementById('selPlatformFixed');
            if (selPlatform) selPlatform.value = _PDF_CASE.client.platform; // Define "Plataforma A"

            var periodoSelect = document.getElementById('periodoAnalise');
            if (periodoSelect) {
                periodoSelect.value = '2s'; // Garante "2.º Semestre"
                periodoSelect.dispatchEvent(new Event('change', { bubbles: true }));
            }

            // Gestão de Evidências (Contadores atualizados: Total 15)
            _set('evidenceCountTotal', ev.total);
            _set('controlCountCompact', ev.ctrl);
            _set('saftCountCompact', ev.saft);
            _set('invoiceCountCompact', ev.fat);
            _set('statementCountCompact', ev.ext);
            _set('dac7CountCompact', ev.dac7);

            // Privacy by Design (Eliminar "browser")
            var privacyText = document.querySelector('.privacy-badge span span');
            if (privacyText && privacyText.textContent.includes('(browser)')) {
                privacyText.textContent = privacyText.textContent.replace(' (browser)', '');
            }

            // ── BLOCO B: DASHBOARD LEGADO (TOPO) ──
            
            // Ocultar DAC7 vazios
            ['dac7Q1Value', 'dac7Q2Value', 'dac7Q3Value'].forEach(function(id) {
                var el = document.getElementById(id);
                if (el && (el.textContent.includes('0,00') || el.textContent === '')) {
                    var card = el.closest('.kpi-card');
                    if (card) card.style.display = 'none';
                }
            });

            // Injeção de "Fluxos Não Sujeitos" no Legacy via XPath
            const legacyMap = [
                { text: "CAMPANHAS", val: _fmt(a.campanhas) },
                { text: "REEMBOLSOS / PORTAGENS", val: _fmt(a.portagens) },
                { text: "GORJETAS", val: _fmt(a.gorjetas) },
                { text: "TOTAL NÃO SUJEITOS", val: _fmt(a.totalNaoSujeitos) },
                { text: "TAXAS CANCELAMENTO", val: _fmt(a.cancelamentos) }
            ];
            legacyMap.forEach(function(item) {
                try {
                    var xpath = `//h4[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${item.text.toLowerCase()}')]/following-sibling::p`;
                    var result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                    if (result.singleNodeValue) {
                        result.singleNodeValue.textContent = item.val;
                        result.singleNodeValue.style.color = '#00E5FF';
                    }
                } catch(e) {}
            });

            // ── BLOCO C: DICIONÁRIO MASSIVO (IDs PURE + IDs LEGACY) ──
            var map = {
                /* PAINEL PURE (NOVO) */
                'pure-ganhos': _fmt(p.ganhos), 
                'pure-despesas': _fmt(p.despesas),
                'pure-liquido': _fmt(p.ganhosLiquidos), 
                'pure-saft': _fmt(p.saftBruto),
                'pure-dac7': _fmt(p.dac7TotalPeriodo), 
                'pure-sub-dac7': '2.º Semestre 2024 (Q4 activo)',
                'pure-fatura': _fmt(p.faturaPlataforma),
                'pure-sg2-btor-val': _fmt(c.btor), 
                'pure-sg2-btf-val': _fmt(c.btf),
                'pure-disc-c2': _fmt(c.discrepanciaCritica), 
                'pure-disc-c2-pct': c.percentagemOmissao.toFixed(2) + '%',
                'pure-sg1-saft-val': _fmt(p.saftBruto), 
                'pure-sg1-dac7-val': _fmt(p.dac7TotalPeriodo),
                'pure-disc-saft-dac7': _fmt(c.discrepanciaSaftVsDac7), 
                'pure-disc-saft-pct': c.percentagemSaftVsDac7.toFixed(2) + '%',
                'pure-iva-23': _fmt(c.ivaFalta), 
                'pure-iva-6': _fmt(c.ivaFalta6),
                'pure-irc': _fmt(c.ircEstimado), 
                'pure-disc-c2-grid': _fmt(c.discrepanciaCritica),
                'pure-iva-devido': _fmt(p.saftBruto * 0.06), 
                'pure-nc-campanhas': _fmt(a.campanhas),
                'pure-nc-gorjetas': _fmt(a.gorjetas), 
                'pure-nc-portagens': _fmt(a.portagens),
                'pure-nc-cancelamentos': _fmt(a.cancelamentos), 
                'pure-nc-total': _fmt(a.totalNaoSujeitos),
                'pure-zc-amount': _fmt(a.totalNaoSujeitos), 
                'pure-nao-sujeitos': _fmt(a.totalNaoSujeitos),
                
                /* PAINEL LEGADO (TOPO) */
                'saftIliquidoValue': _fmt(p.saftIliquido), 
                'saftIvaValue': _fmt(p.saftIva), 
                'saftBrutoValue': _fmt(p.saftBruto),
                'stmtGanhosValue': _fmt(p.ganhos), 
                'stmtDespesasValue': _fmt(p.despesas), 
                'stmtGanhosLiquidosValue': _fmt(p.ganhosLiquidos),
                'dac7Q4Value': _fmt(p.dac7TotalPeriodo),
                'statNet': _fmt(p.ganhosLiquidos), 
                'statComm': _fmt(p.despesas), 
                'statJuros': _fmt(c.discrepanciaCritica),
                'discrepancy5Value': _fmt(c.discrepanciaSaftVsDac7), 
                'agravamentoBrutoValue': _fmt(c.discrepanciaCritica),
                'ircValue': _fmt(c.ircEstimado), 
                'iva6Value': _fmt(c.ivaFalta6), 
                'iva23Value': _fmt(c.ivaFalta),
                'kpiGrossValue': _fmt(p.ganhos), 
                'kpiCommValue': _fmt(p.despesas), 
                'kpiNetValue': _fmt(p.ganhosLiquidos), 
                'kpiInvValue': _fmt(p.faturaPlataforma),
                'alertDeltaValue': _fmt(c.discrepanciaCritica),
                
                /* VEREDICTO, SESSÃO E HASH */
                'verdictLevel': 'RISCO ELEVADO', 
                'verdictPercentSpan': '89,26%',
                'masterHashValue': _PDF_CASE.masterHash, 
                'masterHashFull': _PDF_CASE.masterHash,
                'sessionIdDisplay': _PDF_CASE.sessionId, 
                'verdictSessionId': _PDF_CASE.sessionId,
                'pure-session-id': _PDF_CASE.sessionId
            };

            // Injeta valores verificando a existência de cada ID
            Object.keys(map).forEach(function(id) { _set(id, map[id]); });

            // ── BLOCO D: RENDERIZAÇÃO E ATIVAÇÃO ──
            
            // Ativar Cards de Alerta Ocultos
            const cardsToDisplay = ['jurosCard', 'discrepancy5Card', 'agravamentoBrutoCard', 'ircCard', 'iva6Card', 'iva23Card', 'bigDataAlert'];
            cardsToDisplay.forEach(id => {
                var el = document.getElementById(id);
                if (el) el.style.display = (id === 'bigDataAlert') ? 'flex' : 'block';
            });

            // Reativar os gatilhos originais dos gráficos e dashboard legado
            if (typeof window.updateDashboard === 'function') window.updateDashboard();
            if (typeof window.updateModulesUI === 'function') window.updateModulesUI();
            if (typeof window.renderChart === 'function') window.renderChart();

            // Renderizar Matriz (Prova Rainha)
            _renderTriangulationMatrix();

            // Forçar visibilidade do Painel PURE
            var _wrapper = document.getElementById('pureDashboardWrapper');
            if (_wrapper) _wrapper.classList.add('pure-visible');

            // Forçar visibilidade da Análise Temporal Forense (ATF)
            var atfBlock = document.getElementById('pureATFCard');
            if (atfBlock) atfBlock.style.display = 'block';

        } catch(e) { 
            console.error('[UNIFED-PURE] ERRO FATAL NA EXECUÇÃO:', e); 
        }
    }

    // ── 5. EXPOSIÇÃO PÚBLICA AO MOTOR PRINCIPAL ─────────────────────────────
    window.UNIFEDSystem = window.UNIFEDSystem || {};
    window.UNIFEDSystem.loadAnonymizedRealCase = function() {
        console.log('[UNIFED-PURE] Comando index.html recebido. Execução blindada.');
        setTimeout(_syncPureDashboard, 300);
    };

})();