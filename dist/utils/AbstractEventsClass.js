"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractEventsClass = void 0;
/**
 * Abstract event tools.
 */
class AbstractEventsClass {
    constructor() {
        this.callbacks = {};
    }
    /**
     * Listen events.
     *
     * @param {string} id
     * @param callback
     */
    on(id, callback) {
        this.callbacks[id] = this.callbacks[id] || [];
        this.callbacks[id].push(callback);
    }
    /**
     * Trigger events.
     *
     * @param {string} id
     * @param {{}} data
     * @returns {Promise<void>}
     */
    trigger(id, data = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const cb of this.callbacks[id] || []) {
                yield cb(data);
            }
        });
    }
}
exports.AbstractEventsClass = AbstractEventsClass;
