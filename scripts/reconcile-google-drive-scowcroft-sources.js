#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "..", "data", "memcons.json");
const JS_PATH = path.join(__dirname, "..", "data", "memcons.js");
const HARVEST_PATH = path.join(__dirname, "..", "reports", "essential-collections-harvest.json");
const REPORT_PATH = path.join(__dirname, "..", "reports", "scowcroft-drive-nara-reconciliation.json");

const seedBatch = "google-drive-scowcroft-2026-05-21";

const collection = {
  naid: "4522156",
  title: "Brent Scowcroft Papers",
  url: "https://catalog.archives.gov/id/4522156",
  bushLibraryUrl:
    "https://www.bush41library.gov/digital-research-room/finding-aid/brent-scowcroft-papers"
};

const extraFolders = [
  {
    naid: "366551795",
    title: "Soviet Power Collapse in Eastern Europe (March-April 1989)",
    localIdentifier: "91124-001",
    collectionNaid: collection.naid,
    collection: collection.title,
    collectionUrl: collection.url,
    seriesNaid: "4708332",
    seriesTitle: "USSR Chronological Files",
    catalogUrl: "https://catalog.archives.gov/id/366551795",
    pdfUrl:
      "https://s3.amazonaws.com/NARAprodstorage/lz/presidential-libraries/bush/gb-gbs/4708332/41-bpr-scow-ussrch-svp-91124-001.pdf",
    objectFilename: "41-bpr-scow-ussrch-svp-91124-001.pdf",
    accessStatus: "Restricted - Possibly"
  },
  {
    naid: "366551806",
    title: "Soviet Power Collapse in Eastern Europe (November 1989) (Part II)",
    localIdentifier: "91125-002",
    collectionNaid: collection.naid,
    collection: collection.title,
    collectionUrl: collection.url,
    seriesNaid: "4708332",
    seriesTitle: "USSR Chronological Files",
    catalogUrl: "https://catalog.archives.gov/id/366551806",
    pdfUrl:
      "https://s3.amazonaws.com/NARAprodstorage/lz/presidential-libraries/bush/gb-gbs/4708332/41-bpr-scow-ussrch-svp-91125-002.pdf",
    objectFilename: "41-bpr-scow-ussrch-svp-91125-002.pdf",
    accessStatus: "Restricted - Possibly"
  }
];

