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
    private _rawBitSize;
    constructor(dom?: number, request?: number, _rawBitSize?: number | undefined);
    /**
     * Check if EcoIndex metrics has been set.
     *
     * @returns {boolean}
     */
    hasData(): boolean;
    /**
     * Set raw size (bit count).
     *
     * @param {number} value
     */
    set bitSize(value: number);
    /**
     * Return the size (Bytes)
     *
     * @returns {number | undefined}
     */
    get size(): number | undefined;
    /**
     * Return the bit size (bit).
     *
     * @returns {number | undefined}
     */
    getBitSize(): number | undefined;
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
