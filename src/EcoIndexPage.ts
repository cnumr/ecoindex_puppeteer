import {scrollPageToBottom} from 'puppeteer-autoscroll-down';
import {Page} from 'puppeteer-core';

import {AbstractEventsClass} from './utils/AbstractEventsClass';
import {
  ECOINDEX_HANDLER_OPTIONS,
  EcoIndexDataHandler,
  EcoIndexMetrics,
  scrollToBottom,
  wait,
} from './utils/EcoIndexDataHandler';
import {EcoIndexStory} from './EcoIndexStory';

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
   * @param page
   * @param {string} url
   * @param {{}} settings
   * @returns {Promise<EcoIndexMetrics | undefined>}
   */
  async getMetrics(page: any, url: string, settings = {}): Promise<EcoIndexMetrics | undefined> {
    const story = new EcoIndexStory();
    await story.start(page, settings);
    await page.goto(url);
    await scrollToBottom(page);
    await wait();
    await story.stop(page);

    return story.getSteps().pop()?.getMetrics();
  }
}
