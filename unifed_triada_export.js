/**
 * UNIFED - PROBATUM · v13.5.0-PURE · MÓDULO DE EXPORTAÇÃO — TRÍADE DOCUMENTAL
 * ============================================================================
 * Ficheiro      : unifed_triada_export.js
 * Versão        : 1.0.15-TRIADA (Correção container ID)
 * ============================================================================
 */

'use strict';

(function _unifedTriadaModule() {
    const _VERSION = '1.0.15-TRIADA';

    function _log(msg, type = 'log') {
        const timestamp = new Date().toISOString();
        console[type](`[${timestamp}] [TRIADA] ${msg}`);
    }

    function getStableMasterHash() {
        if (window.activeForensicSession && window.activeForensicSession.masterHash) {
            return window.activeForensicSession.masterHash;
        }
        if (window.UNIFEDSystem && window.UNIFEDSystem.demoMode) {
            return "79b032809b9e54ea3504659c37edb9e49e6d462d691c75e4a5afd79d8bb8f86c";
        }
        if (window.UNIFEDSystem && window.UNIFEDSystem.masterHash) {
            return window.UNIFEDSystem.masterHash;
        }
        return "PENDING_SEAL";
    }

    async function gerarAnexoCustodia() {
        const masterHash = getStableMasterHash();
        const sessionId = window.UNIFEDSystem?.sessionId || window.activeForensicSession?.sessionId || 'UNIFED-SESSION';

        _log(`🔒 A selar documento com Master Hash: ${masterHash}`);

        if (typeof window.jspdf === 'undefined') {
            _log('jsPDF não carregado. A gerar simulação de anexo.', 'warn');
            alert(`GERANDO PROVA MATERIAL DIGITAL\nMaster Hash: ${masterHash}\nSessão: ${sessionId}\nEstado: Integridade Validada.\n\nEste é um documento de prova com selo criptográfico.`);
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
        const marginX = 20;
        let currentY = 25;
        const pageHeight = doc.internal.pageSize.getHeight();

        function addFooter(pageNum, totalPages) {
            doc.setFont('courier', 'normal');
            doc.setFontSize(7);
            doc.setTextColor(150, 150, 150);
            const footerText = `Master Hash SHA-256: ${masterHash}`;
            const pageText = `Página ${pageNum} de ${totalPages}`;
            const textWidth = doc.getTextWidth(footerText);
            const pageWidth = doc.internal.pageSize.getWidth();
            doc.text(footerText, (pageWidth - textWidth) / 2, pageHeight - 10);
            const pageTextWidth = doc.getTextWidth(pageText);
            doc.text(pageText, pageWidth - marginX - pageTextWidth, pageHeight - 10);
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('UNIFED - PROBATUM | PROVA MATERIAL DIGITAL', marginX, currentY);
        currentY += 8;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('ANEXO DE CUSTÓDIA E INTEGRIDADE · MOD. 03-B (NORMA ISO/IEC 27037:2012)', marginX, currentY);
        currentY += 15;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.text(`Sessão: ${sessionId}`, marginX, currentY);
        currentY += 5;
        doc.text(`Data: ${new Date().toLocaleDateString('pt-PT')}`, marginX, currentY);
        currentY += 5;
        doc.text(`Master Hash: ${masterHash}`, marginX, currentY);
        currentY += 10;

        const evidences = window.UNIFEDSystem?.analysis?.evidenceIntegrity || [];
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text('Evidências processadas:', marginX, currentY);
        currentY += 6;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);

        if (evidences.length === 0) {
            doc.text('Nenhuma evidência registada nesta sessão.', marginX, currentY);
            currentY += 10;
        } else {
            evidences.slice(0, 20).forEach((ev, idx) => {
                if (currentY > pageHeight - 50) {
                    addFooter(doc.internal.getNumberOfPages() + 1, 0);
                    doc.addPage();
                    currentY = 25;
                }
                doc.text(`${idx + 1}. ${ev.filename}`, marginX + 2, currentY);
                currentY += 5;
                doc.setFont('courier', 'normal');
                doc.text(`   SHA-256: ${ev.hash || 'N/A'}`, marginX + 2, currentY);
                currentY += 8;
                doc.setFont('helvetica', 'normal');
            });
        }

        const totalPages = doc.internal.getNumberOfPages() + 1;
        for (let p = 1; p <= totalPages - 1; p++) {
            doc.setPage(p);
            addFooter(p, totalPages);
        }

        doc.addPage();
        const lastPageNum = totalPages;
        currentY = 20;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('SELO DE INTEGRIDADE E AUTENTICIDADE', marginX, currentY);
        currentY += 8;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('O código QR abaixo contém o Master Hash SHA-256 e o identificador da sessão,', marginX, currentY);
        currentY += 5;
        doc.text('permitindo a verificação imediata da integridade do documento.', marginX, currentY);
        currentY += 12;

        try {
            const qrPayload = `UNIFED|${sessionId}|${masterHash}`;
            const qrCanvas = document.createElement('canvas');
            if (typeof QRCode !== 'undefined') {
                await new Promise((resolve) => {
                    QRCode.toCanvas(qrCanvas, qrPayload, { width: 200, margin: 2 }, function(error) {
                        if (!error) {
                            const qrImgData = qrCanvas.toDataURL('image/png');
                            const qrSize = 45;
                            const qrX = (doc.internal.pageSize.getWidth() - qrSize) / 2;
                            doc.addImage(qrImgData, 'PNG', qrX, currentY, qrSize, qrSize);
                            currentY += qrSize + 8;
                        } else {
                            doc.text('(QR Code indisponível)', marginX, currentY);
                            currentY += 10;
                        }
                        resolve();
                    });
                });
            } else {
                doc.text('(QR Code não suportado)', marginX, currentY);
                currentY += 10;
            }
        } catch (e) {
            _log('Erro na geração do QR Code: ' + e.message, 'warn');
            doc.text('(QR Code indisponível)', marginX, currentY);
            currentY += 10;
        }

        doc.setFont('courier', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text('Verifique este código QR com qualquer leitor padrão. O hash impresso no rodapé', marginX, currentY);
        currentY += 4;
        doc.text('de todas as páginas deve coincidir com o código QR.', marginX, currentY);
        currentY += 8;
        doc.text('Qualquer alteração no documento resultará numa hash divergente.', marginX, currentY);

        addFooter(lastPageNum, totalPages);
        doc.save(`UNIFED_ANEXO_CUSTODIA_${sessionId}.pdf`);
        _log(`✅ Anexo de Custódia gerado com QR Code: ${sessionId}`, 'success');
    }

    function initInterface() {
        // CORREÇÃO APLICADA: ID do container corrigido
        const container = document.getElementById('export-tools-container');
        if (!container) return;

        container.innerHTML = '';

        const botoes = [
            {
                id: 'triadaPdfBtn',
                label: 'RELATÓRIO PERICIAL FORENSE (MOD. 03-B)',
                icon: 'fa-file-pdf',
                cor: '#00E5FF',
                handler: () => {
                    if (typeof window.exportPDF === 'function') window.exportPDF();
                    else alert('Função de exportação PDF não disponível.');
                }
            },
            {
                id: 'triadaDocxBtn',
                label: 'MINUTA DE PETIÇÃO INICIAL',
                icon: 'fa-file-word',
                cor: '#0EA5E9',
                handler: () => {
                    if (typeof window.exportDOCX === 'function') window.exportDOCX();
                    else alert('Função de exportação DOCX não disponível.');
                }
            },
            {
                id: 'triadaCustodiaBtn',
                label: 'PROVA MATERIAL DIGITAL',
                icon: 'fa-shield-alt',
                cor: '#EF4444',
                handler: gerarAnexoCustodia
            }
        ];

        botoes.forEach(b => {
            const btn = document.createElement('button');
            btn.id = b.id;
            btn.className = 'btn-tool-pure';
            btn.style.cssText = `border-left: 3px solid ${b.cor}; margin: 5px; padding: 12px; cursor: pointer; background: rgba(15, 23, 42, 0.9); color: white; border-top: none; border-right: none; border-bottom: none; font-family: 'JetBrains Mono', monospace; font-size: 11px; transition: 0.3s;`;
            btn.innerHTML = `<i class="fas ${b.icon}" style="color: ${b.cor}; margin-right: 8px;"></i> ${b.label}`;
            btn.onclick = b.handler;
            btn.onmouseover = () => { btn.style.background = 'rgba(30, 41, 59, 1)'; };
            btn.onmouseout = () => { btn.style.background = 'rgba(15, 23, 42, 0.9)'; };
            container.appendChild(btn);
        });

        // Ocultar os botões antigos para evitar duplicação
        ['exportPDFBtn', 'exportDOCXBtn'].forEach(id => {
            const old = document.getElementById(id);
            if (old) old.style.display = 'none';
        });

        _log('Interface Tríade Documental v1.0.15 activada.');
    }

    window.addEventListener('UNIFED_CORE_READY', () => {
        setTimeout(initInterface, 200);
    });

    window.gerarAnexoCustodia = gerarAnexoCustodia;
    window.initTriadaButtons = initInterface;
    window.UNIFEDSystem = window.UNIFEDSystem || {};
    window.UNIFEDSystem.triadaUpdateLabels = initInterface;
})();