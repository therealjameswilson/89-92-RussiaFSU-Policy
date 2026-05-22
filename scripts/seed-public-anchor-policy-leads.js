#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "..", "data", "memcons.json");
const JS_PATH = path.join(__dirname, "..", "data", "memcons.js");
const CENTRAL_REPORT_PATH = path.join(__dirname, "..", "reports", "central-chronology-374000108-search.json");
const SEED_REPORT_PATH = path.join(__dirname, "..", "reports", "public-anchor-policy-leads-seed.json");
const CENTRAL_REPORT_REF = "reports/central-chronology-374000108-search.json";

const seedBatch = "public-anchor-policy-leads-2026-05-22";

const govinfoCollectionUrl =
  "https://www.govinfo.gov/app/collection/ppp/president-41_Bush,%20George%20H.%20W.";

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

const sourceFamilies = {
  publicPapers: {
    label: "GovInfo George H. W. Bush Public Papers",
    url: govinfoCollectionUrl
  },
  scowcroft: {
    label: "NARA Brent Scowcroft Papers",
    url: "https://catalog.archives.gov/id/4522156",
    naid: "4522156"
  },
  bushScowcroft: {
    label: "Bush Library Brent Scowcroft Papers finding aid",
    url: "https://www.bush41library.gov/digital-research-room/finding-aid/brent-scowcroft-papers"
  },
  dailyFile: {
    label: "NARA Presidential Daily Files",
    url: "https://catalog.archives.gov/id/595141",
    naid: "595141"
  },
  centralChronology: {
    label: "NARA NSC European and Eurasian Directorate Central Chronological Files",
    url: "https://catalog.archives.gov/id/374000108",
    naid: "374000108"
  },
  nscdc: {
    label: "NARA NSC/Deputies Committee Meeting Files",
    url: "https://catalog.archives.gov/id/312294079",
    naid: "312294079"
  },
  nscdcFollowup: {
    label: "NARA NSC/Deputies Committee Follow-up Files",
    url: "https://catalog.archives.gov/id/312294094",
    naid: "312294094"
  },
  nsd: {
    label: "NARA National Security Directives Files",
    url: "https://catalog.archives.gov/id/313189290",
    naid: "313189290"
  },
  nsr: {
    label: "NARA National Security Review Files",
    url: "https://catalog.archives.gov/id/313189297",
    naid: "313189297"
  },
  memcon: {
    label: "NARA Presidential Memcon Files",
    url: "https://catalog.archives.gov/id/321498039",
    naid: "321498039"
  },
  telcon: {
    label: "NARA Presidential Telcon Files",
    url: "https://catalog.archives.gov/id/321498139",
    naid: "321498139"
  },
  frus31: {
    label: "FRUS 1989-1992 Volume XXXI START I source base",
    url: "https://history.state.gov/historicaldocuments/frus1989-92v31/sources"
  },
  howe: {
    label: "NARA Rear Admiral Jonathan Howe files",
    url: "https://catalog.archives.gov/id/2554916",
    naid: "2554916"
  },
  ostp: {
    label: "NARA OSTP Allan D. Bromley files",
    url: "https://catalog.archives.gov/id/2595246",
    naid: "2595246"
  }
};

