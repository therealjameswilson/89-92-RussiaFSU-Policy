#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "..", "data", "memcons.json");
const JS_PATH = path.join(__dirname, "..", "data", "memcons.js");
const REPORT_PATH = path.join(
  __dirname,
  "..",
  "reports",
  "google-drive-date-prefix-bush-library-seed.json"
);

const seedBatch = "google-drive-date-prefix-bush-library-2026-05-21";

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
  const chapter = chapters[hit.chapterKey || "collapse"];
  const releaseStatus =
    hit.releaseStatus || "User Google Drive PDF hit; metadata captured; OCR/extraction pending";
  const sourceType = hit.sourceType || (hit.gbpl ? "Bush Library source-copy PDF" : "Google Drive PDF");
  const shortName = hit.gbpl ? "GBPL source copy" : "Google Drive PDF";
  const sourceTitle = hit.sourceTitle || hit.title;

  return {
    id: `drive-sweep-${hit.date}-${slug(hit.title)}`,
    date: hit.date,
    sortDate: hit.sortDate || hit.date,
    sortOrder: hit.sortOrder || 0,
    type: hit.gbpl ? "Source Lead" : hit.type || "Policy Memorandum",
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
      title: sourceTitle,
      shortName,
      url: hit.url
    },
    dateLine: hit.dateLine || formatDate(hit.date),
    subjectLine: hit.subjectLine,
    sourceNote: `Google Drive PDF found in the May 21, 2026 date-prefix/Bush Library sweep: ${hit.title}. URL: ${hit.url}.`,
    frusSourceNote:
      "Source copy found in user Google Drive; reconcile against NARA, Bush Library, State Department, or other formal citation before FRUS use.",
    topics: hit.topics,
    potentialFrusDocument: true,
    countStatus: hit.countStatus || "Candidate Volume IV source-copy document",
    nextAction:
      hit.nextAction ||
      "Fetch/OCR the PDF, capture formal archival citation, and compare against NARA/Bush Library source files before selection.",
    extractionStatus:
      hit.extractionStatus ||
      "Metadata-only hit from Google Drive search; PDF/OCR text still needs to be pulled and checked.",
    volumeRole: hit.volumeRole || "volume-iv-policy-candidate",
    volumeStatus: "Volume IV research candidate",
    frusVolume: volumeIv,
    seedBatch
  };
}

