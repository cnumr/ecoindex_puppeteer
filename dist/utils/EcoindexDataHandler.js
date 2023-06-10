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
exports.EcoindexDataHandler = exports.ECOINDEX_HANDLER_OPTIONS = exports.EcoindexStructure = void 0;
/**
 * Ecoindex data structure.
 */
class EcoindexStructure {
    constructor(dom = 0, request = 0, size = undefined) {
        this.dom = dom;
        this.request = request;
        this.size = size;
    }
    /**
     * Check if ecoindex structure has been set.
     *
     * @returns {boolean}
     */
    hasData() {
        return this.size !== undefined;
    }
}
exports.EcoindexStructure = EcoindexStructure;
/**
 * Handler options.
 *
 * @type {{wait: number}}
 */
exports.ECOINDEX_HANDLER_OPTIONS = {
    wait: 3000,
    timeout: 3000,
};
/**
 * Object that will get the several data needed by the ecoindex computor.
 */
class EcoindexDataHandler {
    /**
     * Constructor
     *
     * @param page Puppeteer page.
     * @param options Options.
     */
    constructor(page, options) {
        this.page = page;
        this.options = Object.assign(Object.assign({}, exports.ECOINDEX_HANDLER_OPTIONS), options);
        this.rawResults = new EcoindexStructure();
        // Init networks callbacks.
        this.onNetworkLoadingFinished = (event) => {
            this.rawResults.request++;
            this.rawResults.size += event.encodedDataLength;
        };
    }
    /**
     * Init ecoindex puppeteer page configuration and listeners.
     *
     * @returns {Promise<void>}
     */
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.clearResults();
            // disabling cache
            const client = yield this.page.target()
                .createCDPSession();
            yield client.send('Network.clearBrowserCache');
            // Init network events.
            yield this._initNetworksEvents();
        });
    }
    /**
     * Init networks events.
     *
     * @returns {Promise<void>}
     */
    _initNetworksEvents() {
        return __awaiter(this, void 0, void 0, function* () {
            this.rawResults.request = this.rawResults.request || 0;
            this.rawResults.size = this.rawResults.size || 0;
            this.devTools = yield this.page.target()
                .createCDPSession();
            yield this.devTools.send('Network.enable');
            this.devTools.on('Network.loadingFinished', this.onNetworkLoadingFinished);
        });
    }
    /**
     * Return the number of elements in dom.
     *
     * @returns {Promise<number>}
     */
    getDOMElementCount() {
        return __awaiter(this, void 0, void 0, function* () {
            this.rawResults.dom = 0;
            const getElementCount = () => document.querySelectorAll('*').length - document.querySelectorAll('svg *').length;
            for (const frame of this.page.frames()) {
                this.rawResults.dom += yield frame.evaluate(getElementCount);
            }
            return this.rawResults.dom;
        });
    }
    /**
     * Return the number of request since initialization.
     *
     * @returns {Promise<unknown>}
     */
    getRequestCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                var _a;
                resolve((_a = this.rawResults) === null || _a === void 0 ? void 0 : _a.request);
            });
        });
    }
    /**
     * Return the response size in (B).
     * @returns {Promise<void>}
     */
    getSize() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                var _a;
                resolve((_a = this.rawResults) === null || _a === void 0 ? void 0 : _a.size);
            });
        });
    }
    /**
     * Return the result.
     *
     * @returns {Promise<EcoindexStructure>}
     */
    getRawResult() {
        return __awaiter(this, void 0, void 0, function* () {
            // Only dom elements are note dynamically populated. So we compute it.
            yield this.getDOMElementCount();
            return this.rawResults;
        });
    }
    /**
     * Clear raw results.
     */
    clearResults() {
        this.rawResults = new EcoindexStructure();
    }
    /**
     * Stop network listening.
     */
    stop() {
        this.devTools.off('Network.loadingFinished', this.onNetworkLoadingFinished);
    }
}
exports.EcoindexDataHandler = EcoindexDataHandler;
