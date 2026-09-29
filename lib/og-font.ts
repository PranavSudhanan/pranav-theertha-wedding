/**
 * Fetches a Google font as TTF so satori (the engine behind ImageResponse)
 * can embed it in the generated social cards.
 *
 * The old-browser User-Agent matters: Google serves woff2 to modern browsers
 * and satori cannot read woff2, so we ask as if we were Firefox 1.
 */
export async function googleFont(
  family: string,
  weight = 400
): Promise<ArrayBuffer | null> {
  try {
    const api = `https://fonts.googleapis.com/css2?family=${family.replace(
      / /g,
      "+"
    )}:wght@${weight}`;

    const css = await fetch(api, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; rv:1.0) Gecko/20100101 Firefox/1.0",
      },
    }).then((r) => r.text());

    const url = css.match(
      /src:\s*url\((https:[^)]+)\)\s*format\('(?:opentype|truetype)'\)/
    )?.[1];

    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    // A share card in the fallback face beats a build that will not finish.
    return null;
  }
}