const hits = [
  {
    date: "1989-05-20",
    title: "890520 Scowcroft to Bush.pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgSXBROEJFc0loZENOdTItYXd0dE12M1JMOVhN",
    participants: ["Brent Scowcroft", "George H. W. Bush"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "soviet",
    subjectLine: "Scowcroft memorandum to the President during the administration's first Soviet policy review period.",
    topics: ["Scowcroft", "U.S.-Soviet strategy", "Policy review"]
  },
  {
    date: "1989-05-25",
    title: "890525 Scowcroft to Bush.pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgaUdTMTFUdGRWNVE3Y2JDaXFQV3l2a2tUU3VB",
    participants: ["Brent Scowcroft", "George H. W. Bush"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "soviet",
    subjectLine: "Late-May Scowcroft memorandum in the run-up to the Bush administration's public Soviet policy line.",
    topics: ["Scowcroft", "Bush", "Soviet policy"]
  },
  {
    date: "1989-06-01",
    title: "890601 Vershbow paper.pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgS0dKTm43aGhiaERJRWk1d0hYejlPYlNFaG5z",
    participants: ["Alexander Vershbow", "National Security Council staff"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "soviet",
    subjectLine: "Vershbow staff paper likely tied to the administration's assessment of Gorbachev and U.S.-Soviet strategy.",
    topics: ["Vershbow", "NSC staff", "Policy planning"]
  },
  {
    date: "1989-06-20",
    title: "890620 Bush to Gorbachev .pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgbGJpRWVsSWxzMXFQWW1EQnQ5dkVJVmxacU5N",
    participants: ["George H. W. Bush", "Mikhail Gorbachev"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "soviet",
    subjectLine: "Presidential correspondence with Gorbachev during the first-year policy review and pre-Malta diplomacy.",
    topics: ["Bush-Gorbachev correspondence", "U.S.-Soviet relations", "Presidential messages"]
  },
  {
    date: "1989-08-03",
    title: "890803 Rice to Scowcroft .pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgSi1xak9sNTN5SzVNWnNiMDJpSGpCaHRndDd3",
    participants: ["Condoleezza Rice", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "soviet",
    subjectLine: "Rice memorandum to Scowcroft during summer 1989 Soviet and Eastern Europe policy planning.",
    topics: ["Rice", "Scowcroft", "Eastern Europe", "Soviet policy"]
  },
  {
    date: "1989-09-06",
    title: "890906 DC meeting package .pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgZmhsVHg2cmJ0WXNBeVNHNlYwLXJjNEtjVVNz",
    participants: ["Deputies Committee", "National Security Council staff"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "soviet",
    type: "Meeting Package",
    subjectLine: "Deputies Committee package in the month NSD-23 fixed the administration's U.S.-Soviet policy guidance.",
    topics: ["Deputies Committee", "NSD-23", "Interagency process"]
  },
  {
    date: "1989-11-20",
    title: "891120 Hutchings to Scowcroft  .pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgYWFaYU5WVVpKM2FDM0pIOWlkNWNHMGlaWFhZ",
    participants: ["Robert Hutchings", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "soviet",
    subjectLine: "Hutchings memorandum to Scowcroft immediately before the Malta summit period.",
    topics: ["Hutchings", "Scowcroft", "Malta", "Summit preparation"]
  },
  {
    date: "1989-11-22",
    title: "891122 Rice to Scowcroft  .pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgQ2NnaWtIUHhQMC1HQ2QwLUZFVElyejJJa293",
    participants: ["Condoleezza Rice", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "soviet",
    subjectLine: "Rice memorandum to Scowcroft in the final preparation cycle before Malta.",
    topics: ["Rice", "Scowcroft", "Malta", "Soviet reform"]
  },
  {
    date: "1989-12-05",
    title: "891205 Hutchings to Scowcroft .pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgX0c5ZlFCV0h5QlJZWE9JcjJBX1kzUVV2bmhZ",
    participants: ["Robert Hutchings", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "soviet",
    subjectLine: "Immediate post-Malta Hutchings memorandum to Scowcroft on follow-up and policy implications.",
    topics: ["Malta follow-up", "Hutchings", "Scowcroft"]
  },
  {
    date: "1989-12-06",
    title: "891206 Scowcroft to Bush .pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgMTNVWjV5V0g1RElMNjNQb1dXVEVzNWJoa1Nr",
    participants: ["Brent Scowcroft", "George H. W. Bush"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "soviet",
    subjectLine: "Scowcroft memorandum to the President in the immediate aftermath of the Malta summit.",
    topics: ["Scowcroft", "Bush", "Malta follow-up"]
  },
  {
    date: "1990-01-16",
    title: "900116 Scowcroft to Bush.pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgOFNJY0ZIZTlBLXRzMVloTy1vSEtLQ0V5YTNV",
    participants: ["Brent Scowcroft", "George H. W. Bush"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "soviet",
    subjectLine: "Early 1990 Scowcroft memorandum to Bush after Malta and before the February Baker-Moscow mission.",
    topics: ["Scowcroft", "Bush", "Post-Malta policy"]
  },
  {
    date: "1990-02-01",
    title: "900201 Rice to Scowcroft .pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgUUpRcGZBcFBIdTd1SG9mWjZXNnlPM3ZqV01R",
    participants: ["Condoleezza Rice", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "soviet",
    subjectLine: "Rice memorandum to Scowcroft ahead of the February 1990 Moscow and German-unification diplomacy.",
    topics: ["Rice", "Scowcroft", "German unification", "Soviet policy"]
  },
  {
    date: "1990-02-14",
    title: "900214 Rice to Scowcroft.pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgUTdnMGpqNU5BeHA2WDZBZkRoUXg4LURQcjI0",
    participants: ["Condoleezza Rice", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "soviet",
    subjectLine: "Rice memorandum to Scowcroft after the Baker-Gorbachev-Shevardnadze Moscow talks.",
    topics: ["Rice", "Scowcroft", "Baker", "German unification"]
  },
  {
    date: "1990-02-16",
    title: "900216 Fry and Zelikow to Scowcroft .pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgOHZPTFBiZ0tmSlR3TVVwc3lwRnZFbGVIaUV3",
    participants: ["Michael Fry", "Philip Zelikow", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union", "Germany"],
    chapterKey: "soviet",
    subjectLine: "Fry-Zelikow memorandum to Scowcroft on the diplomatic track after the February Moscow meetings.",
    topics: ["Zelikow", "Fry", "German unification", "Soviet diplomacy"]
  },
  {
    date: "1990-02-20",
    title: "900220 Blackwill package for Scowcroft  .pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgTk00SlBXdUZmSk9WUXNsZnRNMVIwOWxSZGlR",
    participants: ["Robert Blackwill", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union", "Germany"],
    chapterKey: "soviet",
    type: "Briefing Package",
    subjectLine: "Blackwill package for Scowcroft as the administration coordinated Soviet, German, and NATO diplomacy.",
    topics: ["Blackwill", "Scowcroft", "Germany", "NATO"]
  },
  {
    date: "1990-02-27",
    title: "900227 Blackwill to Scowcroft .pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgaFFaSVFqUEZGS3lhY0sxZ05zcjFJcUxsQjFN",
    participants: ["Robert Blackwill", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union", "Germany"],
    chapterKey: "soviet",
    subjectLine: "Blackwill memorandum to Scowcroft near the opening of the Two Plus Four and NATO strategy debates.",
    topics: ["Blackwill", "Scowcroft", "Two Plus Four", "NATO"]
  },
  {
    date: "1990-03-27",
    title: "900327 Rice to Scowcroft.pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgcXRCN0VRNC1oVTdGYS1oemUtNTJiSVlGNG1r",
    participants: ["Condoleezza Rice", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union", "Lithuania"],
    chapterKey: "soviet",
    subjectLine: "Rice memorandum to Scowcroft amid Lithuanian independence and German-unification pressures.",
    topics: ["Rice", "Scowcroft", "Lithuania", "German unification"]
  },
  {
    date: "1990-03-30",
    title: "900330 Rice to Scowcroft .pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgUlVIeHdXZmxtNlZSN3FET0RVU0hiMGthYU5r",
    participants: ["Condoleezza Rice", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union", "Lithuania"],
    chapterKey: "soviet",
    subjectLine: "Rice memorandum to Scowcroft as Washington balanced Baltic policy, Gorbachev, and summit management.",
    topics: ["Rice", "Scowcroft", "Baltic states", "Gorbachev"]
  },
  {
    date: "1990-04-18",
    title: "900418 Rice to Scowcroft .pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgVDVBNEZRcHlVVGxpUVlpa1lDcjNVWjhlcjJj",
    participants: ["Condoleezza Rice", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union", "Lithuania"],
    chapterKey: "soviet",
    subjectLine: "Rice memorandum to Scowcroft during the Soviet economic-pressure crisis against Lithuania.",
    topics: ["Rice", "Scowcroft", "Lithuania", "Soviet pressure"]
  },
  {
    date: "1990-05-27",
    title: "900527 Scowcroft to Bush.pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgQWxxNTBRdzVzS3VZWXAyOTg4SmpYdk5sX1BR",
    participants: ["Brent Scowcroft", "George H. W. Bush"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "soviet",
    subjectLine: "Scowcroft memorandum to Bush just before the Washington summit with Gorbachev.",
    topics: ["Scowcroft", "Bush", "Washington summit", "Gorbachev"]
  },
  {
    date: "1990-07-04",
    title: "900704 Gorbachev to Bush .pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgRnJaNVhieFVSX3JmMTJEZGFkTjJHYlJva0NR",
    participants: ["Mikhail Gorbachev", "George H. W. Bush"],
    countries: ["Soviet Union", "United States"],
    chapterKey: "soviet",
    type: "Presidential Correspondence",
    subjectLine: "Gorbachev correspondence to Bush after the Washington summit and before the NATO/London summit phase.",
    topics: ["Gorbachev", "Bush", "Presidential correspondence", "Post-summit diplomacy"]
  },
  {
    date: "1990-11-28",
    title: "901128 Zelikow to Gates .pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgNkRPNGo2bGNjWHM2WFVOdGhlVUhNOUdEV1VF",
    participants: ["Philip Zelikow", "Robert Gates"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "collapse",
    subjectLine: "Zelikow memorandum to Gates as Soviet internal crisis and contingency planning intensified after German unification.",
    topics: ["Zelikow", "Gates", "Soviet collapse", "Contingency planning"]
  },
  {
    date: "1991-08-01",
    title: "910801 Bush and Kravchuk.pdf",
    url: "https://drive.google.com/file/d/1IO-2N12y2rky5D5iJE3z2WpgjE5h8ywL",
    participants: ["George H. W. Bush", "Leonid Kravchuk"],
    countries: ["United States", "Ukraine", "Soviet Union"],
    chapterKey: "collapse",
    type: "Meeting Record",
    subjectLine: "Bush-Kravchuk material from the Kiev visit, a central pre-coup anchor for republics policy.",
    topics: ["Ukraine", "Kravchuk", "Kiev", "Republics policy"]
  },
  {
    date: "1991-09-16",
    title: "910916 NIE on Soviet nuclear forces and republic sovereignty.pdf",
    url: "https://drive.google.com/file/d/1mNREjnRk9cI_f7PpRwtzwRPs5xFWiZBd",
    participants: ["Central Intelligence Agency", "National Intelligence Council"],
    countries: ["United States", "Soviet Union", "Russia", "Ukraine", "Kazakhstan", "Belarus"],
    chapterKey: "collapse",
    type: "Intelligence Assessment",
    subjectLine: "National intelligence estimate on Soviet nuclear forces as republic sovereignty threatened centralized command and control.",
    topics: ["Nuclear weapons", "Republic sovereignty", "NIE", "Command and control"]
  },
  {
    date: "1991-09-25",
    title: "910925 Bush and Kravchuk.pdf",
    url: "https://drive.google.com/file/d/1oFB0BP61Tk37A79AXSleJAIttfTreKWC",
    participants: ["George H. W. Bush", "Leonid Kravchuk"],
    countries: ["United States", "Ukraine", "Soviet Union"],
    chapterKey: "collapse",
    type: "Meeting Record",
    subjectLine: "Bush-Kravchuk meeting material after the August coup and before Ukraine's independence referendum.",
    topics: ["Ukraine", "Kravchuk", "Post-coup policy", "Republics policy"]
  },
  {
    date: "1991-10-01",
    title: "911001 Zelikow memo re meeting with Kravchuk.pdf",
    url: "https://drive.google.com/file/d/12vaIv2gr0DN99f7Vza8bo5ckG5bbVkU8",
    participants: ["Philip Zelikow", "Leonid Kravchuk", "National Security Council staff"],
    countries: ["United States", "Ukraine", "Soviet Union"],
    chapterKey: "collapse",
    subjectLine: "Zelikow memorandum reconstructing the Kravchuk meeting and policy implications for Ukraine.",
    topics: ["Zelikow", "Kravchuk", "Ukraine", "Republics policy"]
  },
  {
    date: "1991-10-07",
    title: "911007 Bartholomew meeting with Ukraine and Belarus and Kazakhstan officials re PNI.pdf",
    url: "https://drive.google.com/file/d/1S_aMKxQ5Z4b5djYl0ERMEh08dxsZOGNM",
    participants: ["Reginald Bartholomew", "Ukrainian officials", "Belarusian officials", "Kazakhstani officials"],
    countries: ["United States", "Ukraine", "Belarus", "Kazakhstan", "Soviet Union"],
    chapterKey: "collapse",
    type: "Meeting Record",
    subjectLine: "Bartholomew meeting with non-Russian nuclear republic officials on Presidential Nuclear Initiatives.",
    topics: ["PNI", "Nuclear weapons", "Ukraine", "Belarus", "Kazakhstan"]
  },
  {
    date: "1991-10-24",
    title: "911024 Moscow cable re Kravchuk and nukes.pdf",
    url: "https://drive.google.com/file/d/19EZDMqUzVlJt8siIFltnZD-pGE03H_zN",
    participants: ["U.S. Embassy Moscow", "Leonid Kravchuk"],
    countries: ["United States", "Ukraine", "Soviet Union"],
    chapterKey: "collapse",
    type: "Cable",
    subjectLine: "Moscow cable on Kravchuk and the nuclear-weapons issue before the Ukrainian independence referendum.",
    topics: ["Kravchuk", "Ukraine", "Nuclear weapons", "Moscow Embassy"]
  },
  {
    date: "1991-10-29",
    title: "911029 DOD paper in response to John Gordon.pdf",
    url: "https://drive.google.com/file/d/1pR5NpJoel_IhXEM46hGlsQ93Ptx1qI1L",
    participants: ["Department of Defense", "John Gordon"],
    countries: ["United States", "Soviet Union", "Russia", "Ukraine", "Kazakhstan", "Belarus"],
    chapterKey: "collapse",
    type: "Policy Paper",
    subjectLine: "Defense Department paper responding to John Gordon on nuclear forces and Soviet successor-state risks.",
    topics: ["Department of Defense", "John Gordon", "Nuclear weapons", "Successor states"]
  },
  {
    date: "1991-10-31",
    title: "911031 Gordon memo on nukes.pdf",
    url: "https://drive.google.com/file/d/1fj_KbSMCwa6jjEYfVcGcloFT3rU1QAsW",
    participants: ["John Gordon", "National Security Council staff"],
    countries: ["United States", "Soviet Union", "Russia", "Ukraine", "Kazakhstan", "Belarus"],
    chapterKey: "collapse",
    subjectLine: "Gordon memorandum on nuclear-weapons risks in the Soviet collapse and successor-state context.",
    topics: ["John Gordon", "Nuclear weapons", "Successor states", "Nonproliferation"]
  },
  {
    date: "1991-10-31",
    sortOrder: 1,
    title: "911000 DIA Report on nukes outside Russia.pdf",
    url: "https://drive.google.com/file/d/1Zq-pQzEWbVJMq9ydgN6iNAb_bBLIEHZN",
    participants: ["Defense Intelligence Agency"],
    countries: ["United States", "Russia", "Ukraine", "Kazakhstan", "Belarus", "Soviet Union"],
    chapterKey: "collapse",
    type: "Intelligence Assessment",
    dateLine: "October 1991",
    subjectLine: "DIA report on nuclear weapons outside Russia as Soviet authority fragmented.",
    topics: ["DIA", "Nuclear weapons", "Russia", "Ukraine", "Kazakhstan", "Belarus"]
  },
  {
    date: "1991-11-01",
    title: "911100 Cia Report on Soviet Tactical Nuclear Forces and Gorbachev's Nuclear Pledges.pdf",
    url: "https://drive.google.com/file/d/1UArL0DaYVZcht1r2xM9v1LA-xjWQUeyt",
    participants: ["Central Intelligence Agency", "Mikhail Gorbachev"],
    countries: ["United States", "Soviet Union", "Russia", "Ukraine", "Kazakhstan", "Belarus"],
    chapterKey: "collapse",
    type: "Intelligence Assessment",
    dateLine: "November 1991",
    subjectLine: "CIA assessment of Soviet tactical nuclear forces and Gorbachev's nuclear pledges after the PNI announcements.",
    topics: ["CIA", "Tactical nuclear weapons", "Gorbachev", "PNI"]
  },
  {
    date: "1991-11-21",
    title: "911121 Strauss to Nunn.pdf",
    url: "https://drive.google.com/file/d/1r6a971l-mSVMUDe9l_FlNBzbOSlkoPb_",
    participants: ["Robert Strauss", "Sam Nunn"],
    countries: ["United States", "Soviet Union", "Russia"],
    chapterKey: "collapse",
    type: "Letter",
    subjectLine: "Strauss correspondence to Senator Nunn as cooperative threat reduction legislation emerged.",
    topics: ["Nunn-Lugar", "Strauss", "Cooperative threat reduction"]
  },
  {
    date: "1991-11-24",
    title: "911124 Bush with Ukrainians.pdf",
    url: "https://drive.google.com/file/d/1bYRb35FmHG3zMxodrJSaT7nF0mslAVA0",
    participants: ["George H. W. Bush", "Ukrainian representatives"],
    countries: ["United States", "Ukraine", "Soviet Union"],
    chapterKey: "collapse",
    type: "Meeting Record",
    subjectLine: "Bush meeting material with Ukrainians on the eve of Ukraine's independence referendum and nuclear succession crisis.",
    topics: ["Ukraine", "Bush", "Independence referendum", "Nuclear weapons"]
  },
  {
    date: "1991-11-30",
    title: "911130 Bush and Yeltsin telcon.pdf",
    url: "https://drive.google.com/file/d/1e-PgkAdn471UpGA7xO0MVkKnhwlSCfwk",
    participants: ["George H. W. Bush", "Boris Yeltsin"],
    countries: ["United States", "Russia", "Soviet Union"],
    chapterKey: "collapse",
    type: "Telcon",
    subjectLine: "Bush-Yeltsin telephone material immediately before the Ukrainian independence referendum.",
    topics: ["Yeltsin", "Russia", "Ukraine referendum", "Soviet collapse"]
  },
  {
    date: "1991-12-03",
    title: "911203 Bush and Kravchuk.pdf",
    url: "https://drive.google.com/file/d/1hUnKdiWyn--DZAp61-Eov86yfvy8zD52",
    participants: ["George H. W. Bush", "Leonid Kravchuk"],
    countries: ["United States", "Ukraine"],
    chapterKey: "collapse",
    type: "Meeting Record",
    subjectLine: "Bush-Kravchuk material after Ukraine's independence referendum and before the dissolution of the Soviet Union.",
    topics: ["Ukraine", "Kravchuk", "Independence", "Nuclear weapons"]
  },
  {
    date: "1991-12-10",
    title: "911210 Niles cable re talks in Kiev.pdf",
    url: "https://drive.google.com/file/d/1KXWr_QnhKWXuIDF6XciKJrEjRo2u5b_4",
    participants: ["Thomas Niles", "U.S. Embassy Kyiv"],
    countries: ["United States", "Ukraine"],
    chapterKey: "collapse",
    type: "Cable",
    subjectLine: "Niles cable on talks in Kiev after Ukraine's independence vote and during Soviet dissolution.",
    topics: ["Ukraine", "Kiev", "Niles", "Post-Soviet transition"]
  },
  {
    date: "1991-12-27",
    title: "911227 Summary of Seminar on Nunn-Lugar Implementation for the 400 million.pdf",
    url: "https://drive.google.com/file/d/1J2TlGCuYn3wlMmcIBgfpczaFc9Qc0T89",
    participants: ["Nunn-Lugar implementation seminar participants"],
    countries: ["United States", "Russia", "Ukraine", "Kazakhstan", "Belarus"],
    chapterKey: "collapse",
    type: "Seminar Summary",
    subjectLine: "Implementation planning for the initial $400 million Nunn-Lugar cooperative threat reduction authority.",
    topics: ["Nunn-Lugar", "Cooperative threat reduction", "Implementation", "Nuclear weapons"]
  },
  {
    date: "1992-01-10",
    title: "920110 Reg Barthomew Talking Points for Moscow trip.pdf",
    url: "https://drive.google.com/file/d/1W4MKY9aYIIIvK9JtwYpfSxXFnfp1JM5Q",
    participants: ["Reginald Bartholomew"],
    countries: ["United States", "Russia", "Ukraine", "Kazakhstan", "Belarus"],
    chapterKey: "collapse",
    type: "Talking Points",
    subjectLine: "Bartholomew talking points for a Moscow trip focused on nuclear succession and post-Soviet policy.",
    topics: ["Bartholomew", "Moscow", "Nuclear succession", "NIS policy"]
  },
  {
    date: "1992-01-24",
    title: "920124 SSD Readout From Moscow.pdf",
    url: "https://drive.google.com/file/d/1AlFzfE7NaMVdbnuEqvKYKWgEpimfSS98",
    participants: ["State Department", "U.S. Embassy Moscow"],
    countries: ["United States", "Russia"],
    chapterKey: "collapse",
    type: "SSD Readout",
    subjectLine: "State Department SSD readout from Moscow in the first month after Soviet dissolution.",
    topics: ["Moscow", "State Department", "Russia", "Post-Soviet transition"]
  },
  {
    date: "1992-01-29",
    title: "920129 National Security Caucus Letter to Bush After Meeting with Yeltsin.pdf",
    url: "https://drive.google.com/file/d/1zCsGt_NcB8I6SMRANN_QK9TcvMFf01F8",
    participants: ["National Security Caucus", "George H. W. Bush", "Boris Yeltsin"],
    countries: ["United States", "Russia"],
    chapterKey: "collapse",
    type: "Letter",
    subjectLine: "Congressional national-security letter to Bush after a meeting with Yeltsin.",
    topics: ["Yeltsin", "Congress", "Russia policy", "Nunn-Lugar"]
  },
  {
    date: "1992-01-30",
    title: "920130 Nunn and Lugar to Bush.pdf",
    url: "https://drive.google.com/file/d/1aHDdROlYcjMYekm_iPirnCDqIajs_JZP",
    participants: ["Sam Nunn", "Richard Lugar", "George H. W. Bush"],
    countries: ["United States", "Russia", "Ukraine", "Kazakhstan", "Belarus"],
    chapterKey: "collapse",
    type: "Letter",
    subjectLine: "Nunn-Lugar correspondence to Bush on post-Soviet nuclear weapons, dismantlement, and assistance.",
    topics: ["Nunn-Lugar", "Cooperative threat reduction", "Congress", "Nuclear weapons"]
  },
  {
    date: "1992-02-26",
    title: "920226 Baker and Gorbachev cable.pdf",
    url: "https://drive.google.com/file/d/1kVS9T0_QQrsL0d4NDQBghU0D-DKDnpkJ",
    participants: ["James A. Baker III", "Mikhail Gorbachev", "State Department"],
    countries: ["United States", "Russia", "Soviet Union"],
    chapterKey: "collapse",
    type: "Cable",
    subjectLine: "Cable on Baker's conversation with Gorbachev after Soviet dissolution.",
    topics: ["Baker", "Gorbachev", "Russia", "Post-Soviet transition"]
  },
  {
    date: "1992-03-01",
    title: "920300 Trip Report of Nunn and Lugar et al.pdf",
    url: "https://drive.google.com/file/d/13g3PwuIIxoSk-1XrhL8L5xoh1sJR4zaI",
    participants: ["Sam Nunn", "Richard Lugar"],
    countries: ["United States", "Russia", "Ukraine", "Kazakhstan", "Belarus"],
    chapterKey: "collapse",
    type: "Trip Report",
    dateLine: "March 1992",
    subjectLine: "Nunn-Lugar trip report on post-Soviet nuclear weapons, dismantlement, and assistance needs.",
    topics: ["Nunn-Lugar", "Trip report", "Cooperative threat reduction", "NIS"]
  },
  {
    date: "1992-03-28",
    title: "920328 DIA report on Ukraine halt to withdrawal.pdf",
    url: "https://drive.google.com/file/d/1nYwQYHHC-S_xbeVdMQArWAPLW4QbvweA",
    participants: ["Defense Intelligence Agency"],
    countries: ["United States", "Ukraine", "Russia"],
    chapterKey: "collapse",
    type: "Intelligence Assessment",
    subjectLine: "DIA report on Ukraine's halt to nuclear withdrawal, a key nonproliferation and Lisbon Protocol issue.",
    topics: ["DIA", "Ukraine", "Nuclear withdrawal", "Nonproliferation"]
  },
  {
    date: "1992-04-10",
    title: "920410 Bush and Kravchuk.pdf",
    url: "https://drive.google.com/file/d/1SAe6FR09vONnbmdyR0Rf4oJmTTiLE72g",
    participants: ["George H. W. Bush", "Leonid Kravchuk"],
    countries: ["United States", "Ukraine"],
    chapterKey: "collapse",
    type: "Meeting Record",
    subjectLine: "Bush-Kravchuk material during the spring 1992 diplomacy over Ukraine, nuclear weapons, and recognition.",
    topics: ["Ukraine", "Kravchuk", "Nuclear weapons", "Bilateral relations"]
  },
  {
    date: "1992-05-06",
    title: "920506 Bush and Kravchuk Restricted Session notes.pdf",
    url: "https://drive.google.com/file/d/1B3BT2qmKBZP8QuD8xQFhn7YTAXjUuToN",
    participants: ["George H. W. Bush", "Leonid Kravchuk"],
    countries: ["United States", "Ukraine"],
    chapterKey: "collapse",
    type: "Meeting Notes",
    subjectLine: "Restricted-session notes for Bush's May 1992 meeting with Kravchuk.",
    topics: ["Ukraine", "Kravchuk", "Restricted session", "Nuclear weapons"]
  },
  {
    date: "1992-05-06",
    sortOrder: 1,
    title: "920506 Bush and Kravchuk.pdf",
    url: "https://drive.google.com/file/d/1iANr9iB_HKeuHQe9vjEK-7eF5WfAibKr",
    participants: ["George H. W. Bush", "Leonid Kravchuk"],
    countries: ["United States", "Ukraine"],
    chapterKey: "collapse",
    type: "Meeting Record",
    subjectLine: "Bush-Kravchuk meeting material from May 1992, paired with restricted-session notes.",
    topics: ["Ukraine", "Kravchuk", "Bilateral relations", "Nuclear weapons"]
  },
  {
    date: "1992-05-19",
    title: "920519 Bush and Nazaybayev.pdf",
    url: "https://drive.google.com/file/d/1RZetC-kjgv-PDPkSLek2kqz_dLdv6MhR",
    participants: ["George H. W. Bush", "Nursultan Nazarbayev"],
    countries: ["United States", "Kazakhstan"],
    chapterKey: "collapse",
    type: "Meeting Record",
    subjectLine: "Bush-Nazarbayev material on Kazakhstan, post-Soviet relations, and nuclear weapons.",
    topics: ["Kazakhstan", "Nazarbayev", "Nuclear weapons", "Bilateral relations"]
  },
  {
    date: "1992-06-01",
    title: "920601 SSD Report From Moscow.pdf",
    url: "https://drive.google.com/file/d/1k1yHNZzhVpUqN1726MhXA8PPL5Y10VTG",
    participants: ["State Department", "U.S. Embassy Moscow"],
    countries: ["United States", "Russia"],
    chapterKey: "collapse",
    type: "SSD Report",
    subjectLine: "Moscow SSD report in the lead-up to the June 1992 Bush-Yeltsin summit period.",
    topics: ["Moscow", "Russia", "SSD", "Bush-Yeltsin summit"]
  },
  {
    date: "1992-06-02",
    title: "920602 SSD From Moscow.pdf",
    url: "https://drive.google.com/file/d/1uhFl0zmhsKwL5PhI2wBvZ89mAPNtKdFr",
    participants: ["State Department", "U.S. Embassy Moscow"],
    countries: ["United States", "Russia"],
    chapterKey: "collapse",
    type: "SSD Report",
    subjectLine: "Moscow SSD reporting on Russia policy during the pre-summit period.",
    topics: ["Moscow", "Russia", "SSD", "Yeltsin"]
  },
  {
    date: "1992-06-03",
    title: "920603 SSD From Moscow.pdf",
    url: "https://drive.google.com/file/d/1qWYeNsqk9k40xpLxwNJ3Q-q_Tu7snh_f",
    participants: ["State Department", "U.S. Embassy Moscow"],
    countries: ["United States", "Russia"],
    chapterKey: "collapse",
    type: "SSD Report",
    subjectLine: "Moscow SSD reporting on Russia policy and post-Soviet transition issues.",
    topics: ["Moscow", "Russia", "SSD", "Post-Soviet transition"]
  },
  {
    date: "1992-06-04",
    title: "920604 Burns Official Informal SSD From Moscow.pdf",
    url: "https://drive.google.com/file/d/1Gg9YOYJ4-xA_r-ZxmCACxx80bY-jlYfU",
    participants: ["William Burns", "State Department", "U.S. Embassy Moscow"],
    countries: ["United States", "Russia"],
    chapterKey: "collapse",
    type: "SSD Report",
    subjectLine: "Burns official-informal SSD from Moscow during the early U.S.-Russia policy reset.",
    topics: ["William Burns", "Moscow", "Russia", "SSD"]
  },
  {
    date: "1992-07-09",
    title: "920709 Bush and Shushkevich.pdf",
    url: "https://drive.google.com/file/d/1itLWrEbZUIsM1dP1JAh-Cucc7k1jHJzc",
    participants: ["George H. W. Bush", "Stanislav Shushkevich"],
    countries: ["United States", "Belarus"],
    chapterKey: "collapse",
    type: "Meeting Record",
    subjectLine: "Bush-Shushkevich material on Belarus, nuclear weapons, and bilateral relations.",
    topics: ["Belarus", "Shushkevich", "Nuclear weapons", "Bilateral relations"]
  },
  {
    date: "1992-07-09",
    sortOrder: 1,
    title: "920709 Bush and Kravchuk.pdf",
    url: "https://drive.google.com/file/d/1t6Ff_zd4pgA-Xd5DJvmltXaJnrCWijXN",
    participants: ["George H. W. Bush", "Leonid Kravchuk"],
    countries: ["United States", "Ukraine"],
    chapterKey: "collapse",
    type: "Meeting Record",
    subjectLine: "Bush-Kravchuk July 1992 material during the Lisbon Protocol and nuclear succession phase.",
    topics: ["Ukraine", "Kravchuk", "Lisbon Protocol", "Nuclear weapons"]
  },
  {
    date: "1992-07-31",
    title: "920731 SSD.pdf",
    url: "https://drive.google.com/file/d/17I_YzL89EevE3yTgAfi8vfprwosp_sIg",
    participants: ["State Department"],
    countries: ["United States", "Russia", "Ukraine"],
    chapterKey: "collapse",
    type: "SSD Report",
    subjectLine: "Late-July SSD report likely tied to post-summit Russia/NIS follow-up.",
    topics: ["SSD", "Russia", "NIS", "Post-Soviet transition"]
  },
  {
    date: "1992-08-28",
    title: "920828 SSD.pdf",
    url: "https://drive.google.com/file/d/1N0ARvo9JQTITg0ta5V6UAoMGhHGwgtJl",
    participants: ["State Department"],
    countries: ["United States", "Russia", "NIS"],
    chapterKey: "collapse",
    type: "SSD Report",
    subjectLine: "Late-August SSD report on post-Soviet policy implementation.",
    topics: ["SSD", "Russia", "NIS", "Implementation"]
  },
  {
    date: "1992-11-23",
    title: "921123 Nunn Lugar readout with Gorbachev.pdf",
    url: "https://drive.google.com/file/d/1uwPZn2_-AQFpH_EWs9hn_2JUtiUWd-0L",
    participants: ["Sam Nunn", "Richard Lugar", "Mikhail Gorbachev"],
    countries: ["United States", "Russia"],
    chapterKey: "collapse",
    type: "Meeting Readout",
    subjectLine: "Nunn-Lugar readout with Gorbachev on post-Soviet nuclear dismantlement and assistance.",
    topics: ["Nunn-Lugar", "Gorbachev", "Cooperative threat reduction"]
  },
  {
    date: "1992-11-23",
    sortOrder: 1,
    title: "921123 Nunn Lugar with Russian parliamentarians.pdf",
    url: "https://drive.google.com/file/d/1wS7jI88HlM-WD0eWVWUw3Ich_tqNBF_c",
    participants: ["Sam Nunn", "Richard Lugar", "Russian parliamentarians"],
    countries: ["United States", "Russia"],
    chapterKey: "collapse",
    type: "Meeting Record",
    subjectLine: "Nunn-Lugar meeting material with Russian parliamentarians.",
    topics: ["Nunn-Lugar", "Russian parliament", "Cooperative threat reduction"]
  },
  {
    date: "1992-11-24",
    title: "921124 Nunn and Lugar and Yeltsin.pdf",
    url: "https://drive.google.com/file/d/1BtCcnNEXSgP_5WP3uAxWeYiXRGkH7oJp",
    participants: ["Sam Nunn", "Richard Lugar", "Boris Yeltsin"],
    countries: ["United States", "Russia"],
    chapterKey: "collapse",
    type: "Meeting Record",
    subjectLine: "Nunn-Lugar meeting material with Yeltsin on dismantlement and assistance.",
    topics: ["Nunn-Lugar", "Yeltsin", "Russia", "Cooperative threat reduction"]
  },
  {
    date: "1992-11-25",
    title: "921125 Nunn from Moscow.pdf",
    url: "https://drive.google.com/file/d/1YwaARC2OqJcxlehD99ygNAcH3_F5XqdG",
    participants: ["Sam Nunn", "U.S. Embassy Moscow"],
    countries: ["United States", "Russia"],
    chapterKey: "collapse",
    type: "Cable",
    subjectLine: "Nunn reporting from Moscow after meetings on cooperative threat reduction.",
    topics: ["Nunn-Lugar", "Moscow", "Cooperative threat reduction", "Russia"]
  },
  {
    date: "1992-11-26",
    title: "921126 Collins cable from Moscow.pdf",
    url: "https://drive.google.com/file/d/107fPZIPfGeacnVUVBI2iuAuYDIRvk4cv",
    participants: ["James Collins", "U.S. Embassy Moscow"],
    countries: ["United States", "Russia"],
    chapterKey: "collapse",
    type: "Cable",
    subjectLine: "Collins cable from Moscow during late-1992 Nunn-Lugar and Russia-policy follow-up.",
    topics: ["James Collins", "Moscow", "Russia policy", "Nunn-Lugar"]
  },
  {
    date: "1992-12-04",
    title: "921204 Bush to Kravchuk via privacy channels.pdf",
    url: "https://drive.google.com/file/d/1f2yu2jJvNl-5gN29ftKaHMqGqNiDlShe",
    participants: ["George H. W. Bush", "Leonid Kravchuk"],
    countries: ["United States", "Ukraine"],
    chapterKey: "collapse",
    type: "Presidential Message",
    subjectLine: "Bush message to Kravchuk via private channels on late-1992 U.S.-Ukraine policy issues.",
    topics: ["Ukraine", "Kravchuk", "Private channel", "Presidential message"]
  },
  {
    date: "1992-12-24",
    title: "921224 Bush and Kravchuk.pdf",
    url: "https://drive.google.com/file/d/18U0vOPUAR4hrMrj4k6__yWka-E6gpgmH",
    participants: ["George H. W. Bush", "Leonid Kravchuk"],
    countries: ["United States", "Ukraine"],
    chapterKey: "collapse",
    type: "Meeting Record",
    subjectLine: "Bush-Kravchuk material from the closing days of the Bush administration.",
    topics: ["Ukraine", "Kravchuk", "Transition", "Nuclear weapons"]
  },
  {
    date: "1989-05-07",
    title:
      "1989.5.7, GBPL, Scowcroft, Brent Files, USSR Collapse- US-Sov Relations Thru 1991 (May 1989), Scowcroft Comments on A&M Speech Draft.pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgUVR4THBjdk9kXzg",
    participants: ["Brent Scowcroft", "George H. W. Bush"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "archives",
    gbpl: true,
    type: "Archive Lead",
    subjectLine: "GBPL source-copy lead for Scowcroft comments on the Texas A&M speech draft and early Soviet-policy framing.",
    topics: ["GBPL", "Scowcroft Files", "Texas A&M speech", "U.S.-Soviet relations"]
  },
  {
    date: "1989-07-01",
    title:
      "1989.7, GBPL, Scowcroft, Brent Files, Box 91126, Gorbachev (Dobrynin) Sensitive 1989-June 1990 [2], Annotated Copy of Moscow in the Aftermath of the Congress of People's Deputies (seen by Scowcroft).pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgb0RyVDZaanlBM28",
    participants: ["Brent Scowcroft"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "archives",
    gbpl: true,
    type: "Archive Lead",
    dateLine: "July 1989",
    subjectLine: "Annotated Scowcroft copy on Moscow after the Congress of People's Deputies.",
    topics: ["GBPL", "Scowcroft Files", "Gorbachev", "Soviet politics"]
  },
  {
    date: "1989-08-08",
    title:
      "1989.8.8, GBPL, Scowcroft, Brent Files, Box 99124, Soviet Power Collapse in Eastern Europe (July 1989), Memo from Rodman to BS \"Changes in EE- Why is Gorbachev Permitting This?\".pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgQTNrdU1NSEh2cFk",
    participants: ["Peter Rodman", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union", "Eastern Europe"],
    chapterKey: "archives",
    gbpl: true,
    type: "Archive Lead",
    subjectLine: "Rodman memorandum to Scowcroft on why Gorbachev was allowing change in Eastern Europe.",
    topics: ["GBPL", "Eastern Europe", "Gorbachev", "Rodman"]
  },
  {
    date: "1989-09-25",
    title:
      "1989.9.25, GBPL, Scowcroft, Brent Files, Box 11, USSR Collapse- US-Sov Relations Thru 1991 (September 1989), HWB Talking points for Bipartisan Leadership mtg.pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgZjEwN25adWdVcnM",
    participants: ["George H. W. Bush", "Brent Scowcroft", "Congressional leaders"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "archives",
    gbpl: true,
    type: "Archive Lead",
    subjectLine: "Bush talking points for bipartisan congressional leadership on U.S.-Soviet policy.",
    topics: ["GBPL", "Congress", "Talking points", "U.S.-Soviet relations"]
  },
  {
    date: "1990-06-05",
    title:
      "1990.6.05, GBPL, Scowcroft, Brent Files, Box 12, USSR Collapse- US-Sov Relations Thru 1991 (June 1990) (2), BS to HWB on Talking pts to be made with Congressional leaders on Gorby mtgs.pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgd2ZXR1RPS25zV2M",
    participants: ["Brent Scowcroft", "George H. W. Bush", "Congressional leaders"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "archives",
    gbpl: true,
    type: "Archive Lead",
    subjectLine: "Scowcroft talking points for Bush with congressional leaders on the Gorbachev meetings.",
    topics: ["GBPL", "Gorbachev", "Congress", "Talking points"]
  },
  {
    date: "1990-07-13",
    title:
      "1990.7.13, GBPL, Scowcroft, Brent Files, 91118, USSR Collapse - US-Soviet Relations Thru 1991 (July 1990), Routing Slip for Matlock cable (redacted) entitled \"Possible Collapse of the USSR and What we should be doing about it\".pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgQ3hKbEViWTg5ZzQ",
    participants: ["Jack Matlock", "Brent Scowcroft"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "archives",
    gbpl: true,
    type: "Archive Lead",
    subjectLine: "Routing slip for Matlock's redacted cable on possible Soviet collapse and U.S. response options.",
    topics: ["GBPL", "Matlock", "Soviet collapse", "Contingency planning"]
  },
  {
    date: "1990-08-01",
    title:
      "1990.8.1, GBPL, Scowcroft, Brent Files, 91118, USSR Collapse - US-Soviet Relations Thru 1991 (August 1990), BS cover memo and text of HWB Aspen Speech.pdf",
    url: "https://drive.google.com/file/d/1gGp-iVInr7JULlIbkv6BmHimiZL48C5_",
    participants: ["Brent Scowcroft", "George H. W. Bush"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "archives",
    gbpl: true,
    type: "Archive Lead",
    subjectLine: "Scowcroft cover memo and text of Bush's Aspen speech, a key public marker in post-Cold War policy.",
    topics: ["GBPL", "Aspen speech", "Scowcroft", "U.S.-Soviet relations"]
  },
  {
    date: "1990-08-18",
    title:
      "1990.8.18, GBPL, Scowcroft, Brent Files, Box 12, USSR Collapse- US-Sov Relations Thru 1991 (Aug 1990), Routing Slips and papers (closed) on Collapse of USSR (1).pdf",
    url: "https://drive.google.com/file/d/17gVWmQM-TdkeSuHPD2KudiA7_L7pAEj0",
    participants: ["Brent Scowcroft", "National Security Council staff"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "archives",
    gbpl: true,
    type: "Archive Lead",
    subjectLine: "GBPL routing slips and closed papers on possible Soviet collapse.",
    topics: ["GBPL", "Soviet collapse", "Closed material", "Contingency planning"]
  },
  {
    date: "1990-09-20",
    title:
      "1990.9.20, GBPL, Scowcroft, Brent Files, 91118, USSR Collapse - US-Soviet Relations Thru 1991 (September 1990) [2], Memo from BS to HWB re Results of Pres Bus Development Trip to USSR.pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgUVEzOVNCc0tNX2s",
    participants: ["Brent Scowcroft", "George H. W. Bush", "Robert Mosbacher"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "archives",
    gbpl: true,
    type: "Archive Lead",
    subjectLine: "Scowcroft memorandum to Bush on results of the presidential business development trip to the USSR.",
    topics: ["GBPL", "Business development", "Soviet economy", "Mosbacher"]
  },
  {
    date: "1990-10-11",
    title:
      "1990.10.11, GBPL, Scowcroft, Brent Files, 91118, USSR Collapse - US-Soviet Relations Thru 1991 (October 1990), Cover memo from CR (annotated) and BS talking pts for mtgs with Estonian leadership.pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgWV9jVmFaS2ZxUEk",
    participants: ["Condoleezza Rice", "Brent Scowcroft", "Estonian leaders"],
    countries: ["United States", "Soviet Union", "Estonia"],
    chapterKey: "archives",
    gbpl: true,
    type: "Archive Lead",
    subjectLine: "Annotated Rice cover memo and Scowcroft talking points for meetings with Estonian leadership.",
    topics: ["GBPL", "Estonia", "Baltic states", "Rice", "Scowcroft"]
  },
  {
    date: "1990-12-19",
    title:
      "1990.12.19, GBPL, Scowcroft, Brent Files, Box 91119, USSR Collapse-US-Sovit Relations Through 1991 (December 1990), Memos on Presidential Response to Mosbacher Business Trip.pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgQ0d4TmFoc0pIZzA",
    participants: ["Brent Scowcroft", "George H. W. Bush", "Robert Mosbacher"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "archives",
    gbpl: true,
    type: "Archive Lead",
    subjectLine: "Memos on the presidential response to Mosbacher's Soviet business trip.",
    topics: ["GBPL", "Mosbacher", "Soviet economy", "Presidential response"]
  },
  {
    date: "1990-12-21",
    title:
      "1990.12.21, GBPL, Scowcroft, Brent Files, Box 91119, USSR Collapse-US-Sovit Relations Through 1991 (December 1990), Routing Slips for memos from Rice and BS to HWB re Responding to toughening line in Moscow.pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgd0lUb2NzeXRKZXc",
    participants: ["Condoleezza Rice", "Brent Scowcroft", "George H. W. Bush"],
    countries: ["United States", "Soviet Union", "Russia"],
    chapterKey: "archives",
    gbpl: true,
    type: "Archive Lead",
    subjectLine: "Routing slips for Rice and Scowcroft memoranda to Bush on responding to the toughening line in Moscow.",
    topics: ["GBPL", "Moscow", "Rice", "Scowcroft", "Soviet hardliners"]
  },
  {
    date: "1991-05-01",
    title:
      "1991.5.1, GBPL, Scowcroft, Brent Files, Box 91119, USSR Collapse-US-Soviet Relations Through 1991 (March-May 1991), Routing Slip and Withdrawal Sheet on \"Response to Soviets re CFE\".pdf",
    url: "https://drive.google.com/file/d/0B4xiXXj9ooNgT2dOZmdkd3VTb3M",
    participants: ["Brent Scowcroft", "National Security Council staff"],
    countries: ["United States", "Soviet Union"],
    chapterKey: "archives",
    gbpl: true,
    type: "Archive Lead",
    subjectLine: "Routing slip and withdrawal sheet for response to Soviets on CFE.",
    topics: ["GBPL", "CFE", "Arms control", "Withdrawal sheet"]
  }
];

const newRecords = hits.map(record);
const existing = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
const retained = existing.filter((item) => item.seedBatch !== seedBatch);
const existingUrls = new Set(
  retained.flatMap((item) => [item.pdfUrl, item.catalogUrl, item.source?.url].filter(Boolean))
);
const uniqueRecords = newRecords.filter((item) => !existingUrls.has(item.pdfUrl));

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
    "Google Drive search does not expose a starts-with operator; broad PDF searches used name contains '89', '90', '91', and '92' and were post-filtered by title/date relevance.",
    "No PDF titles matched literal name contains 'Bush' and name contains 'Library'. The Drive convention for Bush Library source copies is GBPL, so a GBPL PDF search was added.",
    "This seed intentionally captures high-signal FRUS Volume IV candidates and archive leads, not every duplicate Drive copy returned by the searches."
  ],
  querySummary: [
    { label: "89 date-prefix PDFs", driveFilter: "mimeType = 'application/pdf' and name contains '89'", returned: "top 100" },
    { label: "90 date-prefix PDFs", driveFilter: "mimeType = 'application/pdf' and name contains '90'", returned: "top 100" },
    { label: "91 date-prefix PDFs", driveFilter: "mimeType = 'application/pdf' and name contains '91'", returned: "top 100" },
    { label: "92 date-prefix PDFs", driveFilter: "mimeType = 'application/pdf' and name contains '92'", returned: "64 in this pass" },
    { label: "Literal Bush Library in PDF title", driveFilter: "mimeType = 'application/pdf' and name contains 'Bush' and name contains 'Library'", returned: 0 },
    { label: "GBPL Bush Library source-copy PDFs", driveQuery: "GBPL", driveFilter: "mimeType = 'application/pdf'", returned: "top 100" }
  ],
  selectedRecordCount: uniqueRecords.length,
  skippedAsDuplicateCount: newRecords.length - uniqueRecords.length,
  selectedByYear: byYear,
  selectedHits: uniqueRecords.map((item) => ({
    id: item.id,
    date: item.date,
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

console.log(`Added ${uniqueRecords.length} Google Drive date-prefix/GBPL candidates`);
console.log(`Skipped ${newRecords.length - uniqueRecords.length} duplicates`);
console.log(`Total records: ${combined.length}`);
