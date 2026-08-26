/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-info. Base: columns.
 * Source: https://gct.com (.ColorGridBlock_GCT-HP-New-The-Road-Less-Traveled-8-20)
 * Structure (from library-description.txt): multi-column grid.
 *   Row 1: block name
 *   Row 2: one cell per column — here 3 columns, one per `.opti-content-area-item`.
 * Each cell holds that column's article (icon image, heading link, description).
 * Notes: Scene7 icon <img> preserved as-is (DM transformer converts upstream).
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll('.opti-content-area-item'));

  if (items.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // One row: each column cell holds the column's article content.
  const row = items.map((item) => {
    const article = item.querySelector('article') || item;
    return article;
  });

  const cells = [row];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-info', cells });
  element.replaceWith(block);
}
