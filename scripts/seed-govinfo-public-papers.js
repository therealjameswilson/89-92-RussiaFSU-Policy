#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "..", "data", "memcons.json");
const JS_PATH = path.join(__dirname, "..", "data", "memcons.js");
const REPORT_PATH = path.join(__dirname, "..", "reports", "govinfo-public-papers-russia-fsu.json");
const SEED_REPORT_PATH = path.join(__dirname, "..", "reports", "govinfo-public-papers-russia-fsu-seed.json");
const REPORT_REF = "reports/govinfo-public-papers-russia-fsu.json";
const LOCAL_PUBLIC_PAPERS_TEXT =
  process.env.PUBLIC_PAPERS_TEXT_PATH || "/private/tmp/frus-drive-public-papers/GHBPublicPapers.txt";

const seedBatch = "govinfo-public-papers-russia-fsu-2026-05-22";

const govinfoCollectionUrl =
  "https://www.govinfo.gov/app/collection/ppp/president-41_Bush,%20George%20H.%20W.";

const packages = [
  { id: "PPP-1989-book1", label: "George H. W. Bush (1989, Book I)", dateBegin: "1989-01-20", dateEnd: "1989-06-30" },
  { id: "PPP-1989-book2", label: "George H. W. Bush (1989, Book II)", dateBegin: "1989-07-01", dateEnd: "1989-12-31" },
  { id: "PPP-1990-book1", label: "George H. W. Bush (1990, Book I)", dateBegin: "1990-01-01", dateEnd: "1990-06-30" },
  { id: "PPP-1990-book2", label: "George H. W. Bush (1990, Book II)", dateBegin: "1990-07-01", dateEnd: "1990-12-31" },
  { id: "PPP-1991-book1", label: "George H. W. Bush (1991, Book I)", dateBegin: "1991-01-01", dateEnd: "1991-06-30" },
  { id: "PPP-1991-book2", label: "George H. W. Bush (1991, Book II)", dateBegin: "1991-07-01", dateEnd: "1991-12-31" },
  { id: "PPP-1992-book1", label: "George H. W. Bush (1992, Book I)", dateBegin: "1992-01-01", dateEnd: "1992-07-31" },
  { id: "PPP-1992-book2", label: "George H. W. Bush (1992-93, Book II)", dateBegin: "1992-08-01", dateEnd: "1993-01-20" }
];

const volumeIv = {
  id: "frus1989-92v04",
  title:
    "Foreign Relations of the United States, 1989-1992, Volume IV, Soviet Union, Russia, and Post-Soviet States: Policy",
  url: "https://history.state.gov/historicaldocuments/frus1989-92v04",
  status: "Being Researched"
};

const chapters = {
  soviet: { number: 2, name: "Soviet Reform and Arms Control Policy" },
  collapse: { number: 3, name: "Collapse and Republics Policy" },
  archives: { number: 4, name: "Archive Leads" }
};

const source = {
  type: "Official public source",
  title: "Public Papers of the Presidents of the United States: George H. W. Bush",
  shortName: "GovInfo Public Papers",
  url: govinfoCollectionUrl
};

