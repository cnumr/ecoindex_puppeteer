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
exports.EcoIndexDataHandler = exports.ECOINDEX_HANDLER_OPTIONS = exports.EcoIndexMetrics = void 0;
const { default: convert } = require('convert-pro');
/**
 * EcoIndex metrics.
 */
class EcoIndexMetrics {
    constructor(dom = 0, request = 0, _rawBitSize = undefined) {
        this.dom = dom;
        this.request = request;
        this._rawBitSize = _rawBitSize;
    }
    /**
     * Check if EcoIndex metrics has been set.
     *
     * @returns {boolean}
     */
    hasData() {
        return this._rawBitSize !== undefined;
    }
    /**
     * Set raw size (bit count).
     *
     * @param {number} value
     */
    set bitSize(value) {
        this._rawBitSize = value;
    }
    /**
     * Return the size (Bytes)
     *
     * @returns {number | undefined}
     */
    get size() {
        return convert.bytes(this._rawBitSize || 0, 'KB');
    }
    /**
     * Return the bit size (bit).
     *
     * @returns {number | undefined}
     */
    getBitSize() {
        return this._rawBitSize;
    }
}
exports.EcoIndexMetrics = EcoIndexMetrics;
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
class EcoIndexDataHandler {
    /**
     * Constructor
     *
     * @param page Puppeteer page.
     * @param options Options.
     */
    constructor(page, options) {
        this.page = page;
        this.options = Object.assign(Object.assign({}, exports.ECOINDEX_HANDLER_OPTIONS), options);
        this.rawMetrics = new EcoIndexMetrics();
        // Init networks callbacks.
        this.onNetworkLoadingFinished = (event) => {
            this.rawMetrics.request++;
            this.rawMetrics.bitSize += event.encodedDataLength;
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
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.rawMetrics.request = 0;
            this.rawMetrics.bitSize = 0;
            this.devTools = yield this.page.target()
                .createCDPSession();
            yield this.devTools.send('Network.enable');
            (_a = this.devTools) === null || _a === void 0 ? void 0 : _a.on('Network.loadingFinished', this.onNetworkLoadingFinished);
        });
    }
    /**
     * Return the number of elements in dom.
     *
     * @returns {Promise<number>}
     */
    getDOMElementsCount() {
        return __awaiter(this, void 0, void 0, function* () {
            this.rawMetrics.dom = 0;
            const getElementsCount = () => document.querySelectorAll('*').length - document.querySelectorAll('svg *').length;
            // Count elements into each frames.
            for (const frame of this.page.frames()) {
                this.rawMetrics.dom += yield frame.evaluate(getElementsCount);
            }
            return this.rawMetrics.dom;
        });
    }
    /**
     * Return the result.
     *
     * @returns {Promise<EcoIndexMetrics>}
     */
    getRawMetrics() {
        return __awaiter(this, void 0, void 0, function* () {
            // Only dom elements are note dynamically populated. So we compute it.
            yield this.getDOMElementsCount();
            return this.rawMetrics;
        });
    }
    /**
     * Clear raw results.
     */
    clearResults() {
        this.rawMetrics = new EcoIndexMetrics();
    }
    /**
     * Stop network listening.
     */
    stop() {
        var _a;
        (_a = this.devTools) === null || _a === void 0 ? void 0 : _a.off('Network.loadingFinished', this.onNetworkLoadingFinished);
    }
}
exports.EcoIndexDataHandler = EcoIndexDataHandler;
