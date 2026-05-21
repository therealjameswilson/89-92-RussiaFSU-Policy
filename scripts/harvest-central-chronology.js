#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const OUT_PATH = path.join(__dirname, "..", "reports", "central-chronology-374000108-search.json");
const COLLECTION = {
  naid: "374000108",
  title: "European and Eurasian Directorate Central Chronological Files",
  shortName: "NSC European/Eurasian Central Chronology",
  url: "https://catalog.archives.gov/id/374000108"
};

const queryTerms = [
  "policy",
  "memorandum",
  "options",
  "strategy",
  "Soviet",
  "USSR",
  "former Soviet",
  "former Soviet Union",
  "Russia",
  "Russian",
  "US-Russian",
  "U.S.-Russian",
  "Yeltsin",
  "Gorbachev",
  "Ukraine",
  "Ukrainian",
  "US-Ukrainian",
  "U.S.-Ukrainian",
  "Kravchuk",
  "Belarus",
  "Byelarus",
  "Kazakhstan",
  "Nazarbayev",
  "Nunn-Lugar",
  "Lisbon",
  "START",
  "CFE",
  "nuclear",
  "denuclearization",
  "weapons",
  "FREEDOM Support",
  "NIS",
  "Newly Independent States",
  "Commonwealth of Independent States",
  "CIS",
  "successor states",
  "recognition",
  "independence",
  "self-determination",
  "Baltic",
  "Baltics",
  "Estonia",
  "Latvia",
  "Lithuania",
  "COCOM",
  "aid",
  "assistance",
  "food",
  "credit",
  "debt",
  "partnership",
  "Kozyrev",
  "Burbulis",
  "Gaidar",
  "Gaydar",
  "Strauss",
  "Matlock",
  "Talbott",
  "Zoellick",
  "Hewett",
  "Rice",
  "Gates",
  "Scowcroft"
];

const strongPolicyTerms = [
  "Soviet",
  "USSR",
  "former Soviet",
  "Russia",
  "Russian",
  "Yeltsin",
  "Gorbachev",
  "Ukraine",
  "Ukrainian",
  "Kravchuk",
  "Belarus",
  "Byelarus",
  "Kazakhstan",
  "Nazarbayev",
  "Nunn-Lugar",
  "Lisbon",
  "START",
  "CFE",
  "nuclear",
  "FREEDOM Support",
  "NIS",
  "CIS",
  "Baltic",
  "Lithuania",
  "COCOM",
  "Gaidar",
  "Gaydar",
  "Kozyrev",
  "Burbulis",
  "Strauss",
  "Hewett"
];

const lowValueEuropeanTerms = [
  "Yugoslavia",
  "Bosnia",
  "Croatia",
  "Slovenia",
  "Macedonia",
  "Serbia",
  "Kosovo",
  "Uruguay Round",
  "GATT",
  "NATO",
  "Turkey",
  "Cyprus"
];

function datePart(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (value.logicalDate) return value.logicalDate;
  if (!value.year) return "";
  return `${String(value.year).padStart(4, "0")}-${String(value.month || 1).padStart(2, "0")}-${String(
    value.day || 1
  ).padStart(2, "0")}`;
}

function seriesAncestor(record) {
  return [...(record.ancestors || [])].reverse().find((ancestor) => ancestor.levelOfDescription === "series");
}

function collectionAncestor(record) {
  return [...(record.ancestors || [])].find((ancestor) => ancestor.levelOfDescription === "collection");
}

function digitalObject(record) {
  return (
    (record.digitalObjects || []).find((object) => /PDF/i.test(object.objectType || "")) ||
    (record.digitalObjects || [])[0] ||
    null
  );
}

function extractedObjectText(object) {
  if (!object) return "";
  const otherExtracted = Array.isArray(object.otherExtractedText)
    ? object.otherExtractedText.map((entry) => entry.contribution || entry.text || "").join("\n")
    : "";
  return [object.completeExtractedText, object.extractedText, otherExtracted].filter(Boolean).join("\n\n");
}

function cleanLine(line) {
  return String(line || "")
    .replace(/\s+/g, " ")
    .trim();
}

function textContains(text, term) {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (/^[A-Z][A-Z.-]{1,5}$/.test(term) || ["aid", "debt", "food"].includes(term)) {
    return new RegExp(`(^|[^A-Za-z])${escaped}([^A-Za-z]|$)`, "i").test(text);
  }
  return new RegExp(escaped, "i").test(text);
}

function matchingTerms(text, terms = queryTerms) {
  return terms.filter((term) => textContains(text, term));
}

function yymmddToIso(value) {
  const match = String(value || "").match(/\b(\d{1,2})\/(\d{1,2})\/(\d{2,4})\b/);
  if (!match) return "";
  const month = match[1].padStart(2, "0");
  const day = match[2].padStart(2, "0");
  const rawYear = Number(match[3]);
  const year = rawYear < 50 ? 2000 + rawYear : rawYear < 100 ? 1900 + rawYear : rawYear;
  return `${year}-${month}-${day}`;
}

