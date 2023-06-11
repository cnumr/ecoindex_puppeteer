import * as page from './EcoIndexPage';
import * as story from './EcoIndexStory';
import * as handler from './utils/EcoIndexDataHandler';


export const EcoIndexPage = page.EcoIndexPage;
export const getPageMetrics = page.getPageMetrics;

export const EcoIndexStory = story.EcoIndexStory;
export const EcoIndexStoryStep = story.EcoIndexStoryStep;

export const EcoIndexMetrics = handler.EcoIndexMetrics;

export const Events = {
  page: page.ECOINDEX_PAGE_EVENTS,
  story: story.ECOINDEX_STORY_EVENTS,
};