const searchTerms = [
  { label: "Soviet Union", pattern: /\b(Soviet Union|Soviet|USSR|U\.S\.S\.R\.|Union of Soviet Socialist Republics)\b/i, countries: ["Soviet Union"], topics: ["Soviet Union"] },
  { label: "Gorbachev", pattern: /\bGorbachev\b/i, countries: ["Soviet Union"], topics: ["Gorbachev"] },
  { label: "Shevardnadze", pattern: /\bShevardnadze\b/i, countries: ["Soviet Union"], topics: ["Shevardnadze"] },
  { label: "Russia", pattern: /\b(Russia|Russian|RSFSR|Russian Federation)\b/i, countries: ["Russia"], topics: ["Russia"] },
  { label: "Yeltsin", pattern: /\bYeltsin\b/i, countries: ["Russia"], topics: ["Yeltsin"] },
  { label: "Kozyrev", pattern: /\bKozyrev\b/i, countries: ["Russia"], topics: ["Kozyrev"] },
  { label: "Ukraine", pattern: /\b(Ukraine|Ukrainian|Kiev|Kyiv)\b/i, countries: ["Ukraine"], topics: ["Ukraine"] },
  { label: "Kravchuk", pattern: /\bKravchuk\b/i, countries: ["Ukraine"], topics: ["Kravchuk"] },
  { label: "Belarus", pattern: /\b(Belarus|Byelarus|Belorussia|Belarusian|Byelorussian|Shushkevich)\b/i, countries: ["Belarus"], topics: ["Belarus"] },
  { label: "Kazakhstan", pattern: /\b(Kazakhstan|Kazakh|Nazarbayev|Alma-Ata|Almaty)\b/i, countries: ["Kazakhstan"], topics: ["Kazakhstan"] },
  { label: "Baltic states", pattern: /\b(Baltic|Baltics|Estonia|Estonian|Latvia|Latvian|Lithuania|Lithuanian)\b/i, countries: ["Estonia", "Latvia", "Lithuania"], topics: ["Baltic states"] },
  { label: "Armenia", pattern: /\b(Armenia|Armenian)\b/i, countries: ["Armenia"], topics: ["Armenia"] },
  { label: "Azerbaijan", pattern: /\b(Azerbaijan|Azerbaijani)\b/i, countries: ["Azerbaijan"], topics: ["Azerbaijan"] },
  {
    label: "Georgia",
    pattern: /\b(Republic of Georgia|Georgia(?:n)? (?:Republic|President|Government|independence)|Armenia, Azerbaijan, Georgia|Azerbaijan, Georgia|Georgia, Moldova|Georgia, Ukraine)\b/i,
    countries: ["Georgia"],
    topics: ["Georgia"]
  },
  { label: "Moldova", pattern: /\b(Moldova|Moldovan|Moldavia|Moldavian)\b/i, countries: ["Moldova"], topics: ["Moldova"] },
  { label: "Uzbekistan", pattern: /\b(Uzbekistan|Uzbek)\b/i, countries: ["Uzbekistan"], topics: ["Uzbekistan"] },
  { label: "Kyrgyzstan", pattern: /\b(Kyrgyzstan|Kyrgyz|Kirghiz|Kirghizia)\b/i, countries: ["Kyrgyzstan"], topics: ["Kyrgyzstan"] },
  { label: "Tajikistan", pattern: /\b(Tajikistan|Tajik)\b/i, countries: ["Tajikistan"], topics: ["Tajikistan"] },
  { label: "Turkmenistan", pattern: /\b(Turkmenistan|Turkmen)\b/i, countries: ["Turkmenistan"], topics: ["Turkmenistan"] },
  {
    label: "Former Soviet Union",
    pattern: /\b(former Soviet Union|post-Soviet|successor states|new independent states|newly independent states|NIS|Commonwealth of Independent States|CIS|former Soviet republics)\b/i,
    countries: ["Former Soviet Union"],
    topics: ["Former Soviet Union", "Newly Independent States"]
  },
  { label: "Nunn-Lugar", pattern: /\b(Nunn-Lugar|Cooperative Threat Reduction)\b/i, countries: ["Former Soviet Union"], topics: ["Nunn-Lugar"] },
  { label: "FREEDOM Support", pattern: /\b(FREEDOM Support|Freedom for Russia and Emerging Eurasian Democracies)\b/i, countries: ["Former Soviet Union"], topics: ["FREEDOM Support Act"] },
  { label: "Lisbon Protocol", pattern: /\bLisbon Protocol\b/i, countries: ["Russia", "Ukraine", "Belarus", "Kazakhstan"], topics: ["Lisbon Protocol"] },
  { label: "START", pattern: /\b(START|Strategic Arms Reduction Treaty|Strategic Offensive Arms|Strategic Arms Reduction)\b/, countries: ["Soviet Union", "Russia"], topics: ["START"] },
  { label: "CFE", pattern: /\b(CFE|Conventional Armed Forces in Europe)\b/i, countries: ["Soviet Union", "Russia"], topics: ["CFE"] }
];

