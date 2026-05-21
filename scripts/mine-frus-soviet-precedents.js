const fs = require("fs");
const https = require("https");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const REPORT_PATH = path.join(ROOT, "reports", "frus1981-88-soviet-precedents.json");

const volumes = [
  {
    id: "frus1981-88v04",
    title:
      "Foreign Relations of the United States, 1981-1988, Volume IV, Soviet Union, January 1983-March 1985",
    officialUrl: "https://history.state.gov/historicaldocuments/frus1981-88v04",
    sourcesUrl: "https://history.state.gov/historicaldocuments/frus1981-88v04/sources",
    prefaceUrl: "https://history.state.gov/historicaldocuments/frus1981-88v04/preface",
    rawTeiUrl:
      "https://raw.githubusercontent.com/HistoryAtState/frus/master/volumes/frus1981-88v04.xml"
  },
  {
    id: "frus1981-88v05",
    title:
      "Foreign Relations of the United States, 1981-1988, Volume V, Soviet Union, March 1985-October 1986",
    officialUrl: "https://history.state.gov/historicaldocuments/frus1981-88v05",
    sourcesUrl: "https://history.state.gov/historicaldocuments/frus1981-88v05/sources",
    prefaceUrl: "https://history.state.gov/historicaldocuments/frus1981-88v05/preface",
    rawTeiUrl:
      "https://raw.githubusercontent.com/HistoryAtState/frus/master/volumes/frus1981-88v05.xml"
  }
];

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          fetchText(new URL(response.headers.location, url).toString()).then(resolve, reject);
          return;
        }

        if (response.statusCode !== 200) {
          reject(new Error(`Failed to fetch ${url}: HTTP ${response.statusCode}`));
          response.resume();
          return;
        }

        let body = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          body += chunk;
        });
        response.on("end", () => resolve(body));
      })
      .on("error", reject);
  });
}

