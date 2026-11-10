import logoUrl from "@/assets/logo-transparent.png";
import { MEANING, costText, type DiagnosisResult } from "./result-presentation";
import type { BasicInfo } from "./audit";

/** Generated locally: no client details are sent to a reporting service. */
export async function buildDiagnosisReport(
  result: DiagnosisResult,
  info: BasicInfo,
  answers: Record<string, string>,
) {
  const [{ PDFDocument, rgb }, { default: fontkit }] = await Promise.all([
    import("pdf-lib"),
    import("@pdf-lib/fontkit"),
  ]);
  const bytes = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Unable to load report assets");
    return response.arrayBuffer();
  };
  const [regularBytes, boldBytes, logoBytes] = await Promise.all([
    bytes("/fonts/report-regular.ttf"),
    bytes("/fonts/report-bold.ttf"),
    bytes(logoUrl),
  ]);
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  const regular = await doc.embedFont(regularBytes, { subset: true });
  const bold = await doc.embedFont(boldBytes, { subset: true });
  const logo = await doc.embedPng(logoBytes);
  // Read the report's semantic tokens rather than duplicating the brand palette.
  const color = (token: string) => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Unable to prepare report colors");
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return rgb((r ?? 0) / 255, (g ?? 0) / 255, (b ?? 0) / 255);
  };
  const ink = color("--report-ink"),
    muted = color("--report-muted"),
    brand = color("--report-brand"),
    gold = color("--report-gold"),
    paper = color("--report-paper");
  const width = 595.28,
    height = 841.89,
    margin = 48,
    textWidth = width - margin * 2;
  let page = doc.addPage([width, height]);
  let y = height - 48;
  page.drawRectangle({ x: 0, y: 0, width, height, color: paper });
  const newPage = () => {
    page = doc.addPage([width, height]);
    page.drawRectangle({ x: 0, y: 0, width, height, color: paper });
    y = height - 72;
  };
  const ensure = (space: number) => {
    if (y - space < 65) newPage();
  };
  const paragraph = (text: string, size = 9.5, isBold = false, tint = ink) => {
    const font = isBold ? bold : regular;
    const words = text.replace(/\s+/g, " ").trim().split(" ");
    const lines: string[] = [];
    let line = "";
    for (const word of words) {
      const next = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(next, size) > textWidth) {
        if (line) lines.push(line);
        line = "";
        for (const ch of word) {
          if (font.widthOfTextAtSize(line + ch, size) > textWidth) {
            lines.push(line);
            line = "";
          }
          line += ch;
        }
      } else line = next;
    }
    if (line) lines.push(line);
    for (const textLine of lines) {
      ensure(size * 1.5);
      page.drawText(textLine, { x: margin, y, size, font, color: tint });
      y -= size * 1.5;
    }
    y -= 5;
  };
  const section = (label: string, text: string) => {
    ensure(72);
    y -= 6;
    page.drawLine({
      start: { x: margin, y: y + 6 },
      end: { x: width - margin, y: y + 6 },
      thickness: 0.6,
      color: gold,
    });
    y -= 14;
    paragraph(label.toUpperCase(), 9, true, brand);
    y -= 2;
    paragraph(text);
  };
  page.drawImage(logo, {
    x: width - margin - 95,
    y: height - 106,
    width: 95,
    height: (95 * logo.height) / logo.width,
  });
  paragraph("THE CLIENT X-RAY", 11, true, brand);
  paragraph("Client acquisition diagnosis", 10, false, muted);
  y -= 18;
  paragraph(`Prepared for ${info.name || "you"}`, 11, true);
  paragraph(
    `Report downloaded ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`,
    9,
    false,
    muted,
  );
  y -= 16;
  paragraph("YOUR BIGGEST PROBLEM", 9, true, brand);
  y -= 10;
  paragraph(result.diagnosis_title, 24, true);
  paragraph(`Severity: ${result.severity}`, 11, true, brand);
  section("What's happening", `${result.one_sentence_diagnosis}\n${result.business_impact}`);
  ensure(90);
  y -= 8;
  paragraph("WHY WE BELIEVE THIS", 9, true, brand);
  result.evidence.slice(0, 3).forEach((text, i) => paragraph(`${i + 1}. ${text}`));
  section("What this means", MEANING[result.primary_diagnosis] ?? "");
  section("What this could be costing you", costText(answers, result.primary_diagnosis));
  if (result.secondary_observation)
    section("One more thing we noticed", result.secondary_observation);
  ensure(120);
  section(
    "Your next move",
    "The diagnosis tells us where the problem is. It doesn’t tell us everything that needs to happen to fix it. That’s where the Client Acquisition Review comes in.",
  );
  paragraph("Book your Client Acquisition Review", 12, true, brand);
  paragraph(
    "I’ll look at your business, your numbers and your current acquisition process together and decide what needs to change first.",
  );
  paragraph("The Sales Doctor · Dr. Dan Odotukpono", 9, false, muted);
  doc.getPages().forEach((p, index, pages) => {
    p.drawRectangle({ x: 0, y: height - 8, width, height: 8, color: brand });
    p.drawLine({
      start: { x: margin, y: 43 },
      end: { x: width - margin, y: 43 },
      color: gold,
      thickness: 0.6,
    });
    p.drawText("THE SALES DOCTOR  /  PRIVATE REPORT", {
      x: margin,
      y: 27,
      size: 8,
      font: regular,
      color: muted,
    });
    p.drawText(`${index + 1} / ${pages.length}`, {
      x: width - margin - 28,
      y: 27,
      size: 8,
      font: regular,
      color: muted,
    });
  });
  doc.setTitle("Your Client X-Ray Diagnosis");
  doc.setAuthor("The Sales Doctor");
  doc.setSubject("Client acquisition diagnosis");
  const output = await doc.save();
  return new Blob([new Uint8Array(output)], { type: "application/pdf" });
}