const monthNumbers = new Map(
  [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ].map((month, index) => [month, String(index + 1).padStart(2, "0")])
);

function decodeHtml(value) {
  return String(value || "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function stripTags(value) {
  return decodeHtml(String(value || "").replace(/<[^>]+>/g, ""));
}

function cleanText(value) {
  return decodeHtml(String(value || ""))
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function compact(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 72);
}

function isoDate(value) {
  const match = String(value || "").match(
    /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),\s+(\d{4})\b/
  );
  if (!match) return "";
  return `${match[3]}-${monthNumbers.get(match[1])}-${match[2].padStart(2, "0")}`;
}

function isFullDateLine(value) {
  return Boolean(
    String(value || "")
      .trim()
      .match(/^(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}$/)
  );
}

function dateLine(date) {
  const value = new Date(`${date}T00:00:00Z`);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  }).format(value);
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: { Accept: "text/html,application/xhtml+xml", "User-Agent": "FRUS-public-papers-reference/1.0" }
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return response.text();
}

function extractContextDocs(packageId, html) {
  const docs = new Map();
  const detailRe = new RegExp(
    `<a\\s+href="(?:https://www\\.govinfo\\.gov)?/app/details/${packageId}/(${packageId}-doc-pg\\d+[^"]*)">([\\s\\S]*?)</a>`,
    "g"
  );
  let match;
  while ((match = detailRe.exec(html))) {
    const documentId = match[1];
    const title = compact(stripTags(match[2]));
    if (!title || /front matter/i.test(title)) continue;
    docs.set(documentId, {
      packageId,
      documentId,
      title,
      detailsUrl: `https://www.govinfo.gov/app/details/${packageId}/${documentId}`,
      htmlUrl: `https://www.govinfo.gov/content/pkg/${packageId}/html/${documentId}.htm`,
      pdfUrl: `https://www.govinfo.gov/content/pkg/${packageId}/pdf/${documentId}.pdf`
    });
  }
  return [...docs.values()];
}

function packageDetailsUrl(packageId) {
  return `https://www.govinfo.gov/app/details/${packageId}`;
}

function packagePdfUrl(packageId) {
  return `https://www.govinfo.gov/content/pkg/${packageId}/pdf/${packageId}.pdf`;
}

function packageForDate(date) {
  return packages.find((pkg) => date >= pkg.dateBegin && date <= pkg.dateEnd);
}

