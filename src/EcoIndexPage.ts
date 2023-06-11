import {
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
  PAGE_LOADED: 'EcoIndex Page - Page has been loaded',
  AFTER_SCROLL: 'EcoIndex Page - After scroll',
};

/**
 * Get the ecoindex raw parameters for a specific page.
 */
export class EcoIndexPage {

  constructor(
    private story = new EcoIndexStory(),
  ) {
  }

  /**
   * Return the metrics for a specific URL.
   *
   * @param page
   * @param {string} url
   * @param {{}} settings
   * @returns {Promise<EcoIndexMetrics | undefined>}
   */
  async getMetrics(page: any, url: string, settings = {}): Promise<EcoIndexMetrics | undefined> {
    this.story.clear();
    const eventData = {story: this.story, page: page};
    await this.story.start(page, settings);
    await page.goto(url);
    await this.story.trigger(ECOINDEX_PAGE_EVENTS.PAGE_LOADED, eventData);
    await scrollToBottom(page);
    await this.trigger(ECOINDEX_PAGE_EVENTS.AFTER_SCROLL, eventData);
    await wait();
    await this.story.stop(page);

    return this.story.getSteps().pop()?.getMetrics();
  }

  /**
   * Trigger events.
   *
   * @param {string} id
   * @param data
   * @returns {Promise<void>}
   */
  async trigger(id: string, data: any = {}): Promise<void> {
    return this.story.trigger(id, data);
  }

  /**
   * Listen events. If no id, all events will be triggered.
   *
   * @param {string | null} id
   * @param callback
   */
  on(id: string | null = null, callback: any) {
    return this.story.on(id, callback);
  }
}

/**
 * Return page metrics.
 *
 * @param page
 * @param {string} url
 * @returns {Promise<EcoIndexMetrics | undefined>}
 */
export async function getPageMetrics(page: any, url: string) {
  const ecoIndexPage = new EcoIndexPage();
  return ecoIndexPage.getMetrics(page, url);
}
