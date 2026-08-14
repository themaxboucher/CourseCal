const inlinedRules = new Map<string, Promise<string | null>>();

/**
 * @font-face rules for the fonts the wallpaper actually uses, with their font
 * files base64-inlined. Pass this to html-to-image as `fontEmbedCSS` so it
 * skips its own font pass, which inlines every @font-face in the document —
 * including the 6MB SF Pro the iPhone frame uses outside the exported node.
 *
 * Resolves to undefined if the rules can't be built, in which case
 * html-to-image falls back to embedding everything itself.
 */
export async function getWallpaperFontEmbedCSS(node: HTMLElement) {
  try {
    const families = collectUsedFontFamilies(node);
    const rules = collectFontFaceRules().filter((rule) =>
      families.has(normalizeFamily(rule.family))
    );
    if (rules.length === 0) return undefined;

    const inlined = await Promise.all(rules.map(inlineFontUrls));
    const css = inlined.filter(Boolean).join("\n");
    return css || undefined;
  } catch (error) {
    console.error("Error building wallpaper font CSS:", error);
    return undefined;
  }
}

function collectUsedFontFamilies(node: HTMLElement) {
  const families = new Set<string>();

  const addFrom = (element: Element, pseudo?: string) => {
    for (const family of window
      .getComputedStyle(element, pseudo)
      .fontFamily.split(",")) {
      families.add(normalizeFamily(family));
    }
  };

  for (const element of [node, ...Array.from(node.querySelectorAll("*"))]) {
    addFrom(element);
    addFrom(element, ":before");
    addFrom(element, ":after");
  }

  return families;
}

function normalizeFamily(family: string) {
  return family.trim().replace(/["']/g, "").toLowerCase();
}

interface FontFaceRule {
  family: string;
  cssText: string;
  baseUrl: string;
}

function collectFontFaceRules() {
  const collected: FontFaceRule[] = [];

  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      // Cross-origin stylesheet, not readable.
      continue;
    }

    for (const rule of Array.from(rules)) {
      if (!(rule instanceof CSSFontFaceRule)) continue;

      collected.push({
        family: rule.style.getPropertyValue("font-family"),
        cssText: rule.cssText,
        baseUrl: sheet.href ?? document.baseURI,
      });
    }
  }

  return collected;
}

function inlineFontUrls(rule: FontFaceRule) {
  const cached = inlinedRules.get(rule.cssText);
  if (cached) return cached;

  const inlined = inlineFontUrlsUncached(rule).catch((error) => {
    // A font we can't fetch just falls back to the next family in the stack.
    // That beats failing the whole export.
    console.warn("Skipping font in wallpaper export:", error);
    return null;
  });

  inlinedRules.set(rule.cssText, inlined);
  return inlined;
}

async function inlineFontUrlsUncached({ cssText, baseUrl }: FontFaceRule) {
  const urls = new Set(
    Array.from(cssText.matchAll(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g))
      .map((match) => match[2])
      .filter((url) => !url.startsWith("data:"))
  );

  let inlined = cssText;
  for (const url of urls) {
    const dataUrl = await fetchAsDataUrl(new URL(url, baseUrl).href);
    inlined = inlined.split(url).join(dataUrl);
  }

  return inlined;
}

async function fetchAsDataUrl(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  return blobToDataUrl(await response.blob());
}

export function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

/**
 * iOS has no usable filesystem download for a generated image, so the share
 * sheet (which offers "Save Image") is how a wallpaper gets into Photos.
 * Desktop keeps the plain download, where a file in the Downloads folder is
 * what people expect.
 */
export function canShareImageFile(file: File) {
  if (typeof navigator === "undefined") return false;
  if (!navigator.share || !navigator.canShare) return false;
  if (!isTouchDevice()) return false;

  return navigator.canShare({ files: [file] });
}

export function isTouchDevice() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches
  );
}

export function isShareDismissal(error: unknown) {
  return error instanceof Error && error.name === "AbortError";
}

export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = fileName;
  link.href = url;

  // Firefox only fires the click for a link that's in the document.
  document.body.appendChild(link);
  link.click();
  link.remove();

  // Revoking straight away can cancel the transfer before it starts.
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
