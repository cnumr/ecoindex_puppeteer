/**
 * Ecoindex data structure.
 */
import { Page } from 'puppeteer-core';
/**
 * EcoIndex metrics.
 */
export declare class EcoIndexMetrics {
    dom: number;
    request: number;
    bitSize: number | undefined;
    constructor(dom?: number, request?: number, bitSize?: number | undefined);
    /**
     * Check if EcoIndex metrics has been set.
     *
     * @returns {boolean}
     */
    hasData(): boolean;
    /**
     * Return the dom elements count
     * @returns {number}
     */
    getDomElementsCount(): number;
    /**
     * Return the requests count.
     *
     * @returns {number}
     */
    getRequestsCount(): number;
    /**
     * Return the size (Bytes)
     *
     * @returns {number | undefined}
     */
    getSize(): number | undefined;
}
/**
 * Handler options.
 *
 * @type {{wait: number}}
 */
export declare const ECOINDEX_HANDLER_OPTIONS: {
    wait: number;
    timeout: number;
};
/**
 * Object that will get the several data needed by the ecoindex computor.
 */
export declare class EcoIndexDataHandler {
    protected page: Page;
    protected options: any;
    protected rawMetrics: EcoIndexMetrics;
    private devTools;
    private onNetworkLoadingFinished;
    /**
     * Constructor
     *
     * @param page Puppeteer page.
     * @param options Options.
     */
    constructor(page: any, options: any);
    /**
     * Init ecoindex puppeteer page configuration and listeners.
     *
     * @returns {Promise<void>}
     */
    init(): Promise<void>;
    /**
     * Init networks events.
     *
     * @returns {Promise<void>}
     */
    _initNetworksEvents(): Promise<void>;
    /**
     * Return the number of elements in dom.
     *
     * @returns {Promise<number>}
     */
    getDOMElementsCount(): Promise<number>;
    /**
     * Return the result.
     *
     * @returns {Promise<EcoIndexMetrics>}
     */
    getRawMetrics(): Promise<EcoIndexMetrics>;
    /**
     * Clear raw results.
     */
    clearResults(): void;
    /**
     * Stop network listening.
     */
    stop(): void;
}
/**
 * Scroll to bottom of the page.
 *
 * @param page
 * @returns {Promise<void>}
 */
export declare function scrollToBottom(page: any): Promise<void>;
/**
 * Wait milliseconds.
 *
 * @param {number} timeout
 * @returns {Promise<void>}
 */
export declare function wait(timeout?: number): Promise<void>;
