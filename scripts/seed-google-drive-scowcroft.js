#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "..", "data", "memcons.json");
const JS_PATH = path.join(__dirname, "..", "data", "memcons.js");
const REPORT_PATH = path.join(__dirname, "..", "reports", "google-drive-scowcroft-seed.json");

const seedBatch = "google-drive-scowcroft-2026-05-21";

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

function formatDate(date) {
  const [year, month, day] = date.split("-").map(Number);
  return `${monthNames[month - 1]} ${day}, ${year}`;
}

function slug(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function record(hit) {
  const chapter = chapters[hit.chapterKey || "archives"];
  const sourceType = hit.gbpl ? "Bush Library source-copy PDF" : "Google Drive PDF";
  const shortName = hit.gbpl ? "GBPL Scowcroft source copy" : "Google Drive Scowcroft PDF";
  const releaseStatus =
    hit.releaseStatus || "Google Drive Scowcroft source-copy hit; reconcile against NARA/Bush Library citation";
  const extractionStatus = hit.extractionStatus;

  return {
    id: `drive-scowcroft-${hit.date}-${slug(hit.title)}`,
    date: hit.date,
    sortDate: hit.sortDate || hit.date,
    sortOrder: hit.sortOrder || 0,
    type: hit.type || (hit.gbpl ? "Source Lead" : "Policy Memorandum"),
    title: hit.title,
    documentTitle: hit.documentTitle || hit.title,
    participants: hit.participants,
    countries: hit.countries,
    chapter,
    releaseStatus,
    catalogUrl: hit.url,
    pdfUrl: hit.url,
    source: {
      type: sourceType,
      title: hit.sourceTitle || hit.title,
      shortName,
      url: hit.url
    },
    dateLine: hit.dateLine || formatDate(hit.date),
    subjectLine: hit.subjectLine,
    sourceNote: `Google Drive Scowcroft sweep, May 21, 2026: ${hit.title}. URL: ${hit.url}.`,
    frusSourceNote:
      "Source copy found in user Google Drive; reconcile against NARA, Bush Library, State Department, or other formal citation before FRUS use.",
    topics: hit.topics,
    potentialFrusDocument: true,
    countStatus: hit.countStatus || "Candidate Volume IV Scowcroft policy/source document",
    nextAction:
      hit.nextAction ||
      "Run the Scowcroft NARA reconciliation pass, verify the exact page span, and capture formal archival citation before selection.",
    ...(extractionStatus ? { extractionStatus } : {}),
    volumeRole: hit.volumeRole || "volume-iv-policy-candidate",
    volumeStatus: "Volume IV research candidate",
    frusVolume: volumeIv,
    seedBatch
  };
}

const hits = [
  {
    date: "1989-01-30",
    title: "890130 Mahley to Scowcroft .pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgOUl1R2xvLVA2UmlsZzFCSWM0YkNmOGM4THRN",
    participants: ["Richard Mahley", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "soviet",
    subjectLine: "Mahley memorandum to Scowcroft from the opening phase of the Bush administration's Soviet policy review.",
    topics: ["Mahley", "Scowcroft", "Policy review", "Soviet Union"]
  },
  {
    date: "1989-02-04",
    title: "890204 Zelikow to Scowcroft .pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgU19xTFM0VzNkU1B2M1NPTHZxUml3RmJ1dFI0",
    participants: ["Philip Zelikow", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "soviet",
    subjectLine: "Zelikow memorandum to Scowcroft during the administration's initial Soviet strategy review.",
    topics: ["Zelikow", "Scowcroft", "Soviet strategy", "NSC staff"]
  },
  {
    date: "1989-02-10",
    title: "890210 Zelikow to Scowcroft .pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgRHktXzQwVWhwZzF5OFdOY0V4b3VlUUVJcUtr",
    participants: ["Philip Zelikow", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "soviet",
    subjectLine: "Follow-on Zelikow memorandum to Scowcroft in the February 1989 Soviet-policy review cycle.",
    topics: ["Zelikow", "Scowcroft", "U.S.-Soviet relations", "Policy review"]
  },
  {
    date: "1989-02-16",
    title: "890216 Blackwill to Scowcroft .pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgTkdONXY4NWo0V29rRlFDcjQtd1F2djRDV3JZ",
    participants: ["Robert Blackwill", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "soviet",
    subjectLine: "Blackwill memorandum to Scowcroft on Soviet and European policy during the early Bush transition.",
    topics: ["Blackwill", "Scowcroft", "Transition", "Soviet policy"]
  },
  {
    date: "1989-02-21",
    title: "890221 Scowcroft and Bahr .pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgSFlKR1ZOeTN4QjZVZTNiV2U4cWNNQ1N5VDEw",
    participants: ["Brent Scowcroft", "Egon Bahr"],
    countries: ["United States", "Soviet Union", "Germany"],
    chapterKey: "soviet",
    type: "Meeting Lead",
    subjectLine: "Scowcroft-Bahr material useful for triangulating Soviet, German, and European policy assumptions.",
    topics: ["Scowcroft", "Bahr", "Germany", "Soviet policy"]
  },
  {
    date: "1989-02-27",
    title: "890227 Leach and Rice to Scowcroft .pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgOVJqODRkVVgtVHNVTGRiNUliaThaeGN4dWJj",
    participants: ["James Leach", "Condoleezza Rice", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "soviet",
    subjectLine: "Leach-Rice memorandum to Scowcroft in the first-year Soviet policy review.",
    topics: ["Rice", "Leach", "Scowcroft", "Soviet policy"]
  },
  {
    date: "1989-03-02",
    title: "890302 Rice to Scowcroft .pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgdWdEZG11ZXctbWxXUlowV3dHS3plbWd5VXVj",
    participants: ["Condoleezza Rice", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "soviet",
    subjectLine: "Rice memorandum to Scowcroft as the NSC framed policy toward Gorbachev and Soviet reform.",
    topics: ["Rice", "Scowcroft", "Gorbachev", "Soviet reform"]
  },
  {
    date: "1989-03-11",
    title: "890311 Zelikow and Mahley to Scowcroft .pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgRksxUmxkVk9DYU9lbkh1Wlp3cURGTUY3MG5V",
    participants: ["Philip Zelikow", "Richard Mahley", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "soviet",
    subjectLine: "Zelikow-Mahley memorandum to Scowcroft on the Soviet policy course under review.",
    topics: ["Zelikow", "Mahley", "Scowcroft", "Policy planning"]
  },
  {
    date: "1989-03-13",
    title: "890313 Zelikow to Scowcroft.pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgYl9TSnVzakpUMDVjYVhFTVgwLTlEeUp3Vk1J",
    participants: ["Philip Zelikow", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "soviet",
    subjectLine: "Zelikow memorandum to Scowcroft from the March 1989 policy-planning sequence.",
    topics: ["Zelikow", "Scowcroft", "Soviet policy", "NSC staff"]
  },
  {
    date: "1989-03-21",
    title: "890321 Zelikow to Scowcroft .pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgWG84R2VueXNVdmpXTkxFNVVhTGplZC1hRmY0",
    participants: ["Philip Zelikow", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "soviet",
    subjectLine: "Zelikow memorandum to Scowcroft during the March 1989 Soviet policy review.",
    topics: ["Zelikow", "Scowcroft", "Policy review", "Soviet Union"]
  },
  {
    date: "1989-03-21",
    sortOrder: 1,
    title: "890321 Snider to Scowcroft .pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgOTVKa21YbDhJTS11QnZEVUJ2aXVXSW1QbmdJ",
    participants: ["Lewis Snider", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "soviet",
    subjectLine: "Snider memorandum to Scowcroft in the early Soviet policy-development period.",
    topics: ["Snider", "Scowcroft", "Soviet policy", "NSC staff"]
  },
  {
    date: "1989-03-28",
    title: "890328 Melby and Lowenkron to Scowcroft .pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgRGhDZ1B2QlNsc3ludGdNQ19uMXRkUm05TzhF",
    participants: ["Eric Melby", "Barry Lowenkron", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union", "Eastern Europe"],
    chapterKey: "soviet",
    subjectLine: "Melby-Lowenkron memorandum to Scowcroft on the Soviet and Eastern Europe policy environment.",
    topics: ["Melby", "Lowenkron", "Eastern Europe", "Soviet policy"]
  },
  {
    date: "1989-04-05",
    title: "890405 Scowcroft to Powell .pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgdVpMd0FhOEJQaFEtaS1tVlNzOExOQjVsYXRZ",
    participants: ["Brent Scowcroft", "Colin Powell"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "soviet",
    subjectLine: "Scowcroft memorandum to Powell in the pre-NSD-23 Soviet policy-planning period.",
    topics: ["Scowcroft", "Powell", "Soviet policy", "White House"]
  },
  {
    date: "1989-04-11",
    title: "890411 Blackwill and Rodman to Scowcroft .pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgMlFxcDNaZ2tpdG9wdWhCYm00YjBKc0VSMExV",
    participants: ["Robert Blackwill", "Peter Rodman", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union", "Eastern Europe"],
    chapterKey: "soviet",
    subjectLine: "Blackwill-Rodman memorandum to Scowcroft on Soviet and Eastern Europe policy questions.",
    topics: ["Blackwill", "Rodman", "Scowcroft", "Eastern Europe"]
  },
  {
    date: "1989-05-09",
    title: "890509 Blackwill to Scowcroft .pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgcWl1bnBsY2dkckpsLW5PLVo4MW5rdTZSaS1n",
    participants: ["Robert Blackwill", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union", "Germany"],
    chapterKey: "soviet",
    subjectLine: "Blackwill memorandum to Scowcroft as Soviet policy, NATO, and German issues converged in spring 1989.",
    topics: ["Blackwill", "Scowcroft", "NATO", "Soviet policy"]
  },
  {
    date: "1989-05-09",
    sortOrder: 1,
    title: "890509 Snider to Scowcroft .pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgX2tDcGFJU1pITTh1emFNX3h1Q19mclNzTXYw",
    participants: ["Lewis Snider", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "soviet",
    subjectLine: "Snider memorandum to Scowcroft during the May 1989 policy-framing period.",
    topics: ["Snider", "Scowcroft", "Policy planning", "Soviet Union"]
  },
  {
    date: "1989-06-21",
    title: "890621 Nixon oped for Scowcroft.pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgcElBN0tnV1RUTmxoTFpzQzRPSXVvRDVjVktn",
    participants: ["Richard Nixon", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "soviet",
    type: "Policy Lead",
    subjectLine: "Nixon op-ed material for Scowcroft as outside Republican advice shaped the administration's Soviet line.",
    topics: ["Nixon", "Scowcroft", "Public diplomacy", "Soviet policy"]
  },
  {
    date: "1989-07-01",
    title: "890701 Scowcroft to Powell .pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgRWVNZlBVQmIyeWRMWWtXTlJGbmhkNHRwNGMw",
    participants: ["Brent Scowcroft", "Colin Powell"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "soviet",
    subjectLine: "Scowcroft memorandum to Powell after the administration set its public Soviet-policy framework.",
    topics: ["Scowcroft", "Powell", "Policy implementation", "Soviet Union"]
  },
  {
    date: "1989-08-07",
    title: "890807 Paal to Scowcroft .pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNganMzV3BLcUl3eGgwVjdyQjdQY3BJbVk5NV9F",
    participants: ["Douglas Paal", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "soviet",
    subjectLine: "Paal memorandum to Scowcroft with Soviet-policy relevance during summer 1989 planning.",
    topics: ["Paal", "Scowcroft", "Soviet policy", "NSC staff"]
  },
  {
    date: "1989-08-09",
    title: "890809 Rice to Scowcroft .pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgcDFGdGkyR0ZFeGRzdjdFNUxrR3hKam1KM3dZ",
    participants: ["Condoleezza Rice", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union", "Eastern Europe"],
    chapterKey: "soviet",
    subjectLine: "Rice memorandum to Scowcroft during the summer 1989 Soviet and Eastern Europe transition.",
    topics: ["Rice", "Scowcroft", "Eastern Europe", "Soviet policy"]
  },
  {
    date: "1989-09-29",
    title: "890929 Rice to Scowcroft .pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgNDJVWS1heTU4NzduRVRENmNkQUZjMnprMWdV",
    participants: ["Condoleezza Rice", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "soviet",
    subjectLine: "Rice memorandum to Scowcroft after NSD-23 and before the Malta summit preparation cycle.",
    topics: ["Rice", "Scowcroft", "NSD-23", "Malta preparation"]
  },
  {
    date: "1989-10-10",
    title: "891010 Scowcroft to Solarz .pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgM3JuazVOR3dod1lnd0VBOVFFSUNEOTliWnlJ",
    participants: ["Brent Scowcroft", "Stephen Solarz"],
    countries: ["United States", "Soviet Union", "Eastern Europe"],
    chapterKey: "soviet",
    type: "Policy Lead",
    subjectLine: "Scowcroft correspondence with Solarz as congressional and executive-branch views converged on Soviet-bloc change.",
    topics: ["Scowcroft", "Solarz", "Congress", "Eastern Europe"]
  },
  {
    date: "1990-02-17",
    title: "900217 Powell to Scowcroft .pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgaXdtazVBdEJRel9PUHdfUlZheC01aTdvRE5Z",
    participants: ["Colin Powell", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union", "Germany"],
    chapterKey: "soviet",
    subjectLine: "Powell memorandum to Scowcroft during the February 1990 Moscow/German-unification diplomacy.",
    topics: ["Powell", "Scowcroft", "German unification", "Soviet diplomacy"]
  },
  {
    date: "1990-03-13",
    title: "900313 Zelikow to Scowcroft and Gates.pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNga3dlaGxJY0hCLW5rcnlqZzJBSjFzNlJHams0",
    participants: ["Philip Zelikow", "Brent Scowcroft", "Robert Gates"],
    countries: ["United States", "Soviet Union", "Germany"],
    chapterKey: "soviet",
    subjectLine: "Zelikow memorandum to Scowcroft and Gates on Soviet-policy implications of the 1990 diplomatic track.",
    topics: ["Zelikow", "Scowcroft", "Gates", "German unification"]
  },
  {
    date: "1991-08-01",
    sortDate: "1991-08-01",
    title: "undated Rice to Scowcroft with memo for Bush on Soviet turmoil .pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgWWQxVzRSNm5ReDNfM1hQZllYYklvSDBHWTNJ",
    participants: ["Condoleezza Rice", "Brent Scowcroft", "George H. W. Bush"],
    countries: ["United States", "Soviet Union", "Russia", "Ukraine"],
    chapterKey: "collapse",
    dateLine: "Undated, filed with Soviet turmoil material",
    subjectLine: "Rice memorandum to Scowcroft with a memo for Bush on Soviet turmoil; queued with the August 1991 collapse-policy files.",
    topics: ["Rice", "Scowcroft", "Soviet turmoil", "August coup", "Republics policy"]
  },
  {
    date: "1991-10-08",
    title: "91108 Hewett to Scowcroft re PZ meeting.pdf",
    url: "https://drive.google.com/file/d/1oRWSi9WwragXEs90ceT1vjLlLnAIxVoR",
    participants: ["Edward Hewett", "Brent Scowcroft", "Philip Zelikow"],
    countries: ["United States", "Soviet Union", "Russia"],
    chapterKey: "collapse",
    subjectLine: "Hewett memorandum to Scowcroft on a Zelikow meeting during the post-coup Soviet collapse-policy phase.",
    topics: ["Hewett", "Scowcroft", "Zelikow", "Soviet collapse"]
  },
  {
    date: "1989-05-01",
    title:
      "1989.Spring, GBPL, Scowcroft, Brent Files, USSR Collapse- US-Sov Relations Thru 1991 (May 1989), Outline of Coast Guard Academy Speech.pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgcHEwLVB1LVI4OVU",
    participants: ["Brent Scowcroft", "George H. W. Bush"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "archives",
    gbpl: true,
    dateLine: "Spring 1989",
    subjectLine: "GBPL source-copy lead for early Bush administration public framing of U.S.-Soviet relations.",
    topics: ["GBPL", "Scowcroft Files", "Coast Guard Academy speech", "U.S.-Soviet relations"]
  },
  {
    date: "1989-04-10",
    title:
      "1989.4.10, GBPL, Scowcroft, Brent Files, Box 99124, Soviet Power Collapse in Eastern Europe (March-April 1989), Memos and draft presidential statements on Polish Democracy and Ending Division in Europe.pdf",
    url: "https://drive.google.com/file/d/1MbsR4m9zT8K5MzhIzL25QCxukrB38IPV",
    participants: ["Brent Scowcroft", "National Security Council staff", "George H. W. Bush"],
    countries: ["United States", "Soviet Union", "Poland", "Eastern Europe"],
    chapterKey: "archives",
    gbpl: true,
    subjectLine: "GBPL source-copy lead for presidential statements on Polish democracy and ending Europe's division.",
    topics: ["GBPL", "Poland", "Eastern Europe", "Presidential statements"]
  },
  {
    date: "1989-05-02",
    title:
      "1989.5.02, GBPL, Scowcroft, Brent Files, Box 91120, Soviet Power Collapse - SNF - February-May 1989, Prepared Q&As for Press Conference on NATO.pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgRHIxZTFCNkpOdzQ",
    participants: ["Brent Scowcroft", "National Security Council staff"],
    countries: ["United States", "Soviet Union", "NATO"],
    chapterKey: "archives",
    gbpl: true,
    subjectLine: "GBPL source-copy lead for NATO press guidance amid Soviet and European policy repositioning.",
    topics: ["GBPL", "NATO", "SNF", "Press guidance"]
  },
  {
    date: "1989-05-03",
    title:
      "1989.5.3, GBPL, Scowcroft, Brent Files, Box 99124, Soviet Power Collapse in Eastern Europe (March-April 1989), Memo from Rice to BW re Meeting with Polish opposition leaders.pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgalJ1ZHRGM3gwcVE",
    participants: ["Condoleezza Rice", "Brent Scowcroft", "Polish opposition leaders"],
    countries: ["United States", "Poland", "Soviet Union"],
    chapterKey: "archives",
    gbpl: true,
    subjectLine: "Rice memorandum lead on meetings with Polish opposition leaders during the Soviet-bloc transition.",
    topics: ["GBPL", "Rice", "Poland", "Eastern Europe"]
  },
  {
    date: "1989-06-28",
    title:
      "1989.6.28, GBPL, Scowcroft, Brent Files, Box 99124, Soviet Power Collapse in Eastern Europe (June-July 1989), Cover Memo and Routing Slip re US Objectives at Paris Economic Summit.pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgbFdncVh4dTBFZ2c",
    participants: ["Brent Scowcroft", "National Security Council staff"],
    countries: ["United States", "Soviet Union", "Eastern Europe"],
    chapterKey: "archives",
    gbpl: true,
    subjectLine: "GBPL lead on U.S. objectives for the Paris Economic Summit as Soviet-bloc change accelerated.",
    topics: ["GBPL", "Paris Economic Summit", "Eastern Europe", "Economic policy"]
  },
  {
    date: "1989-07-10",
    title:
      "1989.7.10, GBPL, Scowcroft, Brent Files, Box 99124, Soviet Power Collapse in Eastern Europe (July 1989), Sakharov's Chatham House Lecture.pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgQndPQm9na25fV3M",
    participants: ["Andrei Sakharov", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "archives",
    gbpl: true,
    type: "Source Lead",
    subjectLine: "GBPL source-copy lead for Sakharov's Chatham House lecture in Scowcroft's Soviet-collapse files.",
    topics: ["GBPL", "Sakharov", "Soviet reform", "Human rights"]
  },
  {
    date: "1989-09-08",
    title:
      "1989.9.8, GBPL, Scowcroft, Brent Files, Box 99124, Soviet Power Collapse in Eastern Europe (July-August 1989), Routing Slip and Withdrawal Sheets for Memcons from Trip to Europe.pdf",
    url: "https://drive.google.com/file/d/1g0IQGeRDDt-Jby81GI14T28FbecnWRv_",
    participants: ["Brent Scowcroft", "National Security Council staff"],
    countries: ["United States", "Soviet Union", "Eastern Europe"],
    chapterKey: "archives",
    gbpl: true,
    subjectLine: "GBPL lead preserving withdrawal-sheet evidence for Europe-trip memcons in the Soviet power-collapse files.",
    topics: ["GBPL", "Withdrawal sheets", "Memcons", "Eastern Europe"]
  },
  {
    date: "1989-11-15",
    title:
      "1989.11.15, GBPL, Scowcroft, Brent Files, Box 91125, Soviet Power Collapse in Eastern Europe (November 1989) (Part II), Evaluation of Poland Reform Program (withdrawal sheet).pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgbnZEdDZKOEVnOTA",
    participants: ["Brent Scowcroft", "National Security Council staff"],
    countries: ["United States", "Poland", "Soviet Union"],
    chapterKey: "archives",
    gbpl: true,
    subjectLine: "Withdrawal-sheet lead for evaluation of the Poland reform program during the November 1989 transition.",
    topics: ["GBPL", "Poland", "Economic reform", "Withdrawal sheet"]
  },
  {
    date: "1990-04-18",
    title:
      "1990.4.18, GBPL, Scowcroft, Brent Files, Box 91125, Soviet Power Collapse in Eastern Europe (February-May 1990), US Assistance to EE.pdf",
    url: "https://drive.google.com/file/d/1J_Nh0Gna40ESXx3FE1WJHeIdkXtnq9xj",
    participants: ["Brent Scowcroft", "National Security Council staff"],
    countries: ["United States", "Soviet Union", "Eastern Europe"],
    chapterKey: "archives",
    gbpl: true,
    subjectLine: "GBPL source-copy lead for U.S. assistance to Eastern Europe in the Soviet power-collapse files.",
    topics: ["GBPL", "Assistance", "Eastern Europe", "Soviet collapse"]
  },
  {
    date: "1990-07-09",
    title:
      "1990.7.9, GBPL, Scowcroft, Brent Files, Box 12, USSR Collapse- US-Sov Relations Thru 1991 (July 1990), Note from NSC to HWB on Food Needs of USSR.pdf",
    url: "https://drive.google.com/file/d/1cI0SU5iRuQNA9fQEAisHXJevPV_R3QUR",
    participants: ["National Security Council staff", "George H. W. Bush"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "archives",
    gbpl: true,
    subjectLine: "NSC note to Bush on Soviet food needs, an early aid-and-instability lead before the collapse phase.",
    topics: ["GBPL", "Food assistance", "Soviet economy", "Bush"]
  },
  {
    date: "1990-07-14",
    title:
      "1990.7.14, GBPL, Scowcroft, Brent Files, Box 91120, SNF Dec 1990, Principals Mtg on START (MRs).pdf",
    url: "https://drive.google.com/file/d/1s4XGI0ZCV8FfurZtsaAcFlq8eiw9s6nw",
    participants: ["Principals Committee", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "archives",
    gbpl: true,
    type: "Meeting Lead",
    subjectLine: "GBPL lead for Principals Committee START meeting records in Scowcroft's SNF/START material.",
    topics: ["GBPL", "START", "Principals Committee", "Arms control"]
  },
  {
    date: "1990-08-13",
    title:
      "1990.8.13, GBPL, Scowcroft, Brent Files, 91118, USSR Collapse - US-Soviet Relations Thru 1991 (August 1990), Withdrawal slips for memos from CR on possible collapse of USSR.pdf",
    url: "https://drive.google.com/file/d/1RF5ZlIQvAuBftgQ3dmkzmo5xbH6WSt_z",
    participants: ["Condoleezza Rice", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "archives",
    gbpl: true,
    subjectLine: "Withdrawal-slip lead for Rice memoranda on possible Soviet collapse and U.S. response.",
    topics: ["GBPL", "Rice", "Soviet collapse", "Withdrawal sheets"]
  },
  {
    date: "1990-08-20",
    title:
      "1990.8.20, GBPL, Scowcroft, Brent Files, 91118, USSR Collapse - US-Soviet Relations Thru 1991 (August 1990), Debate on Making Mosbacher Trip a Presidential Mission.pdf",
    url: "https://drive.google.com/file/d/1iwuHAkNQTT5v4kucAoY_Mnhj53GwVhhU",
    participants: ["Robert Mosbacher", "Brent Scowcroft", "George H. W. Bush"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "archives",
    gbpl: true,
    subjectLine: "GBPL source-copy lead on whether to make Mosbacher's Soviet business trip a presidential mission.",
    topics: ["GBPL", "Mosbacher", "Soviet economy", "Presidential mission"]
  },
  {
    date: "1990-09-20",
    title:
      "1990.9.20, GBPL, Scowcroft, Brent Files, 91118, USSR Collapse - US-Soviet Relations Thru 1991 (September 1990) [2], Memo from Rice to BW re Business Ops with USSR (results of trip).pdf",
    url: "https://drive.google.com/file/d/1TS5JmGICMjW0Vk2Gvwf2XUuKdMTFN7Ff",
    participants: ["Condoleezza Rice", "Brent Scowcroft", "Robert Mosbacher"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "archives",
    gbpl: true,
    subjectLine: "Rice memorandum lead on business operations with the USSR after the Mosbacher trip.",
    topics: ["GBPL", "Rice", "Business operations", "Soviet economy"]
  },
  {
    date: "1990-12-07",
    title:
      "1990.12.7, GBPL, Scowcroft, Brent Files, Box 91118, USSR Collapse - US-Soviet Relations Thru 1991 (December 1990), Memo from JAB to BS and HWB re Econ Assistance to the USSR (impt).pdf",
    url: "https://drive.google.com/file/d/1C2wlqbJ8TAL-_EwuDsHsSlNq5EpbWjO1",
    participants: ["James A. Baker III", "Brent Scowcroft", "George H. W. Bush"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "archives",
    gbpl: true,
    subjectLine: "Baker memorandum lead to Scowcroft and Bush on economic assistance to the Soviet Union.",
    topics: ["GBPL", "Baker", "Economic assistance", "Soviet Union"]
  },
  {
    date: "1990-12-19",
    title:
      "1990.12.19, GBPL, Scowcroft, Brent Files, Box 91119, USSR Collapse-US-Soviet Relations Through 1991 (December 1990), Gates Group -- POCs.pdf",
    url: "https://drive.google.com/file/d/1KdfMnnIWL892_ant0QqtGblxHgS2UPJP",
    participants: ["Robert Gates", "Brent Scowcroft", "National Security Council staff"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "archives",
    gbpl: true,
    subjectLine: "GBPL source-copy lead for Gates Group points of contact on U.S.-Soviet policy and collapse contingencies.",
    topics: ["GBPL", "Gates Group", "Soviet collapse", "Contingency planning"]
  },
  {
    date: "1991-04-30",
    title:
      "1991.4.30, GBPL, Scowcroft, Brent Files, Box 91119, USSR Collapse-US-Soviet Relations Through 1991 (March-May 1991), Proposed Pres Ltr to Gorbachev Responding to His Req.pdf",
    url: "https://drive.google.com/file/d/1cTCzPjGZX4GiVb4dkhkuvXEFbI9-bYjo",
    participants: ["George H. W. Bush", "Mikhail Gorbachev", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "archives",
    gbpl: true,
    type: "Presidential Correspondence Lead",
    subjectLine: "Proposed presidential letter to Gorbachev responding to his request during the 1991 Soviet crisis.",
    topics: ["GBPL", "Bush-Gorbachev correspondence", "Soviet crisis", "Presidential message"]
  }
];

const newRecords = hits.map(record);
const existing = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
const retained = existing.filter((item) => item.seedBatch !== seedBatch);
const existingUrls = new Set(
  retained.flatMap((item) => [item.pdfUrl, item.catalogUrl, item.source?.url].filter(Boolean))
);
const existingIds = new Set(retained.map((item) => item.id));
const uniqueRecords = newRecords.filter(
  (item) => !existingUrls.has(item.pdfUrl) && !existingIds.has(item.id)
);

const combined = [...retained, ...uniqueRecords].sort((a, b) => {
  const dateA = a.sortDate || a.date || "";
  const dateB = b.sortDate || b.date || "";
  if (dateA !== dateB) return dateA.localeCompare(dateB);
  const orderA = a.sortOrder || 0;
  const orderB = b.sortOrder || 0;
  if (orderA !== orderB) return orderA - orderB;
  return (a.title || "").localeCompare(b.title || "");
});

const byYear = uniqueRecords.reduce((acc, item) => {
  const year = item.date.slice(0, 4);
  acc[year] = (acc[year] || 0) + 1;
  return acc;
}, {});

const report = {
  generatedAt: new Date().toISOString(),
  seedBatch,
  searchNotes: [
    "Google Drive searches used query Scowcroft with a PDF filter, folder-name search for Scowcroft, broad query Brent Scowcroft, and query Scowcroft Soviet with a PDF filter.",
    "No Google Drive folders named Scowcroft were found in the connector results.",
    "The useful results were direct date-prefixed Scowcroft/Rice/Zelikow/Blackwill memoranda and GBPL/Bush Library source-copy filenames from Brent Scowcroft files.",
    "This seed excludes memoirs, oral-history files, China-focused files, and Western Europe/Germany-only items unless they help triangulate Soviet policy."
  ],
  querySummary: [
    { label: "Scowcroft PDFs", driveQuery: "Scowcroft", driveFilter: "mimeType = 'application/pdf'", returned: "top 100" },
    {
      label: "Scowcroft folders",
      driveQuery: "name contains Scowcroft",
      driveFilter: "mimeType = 'application/vnd.google-apps.folder'",
      returned: 0
    },
    { label: "Brent Scowcroft broad search", driveQuery: "Brent Scowcroft", returned: "top 100" },
    { label: "Scowcroft Soviet PDFs", driveQuery: "Scowcroft Soviet", driveFilter: "mimeType = 'application/pdf'", returned: "top 100" }
  ],
  selectedRecordCount: uniqueRecords.length,
  skippedAsDuplicateCount: newRecords.length - uniqueRecords.length,
  selectedByYear: byYear,
  selectedHits: uniqueRecords.map((item) => ({
    id: item.id,
    date: item.date,
    dateLine: item.dateLine,
    title: item.title,
    type: item.type,
    chapter: item.chapter.name,
    url: item.pdfUrl,
    topics: item.topics
  }))
};

fs.writeFileSync(DATA_PATH, `${JSON.stringify(combined, null, 2)}\n`);
fs.writeFileSync(JS_PATH, `window.MEMCONS = ${JSON.stringify(combined, null, 2)};\n`);
fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`);

console.log(`Added ${uniqueRecords.length} Google Drive Scowcroft candidates`);
console.log(`Skipped ${newRecords.length - uniqueRecords.length} duplicates`);
console.log(`Total records: ${combined.length}`);