const mappings = {
  "drive-scowcroft-1989-01-30-890130-mahley-to-scowcroft-pdf": ["91117-001", "date-and-topic"],
  "drive-scowcroft-1989-02-04-890204-zelikow-to-scowcroft-pdf": ["91117-001", "date-and-topic"],
  "drive-scowcroft-1989-02-10-890210-zelikow-to-scowcroft-pdf": ["91117-001", "date-and-topic"],
  "drive-scowcroft-1989-02-16-890216-blackwill-to-scowcroft-pdf": ["91117-001", "date-and-topic"],
  "drive-scowcroft-1989-02-21-890221-scowcroft-and-bahr-pdf": ["91117-001", "date-and-topic"],
  "drive-scowcroft-1989-02-27-890227-leach-and-rice-to-scowcroft-pdf": ["91117-001", "date-and-topic"],
  "drive-scowcroft-1989-03-02-890302-rice-to-scowcroft-pdf": ["91117-001", "date-and-topic"],
  "drive-scowcroft-1989-03-11-890311-zelikow-and-mahley-to-scowcroft-pdf": ["91117-001", "date-and-topic"],
  "drive-scowcroft-1989-03-13-890313-zelikow-to-scowcroft-pdf": ["91117-001", "date-and-topic"],
  "drive-scowcroft-1989-03-21-890321-zelikow-to-scowcroft-pdf": ["91117-001", "date-and-topic"],
  "drive-scowcroft-1989-03-21-890321-snider-to-scowcroft-pdf": ["91117-001", "date-and-topic"],
  "drive-scowcroft-1989-03-28-890328-melby-and-lowenkron-to-scowcroft-pdf": ["91117-001", "date-and-topic"],
  "drive-scowcroft-1989-04-05-890405-scowcroft-to-powell-pdf": ["91117-001", "date-and-topic"],
  "drive-scowcroft-1989-04-10-1989-4-10-gbpl-scowcroft-brent-files-box-99124-soviet-power-collapse-in-eastern-": [
    "91124-001",
    "filename-folder"
  ],
  "drive-scowcroft-1989-04-11-890411-blackwill-and-rodman-to-scowcroft-pdf": ["91117-001", "date-and-topic"],
  "drive-scowcroft-1989-05-01-1989-spring-gbpl-scowcroft-brent-files-ussr-collapse-us-sov-relations-thru-1991-": [
    "91117-002",
    "filename-folder"
  ],
  "drive-scowcroft-1989-05-02-1989-5-02-gbpl-scowcroft-brent-files-box-91120-soviet-power-collapse-snf-februar": [
    "91120-004",
    "filename-box"
  ],
  "drive-scowcroft-1989-05-03-1989-5-3-gbpl-scowcroft-brent-files-box-99124-soviet-power-collapse-in-eastern-e": [
    "91124-001",
    "filename-folder"
  ],
  "drive-scowcroft-1989-05-09-890509-blackwill-to-scowcroft-pdf": ["91117-002", "date-and-topic"],
  "drive-scowcroft-1989-05-09-890509-snider-to-scowcroft-pdf": ["91117-002", "date-and-topic"],
  "drive-scowcroft-1989-06-21-890621-nixon-oped-for-scowcroft-pdf": ["91117-003", "date-and-topic"],
  "drive-scowcroft-1989-06-28-1989-6-28-gbpl-scowcroft-brent-files-box-99124-soviet-power-collapse-in-eastern-": [
    "91124-003",
    "filename-folder"
  ],
  "drive-scowcroft-1989-07-01-890701-scowcroft-to-powell-pdf": ["91117-004", "date-and-topic"],
  "drive-scowcroft-1989-07-10-1989-7-10-gbpl-scowcroft-brent-files-box-99124-soviet-power-collapse-in-eastern-": [
    "91124-004",
    "filename-folder"
  ],
  "drive-scowcroft-1989-08-07-890807-paal-to-scowcroft-pdf": ["91117-004", "date-and-topic"],
  "drive-scowcroft-1989-08-09-890809-rice-to-scowcroft-pdf": ["91117-004", "date-and-topic"],
  "drive-scowcroft-1989-09-08-1989-9-8-gbpl-scowcroft-brent-files-box-99124-soviet-power-collapse-in-eastern-e": [
    "91124-005",
    "filename-folder"
  ],
  "drive-scowcroft-1989-09-29-890929-rice-to-scowcroft-pdf": ["91117-005", "date-and-topic"],
  "drive-scowcroft-1989-10-10-891010-scowcroft-to-solarz-pdf": ["91117-006", "date-and-topic"],
  "drive-scowcroft-1989-11-15-1989-11-15-gbpl-scowcroft-brent-files-box-91125-soviet-power-collapse-in-eastern": [
    "91125-002",
    "filename-folder"
  ],
  "drive-scowcroft-1990-02-17-900217-powell-to-scowcroft-pdf": ["91117-009", "date-and-topic"],
  "drive-scowcroft-1990-03-13-900313-zelikow-to-scowcroft-and-gates-pdf": ["91118-001", "date-and-topic"],
  "drive-scowcroft-1990-04-18-1990-4-18-gbpl-scowcroft-brent-files-box-91125-soviet-power-collapse-in-eastern-": [
    "91125-005",
    "filename-folder"
  ],
  "drive-scowcroft-1990-07-09-1990-7-9-gbpl-scowcroft-brent-files-box-12-ussr-collapse-us-sov-relations-thru-1": [
    "91118-007",
    "filename-folder"
  ],
  "drive-scowcroft-1990-07-14-1990-7-14-gbpl-scowcroft-brent-files-box-91120-snf-dec-1990-principals-mtg-on-st": [
    "91120-011",
    "filename-box"
  ],
  "drive-scowcroft-1990-08-13-1990-8-13-gbpl-scowcroft-brent-files-91118-ussr-collapse-us-soviet-relations-thr": [
    "91118-008",
    "filename-folder"
  ],
  "drive-scowcroft-1990-08-20-1990-8-20-gbpl-scowcroft-brent-files-91118-ussr-collapse-us-soviet-relations-thr": [
    "91118-008",
    "filename-folder"
  ],
  "drive-scowcroft-1990-09-20-1990-9-20-gbpl-scowcroft-brent-files-91118-ussr-collapse-us-soviet-relations-thr": [
    "91118-010",
    "filename-folder"
  ],
  "drive-scowcroft-1990-12-07-1990-12-7-gbpl-scowcroft-brent-files-box-91118-ussr-collapse-us-soviet-relations": [
    "91119-003",
    "filename-folder"
  ],
  "drive-scowcroft-1990-12-19-1990-12-19-gbpl-scowcroft-brent-files-box-91119-ussr-collapse-us-soviet-relation": [
    "91119-003",
    "filename-folder"
  ],
  "drive-scowcroft-1991-04-30-1991-4-30-gbpl-scowcroft-brent-files-box-91119-ussr-collapse-us-soviet-relations": [
    "91119-005",
    "filename-folder"
  ],
  "drive-scowcroft-1991-08-01-undated-rice-to-scowcroft-with-memo-for-bush-on-soviet-turmoil-pdf": [
    "91119-005",
    "nara-document-crosswalk"
  ],
  "drive-scowcroft-1991-10-08-91108-hewett-to-scowcroft-re-pz-meeting-pdf": [
    "91130-003",
    "date-and-topic"
  ]
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function folderIndex() {
  const harvest = readJson(HARVEST_PATH);
  const folders = new Map();
  for (const folder of [...(harvest.records || []), ...extraFolders]) {
    if (folder.collectionNaid !== collection.naid) continue;
    folders.set(folder.localIdentifier, folder);
  }
  return folders;
}

function matchLabel(kind) {
  if (kind === "filename-folder") return "filename named the Bush Library/NARA file unit";
  if (kind === "filename-box") return "filename named the Bush Library box/file-unit lane";
  if (kind === "nara-document-crosswalk") return "matched to a related NARA Scowcroft document extraction";
  return "date/topic crosswalk against NARA Scowcroft file units";
}

function sourceFor(folder) {
  return {
    type: "Collection",
    naid: collection.naid,
    title: collection.title,
    shortName: "Scowcroft Papers",
    url: collection.url,
    bushLibraryFindingAidUrl: collection.bushLibraryUrl,
    seriesTitle: folder.seriesTitle,
    seriesNaid: folder.seriesNaid,
    folderNaid: folder.naid,
    folderTitle: folder.title,
    localIdentifier: folder.localIdentifier
  };
}

function updateRecord(record, folder, kind) {
  const driveUrl = record.sourceCopyUrl || record.googleDriveUrl || record.pdfUrl;
  const oldTitle = record.source?.title || record.title;

  record.naid = folder.naid;
  record.localIdentifier = folder.localIdentifier;
  record.objectFilename = folder.objectFilename;
  record.accessRestrictionStatus = folder.accessStatus || "Restricted - Possibly";
  record.catalogUrl = folder.catalogUrl;
  record.pdfUrl = folder.pdfUrl;
  record.googleDriveUrl = driveUrl;
  record.sourceCopyUrl = driveUrl;
  record.source = sourceFor(folder);
  record.releaseStatus = `NARA/Bush Library source located; ${folder.objectFilename ? "PDF available" : "catalog record available"}; exact document page span to verify.`;
  record.sourceNote = `Source lead reconciled from NARA first, then the Bush Library finding aid: National Archives Catalog, Brent Scowcroft Papers, ${folder.seriesTitle}, ${folder.title}, ${folder.localIdentifier}, NAID ${folder.naid}. Digital object: ${folder.objectFilename}. Original Drive source-copy title: ${oldTitle}.`;
  record.frusSourceNote = `Source: George H.W. Bush Presidential Library, Brent Scowcroft Papers, ${folder.seriesTitle}, ${folder.title}, ${folder.localIdentifier}, NAID ${folder.naid}.`;
  record.nextAction =
    "Open the NARA PDF, verify the exact document page span against the retained Drive source-copy URL, then capture the final FRUS source note.";
  record.reconciliationStatus = `Matched to official NARA/Bush Library source lead on May 21, 2026; ${matchLabel(kind)}.`;
  record.sourceLead = {
    checkedOrder: ["National Archives Catalog", "George H.W. Bush Presidential Library finding aid"],
    matchedBy: kind,
    matchedLocalIdentifier: folder.localIdentifier,
    matchedNaid: folder.naid,
    matchedCatalogUrl: folder.catalogUrl,
    matchedPdfUrl: folder.pdfUrl,
    driveSourceCopyUrl: driveUrl
  };

  delete record.extractionStatus;
}

function main() {
  const folders = folderIndex();
  const records = readJson(DATA_PATH);
  const updated = [];
  const missing = [];

  for (const record of records) {
    if (record.seedBatch !== seedBatch) continue;

    const mapping = mappings[record.id];
    if (!mapping) {
      missing.push({ id: record.id, title: record.title, reason: "no mapping" });
      continue;
    }

    const [localIdentifier, kind] = mapping;
    const folder = folders.get(localIdentifier);
    if (!folder) {
      missing.push({ id: record.id, title: record.title, localIdentifier, reason: "no folder metadata" });
      continue;
    }

    updateRecord(record, folder, kind);
    updated.push({
      id: record.id,
      date: record.date,
      title: record.title,
      localIdentifier,
      naid: folder.naid,
      folderTitle: folder.title,
      seriesTitle: folder.seriesTitle,
      matchBasis: kind,
      catalogUrl: folder.catalogUrl,
      pdfUrl: folder.pdfUrl,
      sourceCopyUrl: record.sourceCopyUrl
    });
  }

  const report = {
    generatedAt: new Date().toISOString(),
    sourcePriority: [
      "National Archives Catalog, Brent Scowcroft Papers, NAID 4522156",
      "George H.W. Bush Presidential Library Brent Scowcroft Papers finding aid",
      "Retained Google Drive source-copy URL"
    ],
    checkedSources: [
      collection.url,
      collection.bushLibraryUrl,
      "reports/essential-collections-harvest.json",
      "National Archives Catalog proxy searches for 91124-001, 91125-002, Bahr, Leach/Rice, Hewett/PZ, Soviet turmoil, and related Scowcroft terms"
    ],
    updatedRecordCount: updated.length,
    missingRecordCount: missing.length,
    updatedRecords: updated,
    missingRecords: missing
  };

  fs.writeFileSync(DATA_PATH, `${JSON.stringify(records, null, 2)}\n`);
  fs.writeFileSync(JS_PATH, `window.MEMCONS = ${JSON.stringify(records, null, 2)};\n`);
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`);

  console.log(`Reconciled ${updated.length} Google Drive Scowcroft records`);
  if (missing.length) {
    console.log(`Missing mappings: ${missing.length}`);
    process.exitCode = 1;
  }
}

main();