const publicAnchorSelections = [
  {
    date: "1989-02-16",
    publicTitle: "Statement on the Soviet Withdrawal From Afghanistan",
    title: "Internal policy packet behind the Soviet withdrawal from Afghanistan statement",
    chapter: chapters.soviet,
    countries: ["United States", "Soviet Union", "Afghanistan"],
    topics: ["Afghanistan", "Soviet withdrawal", "Regional policy", "NSR-3"],
    sourceKeys: ["publicPapers", "scowcroft", "dailyFile", "nsr", "nscdc"],
    primarySourceKey: "scowcroft",
    subjectLine:
      "Public line on the Soviet withdrawal should be matched to the NSR-3 review, Scowcroft/Rice regional memoranda, and any Daily File clearance material.",
    nextAction:
      "Check NARA Scowcroft January-April 1989, NSR-3, and the February 16 Daily File for clearance memoranda, talking points, and State/NSC regional-policy guidance."
  },
  {
    date: "1989-05-29",
    publicTitle:
      "Remarks Announcing a Conventional Arms Control Initiative and a Question-and-Answer Session With Reporters in Brussels",
    title: "Internal policy packet behind the May 1989 CFE conventional-arms initiative",
    chapter: chapters.soviet,
    countries: ["United States", "Soviet Union", "NATO"],
    topics: ["CFE", "Conventional arms", "NATO", "NSR-14"],
    sourceKeys: ["publicPapers", "nsr", "nscdc", "scowcroft", "frus31"],
    primarySourceKey: "nsr",
    subjectLine:
      "The Brussels CFE announcement is a public capstone for NSR-14, Deputies Committee arms-control meetings, and Scowcroft May 1989 material.",
    nextAction:
      "Use NSR-14, NSC/DC May-June START/CFE files, and Scowcroft May 1989 folders to locate the decision memorandum or briefing item behind the initiative."
  },
  {
    date: "1989-06-19",
    publicTitle: "Statement on the Resumption of the Soviet-United States Nuclear and Space Arms Negotiations",
    title: "Internal policy packet behind resuming nuclear and space arms negotiations",
    chapter: chapters.soviet,
    countries: ["United States", "Soviet Union"],
    topics: ["START", "Defense and Space", "Arms control", "NSR-14"],
    sourceKeys: ["publicPapers", "nsr", "nscdc", "scowcroft", "frus31"],
    primarySourceKey: "nscdc",
    subjectLine:
      "Public announcement of resumed Nuclear and Space Talks should tie back to NSR-14 decisions and Deputies Committee START position papers.",
    nextAction:
      "Check NSC/DC 028, 032, 033, and 034 plus Scowcroft START memoranda for the final White House negotiating-position clearance."
  },
  {
    date: "1989-07-12",
    publicTitle: "White House Fact Sheet on the Proposal to Reduce Conventional Forces in Europe",
    title: "Internal policy packet behind the July 1989 CFE reduction fact sheet",
    chapter: chapters.soviet,
    countries: ["United States", "Soviet Union", "NATO"],
    topics: ["CFE", "Conventional forces", "NATO", "Arms control"],
    sourceKeys: ["publicPapers", "nsr", "nscdc", "frus31", "scowcroft"],
    primarySourceKey: "frus31",
    subjectLine:
      "Fact-sheet language should be reconciled with internal CFE papers and FRUS XXXI arms-control source files.",
    nextAction:
      "Use FRUS XXXI source-note collections, NSR-14, and NSC/DC files to identify the CFE paper or decision memo cleared for public release."
  },
  {
    date: "1989-09-12",
    publicTitle: "Statement by Press Secretary Fitzwater on the President's Meeting With Boris Yeltsin of the Soviet Union",
    title: "Internal policy packet behind the September 1989 Bush-Yeltsin meeting",
    chapter: chapters.soviet,
    countries: ["United States", "Soviet Union", "Russia"],
    topics: ["Yeltsin", "Russian republic", "Public diplomacy", "Soviet reform"],
    sourceKeys: ["publicPapers", "dailyFile", "scowcroft", "centralChronology", "memcon"],
    primarySourceKey: "dailyFile",
    subjectLine:
      "The early Yeltsin meeting needs its briefing and clearance packet, not just the public statement.",
    nextAction:
      "Check the September 12 Daily File, Scowcroft USSR Collapse files, and Central Chronology September 1989 folders for the meeting brief and follow-up notes."
  },
  {
    date: "1989-09-23",
    publicTitle: "Statement on the Summit Meeting With Soviet President Gorbachev",
    title: "Internal policy packet behind the Malta summit announcement",
    chapter: chapters.soviet,
    countries: ["United States", "Soviet Union"],
    topics: ["Malta", "Gorbachev", "Summit preparation", "U.S.-Soviet relations"],
    sourceKeys: ["publicPapers", "scowcroft", "centralChronology", "dailyFile", "frus31"],
    primarySourceKey: "centralChronology",
    subjectLine:
      "The Malta announcement should be linked to issue papers and NSC preparation rather than treated as a stand-alone public chronology item.",
    nextAction:
      "Use Central Chronology November-December 1989 and Scowcroft post-Malta files to locate summit issue papers, briefing tabs, and follow-up tasking."
  },
  {
    date: "1989-12-04",
    publicTitle: "White House Fact Sheet on the Meeting With Soviet Chairman Mikhail Gorbachev in Malta",
    title: "Internal policy packet behind the Malta public fact sheet",
    chapter: chapters.soviet,
    countries: ["United States", "Soviet Union"],
    topics: ["Malta", "Gorbachev", "Summit follow-up", "Policy agenda"],
    sourceKeys: ["publicPapers", "centralChronology", "scowcroft", "dailyFile", "frus31"],
    primarySourceKey: "scowcroft",
    subjectLine:
      "The fact sheet is a public guide to the Malta agenda; the Volume IV target is the follow-up policy packet and tasking record.",
    nextAction:
      "Compare Scowcroft December 1989, Central Chronology December 1989, and Volume III Malta memcons to isolate non-memcon policy materials."
  },
  {
    date: "1990-03-11",
    publicTitle: "Statement by Press Secretary Fitzwater on the Restoration of Lithuanian Independence",
    title: "Internal policy packet behind the first Lithuanian independence statement",
    chapter: chapters.soviet,
    countries: ["United States", "Soviet Union", "Lithuania"],
    topics: ["Lithuania", "Baltic states", "Self-determination", "Gorbachev channel"],
    sourceKeys: ["publicPapers", "centralChronology", "scowcroft", "dailyFile"],
    primarySourceKey: "centralChronology",
    subjectLine:
      "The March 11 public posture needs the internal Baltic nonrecognition and Gorbachev-channel guidance.",
    nextAction:
      "Check Central Chronology March 1990, Scowcroft April-May Lithuania folders, and the Daily File for statement clearance and options papers."
  },
  {
    date: "1990-04-20",
    publicTitle: "Statement by Press Secretary Fitzwater on Soviet Economic Sanctions Against Lithuania",
    title: "Internal policy packet behind the Soviet sanctions against Lithuania statement",
    chapter: chapters.soviet,
    countries: ["United States", "Soviet Union", "Lithuania"],
    topics: ["Lithuania", "Soviet sanctions", "Baltic crisis", "Economic pressure"],
    sourceKeys: ["publicPapers", "centralChronology", "scowcroft", "dailyFile"],
    primarySourceKey: "scowcroft",
    subjectLine:
      "The April sanctions statement should lead to options memoranda on pressure, allied consultations, and preserving the Washington summit channel.",
    nextAction:
      "Review Scowcroft April-May 1990 and Central Chronology April 1990 for sanctions-response options and public-guidance drafts."
  },
  {
    date: "1990-05-03",
    publicTitle: "Statement by Press Secretary Fitzwater on the President's Meeting With Prime Minister Kazimiera Prunskiene of Lithuania",
    title: "Internal policy packet behind the Prunskiene meeting",
    chapter: chapters.soviet,
    countries: ["United States", "Soviet Union", "Lithuania"],
    topics: ["Lithuania", "Prunskiene", "Baltic states", "Washington summit"],
    sourceKeys: ["publicPapers", "scowcroft", "centralChronology", "dailyFile", "memcon"],
    primarySourceKey: "scowcroft",
    subjectLine:
      "The Prunskiene meeting statement should be tied to the briefing memo and Washington summit Lithuania strategy.",
    nextAction:
      "Compare Scowcroft May 2 meeting brief, Central Chronology May 1990, and Daily File packet for presidential guidance on Lithuania."
  },
  {
    date: "1990-12-12",
    publicTitle: "Remarks on the Waiver of the Jackson-Vanik Amendment and on Economic Assistance to the Soviet Union",
    title: "Internal policy packet behind the December 1990 Soviet economic-assistance announcements",
    chapter: chapters.soviet,
    countries: ["United States", "Soviet Union"],
    topics: ["Soviet economy", "Economic assistance", "Jackson-Vanik", "Food assistance"],
    sourceKeys: ["publicPapers", "scowcroft", "centralChronology", "dailyFile"],
    primarySourceKey: "scowcroft",
    subjectLine:
      "The public aid and Jackson-Vanik line should be mapped to Baker, Scowcroft, Treasury, Agriculture, and NSC economic-support memoranda.",
    nextAction:
      "Use Scowcroft December 1990 and Central Chronology December 1990 to extract economic-support memoranda, IMF/World Bank papers, and press-release clearance."
  },
  {
    date: "1991-01-13",
    publicTitle: "Remarks on Soviet Military Intervention in Lithuania and a Question-and- Answer Session With Reporters",
    title: "Internal policy packet behind the Vilnius crisis response",
    chapter: chapters.soviet,
    countries: ["United States", "Soviet Union", "Lithuania", "Latvia", "Estonia"],
    topics: ["Lithuania", "Vilnius", "Baltic crisis", "Crisis response"],
    sourceKeys: ["publicPapers", "centralChronology", "scowcroft", "dailyFile"],
    primarySourceKey: "centralChronology",
    subjectLine:
      "The January 1991 public response needs situation reports, sanctions recommendations, and decision notes on Soviet force in Lithuania.",
    nextAction:
      "Check January 1991 Central Chronology, Scowcroft March-May 1991, and Daily File materials for decision memoranda and public guidance."
  },
  {
    date: "1991-05-08",
    publicTitle:
      "Statement by Press Secretary Fitzwater on President Bush's Meeting With President Vytautus Landsbergis of Lithuania and Prime Ministers Ivars Godmanis of Latvia and Edgar Savisaar of Estonia",
    title: "Internal policy packet behind the Baltic leaders meeting",
    chapter: chapters.soviet,
    countries: ["United States", "Soviet Union", "Lithuania", "Latvia", "Estonia"],
    topics: ["Baltic states", "Landsbergis", "Godmanis", "Savisaar"],
    sourceKeys: ["publicPapers", "centralChronology", "scowcroft", "dailyFile", "memcon"],
    primarySourceKey: "centralChronology",
    subjectLine:
      "The Baltic leaders statement should connect to meeting preparation, congressional pressure, and Report to Congress on Baltic Freedom materials.",
    nextAction:
      "Use Central Chronology May 1991 and Scowcroft Soviet turmoil folders to find the meeting brief, talking points, and Baltic freedom report."
  },
  {
    date: "1991-06-11",
    publicTitle: "Statement by Press Secretary Fitzwater on United States Agricultural Loan Credit for the Soviet Union",
    title: "Internal policy packet behind Soviet agricultural credit guarantees",
    chapter: chapters.soviet,
    countries: ["United States", "Soviet Union"],
    topics: ["Grain credits", "Food assistance", "Soviet economy", "Agriculture"],
    sourceKeys: ["publicPapers", "centralChronology", "scowcroft", "dailyFile"],
    primarySourceKey: "centralChronology",
    subjectLine:
      "The credit-guarantee announcement should be paired with Gorbachev's request, Agriculture decision papers, and NSC economic-policy guidance.",
    nextAction:
      "Check Central Chronology May-June 1991, Scowcroft CCC-credit material, and the June 11 Daily File for the decision memo and clearance chain."
  },
  {
    date: "1991-07-31",
    publicTitle: "White House Fact Sheet on The Strategic Arms Reduction Treaty (START)",
    title: "Internal policy packet behind the Moscow START fact sheet",
    chapter: chapters.soviet,
    countries: ["United States", "Soviet Union"],
    topics: ["START I", "Moscow summit", "Arms control", "Ukraine"],
    sourceKeys: ["publicPapers", "centralChronology", "scowcroft", "frus31", "dailyFile"],
    primarySourceKey: "frus31",
    subjectLine:
      "The START fact sheet should be linked to final Moscow summit briefing papers and FRUS XXXI arms-control records.",
    nextAction:
      "Use FRUS XXXI source collections, Central Chronology July 1991, and Daily File July 31 to locate briefing tabs and policy memoranda not duplicated in Volume III."
  },
  {
    date: "1991-08-01",
    publicTitle: "Remarks to the Supreme Soviet of the Republic of the Ukraine in Kiev, Soviet Union",
    title: "Internal policy packet behind the Kiev speech and Ukraine policy line",
    chapter: chapters.soviet,
    countries: ["United States", "Soviet Union", "Ukraine"],
    topics: ["Ukraine", "Kiev speech", "Republics policy", "Self-determination"],
    sourceKeys: ["publicPapers", "centralChronology", "dailyFile", "scowcroft", "memcon"],
    primarySourceKey: "centralChronology",
    subjectLine:
      "The Kiev speech needs its policy and speech-preparation file, especially guidance on Ukrainian independence and union/republic balance.",
    nextAction:
      "Check Central Chronology July-August 1991, the July 30-August 1 Daily Files, and Scowcroft republic-policy material for drafts and clearance notes."
  },
  {
    date: "1991-08-19",
    publicTitle: "Statement on the Attempted Coup in the Soviet Union",
    title: "Internal policy packet behind the first Soviet coup statement",
    chapter: chapters.collapse,
    countries: ["United States", "Soviet Union", "Russia"],
    topics: ["August coup", "Yeltsin", "Gorbachev", "Crisis management"],
    sourceKeys: ["publicPapers", "dailyFile", "scowcroft", "nscdc", "centralChronology"],
    primarySourceKey: "dailyFile",
    subjectLine:
      "The August 19 statement should be paired with crisis decision papers, call preparation, and Deputies/working-group tasking.",
    nextAction:
      "Use August 19-22 Daily Files, Scowcroft Soviet Coup/Aftermath, NSC/DC 300-308 files, and Central Chronology August 1991 for the decision record."
  },
  {
    date: "1991-09-27",
    publicTitle: "Address to the Nation on Reducing United States and Soviet Nuclear Weapons",
    title: "Internal policy packet behind the Presidential Nuclear Initiatives address",
    chapter: chapters.collapse,
    countries: ["United States", "Soviet Union", "Russia", "Ukraine", "Belarus", "Kazakhstan"],
    topics: ["Presidential Nuclear Initiatives", "Nuclear weapons", "START", "Republics policy"],
    sourceKeys: ["publicPapers", "dailyFile", "centralChronology", "scowcroft", "frus31"],
    primarySourceKey: "dailyFile",
    subjectLine:
      "The September 27 nuclear address should be tied to PNI decision papers, Soviet/republic responses, and nuclear inheritance planning.",
    nextAction:
      "Check the September 27 Daily File, Central Chronology September 1991, Scowcroft Gorbachev sensitive files, and FRUS XXXI source base for PNI decision records."
  },
  {
    date: "1991-11-20",
    publicTitle: "Statement by Press Secretary Fitzwater on Food Assistance to the Soviet Union",
    title: "Internal policy packet behind food assistance to the Soviet Union",
    chapter: chapters.collapse,
    countries: ["United States", "Soviet Union", "Russia", "Ukraine"],
    topics: ["Food assistance", "Humanitarian aid", "Republics policy", "Soviet economy"],
    sourceKeys: ["publicPapers", "centralChronology", "scowcroft", "dailyFile", "nscdc"],
    primarySourceKey: "centralChronology",
    subjectLine:
      "The food-assistance statement should lead to distribution, burden-sharing, and republic-channel decision papers.",
    nextAction:
      "Review Central Chronology October-November 1991, Scowcroft Soviet Coup/Aftermath, and NSC/DC humanitarian-assistance records for the policy architecture."
  },
  {
    date: "1991-12-25",
    publicTitle: "Address to the Nation on the Commonwealth of Independent States",
    title: "Internal policy packet behind CIS recognition and Soviet dissolution address",
    chapter: chapters.collapse,
    countries: ["United States", "Soviet Union", "Russia", "Ukraine", "Belarus", "Kazakhstan"],
    topics: ["CIS", "Recognition", "Soviet dissolution", "Nuclear control"],
    sourceKeys: ["publicPapers", "centralChronology", "dailyFile", "scowcroft", "telcon"],
    primarySourceKey: "centralChronology",
    subjectLine:
      "The CIS address should be paired with recognition memoranda, presidential letters, embassy-transition decisions, and nuclear-control assurances.",
    nextAction:
      "Check December 1991 Central Chronology, December 25-26 Daily Files, Scowcroft Gorbachev/Yeltsin files, and telcon records for recognition decision material."
  },
  {
    date: "1992-02-01",
    publicTitle: "The President's News Conference With President Boris Yeltsin of Russia",
    title: "Internal policy packet behind the Camp David Bush-Yeltsin policy line",
    chapter: chapters.collapse,
    countries: ["United States", "Russia", "Former Soviet Union"],
    topics: ["Yeltsin", "Russia reform", "Camp David", "Economic assistance"],
    sourceKeys: ["publicPapers", "howe", "centralChronology", "dailyFile", "memcon"],
    primarySourceKey: "howe",
    subjectLine:
      "The Camp David public line should be matched to the Howe pre-briefing file, Central Chronology February 1992, and U.S.-Russian relations papers.",
    nextAction:
      "Use the Yeltsin pre-briefing file, February 1992 Central Chronology, and Daily File packet to extract policy guidance on reform, assistance, and nuclear issues."
  },
  {
    date: "1992-03-20",
    publicTitle: "Memorandum Delegating Authority Regarding Weapons Destruction in the Former Soviet Union",
    title: "Internal policy packet behind former Soviet weapons-destruction delegation",
    chapter: chapters.collapse,
    countries: ["United States", "Russia", "Ukraine", "Belarus", "Kazakhstan"],
    topics: ["Nunn-Lugar", "Weapons destruction", "Nonproliferation", "Former Soviet Union"],
    sourceKeys: ["publicPapers", "nscdc", "nscdcFollowup", "centralChronology", "frus31"],
    primarySourceKey: "nscdc",
    subjectLine:
      "The delegation memorandum points to early Nunn-Lugar implementation and interagency nonproliferation decisions.",
    nextAction:
      "Check NSC/DC 340 and 342, follow-up files, Central Chronology March 1992, and Nunn-Lugar source-copy records for the implementing guidance."
  },
  {
    date: "1992-04-01",
    publicTitle: "The President's News Conference on Aid to the States of the Former Soviet Union",
    title: "Internal policy packet behind the April 1992 FSU aid package",
    chapter: chapters.collapse,
    countries: ["United States", "Russia", "Ukraine", "Belarus", "Kazakhstan", "Former Soviet Union"],
    topics: ["FREEDOM Support", "Aid package", "Former Soviet Union", "Economic assistance"],
    sourceKeys: ["publicPapers", "centralChronology", "dailyFile", "nscdc", "scowcroft"],
    primarySourceKey: "centralChronology",
    subjectLine:
      "The aid-package press conference should map to legislative strategy, G-7/IMF coordination, and Yeltsin/Kravchuk call material.",
    nextAction:
      "Use Central Chronology April 1992, April 1 Daily File material, and NSC/DC assistance records to identify the decision memo and congressional strategy."
  },
  {
    date: "1992-04-03",
    publicTitle: "Message to the Congress Transmitting the FREEDOM Support Act Proposed Legislation",
    title: "Internal policy packet behind transmission of the FREEDOM Support Act",
    chapter: chapters.collapse,
    countries: ["United States", "Russia", "Ukraine", "Belarus", "Kazakhstan", "Former Soviet Union"],
    topics: ["FREEDOM Support Act", "Congress", "Economic assistance", "Nunn-Lugar"],
    sourceKeys: ["publicPapers", "centralChronology", "nscdc", "dailyFile", "scowcroft"],
    primarySourceKey: "centralChronology",
    subjectLine:
      "The proposed legislation should connect to internal drafting, OMB/State/NSC clearance, and congressional outreach records.",
    nextAction:
      "Check Central Chronology April-June 1992, NSC/DC files, and Daily File packet for the legislative transmittal and issue papers."
  },
  {
    date: "1992-05-06",
    publicTitle: "Joint Declaration With President Leonid Kravchuk of Ukraine",
    title: "Internal policy packet behind the Kravchuk visit and Ukraine declaration",
    chapter: chapters.collapse,
    countries: ["United States", "Ukraine", "Russia"],
    topics: ["Ukraine", "Kravchuk", "Nuclear inheritance", "Assistance"],
    sourceKeys: ["publicPapers", "dailyFile", "centralChronology", "nscdc", "memcon"],
    primarySourceKey: "dailyFile",
    subjectLine:
      "The declaration needs the Ukraine briefing packet, nuclear-inheritance guidance, assistance papers, and follow-up tasking.",
    nextAction:
      "Use May 6 Daily File, Central Chronology May 1992, Nunn-Lugar/START files, and the released meeting record to isolate policy documents."
  },
  {
    date: "1992-05-19",
    publicTitle: "Joint Declaration With President Nursultan Nazarbayev of Kazakhstan",
    title: "Internal policy packet behind the Nazarbayev visit and Kazakhstan declaration",
    chapter: chapters.collapse,
    countries: ["United States", "Kazakhstan", "Russia"],
    topics: ["Kazakhstan", "Nazarbayev", "Nuclear inheritance", "CIS"],
    sourceKeys: ["publicPapers", "dailyFile", "centralChronology", "nscdc", "memcon"],
    primarySourceKey: "dailyFile",
    subjectLine:
      "The Kazakhstan declaration needs the visit briefing tabs, nuclear-inheritance guidance, and assistance follow-up papers.",
    nextAction:
      "Use May 19 Daily File, Central Chronology May 1992, and the Nazarbayev memcon to identify policy memoranda on nuclear weapons and bilateral assistance."
  },
  {
    date: "1992-06-17",
    publicTitle: "The President's News Conference With President Boris Yeltsin of Russia",
    title: "Internal policy packet behind the June 1992 Yeltsin summit policy package",
    chapter: chapters.collapse,
    countries: ["United States", "Russia", "Ukraine", "Belarus", "Kazakhstan"],
    topics: ["Yeltsin", "START II", "Russia assistance", "Nuclear security"],
    sourceKeys: ["publicPapers", "centralChronology", "dailyFile", "scowcroft", "frus31"],
    primarySourceKey: "centralChronology",
    subjectLine:
      "The public summit package should be matched to briefing books, START II/Nunn-Lugar papers, economic assistance, and defense-conversion guidance.",
    nextAction:
      "Check Central Chronology June 1992, the Yeltsin state-visit briefing book, Daily File June 16-18, and Scowcroft Yeltsin files."
  },
  {
    date: "1992-06-17",
    publicTitle: "Joint Russian-American Declaration on Defense Conversion",
    title: "Internal policy packet behind the defense-conversion declaration",
    chapter: chapters.collapse,
    countries: ["United States", "Russia", "Former Soviet Union"],
    topics: ["Defense conversion", "Nunn-Lugar", "Russian reform", "Defense industry"],
    sourceKeys: ["publicPapers", "centralChronology", "scowcroft", "nscdc"],
    primarySourceKey: "centralChronology",
    subjectLine:
      "The declaration should point to policy papers on defense-industry conversion, weapons scientists, and assistance authorities.",
    nextAction:
      "Use Central Chronology June 1992, Scowcroft Yeltsin files, and DoD/Cheney public-statement OCR targets to locate defense-conversion memoranda."
  },
  {
    date: "1992-10-24",
    publicTitle: "Statement on Signing the FREEDOM Support Act",
    title: "Internal policy packet behind signing the FREEDOM Support Act",
    chapter: chapters.collapse,
    countries: ["United States", "Russia", "Ukraine", "Belarus", "Kazakhstan", "Former Soviet Union"],
    topics: ["FREEDOM Support Act", "Nunn-Lugar", "Aid implementation", "Congress"],
    sourceKeys: ["publicPapers", "centralChronology", "nscdc", "dailyFile", "scowcroft"],
    primarySourceKey: "centralChronology",
    subjectLine:
      "The signing statement should be tied to enrolled-bill memoranda, conference papers, and post-enactment implementation guidance.",
    nextAction:
      "Check Central Chronology August-October 1992, NSC/DC assistance files, and Daily File signing materials for the implementation record."
  },
  {
    date: "1992-12-30",
    publicTitle: "Remarks on the START II Treaty and the Situation in Somalia and an Exchange With Reporters",
    title: "Internal policy packet behind the START II endgame announcement",
    chapter: chapters.collapse,
    countries: ["United States", "Russia", "Ukraine", "Belarus", "Kazakhstan"],
    topics: ["START II", "Yeltsin", "Lisbon Protocol", "Nunn-Lugar"],
    sourceKeys: ["publicPapers", "scowcroft", "centralChronology", "frus31", "dailyFile"],
    primarySourceKey: "scowcroft",
    subjectLine:
      "The START II announcement should be linked to Bush-Yeltsin messages, Lisbon/START ratification, and transition handoff material.",
    nextAction:
      "Use Scowcroft Yeltsin 1992 files, Central Chronology December 1992, and FRUS XXXI source collections for the final START II policy record."
  },
  {
    date: "1993-01-15",
    publicTitle: "Message to the Senate Transmitting the Russia-United States Treaty on Further Reduction and Limitation of Strategic Offensive Arms",
    title: "Internal policy packet behind the START II Senate transmittal",
    chapter: chapters.collapse,
    countries: ["United States", "Russia", "Ukraine", "Belarus", "Kazakhstan"],
    topics: ["START II", "Senate transmittal", "Nonproliferation", "Transition"],
    sourceKeys: ["publicPapers", "centralChronology", "scowcroft", "frus31", "nscdc"],
    primarySourceKey: "frus31",
    subjectLine:
      "The treaty transmittal needs the final arms-control packet and nuclear-successor-state implementation trail.",
    nextAction:
      "Check FRUS XXXI source collections, Scowcroft Yeltsin files, Central Chronology January 1993, and NSC/DC nonproliferation files."
  },
  {
    date: "1993-01-19",
    publicTitle: "Letter to Congressional Leaders Reporting on Nuclear Nonproliferation",
    title: "Internal policy packet behind the final Bush nuclear-nonproliferation report",
    chapter: chapters.collapse,
    countries: ["United States", "Russia", "Ukraine", "Belarus", "Kazakhstan", "Former Soviet Union"],
    topics: ["Nonproliferation", "Nunn-Lugar", "NPT", "Transition"],
    sourceKeys: ["publicPapers", "nsd", "nscdc", "centralChronology", "scowcroft"],
    primarySourceKey: "nsd",
    subjectLine:
      "The final congressional report should be tied to NSD-70, Nunn-Lugar implementation, and successor-state nuclear commitments.",
    nextAction:
      "Check NSD-70, NSC/DC nonproliferation files, Central Chronology January 1993, and Scowcroft HEU/Ukraine material for the handoff packet."
  }
];

