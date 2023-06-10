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
exports.EcoIndexPage = exports.ECOINDEX_PAGE_EVENTS = void 0;
const puppeteer_autoscroll_down_1 = require("puppeteer-autoscroll-down");
const AbstractEventsClass_1 = require("./utils/AbstractEventsClass");
const EcoIndexDataHandler_1 = require("./utils/EcoIndexDataHandler");
/**
 * Ecoindex page Events.
 *
 * @type {{AFTER_INIT: string, PAGE_LOADED: string, AFTER_SCROLL: string, AFTER_VISIT: string}}
 */
exports.ECOINDEX_PAGE_EVENTS = {
    AFTER_INIT: 'EcoIndex Page - After initialization',
    AFTER_VISIT: 'EcoIndex Page - After visit url',
    PAGE_LOADED: 'EcoIndex Page - Pages has been loaded',
    AFTER_SCROLL: 'EcoIndex Page - After scroll',
    TIMEOUT_REACHED: 'EcoIndex Page - Timeout reached on page load',
};
/**
 * Get the ecoindex raw parameters for a specific page.
 */
class EcoIndexPage extends AbstractEventsClass_1.AbstractEventsClass {
    /**
     * Return the metrics for a specific URL.
     *
     * @param {Page} page
     * @param {string} url
     * @param {any} settings
     * @returns {Promise<EcoindexStructure>}
     */
    getMetrics(page, url, settings = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = Object.assign(Object.assign({}, EcoIndexDataHandler_1.ECOINDEX_HANDLER_OPTIONS), settings);
            const handler = new EcoIndexDataHandler_1.EcoIndexDataHandler(page, options);
            const eventData = { page: page, url: url, options: options, handler: handler };
            yield handler.init();
            yield this.trigger(exports.ECOINDEX_PAGE_EVENTS.AFTER_INIT, eventData);
            // Load the page.
            yield page.goto(url, { timeout: options.timeout });
            yield this.trigger(exports.ECOINDEX_PAGE_EVENTS.AFTER_VISIT, eventData);
            try {
                yield page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: options.timeout });
            }
            catch (err) {
                yield this.trigger(exports.ECOINDEX_PAGE_EVENTS.TIMEOUT_REACHED, eventData);
            }
            yield this.trigger(exports.ECOINDEX_PAGE_EVENTS.PAGE_LOADED, eventData);
            // Scroll to bottom in order to load all imgs dependencies.
            yield this.scrollToBottom(page);
            yield this.trigger(exports.ECOINDEX_PAGE_EVENTS.AFTER_SCROLL, eventData);
            // Get result.
            const result = handler.getRawMetrics();
            handler.stop();
            return result;
        });
    }
    /**
     * Scroll to bottom of the page.
     *
     * @param page
     * @returns {Promise<void>}
     */
    scrollToBottom(page) {
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
}
exports.EcoIndexPage = EcoIndexPage;
