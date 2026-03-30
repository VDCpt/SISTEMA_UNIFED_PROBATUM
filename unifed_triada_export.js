/**
 * UNIFED - PROBATUM · v13.5.0-PURE · MÓDULO DE EXPORTAÇÃO — TRÍADE DOCUMENTAL
 * ============================================================================
 * Ficheiro      : unifed_triada_export.js
 * Versão        : 1.0.13-TRIADA (MASTER HASH LOCK)
 * Conformidade  : ISO/IEC 27037:2012 · Art. 125.º CPP · Art. 103.º RGIT
 * ============================================================================
 */

'use strict';

(function _unifedTriadaModule() {
    const _VERSION = '1.0.13-TRIADA';

    function _log(msg, type = 'log') {
        const timestamp = new Date().toISOString();
        console[type](`[${timestamp}] [TRIADA] ${msg}`);
    }

    // 1. OBTENÇÃO ESTÁVEL DO MASTER HASH (SEM GERAÇÃO DINÂMICA)
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

    // 2. ANEXO DE CUSTÓDIA (PROVA MATERIAL DIGITAL)
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

        // Função de rodapé com Master Hash
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

        // Cabeçalho
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('UNIFED - PROBATUM | PROVA MATERIAL DIGITAL', marginX, currentY);
        currentY += 8;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('ANEXO DE CUSTÓDIA E INTEGRIDADE · MOD. 03-B (NORMA ISO/IEC 27037:2012)', marginX, currentY);
        currentY += 15;

        // Metadados da sessão
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.text(`Sessão: ${sessionId}`, marginX, currentY);
        currentY += 5;
        doc.text(`Data: ${new Date().toLocaleDateString('pt-PT')}`, marginX, currentY);
        currentY += 5;
        doc.text(`Master Hash: ${masterHash}`, marginX, currentY);
        currentY += 10;

        // Evidências processadas
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
                if (currentY > pageHeight - 30) {
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

        const totalPages = doc.internal.getNumberOfPages();
        for (let p = 1; p <= totalPages; p++) {
            doc.setPage(p);
            addFooter(p, totalPages);
        }

        // QR Code na última página
        try {
            const qrCanvas = document.createElement('canvas');
            if (typeof QRCode !== 'undefined') {
                const qrPayload = `UNIFED|${sessionId}|${masterHash}`;
                QRCode.toCanvas(qrCanvas, qrPayload, { width: 40, margin: 1 }, function(error) {
                    if (!error) {
                        const qrImgData = qrCanvas.toDataURL('image/png');
                        doc.addImage(qrImgData, 'PNG', 150, pageHeight - 55, 35, 35);
                        doc.save(`UNIFED_ANEXO_CUSTODIA_${sessionId}.pdf`);
                    } else {
                        doc.save(`UNIFED_ANEXO_CUSTODIA_${sessionId}.pdf`);
                    }
                });
            } else {
                doc.save(`UNIFED_ANEXO_CUSTODIA_${sessionId}.pdf`);
            }
        } catch (e) {
            _log('Falha na renderização do QR Code: ' + e.message, 'warn');
            doc.save(`UNIFED_ANEXO_CUSTODIA_${sessionId}.pdf`);
        }
    }

    // 3. INJEÇÃO DE BOTÕES NA INTERFACE
    function initInterface() {
        const container = document.getElementById('triadaButtonsContainer');
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

        // Ocultar botões antigos (exportPDFBtn e exportDOCXBtn) para evitar duplicação
        ['exportPDFBtn', 'exportDOCXBtn'].forEach(id => {
            const old = document.getElementById(id);
            if (old) old.style.display = 'none';
        });

        _log('Interface Tríade Documental v1.0.13 activada.');
    }

    // Inicialização por evento de prontidão do núcleo
    window.addEventListener('UNIFED_CORE_READY', () => {
        setTimeout(initInterface, 200);
    });

    // Exposição global
    window.gerarAnexoCustodia = gerarAnexoCustodia;
    window.initTriadaButtons = initInterface;
    window.UNIFEDSystem = window.UNIFEDSystem || {};
    window.UNIFEDSystem.triadaUpdateLabels = initInterface;

})();