/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-stats. Base: cards.
 * Source: https://gct.com (.RichTextBlock_GCT-HP-New-Why-OAT-RTF-8-20)
 * Structure (from library-description.txt): 2 columns, multiple rows.
 *   Row 1: block name
 *   Each subsequent row = one stat card: [ icon image , text (stat + label) ]
 * Notes: Each stat is a <div> holding a Scene7 icon <img> (preserved as-is) plus
 * a text <div> ("700,000+ Travelers Since 2016", etc.). The section heading
 * ("Why Grand Circle?") and the trailing OAT cross-sell CTA are emitted as
 * extra rows so no source content is dropped; the CTA row pads its image cell.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Section heading, kept as its own text row (empty image cell to keep 2 columns).
  const heading = element.querySelector('h2, h1, h3');
  if (heading) cells.push(['', heading]);

  // Each stat card = a div that directly contains an icon <img>.
  const statImgs = Array.from(element.querySelectorAll('img'));
  statImgs.forEach((img) => {
    const card = img.parentElement;
    if (!card) return;
    // Text lives in a sibling div within the same card.
    const text = Array.from(card.children).find((c) => c !== img && c.tagName === 'DIV');
    cells.push([img, text || '']);
  });

  // Trailing cross-sell CTA (anchor with title/desc), if present.
  const cta = element.querySelector(':scope > a[href], a[title]');
  if (cta) cells.push(['', cta]);

  // Empty-block guard.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-stats', cells });
  element.replaceWith(block);
}
