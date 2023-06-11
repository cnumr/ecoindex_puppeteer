/**
 * Test ecoIndex value.
 *
 * The ecoindex is based on quantiles of 3 parameters.
 * If the 3 parameters are based on the same quantile level,
 * the ecoIndex is expected to be equal to 100 - (quantileLevel * 100 / quantileNumber)
 * The same quantile index for each parameters should
 */
import {scrollToBottom} from '../src/utils/EcoIndexDataHandler';
import {EcoIndexStory, EcoIndexStoryStep} from '../src/EcoIndexStory';

// @ts-ignore
import {checkMetrics, getBrowser} from './utils/commons';

const {expect} = require('chai');

describe('Get story metrics', async () => {
  it(`Should give story metrics.`, async () => {
    const browser = await getBrowser();
    let steps: EcoIndexStoryStep[] = [];
    try {
      const ecoindexStory = new EcoIndexStory();
      const page = await browser.newPage();
      await ecoindexStory.start(page);
      await page.goto('https://www.thomas-secher.fr');
      await scrollToBottom(page);
      await ecoindexStory.addStep('first page');

      await page.click('a.logo');
      await scrollToBottom(page);
      await ecoindexStory.stop('last page');
      steps = await ecoindexStory.getSteps();
    } catch (err) {
      steps = [];
    }
    await browser.close();

    expect(steps).to.be.an('array');

    for (const step of steps) {
      checkMetrics(step.getMetrics());
    }

  });
});
