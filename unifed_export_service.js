/**
 * UNIFED - PROBATUM · SERVIÇO DE EXPORTAÇÃO UNIFICADO (SINGLETON)
 * Versão: 1.0.0-RTF-UNIFED-2026-0406 (sem adaptadores automáticos)
 */
'use strict';

window.UNIFEDExportService = (function _UNIFEDExportServiceIIFE() {
    var _instance = null;
    var _state = {
        renderers: Object.create(null),
        locked: false,
        lastHash: null,
        lastType: null,
        exportCount: 0
    };
    var _VALID_TYPES = ['pdf', 'docx', 'custody'];

    function _log(msg, level) {
        var method = { warn: 'warn', error: 'error', success: 'info' }[level] || 'log';
        console[method]('[' + new Date().toISOString() + '] [ExportService] ' + msg);
    }

    async function _sealAtomically() {
        var sys = window.UNIFEDSystem;
        if (!sys) throw new Error('UNIFEDSystem não inicializado.');
        if (typeof sys.generateForensicSeal === 'function') {
            try {
                await sys.generateForensicSeal();
                _log('generateForensicSeal() executado com sucesso.');
            } catch (sealErr) {
                _log('generateForensicSeal() falhou: ' + sealErr.message, 'warn');
            }
        }
        var hash = sys.masterHash;
        if (typeof hash !== 'string' || !/^[0-9A-Fa-f]{64}$/.test(hash)) {
            throw new Error('Master Hash inválido. Carregue evidências antes de exportar.');
        }
        _state.lastHash = hash.toUpperCase();
        _log('Selagem atómica concluída. Hash prefix: ' + _state.lastHash.substring(0, 12) + '...');
        return _state.lastHash;
    }

    function _createInstance() {
        function register(type, rendererFn) {
            if (_VALID_TYPES.indexOf(type) === -1) {
                throw new TypeError('[ExportService] Tipo inválido: "' + type + '".');
            }
            if (typeof rendererFn !== 'function') {
                throw new TypeError('[ExportService] rendererFn deve ser uma Function.');
            }
            _state.renderers[type] = rendererFn;
            _log('Renderer "' + type + '" registado.');
            if (_state.renderers.pdf && _state.renderers.docx) {
                if (window.UNIFEDEventBus && !window.UNIFEDEventBus.hasResolved('UNIFED_EXPORT_READY')) {
                    window.UNIFEDEventBus.emit('UNIFED_EXPORT_READY', { types: Object.keys(_state.renderers) });
                    _log('UNIFED_EXPORT_READY emitido.', 'success');
                }
            }
        }

        async function exportDocument(type) {
            if (_VALID_TYPES.indexOf(type) === -1) throw new TypeError('[ExportService] Tipo inválido.');
            if (_state.locked) {
                _log('Exportação "' + type + '" rejeitada: outra em curso.', 'warn');
                if (typeof window.showToast === 'function') window.showToast('Exportação em curso.', 'warn');
                return;
            }
            if (!_state.renderers[type]) throw new Error('[ExportService] Renderer não registado para tipo "' + type + '".');
            _state.locked = true;
            _log('Exportação "' + type + '" iniciada.');
            try {
                var masterHash = await _sealAtomically();
                await _state.renderers[type](masterHash);
                _state.lastType = type;
                _state.exportCount++;
                _log('Exportação "' + type + '" concluída (total: ' + _state.exportCount + ').', 'success');
            } catch (err) {
                _log('Exportação "' + type + '" falhou: ' + err.message, 'error');
                if (typeof window.showToast === 'function') window.showToast('Erro na exportação: ' + err.message, 'error');
                throw err;
            } finally {
                _state.locked = false;
            }
        }

        function status() {
            return Object.freeze({
                registeredTypes: Object.keys(_state.renderers).slice(),
                locked: _state.locked,
                lastType: _state.lastType,
                lastHashPrefix: _state.lastHash ? _state.lastHash.substring(0, 12) + '...' : null,
                exportCount: _state.exportCount
            });
        }

        return Object.freeze({ register, export: exportDocument, status });
    }

    function getInstance() {
        if (!_instance) _instance = _createInstance();
        return _instance;
    }

    return Object.freeze({ getInstance: getInstance });
})();