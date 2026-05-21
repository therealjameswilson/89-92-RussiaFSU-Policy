#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "..", "data", "memcons.json");
const JS_PATH = path.join(__dirname, "..", "data", "memcons.js");
const HARVEST_PATH = path.join(__dirname, "..", "reports", "essential-collections-harvest.json");
const REPORT_PATH = path.join(__dirname, "..", "reports", "scowcroft-nara-document-extraction.json");

const seedBatch = "scowcroft-nara-documents-2026-05-21";

const volumeIv = {
  id: "frus1989-92v04",
  title:
    "Foreign Relations of the United States, 1989-1992, Volume IV, Soviet Union, Russia, and Post-Soviet States: Policy",
  url: "https://history.state.gov/historicaldocuments/frus1989-92v04",
  status: "Being Researched"
};

const chapters = {
  soviet: { number: 2, name: "Soviet Reform and Arms Control Policy" },
  collapse: { number: 3, name: "Collapse and Republics Policy" }
};

const monthNames = [
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
];

const folderNotes = {
  "366551738": "OCR sampled first ten pages; withdrawal sheets identify January-April 1989 Soviet-policy memoranda and several opening pages were OCR-readable.",
  "366551739": "Full OCR run completed for 117-page May 1989 folder; withdrawal sheets and open document pages identify Baker Moscow, Soviet NSD, START, Open Skies, and dangerous military activity material.",
  "366551745": "OCR sampled first ten pages; withdrawal sheets identify post-Malta and Future of Europe speech reaction material.",
  "366551748": "OCR sampled first ten pages; withdrawal sheets and open pages identify Lithuania/Baltic meeting briefs, Landsbergis/Prunskiene material, and military-to-military contacts.",
  "366551759": "OCR sampled first ten pages; withdrawal sheets and open pages identify economic assistance, Ukraine/Fokin, Shevardnadze, IMF/World Bank, Soviet contingencies, and toughening-line memoranda.",
  "366551761": "OCR sampled first ten pages; withdrawal sheets and open pages identify Scowcroft's Coping with Soviet Union's Internal Turmoil memo, Estonia/Ruutel, Matlock, Silayev, CFE/BW, and CCC-credit material.",
  "366551845": "OCR sampled first ten pages; withdrawal sheets identify Bush-Gorbachev correspondence, Strauss reporting, USSR State Council material, and Yeltsin messages in the Gorbachev sensitive file.",
  "366551851": "OCR sampled first ten pages; withdrawal sheets and open pages identify Yeltsin/START II/HEU/Nunn-Lugar transition material.",
  "366551859": "OCR sampled first ten pages; withdrawal sheets and open pages identify Soviet coup, humanitarian assistance, debt, economic aid, and Deputies working-group material."
};

function formatDate(date) {
  const [year, month, day] = date.split("-").map(Number);
  return `${monthNames[month - 1]} ${day}, ${year}`;
}

function slug(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 90);
}

function buildRecord(doc, folder) {
  const chapter = chapters[doc.chapterKey || (doc.date >= "1991-08-19" ? "collapse" : "soviet")];
  const source = {
    type: "Collection",
    naid: "4522156",
    title: "Brent Scowcroft Papers",
    shortName: "Scowcroft Papers",
    url: "https://catalog.archives.gov/id/4522156",
    seriesTitle: folder.seriesTitle,
    seriesNaid: folder.seriesNaid,
    folderNaid: folder.naid,
    folderTitle: folder.title,
    localIdentifier: folder.localIdentifier
  };
  const id = `scowcroft-doc-${doc.date}-${slug(doc.title)}-${folder.naid}-${slug(doc.documentNo || "")}`;

  return {
    id,
    date: doc.date,
    sortDate: doc.sortDate || doc.date,
    sortOrder: doc.sortOrder || 0,
    type: doc.type || "Policy Memorandum",
    title: doc.title,
    documentTitle: doc.documentTitle || doc.title,
    participants: doc.participants,
    countries: doc.countries,
    chapter,
    releaseStatus:
      doc.releaseStatus ||
      `PDF available; document identified inside Scowcroft file unit; NARA access status ${folder.accessStatus || "not stated"}`,
    accessRestrictionStatus: folder.accessStatus,
    naid: folder.naid,
    catalogUrl: folder.catalogUrl,
    pdfUrl: folder.pdfUrl,
    localIdentifier: folder.localIdentifier,
    objectFilename: folder.objectFilename,
    digitalObjects: 1,
    source,
    dateLine: doc.dateLine || formatDate(doc.date),
    subjectLine: doc.subjectLine,
    sourceNote: `Source: National Archives Catalog, Brent Scowcroft Papers, ${folder.seriesTitle}, ${folder.title}, ${folder.localIdentifier}, NAID ${folder.naid}; document ${doc.documentNo || "identified by OCR/withdrawal sheet"}: ${doc.documentTitle || doc.title}. Digital object: ${folder.objectFilename}.`,
    frusSourceNote: `Source: George H.W. Bush Presidential Library, Brent Scowcroft Papers, ${folder.seriesTitle}, ${folder.title}, ${folder.localIdentifier}, document ${doc.documentNo || "identified by OCR/withdrawal sheet"}.`,
    topics: doc.topics,
    potentialFrusDocument: true,
    countStatus: doc.countStatus || "Extracted Scowcroft document candidate",
    nextAction:
      doc.nextAction ||
      "Review the cited PDF pages, capture exact page span and document state, and reconcile against any duplicate Drive or FRUS Volume III source copy before selection.",
    extractionStatus: doc.extractionStatus || "Document title/date extracted from OCR of NARA Scowcroft file-unit withdrawal sheets; full document text still needs page-span review.",
    extractionBasis: {
      method: doc.method || "OCR of NARA PDF withdrawal sheet",
      documentNo: doc.documentNo,
      pageEvidence: doc.pageEvidence,
      folderNote: folderNotes[folder.naid]
    },
    volumeRole: "volume-iv-policy-candidate",
    volumeStatus: "Volume IV research candidate",
    frusVolume: volumeIv,
    seedBatch
  };
}