const supplementalCentralDocuments = [
  {
    folderNaid: "470761677",
    documentTitle: "US Policy",
    date: "1990-01-31",
    chapter: chapters.soviet,
    documentGenre: "Memorandum",
    subjectLine:
      "CFE-focused U.S. policy memorandum around Bush correspondence with Gorbachev, useful for tracing the conventional-arms public line.",
    topics: ["CFE", "Gorbachev", "U.S. policy", "Arms control"],
    nextAction:
      "Review the full file unit to determine whether this is the internal clearance memo for the January 1990 CFE public initiative."
  },
  {
    folderNaid: "470761683",
    documentTitle: "Letter to Gorbachev",
    date: "1990-03-01",
    chapter: chapters.soviet,
    documentGenre: "Memorandum",
    subjectLine:
      "Scowcroft memorandum to Bush on a presidential letter to Gorbachev, likely tied to START/CFE and summit preparation.",
    topics: ["Gorbachev", "START", "CFE", "Presidential correspondence"],
    nextAction:
      "Check the attached letter and routing notes against spring 1990 arms-control announcements and Washington summit files."
  },
  {
    folderNaid: "470761683",
    documentTitle: "START",
    date: "1990-03-01",
    chapter: chapters.soviet,
    documentGenre: "Letter",
    subjectLine:
      "Presidential letter to Gorbachev on START, a direct source candidate for the arms-control policy track.",
    topics: ["START", "Gorbachev", "Presidential correspondence", "Arms control"],
    nextAction:
      "Verify the letter text and compare it with FRUS XXXI START documents and NSC/DC arms-control files."
  },
  {
    folderNaid: "470761760",
    documentTitle: "US Policy on the USSR",
    date: "1991-05-03",
    chapter: chapters.soviet,
    documentGenre: "Talking Points",
    subjectLine:
      "Talking-points packet on U.S. policy toward the USSR during the Baltic crisis and before the Moscow summit.",
    topics: ["U.S.-Soviet relations", "Baltic states", "Gorbachev", "Policy guidance"],
    nextAction:
      "Check whether this file carries guidance for calls, Baltic status, or public posture ahead of the July 1991 summit."
  },
  {
    folderNaid: "470761760",
    documentTitle: "US Policy on the USSR",
    date: "1991-05-07",
    chapter: chapters.soviet,
    documentGenre: "Memorandum",
    subjectLine:
      "Hewett memorandum to Scowcroft/Gates on U.S. policy toward the USSR in the late pre-coup period.",
    topics: ["U.S.-Soviet relations", "Hewett", "Scowcroft", "Gates"],
    nextAction:
      "Review with Scowcroft's Soviet internal-turmoil memoranda and the Baltic leaders meeting record."
  },
  {
    folderNaid: "470761757",
    documentTitle: "President Gorbachev's Request",
    date: "1991-05-30",
    chapter: chapters.soviet,
    documentGenre: "Paper",
    subjectLine:
      "Policy paper on Gorbachev's food or credit request, preceding the June 1991 agricultural credit public announcement.",
    topics: ["Gorbachev", "Food assistance", "Grain credits", "Soviet economy"],
    nextAction:
      "Extract the paper and compare it with the June 4 and June 6 credit-guarantee memoranda."
  },
  {
    folderNaid: "470761763",
    documentTitle: "Extension of Additional Grain Credit Guarantees to the",
    date: "1991-06-06",
    chapter: chapters.soviet,
    documentGenre: "Memorandum",
    subjectLine:
      "Hewett memorandum to Scowcroft on extending additional grain credit guarantees to the Soviet Union.",
    topics: ["Grain credits", "Food assistance", "Soviet economy", "Hewett"],
    nextAction:
      "Verify the addressee and attached decision material, then pair it with the June 11 public announcement."
  },
  {
    folderNaid: "470761776",
    documentTitle: "Responding to the Implications of Developments",
    date: "1991-09-03",
    chapter: chapters.collapse,
    documentGenre: "Memorandum",
    subjectLine:
      "Post-coup Gompert/Hewett memorandum for managing Soviet, Russian, and republic policy after the failed coup.",
    topics: ["August coup aftermath", "Gompert", "Hewett", "Republics policy"],
    nextAction:
      "Check the surrounding meeting packet for decision points on recognition, aid, nuclear control, and Gorbachev/Yeltsin balance."
  },
  {
    folderNaid: "470761778",
    documentTitle: "Messages to Allies",
    date: "1991-11-01",
    chapter: chapters.collapse,
    documentGenre: "Memorandum",
    subjectLine:
      "Gompert memorandum to Scowcroft on messages to allies around food assistance and late-Soviet support.",
    topics: ["Allies", "Food assistance", "Humanitarian aid", "Soviet economy"],
    nextAction:
      "Review for burden-sharing strategy and compare with public food-assistance statements in October-November 1991."
  },
  {
    folderNaid: "470761790",
    documentTitle: "Boris Yeltsin's Letter",
    date: "1992-01-27",
    chapter: chapters.collapse,
    documentGenre: "Memorandum",
    subjectLine:
      "Hewett memorandum to Scowcroft on Yeltsin's letter before the Camp David meeting and early U.S.-Russian relationship definition.",
    topics: ["Yeltsin", "Russia policy", "Camp David", "Presidential correspondence"],
    nextAction:
      "Review the attached letter and compare with the January 29 pre-briefing file and February 1 public news conference."
  },
  {
    folderNaid: "470761796",
    documentTitle: "ESSG Meeting",
    date: "1992-02-19",
    chapter: chapters.collapse,
    documentGenre: "Memorandum",
    subjectLine:
      "Gompert memorandum for an ESSG meeting on Baker's trip to Russia and the Asian republics of the former Soviet Union.",
    topics: ["ESSG", "Baker trip", "Asian republics", "Former Soviet Union"],
    nextAction:
      "Use the packet to identify U.S. interests and assistance lines for non-Russian successor states."
  },
  {
    folderNaid: "470761796",
    documentTitle: "Secretary Baker's Trip to the Asian Republics of the FSU",
    date: "1992-02-19",
    chapter: chapters.collapse,
    documentGenre: "Memorandum",
    subjectLine:
      "Hewett memorandum to Scowcroft on Baker's trip to the Asian republics of the former Soviet Union and Russia.",
    topics: ["Baker", "Asian republics", "Russia", "Former Soviet Union"],
    nextAction:
      "Extract the memorandum and attached guidance for Central Asian republic recognition, assistance, and Russian sensitivities."
  },
  {
    folderNaid: "470761796",
    documentTitle: "US Interests",
    date: "1992-02-19",
    chapter: chapters.collapse,
    documentGenre: "Paper",
    subjectLine:
      "US Interests paper attached to the Baker trip/ESSG packet for the Asian republics and Russia.",
    topics: ["U.S. interests", "Asian republics", "Russia", "Successor states"],
    nextAction:
      "Check whether the paper frames bilateral recognition, energy, nuclear, reform, or regional-security issues."
  },
  {
    folderNaid: "470761800",
    documentTitle: "Possible Phone Call from Boris Yeltsin",
    date: "1992-03-20",
    chapter: chapters.collapse,
    documentGenre: "Memorandum",
    subjectLine:
      "Hewett memorandum to Scowcroft on a possible Yeltsin call as aid, reform, and former Soviet nuclear policy moved quickly.",
    topics: ["Yeltsin", "Telephone call", "Russia reform", "Aid package"],
    nextAction:
      "Review the memo, page-two attachment, and talking points against the March 19 and March 23 public call statements."
  },
  {
    folderNaid: "470761800",
    documentTitle: "Talking Points Points to be Made for Telephone Call with Russian President",
    date: "1992-03-01",
    chapter: chapters.collapse,
    documentGenre: "Talking Points",
    subjectLine:
      "Talking points for a presidential telephone call with Russian President Yeltsin.",
    topics: ["Yeltsin", "Telephone call", "Russia policy", "Talking points"],
    nextAction:
      "Extract and compare with the related Yeltsin public call statements and telcon records."
  },
  {
    folderNaid: "470761811",
    documentTitle: "Official Working Visit of President Nazarbayev of",
    date: "1992-05-14",
    chapter: chapters.collapse,
    documentGenre: "Memorandum",
    subjectLine:
      "Briefing memorandum for Nazarbayev's official working visit, preceding the May 19 Kazakhstan declaration.",
    topics: ["Nazarbayev", "Kazakhstan", "Nuclear inheritance", "Visit preparation"],
    nextAction:
      "Use with the May 19 Daily File and memcon to extract nuclear, assistance, and bilateral-policy guidance."
  },
  {
    folderNaid: "470761811",
    documentTitle: "Talking Points Points to be Made in Initial Three-on-Three Meeting with Kazakh",
    date: "1992-05-19",
    chapter: chapters.collapse,
    documentGenre: "Talking Points",
    subjectLine:
      "Initial small-meeting talking points for Bush's discussion with President Nazarbayev.",
    topics: ["Nazarbayev", "Kazakhstan", "Talking points", "Nuclear inheritance"],
    nextAction:
      "Compare the talking points with the released meeting memorandum and public declaration."
  },
  {
    folderNaid: "470761822",
    documentTitle: "Freedom Support Act",
    date: "1992-08-26",
    chapter: chapters.collapse,
    documentGenre: "Cover Sheet",
    subjectLine:
      "Transmittal and letter material on the FREEDOM Support Act, including a presidential message to Yeltsin.",
    topics: ["FREEDOM Support Act", "Yeltsin", "Congress", "Aid implementation"],
    nextAction:
      "Review the letter and Wayne memorandum to connect legislative strategy with Russian reform diplomacy."
  },
  {
    folderNaid: "470761828",
    documentTitle: "FREEDOM Support Act Conference Papers",
    date: "1992-09-02",
    chapter: chapters.collapse,
    documentGenre: "Document",
    subjectLine:
      "Conference papers for the FREEDOM Support Act, including issue papers and draft Eagleburger letter material.",
    topics: ["FREEDOM Support Act", "Conference papers", "Congress", "Assistance"],
    nextAction:
      "Extract issue papers to identify congressional compromises and implementation concerns before the October signing."
  },
  {
    folderNaid: "470761828",
    documentTitle: "Draft Eagleburger letter to Conferees",
    date: "1992-09-01",
    chapter: chapters.collapse,
    documentGenre: "Draft Letter",
    subjectLine:
      "Draft Eagleburger letter to congressional conferees on FREEDOM Support Act issues.",
    topics: ["FREEDOM Support Act", "Eagleburger", "Congress", "Assistance"],
    nextAction:
      "Use with the conference papers to understand State/NSC positions on the final assistance bill."
  },
  {
    folderNaid: "470761831",
    documentTitle: "US Interests and Options",
    date: "1992-10-14",
    chapter: chapters.collapse,
    documentGenre: "Paper",
    subjectLine:
      "US Interests and Options paper attached to an October 1992 Deputies Committee meeting packet.",
    topics: ["U.S. interests", "Russia policy", "Deputies Committee", "Transition"],
    nextAction:
      "Review with NSC/DC files to determine whether this paper frames late-Bush policy toward Russia or the FSU."
  },
  {
    folderNaid: "470761831",
    documentTitle: "Proposed Message to Ambassador Strauss",
    date: "1992-10-09",
    chapter: chapters.collapse,
    documentGenre: "Memorandum",
    subjectLine:
      "Hewett memorandum to Scowcroft on a proposed message to Ambassador Strauss, attached to US interests/options material.",
    topics: ["Strauss", "Russia", "U.S. interests", "Moscow Embassy"],
    nextAction:
      "Check whether the message concerns U.S.-Russian relations, FREEDOM Support, or transition priorities."
  },
  {
    folderNaid: "470761838",
    documentTitle: "Significant US Commitments to Russia",
    date: "1992-12-02",
    chapter: chapters.collapse,
    documentGenre: "Paper",
    subjectLine:
      "Transition paper listing significant U.S. commitments to Russia in late 1992.",
    topics: ["Russia", "Transition", "U.S. commitments", "Aid implementation"],
    nextAction:
      "Use with December 1992 transition papers to identify obligations, pending deliverables, and Clinton handoff issues."
  },
  {
    folderNaid: "470761838",
    documentTitle: "US Commitments and Obligations to Ukraine",
    date: "1992-12-01",
    chapter: chapters.collapse,
    documentGenre: "Paper",
    subjectLine:
      "Transition paper listing U.S. commitments and obligations to Ukraine.",
    topics: ["Ukraine", "Transition", "Nuclear inheritance", "U.S. commitments"],
    nextAction:
      "Compare with Kravchuk correspondence, Nunn-Lugar records, and START/Lisbon implementation material."
  },
  {
    folderNaid: "470761839",
    documentTitle: "Ukraine",
    date: "1993-01-15",
    chapter: chapters.collapse,
    documentGenre: "Letter",
    subjectLine:
      "Presidential letter to Kravchuk on Ukraine during the final Bush administration handoff period.",
    topics: ["Ukraine", "Kravchuk", "Transition", "Presidential correspondence"],
    nextAction:
      "Verify the letter text and compare with nuclear nonproliferation and START II transition materials."
  },
  {
    folderNaid: "470761839",
    documentTitle: "Letter to Ukrainian President Kravchuk",
    date: "1993-01-14",
    chapter: chapters.collapse,
    documentGenre: "Document",
    subjectLine:
      "Draft letter/cable packet responding to President Kravchuk's December 31 message.",
    topics: ["Ukraine", "Kravchuk", "Nuclear inheritance", "Transition"],
    nextAction:
      "Open the page images and correct the OCR date before final selection; use as a pointer to the January 1993 Ukraine correspondence packet."
  }
];

