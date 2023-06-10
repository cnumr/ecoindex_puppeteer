/**
 * Ecoindex data structure.
 */
import {CDPSession, Handler, Page} from 'puppeteer-core';

const convert = require('convert-pro');

/**
 * EcoIndex metrics.
 */
export class EcoIndexMetrics {
  constructor(
    public dom: number = 0,
    public request: number = 0,
    private _rawBitSize: number | undefined = undefined,
  ) {
  }

  /**
   * Check if EcoIndex metrics has been set.
   *
   * @returns {boolean}
   */
  public hasData(): boolean {
    return this._rawBitSize !== undefined;
  }

  /**
   * Set raw size (bit count).
   *
   * @param {number} value
   */
  set bitSize(value: number) {
    this._rawBitSize = value;
  }

  /**
   * Return the size (Bytes)
   *
   * @returns {number | undefined}
   */
  get size(): number | undefined {
    return convert.bytes(this._rawBitSize || 0, 'KB');
  }

  /**
   * Return the bit size (bit).
   *
   * @returns {number | undefined}
   */
  getBitSize(): number | undefined {
    return this._rawBitSize;
  }

}

/**
 * Handler options.
 *
 * @type {{wait: number}}
 */
export const ECOINDEX_HANDLER_OPTIONS = {
  wait: 3000,
  timeout: 3000,
};

/**
 * Object that will get the several data needed by the ecoindex computor.
 */
export class EcoIndexDataHandler {

  protected page: Page;
  protected options: any;
  protected rawMetrics: EcoIndexMetrics;
  private devTools: CDPSession | undefined;
  private onNetworkLoadingFinished: Handler<any>;

  /**
   * Constructor
   *
   * @param page Puppeteer page.
   * @param options Options.
   */
  constructor(page: any, options: any) {
    this.page = page;
    this.options = {
      ...ECOINDEX_HANDLER_OPTIONS,
      ...options,
    };

    this.rawMetrics = new EcoIndexMetrics();

    // Init networks callbacks.
    this.onNetworkLoadingFinished = (event: any) => {
      this.rawMetrics.request++;
      this.rawMetrics.bitSize += event.encodedDataLength;
    };
  }

  /**
   * Init ecoindex puppeteer page configuration and listeners.
   *
   * @returns {Promise<void>}
   */
  async init() {
    this.clearResults();

    // disabling cache
    const client = await this.page.target()
      .createCDPSession();
    await client.send('Network.clearBrowserCache');

    // Init network events.
    await this._initNetworksEvents();
  }

  /**
   * Init networks events.
   *
   * @returns {Promise<void>}
   */
  async _initNetworksEvents(): Promise<void> {
    this.rawMetrics.request = 0;
    this.rawMetrics.bitSize = 0;
    this.devTools = await this.page.target()
      .createCDPSession();
    await this.devTools.send('Network.enable');

    this.devTools?.on('Network.loadingFinished', this.onNetworkLoadingFinished);
  }

  /**
   * Return the number of elements in dom.
   *
   * @returns {Promise<number>}
   */
  async getDOMElementsCount() {
    this.rawMetrics.dom = 0;

    const getElementsCount = () => document.querySelectorAll('*').length - document.querySelectorAll('svg *').length;

    // Count elements into each frames.
    for (const frame of this.page.frames()) {
      this.rawMetrics.dom += await frame.evaluate(getElementsCount);
    }

    return this.rawMetrics.dom;
  }

  /**
   * Return the result.
   *
   * @returns {Promise<EcoIndexMetrics>}
   */
  async getRawMetrics() {
    // Only dom elements are note dynamically populated. So we compute it.
    await this.getDOMElementsCount();
    return this.rawMetrics;
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
    this.devTools?.off('Network.loadingFinished', this.onNetworkLoadingFinished);
  }
}
