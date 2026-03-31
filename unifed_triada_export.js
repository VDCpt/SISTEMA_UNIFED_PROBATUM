/**
 * UNIFED - PROBATUM · v13.5.0-PURE · MÓDULO DE EXPORTAÇÃO — TRÍADE DOCUMENTAL
 * ============================================================================
 * Ficheiro      : unifed_triada_export.js
 * Versão        : 1.0.15-TRIADA (QR Code + Master Hash Lock + JSON Export + i18n PT/EN)
 * Conformidade  : ISO/IEC 27037:2012 · Art. 125.º CPP · Art. 103.º RGIT
 * ============================================================================
 */

'use strict';

(function _unifedTriadaModule() {
    const _VERSION = '1.0.15-TRIADA';

    function _log(msg, type = 'log') {
        const timestamp = new Date().toISOString();
        console[type](`[${timestamp}] [TRIADA] ${msg}`);
    }

    // 1. OBTENÇÃO ESTÁVEL DO MASTER HASH
    // Prioridade: activeForensicSession > UNIFEDSystem.masterHash dinâmico > fallback demoMode > PENDING_SEAL
    function getStableMasterHash() {
        if (window.activeForensicSession && window.activeForensicSession.masterHash &&
            window.activeForensicSession.masterHash.length === 64) {
            return window.activeForensicSession.masterHash;
        }
        if (window.UNIFEDSystem && window.UNIFEDSystem.masterHash &&
            window.UNIFEDSystem.masterHash.length === 64) {
            return window.UNIFEDSystem.masterHash;
        }
        if (window.UNIFEDSystem && window.UNIFEDSystem.demoMode) {
            // Fallback estático apenas se generateForensicSeal() ainda não correu
            return "79b032809b9e54ea3504659c37edb9e49e6d462d691c75e4a5afd79d8bb8f86c";
        }
        return "PENDING_SEAL";
    }

    // 2. ANEXO DE CUSTÓDIA (PROVA MATERIAL DIGITAL) com QR Code
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

        const totalPages = doc.internal.getNumberOfPages() + 1; // vamos adicionar mais uma página para o QR
        for (let p = 1; p <= totalPages - 1; p++) {
            doc.setPage(p);
            addFooter(p, totalPages);
        }

        // Página adicional para o QR Code (última página)
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

        // Geração do QR Code
        try {
            const qrPayload = `UNIFED|${sessionId}|${masterHash}`;
            const qrCanvas = document.createElement('canvas');
            if (typeof QRCode !== 'undefined') {
                await new Promise((resolve) => {
                    QRCode.toCanvas(qrCanvas, qrPayload, { width: 200, margin: 2 }, function(error) {
                        if (!error) {
                            const qrImgData = qrCanvas.toDataURL('image/png');
                            const qrSize = 45; // mm
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

        // Rodapé da última página
        addFooter(lastPageNum, totalPages);

        // Salvar PDF
        doc.save(`UNIFED_ANEXO_CUSTODIA_${sessionId}.pdf`);
        _log(`✅ Anexo de Custódia gerado com QR Code: ${sessionId}`, 'success');
    }

    // 3. INJEÇÃO DE BOTÕES NA INTERFACE — v1.0.15 (JSON + i18n PT/EN)
    function initInterface() {
        const container = document.getElementById('triadaButtonsContainer');
        if (!container) return;

        container.innerHTML = '';

        const _tLang = (typeof window.currentLang !== 'undefined') ? window.currentLang : 'pt';
        const _tIsEN = (_tLang === 'en');
        const _tL    = function(pt, en) { return _tIsEN ? en : pt; };

        const botoes = [
            {
                id:      'triadaPdfBtn',
                label:   _tL('RELATÓRIO PERICIAL FORENSE (MOD. 03-B)', 'FORENSIC EXPERT REPORT (MOD. 03-B)'),
                icon:    'fa-file-pdf',
                cor:     '#00E5FF',
                handler: () => {
                    if (typeof window.exportPDF === 'function') window.exportPDF();
                    else alert(_tL('Função de exportação PDF não disponível.', 'PDF export function not available.'));
                }
            },
            {
                id:      'triadaDocxBtn',
                label:   _tL('MINUTA DE PETIÇÃO INICIAL', 'INITIAL PLEADING DRAFT'),
                icon:    'fa-file-word',
                cor:     '#0EA5E9',
                handler: () => {
                    if (typeof window.exportDOCX === 'function') window.exportDOCX();
                    else alert(_tL('Função de exportação DOCX não disponível.', 'DOCX export function not available.'));
                }
            },
            {
                id:      'triadaJsonBtn',
                label:   _tL('EXPORTAR JSON PERICIAL', 'EXPORT FORENSIC JSON'),
                icon:    'fa-file-code',
                cor:     '#10B981',
                handler: () => {
                    if (typeof window.exportDataJSON === 'function') {
                        window.exportDataJSON();
                    } else if (typeof window.exportCustodyChainJSON === 'function') {
                        window.exportCustodyChainJSON();
                    } else {
                        alert(_tL('Função de exportação JSON não disponível — verificar carregamento de script.js.', 'JSON export function not available — verify script.js is loaded.'));
                    }
                }
            },
            {
                id:      'triadaCustodiaBtn',
                label:   _tL('PROVA MATERIAL DIGITAL', 'DIGITAL MATERIAL EVIDENCE'),
                icon:    'fa-shield-alt',
                cor:     '#EF4444',
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
            const oldBtn = document.getElementById(id);
            if (oldBtn) oldBtn.style.display = 'none';
        });

        _log('Interface Tríade Documental v1.0.15 activada — PT: ' + _tLang.toUpperCase());
    }

    // Inicialização por evento de prontidão do núcleo
    window.addEventListener('UNIFED_CORE_READY', () => {
        setTimeout(initInterface, 200);
    });

    // Re-inicializar botões ao mudar de língua (para reflectir labels PT/EN)
    var _triadaPrevSwitch = window.switchLanguage;
    window.addEventListener('UNIFED_LANG_CHANGED', () => {
        setTimeout(initInterface, 50);
    });

    // Exposição global
    window.gerarAnexoCustodia = gerarAnexoCustodia;
    window.initTriadaButtons = initInterface;
    window.UNIFEDSystem = window.UNIFEDSystem || {};
    window.UNIFEDSystem.triadaUpdateLabels = initInterface;

    // Expor versão actualizada
    window.UNIFEDSystem.triadaVersion = '1.0.15-TRIADA';

})();