/**
 * Test ecoIndex value.
 *
 * The ecoindex is based on quantiles of 3 parameters.
 * If the 3 parameters are based on the same quantile level,
 * the ecoIndex is expected to be equal to 100 - (quantileLevel * 100 / quantileNumber)
 * The same quantile index for each parameters should
 */
import {EcoIndexPage, getPageMetrics} from '../src/EcoIndexPage';
import {EcoIndexMetrics} from '../src/utils/EcoIndexDataHandler';

import {checkMetrics, getBrowser} from './utils/commons';

describe('Get page metrics', async () => {

  it(`Should give page metrics for a specific URL with events.`, async () => {
    const browser = await getBrowser();
    const page = await browser.newPage();
    let metrics: EcoIndexMetrics | undefined | null;
    try {

      const ecoindexPage = new EcoIndexPage();

      // Listen all events.
      ecoindexPage.on(null, async (event: string, data: any) => {
        console.log(`Event : `, event);
      })

      // Get metrics.
      metrics = await ecoindexPage.getMetrics(page, 'https://www.thomas-secher.fr');
    } catch (err) {
      metrics = null;
    }

    // Close page.
    await page.close()

    // Check values.
    checkMetrics(metrics);
  });

  it('should give page metrics for a specific URL without events', async () => {
    const browser = await getBrowser();
    const page = await browser.newPage();
    let metrics: EcoIndexMetrics | undefined | null;
    try {

      // Get metrics.
      metrics = await getPageMetrics(page, 'https://www.thomas-secher.fr');
    } catch (err) {
      metrics = null;
    }

    // Close.
    await page.close();
    await browser.close();

    // Check values.
    checkMetrics(metrics);
  });
});
