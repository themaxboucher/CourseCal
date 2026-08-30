import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { ImageResponse } from "next/og";
import { OG_IMAGE_SIZE } from "@/lib/site";
import {
  OUTFIT_BOLD_ADVANCE,
  WIDEST_ADVANCE,
} from "./outfit-bold-advance";

/**
 * The 1200x630 card behind every link preview.
 *
 * Everything it draws is vendored next to this file — the Outfit weights and
 * the mascot — so generating a card makes no network request. A crawler gets
 * one shot at an unfurl, and an image route that depends on fonts.gstatic.com
 * being reachable is an image route that silently degrades to no preview.
 */

// `--primary` resolved out of oklch: satori has no CSS variables and no
// oklch() parser, so the token has to arrive here as a literal.
const PRIMARY = "#FB2C36";
const INK = "#18181B";
const WHITE = "#FFFFFF";

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
}

const COLUMN_WIDTH = 640;

/**
 * Width of a run of text at `fontSize`, summed from the font's own advances.
 * A character-count estimate was close enough to bound a font size but far too
 * blunt to break lines with — it over-measured by around a fifth, which cost a
 * line of wrapping on the longer headlines.
 */
function textWidth(text: string, fontSize: number) {
  let em = 0;
  for (const char of text) em += OUTFIT_BOLD_ADVANCE[char] ?? WIDEST_ADVANCE;
  return em * fontSize;
}

/** The word gap `Lines` draws — a little under a natural space. */
const WORD_GAP = 0.2;

function lineWidth(words: string[], fontSize: number) {
  const ink = words.reduce((sum, word) => sum + textWidth(word, fontSize), 0);
  return ink + (words.length - 1) * WORD_GAP * fontSize;
}

/**
 * Usernames run to 30 characters, and satori will not break a word to make it
 * fit — an unlucky one would simply run off the edge of the card. So the
 * headline is sized to whatever its longest single word can afford, then
 * stepped down again if the whole line is long. The ceiling is what the
 * headline can grow to now that it is the only text on the card — the vertical
 * room a body paragraph and a footer used to take.
 */
function headlineSize(headline: string) {
  const widestWord = Math.max(
    ...headline.split(" ").map((word) => textWidth(word, 1)),
  );
  return Math.max(
    30,
    Math.min(
      76,
      Math.floor(COLUMN_WIDTH / widestWord),
      headline.length > 44 ? 60 : headline.length > 32 ? 68 : 76,
    ),
  );
}

/**
 * Greedy line breaking, done here rather than left to `flex-wrap`.
 *
 * The point is the column width. A wrapping flex box fills whatever width it
 * is given, so the text column had to be a fixed 640 — which left the card
 * looking left-heavy, because a ragged last line like "friends" still reserved
 * the full 640 of horizontal room. Breaking the lines up front makes each one
 * a non-wrapping row, so the column shrinks to its widest actual line and the
 * mascot and the text can be centred as one group.
 */
function wrapLines(text: string, fontSize: number) {
  const lines: string[][] = [];
  let line: string[] = [];
  for (const word of text.split(" ")) {
    const candidate = [...line, word];
    if (line.length && lineWidth(candidate, fontSize) > COLUMN_WIDTH) {
      lines.push(line);
      line = [word];
    } else {
      line = candidate;
    }
  }
  if (line.length) lines.push(line);
  return lines;
}

/**
 * Satori measures a word box wider than the browser does — it keeps the full
 * advance of the trailing glyph, so anything ending in `r`, `e` or `s` picks up
 * a chunk of dead space and the following word is visibly pushed off. Laying
 * the words out as flex children makes the gap something this file sets rather
 * than something satori derives; 0.2em is a little under a natural space, which
 * absorbs most of that trailing bearing.
 */
function Lines({
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
        flexDirection: "column",
        rowGap: fontSize * 0.12,
        fontSize,
        lineHeight: 1,
        ...style,
      }}
    >
      {wrapLines(text, fontSize).map((line, lineIndex) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: rendered once to a PNG — there is no reconciliation or state to preserve, and repeated lines make the text alone a non-unique key.
          key={`${line.join(" ")}-${lineIndex}`}
          style={{ display: "flex", columnGap: fontSize * WORD_GAP }}
        >
          {line.map((word, wordIndex) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: same — one render, no state, repeated words are common.
            <div key={`${word}-${wordIndex}`} style={{ display: "flex" }}>
              {word}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export async function renderOgCard({ eyebrow, headline }: CardProps) {
  const { fonts, mascot } = await loadAssets();
  const size = headlineSize(headline);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: WHITE,
        fontFamily: "Outfit",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          // Centred as one group, not pushed to the padding edges: the column
          // below is only as wide as its longest line, so the leftover room
          // splits evenly instead of piling up on the right.
          justifyContent: "center",
          columnGap: 48,
          padding: "0 72px",
        }}
      >
        {/* The mascot faces right, so on the left of the card it looks into
            the headline rather than off the edge. */}
        <div style={{ display: "flex", flexShrink: 0 }}>
          {/* biome-ignore lint/performance/noImgElement: satori renders plain <img>, not next/image. */}
          <img src={mascot} width={372} height={422} alt="" />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Lines
            text={eyebrow}
            fontSize={26}
            style={{
              alignSelf: "flex-start",
              backgroundColor: PRIMARY,
              color: WHITE,
              fontWeight: 600,
              padding: "12px 22px",
              borderRadius: 999,
              marginBottom: 28,
            }}
          />
          <Lines
            text={headline}
            fontSize={size}
            style={{ color: INK, fontWeight: 700 }}
          />
        </div>
      </div>

      <div style={{ display: "flex", height: 16, backgroundColor: PRIMARY }} />
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
