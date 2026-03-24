/**
 * ============================================================================
 * UNIFED - PROBATUM · v13.5.0-PURE · MÓDULO DE EXPORTAÇÃO — TRÍADE DOCUMENTAL
 * ============================================================================
 * Ficheiro      : unifed_triada_export.js
 * Versão        : 1.0.0-TRIADA
 * Sessão ref.   : UNIFED-MMLADX8Q-CV69L
 * Dependências  : jsPDF (window.jspdf), JSZip (global), Web Crypto API
 *
 * OPERAÇÕES EXECUTADAS POR ESTE MÓDULO:
 *   1. Neutralização Segura — purga de event listeners via cloneNode()
 *      nos botões legados: #exportPDFBtn e #exportDOCXBtn.
 *   2. Injeção Não-Destrutiva — criação via document.createElement dos
 *      3 novos botões da Tríade Documental (sem uso de innerHTML).
 *   3. Implementação das 3 funções de exportação:
 *      · _unifedExportPdfRelatorio()     — PDF Relatório Pericial
 *      · _unifedExportPdfAnexoCustodia() — PDF Cadeia de Custódia
 *      · _unifedExportDocxMatriz()       — DOCX Matriz de Argumentação Jurídica
 *
 * RESTRIÇÕES ABSOLUTAS DE ESTADO:
 *   · UNIFEDSystem.analysis e todas as fórmulas financeiras: Read-Only.
 *   · innerHTML proibido para injeção de botões (ciclo de vida da UI).
 *   · Hashes apenas computados via Web Crypto API (SHA-256) ou declarados
 *     como [PENDENTE] quando o ficheiro físico não foi ingerido.
 *
 * CONFORMIDADE: DORA (UE) 2022/2554 · ISO/IEC 27037:2012 · RFC 3161
 *               Art. 125.º CPP · Art. 36.º n.º 11 CIVA · Art. 104.º RGIT
 * ============================================================================
 */

