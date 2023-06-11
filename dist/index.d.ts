import { EcoIndexPage, getPageMetrics } from './EcoIndexPage';
import { EcoIndexStory, EcoIndexStoryStep } from './EcoIndexStory';
import { EcoIndexMetrics } from './utils/EcoIndexDataHandler';
declare const _default: {
    EcoIndexPage: typeof EcoIndexPage;
    getPageMetrics: typeof getPageMetrics;
    ECOINDEX_PAGE_EVENTS: {
        PAGE_LOADED: string;
        AFTER_SCROLL: string;
    };
    EcoIndexStory: typeof EcoIndexStory;
    EcoIndexStoryStep: typeof EcoIndexStoryStep;
    ECOINDEX_STORY_EVENTS: {
        AFTER_INIT: string;
        BEFORE_ADD_STEP: string;
        AFTER_ADD_STEP: string;
        ON_STOP: string;
    };
    EcoIndexMetrics: typeof EcoIndexMetrics;
    ECOINDEX_HANDLER_OPTIONS: {
        wait: number;
        timeout: number;
    };
};
export default _default;
