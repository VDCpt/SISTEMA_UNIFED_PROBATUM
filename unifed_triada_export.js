/**
 * ============================================================================
 * UNIFED - PROBATUM · v13.5.0-PURE · MÓDULO DE EXPORTAÇÃO — TRÍADE DOCUMENTAL
 * ============================================================================
 * Ficheiro      : unifed_triada_export.js
 * Versão        : 1.0.9-TRIADA (RETIFICADA - DELEGAÇÃO CENTRALIZADA)
 * Conformidade  : ISO/IEC 27037:2012 · Art. 125.º CPP · Art. 103.º RGIT
 * ============================================================================
 * 
 * PRINCÍPIO DE DELEGAÇÃO:
 *   As funções de exportação dos documentos principais (Relatório Pericial e
 *   Matriz Jurídica) delegam em window.exportPDF() e window.exportDOCX() para
 *   garantir que todas as correcções de segurança (hashing puro, hash completo
 *   no rodapé, QR code na última página) sejam aplicadas de forma consistente.
 *   O Anexo de Custódia mantém a sua implementação local por ser um documento
 *   independente.
 * 
 * ============================================================================
 */

(function() {
    'use strict';
    
    // =========================================================================
    // UTILITÁRIOS E EXTRAÇÃO DE METADADOS
    // =========================================================================
    function _log(msg, level) {
        var prefix = '[UNIFED-TRIADA] ';
        var _utils = window.UNIFEDSystem && window.UNIFEDSystem.utils;
        if (_utils && typeof _utils.log === 'function') {
            _utils.log(prefix + msg, level || 'info');
        } else if (typeof window.logAudit === 'function') {
            window.logAudit(prefix + msg, level || 'info');
        } else {
            console.log(prefix + msg);
        }
    }
    
    function _getSys() {
        if (!window.UNIFEDSystem || !window.UNIFEDSystem.analysis) {
            throw new Error('UNIFEDSystem.analysis não disponível. Execute a análise forense 1.º.');
        }
        return window.UNIFEDSystem;
    }

    function _formatCurrencyCentral(val) {
        var _utils = window.UNIFEDSystem && window.UNIFEDSystem.utils;
        if (_utils && typeof _utils.formatCurrency === 'function') {
            return _utils.formatCurrency(val);
        }
        return new Intl.NumberFormat('pt-PT', {
            style: 'currency', currency: 'EUR',
            minimumFractionDigits: 2, maximumFractionDigits: 2
        }).format(val || 0);
    }
    
    function _dataHoje() {
        return new Date().toLocaleDateString('pt-PT', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        });
    }
    
    async function _sha256(texto) {
        var buffer = new TextEncoder().encode(String(texto));
        var hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        return Array.from(new Uint8Array(hashBuffer))
            .map(function (b) { return b.toString(16).padStart(2, '0'); })
            .join('');
    }
    
    function _xe(s) {
        return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
    }

    // =========================================================================
    // GERADOR DE QR CODE EM BASE64 (SÍNCRONO PARA PDF)
    // =========================================================================
    async function _generateQRCodeDataURL(payload) {
        return new Promise(function(resolve) {
            if (typeof QRCode === 'undefined') { resolve(null); return; }
            var _tmpDiv = document.createElement('div');
            _tmpDiv.style.cssText = 'position:absolute;left:-9999px;top:-9999px;';
            document.body.appendChild(_tmpDiv);
            new QRCode(_tmpDiv, {
                text: payload, width: 128, height: 128,
                colorDark: '#000000', colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.L
            });
            setTimeout(function() {
                var _canvas = _tmpDiv.querySelector('canvas');
                var _dataUrl = _canvas ? _canvas.toDataURL('image/png') : null;
                document.body.removeChild(_tmpDiv);
                resolve(_dataUrl);
            }, 150);
        });
    }
    
    // =========================================================================
    // EXPORTAÇÃO PDF RELATÓRIO PERICIAL (MOD. 03-B)
    // =========================================================================
    async function _unifedExportPdfRelatorio() {
        if (typeof window.exportPDF === 'function') {
            window.exportPDF();
        } else {
            _log('exportPDF não disponível.', 'error');
            if (typeof showToast === 'function') showToast('Função de exportação PDF indisponível.', 'error');
        }
    }
    
    // =========================================================================
    // EXPORTAÇÃO DOCX MATRIZ JURÍDICA
    // =========================================================================
    async function _unifedExportDocxMatriz() {
        if (typeof window.exportDOCX === 'function') {
            window.exportDOCX();
        } else {
            _log('exportDOCX não disponível.', 'error');
            if (typeof showToast === 'function') showToast('Função de exportação DOCX indisponível.', 'error');
        }
    }
    
    // =========================================================================
    // EXPORTAÇÃO PDF ANEXO CUSTÓDIA
    // =========================================================================
    async function _unifedExportPdfAnexoCustodia() {
        if (typeof window.jspdf === 'undefined') return;
        var sys;
        try { sys = _getSys(); } catch (e) { return; }
        
        try {
            var jsPDF = window.jspdf.jsPDF;
            var doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
            var mhash = sys.masterHash || 'HASH_INDISPONIVEL';
            
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(14);
            doc.text('UNIFED - PROBATUM | ANEXO DE EVIDÊNCIAS — CADEIA DE CUSTÓDIA', 148, 15, { align: 'center' });
            doc.setFontSize(10);
            doc.text('ESTRUTURA DE RELATÓRIO FORENSE MOD. 03-B (NORMA ISO/IEC 27037:2012)', 148, 22, { align: 'center' });
            
            var y = 40;
            var _evidencias = sys.analysis.evidenceIntegrity || [];
            doc.setFontSize(8);
            for (var i = 0; i < _evidencias.length; i++) {
                doc.text('EV-' + (i+1) + ' | ' + _evidencias[i].filename, 15, y);
                doc.setFont('courier', 'normal');
                doc.text('SHA-256: ' + _evidencias[i].hash, 15, y + 5);
                doc.setFont('helvetica', 'bold');
                y += 15;
                if (y > 180) { doc.addPage(); y = 20; }
            }
            
            doc.setFontSize(7);
            doc.text('Master Hash SHA-256: ' + mhash, 15, 200);
            
            doc.save('UNIFED_ANEXO_CUSTODIA_' + sys.sessionId + '.pdf');
            
        } catch (anexoErr) { _log('Erro Anexo: ' + anexoErr.message, 'error'); }
    }
    
    // =========================================================================
    // INJEÇÃO DE BOTÕES NA INTERFACE
    // =========================================================================
    function injetarBotoes() {
        var container = document.querySelector('.toolbar-grid');
        if (!container) return false;
        
        if (document.getElementById('unifedPdfRelatorioBtn')) return true;
        
        var botoes = [
            { id: 'unifedPdfRelatorioBtn', icon: 'fa-file-pdf', labelPt: 'RELATÓRIO PERICIAL (MOD.03-B)', cor: '#00E5FF', handler: _unifedExportPdfRelatorio },
            { id: 'unifedPdfAnexoBtn', icon: 'fa-file-contract', labelPt: 'ANEXO DE CUSTÓDIA', cor: '#F59E0B', handler: _unifedExportPdfAnexoCustodia },
            { id: 'unifedDocxMatrizBtn', icon: 'fa-file-word', labelPt: 'MATRIZ JURÍDICA', cor: '#10B981', handler: _unifedExportDocxMatriz }
        ];
        
        botoes.forEach(function(b) {
            var btn = document.createElement('button');
            btn.id = b.id;
            btn.className = 'btn-tool';
            btn.innerHTML = '<i class="fas ' + b.icon + '"></i> ' + b.labelPt;
            btn.onclick = b.handler;
            container.appendChild(btn);
        });

        // Oculta os botões originais para evitar duplicação, mantendo fallback silencioso
        var btnPDF = document.getElementById('exportPDFBtn');
        var btnDOCX = document.getElementById('exportDOCXBtn');
        if (btnPDF) {
            btnPDF.style.display = 'none';
            btnPDF.setAttribute('data-hidden-by', 'unifed_triada_export');
        }
        if (btnDOCX) {
            btnDOCX.style.display = 'none';
            btnDOCX.setAttribute('data-hidden-by', 'unifed_triada_export');
        }
        
        return true;
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { setTimeout(injetarBotoes, 100); });
    } else { setTimeout(injetarBotoes, 100); }
    
})();