function isUsableLocalTitle(title) {
  return (
    title.length >= 5 &&
    title.length <= 220 &&
    !/^(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}\.?/i.test(title) &&
    !/^Note:|^\[|^\d+$|^- \d+ -$|^Q\.|^The President\.|^Thank you/i.test(title) &&
    !/\b(currently resides|graduated from|received (?:his|her) .*degree|following his remarks|returned to Washington|returned to the White House|tape was not available)\b/i.test(title) &&
    /[A-Za-z]{4}/.test(title)
  );
}

function parseLocalOcrDocuments() {
  if (!fs.existsSync(LOCAL_PUBLIC_PAPERS_TEXT)) return [];
  const segments = fs.readFileSync(LOCAL_PUBLIC_PAPERS_TEXT, "utf8").split("\f");
  const records = [];
  let lineBase = 1;

  for (const segment of segments) {
    const lines = segment.split(/\n/);
    const nonEmpty = [];
    for (let index = 0; index < lines.length; index += 1) {
      const value = lines[index].trim();
      if (value) nonEmpty.push({ value, index });
    }

    const dateEntry = nonEmpty.slice(0, 8).find((entry) => isFullDateLine(entry.value));
    if (!dateEntry) {
      lineBase += lines.length;
      continue;
    }

    const title = compact(
      nonEmpty
        .filter((entry) => entry.index < dateEntry.index)
        .map((entry) => entry.value)
        .join(" ")
    ).replace(/^George Bush\s+/i, "");
    if (!isUsableLocalTitle(title)) {
      lineBase += lines.length;
      continue;
    }

    const date = isoDate(dateEntry.value);
    const pkg = packageForDate(date);
    if (!pkg) {
      lineBase += lines.length;
      continue;
    }

    records.push({
      packageId: pkg.id,
      packageLabel: pkg.label,
      documentId: `ocr-${pkg.id}-${date}-${slugify(title)}-${lineBase + nonEmpty[0].index}`,
      title,
      detailsUrl: packageDetailsUrl(pkg.id),
      htmlUrl: packageDetailsUrl(pkg.id),
      pdfUrl: packagePdfUrl(pkg.id),
      date,
      publicPapersDate: dateEntry.value,
      pages: "",
      lineAnchor: lineBase + nonEmpty[0].index,
      text: cleanText(segment),
      citationMode: "GovInfo package PDF; item split from local OCR text cache"
    });
    lineBase += lines.length;
  }

  return records
    .filter((record) => {
      const firstWords = record.title.split(/\s+/).slice(0, 3).join(" ");
      return !/^(Mr|Ms|Mrs|Dr)\./.test(firstWords);
    })
    .filter((record, index, allRecords) => {
      const key = `${record.date}|${record.title}`;
      return allRecords.findIndex((candidate) => `${candidate.date}|${candidate.title}` === key) === index;
    });
}

function parseDocumentText(html) {
  const pre = html.match(/<pre[^>]*>([\s\S]*?)<\/pre>/i)?.[1] || html;
  const text = cleanText(stripTags(pre));
  const dateText = text
    .split("\n")
    .map((line) => line.match(/^\[(.+\d{4})\]$/)?.[1])
    .find((line) => line && !/^Pages?/i.test(line));
  const pages = text.match(/^\[Pages?\s+([^\]]+)\]$/m)?.[1] || "";
  return { text, date: isoDate(dateText), publicPapersDate: dateText || "", pages };
}

function matchingTerms(title, text) {
  const haystack = `${title}\n${text}`;
  return searchTerms.filter((entry) => entry.pattern.test(haystack));
}

function titleMatchingTerms(title) {
  return searchTerms.filter((entry) => entry.pattern.test(title));
}

function isReferenceStatement(title, matches) {
  const personnelNotice = /^(Nomination|Appointment|Designation|Continuation|Withdrawal of Nomination)\b/i.test(title);
  if (!personnelNotice) return true;
  return titleMatchingTerms(title).some((entry) => matches.includes(entry));
}

function uniqueSorted(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function countriesFor(matches) {
  const countries = matches.flatMap((entry) => entry.countries || []);
  return ["United States", ...uniqueSorted(countries)];
}

function topicsFor(matches) {
  return uniqueSorted(matches.flatMap((entry) => entry.topics || [entry.label])).slice(0, 8);
}

function participantsFor(record, text) {
  const participants = ["George H. W. Bush"];
  if (/Press Secretary Fitzwater|Fitzwater/i.test(record.title)) participants.push("Marlin Fitzwater");
  if (/\bGorbachev\b/i.test(`${record.title}\n${text}`)) participants.push("Mikhail Gorbachev");
  if (/\bYeltsin\b/i.test(`${record.title}\n${text}`)) participants.push("Boris Yeltsin");
  if (/\bKravchuk\b/i.test(`${record.title}\n${text}`)) participants.push("Leonid Kravchuk");
  if (/\bNazarbayev\b/i.test(`${record.title}\n${text}`)) participants.push("Nursultan Nazarbayev");
  if (/Press Secretary|Statement by/i.test(record.title)) participants.push("White House Office of the Press Secretary");
  return uniqueSorted(participants);
}

function evidenceSnippet(title, text, matches) {
  const compacted = compact(text);
  const firstMatch = matches
    .map((entry) => {
      const found = compacted.match(entry.pattern);
      return found ? found.index : -1;
    })
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)[0];
  if (firstMatch === undefined) return title;
  const start = Math.max(0, firstMatch - 220);
  return compacted.slice(start, start + 720);
}

