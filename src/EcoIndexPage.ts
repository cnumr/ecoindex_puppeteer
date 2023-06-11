import {scrollPageToBottom} from 'puppeteer-autoscroll-down';
import {Page} from 'puppeteer-core';

import {AbstractEventsClass} from './utils/AbstractEventsClass';
import {ECOINDEX_HANDLER_OPTIONS, EcoIndexDataHandler, scrollToBottom} from './utils/EcoIndexDataHandler';

/**
 * Ecoindex page Events.
 *
 * @type {{AFTER_INIT: string, PAGE_LOADED: string, AFTER_SCROLL: string, AFTER_VISIT: string}}
 */
export const ECOINDEX_PAGE_EVENTS = {
  AFTER_INIT: 'EcoIndex Page - After initialization',
  AFTER_VISIT: 'EcoIndex Page - After visit url',
  PAGE_LOADED: 'EcoIndex Page - Pages has been loaded',
  AFTER_SCROLL: 'EcoIndex Page - After scroll',
  TIMEOUT_REACHED: 'EcoIndex Page - Timeout reached on page load',
};

/**
 * Get the ecoindex raw parameters for a specific page.
 */
export class EcoIndexPage extends AbstractEventsClass {

  /**
   * Return the metrics for a specific URL.
   *
   * @param {any} page
   * @param {string} url
   * @param {any} settings
   * @returns {Promise<EcoindexStructure>}
   */
  async getMetrics(page: any, url: string, settings = {}) {
    const options = {...ECOINDEX_HANDLER_OPTIONS, ...settings};
    const handler = new EcoIndexDataHandler(page, options);
    await handler.init();
    const eventData = {page: page, url: url, options: options, handler: handler};

    // await handler.init();
    await this.trigger(ECOINDEX_PAGE_EVENTS.AFTER_INIT, eventData);

    // Load the page.
    await page.goto(url, {timeout: options.timeout});
    await this.trigger(ECOINDEX_PAGE_EVENTS.AFTER_VISIT, eventData);
    try {
      await page.waitForNavigation({waitUntil: 'domcontentloaded', timeout: options.timeout});
    } catch (err) {
      await this.trigger(ECOINDEX_PAGE_EVENTS.TIMEOUT_REACHED, eventData);
    }
    await this.trigger(ECOINDEX_PAGE_EVENTS.PAGE_LOADED, eventData);

    // Scroll to bottom in order to load all imgs dependencies.
    await scrollToBottom(page);
    await this.trigger(ECOINDEX_PAGE_EVENTS.AFTER_SCROLL, eventData);

    // Get result.
    const result = await handler.getRawMetrics();
    handler.stop();
    return result;
  }
}
