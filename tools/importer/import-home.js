/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroSearchParser from './parsers/hero-search.js';
import carouselTripsParser from './parsers/carousel-trips.js';
import cardsCountryParser from './parsers/cards-country.js';
import columnsInfoParser from './parsers/columns-info.js';
import columnsAwardsParser from './parsers/columns-awards.js';
import cardsArticleParser from './parsers/cards-article.js';
import heroBannerParser from './parsers/hero-banner.js';
import cardsStatsParser from './parsers/cards-stats.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/gct-cleanup.js';
import dmImagesTransformer from './transformers/gct-dm-images.js';
import sectionsTransformer from './transformers/gct-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'home',
  description: 'Grand Circle Travel homepage: full-bleed hero with search, trip carousel, country/article/stat card grids, info and awards columns, and a mid-page promotional hero banner.',
  urls: [
    'https://gct.com',
  ],
  blocks: [
    {
      name: 'hero-search',
      instances: ['.HeroWithSearchBlock_GCT-Evergreen-HP-Hero-w-search'],
    },
    {
      name: 'carousel-trips',
      instances: ['.TripTileCardsBlock_GCT-HP-New-Trip-Card-Section-Block'],
    },
    {
      name: 'cards-country',
      instances: ['.DestinationsGridBlock_GCT-HP-New-Destination-Grid-Block'],
    },
    {
      name: 'columns-info',
      instances: ['.ColorGridBlock_GCT-HP-New-The-Road-Less-Traveled-8-20'],
      section: 'highlight',
    },
    {
      name: 'columns-awards',
      instances: ['.RichTextBlock_GCT-HP-New-awards-RTF-8-20'],
    },
    {
      name: 'cards-article',
      instances: ['[class*="ImageWithContentGridBlock_GCT-HP-Inside-Scoop"]'],
    },
    {
      name: 'hero-banner',
      instances: ['.FullBleedHeroImageBlock_GCT-HP-15days-or-less'],
    },
    {
      name: 'cards-stats',
      instances: ['.RichTextBlock_GCT-HP-New-Why-OAT-RTF-8-20'],
    },
  ],
  sections: [
    {
      id: 'rc2',
      name: 'hero-search',
      selector: 'body > main > div.mx-auto > div.opti-content-area',
      style: null,
      blocks: ['hero-search'],
      defaultContent: [],
    },
    {
      id: 'rc3',
      name: 'home-content',
      selector: 'body > main > div.mx-auto > section.container-component.pb-10',
      style: null,
      blocks: ['carousel-trips', 'cards-country', 'columns-info', 'columns-awards', 'cards-article', 'hero-banner', 'cards-stats'],
      defaultContent: ['.RichTextBlock_GCT---By-Country-RTF'],
    },
  ],
};

// PARSER REGISTRY
const parsers = {
  'hero-search': heroSearchParser,
  'carousel-trips': carouselTripsParser,
  'cards-country': cardsCountryParser,
  'columns-info': columnsInfoParser,
  'columns-awards': columnsAwardsParser,
  'cards-article': cardsArticleParser,
  'hero-banner': heroBannerParser,
  'cards-stats': cardsStatsParser,
};

// TRANSFORMER REGISTRY
// Section transformer runs after cleanup; only include it when the template has 2+ sections.
const transformers = [
  cleanupTransformer,
  dmImagesTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - The hook name ('beforeTransform' or 'afterTransform')
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - The payload containing { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // Already replaced by earlier parser
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform transformers (final cleanup + section breaks/metadata + DM images)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path. Map the root/homepage URL to `/index`.
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
