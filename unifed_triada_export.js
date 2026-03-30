/**
 * ============================================================================
 * UNIFED - PROBATUM · v13.5.0-PURE · MÓDULO DE EXPORTAÇÃO — TRÍADE DOCUMENTAL
 * ============================================================================
 * Ficheiro      : unifed_triada_export.js
 * Versão        : 1.0.12-TRIADA (BOTÕES CORRETOS)
 * Conformidade  : ISO/IEC 27037:2012 · Art. 125.º CPP · Art. 103.º RGIT
 * ============================================================================
 */

'use strict';

(function _unifedTriadaModule() {
    const _VERSION = '1.0.12-TRIADA';

    function _log(msg, type = 'log') {
        const timestamp = new Date().toISOString();
        console[type](`[${timestamp}] [TRIADA] ${msg}`);
    }

    // =========================================================================
    // SECÇÃO 1 — GERADOR DE ANEXO DE CUSTÓDIA (MOD. 03-B)
    // =========================================================================
    async function gerarAnexoCustodia() {
        _log('A iniciar geração do Anexo de Custódia...');

        if (typeof window.jspdf === 'undefined') {
            _log('Erro: jsPDF não carregado.', 'error');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4'
        });

        const marginX = 20;
        let currentY = 25;
        const pageHeight = doc.internal.pageSize.getHeight();
        const masterHash = window.UNIFEDSystem?.masterHash || 'HASH_INDISPONIVEL';

        const _adicionarRodape = (pNum, pTotal) => {
            doc.setFont('courier', 'normal');
            doc.setFontSize(7);
            doc.setTextColor(150, 150, 150);
            const footerText = `Master Hash SHA-256: ${masterHash}`;
            const pageText = `Página ${pNum} de ${pTotal}`;
            const textWidth = doc.getTextWidth(footerText);
            const pageWidth = doc.internal.pageSize.getWidth();
            doc.text(footerText, (pageWidth - textWidth) / 2, pageHeight - 10);
            const pageTextWidth = doc.getTextWidth(pageText);
            doc.text(pageText, pageWidth - marginX - pageTextWidth, pageHeight - 10);
        };

        // Cabeçalho
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('UNIFED - PROBATUM | ANEXO DE EVIDÊNCIAS - CADEIA DE CUSTÓDIA', marginX, currentY);
        currentY += 8;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('ESTRUTURA DE RELATÓRIO FORENSE MOD. 03-B (NORMA ISO/IEC 27037:2012)', marginX, currentY);
        currentY += 15;

        // Listagem de Evidências (obtidas do sistema)
        const evidencias = window.UNIFEDSystem?.analysis?.evidenceIntegrity || [];
        if (evidencias.length === 0) {
            doc.text('Nenhuma evidência processada nesta sessão.', marginX, currentY);
            currentY += 10;
        } else {
            evidencias.forEach((ev, idx) => {
                if (currentY > pageHeight - 30) {
                    _adicionarRodape(doc.internal.getNumberOfPages(), '{total_pages}');
                    doc.addPage();
                    currentY = 25;
                }
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(10);
                doc.text(`${idx+1}. ${ev.filename}`, marginX, currentY);
                currentY += 5;
                doc.setFont('courier', 'normal');
                doc.setFontSize(8);
                doc.text(`SHA-256: ${ev.hash || 'N/A'}`, marginX, currentY);
                currentY += 12;
            });
        }

        const totalPages = doc.internal.getNumberOfPages();
        _adicionarRodape(totalPages, totalPages);

        // QR Code na última página
        try {
            const qrCanvas = document.createElement('canvas');
            if (typeof QRCode !== 'undefined') {
                const qrPayload = `UNIFED|${window.activeForensicSession?.sessionId || 'OFFLINE'}|${masterHash}`;
                QRCode.toCanvas(qrCanvas, qrPayload, { width: 40, margin: 1 }, function(error) {
                    if (!error) {
                        const qrImgData = qrCanvas.toDataURL('image/png');
                        doc.addImage(qrImgData, 'PNG', 150, pageHeight - 55, 35, 35);
                        for (let i = 1; i <= totalPages; i++) {
                            doc.setPage(i);
                            doc.setFont('courier', 'normal');
                            doc.setFontSize(7);
                            doc.setTextColor(150, 150, 150);
                            const tWidth = doc.getTextWidth(`Página ${i} de ${totalPages}`);
                            doc.text(`Página ${i} de ${totalPages}`, doc.internal.pageSize.getWidth() - marginX - tWidth, pageHeight - 10);
                        }
                        doc.save(`UNIFED_ANEXO_CUSTODIA_${window.activeForensicSession?.sessionId || 'EXPORT'}.pdf`);
                    }
                });
            } else {
                doc.save(`UNIFED_ANEXO_CUSTODIA_${window.activeForensicSession?.sessionId || 'EXPORT'}.pdf`);
            }
        } catch (e) {
            _log('Falha na renderização do QR Code: ' + e.message, 'warn');
            doc.save(`UNIFED_ANEXO_CUSTODIA_SEM_QR.pdf`);
        }
    }

    // =========================================================================
    // SECÇÃO 2 — INTERFACE DE BOTÕES (TRÍADE)
    // =========================================================================
    function injetarBotoes() {
        const container = document.getElementById('triadaButtonsContainer');
        if (!container) return;

        container.innerHTML = ''; // Limpeza

        const botoes = [
            { 
                id: 'triadaRelatorioBtn', 
                label: 'RELATÓRIO PERICIAL FORENSE (MOD. 03-B)', 
                icon: 'fa-file-pdf', 
                cor: '#00E5FF',
                handler: () => window.exportPDF && window.exportPDF()
            },
            { 
                id: 'triadaMatrizBtn', 
                label: 'MINUTA DE PETIÇÃO INICIAL', 
                icon: 'fa-file-word', 
                cor: '#0EA5E9',
                handler: () => window.exportDOCX && window.exportDOCX()
            },
            { 
                id: 'triadaCustodiaBtn', 
                label: 'ANEXO DE CUSTÓDIA', 
                icon: 'fa-shield-alt', 
                cor: '#EF4444',
                handler: gerarAnexoCustodia
            }
        ];

        botoes.forEach(b => {
            const btn = document.createElement('button');
            btn.id = b.id;
            btn.className = 'btn-tool';
            btn.style.cssText = `border-left: 3px solid ${b.cor}; margin: 5px; padding: 10px; cursor: pointer; background: rgba(15, 23, 42, 0.8); color: white; border-top: none; border-right: none; border-bottom: none; font-family: 'JetBrains Mono', monospace; font-size: 11px;`;
            btn.innerHTML = `<i class="fas ${b.icon}" style="color: ${b.cor}; margin-right: 8px;"></i> ${b.label}`;
            btn.onclick = b.handler;
            container.appendChild(btn);
        });

        // Ocultar triggers antigos
        ['exportPDFBtn', 'exportDOCXBtn'].forEach(id => {
            const old = document.getElementById(id);
            if (old) old.style.display = 'none';
        });

        _log('Interface Tríade Documental v1.0.12 activada.');
    }

    // Exportação para o scope global
    window.gerarAnexoCustodia = gerarAnexoCustodia;
    window.injetarBotoesTriada = injetarBotoes;

    // Inicialização por evento de prontidão do núcleo
    window.addEventListener('UNIFED_CORE_READY', () => {
        setTimeout(injetarBotoes, 200);
    });

})();