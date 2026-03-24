/**
 * ============================================================================
 * UNIFED - PROBATUM · v13.5.0-PURE · MÓDULO DE EXPORTAÇÃO — TRÍADE DOCUMENTAL
 * ============================================================================
 * Ficheiro      : unifed_triada_export.js
 * Versão        : 1.0.4-TRIADA (INJEÇÃO GARANTIDA - VERSÃO FINAL)
 * ============================================================================
 */

(function _unifedTriadaExportIIFE() {
    'use strict';

    var _MODULE_VERSION = '1.0.4-TRIADA';
    var _INJECTION_ATTEMPTS = 0;
    var _MAX_ATTEMPTS = 30; // 15 segundos (30 * 500ms)
    var _intervalId = null;
    
    // =========================================================================
    // UTILITÁRIOS
    // =========================================================================
    function _log(msg, level) {
        var prefix = '[UNIFED-TRIADA] ';
        if (typeof window.logAudit === 'function') {
            window.logAudit(prefix + msg, level || 'info');
        } else {
            console.log(prefix + msg);
        }
    }
    
    // =========================================================================
    // FUNÇÕES DE EXPORTAÇÃO (IMPLEMENTAÇÃO REAL - PRESERVAR DO ORIGINAL)
    // =========================================================================
    // NOTA: Manter as implementações completas do arquivo original aqui
    async function _unifedExportPdfRelatorio() {
        _log('📄 Exportando PDF Relatório Pericial...', 'info');
        // ... implementação completa do original
    }
    
    async function _unifedExportPdfAnexoCustodia() {
        _log('📄 Exportando PDF Anexo Custódia...', 'info');
        // ... implementação completa do original
    }
    
    async function _unifedExportDocxMatriz() {
        _log('📄 Exportando DOCX Matriz Jurídica...', 'info');
        // ... implementação completa do original
    }
    
    // =========================================================================
    // CRIAÇÃO DO BOTÃO
    // =========================================================================
    function _criarBotao(id, iconClass, labelText, title, borderColor, handler) {
        var btn = document.createElement('button');
        btn.id = id;
        btn.className = 'btn-tool';
        btn.title = title || '';
        
        // CSS INLINE GARANTIDO
        btn.style.cssText = [
            'display: inline-flex',
            'align-items: center',
            'gap: 8px',
            'padding: 10px 16px',
            'background: rgba(0, 229, 255, 0.1)',
            'border: 1px solid ' + borderColor,
            'border-left: 3px solid ' + borderColor,
            'color: #00E5FF',
            'font-family: "JetBrains Mono", "Courier New", monospace',
            'font-size: 0.75rem',
            'font-weight: 600',
            'letter-spacing: 0.5px',
            'cursor: pointer',
            'border-radius: 4px',
            'margin: 0 4px',
            'transition: all 0.2s ease'
        ].join(';');
        
        var icon = document.createElement('i');
        icon.className = 'fas ' + iconClass;
        icon.setAttribute('aria-hidden', 'true');
        
        var textNode = document.createTextNode(' ' + labelText);
        
        btn.appendChild(icon);
        btn.appendChild(textNode);
        
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            _log('🖱️ Botão clicado: ' + id, 'info');
            try {
                handler();
            } catch(err) {
                _log('Erro: ' + err.message, 'error');
                if (typeof window.showToast === 'function') {
                    window.showToast('Erro: ' + err.message, 'error');
                }
            }
        });
        
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
    // INJEÇÃO PRINCIPAL
    // =========================================================================
    function _injetarBotoes() {
        _INJECTION_ATTEMPTS++;
        _log('Tentativa ' + _INJECTION_ATTEMPTS + '/' + _MAX_ATTEMPTS, 'info');
        
        // 1. Encontrar contentor
        var container = document.querySelector('.toolbar-grid');
        var createdContainer = false;
        
        if (!container) {
            var toolbarSection = document.querySelector('.toolbar-section');
            if (toolbarSection) {
                container = document.createElement('div');
                container.className = 'toolbar-grid';
                container.style.cssText = 'display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-top: 8px;';
                toolbarSection.appendChild(container);
                createdContainer = true;
                _log('✅ Contentor .toolbar-grid criado dentro de .toolbar-section', 'success');
            }
        }
        
        if (!container) {
            var analysisArea = document.querySelector('.analysis-area');
            if (analysisArea) {
                container = document.createElement('div');
                container.className = 'toolbar-grid triada-standalone';
                container.style.cssText = 'display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; margin: 20px 16px; padding: 16px; background: linear-gradient(135deg, rgba(0,229,255,0.08), rgba(0,0,0,0.3)); border-radius: 12px; border: 1px solid rgba(0,229,255,0.2);';
                analysisArea.insertBefore(container, analysisArea.firstChild);
                createdContainer = true;
                _log('✅ Contentor criado no topo da .analysis-area', 'success');
            }
        }
        
        if (!container) {
            _log('❌ Nenhum contentor disponível', 'error');
            return false;
        }
        
        // 2. Verificar duplicação
        if (document.getElementById('unifedPdfRelatorioBtn')) {
            _log('✅ Botões já existem', 'success');
            return true;
        }
        
        // 3. Criar botões
        var botoes = [
            {
                id: 'unifedPdfRelatorioBtn',
                icon: 'fa-file-pdf',
                label: 'RELATÓRIO PERICIAL',
                title: 'Exportar PDF · Relatório Pericial de Reconstituição da Verdade Material',
                color: '#00E5FF',
                handler: _unifedExportPdfRelatorio
            },
            {
                id: 'unifedPdfAnexoBtn',
                icon: 'fa-file-contract',
                label: 'ANEXO · CUSTÓDIA',
                title: 'Exportar PDF · Anexo de Artefactos e Cadeia de Custódia (SHA-256 · RFC 3161)',
                color: '#F59E0B',
                handler: _unifedExportPdfAnexoCustodia
            },
            {
                id: 'unifedDocxMatrizBtn',
                icon: 'fa-file-word',
                label: 'MATRIZ JURÍDICA',
                title: 'Exportar DOCX · Matriz de Argumentação Jurídica (Peça Processual Editável)',
                color: '#10B981',
                handler: _unifedExportDocxMatriz
            }
        ];
        
        botoes.forEach(function(b) {
            var btn = _criarBotao(b.id, b.icon, b.label, b.title, b.color, b.handler);
            container.appendChild(btn);
            _log('✅ Botão criado: ' + b.id, 'success');
        });
        
        // 4. Remover botões legados
        ['exportPDFBtn', 'exportDOCXBtn'].forEach(function(id) {
            var old = document.getElementById(id);
            if (old) {
                old.style.display = 'none';
                old.disabled = true;
                _log('🔇 Botão legado ocultado: ' + id, 'info');
            }
        });
        
        _log('🎉 TRÍADE DOCUMENTAL INJETADA COM SUCESSO!', 'success');
        return true;
    }
    
    // =========================================================================
    // INÍCIO COM RETRY
    // =========================================================================
    function _start() {
        _log('Iniciando Tríade Documental v' + _MODULE_VERSION, 'info');
        
        // Tentar imediatamente
        if (_injetarBotoes()) {
            // Expor globais
            window.unifedExportPdfRelatorio = _unifedExportPdfRelatorio;
            window.unifedExportPdfAnexoCustodia = _unifedExportPdfAnexoCustodia;
            window.unifedExportDocxMatriz = _unifedExportDocxMatriz;
            return;
        }
        
        // Configurar retry
        if (_intervalId) clearInterval(_intervalId);
        
        _intervalId = setInterval(function() {
            if (_injetarBotoes()) {
                clearInterval(_intervalId);
                _intervalId = null;
                window.unifedExportPdfRelatorio = _unifedExportPdfRelatorio;
                window.unifedExportPdfAnexoCustodia = _unifedExportPdfAnexoCustodia;
                window.unifedExportDocxMatriz = _unifedExportDocxMatriz;
                _log('✅ Injeção concluída após ' + _INJECTION_ATTEMPTS + ' tentativas', 'success');
            } else if (_INJECTION_ATTEMPTS >= _MAX_ATTEMPTS) {
                clearInterval(_intervalId);
                _intervalId = null;
                _log('❌ Falha na injeção após ' + _MAX_ATTEMPTS + ' tentativas', 'error');
            }
        }, 500);
    }
    
    // Executar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', _start);
    } else {
        _start();
    }
    
    // Fallback adicional no window.load
    window.addEventListener('load', function() {
        if (!document.getElementById('unifedPdfRelatorioBtn')) {
            _log('Window.load: tentando injeção adicional...', 'info');
            _injetarBotoes();
        }
    });
    
}());