function chapterFor(date) {
  return date && date < "1991-08-19" ? chapters.soviet : chapters.collapse;
}

function byChapterThenDate(a, b) {
  return (
    a.chapter.number - b.chapter.number ||
    (a.sortDate || a.date).localeCompare(b.sortDate || b.date) ||
    (a.sortOrder || 0) - (b.sortOrder || 0) ||
    a.title.localeCompare(b.title)
  );
}

function sourceLead(report) {
  return {
    id: "source-lead-govinfo-public-papers-russia-fsu",
    date: "1989-01-20",
    sortDate: "1989-01-20",
    sortOrder: 1400,
    type: "Source Lead",
    title: "GovInfo Bush Public Papers Russia/FSU reference index",
    documentTitle: "Public Papers of the Presidents of the United States: George H. W. Bush",
    participants: ["George H. W. Bush", "Office of the Federal Register", "Government Publishing Office"],
    countries: [
      "United States",
      "Soviet Union",
      "Russia",
      "Ukraine",
      "Belarus",
      "Kazakhstan",
      "Former Soviet Union"
    ],
    chapter: chapters.archives,
    releaseStatus: "Official GovInfo Public Papers index generated",
    catalogUrl: govinfoCollectionUrl,
    pdfUrl: "",
    digitalObjects: report.totalRelevantStatements,
    source,
    dateLine: "GovInfo crawl, May 22, 2026",
    subjectLine: `Official GovInfo Public Papers crawl across ${report.packages.length} Bush 41 volumes; ${report.totalRelevantStatements} Russia/FSU-relevant public statements indexed for Volume IV reference.`,
    sourceNote: `Source: GovInfo, Public Papers of the Presidents collection for George H. W. Bush, ${govinfoCollectionUrl}. Local report: ${REPORT_REF}.`,
    frusSourceNote:
      "Public reference source only; use public statements to anchor public chronology and cite archival/internal records for FRUS document selection.",
    topics: ["Public Papers", "GovInfo", "Public statements", "Russia/FSU reference"],
    potentialFrusDocument: false,
    countStatus: "GovInfo Public Papers source lead",
    nextAction:
      "Use the GovInfo public-statement reference rows to triangulate public posture against internal NSC, State, DoD, and Daily File policy records.",
    extractionStatus:
      "Official GovInfo HTML documents were fetched and filtered locally by Soviet/Russia/FSU country, leader, and arms-control terms.",
    volumeRole: "volume-iv-public-reference-source",
    volumeStatus: "Public reference source",
    frusVolume: volumeIv,
    govinfoPublicPapers: {
      reportPath: REPORT_REF,
      collectionUrl: govinfoCollectionUrl,
      packages: report.packages.map((entry) => entry.id),
      documentsScanned: report.documentsScanned,
      relevantStatements: report.totalRelevantStatements,
      localOcrTextPath: report.localOcrTextPath,
      searchedTerms: searchTerms.map((entry) => entry.label)
    },
    seedBatch
  };
}

