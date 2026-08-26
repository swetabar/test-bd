/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-awards. Base: columns.
 * Source: https://gct.com (.RichTextBlock_GCT-HP-New-awards-RTF-8-20)
 * Structure (from library-description.txt): multi-column grid.
 *   Row 1: block name
 *   Row 2: columns based on natural content grouping. Source has two groups
 *          inside the awards link: a TEXT group (heading + description) and a
 *          LOGOS group (award logo images) → 2 columns.
 * Notes: award logo <img>s are preserved as-is. The wrapping <a> href is kept
 * by placing the link on the text column.
 */
export default function parse(element, { document }) {
  // The two content groups live inside the wrapping anchor.
  const groups = Array.from(element.querySelectorAll(':scope > a > div > div'));

  const cells = [];

  if (groups.length >= 2) {
    // First group = text, second group = logos.
    const row = groups.slice(0, 2).map((g) => g);
    cells.push(row);
  } else {
    // Fallback: split text vs images manually.
    const textParts = Array.from(element.querySelectorAll('p'));
    const imgs = Array.from(element.querySelectorAll('img'));
    if (textParts.length === 0 && imgs.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    cells.push([textParts.length ? textParts : '', imgs.length ? imgs : '']);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-awards', cells });
  element.replaceWith(block);
}
