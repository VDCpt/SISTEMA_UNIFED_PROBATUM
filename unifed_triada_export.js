/**
 * UNIFED - PROBATUM · MÓDULO DE EXPORTAÇÃO — TRÍADE DOCUMENTAL · v13.11.16-PURE
 * ============================================================================
 */

'use strict';

(function() {
    const TriadaModule = {
        version: "2.0.0-PURE"
    };

    /**
     * [R-T02]: Construção Segura de Botões (Anti-XSS)
     */
    function createExportButton(id, labelPt, labelEn, type) {
        const btn = document.createElement('button');
        btn.id = id;
        btn.className = 'pure-button-export';
        btn.setAttribute('data-pt', labelPt);
        btn.setAttribute('data-en', labelEn);
        btn.textContent = (window.currentLang === 'en') ? labelEn : labelPt;
        
        btn.onclick = () => {
            const svc = window.UNIFEDExportService.getInstance();
            svc.export(type);
        };
        
        return btn;
    }

    /**
     * Inicializa a interface de exportação no Dashboard
     */
    async function initTriadaInterface() {
        if (!window.UNIFEDEventBus) return;

        try {
            await window.UNIFEDEventBus.waitFor('UNIFED_DOM_READY', 5000);
            
            const container = document.getElementById('pure-export-actions');
            if (container) {
                container.appendChild(createExportButton('btn-exp-pdf', 'EXPORTAR PDF', 'EXPORT PDF', 'pdf'));
                container.appendChild(createExportButton('btn-exp-docx', 'MINUTA DOCX', 'DOCX DRAFT', 'docx'));
                container.appendChild(createExportButton('btn-exp-custody', 'ANEXO CUSTÓDIA', 'CUSTODY ANX', 'custody'));
                console.info('[TRIADA] Interface de exportação injetada.');
            }
        } catch (e) {
            console.warn('[TRIADA] Falha ao injetar botões: Content Wrapper não encontrado.');
        }
    }

    // Registo do Renderer de Custódia
    function _registerCustody() {
        const svc = window.UNIFEDExportService.getInstance();
        svc.register('custody', async (ctx) => {
            console.log("Gerando Anexo de Custódia Criptográfico...");
            // Lógica interna de geração de log de hashes
            const content = `UNIFED CUSTODY LOG\nSESSION: ${ctx.sessionId}\nHASH: ${ctx.masterHash}\nTS: ${ctx.timestamp}`;
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `CUSTODIA_${ctx.sessionId}.txt`;
            a.click();
        });
    }

    // Arranque
    initTriadaInterface();
    _registerCustody();

    window.UNIFEDTriada = TriadaModule;
})();