/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-country. Base: cards.
 * Source: https://gct.com (.DestinationsGridBlock_GCT-HP-New-Destination-Grid-Block)
 * Structure (from library-description.txt): 2 columns, multiple rows.
 *   Row 1: block name
 *   Each subsequent row = one card: [ image , text content (title + description) ]
 * Notes: Each destination card is `.opti-content-area-item`. The image is a
 * Scene7-backed <picture>/<img> (preserved as-is; DM transformer converts upstream).
 * Text is the country heading (linked) plus a "N Trips" count.
 */
export default function parse(element, { document }) {
  const cardItems = Array.from(element.querySelectorAll('.opti-content-area-item'));

  const cells = [];

  cardItems.forEach((item) => {
    // First cell: card image.
    const img = item.querySelector('picture, img');

    // Second cell: text content (heading + trips count).
    const content = [];
    const heading = item.querySelector('h3, h2, [class*="heading"]');
    const desc = item.querySelector('p.ds-body-m, p[class*="body-m"], p[class*="text-muted"]');
    if (heading) content.push(heading);
    if (desc && (desc.textContent || '').trim()) content.push(desc);

    if (!img && content.length === 0) return;

    cells.push([img || '', content.length ? content : '']);
  });

  // Empty-block guard.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-country', cells });
  element.replaceWith(block);
}