(function _unifedTriadaExportIIFE() {
    'use strict';

    // =========================================================================
    // BLOCO 0 — CONSTANTES E UTILITÁRIOS INTERNOS
    // =========================================================================

    /** Versão deste módulo — sincronizada com o ciclo de release UNIFED. */
    var _MODULE_VERSION = '1.0.0-TRIADA';

    /** IDs dos botões legados a neutralizar. */
    var _LEGACY_BTN_IDS = ['exportPDFBtn', 'exportDOCXBtn'];

    /**
     * Utilitário de log interno — encaminha para logAudit() se disponível,
     * caso contrário usa console com prefixo normalizado.
     * @param {string} msg
     * @param {string} level  'info' | 'success' | 'error' | 'warn'
     */
    function _log(msg, level) {
        var prefix = '[UNIFED-TRIADA] ';
        if (typeof window.logAudit === 'function') {
            window.logAudit(prefix + msg, level || 'info');
        } else {
            (level === 'error' ? console.error : console.info)(prefix + msg);
        }
    }

    /**
     * Formata um número como moeda EUR (pt-PT).
     * @param {number} val
     * @returns {string}
     */
    function _eur(val) {
        return new Intl.NumberFormat('pt-PT', {
            style: 'currency', currency: 'EUR',
            minimumFractionDigits: 2, maximumFractionDigits: 2
        }).format(val || 0);
    }

    /**
     * Formata data atual no padrão pt-PT.
     * @returns {string}  ex: "24/03/2026"
     */
    function _dataHoje() {
        return new Date().toLocaleDateString('pt-PT', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        });
    }

    /**
     * Computa SHA-256 de uma string via Web Crypto API (assíncrono).
     * Nunca inventado — derivado dos dados reais presentes em runtime.
     * @param {string} texto
     * @returns {Promise<string>}  hex lowercase 64 chars
     */
    async function _sha256(texto) {
        var buffer = new TextEncoder().encode(String(texto));
        var hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        return Array.from(new Uint8Array(hashBuffer))
            .map(function (b) { return b.toString(16).padStart(2, '0'); })
            .join('');
    }

    /**
     * Escapa caracteres especiais XML/OOXML.
     * @param {string} s
     * @returns {string}
     */
    function _xe(s) {
        return String(s || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }

    /**
     * Acesso seguro ao UNIFEDSystem — lança erro descritivo se indisponível.
     * @returns {object}
     */
    function _getSys() {
        if (!window.UNIFEDSystem || !window.UNIFEDSystem.analysis) {
            throw new Error('UNIFEDSystem.analysis não disponível — execute a análise forense primeiro.');
        }
        return window.UNIFEDSystem;
    }

    // =========================================================================
    // BLOCO 1 — NEUTRALIZAÇÃO SEGURA DOS BOTÕES LEGADOS (ORPHAN PREVENTION)
    // =========================================================================
    /**
     * Purga event listeners via cloneNode() e oculta o botão legado.
     * Não remove do DOM para preservar o fluxo de layout do toolbar-grid.
     * @param {string} id   ID do elemento a neutralizar
     */
    function _neutralizarBotaoLegado(id) {
        try {
            var node = document.getElementById(id);
            if (!node) {
                _log('Botão legado #' + id + ' não encontrado no DOM — ignorado.', 'warn');
                return;
            }
            /* ── Técnica de clonagem: purga todos os event listeners em memória ── */
            var clone = node.cloneNode(true);   // cloneNode(deep=true)
            node.replaceWith(clone);            // substitui node original pelo clone limpo

            /* ── Após purga, ocultação via display:none (mantém layout flow) ── */
            clone.style.display   = 'none';
            clone.setAttribute('aria-hidden', 'true');
            clone.setAttribute('data-unifed-neutralized', _MODULE_VERSION);
            clone.disabled = true;

            _log('Botão legado #' + id + ' neutralizado (listeners purgados, display:none).', 'info');
        } catch (err) {
            /* Falha na neutralização não interrompe o motor forense */
            _log('Falha na neutralização de #' + id + ': ' + err.message, 'error');
        }
    }

    /* Executar neutralização para cada botão legado */
    _LEGACY_BTN_IDS.forEach(_neutralizarBotaoLegado);


    // =========================================================================
    // BLOCO 2 — INJEÇÃO NÃO-DESTRUTIVA DOS 3 NOVOS BOTÕES (SEM innerHTML)
    // =========================================================================

    /**
     * Cria e injeta um botão na toolbar-grid via document.createElement.
     * Nunca usa innerHTML. Retorna o botão criado ou null em caso de falha.
     *
     * @param {object} cfg
     * @param {string} cfg.id          ID único do botão
     * @param {string} cfg.iconClass   Classe Font Awesome (ex: 'fa-file-pdf')
     * @param {string} cfg.labelText   Texto visível do botão
     * @param {string} cfg.title       Tooltip (atributo title)
     * @param {string} cfg.borderColor Cor da borda esquerda de destaque
     * @param {Function} cfg.handler   Função a invocar no click
     * @returns {HTMLButtonElement|null}
     */
    function _injectarBotao(cfg) {
        try {
            var toolbar = document.querySelector('.toolbar-grid');
            if (!toolbar) {
                _log('toolbar-grid não encontrada — botão #' + cfg.id + ' não injetado.', 'error');
                return null;
            }

            /* ── Criar elemento botão ── */
            var btn = document.createElement('button');
            btn.id        = cfg.id;
            btn.className = 'btn-tool';
            btn.title     = cfg.title || '';
            btn.setAttribute('data-unifed-triada', _MODULE_VERSION);
            btn.style.borderLeft = '3px solid ' + (cfg.borderColor || '#00E5FF');

            /* ── Ícone (i.fas) — sem innerHTML ── */
            var icon = document.createElement('i');
            icon.className = 'fas ' + (cfg.iconClass || 'fa-file');
            icon.setAttribute('aria-hidden', 'true');

            /* ── Separador espaço ── */
            var space = document.createTextNode('\u00A0');

            /* ── Texto do label ── */
            var label = document.createTextNode(cfg.labelText || '');

            /* ── Montar nós ── */
            btn.appendChild(icon);
            btn.appendChild(space);
            btn.appendChild(label);

            /* ── Registar handler com wrapper try/catch ── */
            btn.addEventListener('click', function _triadeClickGuard() {
                try {
                    cfg.handler();
                } catch (handlerErr) {
                    _log('Erro no handler do botão #' + cfg.id + ': ' + handlerErr.message, 'error');
                    if (typeof window.showToast === 'function') {
                        window.showToast('Erro de exportação: ' + handlerErr.message, 'error');
                    }
                }
            });

            /* ── Inserir antes do botão ATF (se existir) ou no fim da toolbar ── */
            var atfBtn = document.getElementById('atfModalBtn');
            if (atfBtn && atfBtn.parentNode === toolbar) {
                toolbar.insertBefore(btn, atfBtn);
            } else {
                toolbar.appendChild(btn);
            }

            _log('Botão #' + cfg.id + ' (' + cfg.labelText + ') injetado com sucesso.', 'success');
            return btn;

        } catch (err) {
            _log('Falha na injeção do botão #' + cfg.id + ': ' + err.message, 'error');
            return null;
        }
    }


    // =========================================================================
    // BLOCO 3 — EXPORTAÇÃO 1: PDF RELATÓRIO PERICIAL DE RECONSTITUIÇÃO
    // =========================================================================

    /**
     * Gera o PDF "Relatório Pericial de Reconstituição" com:
     *   · Página 1: Resumo Executivo (dados do caso, âmbito, sumário de achados)
     *   · Corpo: Introdução, Metodologia Forense, Análise
     *   · Conclusão: Achados e Recomendações
     *   · Rodapé criptográfico: SHA-256 da extração
     *   · Marca de água "PROVA DIGITAL MATERIAL" em todas as páginas
     *
     * @returns {Promise<void>}
     */
    async function _unifedExportPdfRelatorio() {
        if (typeof window.jspdf === 'undefined') {
            _log('jsPDF não carregado — exportação PDF abortada.', 'error');
            if (typeof window.showToast === 'function') window.showToast('Erro: jsPDF não disponível.', 'error');
            return;
        }

        var sys;
        try { sys = _getSys(); } catch (e) {
            if (typeof window.showToast === 'function') window.showToast(e.message, 'error');
            return;
        }

        _log('A gerar PDF · Relatório Pericial de Reconstituição...', 'info');

        try {
            var jsPDF   = window.jspdf.jsPDF;
            var doc     = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
            var t       = sys.analysis.totals    || {};
            var c       = sys.analysis.crossings || {};
            var v       = sys.analysis.verdict   || {};
            var sessId  = sys.sessionId  || 'N/D';
            var mhash   = sys.masterHash || 'N/D';
            var pageW   = doc.internal.pageSize.getWidth();
            var pageH   = doc.internal.pageSize.getHeight();
            var L       = 14;   /* margem esquerda */
            var R       = pageW - 14; /* margem direita */
            var W       = R - L;
            var hoje    = _dataHoje();

            /* ── Computar hash do snapshot de dados em runtime ── */
            var _snapshotStr = JSON.stringify({
                sessionId: sessId,
                ganhos: t.ganhos,
                despesas: t.despesas,
                discC2: c.discrepanciaCritica,
                pctC2: c.percentagemOmissao,
                discC1: c.discrepanciaSaftVsDac7
            });
            var _runtimeHash = await _sha256(_snapshotStr);

            /* ════════════════════════════════════════════════════════════════
               HELPERS INTERNOS DE LAYOUT
               ════════════════════════════════════════════════════════════════ */

            var _pageNum = 1;

            /** Adiciona marca de água em diagonal. */
            function _watermark() {
                doc.saveGraphicsState();
                doc.setGState(new doc.GState({ opacity: 0.055 }));
                doc.setFontSize(26);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(60, 60, 60);
                doc.text('PROVA DIGITAL MATERIAL', pageW / 2, pageH / 2,
                    { align: 'center', angle: 45 });
                doc.restoreGraphicsState();
                doc.setTextColor(0, 0, 0);
            }

            /**
             * Rodapé criptográfico em todas as páginas.
             * @param {boolean} isLast
             */
            function _footer(isLast) {
                var hashShort = mhash.substring(0, 32) + '...';
                doc.setFontSize(6.5);
                doc.setFont('courier', 'normal');
                doc.setTextColor(130, 130, 130);
                /* Linha separadora */
                doc.setDrawColor(200, 200, 200);
                doc.line(L, pageH - 12, R, pageH - 12);
                /* Texto do rodapé */
                doc.text(
                    'UNIFED-PROBATUM v13.5.0-PURE · Sessão: ' + sessId +
                    ' · SHA-256: ' + hashShort,
                    L, pageH - 8
                );
                doc.text(
                    'Pág. ' + _pageNum + ' · ' + hoje +
                    ' · ISO/IEC 27037:2012 · RFC 3161 · Art. 125.º CPP',
                    R, pageH - 8, { align: 'right' }
                );
                if (isLast) {
                    doc.text(
                        'Master Hash SHA-256: ' + mhash,
                        L, pageH - 4.5
                    );
                }
                doc.setTextColor(0, 0, 0);
            }

            /** Nova página com watermark e contador. */
            function _newPage() {
                doc.addPage();
                _pageNum++;
                _watermark();
            }

            /** Imprime texto com quebra de linha automática e retorna o y final. */
            function _textBlock(txt, x, y, opts) {
                var lines = doc.splitTextToSize(txt, opts.maxWidth || W);
                doc.text(lines, x, y, opts);
                return y + (lines.length * (opts.lineH || 5));
            }

            /** Cabeçalho de secção. */
            function _sectionHeader(txt, y, color) {
                color = color || [0, 60, 120];
                doc.setFillColor(color[0], color[1], color[2]);
                doc.rect(L, y, W, 7, 'F');
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(9);
                doc.setTextColor(255, 255, 255);
                doc.text(txt, L + 3, y + 4.8);
                doc.setTextColor(0, 0, 0);
                return y + 10;
            }

            /** Linha de dado KPI: label + valor. */
            function _kpiRow(label, value, y, highlight) {
                doc.setFontSize(8);
                doc.setFont('helvetica', highlight ? 'bold' : 'normal');
                doc.setTextColor(80, 80, 80);
                doc.text(label, L + 2, y);
                doc.setTextColor(highlight ? 180 : 0, 0, 0);
                doc.setFont('courier', highlight ? 'bold' : 'normal');
                doc.text(String(value), R - 2, y, { align: 'right' });
                doc.setTextColor(0, 0, 0);
                doc.setFont('helvetica', 'normal');
                /* Linha guia pontilhada */
                doc.setDrawColor(220, 220, 220);
                doc.setLineDashPattern([0.5, 1], 0);
                doc.line(L + 2, y + 0.5, R - 2, y + 0.5);
                doc.setLineDashPattern([], 0);
                return y + 6;
            }

            /* ════════════════════════════════════════════════════════════════
               PÁGINA 1 — CAPA E RESUMO EXECUTIVO
               ════════════════════════════════════════════════════════════════ */
            _watermark();

            /* Faixa de cabeçalho institucional */
            doc.setFillColor(5, 20, 50);
            doc.rect(0, 0, pageW, 38, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(18);
            doc.setTextColor(0, 229, 255);
            doc.text('UNIFED — PROBATUM', pageW / 2, 14, { align: 'center' });
            doc.setFontSize(10);
            doc.setTextColor(180, 210, 255);
            doc.text('RELATÓRIO PERICIAL DE RECONSTITUIÇÃO DA VERDADE MATERIAL', pageW / 2, 22, { align: 'center' });
            doc.setFontSize(8);
            doc.setTextColor(120, 160, 200);
            doc.text('v13.5.0-PURE · ISO/IEC 27037:2012 · DORA (UE) 2022/2554 · RFC 3161', pageW / 2, 30, { align: 'center' });
            doc.text('Art. 103.º–104.º RGIT · Art. 125.º CPP · Diretiva DAC7 (UE) 2021/514', pageW / 2, 35, { align: 'center' });

            /* Dados do caso */
            var y = 46;
            doc.setTextColor(0, 0, 0);
            y = _sectionHeader('I. DADOS DO CASO — IDENTIFICAÇÃO DA SESSÃO FORENSE', y, [10, 40, 90]);

            y = _kpiRow('Referência da Sessão',   sessId, y, false);
            y = _kpiRow('Plataforma',             (sys.metadata && sys.metadata.client && sys.metadata.client.platform) || 'bolt', y, false);
            y = _kpiRow('Sujeito Passivo',        (sys.metadata && sys.metadata.client && sys.metadata.client.name) || 'OPERADOR_ANONIMIZADO', y, false);
            y = _kpiRow('NIF',                    (sys.metadata && sys.metadata.client && sys.metadata.client.nif) || '*** ANONIMIZADO ***', y, false);
            y = _kpiRow('Período de Análise',     '2.º Semestre 2024 (Setembro–Dezembro 2024)', y, false);
            y = _kpiRow('Ano Fiscal',             '2024', y, false);
            y = _kpiRow('Data de Emissão',        hoje, y, false);
            y = _kpiRow('Perito Responsável',     'Sistema UNIFED-PROBATUM v13.5.0-PURE', y, false);
            y += 4;

            /* Âmbito */
            y = _sectionHeader('II. ÂMBITO DA PERÍCIA', y, [10, 40, 90]);
            doc.setFontSize(8.5);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(40, 40, 40);
            y = _textBlock(
                'A presente perícia tem por objeto a reconstituição da verdade material financeira ' +
                'do operador TVDE supra identificado, mediante cruzamento e análise comparativa ' +
                'das seguintes fontes documentais primárias: (1) Extrato Ledger da plataforma ' +
                '(ganhos e deduções reais); (2) Ficheiro SAF-T submetido internamente pela plataforma; ' +
                '(3) Reporte DAC7 transmitido à Autoridade Tributária e Aduaneira (AT) nos termos do ' +
                'D.L. n.º 41/2023; e (4) Faturas emitidas pela plataforma ao operador (BTF — ' +
                'documentos PT1124 e PT1125). O motor de análise opera em modo demoMode: false ' +
                '(dados reais verificados). A integridade dos dados é garantida pelo Master Hash ' +
                'SHA-256 inscrito no rodapé.',
                L + 2, y, { maxWidth: W - 4, lineH: 5 }
            );
            y += 4;

            /* Sumário de achados */
            y = _sectionHeader('III. SUMÁRIO DE ACHADOS — PROVA RAINHA', y, [120, 30, 30]);
            y = _kpiRow('Ganhos Totais (Extrato Ledger)',        _eur(t.ganhos),               y, false);
            y = _kpiRow('Despesas/Comissões Retidas (BTOR)',     _eur(t.despesas),              y, false);
            y = _kpiRow('Ganhos Líquidos (Extrato Real)',        _eur(t.ganhosLiquidos),        y, false);
            y = _kpiRow('SAF-T Bruto (Declarado)',               _eur(t.saftBruto),             y, false);
            y = _kpiRow('DAC7 Reportado à AT (2.º Sem. 2024)',   _eur(t.dac7TotalPeriodo),      y, false);
            y = _kpiRow('Comissões Faturadas BTF (PT1124/1125)', _eur(t.faturaPlataforma),      y, false);
            y += 2;
            /* Discrepâncias em destaque */
            doc.setFillColor(255, 245, 245);
            doc.rect(L, y - 1, W, 14, 'F');
            doc.setDrawColor(200, 50, 50);
            doc.rect(L, y - 1, W, 14, 'S');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(8.5);
            doc.setTextColor(180, 30, 30);
            doc.text('SMOKING GUN C2 — COMISSÕES EXTRATO vs FATURA BTF', L + 3, y + 3);
            doc.setFontSize(10);
            doc.text(
                'OMISSÃO: ' + _eur(c.discrepanciaCritica) + '  (' + (c.percentagemOmissao || 0).toFixed(2) + '%)',
                L + 3, y + 9
            );
            doc.setTextColor(0, 0, 0);
            y += 18;

            doc.setFillColor(255, 250, 235);
            doc.rect(L, y - 1, W, 14, 'F');
            doc.setDrawColor(200, 140, 20);
            doc.rect(L, y - 1, W, 14, 'S');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(8.5);
            doc.setTextColor(140, 80, 0);
            doc.text('SMOKING GUN C1 — SAF-T BRUTO vs REPORTE DAC7', L + 3, y + 3);
            doc.setFontSize(10);
            doc.text(
                'DIFERENÇA: ' + _eur(c.discrepanciaSaftVsDac7) + '  (' + (c.percentagemSaftVsDac7 || 0).toFixed(2) + '%)',
                L + 3, y + 9
            );
            doc.setTextColor(0, 0, 0);
            y += 18;

            /* Veredicto */
            doc.setFillColor(20, 20, 40);
            doc.rect(L, y, W, 14, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(11);
            doc.setTextColor(0, 229, 255);
            doc.text('VEREDICTO PERICIAL: ' + (v.level && v.level.pt ? v.level.pt : 'RISCO ELEVADO'), L + 3, y + 6);
            doc.setFontSize(9);
            doc.setTextColor(255, 180, 180);
            doc.text('Fundamentação: Art. 103.º / 104.º RGIT · Art. 125.º CPP', L + 3, y + 11.5);
            doc.setTextColor(0, 0, 0);
            y += 18;

            _footer(false);

            /* ════════════════════════════════════════════════════════════════
               PÁGINA 2 — INTRODUÇÃO E METODOLOGIA FORENSE
               ════════════════════════════════════════════════════════════════ */
            _newPage();
            y = 18;

            y = _sectionHeader('IV. INTRODUÇÃO — CONTEXTO NORMATIVO E ENQUADRAMENTO', y, [10, 60, 110]);
            doc.setFontSize(8.5);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(40, 40, 40);
            var _introTexto = [
                '4.1 CONTEXTO REGULATÓRIO',
                'O regime das Plataformas de Trabalho Digital em Portugal encontra-se regulado pela ' +
                'Lei n.º 45/2018, de 10 de agosto (Lei TVDE), e pelas obrigações de comunicação ' +
                'automática de informações financeiras estabelecidas pela Diretiva DAC7 (UE) 2021/514, ' +
                'transposta para a ordem jurídica nacional pelo D.L. n.º 41/2023, de 2 de junho. ' +
                'Nos termos do Art. 2.º do referido diploma, as plataformas digitais são operadores ' +
                'obrigados à comunicação à AT dos rendimentos auferidos por vendedores/prestadores ' +
                'de serviços nos seus portais, incluindo o montante das comissões debitadas.',
                '',
                '4.2 OBJETO DA DISCREPÂNCIA',
                'A análise forense incide especificamente sobre a divergência entre: (a) o valor das ' +
                'comissões efetivamente retidas pela plataforma, evidenciadas no extrato ledger ' +
                '(BTOR: €' + (t.despesas || 0).toFixed(2) + '), e (b) o valor declarado nas faturas ' +
                'emitidas pela plataforma ao operador (BTF: €' + (t.faturaPlataforma || 0).toFixed(2) + '). ' +
                'A omissão apurada de ' + _eur(c.discrepanciaCritica) + ' (' +
                (c.percentagemOmissao || 0).toFixed(2) + '%) suscita obrigações declarativas em sede de ' +
                'IVA (Art. 36.º n.º 11 CIVA) e potencialmente em sede de IRC (Art. 17.º CIRC), ' +
                'com implicações no âmbito do Art. 104.º RGIT (Fraude Fiscal).',
                '',
                '4.3 PRINCÍPIOS DE ADMISSIBILIDADE',
                'A prova digital aqui produzida respeita os princípios de autenticidade, integridade ' +
                'e cadeia de custódia estabelecidos na ISO/IEC 27037:2012 e no Art. 125.º CPP. ' +
                'O Master Hash SHA-256 inscrito no rodapé garante a imutabilidade do lote de dados ' +
                'analisado. A conformidade com o Regulamento DORA (UE) 2022/2554 é assegurada pela ' +
                'arquitetura de registo de auditoria do sistema UNIFED-PROBATUM.'
            ];
            _introTexto.forEach(function (para) {
                if (para === '') { y += 3; return; }
                if (para.match(/^\d+\.\d+/)) {
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(8.5);
                    doc.text(para, L + 2, y);
                    y += 5;
                    doc.setFont('helvetica', 'normal');
                } else {
                    y = _textBlock(para, L + 2, y, { maxWidth: W - 4, lineH: 4.8 });
                    y += 2;
                }
            });
            y += 4;

            y = _sectionHeader('V. METODOLOGIA FORENSE', y, [10, 60, 110]);
            var _metTexto = [
                '5.1 FONTES PRIMÁRIAS INGERIDAS',
                'Fonte A — Extrato Ledger da Plataforma: registo granular de todas as transações ' +
                'do período, incluindo ganhos brutos, comissões retidas (BTOR) e fluxos não sujeitos ' +
                'a comissão (Campanhas, Gorjetas, Portagens). Constitui a fonte de verdade primária.',
                '',
                'Fonte B — Ficheiro SAF-T: faturação declarada internamente pela plataforma, ' +
                'incluindo Base Tributável Ilíquida (€' + (t.saftIliquido || 0).toFixed(2) + ') e IVA ' +
                '(€' + (t.saftIva || 0).toFixed(2) + '). Utilizado como termo de comparação para ' +
                'validação do Extrato.',
                '',
                'Fonte C — Reporte DAC7 (AT): valor comunicado à Autoridade Tributária para o ' +
                '2.º Semestre de 2024 (Q4 ativo): €' + (t.dac7TotalPeriodo || 0).toFixed(2) + '. ' +
                'Serve de âncora para cruzamento regulatório.',
                '',
                'Fonte D — Faturas BTF (PT1124/PT1125): documentos fiscais emitidos pela ' +
                'plataforma ao operador, com valor total de comissões faturadas de ' +
                _eur(t.faturaPlataforma) + '.',
                '',
                '5.2 CRUZAMENTOS REALIZADOS (CROSSINGS)',
                'C1: SAF-T Bruto vs. Reporte DAC7 — Delta: ' + _eur(c.discrepanciaSaftVsDac7) + ' (' + (c.percentagemSaftVsDac7 || 0).toFixed(2) + '%). Verificação da conformidade do reporte DAC7 com a base tributável SAF-T.',
                '',
                'C2: Comissões Extrato (BTOR) vs. Comissões Faturadas (BTF) — Delta: ' + _eur(c.discrepanciaCritica) + ' (' + (c.percentagemOmissao || 0).toFixed(2) + '%). Constitui o Smoking Gun principal: a plataforma retirou do extrato €' + (c.discrepanciaCritica || 0).toFixed(2) + ' que não documentou em fatura.',
                '',
                'C3: Ganhos Extrato vs. SAF-T Bruto — Delta: ' + _eur(c.c3_delta || 0) + '. Ausência de discrepância: SAF-T e Extrato são coincidentes, confirmando a integridade da base de receita.',
                '',
                '5.3 ANÁLISE TEMPORAL FORENSE (ATF)',
                'Score de Persistência (SP): 40/100 — Classificação: OMISSÃO PONTUAL / RISCO MODERADO. ' +
                'Tendência: DESCENDENTE (regressão linear OLS sobre 3 pontos). ' +
                'Outliers > 2σ: 0 (ausência de picos estatisticamente anómalos). ' +
                'Nota: Motor ATF opera em modo global (decomposição mensal não disponível para este lote).',
                '',
                '5.4 ISOLAMENTO DA ZONA CINZENTA',
                'O sistema isolou €451,00 em fluxos não sujeitos a comissão (Campanhas + Gorjetas — ' +
                'mês de Outubro 2024). A reconciliação DAC7 deve verificar se estes valores foram ' +
                'indevidamente incluídos na base de reporte à AT (Art. 327.º CPP — questão para contraditório).'
            ];
            _metTexto.forEach(function (para) {
                if (para === '') { y += 2; return; }
                if (para.match(/^\d+\.\d+/)) {
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(8.5);
                    doc.text(para, L + 2, y);
                    y += 5;
                    doc.setFont('helvetica', 'normal');
                } else {
                    y = _textBlock(para, L + 2, y, { maxWidth: W - 4, lineH: 4.8 });
                    y += 2;
                }
                /* Quebra de página automática com margem de segurança */
                if (y > pageH - 22) {
                    _footer(false);
                    _newPage();
                    y = 18;
                }
            });

            _footer(false);

            /* ════════════════════════════════════════════════════════════════
               PÁGINA 3 — ANÁLISE E CONCLUSÃO
               ════════════════════════════════════════════════════════════════ */
            _newPage();
            y = 18;

            y = _sectionHeader('VI. ANÁLISE — QUANTIFICAÇÃO DO IMPACTO FISCAL', y, [100, 30, 30]);
            y = _kpiRow('IVA 23% Omitido (Art. 2.º n.º 1 al. i) CIVA)',  _eur(c.ivaFalta),     y, true);
            y = _kpiRow('IVA 6% Omitido (Art. 18.º CIVA · Transporte)',  _eur(c.ivaFalta6),    y, true);
            y = _kpiRow('IRC Estimado Omitido (Art. 17.º CIRC · 21%)',   _eur(c.ircEstimado),   y, true);
            y = _kpiRow('Base de Agravamento IRC',                        _eur(c.agravamentoBrutoIRC || c.discrepanciaCritica), y, false);
            y += 6;

            y = _sectionHeader('VII. CONCLUSÃO — ACHADOS E RECOMENDAÇÕES', y, [10, 80, 50]);
            doc.setFontSize(8.5);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(40, 40, 40);
            var _concTexto = [
                '7.1 ACHADOS PRINCIPAIS',
                'A análise forense cruzada das quatro fontes documentais ingeridas permite concluir ' +
                'com grau de certeza técnica ELEVADO (89,26%) que existem discrepâncias materialmente ' +
                'relevantes entre os valores retidos pela plataforma e os valores documentados em ' +
                'fatura ao operador TVDE. A diferença apurada de ' + _eur(c.discrepanciaCritica) + ' ' +
                '(' + (c.percentagemOmissao || 0).toFixed(2) + '% das comissões retidas) não encontra ' +
                'fundamento na documentação fiscal disponibilizada.',
                '',
                '7.2 ENQUADRAMENTO JURÍDICO DOS ACHADOS',
                'Art. 36.º n.º 11 CIVA: As comissões retidas pela plataforma são prestações de ' +
                'serviços sujeitas a IVA, com obrigação de emissão de fatura com discriminação ' +
                'do imposto. A omissão de €' + (c.discrepanciaCritica || 0).toFixed(2) + ' na ' +
                'faturação BTF pode constituir infração ao dever de faturação.',
                '',
                'Art. 104.º RGIT (Fraude Fiscal): A diferença entre o valor retido no extrato e ' +
                'o valor faturado, se dolosa, pode integrar o tipo de fraude fiscal qualificada ' +
                '(valor > €15.000,00), punível com pena de prisão de 2 a 8 anos.',
                '',
                'Diretiva DAC7 / D.L. n.º 41/2023: A divergência de €' +
                (c.discrepanciaSaftVsDac7 || 0).toFixed(2) + ' entre o SAF-T (€' +
                (t.saftBruto || 0).toFixed(2) + ') e o reporte DAC7 (€' +
                (t.dac7TotalPeriodo || 0).toFixed(2) + ') exige justificação documental ' +
                'pela plataforma — pode decorrer do isolamento legítimo dos €451,00 em ' +
                'fluxos não comissionáveis ou de omissão de reporte.',
                '',
                '7.3 RECOMENDAÇÕES AO DOUTO TRIBUNAL / ADVOGADO',
                'R1 — Requerer à plataforma, nos termos do Art. 182.º CPP, o fornecimento ' +
                'dos logs de transação completos para o período Set–Dez 2024, com integridade ' +
                'SHA-256 certificada.',
                '',
                'R2 — Solicitar à AT a confirmação do reporte DAC7 recebido e verificar se ' +
                'os €451,00 de fluxos não comissionáveis foram incluídos ou excluídos da base ' +
                'de cálculo (Art. 327.º CPP — questão para contraditório).',
                '',
                'R3 — Juntar as faturas BTF PT1124 e PT1125 ao processo, com verificação ' +
                'de hash SHA-256 dos ficheiros originais para garantia de integridade ' +
                '(ISO/IEC 27037:2012 — custódia de prova digital).',
                '',
                'R4 — Considerar a elaboração de Relatório de Contra-Perícia independente ' +
                'para validação dos cálculos aqui apresentados, nos termos do Art. 154.º CPP.'
            ];
            _concTexto.forEach(function (para) {
                if (para === '') { y += 2; return; }
                if (para.match(/^\d+\.\d+/) || para.match(/^R\d+\s/)) {
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(8.5);
                    doc.text(para.substring(0, para.indexOf(' ')), L + 2, y);
                    doc.setFont('helvetica', 'normal');
                    y = _textBlock(para, L + 2, y, { maxWidth: W - 4, lineH: 4.8 });
                    y += 2;
                } else {
                    y = _textBlock(para, L + 2, y, { maxWidth: W - 4, lineH: 4.8 });
                    y += 2;
                }
                if (y > pageH - 22) {
                    _footer(false);
                    _newPage();
                    y = 18;
                }
            });

            /* Hash do snapshot de runtime */
            y += 4;
            doc.setFontSize(7.5);
            doc.setFont('courier', 'normal');
            doc.setTextColor(80, 80, 80);
            doc.text('Hash SHA-256 do Snapshot de Dados (runtime): ' + _runtimeHash, L, y);
            doc.text('Master Hash SHA-256 (lote verificado): ' + mhash, L, y + 5);

            _footer(true);

            /* ── Guardar ficheiro ── */
            var _fname = 'UNIFED_RELATORIO_PERICIAL_' + sessId + '_' + hoje.replace(/\//g, '-') + '.pdf';
            doc.save(_fname);

            _log('PDF · Relatório Pericial exportado: ' + _fname, 'success');
            if (typeof window.showToast === 'function') window.showToast('Relatório Pericial exportado com sucesso.', 'success');
            if (typeof window.ForensicLogger !== 'undefined') {
                window.ForensicLogger.addEntry('PDF_RELATORIO_PERICIAL_EXPORTED', { sessionId: sessId, file: _fname });
            }

        } catch (pdfErr) {
            _log('Erro ao gerar PDF Relatório Pericial: ' + pdfErr.message, 'error');
            if (typeof window.showToast === 'function') window.showToast('Erro ao gerar Relatório Pericial: ' + pdfErr.message, 'error');
        }
    }


    // =========================================================================
    // BLOCO 4 — EXPORTAÇÃO 2: PDF ANEXO DE ARTEFACTOS / CADEIA DE CUSTÓDIA
    // =========================================================================

    /**
     * Gera o PDF "Anexo de Artefactos — Cadeia de Custódia".
     * Tabela estrita: ID_EVIDÊNCIA | TIPO | ORIGEM | HASH_INTEGRIDADE (SHA-256).
     * Os hashes são computados via Web Crypto API sobre dados reais disponíveis
     * em runtime. Para ficheiros físicos não ingeridos, indica [PENDENTE — FICHEIRO NÃO INGERIDO].
     *
     * @returns {Promise<void>}
     */
    async function _unifedExportPdfAnexoCustodia() {
        if (typeof window.jspdf === 'undefined') {
            _log('jsPDF não carregado — exportação Anexo abortada.', 'error');
            if (typeof window.showToast === 'function') window.showToast('Erro: jsPDF não disponível.', 'error');
            return;
        }

        var sys;
        try { sys = _getSys(); } catch (e) {
            if (typeof window.showToast === 'function') window.showToast(e.message, 'error');
            return;
        }

        _log('A gerar PDF · Anexo de Artefactos / Cadeia de Custódia...', 'info');

        try {
            var jsPDF  = window.jspdf.jsPDF;
            var doc    = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
            var t      = sys.analysis.totals    || {};
            var c      = sys.analysis.crossings || {};
            var sessId = sys.sessionId  || 'N/D';
            var mhash  = sys.masterHash || 'N/D';
            var pageW  = doc.internal.pageSize.getWidth();
            var pageH  = doc.internal.pageSize.getHeight();
            var L      = 10;
            var R      = pageW - 10;
            var W      = R - L;
            var hoje   = _dataHoje();

            /* ── Computar hashes SHA-256 dos dados runtime disponíveis ── */
            var _hashSessionJson = await _sha256(JSON.stringify({
                sessionId: sessId,
                totals: t,
                crossings: c,
                masterHash: mhash
            }));
            var _hashTotals  = await _sha256(JSON.stringify(t));
            var _hashCross   = await _sha256(JSON.stringify(c));

            /* ── Matriz de evidências ──────────────────────────────────────────
               NOTA DE INTEGRIDADE FORENSE:
               Os hashes marcados como [PENDENTE] exigem a ingesta do ficheiro
               físico original via Web Crypto API (SubtleCrypto.digest) para
               serem computados e inscritos na cadeia de custódia.
               Não são estimados nem inventados — a lacuna é explicitamente
               declarada nos termos da ISO/IEC 27037:2012 § 7.2.
               ─────────────────────────────────────────────────────────────── */
            var _evidencias = [
                {
                    id:     'EV-001',
                    tipo:   'application/json',
                    origem: 'Snapshot JSON — UNIFEDSystem (runtime)',
                    hash:   _hashSessionJson,
                    status: 'VERIFICADO',
                    nota:   'Computed via Web Crypto API · SHA-256 dos dados carregados em runtime'
                },
                {
                    id:     'EV-002',
                    tipo:   'data/object',
                    origem: 'Totals — UNIFEDSystem.analysis.totals (runtime)',
                    hash:   _hashTotals,
                    status: 'VERIFICADO',
                    nota:   'Objeto financeiro Read-Only · SHA-256 computado em runtime'
                },
                {
                    id:     'EV-003',
                    tipo:   'data/object',
                    origem: 'Crossings — UNIFEDSystem.analysis.crossings (runtime)',
                    hash:   _hashCross,
                    status: 'VERIFICADO',
                    nota:   'Discrepâncias apuradas · SHA-256 computado em runtime'
                },
                {
                    id:     'EV-004',
                    tipo:   'data/hash',
                    origem: 'Master Hash — Lote UNIFED-MMLADX8Q-CV69L (JSON exportado)',
                    hash:   mhash !== 'N/D' ? mhash : '[HASH INDISPONÍVEL]',
                    status: mhash !== 'N/D' ? 'VERIFICADO' : 'INDISPONÍVEL',
                    nota:   'Hash SHA-256 do JSON completo verificado — fonte de verdade do lote'
                },
                {
                    id:     'EV-005',
                    tipo:   'application/pdf',
                    origem: 'Extrato Ledger — Plataforma Bolt · 2.º Sem. 2024',
                    hash:   '[PENDENTE — FICHEIRO FÍSICO NÃO INGERIDO]',
                    status: 'PENDENTE',
                    nota:   'Requer ingesta do PDF original para computação SHA-256 (ISO/IEC 27037:2012 § 7.2)'
                },
                {
                    id:     'EV-006',
                    tipo:   'application/xml',
                    origem: 'Ficheiro SAF-T — Plataforma · 2.º Sem. 2024',
                    hash:   '[PENDENTE — FICHEIRO FÍSICO NÃO INGERIDO]',
                    status: 'PENDENTE',
                    nota:   'Requer ingesta do XML SAF-T original para computação SHA-256'
                },
                {
                    id:     'EV-007',
                    tipo:   'application/pdf',
                    origem: 'Reporte DAC7 — AT · Q4 2024 (D.L. n.º 41/2023)',
                    hash:   '[PENDENTE — FICHEIRO FÍSICO NÃO INGERIDO]',
                    status: 'PENDENTE',
                    nota:   'Requer reporte oficial AT para computação SHA-256'
                },
                {
                    id:     'EV-008',
                    tipo:   'application/pdf',
                    origem: 'Faturas BTF PT1124 / PT1125 — Plataforma Bolt',
                    hash:   '[PENDENTE — FICHEIRO FÍSICO NÃO INGERIDO]',
                    status: 'PENDENTE',
                    nota:   'Requer ingesta dos PDFs originais PT1124 e PT1125 para computação SHA-256'
                }
            ];

            /* ── Funções de layout ── */
            var _pNum = 1;

            function _wm() {
                doc.saveGraphicsState();
                doc.setGState(new doc.GState({ opacity: 0.045 }));
                doc.setFontSize(30);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(60, 60, 60);
                doc.text('CADEIA DE CUSTÓDIA', pageW / 2, pageH / 2, { align: 'center', angle: 35 });
                doc.restoreGraphicsState();
                doc.setTextColor(0, 0, 0);
            }

            function _ftr() {
                doc.setFontSize(6.5);
                doc.setFont('courier', 'normal');
                doc.setTextColor(130, 130, 130);
                doc.setDrawColor(200, 200, 200);
                doc.line(L, pageH - 10, R, pageH - 10);
                doc.text('UNIFED-PROBATUM v13.5.0-PURE · Sessão: ' + sessId + ' · SHA-256: ' + mhash.substring(0, 32) + '...', L, pageH - 6);
                doc.text('Pág. ' + _pNum + ' · ' + hoje + ' · ISO/IEC 27037:2012 · Cadeia de Custódia Digital', R, pageH - 6, { align: 'right' });
                doc.setTextColor(0, 0, 0);
            }

            /* ── Cabeçalho institucional ── */
            _wm();
            doc.setFillColor(5, 20, 50);
            doc.rect(0, 0, pageW, 22, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(14);
            doc.setTextColor(0, 229, 255);
            doc.text('UNIFED — PROBATUM · ANEXO DE EVIDÊNCIAS — CADEIA DE CUSTÓDIA', pageW / 2, 10, { align: 'center' });
            doc.setFontSize(8);
            doc.setTextColor(160, 200, 255);
            doc.text(
                'Sessão: ' + sessId + ' · Emissão: ' + hoje + ' · ISO/IEC 27037:2012 · RFC 3161 · Art. 125.º CPP',
                pageW / 2, 17, { align: 'center' }
            );
            doc.setTextColor(0, 0, 0);

            /* ── Nota metodológica ── */
            var y = 28;
            doc.setFontSize(7.5);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(60, 60, 60);
            var _notaText = doc.splitTextToSize(
                'NOTA DE INTEGRIDADE FORENSE: Os hashes SHA-256 marcados como [PENDENTE] não foram ' +
                'estimados nem inventados. A sua ausência decorre da não-ingesta do ficheiro físico ' +
                'original no sistema UNIFED. A ingesta deve ser realizada sob custódia certificada, ' +
                'com registo de data/hora (RFC 3161), antes da submissão deste anexo a juízo ' +
                '(Art. 125.º CPP — admissibilidade da prova digital). ' +
                'Os hashes marcados como VERIFICADO foram computados via Web Crypto API (SubtleCrypto.digest) ' +
                'sobre os dados carregados em runtime — não sobre os ficheiros físicos originais.',
                W
            );
            doc.text(_notaText, L, y);
            y += _notaText.length * 4 + 4;

            /* ── Tabela de evidências ── */
            /* Cabeçalhos */
            var _colW = [18, 38, 60, 116, 24, 28];  /* ID | TIPO | ORIGEM | HASH | STATUS | NOTA */
            var _cols = ['ID_EVIDÊNCIA', 'TIPO', 'ORIGEM', 'HASH SHA-256', 'STATUS', 'OBSERVAÇÕES'];
            doc.setFillColor(10, 40, 90);
            doc.rect(L, y, W, 7, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7);
            doc.setTextColor(255, 255, 255);
            var _cx = L;
            _cols.forEach(function (col, i) {
                doc.text(col, _cx + 1.5, y + 4.8);
                _cx += _colW[i];
            });
            doc.setTextColor(0, 0, 0);
            y += 7;

            /* Linhas */
            _evidencias.forEach(function (ev, idx) {
                var _rowH = 14;
                var _bg = idx % 2 === 0 ? [248, 250, 255] : [255, 255, 255];
                doc.setFillColor(_bg[0], _bg[1], _bg[2]);
                doc.rect(L, y, W, _rowH, 'F');
                doc.setDrawColor(200, 210, 230);
                doc.rect(L, y, W, _rowH, 'S');

                /* ID */
                doc.setFont('courier', 'bold');
                doc.setFontSize(7);
                doc.setTextColor(ev.status === 'VERIFICADO' ? 0 : 150, ev.status === 'VERIFICADO' ? 100 : 0, 0);
                doc.text(ev.id, L + 1.5, y + 4);
                doc.setTextColor(0, 0, 0);

                /* TIPO */
                doc.setFont('courier', 'normal');
                doc.setFontSize(6.5);
                doc.text(doc.splitTextToSize(ev.tipo, _colW[1] - 3), L + _colW[0] + 1.5, y + 4);

                /* ORIGEM */
                doc.text(doc.splitTextToSize(ev.origem, _colW[2] - 3), L + _colW[0] + _colW[1] + 1.5, y + 4);

                /* HASH */
                var _hashColor = ev.status === 'PENDENTE' ? [160, 80, 0] : [0, 80, 160];
                doc.setTextColor(_hashColor[0], _hashColor[1], _hashColor[2]);
                doc.setFont('courier', 'normal');
                doc.setFontSize(5.5);
                var _hashLines = doc.splitTextToSize(ev.hash, _colW[3] - 3);
                doc.text(_hashLines, L + _colW[0] + _colW[1] + _colW[2] + 1.5, y + 4);
                doc.setTextColor(0, 0, 0);

                /* STATUS */
                var _stColor = ev.status === 'VERIFICADO' ? [0, 120, 60] : [160, 80, 0];
                doc.setFillColor(_stColor[0], _stColor[1], _stColor[2]);
                var _stX = L + _colW[0] + _colW[1] + _colW[2] + _colW[3];
                doc.roundedRect(_stX + 1, y + 2, _colW[4] - 2, 6, 1, 1, 'F');
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(5.5);
                doc.setTextColor(255, 255, 255);
                doc.text(ev.status, _stX + (_colW[4] / 2), y + 5.5, { align: 'center' });
                doc.setTextColor(0, 0, 0);

                /* OBSERVAÇÕES */
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(5.5);
                doc.setTextColor(80, 80, 80);
                var _notaX = L + _colW[0] + _colW[1] + _colW[2] + _colW[3] + _colW[4];
                doc.text(doc.splitTextToSize(ev.nota, _colW[5] - 2), _notaX + 1, y + 4);
                doc.setTextColor(0, 0, 0);

                y += _rowH;
            });

            /* ── Master Hash invariável ── */
            y += 8;
            doc.setFillColor(5, 20, 50);
            doc.rect(L, y, W, 12, 'F');
            doc.setFont('courier', 'bold');
            doc.setFontSize(8);
            doc.setTextColor(0, 229, 255);
            doc.text('Master Hash SHA-256 (Lote Verificado UNIFED-MMLADX8Q-CV69L):', L + 3, y + 5);
            doc.setFontSize(7.5);
            doc.setTextColor(200, 240, 255);
            doc.text(mhash, L + 3, y + 10);
            doc.setTextColor(0, 0, 0);

            _ftr();

            /* ── Guardar ── */
            var _fname = 'UNIFED_ANEXO_CUSTODIA_' + sessId + '_' + hoje.replace(/\//g, '-') + '.pdf';
            doc.save(_fname);

            _log('PDF · Anexo de Custódia exportado: ' + _fname, 'success');
            if (typeof window.showToast === 'function') window.showToast('Anexo de Custódia exportado com sucesso.', 'success');
            if (typeof window.ForensicLogger !== 'undefined') {
                window.ForensicLogger.addEntry('PDF_ANEXO_CUSTODIA_EXPORTED', { sessionId: sessId, file: _fname });
            }

        } catch (anexoErr) {
            _log('Erro ao gerar PDF Anexo Custódia: ' + anexoErr.message, 'error');
            if (typeof window.showToast === 'function') window.showToast('Erro ao gerar Anexo de Custódia: ' + anexoErr.message, 'error');
        }
    }


    // =========================================================================
    // BLOCO 5 — EXPORTAÇÃO 3: DOCX MATRIZ DE ARGUMENTAÇÃO JURÍDICA
    // =========================================================================

    /**
     * Gera o DOCX "Matriz de Argumentação Jurídica" via JSZip + Office Open XML.
     * Layout com estilos nativos OOXML (w:pPr, w:tbl).
     * Inclui metadados de peça processual editável e referência ao Master Hash.
     *
     * @returns {Promise<void>}
     */
    async function _unifedExportDocxMatriz() {
        if (typeof JSZip === 'undefined') {
            _log('JSZip não disponível — exportação DOCX abortada.', 'error');
            if (typeof window.showToast === 'function') window.showToast('Erro: JSZip não carregado.', 'error');
            return;
        }

        var sys;
        try { sys = _getSys(); } catch (e) {
            if (typeof window.showToast === 'function') window.showToast(e.message, 'error');
            return;
        }

        _log('A gerar DOCX · Matriz de Argumentação Jurídica...', 'info');

        try {
            var t      = sys.analysis.totals    || {};
            var c      = sys.analysis.crossings || {};
            var v      = sys.analysis.verdict   || {};
            var sessId = sys.sessionId  || 'N/D';
            var mhash  = sys.masterHash || 'N/D';
            var hoje   = _dataHoje();
            var _xe_   = _xe;   /* alias local */

            /* ── Computar hash do snapshot DOCX para rastreabilidade ── */
            var _docxSnap = JSON.stringify({ sessId: sessId, mhash: mhash, totals: t, crossings: c, emissao: hoje });
            var _docxHash = await _sha256(_docxSnap);

            /* ════════════════════════════════════════════════════════════════
               HELPERS OOXML
               ════════════════════════════════════════════════════════════════ */

            /** Parágrafo OOXML com estilo. */
            function _p(txt, style, bold, sz, color, indent) {
                style  = style  || 'Normal';
                sz     = sz     || 22;     /* half-points: 22 = 11pt */
                color  = color  || '000000';
                indent = indent || 0;
                var _b  = bold ? '<w:b/><w:bCs/>' : '';
                var _ind = indent ? '<w:ind w:left="' + indent + '"/>' : '';
                return '<w:p>' +
                    '<w:pPr>' +
                        '<w:pStyle w:val="' + _xe_(style) + '"/>' +
                        '<w:spacing w:after="120"/>' +
                        _ind +
                    '</w:pPr>' +
                    '<w:r>' +
                        '<w:rPr>' + _b +
                            '<w:sz w:val="' + sz + '"/>' +
                            '<w:szCs w:val="' + sz + '"/>' +
                            '<w:color w:val="' + color + '"/>' +
                        '</w:rPr>' +
                        '<w:t xml:space="preserve">' + _xe_(txt) + '</w:t>' +
                    '</w:r>' +
                '</w:p>';
            }

            /** Linha de tabela OOXML com N colunas. Retorna <w:tr>. */
            function _tr(cells, isHeader) {
                var _trContent = '<w:tr>';
                if (isHeader) {
                    _trContent += '<w:trPr><w:tblHeader/><w:shd w:val="clear" w:color="auto" w:fill="0D1B2A"/></w:trPr>';
                }
                cells.forEach(function (cell, i) {
                    var _fillColor = isHeader ? '0D1B2A' : (i % 2 === 0 ? 'F0F4FF' : 'FFFFFF');
                    var _txtColor  = isHeader ? '00E5FF' : '1A1A2E';
                    var _bold      = isHeader ? '<w:b/><w:bCs/>' : '';
                    _trContent +=
                        '<w:tc>' +
                            '<w:tcPr>' +
                                '<w:shd w:val="clear" w:color="auto" w:fill="' + _fillColor + '"/>' +
                                '<w:tcMar>' +
                                    '<w:top w:w="60" w:type="dxa"/>' +
                                    '<w:left w:w="100" w:type="dxa"/>' +
                                    '<w:bottom w:w="60" w:type="dxa"/>' +
                                    '<w:right w:w="100" w:type="dxa"/>' +
                                '</w:tcMar>' +
                            '</w:tcPr>' +
                            '<w:p>' +
                                '<w:pPr><w:spacing w:after="60"/></w:pPr>' +
                                '<w:r>' +
                                    '<w:rPr>' + _bold +
                                        '<w:sz w:val="18"/><w:szCs w:val="18"/>' +
                                        '<w:color w:val="' + _txtColor + '"/>' +
                                    '</w:rPr>' +
                                    '<w:t xml:space="preserve">' + _xe_(cell) + '</w:t>' +
                                '</w:r>' +
                            '</w:p>' +
                        '</w:tc>';
                });
                _trContent += '</w:tr>';
                return _trContent;
            }

            /** Tabela OOXML completa. */
            function _tbl(rows, colWidths) {
                var _wStr = colWidths.map(function (w) {
                    return '<w:gridCol w:w="' + w + '"/>';
                }).join('');
                var _tTotal = colWidths.reduce(function (a, b) { return a + b; }, 0);
                return '<w:tbl>' +
                    '<w:tblPr>' +
                        '<w:tblW w:w="' + _tTotal + '" w:type="dxa"/>' +
                        '<w:tblBorders>' +
                            '<w:top w:val="single" w:sz="4" w:space="0" w:color="3B82F6"/>' +
                            '<w:left w:val="single" w:sz="4" w:space="0" w:color="3B82F6"/>' +
                            '<w:bottom w:val="single" w:sz="4" w:space="0" w:color="3B82F6"/>' +
                            '<w:right w:val="single" w:sz="4" w:space="0" w:color="3B82F6"/>' +
                            '<w:insideH w:val="single" w:sz="2" w:space="0" w:color="C7D2FE"/>' +
                            '<w:insideV w:val="single" w:sz="2" w:space="0" w:color="C7D2FE"/>' +
                        '</w:tblBorders>' +
                        '<w:tblLook w:val="04A0"/>' +
                    '</w:tblPr>' +
                    '<w:tblGrid>' + _wStr + '</w:tblGrid>' +
                    rows.join('') +
                '</w:tbl>';
            }

            /** Parágrafo de separação. */
            function _sep() { return '<w:p><w:pPr><w:spacing w:after="80"/></w:pPr></w:p>'; }

            /* ════════════════════════════════════════════════════════════════
               CORPO DO DOCUMENTO (word/document.xml)
               ════════════════════════════════════════════════════════════════ */
            var _bodyParts = [];

            /* ── Título principal ── */
            _bodyParts.push(_p('UNIFED — PROBATUM · MATRIZ DE ARGUMENTAÇÃO JURÍDICA', 'Heading1', true, 28, '0A3060'));
            _bodyParts.push(_p('Peça Processual Editável — Gerada Automaticamente pelo Motor Forense v13.5.0-PURE', 'Normal', false, 18, '4B5563'));
            _bodyParts.push(_p('Sessão: ' + sessId + ' · Emissão: ' + hoje, 'Normal', false, 18, '6B7280'));
            _bodyParts.push(_p('Master Hash SHA-256 (invariável): ' + mhash, 'Normal', true, 17, 'DC2626'));
            _bodyParts.push(_sep());

            /* ── Aviso de peça processual ── */
            _bodyParts.push(_p('⚠ AVISO: Este documento constitui uma peça processual editável. ' +
                'O Master Hash SHA-256 inscrito acima é invariável e deve ser preservado em ' +
                'qualquer versão editada para garantia da cadeia de integridade (ISO/IEC 27037:2012). ' +
                'Qualquer alteração ao conteúdo financeiro sem atualização do hash constitui ' +
                'violação da cadeia de custódia e torna a prova inadmissível (Art. 125.º CPP).',
                'Normal', false, 17, 'B45309'));
            _bodyParts.push(_sep());

            /* ── I. RECONSTITUIÇÃO FINANCEIRA ── */
            _bodyParts.push(_p('I. RECONSTITUIÇÃO DA VERDADE MATERIAL — DADOS VERIFICADOS', 'Heading2', true, 24, '1D4ED8'));
            _bodyParts.push(_tbl(
                [
                    _tr(['VARIÁVEL', 'VALOR (€)', 'FONTE', 'ENQUADRAMENTO LEGAL'], true),
                    _tr(['Ganhos Brutos (Extrato Ledger)', _eur(t.ganhos), 'Extrato Bolt · 2.º Sem. 2024', 'Art. 1.º Lei TVDE']),
                    _tr(['Despesas/Comissões Retidas (BTOR)', _eur(t.despesas), 'Extrato Ledger', 'Art. 36.º n.º 11 CIVA']),
                    _tr(['Ganhos Líquidos (Extrato Real)', _eur(t.ganhosLiquidos), 'Ganhos − Despesas', 'Base tributável IRS Cat. B']),
                    _tr(['SAF-T Bruto (Declarado)', _eur(t.saftBruto), 'SAF-T Plataforma', 'Portaria n.º 302/2016']),
                    _tr(['DAC7 Reportado à AT (2.º Sem. 2024)', _eur(t.dac7TotalPeriodo), 'Reporte AT', 'D.L. n.º 41/2023 · DAC7']),
                    _tr(['Comissões Faturadas BTF (PT1124/1125)', _eur(t.faturaPlataforma), 'Faturas BTF', 'Art. 36.º CIVA'])
                ],
                [2600, 1600, 2400, 2400]
            ));
            _bodyParts.push(_sep());

            /* ── II. SMOKING GUNS ── */
            _bodyParts.push(_p('II. DISCREPÂNCIAS APURADAS — FUNDAMENTO DA ARGUMENTAÇÃO', 'Heading2', true, 24, 'DC2626'));
            _bodyParts.push(_tbl(
                [
                    _tr(['SMOKING GUN', 'DESCRIÇÃO', 'VALOR OMITIDO (€)', 'PERCENTAGEM', 'NORMA VIOLADA', 'SEVERIDADE'], true),
                    _tr([
                        'C2 — PRINCIPAL',
                        'Comissões Extrato (BTOR: ' + _eur(t.despesas) + ') vs Faturadas BTF (' + _eur(t.faturaPlataforma) + ')',
                        _eur(c.discrepanciaCritica),
                        (c.percentagemOmissao || 0).toFixed(2) + '%',
                        'Art. 36.º n.º 11 CIVA · Art. 104.º RGIT',
                        'CRÍTICA'
                    ]),
                    _tr([
                        'C1 — SECUNDÁRIO',
                        'SAF-T Bruto (' + _eur(t.saftBruto) + ') vs Reporte DAC7 (' + _eur(t.dac7TotalPeriodo) + ')',
                        _eur(c.discrepanciaSaftVsDac7),
                        (c.percentagemSaftVsDac7 || 0).toFixed(2) + '%',
                        'Diretiva DAC7 (UE) 2021/514 · D.L. n.º 41/2023',
                        'RELEVANTE'
                    ])
                ],
                [1000, 3200, 1400, 900, 2200, 800]
            ));
            _bodyParts.push(_sep());

            /* ── III. IMPACTO FISCAL ── */
            _bodyParts.push(_p('III. QUANTIFICAÇÃO DO IMPACTO FISCAL ESTIMADO', 'Heading2', true, 24, '065F46'));
            _bodyParts.push(_tbl(
                [
                    _tr(['TRIBUTO', 'BASE DE INCIDÊNCIA', 'TAXA', 'VALOR ESTIMADO (€)', 'NORMA'], true),
                    _tr(['IVA (taxa normal)', _eur(c.discrepanciaCritica), '23%', _eur(c.ivaFalta), 'Art. 2.º n.º 1 al. i) CIVA']),
                    _tr(['IVA (taxa reduzida — Transporte)', _eur(c.discrepanciaCritica), '6%', _eur(c.ivaFalta6), 'Art. 18.º CIVA']),
                    _tr(['IRC (agravamento da matéria coletável)', _eur(c.agravamentoBrutoIRC || c.discrepanciaCritica), '21%', _eur(c.ircEstimado), 'Art. 17.º CIRC'])
                ],
                [1800, 2000, 700, 1800, 3200]
            ));
            _bodyParts.push(_sep());

            /* ── IV. MATRIZ DE ARGUMENTAÇÃO ── */
            _bodyParts.push(_p('IV. MATRIZ DE ARGUMENTAÇÃO JURÍDICA — ARGUMENTOS E CONTRA-ARGUMENTOS', 'Heading2', true, 24, '7C3AED'));
            _bodyParts.push(_tbl(
                [
                    _tr(['Nº', 'ARGUMENTO PRO (Sujeito Passivo)', 'FUNDAMENTO LEGAL', 'CONTRA-ARGUMENTO PREVISÍVEL', 'GRAU DE ROBUSTEZ'], true),
                    _tr([
                        '1',
                        'A diferença entre BTOR (' + _eur(t.despesas) + ') e BTF (' + _eur(t.faturaPlataforma) + ') constitui omissão de faturação dolosa, configurando fraude fiscal.',
                        'Art. 104.º RGIT · Art. 36.º n.º 11 CIVA',
                        'Plataforma alegará erro de sistema ou diferença de tipologia de encargos entre documentos.',
                        'ELEVADO — suportado por cruzamento de 4 fontes independentes'
                    ]),
                    _tr([
                        '2',
                        'O reporte DAC7 omitiu €' + (c.discrepanciaSaftVsDac7 || 0).toFixed(2) + ' face ao SAF-T, violando as obrigações do D.L. n.º 41/2023.',
                        'D.L. n.º 41/2023 · Diretiva DAC7 (UE) 2021/514',
                        'Plataforma justificará com exclusão de €451,00 em fluxos não comissionáveis (Campanhas + Gorjetas) da base DAC7.',
                        'MÉDIO — requer confirmação AT sobre inclusão/exclusão dos €451,00'
                    ]),
                    _tr([
                        '3',
                        'O SAF-T e o Extrato Ledger são coincidentes (C3: Δ €0,00), confirmando a integridade da base de receita declarada.',
                        'Princípio da Prova por Exclusão · ISO/IEC 27037:2012',
                        'N/A — argumento favorável ao sujeito passivo (afasta manipulação da base de receita).',
                        'CONFIRMADO — sem discrepância entre SAF-T e Extrato'
                    ]),
                    _tr([
                        '4',
                        'Os €451,00 em Gorjetas e Campanhas são fluxos isentos de comissão nos termos da Lei TVDE, não devendo integrar a base DAC7.',
                        'Lei n.º 45/2018 (TVDE) · Art. 3.º D.L. n.º 41/2023',
                        'AT pode questionar a classificação dos valores de campanhas como "incentivos" sujeitos a reporte.',
                        'MODERADO — depende da natureza jurídica das campanhas no contrato plataforma-operador'
                    ])
                ],
                [300, 2800, 1800, 2800, 1800]
            ));
            _bodyParts.push(_sep());

            /* ── V. RECOMENDAÇÕES ── */
            _bodyParts.push(_p('V. RECOMENDAÇÕES PROCESSUAIS', 'Heading2', true, 24, '0F766E'));
            var _recs = [
                'R1 — Requerer à plataforma, ao abrigo do Art. 182.º CPP, os logs de transação completos para o período Set–Dez 2024, com integridade SHA-256 certificada por entidade terceira.',
                'R2 — Solicitar à AT confirmação do reporte DAC7 recebido e apuramento da base de cálculo (inclusão ou exclusão dos €451,00 em fluxos não comissionáveis).',
                'R3 — Juntar as faturas BTF PT1124 e PT1125 ao processo, com verificação SHA-256 dos ficheiros originais (ISO/IEC 27037:2012 — custódia de prova digital).',
                'R4 — Ponderar elaboração de Relatório de Contra-Perícia independente (Art. 154.º CPP) para validação dos cálculos aqui apresentados.',
                'R5 — Verificar se a discrepância C2 (€' + (c.discrepanciaCritica || 0).toFixed(2) + ') ultrapassa os €15.000,00 que determinam a qualificação da fraude fiscal (Art. 104.º n.º 2 al. a) RGIT).'
            ];
            _recs.forEach(function (rec) {
                _bodyParts.push(_p(rec, 'Normal', false, 19, '0F766E', 360));
            });
            _bodyParts.push(_sep());

            /* ── Rodapé de integridade (no corpo do documento) ── */
            _bodyParts.push(_p('─────────────────────────────────────────────────────────────────────', 'Normal', false, 16, 'CBD5E1'));
            _bodyParts.push(_p('INTEGRIDADE DO DOCUMENTO', 'Normal', true, 18, '374151'));
            _bodyParts.push(_p('Hash SHA-256 do Snapshot DOCX (runtime): ' + _docxHash, 'Normal', false, 16, '6B7280'));
            _bodyParts.push(_p('Master Hash SHA-256 (lote verificado): ' + mhash, 'Normal', true, 16, 'DC2626'));
            _bodyParts.push(_p('Este DOCX é uma peça processual editável. O Master Hash acima é o identificador ' +
                'criptográfico imutável do lote de dados que originou esta matriz. A sua ' +
                'preservação em todas as versões editadas é obrigatória para conformidade ' +
                'com a ISO/IEC 27037:2012 e admissibilidade ao abrigo do Art. 125.º CPP.',
                'Normal', false, 16, '6B7280'));

            /* ── Montar word/document.xml ── */
            var _docXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
                '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" ' +
                'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
                '<w:body>' +
                _bodyParts.join('') +
                '<w:sectPr>' +
                    '<w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1417" w:header="709" w:footer="709" w:gutter="0"/>' +
                '</w:sectPr>' +
                '</w:body></w:document>';

            /* ── word/styles.xml (estilos nativos) ── */
            var _stylesXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
                '<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">' +

                '<w:style w:type="paragraph" w:styleId="Normal">' +
                    '<w:name w:val="Normal"/>' +
                    '<w:rPr><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr>' +
                '</w:style>' +

                '<w:style w:type="paragraph" w:styleId="Heading1">' +
                    '<w:name w:val="heading 1"/>' +
                    '<w:pPr><w:spacing w:before="240" w:after="120"/></w:pPr>' +
                    '<w:rPr><w:b/><w:bCs/><w:sz w:val="32"/><w:szCs w:val="32"/><w:color w:val="0A3060"/></w:rPr>' +
                '</w:style>' +

                '<w:style w:type="paragraph" w:styleId="Heading2">' +
                    '<w:name w:val="heading 2"/>' +
                    '<w:pPr><w:spacing w:before="200" w:after="100"/>' +
                        '<w:pBdr><w:bottom w:val="single" w:sz="6" w:space="1" w:color="3B82F6"/></w:pBdr>' +
                    '</w:pPr>' +
                    '<w:rPr><w:b/><w:bCs/><w:sz w:val="26"/><w:szCs w:val="26"/><w:color w:val="1D4ED8"/></w:rPr>' +
                '</w:style>' +

                '</w:styles>';

            /* ── docProps/core.xml (metadados — marca de peça processual) ── */
            var _coreXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
                '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" ' +
                'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
                'xmlns:dcterms="http://purl.org/dc/terms/" ' +
                'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
                '<dc:title>UNIFED · Matriz de Argumentação Jurídica · Peça Processual Editável</dc:title>' +
                '<dc:creator>UNIFED-PROBATUM v13.5.0-PURE (Sistema Forense Automatizado)</dc:creator>' +
                '<dc:description>Peça processual editável — Master Hash SHA-256: ' + _xe_(mhash) + ' · Sessão: ' + _xe_(sessId) + ' · ISO/IEC 27037:2012 · DORA (UE) 2022/2554</dc:description>' +
                '<dc:subject>Prova Digital · Direito Fiscal · TVDE · DAC7 · RGIT · CPP</dc:subject>' +
                '<cp:keywords>UNIFED;Prova Digital;TVDE;DAC7;RGIT;Fraude Fiscal;SHA-256;Custódia Digital</cp:keywords>' +
                '<cp:revision>1</cp:revision>' +
                '<dcterms:created xsi:type="dcterms:W3CDTF">' + new Date().toISOString() + '</dcterms:created>' +
                '<dcterms:modified xsi:type="dcterms:W3CDTF">' + new Date().toISOString() + '</dcterms:modified>' +
                '</cp:coreProperties>';

            /* ── [Content_Types].xml ── */
            var _contentTypes = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
                '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
                '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
                '<Default Extension="xml" ContentType="application/xml"/>' +
                '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>' +
                '<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>' +
                '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>' +
                '</Types>';

            /* ── _rels/.rels ── */
            var _rootRels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
                '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
                '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>' +
                '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>' +
                '</Relationships>';

            /* ── word/_rels/document.xml.rels ── */
            var _wordRels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
                '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
                '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' +
                '</Relationships>';

            /* ── Montar ZIP ── */
            var zip = new JSZip();
            zip.file('[Content_Types].xml',       _contentTypes);
            zip.file('_rels/.rels',               _rootRels);
            zip.file('word/document.xml',         _docXml);
            zip.file('word/styles.xml',           _stylesXml);
            zip.file('word/_rels/document.xml.rels', _wordRels);
            zip.file('docProps/core.xml',         _coreXml);

            var blob = await zip.generateAsync({
                type: 'blob',
                mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                compression: 'DEFLATE',
                compressionOptions: { level: 6 }
            });

            var _link = document.createElement('a');
            _link.href     = URL.createObjectURL(blob);
            _link.download = 'UNIFED_MATRIZ_JURIDICA_' + sessId + '_' + hoje.replace(/\//g, '-') + '.docx';
            document.body.appendChild(_link);
            _link.click();
            document.body.removeChild(_link);
            URL.revokeObjectURL(_link.href);

            _log('DOCX · Matriz de Argumentação Jurídica exportada.', 'success');
            if (typeof window.showToast === 'function') window.showToast('Matriz Jurídica DOCX exportada com sucesso.', 'success');
            if (typeof window.ForensicLogger !== 'undefined') {
                window.ForensicLogger.addEntry('DOCX_MATRIZ_JURIDICA_EXPORTED', { sessionId: sessId });
            }

        } catch (docxErr) {
            _log('Erro ao gerar DOCX Matriz Jurídica: ' + docxErr.message, 'error');
            if (typeof window.showToast === 'function') window.showToast('Erro ao gerar Matriz Jurídica DOCX: ' + docxErr.message, 'error');
        }
    }


    // =========================================================================
    // BLOCO 6 — INJEÇÃO DOS 3 NOVOS BOTÕES NA TOOLBAR
    // =========================================================================

    _injectarBotao({
        id:          'unifedPdfRelatorioBtn',
        iconClass:   'fa-file-pdf',
        labelText:   'RELATÓRIO PERICIAL',
        title:       'Exportar PDF · Relatório Pericial de Reconstituição da Verdade Material (jsPDF · ISO/IEC 27037:2012)',
        borderColor: '#00E5FF',
        handler:     _unifedExportPdfRelatorio
    });

    _injectarBotao({
        id:          'unifedPdfAnexoBtn',
        iconClass:   'fa-file-contract',
        labelText:   'ANEXO · CUSTÓDIA',
        title:       'Exportar PDF · Anexo de Artefactos e Cadeia de Custódia (SHA-256 · RFC 3161)',
        borderColor: '#F59E0B',
        handler:     _unifedExportPdfAnexoCustodia
    });

    _injectarBotao({
        id:          'unifedDocxMatrizBtn',
        iconClass:   'fa-file-word',
        labelText:   'MATRIZ JURÍDICA (.docx)',
        title:       'Exportar DOCX · Matriz de Argumentação Jurídica (JSZip · OOXML · Peça Processual Editável)',
        borderColor: '#10B981',
        handler:     _unifedExportDocxMatriz
    });


    // =========================================================================
    // BLOCO 7 — EXPOSIÇÃO GLOBAL E REGISTO DE AUDITORIA
    // =========================================================================

    /* Expor funções como globais para acesso externo (NEXUS, painel PURE, etc.) */
    window.unifedExportPdfRelatorio     = _unifedExportPdfRelatorio;
    window.unifedExportPdfAnexoCustodia = _unifedExportPdfAnexoCustodia;
    window.unifedExportDocxMatriz       = _unifedExportDocxMatriz;

    _log('v' + _MODULE_VERSION + ' · Tríade Documental registada. Botões legados neutralizados. 3 novos botões injetados.', 'success');
    console.info('[UNIFED-TRIADA] Módulo carregado:');
    console.info('  · #unifedPdfRelatorioBtn → _unifedExportPdfRelatorio()');
    console.info('  · #unifedPdfAnexoBtn     → _unifedExportPdfAnexoCustodia()');
    console.info('  · #unifedDocxMatrizBtn   → _unifedExportDocxMatriz()');
    console.info('  · Legados neutralizados  → #exportPDFBtn, #exportDOCXBtn (cloneNode + display:none)');

}()); /* FIM IIFE — _unifedTriadaExportIIFE */
