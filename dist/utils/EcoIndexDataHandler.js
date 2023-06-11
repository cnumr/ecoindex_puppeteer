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
exports.wait = exports.scrollToBottom = exports.EcoIndexDataHandler = exports.ECOINDEX_HANDLER_OPTIONS = exports.EcoIndexMetrics = void 0;
const puppeteer_autoscroll_down_1 = require("puppeteer-autoscroll-down");
const { default: convert } = require('convert-pro');
/**
 * EcoIndex metrics.
 */
class EcoIndexMetrics {
    constructor(dom = 0, request = 0, bitSize = undefined) {
        this.dom = dom;
        this.request = request;
        this.bitSize = bitSize;
    }
    /**
     * Check if EcoIndex metrics has been set.
     *
     * @returns {boolean}
     */
    hasData() {
        return this.bitSize !== undefined;
    }
    /**
     * Return the dom elements count
     * @returns {number}
     */
    getDomElementsCount() {
        return this.dom;
    }
    /**
     * Return the requests count.
     *
     * @returns {number}
     */
    getRequestsCount() {
        return this.request;
    }
    /**
     * Return the size (Bytes)
     *
     * @returns {number | undefined}
     */
    getSize() {
        return convert.bytes(this.bitSize || 0, 'KB');
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
            this.devTools = yield this.page.target()
                .createCDPSession();
            yield this.devTools.send('Network.clearBrowserCache');
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
        this.rawMetrics.bitSize = 0;
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
/**
 * Scroll to bottom of the page.
 *
 * @param page
 * @returns {Promise<void>}
 */
function scrollToBottom(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const bodyHeight = yield page.evaluate(() => document.body.clientHeight);
        const windowHeight = yield page.evaluate(() => window.innerHeight);
        for (let i = 0; i < Math.floor(bodyHeight / windowHeight) + 2; i++) {
            yield (0, puppeteer_autoscroll_down_1.scrollPageToBottom)(page, {
                size: windowHeight,
                delay: 200,
            });
        }
    });
}
exports.scrollToBottom = scrollToBottom;
/**
 * Wait milliseconds.
 *
 * @param {number} timeout
 * @returns {Promise<void>}
 */
function wait(timeout = 3000) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            setTimeout(() => resolve(), timeout);
        });
    });
}
exports.wait = wait;
