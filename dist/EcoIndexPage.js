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
exports.getPageMetrics = exports.EcoIndexPage = exports.ECOINDEX_PAGE_EVENTS = void 0;
const EcoIndexDataHandler_1 = require("./utils/EcoIndexDataHandler");
const EcoIndexStory_1 = require("./EcoIndexStory");
/**
 * Ecoindex page Events.
 *
 * @type {{AFTER_INIT: string, PAGE_LOADED: string, AFTER_SCROLL: string, AFTER_VISIT: string}}
 */
exports.ECOINDEX_PAGE_EVENTS = {
    PAGE_LOADED: 'EcoIndex Page - Page has been loaded',
    AFTER_SCROLL: 'EcoIndex Page - After scroll',
};
/**
 * Get the ecoindex raw parameters for a specific page.
 */
class EcoIndexPage {
    constructor(story = new EcoIndexStory_1.EcoIndexStory()) {
        this.story = story;
    }
    /**
     * Return the metrics for a specific URL.
     *
     * @param page
     * @param {string} url
     * @param {{}} settings
     * @returns {Promise<EcoIndexMetrics | undefined>}
     */
    getMetrics(page, url, settings = {}) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.story.clear();
            const eventData = { story: this.story, page: page };
            yield this.story.start(page, settings);
            yield page.goto(url);
            yield this.story.trigger(exports.ECOINDEX_PAGE_EVENTS.PAGE_LOADED, eventData);
            yield (0, EcoIndexDataHandler_1.scrollToBottom)(page);
            yield this.trigger(exports.ECOINDEX_PAGE_EVENTS.AFTER_SCROLL, eventData);
            yield (0, EcoIndexDataHandler_1.wait)();
            yield this.story.stop(page);
            return (_a = this.story.getSteps().pop()) === null || _a === void 0 ? void 0 : _a.getMetrics();
        });
    }
    /**
     * Trigger events.
     *
     * @param {string} id
     * @param data
     * @returns {Promise<void>}
     */
    trigger(id, data = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.story.trigger(id, data);
        });
    }
    /**
     * Listen events. If no id, all events will be triggered.
     *
     * @param {string | null} id
     * @param callback
     */
    on(id = null, callback) {
        return this.story.on(id, callback);
    }
}
exports.EcoIndexPage = EcoIndexPage;
/**
 * Return page metrics.
 *
 * @param page
 * @param {string} url
 * @returns {Promise<EcoIndexMetrics | undefined>}
 */
function getPageMetrics(page, url) {
    return __awaiter(this, void 0, void 0, function* () {
        const ecoIndexPage = new EcoIndexPage();
        return ecoIndexPage.getMetrics(page, url);
    });
}
exports.getPageMetrics = getPageMetrics;
