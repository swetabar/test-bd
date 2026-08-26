/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article. Base: cards.
 * Source: https://gct.com ([class*="ImageWithContentGridBlock_GCT-HP-Inside-Scoop"])
 * Structure (from library-description.txt): 2 columns, multiple rows.
 *   Row 1: block name
 *   Each subsequent row = one card: [ image , text content (title + desc + CTA) ]
 * Notes: Each article card is `.opti-content-area-item`. Image is a Scene7 <img>
 * (preserved as-is). The card's full-bleed overlay <a> carries only sr-only
 * "Read More" text and is skipped; the visible content div (h5 + description +
 * "Read More" button) is used for the text cell.
 */
export default function parse(element, { document }) {
  const cardItems = Array.from(element.querySelectorAll('.opti-content-area-item'));

  const cells = [];

  cardItems.forEach((item) => {
    // First cell: card image.
    const img = item.querySelector('img[src*="scene7"], img:not([src^="data:"])');

    // Second cell: text content. Collect the full-bleed "Read More" overlay link
    // (source content) plus the padded content wrapper (heading + description +
    // visible CTA). The heading's direct parent is the padded content wrapper.
    const contentParts = [];
    const overlayLink = item.querySelector(':scope a[title], :scope > div > a');
    if (overlayLink) contentParts.push(overlayLink);
    const heading = item.querySelector('h5, h4, h3, h2, [class*="heading"]');
    const contentBlock = heading ? heading.parentElement : null;
    if (contentBlock) contentParts.push(contentBlock);

    if (!img && contentParts.length === 0) return;

    cells.push([img || '', contentParts.length ? contentParts : '']);
  });

  // Empty-block guard.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