function catalogUrl(naid) {
  return `https://catalog.archives.gov/id/${naid}`;
}

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 88);
}

function compact(text) {
  return String(text || "").replace(/\s+/g, " ").trim();
}

function normalize(text) {
  return compact(text).toLowerCase().replace(/\s+-\s+/g, "-");
}

function byChapterThenDate(a, b) {
  return (
    a.chapter.number - b.chapter.number ||
    (a.sortDate || a.date).localeCompare(b.sortDate || b.date) ||
    (a.sortOrder || 0) - (b.sortOrder || 0) ||
    a.title.localeCompare(b.title)
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

function findGovinfo(records, selection) {
  const targetTitle = normalize(selection.publicTitle);
  return records.find(
    (record) =>
      record.date === selection.date &&
      record.type === "Public Statement" &&
      record.source?.shortName === "GovInfo Public Papers" &&
      normalize(record.title) === targetTitle
  );
}

function publicStatementUrl(record) {
  return (
    record?.govinfoPublicPapers?.htmlUrl ||
    record?.govinfoPublicPapers?.detailsUrl ||
    record?.govinfoPublicPapers?.pdfUrl ||
    record?.pdfUrl ||
    record?.catalogUrl ||
    govinfoCollectionUrl
  );
}

function sourceFamilyList(selection) {
  return selection.sourceKeys.map((key) => {
    const family = sourceFamilies[key];
    if (!family) throw new Error(`Unknown source family key: ${key}`);
    return { key, ...family };
  });
}

function familyLabels(families) {
  return families.map((family) => family.label).join("; ");
}

function publicAnchorRecord(selection, govinfoRecord, index) {
  const families = sourceFamilyList(selection);
  const primarySource = sourceFamilies[selection.primarySourceKey] || families[0];
  const statementUrl = publicStatementUrl(govinfoRecord);

  return {
    id: `public-anchor-${selection.date}-${slugify(selection.title)}`,
    date: selection.date,
    sortDate: selection.date,
    sortOrder: 780 + index,
    type: "Policy Lead",
    title: selection.title,
    documentTitle: selection.title,
    documentGenre: "Public-statement policy packet lead",
    participants: selection.participants || ["George H. W. Bush", "National Security Council staff"],
    countries: selection.countries,
    chapter: selection.chapter,
    releaseStatus: "Public statement located; archival source families mapped",
    catalogUrl: primarySource.url,
    pdfUrl: statementUrl,
    digitalObjects: govinfoRecord?.digitalObjects || 1,
    source: {
      type: "Source map",
      title: "GovInfo Public Papers plus NARA/Bush Library policy source families",
      shortName: "Public-to-archive source map",
      url: govinfoCollectionUrl
    },
    dateLine: `${dateLine(selection.date)} public statement; internal packet to locate`,
    subjectLine: selection.subjectLine,
    sourceNote: `Public statement trigger: ${selection.publicTitle}, ${dateLine(
      selection.date
    )}. GovInfo URL: ${statementUrl}. Checked source families: ${familyLabels(families)}.`,
    frusSourceNote:
      "Public-statement anchor only. Locate and cite the internal archival memorandum, briefing packet, decision paper, or clearance record before final FRUS selection.",
    topics: selection.topics,
    potentialFrusDocument: true,
    countStatus: "Public-statement anchored Volume IV policy-packet lead",
    nextAction: selection.nextAction,
    volumeRole: "volume-iv-policy-candidate",
    volumeStatus: "Volume IV policy-packet lead",
    frusVolume: volumeIv,
    publicStatementAnchor: {
      id: govinfoRecord?.id || "",
      title: selection.publicTitle,
      date: selection.date,
      url: statementUrl,
      packageId: govinfoRecord?.govinfoPublicPapers?.packageId || ""
    },
    sourceFamilies: families,
    seedBatch
  };
}

function findCentralCandidate(candidates, selection) {
  const title = normalize(selection.documentTitle);
  const matches = candidates.filter(
    (candidate) => candidate.folderNaid === selection.folderNaid && normalize(candidate.documentTitle) === title
  );
  if (matches.length === 1) return matches[0];
  if (matches.length > 1 && selection.date) {
    const datedMatches = matches.filter((candidate) => candidate.documentDate === selection.date);
    if (datedMatches.length === 1) return datedMatches[0];
  }
  if (matches.length > 1 && selection.documentGenre) {
    const typeMatches = matches.filter((candidate) => normalize(candidate.documentType) === normalize(selection.documentGenre));
    if (typeMatches.length === 1) return typeMatches[0];
  }

  const looseMatches = candidates.filter(
    (candidate) =>
      candidate.folderNaid === selection.folderNaid &&
      (normalize(candidate.documentTitle).startsWith(title) || title.startsWith(normalize(candidate.documentTitle)))
  );
  if (looseMatches.length === 1) return looseMatches[0];
  if (looseMatches.length > 1 && selection.date) {
    const datedLooseMatches = looseMatches.filter((candidate) => candidate.documentDate === selection.date);
    if (datedLooseMatches.length === 1) return datedLooseMatches[0];
  }
  if (looseMatches.length > 1 && selection.documentGenre) {
    const typeLooseMatches = looseMatches.filter(
      (candidate) => normalize(candidate.documentType) === normalize(selection.documentGenre)
    );
    if (typeLooseMatches.length === 1) return typeLooseMatches[0];
  }

  throw new Error(
    `Expected one central candidate for ${selection.folderNaid} / ${selection.documentTitle}; exact=${matches.length}, loose=${looseMatches.length}`
  );
}

function centralDocumentRecord(selection, candidate, folder, index) {
  const date = selection.date || candidate.documentDate || candidate.folderDate;
  const documentTitle = selection.title || candidate.documentTitle;
  const sourceTitle = "European and Eurasian Directorate Central Chronological Files";

  return {
    id: `public-anchor-central-doc-${date}-${candidate.localIdentifier}-${slugify(documentTitle)}-${candidate.folderNaid}`,
    date,
    sortDate: date,
    sortOrder: 820 + index,
    type: "Policy Memorandum",
    title: documentTitle,
    documentTitle,
    documentGenre: selection.documentGenre || candidate.documentType,
    participants: selection.participants || ["National Security Council", "European and Eurasian Directorate"],
    countries: selection.countries || ["United States", "Soviet Union", "Russia", "Ukraine", "Belarus", "Kazakhstan"],
    chapter: selection.chapter,
    releaseStatus: "Document title extracted from NARA OCR/withdrawal-sheet text",
    accessRestrictionStatus: folder?.accessStatus || "Restricted - Possibly",
    naid: candidate.folderNaid,
    catalogUrl: candidate.catalogUrl || catalogUrl(candidate.folderNaid),
    pdfUrl: candidate.pdfUrl || folder?.pdfUrl || "",
    localIdentifier: candidate.localIdentifier,
    objectFilename: candidate.objectFilename || folder?.objectFilename || "",
    digitalObjects: folder?.digitalObjects || 1,
    source: {
      type: "Series",
      naid: "374000108",
      title: sourceTitle,
      shortName: "NSC European/Eurasian Central Chronology",
      url: sourceFamilies.centralChronology.url
    },
    dateLine: `${dateLine(date)}; filed in ${candidate.folderTitle} file unit`,
    subjectLine: selection.subjectLine,
    sourceNote: `Source: National Archives Catalog, ${sourceTitle}, ${candidate.folderTitle}, ${candidate.localIdentifier}, NAID ${candidate.folderNaid}. OCR/withdrawal-sheet title: ${candidate.documentTitle}. Digital object: ${candidate.objectFilename}.`,
    frusSourceNote: `Source: George H.W. Bush Presidential Library, National Security Council, European and Eurasian Directorate Central Chronological Files, ${candidate.localIdentifier}, ${candidate.folderTitle}, NAID ${candidate.folderNaid}.`,
    topics: selection.topics,
    potentialFrusDocument: true,
    countStatus: "Document-level public-anchor follow-up lead",
    nextAction: selection.nextAction,
    volumeRole: "volume-iv-policy-candidate",
    volumeStatus: "Volume IV document candidate",
    frusVolume: volumeIv,
    centralChronologySearch: {
      folderTitle: candidate.folderTitle,
      folderDate: candidate.folderDate,
      matchedQueries: folder?.matchedQueries || [],
      objectFileSize: candidate.objectFileSize || folder?.objectFileSize || 0,
      candidateScore: candidate.score,
      candidateMatchedQueries: candidate.matchedQueries,
      searchReport: CENTRAL_REPORT_REF
    },
    catalogTextEvidence: compact(candidate.context),
    publicAnchorRationale:
      "Selected after comparing high-signal Public Papers moments with the same NARA/Bush Library source families used by companion compiler pages.",
    seedBatch
  };
}

function sourceLeadRecord(anchorCount, centralCount, sortOrder) {
  return {
    id: "source-lead-public-anchor-policy-map",
    date: "1989-01-20",
    sortDate: "1989-01-20",
    sortOrder,
    type: "Source Lead",
    title: "Public statements to archival policy-packet map",
    documentTitle: "Public statements to archival policy-packet map",
    participants: ["George H. W. Bush", "National Security Council staff", "FRUS compiler"],
    countries: ["United States", "Soviet Union", "Russia", "Ukraine", "Belarus", "Kazakhstan"],
    chapter: chapters.archives,
    releaseStatus: "Source-map pass generated",
    catalogUrl: govinfoCollectionUrl,
    pdfUrl: "",
    digitalObjects: anchorCount + centralCount,
    source: {
      type: "Research method",
      title: "GovInfo Public Papers cross-checked against NARA/Bush Library source families",
      shortName: "Public-to-archive source map",
      url: govinfoCollectionUrl
    },
    dateLine: "Source-map pass, May 22, 2026",
    subjectLine:
      "GovInfo Bush public statements were treated as public chronology anchors, then checked against NARA/Bush Library families used elsewhere: Scowcroft, Presidential Daily Files, NSC/DC, NSD/NSR, Central Chronology, FRUS XXXI, and related Bush Library files.",
    sourceNote: `Source map generated from GovInfo Bush Public Papers and ${CENTRAL_REPORT_REF}; source families include ${familyLabels(
      Object.values(sourceFamilies)
    )}.`,
    frusSourceNote:
      "Compiler source-map lead only; cite individual NARA/Bush Library records after selecting the internal document.",
    topics: ["Public Papers", "NARA", "Bush Library", "Source map", "Policy packets"],
    potentialFrusDocument: false,
    countStatus: "Public-anchor source-map lead",
    nextAction:
      "Use the public-anchor leads to pull internal clearance packets and document-level records before Volume IV selection.",
    volumeRole: "volume-iv-source-lead",
    volumeStatus: "Source lead",
    frusVolume: volumeIv,
    sourceFamilies: Object.entries(sourceFamilies).map(([key, family]) => ({ key, ...family })),
    seedBatch
  };
}

function main() {
  const records = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
  const centralReport = JSON.parse(fs.readFileSync(CENTRAL_REPORT_PATH, "utf8"));
  const centralCandidates = centralReport.documentCandidates || [];
  const foldersByNaid = new Map((centralReport.records || []).map((record) => [record.naid, record]));

  const anchorRecords = publicAnchorSelections.map((selection, index) => {
    const govinfo = findGovinfo(records, selection);
    if (!govinfo) throw new Error(`No GovInfo Public Papers record found for ${selection.date} / ${selection.publicTitle}`);
    return publicAnchorRecord(selection, govinfo, index + 1);
  });

  const existingDocumentKeys = new Set(
    records
      .filter((record) => record.seedBatch !== seedBatch)
      .map((record) => `${record.naid || ""}::${normalize(record.documentTitle || record.title)}`)
  );

  const centralRecords = [];
  const skippedExisting = [];
  for (const [index, selection] of supplementalCentralDocuments.entries()) {
    const candidate = findCentralCandidate(centralCandidates, selection);
    const key = `${candidate.folderNaid}::${normalize(selection.title || candidate.documentTitle)}`;
    if (existingDocumentKeys.has(key)) {
      skippedExisting.push({ folderNaid: candidate.folderNaid, documentTitle: selection.title || candidate.documentTitle });
      continue;
    }
    centralRecords.push(centralDocumentRecord(selection, candidate, foldersByNaid.get(candidate.folderNaid), index + 1));
  }

  const seeded = [sourceLeadRecord(anchorRecords.length, centralRecords.length, 910), ...anchorRecords, ...centralRecords];
  const seededIds = new Set();
  for (const record of seeded) {
    if (seededIds.has(record.id)) throw new Error(`Duplicate seed id: ${record.id}`);
    seededIds.add(record.id);
  }

  const existing = records.filter((record) => record.seedBatch !== seedBatch && !seededIds.has(record.id));
  const combined = [...existing, ...seeded].sort(byChapterThenDate);

  fs.writeFileSync(DATA_PATH, `${JSON.stringify(combined, null, 2)}\n`);
  fs.writeFileSync(JS_PATH, `window.MEMCONS = ${JSON.stringify(combined, null, 2)};\n`);
  fs.writeFileSync(
    SEED_REPORT_PATH,
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        seedBatch,
        method:
          "High-signal GovInfo Bush Public Papers rows were converted into archival policy-packet leads, then supplemented with named NARA Central Chronology documents that explain the public policy line.",
        addedRecords: seeded.length,
        sourceLeads: 1,
        publicAnchorPolicyLeads: anchorRecords.length,
        supplementalCentralDocuments: centralRecords.length,
        skippedExisting,
        publicAnchors: anchorRecords.map((record) => ({
          date: record.date,
          title: record.title,
          publicStatement: record.publicStatementAnchor.title,
          primarySource: record.sourceFamilies.find((family) => family.key === publicAnchorSelections.find((item) => item.title === record.title).primarySourceKey)?.label || ""
        })),
        centralDocuments: centralRecords.map((record) => ({
          date: record.date,
          title: record.title,
          naid: record.naid,
          localIdentifier: record.localIdentifier,
          topics: record.topics
        })),
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
        addedRecords: seeded.length,
        publicAnchorPolicyLeads: anchorRecords.length,
        supplementalCentralDocuments: centralRecords.length,
        skippedExisting: skippedExisting.length,
        totalRecords: combined.length
      },
      null,
      2
    )
  );
}

main();
