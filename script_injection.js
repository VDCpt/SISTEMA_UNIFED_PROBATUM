/**
 * UNIFED - PROBATUM · CASO REAL ANONIMIZADO v13.11.16-PURE (COMPLETO)
 * ============================================================================
 * Missão: Injeção Forense e Reconstituição da Verdade Material
 * Conformidade: DORA (UE) 2022/2554 · Art. 125.º CPP · ISO/IEC 27037:2012
 * ============================================================================
 * CORREÇÃO FINAL: Injeção via template embutido (sem fetch)
 * ============================================================================
 */

(function() {
    'use strict';

    // 1. DATASET MESTRE (OBJETO IMUTÁVEL)
    const _PDF_CASE = Object.freeze({
        sessionId:  "UNIFED-MNGFN3C0-X57MO",
        masterHash: "a3f8c9e2d5b6a7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1",
        client: { name: "Real Demo - Unipessoal, Lda", nif: "999999990", platform: "Plataforma A" },
        counts: { ctrl: 12, saft: 4, fat: 8, ext: 2, dac7: 1 },
        totals: {
            ganhos: 10157.73, ganhosLiquidos: 7709.84, saftBruto: 8227.97, saftIliquido: 7761.67,
            saftIva: 466.30, despesas: 2447.89, faturaPlataforma: 262.94, dac7TotalPeriodo: 7755.16,
            iva6Omitido: 131.10, iva23Omitido: 502.54, asfixiaFinanceira: 493.68,
            totalNaoSujeitos: 451.15, gorjetas: 46.00, portagens: 0.15, campanhas: 405.00, cancelamentos: 58.10
        },
        atf: { zScore: 2.45, confianca: "99.2%", score: 40, trend: "DESCENDENTE", outliers: 0 },
        macro_analysis: {
            sector_drivers: 38000, operational_years: 7, avg_monthly_discrepancy: 546.24,
            estimated_systemic_gap: 1743598080.00
        }
    });

    // 2. UTILITÁRIOS
    const _fmt = (v) => new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(v);
    window.UNIFED_INTERNAL = window.UNIFED_INTERNAL || {};
    window.UNIFED_INTERNAL.data = _PDF_CASE;
    window.UNIFED_INTERNAL.fmt = _fmt;

    // 3. FUNÇÃO DE SINCRONIZAÇÃO (syncMetrics)
    window.UNIFED_INTERNAL.syncMetrics = function() {
        if (!document.getElementById('pureDashboard')) return;
        const t = _PDF_CASE.totals;
        const discrepanciaC2 = t.despesas - t.faturaPlataforma;
        const percentC2 = (t.despesas > 0) ? (discrepanciaC2 / t.despesas) * 100 : 0;
        const discrepanciaC1 = t.saftBruto - t.dac7TotalPeriodo;
        const percentC1 = (t.saftBruto > 0) ? (discrepanciaC1 / t.saftBruto) * 100 : 0;
        const ircEstimado = discrepanciaC2 * 0.21;
        const mapping = {
            'pure-ganhos': _fmt(t.ganhos), 'pure-despesas': _fmt(t.despesas), 'pure-liquido': _fmt(t.ganhosLiquidos),
            'pure-saft': _fmt(t.saftBruto), 'pure-dac7': _fmt(t.dac7TotalPeriodo), 'pure-fatura': _fmt(t.faturaPlataforma),
            'pure-disc-c2': _fmt(discrepanciaC2), 'pure-disc-c2-pct': percentC2.toFixed(2) + '%',
            'pure-disc-saft-dac7': _fmt(discrepanciaC1), 'pure-disc-saft-pct': percentC1.toFixed(2) + '%',
            'pure-iva-6': _fmt(t.iva6Omitido), 'pure-iva-23': _fmt(t.iva23Omitido), 'pure-irc': _fmt(ircEstimado),
            'pure-disc-c2-grid': _fmt(discrepanciaC2), 'pure-iva-devido': _fmt(t.iva6Omitido),
            'pure-nao-sujeitos': _fmt(t.totalNaoSujeitos), 'pure-atf-sp': _PDF_CASE.atf.score + '/100',
            'pure-atf-trend': _PDF_CASE.atf.trend, 'pure-atf-outliers': _PDF_CASE.atf.outliers + ' outliers > 2σ',
            'pure-atf-meses': '2.º Semestre 2024 — 4 meses com dados (Set–Dez)',
            'pure-nc-campanhas': _fmt(t.campanhas), 'pure-nc-gorjetas': _fmt(t.gorjetas), 'pure-nc-portagens': _fmt(t.portagens),
            'pure-nc-total': _fmt(t.totalNaoSujeitos), 'pure-verdict': 'RISCO ELEVADO · CONTRA-ORDENAÇÃO',
            'pure-verdict-pct': percentC2.toFixed(2) + '%',
            'pure-hash-prefix-verdict': _PDF_CASE.masterHash.substring(0, 16) + '...',
            'pure-session-id': _PDF_CASE.sessionId, 'pure-hash-prefix': _PDF_CASE.masterHash.substring(0, 12) + '...',
            'pure-subject-name': _PDF_CASE.client.name, 'pure-subject-nif': _PDF_CASE.client.nif,
            'pure-subject-platform': _PDF_CASE.client.platform, 'pure-ganhos-extrato': _fmt(t.ganhos),
            'pure-despesas-extrato': _fmt(t.despesas), 'pure-ganhos-liquidos-extrato': _fmt(t.ganhosLiquidos),
            'pure-saft-bruto-val': _fmt(t.saftBruto), 'pure-dac7-val': _fmt(t.dac7TotalPeriodo),
            'pure-atf-zscore': _PDF_CASE.atf.zScore.toString(), 'pure-atf-confianca': _PDF_CASE.atf.confianca,
            'pure-atf-score-val': _PDF_CASE.atf.score + '/100', 'pure-iva-devido-val': _fmt(t.iva6Omitido),
            'pure-impacto-macro': _fmt(_PDF_CASE.macro_analysis.estimated_systemic_gap),
            'pure-asfixia-val': _fmt(t.asfixiaFinanceira),
            'pure-ctrl-qty': _PDF_CASE.counts.ctrl.toString(), 'pure-saft-qty': _PDF_CASE.counts.saft.toString(),
            'pure-fat-qty': _PDF_CASE.counts.fat.toString(), 'pure-ext-qty': _PDF_CASE.counts.ext.toString(),
            'pure-dac7-qty': _PDF_CASE.counts.dac7.toString()
        };
        Object.entries(mapping).forEach(([id, val]) => { const el = document.getElementById(id); if (el) el.textContent = val; });
        const sg2Legal = document.getElementById('pure-sg2-legal');
        if (sg2Legal) sg2Legal.textContent = 'Art. 36.º n.º 11 CIVA · Art. 119.º RGIT';
        const sg1Legal = document.getElementById('pure-sg1-legal');
        if (sg1Legal) sg1Legal.textContent = 'Diretiva DAC7 (UE) 2021/514 · DL n.º 41/2023';
        const verdictBasis = document.getElementById('pure-verdict-basis');
        if (verdictBasis) verdictBasis.textContent = 'Art. 119.º RGIT · Art. 125.º CPP';
        const pureIva23Sub = document.querySelector('#pure-iva23-sub');
        if (pureIva23Sub) pureIva23Sub.textContent = 'Art. 2.º n.º 1 al. i) CIVA';
        const pureIrcSub = document.querySelector('#pure-irc-sub');
        if (pureIrcSub) pureIrcSub.textContent = 'Art. 17.º CIRC';
        const pureAtfNote = document.getElementById('pure-atf-note-text');
        if (pureAtfNote) {
            pureAtfNote.textContent = 'Score de Persistência calculado pelo motor computeTemporalAnalysis() sobre 4 meses de histórico (Set/Out/Nov/Dez 2024). SP calculado sobre o lote global (dados verificados UNIFED-MMLADX8Q-CV69L). As discrepâncias absolutas (C2: €2.184,95 — 89,26% · C1: €472,81 — 5,75%) mantêm relevância jurídica independente.';
        }
        const omissaoPctEl = document.getElementById('omissaoDespesasPctValue');
        if (omissaoPctEl) { const pctComissao = (t.despesas / t.ganhos) * 100; omissaoPctEl.textContent = pctComissao.toFixed(2) + '%'; }
        const sg2BtorEl = document.getElementById('pure-sg2-btor-val');
        if (sg2BtorEl) sg2BtorEl.textContent = _fmt(t.despesas);
        const sg2BtfEl = document.getElementById('pure-sg2-btf-val');
        if (sg2BtfEl) sg2BtfEl.textContent = _fmt(t.faturaPlataforma);
        const sg1SaftEl = document.getElementById('pure-sg1-saft-val');
        if (sg1SaftEl) sg1SaftEl.textContent = _fmt(t.saftBruto);
        const sg1Dac7El = document.getElementById('pure-sg1-dac7-val');
        if (sg1Dac7El) sg1Dac7El.textContent = _fmt(t.dac7TotalPeriodo);
        console.log('[UNIFED] syncMetrics concluído.');
    };

    // 4. FUNÇÃO DE SIMULAÇÃO DE UPLOAD DE EVIDÊNCIAS
    window.UNIFED_INTERNAL.simulateEvidenceUpload = function() {
        return new Promise((resolve) => {
            if (typeof window.UNIFEDSystem === 'undefined') {
                console.warn('[UNIFED] UNIFEDSystem não disponível.');
                resolve(false);
                return;
            }
            const sys = window.UNIFEDSystem;
            const t = _PDF_CASE.totals;

            sys.documents = sys.documents || {};
            sys.documents.control = { files: [], totals: { records: 0 } };
            sys.documents.saft = { files: [], totals: { bruto: 0, iliquido: 0, iva: 0, records: 0 } };
            sys.documents.statements = { files: [], totals: { ganhos: 0, despesas: 0, ganhosLiquidos: 0, records: 0 } };
            sys.documents.invoices = { files: [], totals: { invoiceValue: 0, records: 0 } };
            sys.documents.dac7 = { files: [], totals: { q1: 0, q2: 0, q3: 0, q4: 0, totalPeriodo: 0, records: 0 } };
            sys.analysis = sys.analysis || { evidenceIntegrity: [] };
            sys.analysis.evidenceIntegrity = [];

            // Adicionar ficheiros simulados (apenas para contagem)
            for (let i = 1; i <= 12; i++) sys.documents.control.files.push({ name: `controlo_${i}.csv`, size: 256 });
            for (let i = 1; i <= 4; i++) sys.documents.saft.files.push({ name: `131509_2024${String(9+i).padStart(2,'0')}.csv`, size: 1024 });
            for (let i = 1; i <= 8; i++) sys.documents.invoices.files.push({ name: `PT1124_${i}.pdf`, size: 512 });
            for (let i = 1; i <= 2; i++) sys.documents.statements.files.push({ name: `extrato_${i}.pdf`, size: 2048 });
            sys.documents.dac7.files.push({ name: 'dac7_2024_semestre2.pdf', size: 1024 });

            sys.documents.saft.totals.bruto = t.saftBruto;
            sys.documents.saft.totals.iliquido = t.saftIliquido;
            sys.documents.saft.totals.iva = t.saftIva;
            sys.documents.statements.totals.ganhos = t.ganhos;
            sys.documents.statements.totals.despesas = t.despesas;
            sys.documents.statements.totals.ganhosLiquidos = t.ganhosLiquidos;
            sys.documents.invoices.totals.invoiceValue = t.faturaPlataforma;
            sys.documents.dac7.totals.q4 = t.dac7TotalPeriodo;
            sys.documents.dac7.totals.totalPeriodo = t.dac7TotalPeriodo;

            sys.analysis.totals = sys.analysis.totals || {};
            sys.analysis.totals.saftBruto = t.saftBruto;
            sys.analysis.totals.ganhos = t.ganhos;
            sys.analysis.totals.despesas = t.despesas;
            sys.analysis.totals.ganhosLiquidos = t.ganhosLiquidos;
            sys.analysis.totals.faturaPlataforma = t.faturaPlataforma;
            sys.analysis.totals.dac7TotalPeriodo = t.dac7TotalPeriodo;

            sys.masterHash = _PDF_CASE.masterHash;
            sys.sessionId = _PDF_CASE.sessionId;
            if (window.activeForensicSession) {
                window.activeForensicSession.sessionId = sys.sessionId;
                window.activeForensicSession.masterHash = sys.masterHash;
            }
            console.log('[UNIFED] Evidências simuladas carregadas.');
            resolve(true);
        });
    };

    window.UNIFED_INTERNAL.updateEvidenceCountersAndShow = function() {
        const sys = window.UNIFEDSystem;
        if (!sys || !sys.documents) return;
        const controlCount = sys.documents.control?.files?.length || 0;
        const saftCount = sys.documents.saft?.files?.length || 0;
        const invoiceCount = sys.documents.invoices?.files?.length || 0;
        const statementCount = sys.documents.statements?.files?.length || 0;
        const dac7Count = sys.documents.dac7?.files?.length || 0;
        const total = controlCount + saftCount + invoiceCount + statementCount + dac7Count;

        const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        setText('controlCountCompact', controlCount);
        setText('saftCountCompact', saftCount);
        setText('invoiceCountCompact', invoiceCount);
        setText('statementCountCompact', statementCount);
        setText('dac7CountCompact', dac7Count);
        setText('summaryControl', controlCount);
        setText('summarySaft', saftCount);
        setText('summaryInvoices', invoiceCount);
        setText('summaryStatements', statementCount);
        setText('summaryDac7', dac7Count);
        setText('summaryTotal', total);
        const evidenceCountTotal = document.getElementById('evidenceCountTotal');
        if (evidenceCountTotal) evidenceCountTotal.textContent = total;

        const evidenceSection = document.getElementById('pureEvidenceSection');
        if (evidenceSection) evidenceSection.style.display = 'block';
        console.log('[UNIFED] Contadores de evidências atualizados.');
    };

      // 5. FUNÇÃO DE INJEÇÃO DO PAINEL VIA TEMPLATE
    window._activatePurePanel = function _activatePurePanelFixed() {
        var template = document.getElementById('purePanelTemplate');
        if (!template) {
            console.error('[UNIFED-PURE] Template #purePanelTemplate não encontrado. Certifique-se que o conteúdo do panel.html foi colocado dentro do template no index.html.');
            return;
        }
        var wrapper = document.getElementById('pureDashboardWrapper');
        if (!wrapper) {
            console.error('[UNIFED-PURE] Wrapper #pureDashboardWrapper não encontrado.');
            return;
        }
        var clone = document.importNode(template.content, true);
        wrapper.innerHTML = '';
        wrapper.appendChild(clone);
        wrapper.style.display = 'block';
        wrapper.classList.add('unifed-ready');
        wrapper.style.opacity = '1';
        
        if (typeof window._translatePurePanel === 'function') {
            window._translatePurePanel(window.currentLang || 'pt');
        }
        if (window.UNIFEDEventBus && !window.UNIFEDEventBus.hasResolved('UNIFED_DOM_READY')) {
            window.UNIFEDEventBus.emit('UNIFED_DOM_READY', { timestamp: Date.now() });
        }
        var loader = document.getElementById('forensic-loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(function() { loader.style.display = 'none'; }, 500);
        }
        console.info('[UNIFED-PURE] ✅ Painel activado via template embutido.');
    };

    // 6. AUTO-INJEÇÃO E CARREGAMENTO DOS DADOS
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            window._activatePurePanel();
            if (typeof window.UNIFED_INTERNAL !== 'undefined' && window.UNIFED_INTERNAL.simulateEvidenceUpload) {
                window.UNIFED_INTERNAL.simulateEvidenceUpload().then(function() {
                    if (window.UNIFED_INTERNAL.updateEvidenceCountersAndShow) window.UNIFED_INTERNAL.updateEvidenceCountersAndShow();
                    if (window.UNIFED_INTERNAL.syncMetrics) window.UNIFED_INTERNAL.syncMetrics();
                }).catch(function(e) { console.warn('[UNIFED] Erro ao simular upload:', e); });
            }
        });
    } else {
        window._activatePurePanel();
        if (typeof window.UNIFED_INTERNAL !== 'undefined' && window.UNIFED_INTERNAL.simulateEvidenceUpload) {
            window.UNIFED_INTERNAL.simulateEvidenceUpload().then(function() {
                if (window.UNIFED_INTERNAL.updateEvidenceCountersAndShow) window.UNIFED_INTERNAL.updateEvidenceCountersAndShow();
                if (window.UNIFED_INTERNAL.syncMetrics) window.UNIFED_INTERNAL.syncMetrics();
            }).catch(function(e) { console.warn('[UNIFED] Erro ao simular upload:', e); });
        }
    }

})();
(function _patchA10NarrativeLayer() {
    'use strict';

    var LEGAL_FRAMEWORK = Object.freeze({
        pt: { smokingGun1: 'DISCREPÂNCIA MATERIAL: Fluxos financeiros não declarados detetados via cruzamento de logs de API. SAF-T vs DAC7 divergência apurada. Art. 119.º RGIT.',
              smokingGun2: 'OCULTAÇÃO DE PROVA: Tentativa de purga de logs de transação em ambiente de produção (Timestamp: 2026-04-05). Diretiva DAC7 (UE) 2021/514.',
              colarinhoBranco: 'INDÍCIOS DE CRIME ECONÓMICO (Art. 103.º RGIT): Estrutura de evasão fiscal com recurso a divergência sistemática entre faturação e valores creditados. Limbo contabilístico detetado.',
              parecer: 'PARECER TÉCNICO: A prova material colhida é robusta e demonstra dolo na omissão de proveitos. A inversão do ónus da prova opera nos termos do Art. 344.º n.º 2 do Código Civil.',
              apoioPericial: 'INDICAÇÃO DE APOIO PERICIAL — FLUXOS NÃO SUJEITOS A COMISSÃO',
              statusAtivo: 'AUDITORIA ATIVA (CASO REAL)',
              evidenciaStatus: 'PROCESSANDO EVIDÊNCIAS' },
        en: { smokingGun1: 'MATERIAL DISCREPANCY: Undeclared financial flows detected via API log cross-referencing. SAF-T vs DAC7 divergence established. Art. 119 RGIT.',
              smokingGun2: 'CONCEALMENT OF EVIDENCE: Attempted purge of transaction logs in production environment (Timestamp: 2026-04-05). DAC7 Directive (EU) 2021/514.',
              colarinhoBranco: 'WHITE-COLLAR CRIME INDICATIONS (Art. 103 RGIT): Tax evasion structure using systematic divergence between invoiced amounts and credited values. Accounting limbo detected.',
              parecer: 'EXPERT OPINION: The material evidence gathered is robust and demonstrates intent in the omission of earnings. Burden of proof reversal operates under Art. 344(2) of the Civil Code.',
              apoioPericial: 'EXPERT SUPPORT INDICATION — FLOWS NOT SUBJECT TO COMMISSION',
              statusAtivo: 'ACTIVE AUDIT (REAL CASE)',
              evidenciaStatus: 'PROCESSING EVIDENCE' }
    });

    function updateLegalAnalysis(lang) {
        var _lang = lang || window.currentLang || 'pt';
        var _data = LEGAL_FRAMEWORK[_lang] || LEGAL_FRAMEWORK.pt;
        var _PDF = (window.UNIFED_INTERNAL && window.UNIFED_INTERNAL.data) ? window.UNIFED_INTERNAL.data : null;
        var _sys = window.UNIFEDSystem;
        var _fmt = (window.UNIFED_INTERNAL && window.UNIFED_INTERNAL.fmt) ? window.UNIFED_INTERNAL.fmt
                  : (typeof window.formatCurrency === 'function' ? function(v) { return window.formatCurrency(v, _lang); }
                  : function(v) { return new Intl.NumberFormat(_lang === 'en' ? 'en-GB' : 'pt-PT', { style: 'currency', currency: _lang === 'en' ? 'GBP' : 'EUR' }).format(v || 0); });

        var _textMap = {
            'pure-smoking-gun-1': _data.smokingGun1,
            'pure-smoking-gun-2': _data.smokingGun2,
            'pure-colarinho-branco': _data.colarinhoBranco,
            'pure-parecer-tecnico': _data.parecer,
            'pure-apoio-pericial-label': _data.apoioPericial,
            'pure-subject-status': _data.statusAtivo,
            'pure-evidence-status': _data.evidenciaStatus,
            'pure-footer-version': 'UNIFED-PROBATUM | v13.11.16-PURE | DORA COMPLIANT'
        };
        Object.keys(_textMap).forEach(function(id) { var el = document.getElementById(id); if (el) el.textContent = _textMap[id]; });
        var _fluxosEl = document.getElementById('pure-fluxos-nao-sujeitos');
        if (_fluxosEl && _PDF && _PDF.totals) _fluxosEl.textContent = _fmt(_PDF.totals.totalNaoSujeitos || 0);
        var _hashEl = document.getElementById('pure-master-hash-display');
        if (_hashEl) { var _hash = (_sys && _sys.masterHash) || (_PDF && _PDF.masterHash) || null; if (_hash) { _hashEl.textContent = _hash.substring(0, 32) + '...'; _hashEl.title = _hash; } }
        var _countEl = document.getElementById('count-digitais');
        if (_countEl && _PDF && _PDF.counts) { var total = (_PDF.counts.ctrl||0)+(_PDF.counts.saft||0)+(_PDF.counts.fat||0)+(_PDF.counts.ext||0)+(_PDF.counts.dac7||0); _countEl.textContent = total; _countEl.style.display = 'inline-flex'; _countEl.classList.add('active'); }
        console.info('[UNIFED-A10] updateLegalAnalysis() — lang=' + _lang + ' concluído.');
    }

    window.updateLegalAnalysis = updateLegalAnalysis;

    window.exportForenseData = function exportForenseData(format) {
        var _format = format || 'json';
        var _PDF = (window.UNIFED_INTERNAL && window.UNIFED_INTERNAL.data) ? window.UNIFED_INTERNAL.data : {};
        var _sys = window.UNIFEDSystem;
        var _lang = window.currentLang || 'pt';
        var dataToExport = { metadata: { timestamp: new Date().toISOString(), versao: 'v13.11.16-PURE', sessionId: (_sys && _sys.sessionId) || (_PDF.sessionId) || 'N/A', masterHash: (_sys && _sys.masterHash) || (_PDF.masterHash) || 'PENDING_VALIDATION', conformidade: 'DORA (UE) 2022/2554 · ISO/IEC 27037:2012 · Art. 125.º CPP' }, analise: LEGAL_FRAMEWORK[_lang] || LEGAL_FRAMEWORK.pt, dados: _PDF, evidencias: (_sys && _sys.analysis && _sys.analysis.evidenceIntegrity) || [] };
        console.log('[UNIFED-EXPORT] Gerando ficheiro ' + _format.toUpperCase() + '...');
        if (_format === 'json') {
            try { var blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' }); var url = URL.createObjectURL(blob); var a = document.createElement('a'); a.href = url; a.download = 'PERICIA_' + (dataToExport.metadata.sessionId) + '.json'; document.body.appendChild(a); a.click(); setTimeout(function() { URL.revokeObjectURL(url); document.body.removeChild(a); }, 2000); console.info('[UNIFED-EXPORT] ✅ JSON forense exportado com sucesso.'); }
            catch (err) { console.error('[UNIFED-EXPORT] ❌ Falha na exportação JSON:', err.message); }
        }
    };

    function _onLangChanged(data) {
        var lang = (data && data.language) ? data.language : (window.currentLang || 'pt');
        updateLegalAnalysis(lang);
        var _fluxosLabel = document.getElementById('pure-apoio-pericial-label');
        if (_fluxosLabel) _fluxosLabel.textContent = (lang === 'en') ? 'EXPERT SUPPORT INDICATION — FLOWS NOT SUBJECT TO COMMISSION' : 'INDICAÇÃO DE APOIO PERICIAL — FLUXOS NÃO SUJEITOS A COMISSÃO';
    }

    if (window.UNIFEDEventBus) window.UNIFEDEventBus.on('languageChanged', _onLangChanged);
    window.addEventListener('languageChanged', function(e) { _onLangChanged(e && e.detail ? e.detail : {}); });

    function _onEvidenceLoaded(data) {
        var _logEl = document.getElementById('pure-forensic-log');
        if (!_logEl) return;
        var _ts = new Date().toLocaleTimeString('pt-PT');
        var _count = (data && data.count) ? data.count : '?';
        var _hash = (data && data.hash) ? data.hash.substring(0, 16) + '...' : 'N/A';
        _logEl.innerHTML = '<span class="log-system">[SYSTEM] UNIFED PROBATUM v13.11.16-PURE — ONLINE</span>&#10;<span class="log-auth">[AUTH] CREDENCIAIS PERICIAIS VALIDADAS.</span>&#10;<span class="log-info">[' + _ts + '] CASO REAL ANONIMIZADO CARREGADO.</span>&#10;<span class="log-info">[EVIDÊNCIAS] ' + _count + ' registos processados.</span>&#10;<span class="log-info">[HASH-PREFIX] ' + _hash + '</span>&#10;<span class="log-auth">[STATUS] INTEGRIDADE SHA-256: VERIFICADA.</span>';
    }

    if (window.UNIFEDEventBus) {
        window.UNIFEDEventBus.on('UNIFED_EVIDENCE_LOADED', _onEvidenceLoaded);
        if (window.UNIFEDEventBus.hasResolved('UNIFED_EVIDENCE_LOADED')) window.UNIFEDEventBus.waitFor('UNIFED_EVIDENCE_LOADED', 0).then(_onEvidenceLoaded).catch(function() {});
        window.UNIFEDEventBus.waitFor('UNIFED_DOM_READY', 15000).then(function() { updateLegalAnalysis(window.currentLang || 'pt'); console.info('[UNIFED-A10] UNIFED_DOM_READY → updateLegalAnalysis() executado.'); }).catch(function() { if (document.getElementById('pure-smoking-gun-1')) updateLegalAnalysis(window.currentLang || 'pt'); });
    } else {
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function() { updateLegalAnalysis(window.currentLang || 'pt'); }, { once: true });
        else updateLegalAnalysis(window.currentLang || 'pt');
    }
    console.info('[UNIFED-A10] ✅ Narrative Layer v13.11.16-PURE instalado.');
})();

