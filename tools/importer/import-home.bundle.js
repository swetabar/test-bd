/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-home.js
  var import_home_exports = {};
  __export(import_home_exports, {
    default: () => import_home_default
  });

  // tools/importer/parsers/hero-search.js
  function parse(element, { document: document2 }) {
    const bgImage = element.querySelector(':scope > picture, picture, img[src*="scene7"], img');
    const heading = element.querySelector('h1, h2, [class*="title"]');
    const widgetLabels = Array.from(element.querySelectorAll("button span")).map((s) => (s.textContent || "").trim()).filter(Boolean);
    if (!bgImage && !heading && widgetLabels.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (bgImage) cells.push([bgImage]);
    const contentCell = [];
    if (heading) contentCell.push(heading);
    widgetLabels.forEach((label) => {
      const p = document2.createElement("p");
      p.textContent = label;
      contentCell.push(p);
    });
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-search", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-trips.js
  function parse2(element, { document: document2 }) {
    const cards = Array.from(element.querySelectorAll(".group"));
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector('img[src*="scene7"], img:not([src^="data:"])');
      const content = [];
      const category = card.querySelector('p.ds-overline-m, p[class*="overline"]');
      const heading = card.querySelector('h3, h2, [class*="heading"]');
      const reviewCount = card.querySelector('span.ds-body-m, span[class*="text-muted"]');
      const duration = Array.from(card.querySelectorAll('p.ds-body-m, p[class*="body-m"]')).find((p) => /\d+\s*days/i.test((p.textContent || "").trim()));
      if (category && (category.textContent || "").trim()) content.push(category);
      if (heading) content.push(heading);
      if (reviewCount && (reviewCount.textContent || "").trim()) content.push(reviewCount);
      if (duration) content.push(duration);
      if (!img && content.length === 0) return;
      cells.push([img || "", content.length ? content : ""]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "carousel-trips", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-country.js
  function parse3(element, { document: document2 }) {
    const cardItems = Array.from(element.querySelectorAll(".opti-content-area-item"));
    const cells = [];
    cardItems.forEach((item) => {
      const img = item.querySelector("picture, img");
      const content = [];
      const heading = item.querySelector('h3, h2, [class*="heading"]');
      const desc = item.querySelector('p.ds-body-m, p[class*="body-m"], p[class*="text-muted"]');
      if (heading) content.push(heading);
      if (desc && (desc.textContent || "").trim()) content.push(desc);
      if (!img && content.length === 0) return;
      cells.push([img || "", content.length ? content : ""]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-country", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-info.js
  function parse4(element, { document: document2 }) {
    const items = Array.from(element.querySelectorAll(".opti-content-area-item"));
    if (items.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const row = items.map((item) => {
      const article = item.querySelector("article") || item;
      return article;
    });
    const cells = [row];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-info", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-awards.js
  function parse5(element, { document: document2 }) {
    const groups = Array.from(element.querySelectorAll(":scope > a > div > div"));
    const cells = [];
    if (groups.length >= 2) {
      const row = groups.slice(0, 2).map((g) => g);
      cells.push(row);
    } else {
      const textParts = Array.from(element.querySelectorAll("p"));
      const imgs = Array.from(element.querySelectorAll("img"));
      if (textParts.length === 0 && imgs.length === 0) {
        element.replaceWith(...element.childNodes);
        return;
      }
      cells.push([textParts.length ? textParts : "", imgs.length ? imgs : ""]);
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-awards", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse6(element, { document: document2 }) {
    const cardItems = Array.from(element.querySelectorAll(".opti-content-area-item"));
    const cells = [];
    cardItems.forEach((item) => {
      const img = item.querySelector('img[src*="scene7"], img:not([src^="data:"])');
      const contentParts = [];
      const overlayLink = item.querySelector(":scope a[title], :scope > div > a");
      if (overlayLink) contentParts.push(overlayLink);
      const heading = item.querySelector('h5, h4, h3, h2, [class*="heading"]');
      const contentBlock = heading ? heading.parentElement : null;
      if (contentBlock) contentParts.push(contentBlock);
      if (!img && contentParts.length === 0) return;
      cells.push([img || "", contentParts.length ? contentParts : ""]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-banner.js
  function parse7(element, { document: document2 }) {
    const bgImage = element.querySelector('picture, img[src*="scene7"], img');
    const link = element.querySelector(":scope > a[href], a[href]");
    if (!bgImage && !link) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (bgImage) cells.push([bgImage]);
    const contentCell = [];
    if (link) {
      const cta = document2.createElement("a");
      cta.href = link.getAttribute("href");
      const label = (link.getAttribute("title") || link.textContent || "").trim();
      cta.textContent = label || link.getAttribute("href");
      contentCell.push(cta);
    }
    if (contentCell.length) cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-stats.js
  function parse8(element, { document: document2 }) {
    const cells = [];
    const heading = element.querySelector("h2, h1, h3");
    if (heading) cells.push(["", heading]);
    const statImgs = Array.from(element.querySelectorAll("img"));
    statImgs.forEach((img) => {
      const card = img.parentElement;
      if (!card) return;
      const text = Array.from(card.children).find((c) => c !== img && c.tagName === "DIV");
      cells.push([img, text || ""]);
    });
    const cta = element.querySelector(":scope > a[href], a[title]");
    if (cta) cells.push(["", cta]);
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-stats", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/gct-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#page-analytics",
        "#analytics-user-status",
        "#analytics-feature-flags"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "div.bg-primary-70",
        "header",
        "nav",
        "footer"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "iframe",
        "noscript",
        "script",
        "style",
        "link",
        "svg"
      ]);
    }
  }

  // tools/importer/transformers/gct-dm-images.js
  function detectDynamicMediaUrl(urlStr) {
    let u;
    try {
      u = new URL(urlStr, "https://x/");
    } catch (e) {
      return false;
    }
    if (u.pathname.startsWith("/is/image/")) {
      return "scene7";
    }
    if (/^delivery-p\d+-e\d+\.adobeaemcloud\.com$/.test(u.hostname) && u.pathname.startsWith("/adobe/assets/urn:")) {
      return "dm-openapi";
    }
    return false;
  }
  var LINKED_DM_INLINE_WRAPPER_TAGS = /* @__PURE__ */ new Set(["PICTURE"]);
  var LINKED_DM_WRAPPER_SIBLING_TAGS = /* @__PURE__ */ new Set(["SOURCE"]);
  function findLinkedDmCarrier(img) {
    if (!img || !img.parentElement) return null;
    let node = img;
    let parent = img.parentElement;
    while (parent && LINKED_DM_INLINE_WRAPPER_TAGS.has(parent.tagName)) {
      let foundNode = false;
      for (const child of parent.children) {
        if (child === node) {
          foundNode = true;
        } else if (!LINKED_DM_WRAPPER_SIBLING_TAGS.has(child.tagName)) {
          return null;
        }
      }
      if (!foundNode) return null;
      node = parent;
      parent = parent.parentElement;
    }
    if (!parent || parent.tagName !== "A") return null;
    if (parent.children.length !== 1 || parent.children[0] !== node) return null;
    if (parent.textContent.trim() !== "") return null;
    return parent;
  }
  var EMPTY_ALT_SENTINEL = "Image without alt text";
  function altToLinkText(alt) {
    return alt || EMPTY_ALT_SENTINEL;
  }
  function transform2(hookName, element, payload) {
    if (hookName !== "afterTransform") return;
    const doc = element.ownerDocument;
    element.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src") || "";
      if (!detectDynamicMediaUrl(src)) return;
      const alt = img.getAttribute("alt") || "";
      const linkedAnchor = findLinkedDmCarrier(img);
      if (linkedAnchor) {
        linkedAnchor.setAttribute("title", src);
        linkedAnchor.textContent = altToLinkText(alt);
        return;
      }
      const parent = img.parentElement;
      if (parent && parent.tagName === "A") {
        console.warn("DM image inside mixed-content anchor, skipped:", src);
        return;
      }
      const a = doc.createElement("a");
      a.href = src;
      a.textContent = altToLinkText(alt);
      img.replaceWith(a);
    });
  }

  // tools/importer/transformers/gct-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function transform3(hookName, element, payload) {
    const sections = payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || element.querySelector(section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-home.js
  var PAGE_TEMPLATE = {
    name: "home",
    description: "Grand Circle Travel homepage: full-bleed hero with search, trip carousel, country/article/stat card grids, info and awards columns, and a mid-page promotional hero banner.",
    urls: [
      "https://gct.com"
    ],
    blocks: [
      {
        name: "hero-search",
        instances: [".HeroWithSearchBlock_GCT-Evergreen-HP-Hero-w-search"]
      },
      {
        name: "carousel-trips",
        instances: [".TripTileCardsBlock_GCT-HP-New-Trip-Card-Section-Block"]
      },
      {
        name: "cards-country",
        instances: [".DestinationsGridBlock_GCT-HP-New-Destination-Grid-Block"]
      },
      {
        name: "columns-info",
        instances: [".ColorGridBlock_GCT-HP-New-The-Road-Less-Traveled-8-20"],
        section: "highlight"
      },
      {
        name: "columns-awards",
        instances: [".RichTextBlock_GCT-HP-New-awards-RTF-8-20"]
      },
      {
        name: "cards-article",
        instances: ['[class*="ImageWithContentGridBlock_GCT-HP-Inside-Scoop"]']
      },
      {
        name: "hero-banner",
        instances: [".FullBleedHeroImageBlock_GCT-HP-15days-or-less"]
      },
      {
        name: "cards-stats",
        instances: [".RichTextBlock_GCT-HP-New-Why-OAT-RTF-8-20"]
      }
    ],
    sections: [
      {
        id: "rc2",
        name: "hero-search",
        selector: "body > main > div.mx-auto > div.opti-content-area",
        style: null,
        blocks: ["hero-search"],
        defaultContent: []
      },
      {
        id: "rc3",
        name: "home-content",
        selector: "body > main > div.mx-auto > section.container-component.pb-10",
        style: null,
        blocks: ["carousel-trips", "cards-country", "columns-info", "columns-awards", "cards-article", "hero-banner", "cards-stats"],
        defaultContent: [".RichTextBlock_GCT---By-Country-RTF"]
      }
    ]
  };
  var parsers = {
    "hero-search": parse,
    "carousel-trips": parse2,
    "cards-country": parse3,
    "columns-info": parse4,
    "columns-awards": parse5,
    "cards-article": parse6,
    "hero-banner": parse7,
    "cards-stats": parse8
  };
  var transformers = [
    transform,
    transform2,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform3] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_home_default = {
    transform: (payload) => {
      const {
        document: document2,
        url,
        html,
        params
      } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_home_exports);
})();
