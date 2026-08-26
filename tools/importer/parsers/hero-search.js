/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-search. Base: hero.
 * Source: https://gct.com (.HeroWithSearchBlock_GCT-Evergreen-HP-Hero-w-search)
 * Structure (from library-description.txt): 1 column, 3 rows
 *   Row 1: block name
 *   Row 2: background image (optional)
 *   Row 3: title / subheading / CTA content
 * Notes: Scene7 <picture>/<img> is preserved as-is (DM transformer converts to
 * carrier anchors upstream). The interactive search widget (buttons with data-URI
 * SVG icons) is UI, not importable content, so it is intentionally excluded.
 */
export default function parse(element, { document }) {
  // Background asset: prefer the picture, fall back to a bare img.
  const bgImage = element.querySelector(':scope > picture, picture, img[src*="scene7"], img');

  // Content: headline.
  const heading = element.querySelector('h1, h2, [class*="title"]');

  // Search widget labels are rendered as button text — capture as CTA-style text
  // so the hero content is complete.
  const widgetLabels = Array.from(element.querySelectorAll('button span'))
    .map((s) => (s.textContent || '').trim())
    .filter(Boolean);

  // Empty-block guard.
  if (!bgImage && !heading && widgetLabels.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: background image (optional).
  if (bgImage) cells.push([bgImage]);

  // Row 3: content cell (single column) holding headline + search widget labels.
  const contentCell = [];
  if (heading) contentCell.push(heading);
  widgetLabels.forEach((label) => {
    const p = document.createElement('p');
    p.textContent = label;
    contentCell.push(p);
  });
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-search', cells });
  element.replaceWith(block);
}