function publicStatementRecord(record, index) {
  const sourceNote =
    record.citationMode === "GovInfo package PDF; item split from local OCR text cache"
      ? `Source: GovInfo, Public Papers of the Presidents of the United States: George H. W. Bush, ${record.packageLabel}, ${record.title}, ${dateLine(record.date)}. GovInfo package PDF: ${record.pdfUrl}. Item title/date split from local OCR text cache, line ${record.lineAnchor}.`
      : `Source: GovInfo, Public Papers of the Presidents of the United States: George H. W. Bush, ${record.packageLabel}, ${record.title}, ${dateLine(record.date)}${record.pages ? `, pp. ${record.pages}` : ""}. HTML: ${record.htmlUrl}.`;

  return {
    id: `govinfo-public-papers-${record.date}-${record.documentId}`,
    date: record.date,
    sortDate: record.date,
    sortOrder: 700 + index,
    type: "Public Statement",
    title: record.title,
    documentTitle: record.title,
    participants: record.participants,
    countries: record.countries,
    chapter: record.chapter,
    releaseStatus: "Official GovInfo Public Papers text",
    catalogUrl: record.detailsUrl,
    pdfUrl: record.pdfUrl,
    digitalObjects: 1,
    source,
    dateLine: dateLine(record.date),
    subjectLine: `Public Papers reference item matching: ${record.matchedTerms.join(", ")}.`,
    sourceNote,
    frusSourceNote:
      "Public Papers reference statement; use to establish public chronology and compare against internal policy memoranda, not as a substitute for archival selection.",
    topics: record.topics,
    potentialFrusDocument: false,
    countStatus: "Public Papers Russia/FSU reference statement",
    nextAction:
      "Use as a public chronology/reference anchor when selecting or annotating related archival policy documents.",
    extractionStatus:
      "Fetched from GovInfo Public Papers HTML and retained because title or text matched Soviet, Russia, former Soviet republic, NIS/CIS, START, CFE, Nunn-Lugar, Lisbon, or FREEDOM Support terms.",
    volumeRole: "volume-iv-public-reference",
    volumeStatus: "Public reference",
    frusVolume: volumeIv,
    govinfoPublicPapers: {
      packageId: record.packageId,
      documentId: record.documentId,
      packageLabel: record.packageLabel,
      htmlUrl: record.htmlUrl,
      pdfUrl: record.pdfUrl,
      detailsUrl: record.detailsUrl,
      pages: record.pages,
      lineAnchor: record.lineAnchor || null,
      citationMode: record.citationMode || "GovInfo item HTML",
      matchedTerms: record.matchedTerms,
      reportPath: REPORT_REF
    },
    catalogTextEvidence: record.evidence,
    seedBatch
  };
}