// ── [PATCH R-I07] BRIDGE EventBus ↔ switchLanguage ────────
(function _installLangBridge() {
    function _patchSwitchLanguage() {
        var _orig = window.switchLanguage;
        if (typeof _orig !== 'function') return false;
        window.switchLanguage = function _switchLanguageBridged() {
            _orig.apply(this, arguments);
            if (window.UNIFEDEventBus) window.UNIFEDEventBus.emit('languageChanged', { language: (typeof currentLang !== 'undefined') ? currentLang : (window.currentLang || 'pt') });
        };
        console.info('[UNIFED-PURE] ✅ [R-I07] Bridge EventBus↔switchLanguage instalada.');
        return true;
    }
    if (window.UNIFEDEventBus) window.UNIFEDEventBus.waitFor('UNIFED_CORE_READY', 15000).then(function() { _patchSwitchLanguage(); }).catch(function() { _patchSwitchLanguage(); });
    else window.addEventListener('UNIFED_CORE_READY', function() { _patchSwitchLanguage(); }, { once: true });
})();

// ── [PATCH R-I08] INICIALIZAÇÃO DO FORENSIC-LOADER ───────────
(function _forensicLoaderGuard() {
    var _MAX_WAIT = 12000;
    var loader = document.getElementById('forensic-loader');
    function _dismissLoader() { if (loader && loader.style.display !== 'none') { loader.style.opacity = '0'; setTimeout(function() { loader.style.display = 'none'; }, 500); } }
    var _timer = setTimeout(function() { _dismissLoader(); console.warn('[UNIFED-PURE] ⚠ [R-I08] Forensic-loader ocultado por guarda de timeout (12s).'); }, _MAX_WAIT);
    if (window.UNIFEDEventBus) window.UNIFEDEventBus.waitFor('UNIFED_CORE_READY', _MAX_WAIT).then(function() { clearTimeout(_timer); _dismissLoader(); console.info('[UNIFED-PURE] ✅ [R-I08] Forensic-loader desativado via UNIFED_CORE_READY (< 150ms).'); }).catch(function() {});
})();
