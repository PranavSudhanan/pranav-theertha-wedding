/**
 * Builds public/invitation.pdf from the printed card artwork.
 *
 * Run it again whenever the card changes:
 *   node scripts/make-invitation-pdf.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";
import { PDFDocument } from "pdf-lib";

const SOURCE = "public/images/invitation-card.webp";
const OUT = "public/invitation.pdf";

// 148 x 222mm in points — invitation-sized, prints happily on A4.
const PAGE_W = 420;

const src = await readFile(SOURCE);
const meta = await sharp(src).metadata();

// pdf-lib embeds JPEG and PNG only, so the webp is converted first.
const jpeg = await sharp(src)
  .jpeg({ quality: 92, chromaSubsampling: "4:4:4" })
  .toBuffer();

const pageH = Math.round((PAGE_W * meta.height) / meta.width);

const pdf = await PDFDocument.create();
pdf.setTitle("Pranav & Theertha — Wedding Invitation");
pdf.setAuthor("Pranav S L & Theertha T K");
pdf.setSubject("Sunday, 15 November 2026 — Reef Club Resort, Eranhikkal, Kozhikode");
pdf.setCreator("pranav-theertha wedding site");

const page = pdf.addPage([PAGE_W, pageH]);
const image = await pdf.embedJpg(jpeg);
page.drawImage(image, { x: 0, y: 0, width: PAGE_W, height: pageH });

await writeFile(OUT, await pdf.save());
console.log(
  `${OUT}  ${PAGE_W}x${pageH}pt  from ${meta.width}x${meta.height} ${meta.format}`
);
