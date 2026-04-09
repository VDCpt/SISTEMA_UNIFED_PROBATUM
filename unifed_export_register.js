/**
 * UNIFED - PROBATUM · REGISTO DE RENDERERS · v13.11.16-PURE
 * ============================================================================
 */

'use strict';

(function() {
    async function _initRegistration() {
        const bus = window.UNIFEDEventBus;
        const svc = window.UNIFEDExportService.getInstance();

        if (!bus) return;

        // Aguarda que os motores base estejam carregados
        await bus.waitFor('UNIFED_CORE_READY');

        // Registo do Renderer PDF (vinculado ao script.js)
        if (typeof window.exportPDF_impl === 'function') {
            svc.register('pdf', window.exportPDF_impl);
        } else if (typeof window.exportPDF === 'function') {
             // Fallback se já estiver exposto
             svc.register('pdf', async () => window.exportPDF());
        }

        // Registo do Renderer DOCX (vinculado ao enrichment.js)
        if (typeof window.generateLegalNarrative === 'function') {
            svc.register('docx', async (ctx) => {
                if (window.exportDOCX) window.exportDOCX();
            });
        }

        console.info('[UNIFED-REGISTER] ✅ Módulos de exportação vinculados ao Serviço Atómico.');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', _initRegistration);
    } else {
        _initRegistration();
    }
})();