function decodeEntities(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#8211;|&#x2013;/g, "-")
    .replace(/&#8212;|&#x2014;/g, "-");
}

function stripXml(value) {
  return decodeEntities(
    value
      .replace(/<note\b[\s\S]*?<\/note>/g, "")
      .replace(/<lb\s*\/>/g, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function stripXmlKeepNotes(value) {
  return decodeEntities(
    value
      .replace(/<lb\s*\/>/g, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function increment(map, key) {
  map[key] = (map[key] || 0) + 1;
}

function topEntries(map, limit = 12) {
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }));
}

function findElements(xml, type) {
  const elements = [];
  const expression = new RegExp(
    `<div\\b(?=[^>]*type="${type}")(?=[^>]*xml:id="([^"]+)")[^>]*>`,
    "g"
  );
  let match;
  while ((match = expression.exec(xml))) {
    elements.push({
      id: match[1],
      start: match.index,
      openEnd: expression.lastIndex,
      openTag: match[0]
    });
  }
  return elements;
}

function findAppendixSections(xml) {
  const elements = [];
  const expression =
    /<div\b(?=[^>]*type="section")(?=[^>]*subtype="appendix")(?=[^>]*xml:id="([^"]+)")[^>]*>/g;
  let match;
  while ((match = expression.exec(xml))) {
    elements.push({
      id: match[1],
      start: match.index,
      openEnd: expression.lastIndex,
      openTag: match[0]
    });
  }
  return elements;
}

function getAttr(openTag, name) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = openTag.match(new RegExp(`(?:^|\\s)${escapedName}="([^"]+)"`));
  return match ? match[1] : null;
}

function firstHead(xml, offset) {
  const chunk = xml.slice(offset, offset + 20000);
  const match = chunk.match(/<head[^>]*>([\s\S]*?)<\/head>/);
  return match ? stripXml(match[1]) : "";
}

function firstSourceNote(documentXml) {
  const match = documentXml.match(/<note\b(?=[^>]*type="source")[^>]*>([\s\S]*?)<\/note>/);
  return match ? stripXmlKeepNotes(match[1]) : "";
}

function classifyRepository(sourceNote) {
  if (/Reagan Library/i.test(sourceNote)) return "Reagan Library";
  if (/Department of State/i.test(sourceNote)) return "Department of State";
  if (/Central Intelligence Agency|\bCIA\b/i.test(sourceNote)) return "Central Intelligence Agency";
  if (/Library of Congress/i.test(sourceNote)) return "Library of Congress";
  if (/Washington National Records Center|Department of Defense|\bDOD\b/i.test(sourceNote)) {
    return "Department of Defense/WNRC";
  }
  if (/National Security Council/i.test(sourceNote)) return "National Security Council";
  if (/Public Papers|published|Brinkley|Shultz|Gates|Dobrynin/i.test(sourceNote)) {
    return "Published source";
  }
  return sourceNote ? "Other archival/source note" : "No first source note";
}

function classifyDocType(title) {
  const bare = title.replace(/^[A-Z]?\d+[A-Z]?\.?\s*/, "").replace(/^\d+[A-Z]?\.\s*/, "");
  if (/^Editorial Note/i.test(bare)) return "Editorial Note";
  if (/^Memorandum of Conversation/i.test(bare)) return "Memorandum of Conversation";
  if (/^Memorandum of a (Meeting|Conversation)/i.test(bare)) return "Meeting Memorandum";
  if (/^Briefing Memorandum/i.test(bare)) return "Briefing Memorandum";
  if (/^Information Memorandum/i.test(bare)) return "Information Memorandum";
  if (/^Memorandum From/i.test(bare)) return "Policy Memorandum";
  if (/^Telegram/i.test(bare)) return "Telegram";
  if (/^Letter/i.test(bare)) return "Letter";
  if (/^Message/i.test(bare)) return "Message";
  if (/^Talking Points/i.test(bare)) return "Talking Points";
  if (/^Paper/i.test(bare)) return "Policy Paper";
  if (/National Security Decision Directive/i.test(bare)) return "NSDD";
  if (/^Record of Conversation/i.test(bare)) return "Record of Conversation";
  if (/^Note of a Meeting/i.test(bare)) return "Meeting Note";
  return "Other";
}

function collectionCues(sourceNote) {
  const cues = [
    "Executive Secretariat",
    "NSC Country File",
    "NSC Head of State File",
    "NSC Meeting File",
    "NSPG File",
    "NSDD File",
    "NSSD File",
    "System II",
    "System IV",
    "George Shultz Papers",
    "Jack Matlock Files",
    "McFarlane Files",
    "Poindexter Files",
    "Sven Kraemer Files",
    "Lenczowski Files",
    "Central Foreign Policy File",
    "Lot 91D257",
    "Lot 92D52",
    "Lot 92D630",
    "Lot 93D188",
    "Lot 94D92",
    "President's Daily Diary",
    "President’s Daily Diary",
    "Papers of Caspar Weinberger",
    "History Staff Files",
    "Office of Russian and European Analysis"
  ];
  return cues.filter((cue) => sourceNote.includes(cue));
}

function analyzeVolume(volume, xml) {
  const editorMatch = xml.match(/<editor role="primary">([^<]+)<\/editor>/);
  const generalEditorMatch = xml.match(/<editor role="general">([^<]+)<\/editor>/);
  const publicationDateMatch = xml.match(/<date[^>]*type="publication-date"[^>]*>([^<]*)<\/date>/);
  const chapters = findElements(xml, "chapter");
  const docs = findElements(xml, "document");
  const appendixSections = findAppendixSections(xml);
  const firstAppendixStart = appendixSections.length
    ? Math.min(...appendixSections.map((section) => section.start))
    : Number.POSITIVE_INFINITY;
  const docTypeCounts = {};
  const repositoryCounts = {};
  const cueCounts = {};
  const subtypeCounts = {};
  const documentSummaries = [];

  for (let index = 0; index < docs.length; index += 1) {
    const doc = docs[index];
    const next = docs[index + 1];
    const documentXml = xml.slice(doc.start, next ? next.start : xml.length);
    const title = firstHead(xml, doc.openEnd);
    const sourceNote = firstSourceNote(documentXml);
    const subtype = getAttr(doc.openTag, "subtype") || "unknown";
    const docType = classifyDocType(title);

    increment(subtypeCounts, subtype);
    increment(docTypeCounts, docType);
    increment(repositoryCounts, classifyRepository(sourceNote));
    for (const cue of collectionCues(sourceNote)) increment(cueCounts, cue);

    documentSummaries.push({
      id: doc.id,
      number: getAttr(doc.openTag, "n"),
      subtype,
      title,
      docType,
      repository: classifyRepository(sourceNote),
      sourceNotePreview: sourceNote.slice(0, 260)
    });
  }

  const chapterSummaries = chapters.map((chapter, index) => {
    const nextChapter = chapters[index + 1];
    const chapterEnd = Math.min(nextChapter ? nextChapter.start : Number.POSITIVE_INFINITY, firstAppendixStart);
    const chapterDocs = docs.filter((doc) => doc.start > chapter.start && doc.start < chapterEnd);
    const docNumbers = chapterDocs.map((doc) => getAttr(doc.openTag, "n")).filter(Boolean);
    return {
      id: chapter.id,
      title: firstHead(xml, chapter.openEnd),
      dateMin: getAttr(chapter.openTag, "frus:doc-dateTime-min"),
      dateMax: getAttr(chapter.openTag, "frus:doc-dateTime-max"),
      documentCount: chapterDocs.length,
      documentRange: docNumbers.length ? `${docNumbers[0]}-${docNumbers[docNumbers.length - 1]}` : null
    };
  });
  const appendixDocs = docs.filter((doc) => doc.start > firstAppendixStart);
  const appendixDocNumbers = appendixDocs.map((doc) => getAttr(doc.openTag, "n")).filter(Boolean);

  return {
    ...volume,
    primaryEditor: editorMatch ? stripXmlKeepNotes(editorMatch[1]) : "Elizabeth C. Charles",
    generalEditor: generalEditorMatch ? stripXmlKeepNotes(generalEditorMatch[1]) : "Kathleen B. Rasmussen",
    publicationYear: publicationDateMatch ? stripXmlKeepNotes(publicationDateMatch[1]) : null,
    documentCount: docs.length,
    mainDocumentCount: docs.length - appendixDocs.length,
    appendixDocumentCount: appendixDocs.length,
    appendixDocumentRange: appendixDocNumbers.length
      ? `${appendixDocNumbers[0]}-${appendixDocNumbers[appendixDocNumbers.length - 1]}`
      : null,
    historicalDocumentCount: subtypeCounts["historical-document"] || 0,
    editorialNoteCount: subtypeCounts["editorial-note"] || 0,
    chapterCount: chapters.length,
    chapters: chapterSummaries,
    documentTypeCounts: topEntries(docTypeCounts, 15),
    sourceRepositoryCounts: topEntries(repositoryCounts, 10),
    recurringSourceCues: topEntries(cueCounts, 20),
    sampleDocuments: documentSummaries.slice(0, 8)
  };
}

async function main() {
  const analyzed = [];
  for (const volume of volumes) {
    const xml = await fetchText(volume.rawTeiUrl);
    analyzed.push(analyzeVolume(volume, xml));
  }

  const report = {
    generatedAt: new Date().toISOString(),
    purpose:
      "Mine Elizabeth C. Charles's Reagan-era Soviet FRUS volumes for arrangement, source-note, and selection precedents useful to FRUS 1989-1992 Volume IV.",
    precedentVolumes: analyzed,
    methodLessonsForVolumeIv: [
      "Arrange the policy volume around chronological turning points and chapter narratives, not around archive collections.",
      "Keep high-level contacts visible, but use them as anchors for decision memoranda, briefing books, cable traffic, intelligence, and interagency records.",
      "Preserve first-footnote-level provenance: repository, collection, subfile, document state, classification, drafting/transmission history, and contextual cross-references.",
      "Expect State Executive Secretariat lots, NSC staff/directorate files, Head of State or presidential correspondence files, meeting files, country files, Daily Diary/Daily File material, intelligence records, and Defense records to work together.",
      "Use editorial notes sparingly but deliberately to account for public statements, exchanges, unavailable records, and narrative transitions that are necessary for a complete decision history.",
      "Let companion arms-control, human-rights, and national-security volumes carry their own deep lanes; cross-reference them while keeping this page focused on Soviet/Russia/FSU policy formation."
    ],
    sourceBasePattern: [
      {
        pattern: "White House and NSC files carry high-level decision-making",
        precedent: "Both official Sources pages identify Reagan Library White House Staff and Office Files, especially NSC Executive Secretariat files, as key sources."
      },
      {
        pattern: "State Department S/S lots and Central Foreign Policy File remain essential",
        precedent: "Both Sources pages foreground Executive Secretariat lot files, Soviet Affairs/Policy Planning files, and Moscow-Washington cable traffic."
      },
      {
        pattern: "Staff-level files matter when they explain policy formation",
        precedent: "Both volumes cite Matlock, Shultz, McFarlane/Poindexter, Lenczowski, Linhard, Lehman, Kraemer, and related staff files."
      },
      {
        pattern: "Published sources are supporting chronology, not substitutes for internal records",
        precedent: "Both volumes list diaries, memoirs, Public Papers, press, and Documents on Disarmament as published sources alongside archival records."
      }
    ]
  };

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`);
  console.log(
    JSON.stringify(
      {
        reportPath: path.relative(ROOT, REPORT_PATH),
        volumes: analyzed.map((volume) => ({
          id: volume.id,
          documents: volume.documentCount,
          chapters: volume.chapterCount,
          editor: volume.primaryEditor
        }))
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
