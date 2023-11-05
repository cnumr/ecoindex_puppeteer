/**
 * Ecoindex data structure.
 */
import {CDPSession, Handler, Page} from 'puppeteer-core';
import {scrollPageToBottom} from 'puppeteer-autoscroll-down';

const {default: convert} = require('convert-pro');

/**
 * EcoIndex metrics.
 */
export class EcoIndexMetrics {
  constructor(
    public dom: number = 0,
    public request: number = 0,
    public bitSize: number | undefined = undefined,
  ) {
  }

  /**
   * Check if EcoIndex metrics has been set.
   *
   * @returns {boolean}
   */
  public hasData(): boolean {
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
  getSize(): number | undefined {
    return convert.bytes(this.bitSize || 0, 'KB');
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
  private responsesMap: Map<string, any>;
  private devTools: CDPSession | undefined;
  private onNetworkResponseReceived: Handler<any>;
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
    this.responsesMap = new Map();

    // Init on response callbacks.
    this.onNetworkResponseReceived = (event: any) => {
      this.responsesMap.set(event.requestId, event.response);
    };

    // Init networks callbacks.
    this.onNetworkLoadingFinished = (event: any) => {
      const response = this.responsesMap.get(event.requestId);
      const isCachedOrData = response.fromDiskCache || response.fromServiceWorker || response.fromPrefetchCache || response.protocol === 'data';
      if (!isCachedOrData) {
        this.rawMetrics.request++;
        this.rawMetrics.bitSize += event.encodedDataLength;
      }
    };
  }

  /**
   * Init ecoindex puppeteer page configuration and listeners.
   *
   * @returns {Promise<void>}
   */
  async init() {
    this.clearResults();

    // Init network events.
    await this._initNetworksEvents();
  }

  /**
   * Init networks events.
   *
   * @returns {Promise<void>}
   */
  async _initNetworksEvents(): Promise<void> {
    this.devTools = await this.page.target()
      .createCDPSession();
    await this.devTools.send('Network.clearBrowserCache');
    await this.devTools.send('Network.enable');
    this.devTools?.on('Network.loadingFinished', this.onNetworkLoadingFinished);
    this.devTools?.on('Network.responseReceived', this.onNetworkResponseReceived);
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
    this.rawMetrics.bitSize = 0;
  }

  /**
   * Stop network listening.
   */
  stop() {
    this.devTools?.off('Network.loadingFinished', this.onNetworkLoadingFinished);
    this.devTools?.off('Network.responseReceived', this.onNetworkResponseReceived);
  }
}

/**
 * Scroll to bottom of the page.
 *
 * @param page
 * @returns {Promise<void>}
 */
export async function scrollToBottom(page: any): Promise<void> {
  const bodyHeight = await page.evaluate(() => document.body.clientHeight);
  const windowHeight = await page.evaluate(() => window.innerHeight);
  for (let i = 0; i < Math.floor(bodyHeight / windowHeight) + 2; i++) {
    await scrollPageToBottom(page, {
      size: windowHeight,
      delay: 200,
    });
  }
}

/**
 * Wait milliseconds.
 *
 * @param {number} timeout
 * @returns {Promise<void>}
 */
export async function wait(timeout = 3000): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), timeout);
  });
}
