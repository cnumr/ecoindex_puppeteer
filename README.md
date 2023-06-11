# Ecoindex puppeteer

Provides puppeteer tools that retrieve ecoindex parameters from a puppeteer page, according to ecoindex definition.

This module provides tools that you can use to get EcoIndex parameters with puppeteer.  
This module does not get the EcoIndex value. You have to combine it with https://www.npmjs.com/package/ecoindex in order
to current final EcoIndex score.

## Install

Install this module as you normally do :  
`npm install ecoindex_puppeteer`

## How to use ?

### Get page metrics.

#### Introduction

According to the EcoIndex definition (https://www.ecoindex.fr/comment-ca-marche/), the metrics used for EcoIndex
computing are kept after this scenario :

- clear browser cache
- visit a URL
- scroll to the bottom of the page
- wait for 3 seconds.

The module will provide tools that will automate this scenario and the recovery of the 3 needed metrics:

- the number of DOM elements
- the number of requests
- the total requests size (in Bytes)

The module does not initiate a Puppeteer browser session. It is regardless of the puppeteer configuration.

#### Get metrics

You can get a URL metrics using the method `getPageMetrics(page, url)`.

```nodeJs
import {getPageMetrics} from '../src/EcoIndexPage';

const metrics = await getPageMetrics(page, 'https://www.ecoindex.fr');
```

You can also define an object to get scenario events :

```nodeJs
import {EcoIndexPage} from '../src/EcoIndexPage';

const ecoIndexPage = new EcoIndexPage();

ecoIndexPage.on(null, (eventName, eventData) => {
    console.log(`eventName`);
});

const metrics = await ecoIndexPage.getMetrics(page, 'https://www.ecoindex.fr');
```

## Turn page metrics into EcoIndex score

You can use the `ecoindex` module in order to get ecoindex values from metrics object :

```nodeJs
import {getPageMetrics} from '../src/EcoIndexPage';

const metrics = await getPageMetrics(page, 'https://www.ecoindex.fr');

const ecoIndexValue = ecoindex.computeEcoIndex(
    metrics.getDOMElementsCount(), 
    metrics.getRequestsCount(), 
    metrics.getSize()
);
```

