/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: gct.com site-wide cleanup.
 * Removes non-authorable global chrome and tracking/widget elements.
 * All selectors verified against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Analytics/placeholder inputs sit directly inside <main> (verified:
    // <input id="page-analytics">, <input id="analytics-user-status">,
    // <input id="analytics-feature-flags"> in cleaned.html). Remove before
    // block parsing so they can't be captured into block cells.
    WebImporter.DOMUtils.remove(element, [
      '#page-analytics',
      '#analytics-user-status',
      '#analytics-feature-flags',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable site chrome (verified in cleaned.html):
    //  - div.bg-primary-70  -> top announcement/promo bar wrapping the header (line 8)
    //  - header             -> global header/logo/utility nav (line 25)
    //  - nav                -> primary/utility navigation (lines 77, 124)
    //  - footer             -> global footer (footer-style-dark, line 942)
    WebImporter.DOMUtils.remove(element, [
      'div.bg-primary-70',
      'header',
      'nav',
      'footer',
    ]);

    // Non-authorable embedded / tracking / script elements (verified:
    // li_sync_frame + recaptcha iframes, plus standard head/script noise).
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'noscript',
      'script',
      'style',
      'link',
      'svg',
    ]);
  }
}
