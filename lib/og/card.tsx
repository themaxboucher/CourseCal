import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { ImageResponse } from "next/og";
import { OG_IMAGE_SIZE } from "@/lib/site";

/**
 * The 1200x630 card behind every link preview.
 *
 * Everything it draws is vendored next to this file — the Outfit weights and
 * the mascot — so generating a card makes no network request. A crawler gets
 * one shot at an unfurl, and an image route that depends on fonts.gstatic.com
 * being reachable is an image route that silently degrades to no preview.
 */

const BRAND_RED = "#FB2C36";
const INK = "#18181B";
const MUTED = "#71717A";

// Static `new URL(..., import.meta.url)` calls are what let the bundler trace
// these files into the deployed function. A computed path would not be traced.
const REGULAR = new URL("./fonts/Outfit-Regular.ttf", import.meta.url);
const SEMIBOLD = new URL("./fonts/Outfit-SemiBold.ttf", import.meta.url);
const BOLD = new URL("./fonts/Outfit-Bold.ttf", import.meta.url);
const MASCOT = new URL("./mascot.png", import.meta.url);

// `readFile` rather than `fetch`, which cannot read a `file:` URL — the
// bundler leaves these as real paths on disk. `next.config.ts` pins the whole
// directory into the traced output so the files exist in the deployed function.
async function read(url: URL): Promise<Buffer> {
  return readFile(fileURLToPath(url));
}

/** Read once per warm instance rather than once per crawl. */
let assets: Promise<{
  fonts: { name: string; data: Buffer; weight: 400 | 600 | 700 }[];
  mascot: string;
}> | null = null;

function loadAssets() {
  assets ??= (async () => {
    const [regular, semibold, bold, mascot] = await Promise.all([
      read(REGULAR),
      read(SEMIBOLD),
      read(BOLD),
      read(MASCOT),
    ]);
    return {
      fonts: [
        { name: "Outfit", data: regular, weight: 400 as const },
        { name: "Outfit", data: semibold, weight: 600 as const },
        { name: "Outfit", data: bold, weight: 700 as const },
      ],
      mascot: `data:image/png;base64,${mascot.toString("base64")}`,
    };
  })();
  return assets;
}

interface CardProps {
  /** Small pill above the headline — the reason this link was sent. */
  eyebrow: string;
  headline: string;
  body: string;
}

const COLUMN_WIDTH = 640;

/**
 * Usernames run to 30 characters, and satori will not break a word to make it
 * fit — an unlucky one would simply run off the edge of the card. So the
 * headline is sized to whatever its longest single word can afford, then
 * stepped down again if the whole line is long. 0.66em is the measured average
 * advance of Outfit Bold plus a little slack, which is close enough for a bound.
 */
function headlineSize(headline: string) {
  const longestWord = Math.max(
    ...headline.split(" ").map((word) => word.length),
  );
  return Math.max(
    30,
    Math.min(
      68,
      Math.floor(COLUMN_WIDTH / (longestWord * 0.66)),
      headline.length > 44 ? 54 : headline.length > 32 ? 60 : 68,
    ),
  );
}

/**
 * Satori measures a word box wider than the browser does — it keeps the full
 * advance of the trailing glyph, so anything ending in `r`, `e` or `s` picks up
 * a chunk of dead space and the following word is visibly pushed off. Laying
 * the words out as flex children makes the gap something this file sets rather
 * than something satori derives; 0.2em is a little under a natural space, which
 * absorbs most of that trailing bearing.
 */
function Words({
  text,
  fontSize,
  style,
}: {
  text: string;
  fontSize: number;
  style: React.CSSProperties;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        columnGap: fontSize * 0.2,
        rowGap: fontSize * 0.12,
        fontSize,
        lineHeight: 1,
        ...style,
      }}
    >
      {text.split(" ").map((word, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: rendered once to a PNG — there is no reconciliation or state to preserve, and repeated words make the text alone a non-unique key.
        <div key={`${word}-${index}`} style={{ display: "flex" }}>
          {word}
        </div>
      ))}
    </div>
  );
}

export async function renderOgCard({ eyebrow, headline, body }: CardProps) {
  const { fonts, mascot } = await loadAssets();
  const size = headlineSize(headline);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#FFFFFF",
        fontFamily: "Outfit",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          padding: "0 72px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: COLUMN_WIDTH,
          }}
        >
          <Words
            text={eyebrow}
            fontSize={26}
            style={{
              alignSelf: "flex-start",
              backgroundColor: "#FEE9EA",
              color: BRAND_RED,
              fontWeight: 600,
              padding: "12px 22px",
              borderRadius: 999,
              marginBottom: 28,
            }}
          />
          <Words
            text={headline}
            fontSize={size}
            style={{ color: INK, fontWeight: 700 }}
          />
          <div
            style={{
              display: "flex",
              color: MUTED,
              fontSize: 30,
              fontWeight: 400,
              lineHeight: 1.35,
              marginTop: 24,
            }}
          >
            {body}
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          {/* biome-ignore lint/performance/noImgElement: satori renders plain <img>, not next/image. */}
          <img src={mascot} width={372} height={422} alt="" />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 72px 40px",
          color: MUTED,
          fontSize: 26,
          fontWeight: 600,
        }}
      >
        <div style={{ display: "flex", color: INK }}>CourseCal</div>
        <div style={{ display: "flex" }}>coursecal.com</div>
      </div>

      <div
        style={{ display: "flex", height: 16, backgroundColor: BRAND_RED }}
      />
    </div>,
    {
      ...OG_IMAGE_SIZE,
      fonts,
      headers: {
        // A card is a pure function of its URL, so it never needs revalidating.
        // Without this every unfurl of the same invite link re-renders the PNG.
        "cache-control": "public, immutable, no-transform, max-age=31536000",
      },
    },
  );
}
