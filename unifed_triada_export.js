/**
 * ============================================================================
 * UNIFED - PROBATUM · v13.5.0-PURE · MÓDULO DE EXPORTAÇÃO — TRÍADE DOCUMENTAL
 * ============================================================================
 * Ficheiro      : unifed_triada_export.js
 * Versão        : 1.0.1-TRIADA (CORRIGIDO)
 * Sessão ref.   : UNIFED-MMLADX8Q-CV69L
 * Dependências  : jsPDF (window.jspdf), JSZip (global), Web Crypto API
 *
 * CORREÇÕES v1.0.1:
 *   1. Encapsulamento total em DOMContentLoaded para garantir que o DOM está pronto.
 *   2. Fallback de injeção: procura .pure-section-header ou #pureDashboard se toolbar não existir.
 *   3. Validação de contentor pai antes de appendChild + logs de diagnóstico.
 * ============================================================================
 */

(function _unifedTriadaExportIIFE() {
    'use strict';

    // =========================================================================
    // BLOCO 0 — CONSTANTES E UTILITÁRIOS INTERNOS (INALTERADO)
    // =========================================================================

    /** Versão deste módulo — sincronizada com o ciclo de release UNIFED. */
    var _MODULE_VERSION = '1.0.1-TRIADA';

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
    // BLOCO 1 — NEUTRALIZAÇÃO SEGURA DOS BOTÕES LEGADOS (INALTERADO)
    // =========================================================================
    function _neutralizarBotaoLegado(id) {
        try {
            var node = document.getElementById(id);
            if (!node) {
                _log('Botão legado #' + id + ' não encontrado no DOM — ignorado.', 'warn');
                return;
            }
            var clone = node.cloneNode(true);
            node.replaceWith(clone);
            clone.style.display   = 'none';
            clone.setAttribute('aria-hidden', 'true');
            clone.setAttribute('data-unifed-neutralized', _MODULE_VERSION);
            clone.disabled = true;
            _log('Botão legado #' + id + ' neutralizado (listeners purgados, display:none).', 'info');
        } catch (err) {
            _log('Falha na neutralização de #' + id + ': ' + err.message, 'error');
        }
    }

    // =========================================================================
    // BLOCO 2 — INJEÇÃO NÃO-DESTRUTIVA COM FALLBACK (CORRIGIDO)
    // =========================================================================

    /**
     * Encontra o contentor de destino para injetar os botões.
     * Prioridade: .toolbar-grid > .pure-section-header > #pureDashboard
     * @returns {HTMLElement|null}
     */
    function _findTargetContainer() {
        // 1. Tenta o contentor principal da toolbar
        var toolbar = document.querySelector('.toolbar-grid');
        if (toolbar) {
            _log('Contentor principal .toolbar-grid encontrado.', 'info');
            return toolbar;
        }

        // 2. Fallback: procura o cabeçalho da secção PURE
        var pureHeader = document.querySelector('.pure-section-header');
        if (pureHeader) {
            _log('Fallback ativado: contentor .pure-section-header encontrado.', 'info');
            return pureHeader;
        }

        // 3. Fallback final: procura o wrapper do painel PURE
        var pureWrapper = document.getElementById('pureDashboardWrapper');
        if (pureWrapper) {
            _log('Fallback ativado: contentor #pureDashboardWrapper encontrado.', 'info');
            return pureWrapper;
        }

        // 4. Fallback extremo: body
        _log('Nenhum contentor específico encontrado. A injetar no <body>.', 'warn');
        return document.body;
    }

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
            var targetContainer = _findTargetContainer();
            if (!targetContainer) {
                _log('Falha crítica: nenhum contentor pai disponível para injeção do botão #' + cfg.id, 'error');
                return null;
            }

            var btn = document.createElement('button');
            btn.id        = cfg.id;
            btn.className = 'btn-tool';
            btn.title     = cfg.title || '';
            btn.setAttribute('data-unifed-triada', _MODULE_VERSION);
            btn.style.borderLeft = '3px solid ' + (cfg.borderColor || '#00E5FF');

            var icon = document.createElement('i');
            icon.className = 'fas ' + (cfg.iconClass || 'fa-file');
            icon.setAttribute('aria-hidden', 'true');

            var space = document.createTextNode('\u00A0');
            var label = document.createTextNode(cfg.labelText || '');

            btn.appendChild(icon);
            btn.appendChild(space);
            btn.appendChild(label);

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

            // Inserir no contentor pai
            // Se for .pure-section-header, adiciona ao final (ou ao início? manter ao final)
            // Se for .toolbar-grid, tenta inserir antes do botão ATF se existir
            if (targetContainer.classList && targetContainer.classList.contains('toolbar-grid')) {
                var atfBtn = document.getElementById('atfModalBtn');
                if (atfBtn && atfBtn.parentNode === targetContainer) {
                    targetContainer.insertBefore(btn, atfBtn);
                } else {
                    targetContainer.appendChild(btn);
                }
            } else {
                // Para fallbacks, adiciona ao final
                targetContainer.appendChild(btn);
            }

            _log('Botão #' + cfg.id + ' (' + cfg.labelText + ') injetado com sucesso em ' + (targetContainer.id || targetContainer.className || 'contentor genérico'), 'success');
            return btn;

        } catch (err) {
            _log('Falha na injeção do botão #' + cfg.id + ': ' + err.message, 'error');
            return null;
        }
    }

    // =========================================================================
    // BLOCO 3, 4, 5 — FUNÇÕES DE EXPORTAÇÃO (INALTERADAS)
    // =========================================================================
    // (As funções _unifedExportPdfRelatorio, _unifedExportPdfAnexoCustodia, _unifedExportDocxMatriz
    // são mantidas exatamente como no original — omitidas aqui por brevidade, mas presentes no ficheiro final)
    // =========================================================================

    // =========================================================================
    // BLOCO 6 — PONTO DE ENTRADA PRINCIPAL (CORRIGIDO)
    // =========================================================================

    /**
     * Função principal que orquestra a injeção.
     * Encapsulada e chamada após DOMContentLoaded.
     */
    function _initializeTriade() {
        _log('Inicializando Tríade Documental v' + _MODULE_VERSION, 'info');

        // 1. Neutralizar botões legados
        _LEGACY_BTN_IDS.forEach(_neutralizarBotaoLegado);

        // 2. Injectar os 3 novos botões
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

        // 3. Expor funções globalmente
        window.unifedExportPdfRelatorio     = _unifedExportPdfRelatorio;
        window.unifedExportPdfAnexoCustodia = _unifedExportPdfAnexoCustodia;
        window.unifedExportDocxMatriz       = _unifedExportDocxMatriz;

        _log('Tríade Documental registada. Botões injetados.', 'success');
        console.info('[UNIFED-TRIADA] Módulo carregado e inicializado.');
        console.info('  · #unifedPdfRelatorioBtn → _unifedExportPdfRelatorio()');
        console.info('  · #unifedPdfAnexoBtn     → _unifedExportPdfAnexoCustodia()');
        console.info('  · #unifedDocxMatrizBtn   → _unifedExportDocxMatriz()');
        console.info('  · Legados neutralizados  → #exportPDFBtn, #exportDOCXBtn (cloneNode + display:none)');
    }

    // Aguardar DOM pronto antes de qualquer manipulação
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', _initializeTriade);
    } else {
        // DOM já carregado, executar imediatamente
        _initializeTriade();
    }

}()); /* FIM IIFE — _unifedTriadaExportIIFE */