const documents = [
  {
    folderNaid: "366551738",
    documentNo: "01a",
    date: "1989-01-30",
    title: "Blackwill to Scowcroft, Secretary Baker's Letter to Shevardnadze",
    participants: ["Robert D. Blackwill", "Brent Scowcroft", "James A. Baker III", "Eduard Shevardnadze"],
    countries: ["United States", "Soviet Union"],
    pageEvidence: "Withdrawal sheet page 2; open OCR pages 5-9",
    subjectLine: "Opening Bush administration message framing continuity, review, and the comprehensive U.S.-Soviet agenda for Baker-Shevardnadze contact.",
    topics: ["Baker-Shevardnadze", "U.S.-Soviet agenda", "Policy review", "Blackwill"],
    extractionStatus: "Withdrawal sheet and open OCR pages identify the Blackwill cover memorandum and draft Baker letter."
  },
  {
    folderNaid: "366551738",
    documentNo: "03a",
    date: "1989-02-14",
    title: "Rice to Scowcroft, Cable from Ambassador Matlock",
    participants: ["Condoleezza Rice", "Brent Scowcroft", "Jack F. Matlock"],
    countries: ["United States", "Soviet Union"],
    pageEvidence: "Withdrawal sheet page 2",
    subjectLine: "Rice memorandum transmitting or commenting on Matlock reporting from Moscow during the opening Soviet policy review.",
    topics: ["Rice", "Matlock", "Moscow Embassy", "Policy review"]
  },
  {
    folderNaid: "366551738",
    documentNo: "05",
    date: "1989-02-16",
    title: "Blackwill to Scowcroft, Work Program for NSRs 3, 4, and 5",
    documentTitle: "Robert D. Blackwill to Brent Scowcroft, Work Program for NSRs 3, 4, and 5 on U.S.-Soviet, U.S.-East European, and U.S.-West European Relations",
    participants: ["Robert D. Blackwill", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union", "Eastern Europe", "Western Europe"],
    pageEvidence: "Withdrawal sheet page 3",
    subjectLine: "Work program for the linked national security reviews that structured early Bush policy toward the Soviet Union and Europe.",
    topics: ["NSR-3", "NSR-4", "NSR-5", "Policy review", "Europe"]
  },
  {
    folderNaid: "366551738",
    documentNo: "06a",
    date: "1989-02-16",
    title: "Rice to Scowcroft, Meeting with Ambassador Dubinin",
    participants: ["Condoleezza Rice", "Brent Scowcroft", "Yuri Dubinin"],
    countries: ["United States", "Soviet Union"],
    pageEvidence: "Withdrawal sheet page 3",
    subjectLine: "Rice memorandum preparing Scowcroft for a meeting with Soviet Ambassador Yuri Dubinin.",
    topics: ["Rice", "Scowcroft", "Dubinin", "Soviet Embassy"]
  },
  {
    folderNaid: "366551738",
    documentNo: "07a",
    date: "1989-02-27",
    title: "Leach and Rice to Scowcroft, Handling the No-Expectations Policy",
    participants: ["James Leach", "Condoleezza Rice", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union", "United Kingdom"],
    pageEvidence: "Withdrawal sheet page 3",
    subjectLine: "Leach-Rice memorandum on managing the administration's no-expectations posture toward Moscow.",
    topics: ["No-expectations policy", "Rice", "Leach", "Soviet strategy"]
  },
  {
    folderNaid: "366551738",
    documentNo: "08",
    date: "1989-03-01",
    title: "Scowcroft to Bush, Getting Ahead of Gorbachev",
    participants: ["Brent Scowcroft", "George H. W. Bush"],
    countries: ["United States", "Soviet Union"],
    pageEvidence: "Withdrawal sheet page 3",
    subjectLine: "Formal NARA Scowcroft-folder source for Scowcroft's major early strategy memorandum to Bush on Gorbachev and U.S.-Soviet policy.",
    topics: ["Getting Ahead of Gorbachev", "Scowcroft", "Bush", "Soviet strategy"],
    extractionStatus: "Document already appeared as a Drive source copy; this record preserves the formal NARA Scowcroft file-unit source."
  },
  {
    folderNaid: "366551738",
    documentNo: "09",
    date: "1989-03-02",
    title: "Rice to Scowcroft, Your Meeting with Jack Matlock",
    participants: ["Condoleezza Rice", "Brent Scowcroft", "Jack F. Matlock"],
    countries: ["United States", "Soviet Union"],
    pageEvidence: "Withdrawal sheet page 3",
    subjectLine: "Rice memorandum for Scowcroft's March 3 meeting with Ambassador Matlock.",
    topics: ["Rice", "Matlock", "Moscow Embassy", "Soviet policy"]
  },
  {
    folderNaid: "366551738",
    documentNo: "11a",
    date: "1989-04-08",
    title: "Rice to Scowcroft, President's Message to Gorbachev on the Mike-class Submarine Accident",
    participants: ["Condoleezza Rice", "Brent Scowcroft", "George H. W. Bush", "Mikhail Gorbachev"],
    countries: ["United States", "Soviet Union"],
    type: "Presidential Message Lead",
    pageEvidence: "Withdrawal sheet page 4",
    subjectLine: "Rice memorandum on a presidential message to Gorbachev after the Soviet Mike-class submarine accident.",
    topics: ["Bush-Gorbachev correspondence", "Mike-class submarine", "Rice", "Crisis diplomacy"]
  },
  {
    folderNaid: "366551738",
    documentNo: "12",
    date: "1989-04-26",
    title: "Stearman to Scowcroft, Soviets Still Exporting Revolution in Southern Africa",
    participants: ["William L. Stearman", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union", "Southern Africa"],
    pageEvidence: "Withdrawal sheet page 4",
    subjectLine: "Stearman memorandum on Soviet regional behavior in Southern Africa before the administration settled its public Soviet-policy line.",
    topics: ["Regional conflicts", "Southern Africa", "Soviet foreign policy", "Stearman"]
  },
  {
    folderNaid: "366551739",
    documentNo: "01a",
    date: "1989-05-02",
    title: "Hughes to Scowcroft, B-C-S Breakfast Meeting",
    participants: ["G. Philip Hughes", "Brent Scowcroft", "James A. Baker III", "Richard Cheney"],
    countries: ["United States", "Soviet Union"],
    type: "Meeting Package",
    pageEvidence: "Withdrawal sheet page 1; open OCR page 5",
    subjectLine: "Baker-Cheney-Scowcroft breakfast agenda on Moscow ministerial preparation, arms-control negotiators, the Soviet NSD, and Gomel radar.",
    topics: ["Baker-Cheney-Scowcroft", "Moscow ministerial", "Soviet NSD", "Arms control"],
    extractionStatus: "Full-folder OCR identified both the withdrawal-sheet title and the opening agenda memorandum."
  },
  {
    folderNaid: "366551739",
    documentNo: "01b",
    date: "1989-05-02",
    title: "Rice to Scowcroft, Breakfast Item: Secretary Baker's Trip to Moscow",
    participants: ["Condoleezza Rice", "Brent Scowcroft", "James A. Baker III"],
    countries: ["United States", "Soviet Union"],
    pageEvidence: "Withdrawal sheet page 1; open OCR pages around memorandum start",
    subjectLine: "Rice memorandum on Baker's Moscow trip, including arms-control agenda handling and presentation of U.S. objectives.",
    topics: ["Rice", "Baker Moscow trip", "START", "U.S.-Soviet agenda"]
  },
  {
    folderNaid: "366551739",
    documentNo: "01c",
    date: "1989-04-29",
    title: "Brooks to Scowcroft, Arms Control Negotiators",
    participants: ["Linton Brooks", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union"],
    pageEvidence: "Withdrawal sheet page 1; open OCR pages around memorandum start",
    subjectLine: "Brooks memorandum on selecting arms-control negotiators as START and related talks resumed.",
    topics: ["Arms control negotiators", "START", "Brooks", "Policy implementation"]
  },
  {
    folderNaid: "366551739",
    documentNo: "01d",
    date: "1989-05-02",
    sortOrder: 1,
    title: "Scowcroft to Bush, Military Involvement in START",
    participants: ["Brent Scowcroft", "George H. W. Bush"],
    countries: ["United States", "Soviet Union"],
    pageEvidence: "Withdrawal sheet page 1; open OCR pages around presidential memorandum",
    dateLine: "Undated, filed with May 2, 1989 breakfast package",
    subjectLine: "Scowcroft memorandum to Bush on senior military participation in START negotiations.",
    topics: ["START", "Military representation", "Scowcroft", "Bush"]
  },
  {
    folderNaid: "366551739",
    documentNo: "01g",
    date: "1989-05-01",
    title: "Rice to Scowcroft, Soviet NSD",
    participants: ["Condoleezza Rice", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union"],
    pageEvidence: "Withdrawal sheet page 1; open OCR pages around Soviet NSD memorandum",
    subjectLine: "Rice memorandum forwarding the revised draft National Security Directive on U.S.-Soviet relations.",
    topics: ["Rice", "Soviet NSD", "NSD-23", "U.S.-Soviet policy"]
  },
  {
    folderNaid: "366551739",
    documentNo: "01h",
    date: "1989-05-01",
    sortOrder: 1,
    title: "Draft National Security Directive on U.S.-Soviet Relations",
    participants: ["National Security Council", "George H. W. Bush"],
    countries: ["United States", "Soviet Union"],
    type: "Directive Draft",
    pageEvidence: "Withdrawal sheet page 1; open OCR pages beginning with 'National Security Directive on U.S.-Soviet Relations'",
    dateLine: "Undated, filed with May 1, 1989 Rice memorandum",
    subjectLine: "Draft directive setting the Bush administration's strategic framework for transforming Soviet behavior, institutions, force posture, and integration into the international system.",
    topics: ["NSD-23", "U.S.-Soviet relations", "Soviet reform", "Arms control", "Economic policy"],
    extractionStatus: "Full-folder OCR captured substantial text of the draft directive; page-span review needed before quotation or selection."
  },
  {
    folderNaid: "366551739",
    documentNo: "01i",
    date: "1989-05-02",
    sortOrder: 2,
    title: "Tobey to Scowcroft, Possible Breakfast Item: Gomel Radar",
    participants: ["William Tobey", "Brent Scowcroft", "Robert Gates"],
    countries: ["United States", "Soviet Union"],
    pageEvidence: "Withdrawal sheet page 1; open OCR pages around memorandum start",
    subjectLine: "Tobey memorandum on U.S. response to Soviet actions concerning the Gomel radar issue.",
    topics: ["Gomel radar", "Soviet compliance", "Arms control", "Tobey"]
  },
  {
    folderNaid: "366551739",
    documentNo: "02a",
    date: "1989-05-03",
    title: "Rodman to Gates, Regional Issues at the Moscow Ministerial",
    participants: ["Peter W. Rodman", "Robert Gates"],
    countries: ["United States", "Soviet Union", "Afghanistan", "Central America", "Middle East", "Southern Africa"],
    pageEvidence: "Withdrawal sheet page 2; open OCR pages around memorandum start",
    subjectLine: "Rodman memorandum on regional issues for the Moscow ministerial, including Central America, Afghanistan, the Middle East, and Southern Africa.",
    topics: ["Moscow ministerial", "Regional conflicts", "Rodman", "Gates"]
  },
  {
    folderNaid: "366551739",
    documentNo: "03c",
    date: "1989-05-06",
    title: "Rice to Scowcroft, President's Letter to Gorbachev",
    participants: ["Condoleezza Rice", "Brent Scowcroft", "George H. W. Bush", "Mikhail Gorbachev"],
    countries: ["United States", "Soviet Union"],
    type: "Presidential Message Lead",
    pageEvidence: "Withdrawal sheet page 2; open OCR pages around NSC profile and letter package",
    subjectLine: "Rice memorandum forwarding the President's letter to Gorbachev for delivery by Secretary Baker.",
    topics: ["Bush-Gorbachev correspondence", "Baker Moscow trip", "Rice", "Presidential message"]
  },
  {
    folderNaid: "366551739",
    documentNo: "04a",
    date: "1989-05-09",
    title: "Blackwill to Scowcroft, Presidential Speeches Related to Europe Trip",
    documentTitle: "Blackwill to Scowcroft, Your May 9 Meeting with the President on Speeches Related to His Trip to Europe",
    participants: ["Robert D. Blackwill", "Brent Scowcroft", "George H. W. Bush"],
    countries: ["United States", "Soviet Union", "Europe"],
    pageEvidence: "Withdrawal sheet page 3; open OCR pages around memorandum start",
    subjectLine: "Blackwill memorandum on presidential speeches framing U.S.-Soviet relations, NATO, Eastern Europe, and the coming Europe trip.",
    topics: ["Presidential speeches", "NATO", "Eastern Europe", "Blackwill", "U.S.-Soviet relations"]
  },
  {
    folderNaid: "366551739",
    documentNo: "04b",
    date: "1989-05-08",
    title: "Brooks to Scowcroft, Open Skies",
    participants: ["Linton Brooks", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union", "NATO"],
    pageEvidence: "Withdrawal sheet page 3; open OCR pages around memorandum start",
    subjectLine: "Brooks memorandum on the Open Skies initiative and the need for allied/Soviet handling before public announcement.",
    topics: ["Open Skies", "NATO", "Soviet Union", "Arms control"]
  },
  {
    folderNaid: "366551739",
    documentNo: "05a",
    date: "1989-05-09",
    sortOrder: 1,
    title: "Scowcroft to Cheney, U.S.-Soviet Dangerous Military Activity Agreement",
    participants: ["Brent Scowcroft", "Richard Cheney"],
    countries: ["United States", "Soviet Union"],
    type: "Policy Memorandum",
    pageEvidence: "Withdrawal sheet page 3; open OCR pages around memorandum start",
    subjectLine: "Scowcroft memorandum to Cheney on concluding the U.S.-Soviet Dangerous Military Activity Agreement.",
    topics: ["Dangerous Military Activity Agreement", "Defense policy", "U.S.-Soviet relations"]
  },
  {
    folderNaid: "366551745",
    documentNo: "01a",
    date: "1989-12-05",
    title: "Hutchings to Scowcroft, European Press Reaction to the Future of Europe Speech",
    participants: ["Robert L. Hutchings", "Brent Scowcroft", "George H. W. Bush"],
    countries: ["United States", "Soviet Union", "Europe", "Germany"],
    pageEvidence: "Withdrawal sheet page 2; open OCR pages 5-6",
    subjectLine: "Post-Malta memorandum on European reaction to Bush's speech on the future of Europe and Germany.",
    topics: ["Malta follow-up", "Future of Europe speech", "Germany", "Hutchings"]
  },
  {
    folderNaid: "366551745",
    documentNo: "02a",
    date: "1989-12-06",
    title: "Scowcroft to McClure, Talking Points for Congressional Meeting",
    participants: ["Brent Scowcroft", "Frederick D. McClure", "George H. W. Bush", "Congressional leaders"],
    countries: ["United States", "Soviet Union", "Europe"],
    type: "Talking Points Lead",
    pageEvidence: "Withdrawal sheet page 2",
    subjectLine: "Scowcroft transmittal of Malta/Brussels trip talking points for congressional consultation.",
    topics: ["Malta", "Brussels", "Congressional leadership", "Talking points"]
  },
  {
    folderNaid: "366551748",
    documentNo: "01a",
    date: "1990-04-10",
    title: "Meeting with Baltic American Leaders",
    participants: ["George H. W. Bush", "Brent Scowcroft", "Baltic American leaders"],
    countries: ["United States", "Soviet Union", "Lithuania", "Estonia", "Latvia"],
    type: "Meeting Brief",
    pageEvidence: "Withdrawal sheet page 2; open OCR pages 5-7",
    subjectLine: "Meeting brief for Bush's April 11 meeting with Baltic American leaders on Lithuanian independence, quiet diplomacy, and pressure from Moscow.",
    topics: ["Lithuania", "Baltic states", "Quiet diplomacy", "Gorbachev"]
  },
  {
    folderNaid: "366551748",
    documentNo: "02",
    date: "1990-04-19",
    title: "Hayden and Rice to Scowcroft, Upcoming U.S.-Soviet Military-to-Military Contacts",
    participants: ["Michael Hayden", "Condoleezza Rice", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union"],
    pageEvidence: "Withdrawal sheet page 2",
    subjectLine: "Hayden-Rice memorandum on military-to-military contacts as Lithuania and summit planning complicated U.S.-Soviet engagement.",
    topics: ["Military-to-military contacts", "Rice", "Hayden", "U.S.-Soviet relations"]
  },
  {
    folderNaid: "366551748",
    documentNo: "04",
    date: "1990-04-24",
    title: "Rostow to Scowcroft, Lithuania and the International Court of Justice",
    participants: ["Nicholas Rostow", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union", "Lithuania"],
    pageEvidence: "Withdrawal sheet page 3",
    subjectLine: "Rostow memorandum on possible International Court of Justice dimensions of the Lithuanian crisis.",
    topics: ["Lithuania", "International Court of Justice", "Rostow", "Baltic policy"]
  },
  {
    folderNaid: "366551748",
    documentNo: "07a",
    date: "1990-04-26",
    title: "Rice to Scowcroft, Letter to Landsbergis",
    participants: ["Condoleezza Rice", "Brent Scowcroft", "Vytautas Landsbergis", "George H. W. Bush"],
    countries: ["United States", "Soviet Union", "Lithuania"],
    type: "Presidential Message Lead",
    pageEvidence: "Withdrawal sheet page 3",
    subjectLine: "Rice memorandum on a proposed presidential letter to Lithuanian President Vytautas Landsbergis.",
    topics: ["Lithuania", "Landsbergis", "Rice", "Presidential message"]
  },
  {
    folderNaid: "366551748",
    documentNo: "08e",
    date: "1990-05-02",
    title: "Hutchings to Scowcroft, President's Meeting with Lithuanian Prime Minister Prunskiene",
    participants: ["Robert L. Hutchings", "Brent Scowcroft", "George H. W. Bush", "Kazimiera Prunskiene"],
    countries: ["United States", "Soviet Union", "Lithuania"],
    type: "Meeting Brief",
    pageEvidence: "Withdrawal sheet page 4",
    subjectLine: "Briefing memorandum for Bush's meeting with Lithuanian Prime Minister Kazimiera Prunskiene.",
    topics: ["Lithuania", "Prunskiene", "Meeting brief", "Baltic policy"]
  },
  {
    folderNaid: "366551759",
    documentNo: "01",
    date: "1990-12-07",
    title: "Baker to Bush, U.S. Economic Support-Assistance for the Soviet Union",
    participants: ["James A. Baker III", "George H. W. Bush"],
    countries: ["United States", "Soviet Union"],
    pageEvidence: "Withdrawal sheet page 2; open OCR pages 6-10",
    subjectLine: "Baker memorandum to Bush on humanitarian assistance, food aid, Jackson-Vanik, IMF/World Bank, and a broader economic assistance package for the Soviet Union.",
    topics: ["Economic assistance", "Jackson-Vanik", "Food aid", "IMF", "Baker"],
    extractionStatus: "OCR sampled open memorandum pages; exact full page span should be captured before selection."
  },
  {
    folderNaid: "366551759",
    documentNo: "02",
    date: "1990-12-07",
    sortOrder: 1,
    title: "Gompert et al. to Scowcroft, Soviet Summit Timing",
    participants: ["David C. Gompert", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union"],
    pageEvidence: "Withdrawal sheet page 2",
    subjectLine: "Gompert memorandum to Scowcroft on timing a Soviet summit amid economic and political instability.",
    topics: ["Soviet summit", "Gompert", "Gorbachev", "Economic crisis"]
  },
  {
    folderNaid: "366551759",
    documentNo: "04a",
    date: "1990-12-10",
    title: "Burns to Scowcroft, Your Meeting with Ukrainian Prime Minister Vitold Fokin",
    participants: ["Nicholas Burns", "Brent Scowcroft", "Vitold Fokin"],
    countries: ["United States", "Soviet Union", "Ukraine"],
    type: "Meeting Brief",
    pageEvidence: "Withdrawal sheet page 2",
    subjectLine: "Briefing memorandum for Scowcroft's meeting with Ukrainian Prime Minister Vitold Fokin.",
    topics: ["Ukraine", "Fokin", "Republics policy", "Meeting brief"]
  },
  {
    folderNaid: "366551759",
    documentNo: "05a",
    date: "1990-12-11",
    title: "Meeting with Soviet Foreign Minister Eduard Shevardnadze",
    participants: ["George H. W. Bush", "Eduard Shevardnadze", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union"],
    type: "Meeting Brief",
    pageEvidence: "Withdrawal sheet page 3",
    subjectLine: "Meeting brief and talking points for the President's meeting with Shevardnadze in December 1990.",
    topics: ["Shevardnadze", "Gorbachev", "Economic assistance", "Soviet crisis"]
  },
  {
    folderNaid: "366551759",
    documentNo: "06",
    date: "1990-12-12",
    title: "Burns to Scowcroft, Press Releases on Economic Assistance for the Soviet Union",
    participants: ["Nicholas Burns", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union"],
    pageEvidence: "Withdrawal sheet page 4",
    subjectLine: "Burns memorandum on public handling of economic assistance for the Soviet Union.",
    topics: ["Economic assistance", "Press guidance", "Burns", "Soviet Union"]
  },
  {
    folderNaid: "366551759",
    documentNo: "07",
    date: "1990-12-17",
    title: "Rice and Deal to Scowcroft, IMF/World Bank Report on the Soviet Economy",
    participants: ["Condoleezza Rice", "Timothy Deal", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union"],
    pageEvidence: "Withdrawal sheet page 4",
    subjectLine: "Rice-Deal memorandum on the IMF/World Bank-led report on the Soviet economy.",
    topics: ["IMF", "World Bank", "Soviet economy", "Rice"]
  },
  {
    folderNaid: "366551759",
    documentNo: "08a",
    date: "1990-12-18",
    title: "Rice to Gates, Senior Small Group Meeting on Soviet Contingencies",
    participants: ["Condoleezza Rice", "Robert Gates"],
    countries: ["United States", "Soviet Union", "Russia", "Ukraine", "Baltic States"],
    type: "Contingency Paper",
    pageEvidence: "Withdrawal sheet page 4",
    subjectLine: "Rice memorandum for a senior small group meeting on Soviet contingencies as the center, republics, and hardliners moved toward confrontation.",
    topics: ["Soviet contingencies", "Rice", "Gates", "Republics policy", "Crisis planning"]
  },
  {
    folderNaid: "366551759",
    documentNo: "08b",
    date: "1990-12-18",
    sortOrder: 1,
    title: "The Soviet Republics: Independence Claims, Legal Issues and U.S. Policy",
    participants: ["National Security Council staff"],
    countries: ["United States", "Soviet Union", "Russia", "Ukraine", "Baltic States"],
    type: "Policy Paper",
    pageEvidence: "Withdrawal sheet page 4",
    dateLine: "Undated, filed with December 18, 1990 Senior Small Group material",
    subjectLine: "Policy paper on Soviet republic independence claims, legal issues, and implications for U.S. policy.",
    topics: ["Republics policy", "Independence claims", "Legal issues", "Soviet collapse"]
  },
  {
    folderNaid: "366551759",
    documentNo: "08e",
    date: "1990-12-18",
    sortOrder: 2,
    title: "What Do We Do If There's A Crackdown?",
    participants: ["National Security Council staff"],
    countries: ["United States", "Soviet Union", "Russia", "Baltic States"],
    type: "Contingency Paper",
    pageEvidence: "Withdrawal sheet page 5",
    dateLine: "Undated, filed with December 1990 Soviet contingency material",
    subjectLine: "Contingency paper on U.S. responses if Soviet authorities used a crackdown during the republic crisis.",
    topics: ["Soviet crackdown", "Contingency planning", "Baltic states", "Republics policy"]
  },
  {
    folderNaid: "366551759",
    documentNo: "10a",
    date: "1990-12-21",
    title: "Scowcroft to Bush, Responding to the Toughening Line in Moscow",
    participants: ["Brent Scowcroft", "George H. W. Bush"],
    countries: ["United States", "Soviet Union", "Russia", "Baltic States"],
    pageEvidence: "Withdrawal sheet page 5",
    subjectLine: "Scowcroft memorandum to Bush on how to respond to the hardening line in Moscow.",
    topics: ["Hardliners", "Moscow", "Soviet crisis", "Scowcroft"]
  },
  {
    folderNaid: "366551759",
    documentNo: "10b",
    date: "1990-12-21",
    sortOrder: 1,
    title: "Rice to Scowcroft, Responding to the Toughening Line in Moscow",
    participants: ["Condoleezza Rice", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union", "Russia", "Baltic States"],
    pageEvidence: "Withdrawal sheet page 5",
    subjectLine: "Rice memorandum to Scowcroft on U.S. policy options as Moscow's line toughened.",
    topics: ["Rice", "Hardliners", "Moscow", "Soviet crisis"]
  },
  {
    folderNaid: "366551761",
    documentNo: "01a",
    date: "1991-03-07",
    title: "Scowcroft to Bush, Coping with the Soviet Union's Internal Turmoil",
    participants: ["Brent Scowcroft", "George H. W. Bush"],
    countries: ["United States", "Soviet Union", "Russia", "Baltic States"],
    chapterKey: "collapse",
    pageEvidence: "Withdrawal sheet page 2; NSC profile page 6; open OCR page 10",
    subjectLine: "Scowcroft memorandum to Bush describing the Soviet Union as being in a pre-revolutionary state and assessing possible triggers for wider crisis.",
    topics: ["Soviet turmoil", "Pre-revolutionary state", "Scowcroft", "Gorbachev", "Yeltsin"],
    extractionStatus: "OCR sampled the NSC profile and opening page of the memorandum; full page-span review remains."
  },
  {
    folderNaid: "366551761",
    documentNo: "01b",
    date: "1991-03-07",
    sortOrder: 1,
    title: "Rice to Scowcroft, Coping with the Soviet Union's Internal Turmoil",
    participants: ["Condoleezza Rice", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union", "Russia", "Baltic States"],
    chapterKey: "collapse",
    pageEvidence: "Withdrawal sheet page 2",
    dateLine: "Undated, filed with March 7, 1991 Scowcroft memorandum",
    subjectLine: "Rice memorandum forwarding or framing Scowcroft's memorandum to Bush on internal Soviet turmoil.",
    topics: ["Rice", "Soviet turmoil", "Gorbachev", "Yeltsin"]
  },
  {
    folderNaid: "366551761",
    documentNo: "03",
    date: "1991-04-09",
    title: "Hewett to Scowcroft and Gates, Highlights on the Current Soviet Situation",
    participants: ["Edward A. Hewett", "Brent Scowcroft", "Robert Gates"],
    countries: ["United States", "Soviet Union", "Russia", "Ukraine", "Baltic States"],
    chapterKey: "collapse",
    pageEvidence: "Withdrawal sheet page 3",
    subjectLine: "Hewett memorandum on the current Soviet situation during the spring 1991 crisis period.",
    topics: ["Hewett", "Current Soviet situation", "Gates", "Republics policy"]
  },
  {
    folderNaid: "366551761",
    documentNo: "05a",
    date: "1991-04-19",
    title: "Burns to Scowcroft, Meeting with Russian Republic Prime Minister Ivan Silayev",
    participants: ["Nicholas Burns", "Brent Scowcroft", "Ivan Silayev"],
    countries: ["United States", "Soviet Union", "Russia"],
    chapterKey: "collapse",
    type: "Meeting Brief",
    pageEvidence: "Withdrawal sheet page 3",
    subjectLine: "Briefing memorandum for Scowcroft's meeting with Russian Republic Prime Minister Ivan Silayev.",
    topics: ["Russia", "Silayev", "Republics policy", "Meeting brief"]
  },
  {
    folderNaid: "366551761",
    documentNo: "06",
    date: "1991-04-29",
    title: "Gompert and Kanter to Scowcroft, Dealing with the Soviets on CFE and BW",
    participants: ["David C. Gompert", "Arnold Kanter", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union"],
    pageEvidence: "Withdrawal sheet page 3",
    subjectLine: "Gompert-Kanter memorandum on dealing with the Soviets on CFE and biological weapons.",
    topics: ["CFE", "Biological weapons", "Gompert", "Kanter", "Arms control"]
  },
  {
    folderNaid: "366551761",
    documentNo: "07a",
    date: "1991-04-30",
    title: "Scowcroft to Bush, Proposed Presidential Letter to Gorbachev on Additional CCC Credits",
    participants: ["Brent Scowcroft", "George H. W. Bush", "Mikhail Gorbachev"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "collapse",
    type: "Presidential Message Lead",
    pageEvidence: "Withdrawal sheet page 4",
    subjectLine: "Scowcroft memorandum to Bush on a proposed letter to Gorbachev responding to his request for additional CCC credits.",
    topics: ["CCC credits", "Bush-Gorbachev correspondence", "Economic assistance", "Soviet crisis"]
  },
  {
    folderNaid: "366551761",
    documentNo: "08a",
    date: "1991-05-01",
    title: "Gompert and Kanter to Scowcroft, Response to the Soviets on CFE",
    participants: ["David C. Gompert", "Arnold Kanter", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union"],
    pageEvidence: "Withdrawal sheet page 4",
    subjectLine: "Gompert-Kanter memorandum on a response to the Soviets on CFE.",
    topics: ["CFE", "Gompert", "Kanter", "Arms control"]
  },
  {
    folderNaid: "366551859",
    documentNo: "01b",
    date: "1991-08-28",
    title: "Help for the Soviet Union",
    participants: ["Nicholas Brady", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union", "Russia", "Soviet Republics"],
    chapterKey: "collapse",
    type: "Policy Outline",
    pageEvidence: "Withdrawal sheet page 2; open OCR pages 8-10",
    subjectLine: "Post-coup outline linking assistance to reform, direct aid to republics, defense-spending reductions, food credits, distribution, technical assistance, and IMF association.",
    topics: ["Soviet assistance", "Republics", "Economic reform", "Food aid", "IMF"],
    extractionStatus: "OCR sampled the Brady cover sheet and open outline text."
  },
  {
    folderNaid: "366551859",
    documentNo: "03",
    date: "1991-08-27",
    title: "Checklist for DC Meeting on Soviet Humanitarian Options",
    participants: ["Deputies Committee", "National Security Council staff"],
    countries: ["United States", "Soviet Union", "Soviet Republics"],
    chapterKey: "collapse",
    type: "Meeting Checklist",
    pageEvidence: "Withdrawal sheet page 2",
    dateLine: "Undated, filed with August 27-28, 1991 coup-aftermath assistance material",
    subjectLine: "Checklist for a Deputies Committee meeting on humanitarian options after the Soviet coup.",
    topics: ["Humanitarian assistance", "Deputies Committee", "Soviet coup aftermath", "Food aid"]
  },
  {
    folderNaid: "366551859",
    documentNo: "05",
    date: "1991-08-28",
    sortOrder: 1,
    title: "Guidance on Economic Assistance",
    participants: ["National Security Council staff"],
    countries: ["United States", "Soviet Union", "Soviet Republics"],
    chapterKey: "collapse",
    type: "Policy Guidance",
    pageEvidence: "Withdrawal sheet page 2",
    dateLine: "Undated, filed with August 28, 1991 coup-aftermath assistance material",
    subjectLine: "Guidance on economic assistance after the failed Soviet coup.",
    topics: ["Economic assistance", "Soviet coup aftermath", "Republics", "Policy guidance"]
  },
  {
    folderNaid: "366551859",
    documentNo: "12",
    date: "1991-08-22",
    title: "Paper, Soviet Coup",
    participants: ["National Security Council staff"],
    countries: ["United States", "Soviet Union", "Russia"],
    chapterKey: "collapse",
    type: "Policy Paper",
    pageEvidence: "Withdrawal sheet page 3",
    subjectLine: "Eleven-page policy paper on the Soviet coup, filed in Scowcroft's Special Separate USSR Notes/Yeltsin Files.",
    topics: ["Soviet coup", "Yeltsin", "Gorbachev", "Crisis management"]
  },
  {
    folderNaid: "366551859",
    documentNo: "15b",
    date: "1991-08-20",
    title: "Memo for Deputies, Working Group",
    participants: ["Deputies Committee", "National Security Council staff"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "collapse",
    type: "Deputies Committee Memo",
    pageEvidence: "Withdrawal sheet page 4",
    subjectLine: "Deputies working-group memo from the first days of the August 1991 Soviet coup.",
    topics: ["Soviet coup", "Deputies Committee", "Working group", "Crisis response"]
  },
  {
    folderNaid: "366551859",
    documentNo: "15g",
    date: "1991-08-20",
    sortOrder: 1,
    title: "Issues for Deputies' Discussion and Decision",
    participants: ["Deputies Committee", "National Security Council staff"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "collapse",
    type: "Decision Paper",
    pageEvidence: "Withdrawal sheet page 4",
    dateLine: "Undated, filed with August 20, 1991 Deputies working-group material",
    subjectLine: "Decision paper identifying issues for Deputies during the August 1991 Soviet coup.",
    topics: ["Soviet coup", "Deputies Committee", "Crisis response", "Decision paper"]
  },
  {
    folderNaid: "366551859",
    documentNo: "15i",
    date: "1991-08-20",
    sortOrder: 2,
    title: "Gompert to Scowcroft, Statement",
    participants: ["David C. Gompert", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "collapse",
    pageEvidence: "Withdrawal sheet page 5",
    subjectLine: "Gompert memorandum to Scowcroft on a public statement during the Soviet coup.",
    topics: ["Soviet coup", "Gompert", "Public statement", "Crisis response"]
  },
  {
    folderNaid: "366551859",
    documentNo: "16",
    date: "1991-08-19",
    title: "Report, Recommendations",
    participants: ["National Security Council staff"],
    countries: ["United States", "Soviet Union", "Russia"],
    chapterKey: "collapse",
    type: "Recommendations Paper",
    pageEvidence: "Withdrawal sheet page 5",
    subjectLine: "Recommendations paper from the first day of the Soviet coup.",
    topics: ["Soviet coup", "Recommendations", "Crisis response", "Yeltsin"]
  },
  {
    folderNaid: "366551859",
    documentNo: "19a",
    date: "1991-08-19",
    sortOrder: 1,
    title: "Cable, Guidance",
    participants: ["White House", "State Department"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "collapse",
    type: "Cable",
    pageEvidence: "Withdrawal sheet page 5",
    subjectLine: "Guidance cable on U.S. handling of the Soviet coup.",
    topics: ["Soviet coup", "Guidance cable", "Crisis response"]
  },
  {
    folderNaid: "366551859",
    documentNo: "22",
    date: "1991-08-19",
    sortOrder: 2,
    title: "Yanayev to Bush, Unofficial Translation",
    participants: ["Gennady Yanayev", "George H. W. Bush"],
    countries: ["Soviet Union", "United States"],
    chapterKey: "collapse",
    type: "Letter",
    pageEvidence: "Withdrawal sheet page 5",
    dateLine: "Undated, filed with August 19, 1991 coup material",
    subjectLine: "Unofficial translation of Yanayev's letter to Bush during the Soviet coup.",
    topics: ["Soviet coup", "Yanayev", "Bush", "Presidential correspondence"]
  },
  {
    folderNaid: "366551845",
    documentNo: "02b",
    date: "1991-08-28",
    title: "Collins to Scowcroft, Letter from Bush on the Baltics",
    participants: ["James Collins", "Brent Scowcroft", "George H. W. Bush"],
    countries: ["United States", "Soviet Union", "Baltic States"],
    chapterKey: "collapse",
    type: "Cable",
    pageEvidence: "Withdrawal sheet page 2; OCR page 10 message form",
    subjectLine: "Collins cable to Scowcroft concerning a Bush letter on the Baltics after the failed coup.",
    topics: ["Baltic states", "Bush correspondence", "Collins", "Post-coup policy"]
  },
  {
    folderNaid: "366551845",
    documentNo: "03d",
    date: "1991-09-26",
    title: "Cable, September 26 Letter from Bush to Gorbachev",
    participants: ["George H. W. Bush", "Mikhail Gorbachev"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "collapse",
    type: "Presidential Message",
    pageEvidence: "Withdrawal sheet page 2",
    subjectLine: "Cable transmitting Bush's September 26 letter to Gorbachev during the post-coup republics and nuclear-control crisis.",
    topics: ["Bush-Gorbachev correspondence", "Post-coup policy", "Republics", "Nuclear control"]
  },
  {
    folderNaid: "366551845",
    documentNo: "04a",
    date: "1991-10-18",
    title: "Gorbachev to Bush, Unofficial Translation",
    participants: ["Mikhail Gorbachev", "George H. W. Bush"],
    countries: ["Soviet Union", "United States"],
    chapterKey: "collapse",
    type: "Letter",
    pageEvidence: "Withdrawal sheet pages 2-3",
    subjectLine: "Gorbachev letter to Bush in October 1991, filed in Scowcroft's Gorbachev sensitive file.",
    topics: ["Gorbachev", "Bush-Gorbachev correspondence", "Soviet collapse"]
  },
  {
    folderNaid: "366551845",
    documentNo: "08",
    date: "1991-10-27",
    title: "Cable, Letter from Bush to Gorbachev",
    participants: ["George H. W. Bush", "Mikhail Gorbachev"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "collapse",
    type: "Presidential Message",
    pageEvidence: "Withdrawal sheet page 3",
    subjectLine: "Cable transmitting a Bush letter to Gorbachev after the failed coup and before formal Soviet dissolution.",
    topics: ["Bush-Gorbachev correspondence", "Soviet collapse", "Post-coup policy"]
  },
  {
    folderNaid: "366551845",
    documentNo: "11",
    date: "1991-11-10",
    title: "Strauss to Scowcroft, Meeting with Gorbachev",
    participants: ["Robert Strauss", "Brent Scowcroft", "Mikhail Gorbachev"],
    countries: ["United States", "Soviet Union", "Russia"],
    chapterKey: "collapse",
    type: "Cable",
    pageEvidence: "Withdrawal sheet page 4",
    subjectLine: "Strauss cable to Scowcroft on his meeting with Gorbachev in November 1991.",
    topics: ["Strauss", "Gorbachev", "Soviet collapse", "Ambassador reporting"]
  },
  {
    folderNaid: "366551845",
    documentNo: "14",
    date: "1991-11-15",
    title: "Report, USSR State Council's Session",
    participants: ["National Security Council staff"],
    countries: ["United States", "Soviet Union", "Russia", "Soviet Republics"],
    chapterKey: "collapse",
    type: "Report",
    pageEvidence: "Withdrawal sheet page 4",
    subjectLine: "Report on the USSR State Council session during the final weeks of the Soviet Union.",
    topics: ["USSR State Council", "Soviet collapse", "Republics policy"]
  },
  {
    folderNaid: "366551845",
    documentNo: "15",
    date: "1991-11-26",
    title: "Yeltsin to Bush, Unofficial Translation",
    participants: ["Boris Yeltsin", "George H. W. Bush"],
    countries: ["Russia", "United States", "Soviet Union"],
    chapterKey: "collapse",
    type: "Letter",
    pageEvidence: "Withdrawal sheet page 4",
    subjectLine: "Yeltsin letter to Bush, filed in the Scowcroft Gorbachev sensitive file during the Soviet dissolution period.",
    topics: ["Yeltsin", "Bush-Yeltsin correspondence", "Russia", "Soviet collapse"]
  },
  {
    folderNaid: "366551845",
    documentNo: "17a",
    date: "1991-12-25",
    title: "Gorbachev to Bush, December 25, 1991 Letter",
    participants: ["Mikhail Gorbachev", "George H. W. Bush"],
    countries: ["Soviet Union", "United States", "Russia"],
    chapterKey: "collapse",
    type: "Letter",
    pageEvidence: "Withdrawal sheet page 5",
    subjectLine: "Gorbachev letter to Bush on the day he resigned as Soviet president.",
    topics: ["Gorbachev resignation", "Soviet dissolution", "Bush-Gorbachev correspondence"]
  },
  {
    folderNaid: "366551845",
    documentNo: "18",
    date: "1991-12-26",
    title: "Collins to Scowcroft and Hewett, No Subject",
    participants: ["James Collins", "Brent Scowcroft", "Edward Hewett"],
    countries: ["United States", "Russia", "Former Soviet Union"],
    chapterKey: "collapse",
    type: "Cable",
    pageEvidence: "Withdrawal sheet page 5",
    subjectLine: "Collins cable to Scowcroft and Hewett immediately after Soviet dissolution.",
    topics: ["Collins", "Soviet dissolution", "Russia", "Post-Soviet transition"]
  },
  {
    folderNaid: "366551851",
    documentNo: "10a",
    date: "1992-03-05",
    title: "Strauss to Scowcroft and Baker, Kozyrev Hints at Walk in the Woods",
    participants: ["Robert Strauss", "Brent Scowcroft", "James A. Baker III", "Andrei Kozyrev"],
    countries: ["United States", "Russia"],
    chapterKey: "collapse",
    type: "Cable",
    pageEvidence: "Withdrawal sheet page 3",
    subjectLine: "Strauss cable on Kozyrev hints about a possible private negotiation track, filed in the Yeltsin 1992 folder.",
    topics: ["Kozyrev", "Strauss", "Russia policy", "Arms control"]
  },
  {
    folderNaid: "366551851",
    documentNo: "14",
    date: "1992-11-20",
    title: "Cable, Message from Bush to Yeltsin",
    participants: ["George H. W. Bush", "Boris Yeltsin"],
    countries: ["United States", "Russia"],
    chapterKey: "collapse",
    type: "Presidential Message",
    pageEvidence: "Withdrawal sheet page 4",
    subjectLine: "Bush message to Yeltsin in the late-1992 START II and transition period.",
    topics: ["Bush-Yeltsin correspondence", "Russia", "START II", "Transition"]
  },
  {
    folderNaid: "366551851",
    documentNo: "06",
    date: "1992-11-29",
    title: "Cable, Message from Bush to Yeltsin",
    participants: ["George H. W. Bush", "Boris Yeltsin"],
    countries: ["United States", "Russia"],
    chapterKey: "collapse",
    type: "Presidential Message",
    pageEvidence: "Withdrawal sheet page 3",
    subjectLine: "Bush message to Yeltsin transmitted by White House cable in late November 1992.",
    topics: ["Bush-Yeltsin correspondence", "Russia", "Transition"]
  },
  {
    folderNaid: "366551851",
    documentNo: "13",
    date: "1992-12-18",
    title: "Cable, Yeltsin December 16 Letter to Bush on START II",
    participants: ["Boris Yeltsin", "George H. W. Bush"],
    countries: ["Russia", "United States"],
    chapterKey: "collapse",
    type: "Cable",
    pageEvidence: "Withdrawal sheet page 4",
    subjectLine: "Cable reporting Yeltsin's December 16 letter to Bush on START II.",
    topics: ["START II", "Yeltsin", "Bush-Yeltsin correspondence", "Arms control"]
  },
  {
    folderNaid: "366551851",
    documentNo: "15",
    date: "1992-12-18",
    sortOrder: 1,
    title: "Cable, Next Steps on Bush-Yeltsin Meeting on START II",
    participants: ["U.S. Embassy Moscow", "White House", "Boris Yeltsin", "George H. W. Bush"],
    countries: ["United States", "Russia"],
    chapterKey: "collapse",
    type: "Cable",
    pageEvidence: "Withdrawal sheet page 4",
    dateLine: "Undated, filed with December 1992 START II messages",
    subjectLine: "Moscow-to-White House cable on next steps for a Bush-Yeltsin meeting on START II.",
    topics: ["START II", "Bush-Yeltsin meeting", "Russia", "Arms control"]
  },
  {
    folderNaid: "366551851",
    documentNo: "01a",
    date: "1993-01-14",
    title: "Poneman and Burns to Scowcroft, Proposed Presidential Message to Yeltsin on HEU Sharing",
    participants: ["Daniel Poneman", "Nicholas Burns", "Brent Scowcroft", "Boris Yeltsin", "George H. W. Bush"],
    countries: ["United States", "Russia", "Ukraine", "Kazakhstan", "Belarus"],
    chapterKey: "collapse",
    pageEvidence: "Withdrawal sheet page 2; open OCR pages 5-9",
    subjectLine: "Transition-period memorandum urging Yeltsin to sign the HEU agreement and settle proceeds-sharing with Ukraine, Kazakhstan, and Belarus to support START/NPT implementation.",
    topics: ["HEU agreement", "Ukraine", "Kazakhstan", "Belarus", "START", "NPT", "Nunn-Lugar"],
    extractionStatus: "Dated January 14, 1993, but still Bush administration transition material; OCR sampled open memorandum and message text."
  }
];

function main() {
  const existing = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
  const harvest = JSON.parse(fs.readFileSync(HARVEST_PATH, "utf8"));
  const folders = new Map(harvest.records.map((record) => [record.naid, record]));
  const built = documents.map((doc) => {
    const folder = folders.get(doc.folderNaid);
    if (!folder) throw new Error(`Missing Scowcroft folder NAID ${doc.folderNaid}`);
    return buildRecord(doc, folder);
  });

  const seen = new Set();
  for (const record of built) {
    if (seen.has(record.id)) throw new Error(`Duplicate generated id ${record.id}`);
    seen.add(record.id);
  }

  const retained = existing.filter((record) => record.seedBatch !== seedBatch);
  const existingIds = new Set(retained.map((record) => record.id));
  const uniqueRecords = built.filter((record) => !existingIds.has(record.id));

  const combined = [...retained, ...uniqueRecords].sort((a, b) => {
    const dateA = a.sortDate || a.date || "";
    const dateB = b.sortDate || b.date || "";
    if (dateA !== dateB) return dateA.localeCompare(dateB);
    const orderA = a.sortOrder || 0;
    const orderB = b.sortOrder || 0;
    if (orderA !== orderB) return orderA - orderB;
    return (a.title || "").localeCompare(b.title || "");
  });

  const byFolder = uniqueRecords.reduce((acc, record) => {
    const key = `${record.localIdentifier} ${record.source.folderTitle}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const byYear = uniqueRecords.reduce((acc, record) => {
    const year = record.date.slice(0, 4);
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {});

  const report = {
    generatedAt: new Date().toISOString(),
    seedBatch,
    sourceCollection: {
      title: "Brent Scowcroft Papers",
      naid: "4522156",
      url: "https://catalog.archives.gov/id/4522156"
    },
    method: [
      "Started from the prior essential NARA harvest of 231 online Scowcroft records.",
      "Downloaded high-value Scowcroft NARA PDFs from the USSR Collapse Files and Special Separate USSR Notes Files.",
      "Ran OCR against the May 1989 folder and sampled first ten pages of additional high-value folders to extract withdrawal-sheet document lists and readable opening pages.",
      "Promoted specific document-level candidates into the Volume IV chronology while preserving file-unit NAID, local identifier, document number, page evidence, and PDF URL."
    ],
    folderNotes,
    selectedRecordCount: uniqueRecords.length,
    skippedAsDuplicateCount: built.length - uniqueRecords.length,
    selectedByYear: byYear,
    selectedByFolder: byFolder,
    selectedDocuments: uniqueRecords.map((record) => ({
      id: record.id,
      date: record.date,
      dateLine: record.dateLine,
      type: record.type,
      title: record.title,
      folderNaid: record.naid,
      localIdentifier: record.localIdentifier,
      documentNo: record.extractionBasis.documentNo,
      pageEvidence: record.extractionBasis.pageEvidence,
      topics: record.topics,
      catalogUrl: record.catalogUrl,
      pdfUrl: record.pdfUrl
    }))
  };

  fs.writeFileSync(DATA_PATH, `${JSON.stringify(combined, null, 2)}\n`);
  fs.writeFileSync(JS_PATH, `window.MEMCONS = ${JSON.stringify(combined, null, 2)};\n`);
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`);

  console.log(`Added ${uniqueRecords.length} Scowcroft NARA document candidates`);
  console.log(`Skipped ${built.length - uniqueRecords.length} duplicates`);
  console.log(`Total records: ${combined.length}`);
}

main();
