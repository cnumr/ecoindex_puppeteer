import { AbstractEventsClass } from './utils/AbstractEventsClass';
import { EcoIndexDataHandler, EcoIndexMetrics } from './utils/EcoIndexDataHandler';
/**
 * Events.
 *
 * @type {{AFTER_INIT: string, PAGE_LOADED: string, AFTER_SCROLL: string, AFTER_VISIT: string}}
 */
export declare const ECOINDEX_STORY_EVENTS: {
    AFTER_INIT: string;
    BEFORE_ADD_STEP: string;
    AFTER_ADD_STEP: string;
    ON_STOP: string;
};
/**
 * Step structure.
 */
export declare class EcoIndexStoryStep {
    name: string;
    metrics: EcoIndexMetrics | undefined;
    date: Date;
    constructor(name: string, metrics: EcoIndexMetrics | undefined);
    /**
     * Return the step metrics.
     *
     * @returns {EcoIndexMetrics | undefined}
     */
    getMetrics(): EcoIndexMetrics | undefined;
}
/**
 * Get the ecoindex raw data for a user story.
 */
export declare class EcoIndexStory extends AbstractEventsClass {
    /**
     * The steps list.
     * @type {EcoIndexStoryStep[]}
     * @protected
     */
    protected steps: EcoIndexStoryStep[];
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
    getCurrentStep(): EcoIndexStoryStep | null;
    /**
     * Initialize and start a story.
     *
     * @param {Page} page
     * @param {{}} settings
     *
     * @returns {Promise<void>}
     */
    start(page: any, settings?: {}): Promise<void>;
    /**
     * Add a new step in the story.
     *
     * @param {string} name
     *
     * @returns {Promise<void>}
     */
    addStep(name: string): Promise<void>;
    /**
     * Stop story.
     *
     * @param {string} name
     * @param addStep
     * @returns {Promise<void>}
     */
    stop(name: string, addStep?: boolean): Promise<void>;
    /**
     * Return the metrics of the story.
     *
     * @returns {EcoIndexStoryStep[]}
     */
    getSteps(): EcoIndexStoryStep[];
    /**
     * Clear steps.
     */
    clear(): void;
}
