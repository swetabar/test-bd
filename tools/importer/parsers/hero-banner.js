/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-banner. Base: hero.
 * Source: https://gct.com (.FullBleedHeroImageBlock_GCT-HP-15days-or-less)
 * Structure (from library-description.txt): 1 column, 3 rows.
 *   Row 1: block name
 *   Row 2: background image (optional)
 *   Row 3: title / subheading / CTA content
 * Notes: This full-bleed banner is a single Scene7 <img> wrapped in a link with
 * no visible on-image text. The image is preserved as-is (DM transformer converts
 * upstream). The wrapping anchor's title ("See What's Waiting") + href is emitted
 * as the CTA so the destination is not lost.
 */
export default function parse(element, { document }) {
  const bgImage = element.querySelector('picture, img[src*="scene7"], img');
  const link = element.querySelector(':scope > a[href], a[href]');

  if (!bgImage && !link) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: background image (optional).
  if (bgImage) cells.push([bgImage]);

  // Row 3: content cell — CTA link built from the banner's wrapping anchor.
  const contentCell = [];
  if (link) {
    const cta = document.createElement('a');
    cta.href = link.getAttribute('href');
    const label = (link.getAttribute('title') || link.textContent || '').trim();
    cta.textContent = label || link.getAttribute('href');
    contentCell.push(cta);
  }
  if (contentCell.length) cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
