import { EcoIndexMetrics } from './utils/EcoIndexDataHandler';
import { EcoIndexStory } from './EcoIndexStory';
/**
 * Ecoindex page Events.
 *
 * @type {{AFTER_INIT: string, PAGE_LOADED: string, AFTER_SCROLL: string, AFTER_VISIT: string}}
 */
export declare const ECOINDEX_PAGE_EVENTS: {
    PAGE_LOADED: string;
    AFTER_SCROLL: string;
};
/**
 * Get the ecoindex raw parameters for a specific page.
 */
export declare class EcoIndexPage {
    private story;
    constructor(story?: EcoIndexStory);
    /**
     * Return the metrics for a specific URL.
     *
     * @param page
     * @param {string} url
     * @param {{}} settings
     * @returns {Promise<EcoIndexMetrics | undefined>}
     */
    getMetrics(page: any, url: string, settings?: {}): Promise<EcoIndexMetrics | undefined>;
    /**
     * Trigger events.
     *
     * @param {string} id
     * @param data
     * @returns {Promise<void>}
     */
    trigger(id: string, data?: any): Promise<void>;
    /**
     * Listen events. If no id, all events will be triggered.
     *
     * @param {string | null} id
     * @param callback
     */
    on(id: string | null | undefined, callback: any): void;
}
/**
 * Return page metrics.
 *
 * @param page
 * @param {string} url
 * @returns {Promise<EcoIndexMetrics | undefined>}
 */
export declare function getPageMetrics(page: any, url: string): Promise<EcoIndexMetrics | undefined>;
