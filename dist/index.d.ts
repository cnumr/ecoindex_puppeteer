import * as page from './EcoIndexPage';
import * as story from './EcoIndexStory';
import * as handler from './utils/EcoIndexDataHandler';
export declare const EcoIndexPage: typeof page.EcoIndexPage;
export declare const getPageMetrics: typeof page.getPageMetrics;
export declare const EcoIndexStory: typeof story.EcoIndexStory;
export declare const EcoIndexStoryStep: typeof story.EcoIndexStoryStep;
export declare const EcoIndexMetrics: typeof handler.EcoIndexMetrics;
export declare const Events: {
    page: {
        PAGE_LOADED: string;
        AFTER_SCROLL: string;
    };
    story: {
        AFTER_INIT: string;
        BEFORE_ADD_STEP: string;
        AFTER_ADD_STEP: string;
        ON_STOP: string;
    };
};
