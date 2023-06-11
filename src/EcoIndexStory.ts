import {Page} from 'puppeteer-core';

import {AbstractEventsClass} from './utils/AbstractEventsClass';
import {ECOINDEX_HANDLER_OPTIONS, EcoIndexDataHandler, EcoIndexMetrics} from './utils/EcoIndexDataHandler';

/**
 * Events.
 *
 * @type {{AFTER_INIT: string, PAGE_LOADED: string, AFTER_SCROLL: string, AFTER_VISIT: string}}
 */
export const ECOINDEX_STORY_EVENTS = {
  AFTER_INIT: 'Ecoindex Story - After initialization',
  BEFORE_ADD_STEP: 'Ecoindex Story - Before add step',
  AFTER_ADD_STEP: 'Ecoindex Story - After add step',
  ON_STOP: 'Ecoindex Story - Stop',
};

/**
 * Step structure.
 */
export class EcoIndexStoryStep {

  public date: Date;

  constructor(
    public name: string,
    public metrics: EcoIndexMetrics | undefined,
  ) {
    this.date = new Date();
  }

  /**
   * Return the step metrics.
   *
   * @returns {EcoIndexMetrics | undefined}
   */
  getMetrics(): EcoIndexMetrics | undefined {
    return this.metrics;
  }

}

/**
 * Get the ecoindex raw data for a user story.
 */
export class EcoIndexStory extends AbstractEventsClass {

  /**
   * The steps list.
   * @type {EcoIndexStoryStep[]}
   * @protected
   */
  protected steps: EcoIndexStoryStep[] = [];

  /**
   * EcoIndex Handler.
   * @type {EcoIndexDataHandler | undefined}
   * @protected
   */
  protected handler: EcoIndexDataHandler | undefined;
  protected eventData: any;

  /**
   * Return current step.
   *
   * @returns {EcoIndexStoryStep | null}
   */
  getCurrentStep(): EcoIndexStoryStep | null {
    return this.steps.length > 0 ? this.steps[this.steps.length - 1] : null;
  }

  /**
   * Initialize and start a story.
   *
   * @param {Page} page
   * @param {{}} settings
   *
   * @returns {Promise<void>}
   */
  async start(page: any, settings = {}): Promise<void> {
    const options = {...ECOINDEX_HANDLER_OPTIONS, ...settings};
    this.handler = new EcoIndexDataHandler(page, options);
    this.eventData = {page: page, options: options, handler: this.handler};

    await this.handler.init();
    await this.trigger(ECOINDEX_STORY_EVENTS.AFTER_INIT, this.eventData);

    this.steps = [];
  }

  /**
   * Add a new step in the story.
   *
   * @param {string} name
   *
   * @returns {Promise<void>}
   */
  async addStep(name: string): Promise<void> {
    await this.trigger(ECOINDEX_STORY_EVENTS.BEFORE_ADD_STEP, this.eventData);
    const metrics = await this.handler?.getRawMetrics();
    const step = new EcoIndexStoryStep(name, metrics);
    this.steps.push(step);
    this.handler?.clearResults();
    await this.trigger(ECOINDEX_STORY_EVENTS.AFTER_ADD_STEP, {...this.eventData, ...{step: step}});
  }

  /**
   * Stop story.
   *
   * @param {string} name
   * @returns {Promise<void>}
   */
  async stop(name: string): Promise<void> {
    await this.addStep(name);
    await this.trigger(ECOINDEX_STORY_EVENTS.ON_STOP, this.eventData);
    return this.handler?.stop();
  }

  /**
   * Return the metrics of the story.
   *
   * @returns {EcoIndexStoryStep[]}
   */
  getSteps(): EcoIndexStoryStep[] {
    return this.steps;
  }

  /**
   * Clear steps.
   */
  clear() {
    this.steps = [];
  }
}