function likelyDocumentStart(line) {
  return /^\d{1,3}[a-z]?\.\s*(Memorandum|Paper|Report|Letter|Talking Points|Briefing|Telcon|Summary|Note|Draft|Agenda|Cover Sheet)\b/i.test(
    line
  );
}

function documentType(line) {
  const match = line.match(/^\d{1,3}[a-z]?\.\s*([A-Za-z ]+?)(?:\s+To:|\s+From:|\s+Re:|$)/i);
  if (!match) return "Document";
  const value = cleanLine(match[1]);
  if (/talking points/i.test(value)) return "Talking Points";
  if (/cover sheet/i.test(value)) return "Cover Sheet";
  return value;
}

function compactTitle(value) {
  return cleanLine(value)
    .replace(/^\d{1,3}[a-z]?\.\s*/i, "")
    .replace(/\s+\(\d+\s*pp?\.\)$/i, "")
    .replace(/\s+\(\d+\s*pages?\)$/i, "")
    .replace(/\s+\(.*withdrawal.*$/i, "")
    .replace(/\s+DECLASSIFIED.*$/i, "")
    .trim();
}

function titleFromWindow(lines, start) {
  const windowLines = lines.slice(start, Math.min(lines.length, start + 10)).map(cleanLine).filter(Boolean);
  const reIndex = windowLines.findIndex((line) => /^Re:/i.test(line));
  if (reIndex >= 0) return compactTitle(windowLines[reIndex].replace(/^Re:\s*/i, ""));

  const subjectIndex = windowLines.findIndex((line) => /^SUBJECT:/i.test(line));
  if (subjectIndex >= 0) return compactTitle(windowLines[subjectIndex].replace(/^SUBJECT:\s*/i, ""));

  const paperLine = windowLines.find((line) => /^(?:\d{1,3}[a-z]?\.\s*)?Paper\b/i.test(line));
  if (paperLine) {
    const index = windowLines.indexOf(paperLine);
    const next = windowLines
      .slice(index + 1)
      .find((line) => !/^\(?b\)?\(\d\)|^[A-Z]$|^\(\d+\s*pp?\.\)$/i.test(line));
    if (next) return compactTitle(next);
  }

  const line = windowLines[0] || "";
  const reMatch = line.match(/\bRe:\s*(.+)$/i);
  if (reMatch) return compactTitle(reMatch[1]);
  return compactTitle(line);
}

function parseDocumentCandidates(hit) {
  const lines = (hit.extractedText || "").split(/\r?\n/).map(cleanLine);
  const candidates = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line) continue;
    if (!likelyDocumentStart(line) && !/^SUBJECT:/i.test(line)) continue;

    const contextLines = lines.slice(Math.max(0, index - 4), Math.min(lines.length, index + 14));
    const context = contextLines.join(" ");
    const matches = matchingTerms(context);
    const strongMatches = matchingTerms(context, strongPolicyTerms);
    if (!strongMatches.length) continue;

    const lowValueMatches = matchingTerms(context, lowValueEuropeanTerms);
    if (lowValueMatches.length && !strongMatches.some((term) => /Russia|Russian|Soviet|USSR|Ukraine|Baltic/i.test(term))) {
      continue;
    }

    const title = titleFromWindow(lines, index);
    if (!title || title.length < 4) continue;
    if (/^(collection|record group|office|series|subseries|whorm|file location|page \d+ of \d+)$/i.test(title)) continue;

    const rawDate = context.match(/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/)?.[0] || "";
    candidates.push({
      folderNaid: hit.naid,
      folderTitle: hit.title,
      folderDate: hit.date,
      localIdentifier: hit.localIdentifier,
      catalogUrl: hit.catalogUrl,
      pdfUrl: hit.pdfUrl,
      objectFilename: hit.objectFilename,
      objectFileSize: hit.objectFileSize,
      documentType: documentType(line),
      documentTitle: title,
      documentDate: yymmddToIso(rawDate),
      rawDate,
      matchedQueries: matches,
      strongMatches,
      score: strongMatches.length * 4 + matches.length + (/policy|strategy|options|assistance|relations|recognition/i.test(context) ? 5 : 0),
      context: compactTitle(context).slice(0, 900)
    });
  }

  const seen = new Set();
  return candidates.filter((candidate) => {
    const key = `${candidate.folderNaid}|${candidate.documentTitle}|${candidate.documentDate}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function normalizedHit(record, query) {
  const object = digitalObject(record);
  const series = seriesAncestor(record);
  const collection = collectionAncestor(record);
  const restrictions = record.accessRestriction?.specificAccessRestrictions || [];
  const extractedText = extractedObjectText(object);
  return {
    naid: String(record.naId),
    title: record.title || "",
    date: datePart(record.coverageStartDate || record.inclusiveStartDate || record.productionDates?.[0]),
    endDate: datePart(record.coverageEndDate || record.inclusiveEndDate),
    localIdentifier: record.localIdentifier || "",
    level: record.levelOfDescription || "",
    catalogUrl: `https://catalog.archives.gov/id/${record.naId}`,
    pdfUrl: object?.objectUrl || "",
    objectFilename: object?.objectFilename || "",
    objectFileSize: object?.objectFileSize || null,
    digitalObjects: record.digitalObjects?.length || 0,
    accessStatus: record.accessRestriction?.status || "",
    useStatus: record.useRestriction?.status || "",
    restrictionTypes: restrictions.map((restriction) => restriction.restriction).filter(Boolean),
    seriesNaid: String(series?.naId || COLLECTION.naid),
    seriesTitle: series?.title || COLLECTION.title,
    collectionNaid: String(collection?.naId || ""),
    collectionTitle: collection?.title || "",
    matchedQueries: query ? [query] : matchingTerms(`${record.title || ""}\n${record.localIdentifier || ""}\n${extractedText}`),
    extractedText,
    extractedTextLength: extractedText.length,
    ancestors: record.ancestors || []
  };
}

