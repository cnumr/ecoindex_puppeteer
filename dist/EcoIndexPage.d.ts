import { Page } from 'puppeteer-core';
import { AbstractEventsClass } from './utils/AbstractEventsClass';
/**
 * Ecoindex page Events.
 *
 * @type {{AFTER_INIT: string, PAGE_LOADED: string, AFTER_SCROLL: string, AFTER_VISIT: string}}
 */
export declare const ECOINDEX_PAGE_EVENTS: {
    AFTER_INIT: string;
    AFTER_VISIT: string;
    PAGE_LOADED: string;
    AFTER_SCROLL: string;
    TIMEOUT_REACHED: string;
};
/**
 * Get the ecoindex raw parameters for a specific page.
 */
export declare class EcoIndexPage extends AbstractEventsClass {
    /**
     * Return the metrics for a specific URL.
     *
     * @param {Page} page
     * @param {string} url
     * @param {any} settings
     * @returns {Promise<EcoindexStructure>}
     */
    getMetrics(page: Page, url: string, settings?: {}): Promise<import("./utils/EcoIndexDataHandler").EcoIndexMetrics>;
    /**
     * Scroll to bottom of the page.
     *
     * @param page
     * @returns {Promise<void>}
     */
    protected scrollToBottom(page: Page): Promise<void>;
}
