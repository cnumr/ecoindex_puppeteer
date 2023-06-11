/**
 * Test ecoIndex value.
 *
 * The ecoindex is based on quantiles of 3 parameters.
 * If the 3 parameters are based on the same quantile level,
 * the ecoIndex is expected to be equal to 100 - (quantileLevel * 100 / quantileNumber)
 * The same quantile index for each parameters should
 */
import {EcoIndexPage} from '../src/EcoIndexPage';
import {EcoIndexMetrics} from '../src/utils/EcoIndexDataHandler';

import {checkMetrics, getBrowser} from './utils/commons';

const {expect} = require('chai');

describe('Get page metrics', async () => {
  it(`Should give page metrics for a specific URL.`, async () => {
    const browser = await getBrowser();
    let metrics: EcoIndexMetrics | undefined | null;
    try {
      const page = await browser.newPage();
      const ecoindexPage = new EcoIndexPage();
      metrics = await ecoindexPage.getMetrics(page, 'https://www.thomas-secher.fr');
    } catch (err) {
      metrics = null;
    }
    await browser.close();

    // Check values.
    checkMetrics(metrics);
  });
});