function mergeHit(existing, next) {
  for (const query of next.matchedQueries) {
    if (!existing.matchedQueries.includes(query)) existing.matchedQueries.push(query);
  }
  return existing;
}

function publicRecord(record) {
  const { extractedText, ancestors, ...rest } = record;
  return {
    ...rest,
    extractedTextPreview: cleanLine(extractedText).slice(0, 1200)
  };
}

async function searchCollection(query) {
  const url = new URL("https://catalog.archives.gov/proxy/records/search");
  url.searchParams.set("ancestorNaId", COLLECTION.naid);
  url.searchParams.set("availableOnline", "true");
  url.searchParams.set("limit", "100");
  url.searchParams.set("q", query);
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  const text = await response.text();
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${text.slice(0, 200)}`);
  if (/^\s*</.test(text)) throw new Error(`HTML response for ${url}`);
  const json = JSON.parse(text);
  const hits = json.body?.hits?.hits || [];
  const total = json.body?.hits?.total?.value ?? json.body?.hits?.total ?? hits.length;
  return { total, records: hits.map((hit) => hit._source.record) };
}

async function fetchChildRecords() {
  const url = new URL(`https://catalog.archives.gov/proxy/records/parentNaId/${COLLECTION.naid}`);
  url.searchParams.set("limit", "200");
  url.searchParams.set("page", "1");
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const response = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": "FRUS-compiler-source-mining/1.0" }
    });
    const text = await response.text();
    if (response.ok && !/^\s*</.test(text)) {
      const json = JSON.parse(text);
      const hits = json.body?.hits?.hits || [];
      const total = json.body?.hits?.total?.value ?? json.body?.hits?.total ?? hits.length;
      return { total, records: hits.map((hit) => hit._source.record) };
    }
    lastError = new Error(`${response.status} ${response.statusText}: ${text.slice(0, 200)}`);
    await new Promise((resolve) => setTimeout(resolve, attempt * 750));
  }
  throw lastError;
}

async function main() {
  const byNaid = new Map();
  const queryLog = [];

  const { total, records: childRecords } = await fetchChildRecords();
  queryLog.push({ query: "parentNaId child-record crawl", total, returned: childRecords.length });

  for (const record of childRecords) {
    const hit = normalizedHit(record, "");
    if (!hit.naid || !hit.title) continue;
    if (byNaid.has(hit.naid)) mergeHit(byNaid.get(hit.naid), hit);
    else byNaid.set(hit.naid, hit);
  }

  for (const query of queryTerms) {
    const returned = [...byNaid.values()].filter((record) => record.matchedQueries.includes(query)).length;
    queryLog.push({ query, total: returned, returned });
  }

  const records = [...byNaid.values()].sort(
    (a, b) => (a.date || "9999").localeCompare(b.date || "9999") || a.title.localeCompare(b.title)
  );
  const documentCandidates = records
    .flatMap(parseDocumentCandidates)
    .sort(
      (a, b) =>
        (b.score || 0) - (a.score || 0) ||
        (a.documentDate || a.folderDate || "9999").localeCompare(b.documentDate || b.folderDate || "9999") ||
        a.documentTitle.localeCompare(b.documentTitle)
    );
  const byYear = records.reduce((acc, record) => {
    const year = (record.date || "").slice(0, 4) || "unknown";
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {});
  const likelyWithdrawalSheetCount = records.filter(
    (record) => record.objectFileSize && Number(record.objectFileSize) < 3000
  ).length;

  const report = {
    generatedAt: new Date().toISOString(),
    source: "National Archives Catalog child-record endpoint and OCR text",
    collection: COLLECTION,
    harvestMode: "Parent NAID child-record crawl with local OCR/withdrawal-sheet policy search",
    queryTerms,
    queryLog,
    totalUniqueRecords: records.length,
    totalDocumentCandidates: documentCandidates.length,
    likelyWithdrawalSheetOrSmallPdfs: likelyWithdrawalSheetCount,
    byYear,
    documentCandidates,
    records: records.map(publicRecord)
  };

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, `${JSON.stringify(report, null, 2)}\n`);
  console.log(
    JSON.stringify(
      {
        outPath: OUT_PATH,
        totalUniqueRecords: records.length,
        likelyWithdrawalSheetOrSmallPdfs: likelyWithdrawalSheetCount,
        byYear,
        queryLog
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
