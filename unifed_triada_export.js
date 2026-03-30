/**
 * ============================================================================
 * UNIFED - PROBATUM · v13.5.0-PURE · MÓDULO DE EXPORTAÇÃO — TRÍADE DOCUMENTAL
 * ============================================================================
 * Ficheiro      : unifed_triada_export.js
 * Versão        : 1.0.11-TRIADA (CONSOLIDADA — RETIFICADA)
 * Conformidade  : ISO/IEC 27037:2012 · Art. 125.º CPP · Art. 103.º RGIT
 * ============================================================================
 */

'use strict';

(function _unifedTriadaModule() {
    const _VERSION = '1.0.11-TRIADA';
    const _MASTER_HASH = '5150e7674b891d5d07ca990e4c7124fc66af40488452759aeebdf84976eaa8f6';

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

        const _adicionarRodape = (pNum, pTotal) => {
            doc.setFont('courier', 'normal');
            doc.setFontSize(7);
            doc.setTextColor(150, 150, 150);
            const footerText = `Master Hash SHA-256: ${_MASTER_HASH}`;
            const pageText = `Página ${pNum} de ${pTotal}`;
            
            // Centralização absoluta do Master Hash
            const textWidth = doc.getTextWidth(footerText);
            const pageWidth = doc.internal.pageSize.getWidth();
            doc.text(footerText, (pageWidth - textWidth) / 2, pageHeight - 10);
            
            // Alinhamento à direita para numeração
            const pageTextWidth = doc.getTextWidth(pageText);
            doc.text(pageText, pageWidth - marginX - pageTextWidth, pageHeight - 10);
        };

        // Cabeçalho Forense
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('UNIFED - PROBATUM | ANEXO DE EVIDÊNCIAS - CADEIA DE CUSTÓDIA', marginX, currentY);
        currentY += 8;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('ESTRUTURA DE RELATÓRIO FORENSE MOD. 03-B (NORMA ISO/IEC 27037:2012)', marginX, currentY);
        currentY += 15;

        // Listagem de Evidências (Simulação de extração de metadados)
        const evidencias = [
            { id: 'EV-1', nome: 'demo_control_1.pdf', hash: 'F5769414E9C2E8349B3FB9D05AA28D491DBA43AE30FE89B6AE496D802C1D79EF' },
            { id: 'EV-2', nome: 'demo_control_2.pdf', hash: '11F519D52DD3B449FDCFA48E07DDCA0F782F3B8966AEBE4D5F24FE2BD7CF8006' },
            { id: 'EV-3', nome: 'demo_control_3.pdf', hash: 'C6B6231C734B0207F91CC7532A5F594053A5DF02B6BEB7FCE3D390193D724E4D' },
            { id: 'EV-4', nome: 'demo_control_4.pdf', hash: '915B1F6416F0E42AFC1D3511F47444684757CB0985DA89E7FCF94F169C24D10D' },
            { id: 'EV-5', nome: 'demo_saft_1.csv', hash: '8CE3AF011AE322FF94988F3C04AF57DDC0343708E6E83EE613B344AD5C915309' },
            { id: 'EV-6', nome: 'demo_saft_2.csv', hash: '99A6A834F64D3AB91C10CE3AEE4A7FCC1FCACCCC6FCBAB84E535870C5C03FDE5' },
            { id: 'EV-7', nome: 'demo_saft_3.csv', hash: '4D1A05822E5F3D1C7A9090F1E1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0' }
        ];

        evidencias.forEach((ev, index) => {
            if (currentY > pageHeight - 30) {
                _adicionarRodape(doc.internal.getNumberOfPages(), '{total_pages}');
                doc.addPage();
                currentY = 25;
            }

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.text(`${ev.id} | ${ev.nome}`, marginX, currentY);
            currentY += 5;
            doc.setFont('courier', 'normal');
            doc.setFontSize(8);
            doc.text(`SHA-256: ${ev.hash}`, marginX, currentY);
            currentY += 12;
        });

        // Injeção de QR Code de Integridade - APENAS NA ÚLTIMA PÁGINA
        const totalPages = doc.internal.getNumberOfPages();
        _adicionarRodape(totalPages, totalPages);

        try {
            const qrCanvas = document.createElement('canvas');
            if (typeof QRCode !== 'undefined') {
                const qrPayload = `UNIFED|${window.activeForensicSession?.sessionId || 'OFFLINE'}|${_MASTER_HASH}`;
                QRCode.toCanvas(qrCanvas, qrPayload, { width: 40, margin: 1 }, function(error) {
                    if (!error) {
                        const qrImgData = qrCanvas.toDataURL('image/png');
                        doc.addImage(qrImgData, 'PNG', 150, pageHeight - 55, 35, 35);
                        _log('Selo de integridade QR injetado na última página.');
                        
                        // Retificação de numeração total
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

        container.innerHTML = ''; // Limpeza de segurança

        const botoes = [
            { 
                id: 'triadaPeritiaBtn', 
                labelPt: 'PARECER TÉCNICO', 
                icon: 'fa-file-pdf', 
                cor: '#00E5FF',
                handler: () => window.exportPDF && window.exportPDF()
            },
            { 
                id: 'triadaPeticaoBtn', 
                labelPt: 'MINUTA PETIÇÃO', 
                icon: 'fa-file-word', 
                cor: '#0EA5E9',
                handler: () => window.exportDOCX && window.exportDOCX()
            },
            { 
                id: 'triadaCustodiaBtn', 
                labelPt: 'ANEXO CUSTÓDIA', 
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
            btn.innerHTML = `<i class="fas ${b.icon}" style="color: ${b.cor}; margin-right: 8px;"></i> ${b.labelPt}`;
            btn.onclick = b.handler;
            container.appendChild(btn);
        });

        // Ocultar triggers antigos
        ['exportPDFBtn', 'exportDOCXBtn'].forEach(id => {
            const old = document.getElementById(id);
            if (old) old.style.display = 'none';
        });

        _log('Interface Tríade Documental v1.0.11 activada.');
    }

    // Exportação para o scope global
    window.gerarAnexoCustodia = gerarAnexoCustodia;
    window.injetarBotoesTriada = injetarBotoes;

    // Inicialização por evento de prontidão do núcleo
    window.addEventListener('UNIFED_CORE_READY', () => {
        setTimeout(injetarBotoes, 200);
    });

})();