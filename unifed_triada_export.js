/**
 * ============================================================================
 * UNIFED - PROBATUM · v13.5.0-PURE · MÓDULO DE EXPORTAÇÃO — TRÍADE DOCUMENTAL
 * ============================================================================
 * Ficheiro      : unifed_triada_export.js
 * Versão        : 1.0.3-TRIADA (DIAGNÓSTICO + INJEÇÃO DIRETA)
 * ============================================================================
 */

(function _unifedTriadaExportIIFE() {
    'use strict';

    var _MODULE_VERSION = '1.0.3-TRIADA';
    var _LEGACY_BTN_IDS = ['exportPDFBtn', 'exportDOCXBtn'];
    
    // =========================================================================
    // DIAGNÓSTICO - LOG ELEMENTOS DO DOM
    // =========================================================================
    function _diagnosticoDOM() {
        console.log('[UNIFED-TRIADA] ========== DIAGNÓSTICO DOM ==========');
        
        var toolbarGrid = document.querySelector('.toolbar-grid');
        console.log('[UNIFED-TRIADA] .toolbar-grid encontrado?', toolbarGrid ? 'SIM' : 'NÃO');
        if (toolbarGrid) {
            console.log('[UNIFED-TRIADA] .toolbar-grid innerHTML:', toolbarGrid.innerHTML.substring(0, 500));
            console.log('[UNIFED-TRIADA] .toolbar-grid children:', toolbarGrid.children.length);
        }
        
        var toolbarSection = document.querySelector('.toolbar-section');
        console.log('[UNIFED-TRIADA] .toolbar-section encontrado?', toolbarSection ? 'SIM' : 'NÃO');
        
        var mainContainer = document.getElementById('mainContainer');
        console.log('[UNIFED-TRIADA] #mainContainer visível?', mainContainer ? (mainContainer.style.display !== 'none' ? 'SIM' : 'OCULTO') : 'NÃO');
        
        console.log('[UNIFED-TRIADA] =======================================');
    }
    
    // =========================================================================
    // NEUTRALIZAR BOTÕES LEGADOS
    // =========================================================================
    function _neutralizarBotaoLegado(id) {
        try {
            var node = document.getElementById(id);
            if (!node) {
                console.warn('[UNIFED-TRIADA] Botão legado #' + id + ' não encontrado.');
                return;
            }
            var clone = node.cloneNode(true);
            node.replaceWith(clone);
            clone.style.display = 'none';
            clone.disabled = true;
            console.log('[UNIFED-TRIADA] Botão legado #' + id + ' neutralizado.');
        } catch (err) {
            console.error('[UNIFED-TRIADA] Erro ao neutralizar #' + id, err);
        }
    }
    
    // =========================================================================
    // CRIAR BOTÃO (SEM innerHTML)
    // =========================================================================
    function _criarBotao(id, iconClass, labelText, title, borderColor, handler) {
        var btn = document.createElement('button');
        btn.id = id;
        btn.className = 'btn-tool';
        btn.title = title || '';
        
        // Estilos inline FORÇADOS para garantir visibilidade
        btn.style.cssText = [
            'display: inline-flex !important',
            'align-items: center',
            'gap: 8px',
            'padding: 10px 16px',
            'background: rgba(0, 229, 255, 0.1)',
            'border: 1px solid ' + borderColor,
            'border-left: 3px solid ' + borderColor,
            'color: #00E5FF',
            'font-family: "JetBrains Mono", monospace',
            'font-size: 0.75rem',
            'font-weight: 600',
            'letter-spacing: 0.5px',
            'cursor: pointer',
            'border-radius: 4px',
            'margin: 0 4px',
            'z-index: 9999'
        ].join(';');
        
        // Ícone
        var icon = document.createElement('i');
        icon.className = 'fas ' + iconClass;
        icon.setAttribute('aria-hidden', 'true');
        
        // Texto
        var textNode = document.createTextNode(' ' + labelText);
        
        btn.appendChild(icon);
        btn.appendChild(textNode);
        
        // Evento click
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('[UNIFED-TRIADA] Botão clicado:', id);
            try {
                handler();
            } catch(err) {
                console.error('[UNIFED-TRIADA] Erro no handler:', err);
                if (typeof window.showToast === 'function') {
                    window.showToast('Erro: ' + err.message, 'error');
                }
            }
        });
        
        // Hover effects
        btn.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(0, 229, 255, 0.2)';
            this.style.transform = 'translateY(-1px)';
        });
        btn.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(0, 229, 255, 0.1)';
            this.style.transform = 'translateY(0)';
        });
        
        return btn;
    }
    
    // =========================================================================
    // INJEÇÃO DIRETA DOS BOTÕES
    // =========================================================================
    function _injetarBotoes() {
        console.log('[UNIFED-TRIADA] Injetando botões da Tríade Documental...');
        
        // 1. Encontrar o contentor alvo
        var targetContainer = document.querySelector('.toolbar-grid');
        
        // Se não encontrar, tentar criar um contentor dentro da toolbar-section
        if (!targetContainer) {
            console.warn('[UNIFED-TRIADA] .toolbar-grid não encontrado. Procurando alternativa...');
            
            var toolbarSection = document.querySelector('.toolbar-section');
            if (toolbarSection) {
                // Criar um novo grid dentro da toolbar-section
                targetContainer = document.createElement('div');
                targetContainer.className = 'toolbar-grid';
                targetContainer.style.cssText = 'display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-top: 8px;';
                toolbarSection.appendChild(targetContainer);
                console.log('[UNIFED-TRIADA] Criado novo .toolbar-grid dentro de .toolbar-section');
            }
        }
        
        // Último recurso: injetar no topo da área de análise
        if (!targetContainer) {
            var analysisArea = document.querySelector('.analysis-area');
            if (analysisArea) {
                targetContainer = document.createElement('div');
                targetContainer.className = 'toolbar-grid triada-fallback';
                targetContainer.style.cssText = 'display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin: 16px 0; padding: 12px; background: rgba(0,0,0,0.3); border-radius: 8px;';
                analysisArea.insertBefore(targetContainer, analysisArea.firstChild);
                console.log('[UNIFED-TRIADA] Criado contentor fallback no topo da .analysis-area');
            }
        }
        
        if (!targetContainer) {
            console.error('[UNIFED-TRIADA] Nenhum contentor disponível para injeção!');
            return false;
        }
        
        console.log('[UNIFED-TRIADA] Contentor alvo:', targetContainer.className, targetContainer.id);
        
        // 2. Verificar se os botões já existem (evitar duplicação)
        if (document.getElementById('unifedPdfRelatorioBtn')) {
            console.log('[UNIFED-TRIADA] Botões já existem, abortando injeção.');
            return true;
        }
        
        // 3. Criar e injetar os 3 botões
        var botoes = [
            {
                id: 'unifedPdfRelatorioBtn',
                icon: 'fa-file-pdf',
                label: 'RELATÓRIO PERICIAL',
                title: 'Exportar PDF · Relatório Pericial',
                color: '#00E5FF',
                handler: _unifedExportPdfRelatorio
            },
            {
                id: 'unifedPdfAnexoBtn',
                icon: 'fa-file-contract',
                label: 'ANEXO · CUSTÓDIA',
                title: 'Exportar PDF · Anexo de Custódia',
                color: '#F59E0B',
                handler: _unifedExportPdfAnexoCustodia
            },
            {
                id: 'unifedDocxMatrizBtn',
                icon: 'fa-file-word',
                label: 'MATRIZ JURÍDICA',
                title: 'Exportar DOCX · Matriz Jurídica',
                color: '#10B981',
                handler: _unifedExportDocxMatriz
            }
        ];
        
        var injected = 0;
        botoes.forEach(function(cfg) {
            var btn = _criarBotao(cfg.id, cfg.icon, cfg.label, cfg.title, cfg.color, cfg.handler);
            targetContainer.appendChild(btn);
            injected++;
            console.log('[UNIFED-TRIADA] Botão injetado:', cfg.id);
        });
        
        console.log('[UNIFED-TRIADA] ✅ ' + injected + ' botões injetados com sucesso!');
        return true;
    }
    
    // =========================================================================
    // FUNÇÕES DE EXPORTAÇÃO (STUBS - IMPLEMENTAÇÃO REAL NO ARQUIVO COMPLETO)
    // =========================================================================
    async function _unifedExportPdfRelatorio() {
        console.log('[UNIFED-TRIADA] Exportando PDF Relatório Pericial...');
        if (typeof window.jspdf === 'undefined') {
            console.error('[UNIFED-TRIADA] jsPDF não disponível');
            if (typeof window.showToast === 'function') window.showToast('jsPDF não disponível', 'error');
            return;
        }
        // Implementação completa aqui...
    }
    
    async function _unifedExportPdfAnexoCustodia() {
        console.log('[UNIFED-TRIADA] Exportando PDF Anexo Custódia...');
        if (typeof window.jspdf === 'undefined') {
            console.error('[UNIFED-TRIADA] jsPDF não disponível');
            if (typeof window.showToast === 'function') window.showToast('jsPDF não disponível', 'error');
            return;
        }
        // Implementação completa aqui...
    }
    
    async function _unifedExportDocxMatriz() {
        console.log('[UNIFED-TRIADA] Exportando DOCX Matriz Jurídica...');
        if (typeof JSZip === 'undefined') {
            console.error('[UNIFED-TRIADA] JSZip não disponível');
            if (typeof window.showToast === 'function') window.showToast('JSZip não disponível', 'error');
            return;
        }
        // Implementação completa aqui...
    }
    
    // =========================================================================
    // FUNÇÃO PRINCIPAL
    // =========================================================================
    function _init() {
        console.log('[UNIFED-TRIADA] Inicializando v' + _MODULE_VERSION);
        
        // Diagnóstico
        _diagnosticoDOM();
        
        // Neutralizar botões legados
        _LEGACY_BTN_IDS.forEach(_neutralizarBotaoLegado);
        
        // Tentar injetar imediatamente
        var success = _injetarBotoes();
        
        if (!success) {
            console.warn('[UNIFED-TRIADA] Falha na injeção imediata. Tentando novamente em 1s...');
            setTimeout(function() {
                _injetarBotoes();
            }, 1000);
        }
        
        // Expor funções globalmente
        window.unifedExportPdfRelatorio = _unifedExportPdfRelatorio;
        window.unifedExportPdfAnexoCustodia = _unifedExportPdfAnexoCustodia;
        window.unifedExportDocxMatriz = _unifedExportDocxMatriz;
        
        console.log('[UNIFED-TRIADA] Módulo carregado. Funções expostas globalmente.');
    }
    
    // Aguardar DOM estar pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', _init);
    } else {
        _init();
    }
    
    // Fallback: também tentar no window.load
    window.addEventListener('load', function() {
        if (!document.getElementById('unifedPdfRelatorioBtn')) {
            console.log('[UNIFED-TRIADA] Window.load: tentando injeção adicional...');
            _injetarBotoes();
        }
    });
    
}());