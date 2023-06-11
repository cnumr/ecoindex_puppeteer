import puppeteer from 'puppeteer';
import {expect} from 'chai';

import {EcoIndexMetrics} from '../../dist/utils/EcoIndexDataHandler';

/**
 * Return base browser for testing.
 *
 * @returns {Promise<Browser>}
 */
export async function getBrowser() {

  const options = {
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--show-paint-rects',
    ],
    viewport: {
      width: 1920, height: 1080, isMobile: false,
    },
    timeout: 180000,
    ignoreHTTPSErrors: true,
    ignoreDefaultArgs: ['--disable-gpu'],
  };

  // @ts-ignore
  return puppeteer.launch(options);
}

/**
 * Check metrics properties.
 *
 * @param {EcoIndexMetrics | undefined} metrics
 */
export function checkMetrics(metrics: EcoIndexMetrics | undefined | null) {
  console.table([metrics]);
  expect(metrics, 'Metrics should be defined').to.not.be.undefined;
  expect(metrics?.getDomElementsCount(), `Number of dom elements should be greater than 0`).to.be.greaterThan(0);
  expect(metrics?.getRequestsCount(), `Number of requests should be greater than 0`).to.be.greaterThan(0);
  expect(metrics?.getSize(), `Size should be greater than 0`).to.be.greaterThan(0);
}
