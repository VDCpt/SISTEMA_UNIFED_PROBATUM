/**
 * ============================================================================
 * UNIFED - PROBATUM · EVENT BUS CENTRALIZADO
 * ============================================================================
 * Ficheiro      : unifed_event_bus.js
 * Versão        : 1.0.0-RTF-UNIFED-2026-0406-PURE
 * ============================================================================
 * OBJECTIVO:
 * Substituir padrões de latência (setTimeout) por sincronização por eventos.
 * Garante que o carregamento do "CASO REAL" aguarda a prontidão do DOM.
 * * EVENTOS PADRÃO DO SISTEMA:
 * 'UNIFED_CORE_READY'       — UNIFEDSystem inicializado
 * 'UNIFED_DOM_READY'        — Interface panel.html injetada
 * 'UNIFED_EVIDENCE_LOADED'  — Dados do caso real processados
 * 'languageChanged'         — Alteração global de idioma (PT/EN)
 * ============================================================================
 */

window.UNIFEDEventBus = (function() {
    'use strict';

    const _handlers = {};
    const _resolved = new Set();
    const _eventData = new Map();

    /**
     * Subscrever a um evento
     */
    function on(eventName, handler) {
        if (typeof handler !== 'function') return;
        if (!_handlers[eventName]) _handlers[eventName] = [];
        _handlers[eventName].push(handler);

        // Se o evento já tiver sido resolvido, dispara imediatamente (Idempotência)
        if (_resolved.has(eventName)) {
            handler(_eventData.get(eventName));
        }
    }

    /**
     * Subscrever apenas uma vez
     */
    function once(eventName, handler) {
        const wrapper = (data) => {
            off(eventName, wrapper);
            handler(data);
        };
        on(eventName, wrapper);
    }

    /**
     * Remover subscrição
     */
    function off(eventName, handler) {
        if (!_handlers[eventName]) return;
        _handlers[eventName] = _handlers[eventName].filter(h => h !== handler);
    }

    /**
     * Emitir evento para o barramento
     */
    function emit(eventName, data) {
        _resolved.add(eventName);
        _eventData.set(eventName, data);

        if (_handlers[eventName]) {
            _handlers[eventName].forEach(handler => {
                try {
                    handler(data);
                } catch (e) {
                    console.error(`[EVENT_BUS] Erro no handler de ${eventName}:`, e);
                }
            });
        }
    }

    /**
     * Devolve uma Promise que resolve quando o evento ocorre
     */
    function waitFor(eventName, timeout = 10000) {
        return new Promise((resolve, reject) => {
            if (_resolved.has(eventName)) {
                return resolve(_eventData.get(eventName));
            }

            const timer = setTimeout(() => {
                reject(new Error(`[EVENT_BUS] Timeout aguardando por: ${eventName}`));
            }, timeout);

            once(eventName, (data) => {
                clearTimeout(timer);
                resolve(data);
            });
        });
    }

    function hasResolved(eventName) {
        return _resolved.has(eventName);
    }

    /**
     * Diagnóstico de integridade do barramento
     */
    function diagnostics() {
        return {
            resolved: Array.from(_resolved),
            pending: Object.keys(_handlers).filter(e => !_resolved.has(e)),
            activeHandlers: Object.keys(_handlers).length
        };
    }

    // Exposição da Interface Pública Congelada
    return Object.freeze({
        on,
        once,
        off,
        emit,
        waitFor,
        hasResolved,
        diagnostics
    });
})();

/**
 * BRIDGE LEGACY: Sincronização com eventos nativos do browser
 */
(function _bridgeLegacyEvents() {
    const _LEGACY = ['UNIFED_CORE_READY', 'UNIFED_DOM_READY'];
    _LEGACY.forEach(evt => {
        window.addEventListener(evt, (e) => {
            if (!window.UNIFEDEventBus.hasResolved(evt)) {
                window.UNIFEDEventBus.emit(evt, e.detail || undefined);
            }
        });
    });
})();

console.info('[UNIFED-BUS] ✅ Barramento de Eventos v1.0.0 Ativo (DORA Compliant).');