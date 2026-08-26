/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-trips. Base: carousel.
 * Source: https://gct.com (.TripTileCardsBlock_GCT-HP-New-Trip-Card-Section-Block)
 * Structure (from library-description.txt): 2 columns, multiple rows.
 *   Row 1: block name
 *   Each subsequent row = one slide: [ image , text content (title/desc/CTA) ]
 * Notes: Each trip tile (`.group`) is a slide. The trip photo is a Scene7 <img>
 * (preserved as-is; DM transformer converts upstream). Decorative star-rating
 * icons are data-URI SVGs and are skipped; their review-count text and the trip
 * category/duration are kept as description content.
 */
export default function parse(element, { document }) {
  const cards = Array.from(element.querySelectorAll('.group'));

  const cells = [];

  cards.forEach((card) => {
    // First cell: the trip image (Scene7 / real asset, not a data-URI icon).
    const img = card.querySelector('img[src*="scene7"], img:not([src^="data:"])');

    // Second cell: text content.
    const content = [];
    const category = card.querySelector('p.ds-overline-m, p[class*="overline"]');
    const heading = card.querySelector('h3, h2, [class*="heading"]');
    // Review count e.g. "(224)" and duration e.g. "12 Days".
    const reviewCount = card.querySelector('span.ds-body-m, span[class*="text-muted"]');
    const duration = Array.from(card.querySelectorAll('p.ds-body-m, p[class*="body-m"]'))
      .find((p) => /\d+\s*days/i.test((p.textContent || '').trim()));

    if (category && (category.textContent || '').trim()) content.push(category);
    if (heading) content.push(heading);
    if (reviewCount && (reviewCount.textContent || '').trim()) content.push(reviewCount);
    if (duration) content.push(duration);

    // Only emit a slide when it has an image or some content.
    if (!img && content.length === 0) return;

    cells.push([img || '', content.length ? content : '']);
  });

  // Empty-block guard.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-trips', cells });
  element.replaceWith(block);
}