async function mapLimit(items, limit, worker) {
  const results = new Array(items.length);
  let next = 0;
  async function run() {
    while (next < items.length) {
      const index = next;
      next += 1;
      results[index] = await worker(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return results;
}

async function harvest() {
  const packageReports = [];
  const relevant = [];
  const failures = [];
  const localDocs = parseLocalOcrDocuments();

  for (const pkg of packages) {
    const contextUrl = `https://www.govinfo.gov/app/details/${pkg.id}/context`;
    const contextHtml = await fetchText(contextUrl);
    const docs = extractContextDocs(pkg.id, contextHtml);
    const packageReport = {
      ...pkg,
      contextUrl,
      documentsListed: docs.length,
      localOcrDocumentsListed: 0,
      relevantStatements: 0,
      itemSource: docs.length ? "GovInfo item-level HTML" : "GovInfo package PDF plus local OCR split"
    };
    packageReports.push(packageReport);

    if (!docs.length) {
      const packageLocalDocs = localDocs.filter((doc) => doc.packageId === pkg.id);
      packageReport.localOcrDocumentsListed = packageLocalDocs.length;
      const hits = packageLocalDocs
        .map((doc) => {
          const matches = matchingTerms(doc.title, doc.text);
          if (!matches.length) return null;
          if (!isReferenceStatement(doc.title, matches)) return null;
          return {
            ...doc,
            matchedTerms: matches.map((entry) => entry.label),
            countries: countriesFor(matches),
            topics: topicsFor(matches),
            participants: participantsFor(doc, doc.text),
            chapter: chapterFor(doc.date),
            evidence: evidenceSnippet(doc.title, doc.text, matches)
          };
        })
        .filter(Boolean);
      packageReport.relevantStatements = hits.length;
      relevant.push(...hits);
      continue;
    }

    const fetched = await mapLimit(docs, 8, async (doc) => {
      try {
        const html = await fetchText(doc.htmlUrl);
        const parsed = parseDocumentText(html);
        const date = parsed.date || isoDate(doc.title);
        if (!date) return null;
        const matches = matchingTerms(doc.title, parsed.text);
        if (!matches.length) return null;
        if (!isReferenceStatement(doc.title, matches)) return null;
        const record = {
          ...doc,
          packageLabel: pkg.label,
          date,
          publicPapersDate: parsed.publicPapersDate,
          pages: parsed.pages,
          lineAnchor: null,
          citationMode: "GovInfo item HTML",
          matchedTerms: matches.map((entry) => entry.label),
          countries: countriesFor(matches),
          topics: topicsFor(matches),
          participants: participantsFor(doc, parsed.text),
          chapter: chapterFor(date),
          evidence: evidenceSnippet(doc.title, parsed.text, matches)
        };
        return record;
      } catch (error) {
        failures.push({ packageId: pkg.id, documentId: doc.documentId, htmlUrl: doc.htmlUrl, error: error.message });
        return null;
      }
    });

    const hits = fetched.filter(Boolean);
    packageReport.relevantStatements = hits.length;
    relevant.push(...hits);
  }

  relevant.sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title));

  return {
    generatedAt: new Date().toISOString(),
    source: "GovInfo Public Papers of the Presidents official HTML",
    collectionUrl: govinfoCollectionUrl,
    localOcrTextPath: fs.existsSync(LOCAL_PUBLIC_PAPERS_TEXT) ? LOCAL_PUBLIC_PAPERS_TEXT : null,
    packages: packageReports,
    documentsScanned: packageReports.reduce(
      (sum, entry) => sum + entry.documentsListed + entry.localOcrDocumentsListed,
      0
    ),
    totalRelevantStatements: relevant.length,
    searchedTerms: searchTerms.map((entry) => ({
      label: entry.label,
      pattern: entry.pattern.source,
      countries: entry.countries,
      topics: entry.topics
    })),
    failures,
    statements: relevant.map((record) => ({
      packageId: record.packageId,
      packageLabel: record.packageLabel,
      documentId: record.documentId,
      date: record.date,
      title: record.title,
      pages: record.pages,
      detailsUrl: record.detailsUrl,
      htmlUrl: record.htmlUrl,
      pdfUrl: record.pdfUrl,
      citationMode: record.citationMode,
      lineAnchor: record.lineAnchor || null,
      matchedTerms: record.matchedTerms,
      countries: record.countries,
      topics: record.topics,
      evidence: record.evidence
    }))
  };
}

async function main() {
  const records = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
  const report = await harvest();
  const source = sourceLead(report);
  const statements = report.statements.map((statement, index) =>
    publicStatementRecord(
      {
        ...statement,
        packageLabel: packages.find((pkg) => pkg.id === statement.packageId)?.label || statement.packageId,
        participants: participantsFor(statement, statement.evidence),
        chapter: chapterFor(statement.date)
      },
      index
    )
  );
  const seeded = [source, ...statements];
  const ids = new Set();
  for (const record of seeded) {
    if (ids.has(record.id)) throw new Error(`Duplicate generated id: ${record.id}`);
    ids.add(record.id);
  }

  const existing = records.filter((record) => record.seedBatch !== seedBatch && !ids.has(record.id));
  const combined = [...existing, ...seeded].sort(byChapterThenDate);

  fs.writeFileSync(DATA_PATH, `${JSON.stringify(combined, null, 2)}\n`);
  fs.writeFileSync(JS_PATH, `window.MEMCONS = ${JSON.stringify(combined, null, 2)};\n`);
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(
    SEED_REPORT_PATH,
    `${JSON.stringify(
      {
        generatedAt: report.generatedAt,
        seedBatch,
        sourceReport: REPORT_REF,
        sourceLeads: 1,
        publicStatements: statements.length,
        documentsScanned: report.documentsScanned,
        packages: report.packages,
        totalRecords: combined.length
      },
      null,
      2
    )}\n`
  );

  console.log(
    JSON.stringify(
      {
        seedBatch,
        documentsScanned: report.documentsScanned,
        publicStatements: statements.length,
        sourceLeads: 1,
        totalRecords: combined.length,
        failures: report.failures.length
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
