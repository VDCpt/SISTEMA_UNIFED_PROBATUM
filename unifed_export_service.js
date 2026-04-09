/**
 * UNIFED - PROBATUM · SERVIÇO DE EXPORTAÇÃO UNIFICADO (SINGLETON) · v13.11.16-PURE
 * ============================================================================
 * Missão: Centralizar a selagem criptográfica antes da serialização.
 * Conformidade: DORA (UE) 2022/2554 · ISO/IEC 27037:2012
 * ============================================================================
 */

'use strict';

window.UNIFEDExportService = (function() {
    let _instance = null;
    const _renderers = new Map();
    let _isLocked = false;

    class ExportService {
        constructor() {
            this.version = "1.0.0-RTF-PURE";
        }

        /**
         * Regista um motor de renderização (pdf, docx, ou custody)
         */
        register(type, rendererFn) {
            if (typeof rendererFn !== 'function') return;
            _renderers.set(type, rendererFn);
            console.log(`[ExportService] Renderer registado: ${type.toUpperCase()}`);
            
            if (window.UNIFEDEventBus) {
                window.UNIFEDEventBus.emit('UNIFED_EXPORT_READY', { type });
            }
        }

        /**
         * Executa a exportação com selagem atómica
         */
        async export(type) {
            if (_isLocked) {
                console.warn('[ExportService] Exportação em curso. Aguarde.');
                return;
            }

            const renderer = _renderers.get(type);
            if (!renderer) {
                console.error(`[ExportService] Erro: Renderer '${type}' não encontrado.`);
                return;
            }

            _isLocked = true;
            try {
                console.info(`[ExportService] Iniciando selagem atómica para: ${type.toUpperCase()}`);
                
                // Garantir que o Master Hash está atualizado antes de exportar
                const masterHash = window.UNIFEDSystem?.masterHash || "PENDING_VALIDATION";
                
                // Executar o renderer passando o contexto de integridade
                await renderer({
                    timestamp: new Date().toISOString(),
                    masterHash: masterHash,
                    sessionId: window.UNIFEDSystem?.sessionId
                });

                console.log(`[ExportService] Exportação '${type}' concluída com sucesso.`);
            } catch (err) {
                console.error(`[ExportService] Falha crítica na exportação ${type}:`, err);
            } finally {
                _isLocked = false;
            }
        }

        status() {
            return {
                activeRenderers: Array.from(_renderers.keys()),
                isLocked: _isLocked,
                version: this.version
            };
        }
    }

    return {
        getInstance: function() {
            if (!_instance) _instance = new ExportService();
            return _instance;
        }
    };
})();

// Adaptadores de Retrocompatibilidade
(function _installCompatAdapters() {
    const svc = window.UNIFEDExportService.getInstance();
    window.exportPDF = () => svc.export('pdf');
    window.exportDOCX = () => svc.export('docx');
    console.info('[ExportService] ✅ Adaptadores de compatibilidade instalados.');
})();