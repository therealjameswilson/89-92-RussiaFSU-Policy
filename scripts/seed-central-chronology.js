#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "..", "data", "memcons.json");
const JS_PATH = path.join(__dirname, "..", "data", "memcons.js");
const SEARCH_REPORT_PATH = path.join(__dirname, "..", "reports", "central-chronology-374000108-search.json");
const SEED_REPORT_PATH = path.join(__dirname, "..", "reports", "central-chronology-374000108-seed.json");
const SEARCH_REPORT_REF = "reports/central-chronology-374000108-search.json";

const seedBatch = "central-chronology-374000108-2026-05-21";

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

const selected = [
  {
    naid: "470761671",
    chapter: chapters.soviet,
    subjectLine:
      "December 1989 central chronology folder for Malta follow-up, East-West change, U.S.-Soviet summit implementation, and early post-Malta tasking.",
    topics: ["Malta", "Gorbachev", "START", "U.S.-Soviet relations"],
    nextAction:
      "Request or review the full folder behind the online catalog object for Malta follow-up memoranda, Scowcroft/Rice tasking, and summit implementation notes."
  },
  {
    naid: "470761682",
    chapter: chapters.soviet,
    subjectLine:
      "March 1990 central chronology folder for Lithuania's independence declaration and the administration's Baltic nonrecognition/crisis posture.",
    topics: ["Lithuania", "Baltic states", "Gorbachev", "Self-determination"],
    nextAction:
      "Check the full folder for Baltic options papers, public-guidance drafts, and notes on managing Lithuania without derailing the Gorbachev channel."
  },
  {
    naid: "470761686",
    chapter: chapters.soviet,
    subjectLine:
      "April 1990 central chronology folder for Soviet pressure on Lithuania, allied consultations, and possible U.S. response options.",
    topics: ["Lithuania", "Soviet sanctions", "Allied consultations", "Baltic crisis"],
    nextAction:
      "Use as a control file for memoranda on Soviet economic pressure, sanctions options, and Bush consultations with Congress and allies."
  },
  {
    naid: "470761693",
    chapter: chapters.soviet,
    subjectLine:
      "May 1990 central chronology folder for Washington summit preparation, START/CFE, Soviet economic questions, and Lithuania spillover.",
    topics: ["Washington summit", "Gorbachev", "START", "CFE", "Lithuania"],
    nextAction:
      "Request the folder for summit briefing papers, economic-cooperation memoranda, arms-control talking points, and Baltic contingency material."
  },
  {
    naid: "470761735",
    chapter: chapters.soviet,
    subjectLine:
      "January 1991 central chronology folder for Soviet military action in Lithuania and the administration's Baltic crisis response.",
    topics: ["Lithuania", "Soviet military intervention", "Baltic crisis", "Crisis response"],
    nextAction:
      "Mine the folder for situation reports, sanctions recommendations, public lines, and presidential decision notes on Soviet force in Lithuania."
  },
  {
    naid: "470761765",
    chapter: chapters.soviet,
    subjectLine:
      "July 1991 central chronology folder for the Moscow summit, START signing, and the Kiev/Ukraine policy line before the August coup.",
    topics: ["Moscow summit", "START I", "Kiev", "Ukraine", "Kravchuk"],
    nextAction:
      "Use as the chronology control point for START signing, Kiev speech drafts, Ukraine guidance, and republic-policy memoranda."
  },
  {
    naid: "470761771",
    chapter: chapters.collapse,
    subjectLine:
      "August 1991 central chronology folder likely spanning the coup crisis, Yeltsin/Gorbachev contacts, Ukraine, Nazarbayev, and Baltic follow-up.",
    topics: ["August coup", "Yeltsin", "Gorbachev", "Ukraine", "Nazarbayev", "Baltic states"],
    nextAction:
      "Request the full folder and compare against August 19-22 Daily Files, NSC/DC crisis records, and Volume III telcon anchors."
  },
  {
    naid: "470761772",
    chapter: chapters.collapse,
    subjectLine:
      "Second August 1991 central chronology folder with heavy Yeltsin/Gorbachev/Ukraine/Kravchuk matching for coup and immediate post-coup policy.",
    topics: ["August coup", "Yeltsin", "Gorbachev", "Ukraine", "Kravchuk"],
    nextAction:
      "Use this as an additional August coup control folder for decision chronology, republic contacts, and post-coup recognition planning."
  },
  {
    naid: "470761776",
    chapter: chapters.collapse,
    subjectLine:
      "September 1991 central chronology folder for post-coup nuclear initiatives, START, CFE, Gorbachev/Yeltsin, and republic policy.",
    topics: ["Presidential Nuclear Initiatives", "START", "CFE", "Yeltsin", "Gorbachev"],
    nextAction:
      "Mine for memoranda behind the September 27 nuclear initiatives, Soviet/republic responses, and arms-control implementation planning."
  },
  {
    naid: "470761782",
    chapter: chapters.collapse,
    subjectLine:
      "November 1991 central chronology folder for food assistance, Yeltsin/Gorbachev/Kravchuk contacts, and the late-Soviet republic transition.",
    topics: ["Food assistance", "Yeltsin", "Gorbachev", "Kravchuk", "Republics policy"],
    nextAction:
      "Request the folder to connect food-aid decisions, republic debt/distribution questions, and dissolution planning."
  },
  {
    naid: "470761788",
    chapter: chapters.collapse,
    subjectLine:
      "December 1991 central chronology folder for Soviet dissolution, CIS recognition, Ukraine, Russia, nuclear control, and FREEDOM Support groundwork.",
    topics: ["Soviet dissolution", "CIS", "Recognition", "Ukraine", "Nuclear control"],
    nextAction:
      "Review with the December 25 Public Papers statements and Daily File packets for recognition, embassy transition, and nuclear assurance memoranda."
  },
  {
    naid: "470761794",
    chapter: chapters.collapse,
    subjectLine:
      "February 1992 central chronology folder for Russia/Ukraine/Kazakhstan, Nunn-Lugar, START, nuclear issues, CFE, and early post-Soviet assistance.",
    topics: ["Nunn-Lugar", "Ukraine", "Kazakhstan", "START", "Nuclear inheritance"],
    nextAction:
      "Use as a bridge between the Kravchuk/Nazarbayev visit files, Nunn-Lugar source copies, and early nuclear-removal policy."
  },
  {
    naid: "470761800",
    chapter: chapters.collapse,
    subjectLine:
      "March 1992 central chronology folder matching Nunn-Lugar, Lisbon, Kravchuk, Kazakhstan, START, and nuclear assistance terms.",
    topics: ["Nunn-Lugar", "Lisbon Protocol", "Ukraine", "Kazakhstan", "START", "Nuclear assistance"],
    nextAction:
      "Search for Lisbon Protocol preparation, Nunn-Lugar implementation, and Ukraine/Kazakhstan nuclear-withdrawal material."
  },
  {
    naid: "470761802",
    chapter: chapters.collapse,
    subjectLine:
      "April 1992 central chronology folder for the former Soviet Union aid package, FREEDOM Support legislation, START/CFE, and republic policy.",
    topics: ["FREEDOM Support Act", "Aid package", "START", "CFE", "Former Soviet Union"],
    nextAction:
      "Request the full file for administration strategy on assistance legislation, G-7/IMF coordination, and congressional messaging."
  },
  {
    naid: "470761810",
    chapter: chapters.collapse,
    subjectLine:
      "May 1992 central chronology folder for Kravchuk and Nazarbayev visit month, Lisbon/START protocol, nuclear inheritance, and republic relations.",
    topics: ["Kravchuk", "Nazarbayev", "Lisbon Protocol", "START", "Nuclear inheritance"],
    nextAction:
      "Use alongside Kravchuk/Nazarbayev memcons and Daily Files to identify missing policy memoranda, briefing tabs, and follow-up tasking."
  },
  {
    naid: "470761817",
    chapter: chapters.collapse,
    subjectLine:
      "June 1992 central chronology folder for the Yeltsin summit package, Lisbon/START, Nunn-Lugar, strategic arms, nuclear safety, and COCOM.",
    topics: ["Yeltsin", "START II", "Nunn-Lugar", "COCOM", "Nuclear safety"],
    nextAction:
      "Mine for Yeltsin summit implementation material, weapons-safeguarding agreement follow-up, defense conversion, and export-control policy."
  },
  {
    naid: "470761823",
    chapter: chapters.collapse,
    subjectLine:
      "August 1992 central chronology folder for Nunn-Lugar, Ukraine, Belarus, Kazakhstan, Yeltsin, nuclear issues, and post-Lisbon implementation.",
    topics: ["Nunn-Lugar", "Ukraine", "Belarus", "Kazakhstan", "Nuclear implementation"],
    nextAction:
      "Request the full folder for post-Lisbon implementation, assistance authorities, and non-Russian republic nuclear-removal follow-up."
  },
  {
    naid: "470761829",
    chapter: chapters.collapse,
    subjectLine:
      "October 1992 central chronology folder for Nunn-Lugar, Lisbon/START, FREEDOM Support Act signing, Ukraine, and nuclear implementation.",
    topics: ["FREEDOM Support Act", "Nunn-Lugar", "Lisbon Protocol", "START", "Ukraine"],
    nextAction:
      "Use as the NSC chronology control for FREEDOM Support signing and late-1992 nuclear assistance implementation."
  },
  {
    naid: "470761837",
    chapter: chapters.collapse,
    subjectLine:
      "December 1992 central chronology folder for START II, Nunn-Lugar, Lisbon/START ratification, Ukraine, Yeltsin, and transition handoff.",
    topics: ["START II", "Nunn-Lugar", "Lisbon Protocol", "Yeltsin", "Transition"],
    nextAction:
      "Request the folder for final Bush administration START II, Nunn-Lugar, Ukraine nuclear, and transition memoranda."
  }
];

const selectedDocuments = [
  {
    naid: "470761655",
    date: "1989-09-01",
    chapter: chapters.soviet,
    documentGenre: "Briefing Paper",
    documentTitle: "U.S.-Soviet Ministerial in Wyoming, September 21-24",
    subjectLine:
      "Opening Baker-Shevardnadze ministerial policy package covering arms control, regional issues, and the administration's early Soviet agenda before Malta.",
    topics: ["Wyoming ministerial", "Baker-Shevardnadze", "Arms control", "U.S.-Soviet agenda"],
    nextAction:
      "Review the folder text and images for the briefing tabs that framed Baker's September 1989 agenda with Shevardnadze."
  },
  {
    naid: "470761668",
    date: "1989-11-09",
    chapter: chapters.soviet,
    documentGenre: "Memorandum",
    documentTitle: "Issues for Malta Meeting",
    subjectLine:
      "Pre-Malta Scowcroft/Rice-era issue memorandum for the first Bush-Gorbachev summit and the policy lines to test with Moscow.",
    topics: ["Malta", "Gorbachev", "Summit preparation", "U.S.-Soviet relations"],
    nextAction:
      "Compare with the Malta memcons in Volume III and pull any policy issue tabs that are not duplicated in the summit volume."
  },
  {
    naid: "470761668",
    date: "1989-11-17",
    chapter: chapters.soviet,
    documentGenre: "Memorandum",
    documentTitle: "Meeting with Specialists on the Soviet Union",
    subjectLine:
      "President's pre-Malta consultation with outside Soviet specialists, useful for reconstructing the administration's assumptions about reform and instability.",
    topics: ["Malta", "Soviet reform", "Outside experts", "Policy assumptions"],
    nextAction:
      "Check the full packet for participant list, advice to Bush, and any follow-up tasking into Malta briefing materials."
  },
  {
    naid: "470761668",
    date: "1989-11-18",
    chapter: chapters.soviet,
    documentGenre: "Memorandum",
    documentTitle: "Meeting with Specialists on East-West Relations",
    subjectLine:
      "Second pre-Malta specialist consultation on East-West relations, Germany, and the broader U.S.-Soviet negotiating environment.",
    topics: ["Malta", "East-West relations", "Germany", "Soviet reform"],
    nextAction:
      "Use with the November 17 Soviet-specialists packet to reconstruct non-government advice before the Malta summit."
  },
  {
    naid: "470761682",
    date: "1990-03-12",
    chapter: chapters.soviet,
    documentGenre: "Memorandum",
    documentTitle: "Status of Work in Steering Group",
    subjectLine:
      "Post-Malta steering-group follow-up memorandum tracking the interagency work program before the Washington summit.",
    topics: ["Malta follow-up", "Steering Group", "Washington summit", "Interagency process"],
    nextAction:
      "Review against NSC/DC follow-up files for the policy items that moved from Malta into spring 1990 summit preparation."
  },
  {
    naid: "470761695",
    date: "1990-05-07",
    chapter: chapters.soviet,
    documentGenre: "Memorandum",
    documentTitle: "Lithuania",
    subjectLine:
      "NSC memorandum on Lithuania during Soviet economic pressure and the administration's effort to balance Baltic policy with the Gorbachev channel.",
    topics: ["Lithuania", "Baltic crisis", "Gorbachev", "Self-determination"],
    nextAction:
      "Check for options language, pressure points, and whether the memorandum informed Bush's public or private line on Lithuania."
  },
  {
    naid: "470761692",
    date: "1990-05-17",
    chapter: chapters.soviet,
    documentGenre: "Memorandum",
    documentTitle: "Briefing the President for the US-Soviet Summit",
    subjectLine:
      "Washington summit briefing memorandum for Bush before the May-June 1990 meetings with Gorbachev.",
    topics: ["Washington summit", "Gorbachev", "START", "CFE", "Lithuania"],
    nextAction:
      "Use this as a control record for summit briefing tabs that belong in Volume IV rather than the Volume III memcon record."
  },
  {
    naid: "470761692",
    date: "1990-05-17",
    chapter: chapters.soviet,
    documentGenre: "Memorandum",
    documentTitle: "President's Meeting with Lithuanian Prime Minister Prunskiene",
    subjectLine:
      "Briefing memorandum for Bush's meeting with Lithuanian Prime Minister Kazimira Prunskiene amid the independence crisis.",
    topics: ["Lithuania", "Prunskiene", "Baltic states", "Soviet pressure"],
    nextAction:
      "Review for talking points on recognition, self-determination, Soviet pressure, and impact on Washington summit diplomacy."
  },
  {
    naid: "470761721",
    date: "1990-09-19",
    chapter: chapters.soviet,
    documentGenre: "Letter",
    documentTitle: "Business/Economic Relations with the USSR",
    subjectLine:
      "Mosbacher-to-Bush economic relations paper on business ties with the USSR as Soviet reform and U.S. commercial policy intersected.",
    topics: ["Soviet economy", "Commerce", "Mosbacher", "Economic policy"],
    nextAction:
      "Check the full folder for the attached Scowcroft/Burns routing memoranda and any presidential decision markings."
  },
  {
    naid: "470761721",
    date: "1990-10-29",
    chapter: chapters.soviet,
    documentGenre: "Memorandum",
    documentTitle: "Concerns about Soviet Troops",
    subjectLine:
      "Gompert/Gates memorandum on Soviet troop issues, a useful policy lead for the military-strategic side of late-1990 Soviet policy.",
    topics: ["Soviet troops", "Gates", "Gompert", "Security policy"],
    nextAction:
      "Review for whether the troop issue concerns Eastern Europe, the Baltics, or force-withdrawal negotiations."
  },
  {
    naid: "470761725",
    date: "1990-10-01",
    chapter: chapters.soviet,
    documentGenre: "Briefing Item",
    documentTitle: "Breakfast Meeting Item re START and U.S.-Soviet Summit",
    subjectLine:
      "Small-group breakfast item on START and U.S.-Soviet summit planning after the Washington summit and before late-1990 arms-control decisions.",
    topics: ["START", "Summit planning", "Arms control", "U.S.-Soviet relations"],
    nextAction:
      "Reconcile with START records from Volume XXXI and determine whether this item belongs as a policy bridge note."
  },
  {
    naid: "470761756",
    date: "1991-05-01",
    chapter: chapters.soviet,
    documentGenre: "Cable",
    documentTitle: "RSFSR Foreign Minister Kozyrev Discusses Planned Yeltsin Visit",
    subjectLine:
      "Cable on Kozyrev's Washington consultations and the planned Yeltsin visit, marking the administration's early direct channel to Russian republic leaders.",
    topics: ["Kozyrev", "Yeltsin", "Russian republic", "Republics policy"],
    nextAction:
      "Use to frame the pre-coup opening to Yeltsin and compare with Matlock/State reporting on Kozyrev."
  },
  {
    naid: "470761756",
    date: "1991-05-31",
    chapter: chapters.soviet,
    documentGenre: "Memorandum",
    documentTitle: "U.S. Economic Relationship with Soviet Union",
    subjectLine:
      "Scowcroft distribution-list memorandum and agenda on U.S.-Soviet economic cooperation as the administration weighed help for reform.",
    topics: ["Soviet economy", "Economic cooperation", "Yeltsin", "Gorbachev"],
    nextAction:
      "Check whether the attached agenda includes decision points on credits, trade, technical assistance, or relations with the Russian republic."
  },
  {
    naid: "470761759",
    date: "1991-05-01",
    chapter: chapters.soviet,
    documentGenre: "Report",
    documentTitle: "Report to Congress on Baltic Freedom",
    subjectLine:
      "Report lead on Baltic freedom during the post-Vilnius period and before U.S. recognition of restored Baltic independence.",
    topics: ["Baltic states", "Lithuania", "Estonia", "Latvia"],
    nextAction:
      "Use as a control for statutory reporting and congressional pressure on Baltic policy."
  },
  {
    naid: "470761763",
    date: "1991-06-04",
    chapter: chapters.soviet,
    documentGenre: "Memorandum",
    documentTitle: "President Gorbachev's Request for Grain Credit Guarantees",
    subjectLine:
      "Policy memorandum on Gorbachev's request for grain credit guarantees, central to the food-aid/economic-support strand of 1991 Soviet policy.",
    topics: ["Gorbachev", "Grain credits", "Food assistance", "Soviet economy"],
    nextAction:
      "Review alongside Treasury/Agriculture material and Public Papers statements on Soviet food assistance."
  },
  {
    naid: "470761763",
    date: "1991-06-12",
    chapter: chapters.soviet,
    documentGenre: "Memorandum",
    documentTitle: "Presidential Meeting on U.S.-Soviet Relations",
    subjectLine:
      "Hewett memorandum for a presidential meeting with senior cabinet officials on U.S.-Soviet relations before the Moscow summit.",
    topics: ["U.S.-Soviet relations", "Baker", "Brady", "Cheney", "Gorbachev"],
    nextAction:
      "Check the attached Scowcroft memo and any decision markings about the U.S. response to Soviet reform."
  },
  {
    naid: "470761770",
    date: "1991-08-01",
    chapter: chapters.soviet,
    documentGenre: "Paper",
    documentTitle: "Trade and Investment Issues with the USSR",
    subjectLine:
      "Trade and investment paper from the weeks before the August coup, useful for reconstructing the economic-policy lane immediately before collapse.",
    topics: ["Trade", "Investment", "USSR", "Economic policy"],
    nextAction:
      "Review with late-July/early-August Moscow summit follow-up and economic-assistance files."
  },
  {
    naid: "470761777",
    date: "1991-09-23",
    chapter: chapters.collapse,
    documentGenre: "Memorandum",
    documentTitle: "Secretary Baker's Visit to the Soviet Union",
    subjectLine:
      "Hewett memorandum on Baker's post-coup visit to the Soviet Union and meetings with Soviet, Russian, Ukrainian, and Baltic leaders.",
    topics: ["Baker", "Post-coup", "USSR", "Baltic states", "Ukraine"],
    nextAction:
      "Use with State records and Volume III contacts to identify policy documents behind Baker's post-coup trip."
  },
  {
    naid: "470761777",
    date: "1991-09-23",
    chapter: chapters.collapse,
    documentGenre: "Paper",
    documentTitle: "Key Points in Secretary Baker's Meetings in the USSR and the Baltics",
    subjectLine:
      "Substantive paper summarizing Baker's meetings in Moscow, the republics, and the Baltics after the failed coup.",
    topics: ["Baker", "USSR", "Baltic states", "Republics policy"],
    nextAction:
      "Compare the key-points paper against Baker trip memoranda and public guidance on the republics."
  },
  {
    naid: "470761777",
    date: "1991-09-25",
    chapter: chapters.collapse,
    documentGenre: "Memorandum",
    documentTitle: "Meeting with Leonid Kravchuk",
    subjectLine:
      "Scowcroft memorandum and talking points for Bush's meeting with Ukrainian leader Leonid Kravchuk after the coup and before recognition.",
    topics: ["Kravchuk", "Ukraine", "Post-coup", "Recognition"],
    nextAction:
      "Check against Volume III meeting records and Ukrainian recognition documents in December 1991."
  },
  {
    naid: "470761778",
    date: "1991-10-28",
    chapter: chapters.collapse,
    documentGenre: "Memorandum",
    documentTitle: "Meeting with Senior Advisors on Food Assistance to the USSR",
    subjectLine:
      "Presidential/senior-adviser policy lead on Soviet food assistance after the coup and before the dissolution of the USSR.",
    topics: ["Food assistance", "USSR", "Humanitarian aid", "Economic policy"],
    nextAction:
      "Review for decision points on food distribution, allied burden-sharing, and whether assistance should flow through Soviet or republic channels."
  },
  {
    naid: "470761782",
    date: "1991-12-02",
    chapter: chapters.collapse,
    documentGenre: "Memorandum",
    documentTitle: "Telephone Call to Russian President Yeltsin",
    subjectLine:
      "Scowcroft/Bush telephone-call proposal for Yeltsin as Russia emerged as the main post-Soviet interlocutor.",
    topics: ["Yeltsin", "Russia", "Telephone call", "Dissolution"],
    nextAction:
      "Compare with presidential telcons and the December 1991 recognition/collapse chronology."
  },
  {
    naid: "470761783",
    date: "1991-11-26",
    chapter: chapters.collapse,
    documentGenre: "Memorandum",
    documentTitle: "Meeting with Russian Foreign Minister Andrei Kozyrev",
    subjectLine:
      "Scowcroft memorandum and talking points for meeting Kozyrev as Russian foreign policy separated from the Soviet channel.",
    topics: ["Kozyrev", "Russia", "Yeltsin", "Republics policy"],
    nextAction:
      "Check for U.S. guidance on recognizing Russia's foreign-policy role and handling Gorbachev/Yeltsin overlap."
  },
  {
    naid: "470761783",
    date: "1991-11-19",
    chapter: chapters.collapse,
    documentGenre: "Options Paper",
    documentTitle: "Draft Options Paper",
    subjectLine:
      "Options paper in the Kozyrev file, likely tied to Russian/republic policy during the final month of the Soviet Union.",
    topics: ["Kozyrev", "Options paper", "Russia", "Soviet dissolution"],
    nextAction:
      "Request the full page images and determine whether this is a usable decision paper for the collapse chapter."
  },
  {
    naid: "470761784",
    date: "1991-11-01",
    chapter: chapters.collapse,
    documentGenre: "Memorandum",
    documentTitle: "Conversion of Defense Industries in the Former Soviet Union",
    subjectLine:
      "Atwood memorandum to the President on defense-industry conversion in the former Soviet Union, an early precursor to Nunn-Lugar implementation themes.",
    topics: ["Defense conversion", "Former Soviet Union", "Nunn-Lugar precursor", "Military industry"],
    nextAction:
      "Review with DoD and Cheney public statements for defense conversion, weapons scientists, and industrial demilitarization policy."
  },
  {
    naid: "470761786",
    date: "1991-12-26",
    chapter: chapters.collapse,
    documentGenre: "Memorandum",
    documentTitle: "Presidential Letters to Leaders of the Commonwealth States",
    subjectLine:
      "Nicholas Burns memorandum to Scowcroft on presidential letters to leaders of the new Commonwealth states after Soviet dissolution.",
    topics: ["CIS", "Recognition", "Dissolution", "Presidential letters"],
    nextAction:
      "Use with the December 25 Public Papers statement and Daily File packets to build the recognition chronology."
  },
  {
    naid: "470761786",
    date: "1991-12-01",
    chapter: chapters.collapse,
    documentGenre: "Memorandum",
    documentTitle: "Letters to Presidents of the Former Soviet Republics",
    subjectLine:
      "Scowcroft-to-Bush memorandum forwarding letters to leaders of the former Soviet republics, including Yeltsin, Kravchuk, and Belarusian leaders.",
    topics: ["Former Soviet republics", "Recognition", "Yeltsin", "Kravchuk"],
    nextAction:
      "Identify the full set of republic letters and match each to recognition and diplomatic-relations decisions."
  },
  {
    naid: "470761786",
    date: "1991-12-01",
    chapter: chapters.collapse,
    documentGenre: "Letter",
    documentTitle: "Recognition of Russia as an Independent State",
    subjectLine:
      "Bush letter to Yeltsin recognizing Russia as an independent state and setting the U.S.-Russia relationship after the Soviet Union.",
    topics: ["Recognition", "Russia", "Yeltsin", "Dissolution"],
    nextAction:
      "Check the letter text, any Scowcroft covering memorandum, and compare against public recognition statements."
  },
  {
    naid: "470761786",
    date: "1991-12-01",
    chapter: chapters.collapse,
    documentGenre: "Letter",
    documentTitle: "Recognition of Ukraine as an Independent State",
    subjectLine:
      "Bush letter to Kravchuk recognizing Ukraine, central to the republic-recognition and nuclear-inheritance story.",
    topics: ["Recognition", "Ukraine", "Kravchuk", "Nuclear inheritance"],
    nextAction:
      "Review alongside the Ukrainian independence referendum, Kravchuk contacts, and nuclear assurances material."
  },
  {
    naid: "470761786",
    date: "1991-12-01",
    chapter: chapters.collapse,
    documentGenre: "Letter",
    documentTitle: "Recognition of Belarus as an Independent State",
    subjectLine:
      "Recognition letter for Belarus, part of the administration's recognition package for nuclear-relevant former Soviet republics.",
    topics: ["Recognition", "Belarus", "CIS", "Nuclear inheritance"],
    nextAction:
      "Check whether the Belarus letter appears with nuclear-control or diplomatic-relations conditions."
  },
  {
    naid: "470761787",
    date: "1991-12-01",
    chapter: chapters.collapse,
    documentGenre: "Memorandum",
    documentTitle: "Naming a Coordinator for Assistance to the Soviet Union",
    subjectLine:
      "Assistance-coordinator memorandum during the transition from Soviet assistance to aid for Russia and the new independent states.",
    topics: ["Assistance", "Coordinator", "Former Soviet Union", "Humanitarian aid"],
    nextAction:
      "Determine whether this is the policy origin for later FREEDOM Support coordination and assistance architecture."
  },
  {
    naid: "470761789",
    date: "1991-12-01",
    chapter: chapters.collapse,
    documentGenre: "Paper",
    documentTitle: "Soviet Participation in the IMF",
    subjectLine:
      "Policy paper on Soviet or successor-state participation in the IMF as the administration managed economic integration after dissolution.",
    topics: ["IMF", "Russia", "Former Soviet Union", "Economic assistance"],
    nextAction:
      "Review with Treasury and G-7/IMF coordination documents to map the economic-support chapter."
  },
  {
    naid: "470761792",
    date: "1992-01-10",
    chapter: chapters.collapse,
    documentGenre: "Memorandum",
    documentTitle: "Independent States of Former Soviet Union",
    subjectLine:
      "Lowenkron memorandum to Scowcroft on the independent states of the former Soviet Union in the first weeks after dissolution.",
    topics: ["Independent states", "Former Soviet Union", "Recognition", "Diplomatic relations"],
    nextAction:
      "Check for the policy criteria used for full diplomatic relations and early embassy/posture decisions."
  },
  {
    naid: "470761794",
    date: "1992-02-26",
    chapter: chapters.collapse,
    documentGenre: "Memorandum",
    documentTitle: "Presidential Letters to Five CIS Republics",
    subjectLine:
      "Nicholas Burns memorandum on presidential letters to five CIS republics and the establishment of full diplomatic relations.",
    topics: ["CIS", "Diplomatic relations", "Recognition", "Presidential letters"],
    nextAction:
      "Identify the five republics and compare with State Department diplomatic-recognition records."
  },
  {
    naid: "470761796",
    date: "1992-02-13",
    chapter: chapters.collapse,
    documentGenre: "Memorandum",
    documentTitle: "Message to President Yeltsin",
    subjectLine:
      "Presidential message package to Yeltsin as U.S.-Russian relations and support for Russian reform became the core post-Soviet policy lane.",
    topics: ["Yeltsin", "Russia", "U.S.-Russian relations", "Reform"],
    nextAction:
      "Review with Yeltsin correspondence and Public Papers statements to anchor the February 1992 policy transition."
  },
  {
    naid: "470761796",
    date: "1992-02-01",
    chapter: chapters.collapse,
    documentGenre: "Letter",
    documentTitle: "US-Russian Relations",
    subjectLine:
      "Letter or message package on U.S.-Russian relations, useful for tracing how the administration defined the new bilateral relationship.",
    topics: ["U.S.-Russian relations", "Russia", "Yeltsin", "Reform"],
    nextAction:
      "Check the covering memo and determine whether the letter includes aid, recognition, or arms-control commitments."
  },
  {
    naid: "470761798",
    date: "1992-03-30",
    chapter: chapters.collapse,
    documentGenre: "Letter",
    documentTitle: "Assistance to Russia",
    subjectLine:
      "Letters to Kohl and Major on assistance to Russia ahead of spring 1992 allied coordination.",
    topics: ["Assistance to Russia", "Kohl", "Major", "G-7 coordination"],
    nextAction:
      "Use with Munich/G-7 and Public Papers assistance statements to reconstruct allied economic-support diplomacy."
  },
  {
    naid: "470761799",
    date: "1992-03-13",
    chapter: chapters.collapse,
    documentGenre: "Memorandum",
    documentTitle: "Support for Russian Economic Reform Programs",
    subjectLine:
      "Nicholas Brady memorandum to Bush and related senior-adviser material on support for Russian economic reform.",
    topics: ["Russian reform", "Economic assistance", "Brady", "Yeltsin"],
    nextAction:
      "Check the senior-adviser packet for decision points and compare against the April 1992 aid package."
  },
  {
    naid: "470761800",
    date: "1992-03-19",
    chapter: chapters.collapse,
    documentGenre: "Telcon Brief",
    documentTitle: "Telephone Call with President Kravchuk of Ukraine",
    subjectLine:
      "Briefing packet for Bush's call with Kravchuk before the Lisbon/START protocol and nuclear-assurance diplomacy.",
    topics: ["Kravchuk", "Ukraine", "Lisbon Protocol", "Nuclear inheritance"],
    nextAction:
      "Compare with telcon text, Daily File material, and Nunn-Lugar/START follow-up records."
  },
  {
    naid: "470761802",
    date: "1992-04-24",
    chapter: chapters.collapse,
    documentGenre: "Memorandum",
    documentTitle: "Response to Senator Lugar's Letter on Encouraging the Private Sector to Deal with the FSU",
    subjectLine:
      "Hewett memorandum and presidential response on Senator Lugar's proposal for private-sector engagement with the former Soviet Union.",
    topics: ["Lugar", "Private sector", "FSU assistance", "Economic reform"],
    nextAction:
      "Review with FREEDOM Support and Nunn-Lugar legislative files for congressional pressure on the administration's aid strategy."
  },
  {
    naid: "470761804",
    date: "1992-04-28",
    chapter: chapters.collapse,
    documentGenre: "Memorandum",
    documentTitle: "Meeting with First Deputy Prime Minister Yegor Gaydar",
    subjectLine:
      "Scowcroft memorandum and talking points for Bush's meeting with Gaydar, directly tied to Russian reform and aid policy.",
    topics: ["Gaydar", "Russia", "Economic reform", "Assistance"],
    nextAction:
      "Compare with the public Gaydar meeting record and any Treasury/State assistance memoranda."
  },
  {
    naid: "470761805",
    date: "1992-04-16",
    chapter: chapters.collapse,
    documentGenre: "Memorandum",
    documentTitle: "Ukraine Trip",
    subjectLine:
      "Hewett memorandum on Ukraine trip planning, before the Kravchuk visit and Lisbon nuclear protocol.",
    topics: ["Ukraine", "Hewett", "Kravchuk", "Lisbon Protocol"],
    nextAction:
      "Check for trip objectives, nuclear assurances, and U.S.-Ukrainian relationship-building language."
  },
  {
    naid: "470761805",
    date: "1992-04-21",
    chapter: chapters.collapse,
    documentGenre: "Memorandum",
    documentTitle: "Meeting on US-Ukrainian Relations",
    subjectLine:
      "Scowcroft memorandum on U.S.-Ukrainian relations, a direct policy candidate for the new independent states chapter.",
    topics: ["U.S.-Ukrainian relations", "Ukraine", "Kravchuk", "Nuclear inheritance"],
    nextAction:
      "Review for the administration's desired bilateral relationship, aid package, and nuclear-control conditions."
  },
  {
    naid: "470761811",
    date: "1992-05-01",
    chapter: chapters.collapse,
    documentGenre: "Document",
    documentTitle: "OPIC Agreements with the Newly Independent States",
    subjectLine:
      "OPIC agreements lead for the NIS economic engagement package and private-investment element of post-Soviet policy.",
    topics: ["Newly Independent States", "OPIC", "Economic assistance", "Private investment"],
    nextAction:
      "Use with assistance legislation and business-engagement records to track the economic instruments of NIS policy."
  },
  {
    naid: "470761811",
    date: "1992-05-19",
    chapter: chapters.collapse,
    documentGenre: "Memorandum",
    documentTitle: "Meeting with President Nazarbayev of Kazakhstan",
    subjectLine:
      "Scowcroft memorandum and talking points for Bush's meeting with Nazarbayev, central to Kazakhstan and nuclear-inheritance policy.",
    topics: ["Nazarbayev", "Kazakhstan", "Nuclear inheritance", "Lisbon Protocol"],
    nextAction:
      "Compare with the Nazarbayev memcon and Lisbon Protocol materials for commitments and assurances."
  },
  {
    naid: "470761812",
    date: "1992-05-06",
    chapter: chapters.collapse,
    documentGenre: "Memorandum",
    documentTitle: "Meeting with President Leonid Kravchuk of Ukraine",
    subjectLine:
      "Scowcroft memorandum and talking points for Bush's meeting with Kravchuk, including Ukraine's nuclear, aid, and bilateral agenda.",
    topics: ["Kravchuk", "Ukraine", "Nunn-Lugar", "Nuclear inheritance"],
    nextAction:
      "Review with the Kravchuk meeting record, Lisbon Protocol documents, and Nunn-Lugar assistance discussion."
  },
  {
    naid: "470761817",
    date: "1992-06-01",
    chapter: chapters.collapse,
    documentGenre: "Statement of Administration Policy",
    documentTitle: "S. 2532, FREEDOM Support Act",
    subjectLine:
      "OMB/NSC policy lead on the FREEDOM Support Act, the core legislative framework for assistance to Russia and the NIS.",
    topics: ["FREEDOM Support Act", "Assistance", "Russia", "NIS"],
    nextAction:
      "Review the statement of administration policy and compare with enacted legislation and signing statements."
  },
  {
    naid: "470761823",
    date: "1992-08-01",
    chapter: chapters.collapse,
    documentGenre: "Position Paper",
    documentTitle: "Position Papers for the FREEDOM Support Bill, S. 2532",
    subjectLine:
      "Position-paper package for the FREEDOM Support bill, including Nunn-Lugar authority and assistance-condition issues.",
    topics: ["FREEDOM Support Act", "Nunn-Lugar", "Assistance conditions", "NIS"],
    nextAction:
      "Check the position papers for administration redlines, expanded Nunn-Lugar authorities, and conditionality language."
  },
  {
    naid: "470761828",
    date: "1992-09-08",
    chapter: chapters.collapse,
    documentGenre: "Memorandum",
    documentTitle: "New CCC Guarantees and Debt Rescheduling for Russia",
    subjectLine:
      "Mulford/Green/Wonnacott memorandum on new CCC guarantees and debt rescheduling for Russia.",
    topics: ["Russia", "Debt rescheduling", "CCC guarantees", "Economic assistance"],
    nextAction:
      "Review with Treasury/Agriculture files and allied assistance coordination records."
  },
  {
    naid: "470761831",
    date: "1992-10-01",
    chapter: chapters.collapse,
    documentGenre: "Enrolled Bill",
    documentTitle: "Enrolled Bill S. 2532 / FREEDOM Support Act",
    subjectLine:
      "Enrolled-bill review for the FREEDOM Support Act at the point of final presidential action.",
    topics: ["FREEDOM Support Act", "Assistance", "Legislation", "NIS"],
    nextAction:
      "Compare the enrolled-bill packet with Bush's October 24 signing statement and implementation papers."
  },
  {
    naid: "470761832",
    date: "1992-10-07",
    chapter: chapters.collapse,
    documentGenre: "Memorandum",
    documentTitle: "Report on an Inter-Agency Review of US-Russian Relations",
    subjectLine:
      "Ed Hewett memorandum to Scowcroft transmitting an interagency review of U.S.-Russian relations in fall 1992.",
    topics: ["U.S.-Russian relations", "Interagency review", "Hewett", "Russia"],
    nextAction:
      "Treat as a high-priority policy candidate; request full text and attachments before any final FRUS selection."
  },
  {
    naid: "470761832",
    date: "1992-10-01",
    chapter: chapters.collapse,
    documentGenre: "Paper",
    documentTitle: "US-Russian Relations",
    subjectLine:
      "Paper attached to the interagency review of U.S.-Russian relations.",
    topics: ["U.S.-Russian relations", "Russia", "Yeltsin", "Policy review"],
    nextAction:
      "Review with the Hewett transmittal memorandum and the fall agenda paper as a possible compact policy set."
  },
  {
    naid: "470761832",
    date: "1992-10-01",
    chapter: chapters.collapse,
    documentGenre: "Paper",
    documentTitle: "Fall Agenda for US-Russian Partnership",
    subjectLine:
      "Seven-page paper laying out the fall 1992 agenda for U.S.-Russian partnership.",
    topics: ["U.S.-Russian partnership", "Russia", "Fall agenda", "Yeltsin"],
    nextAction:
      "Review as a likely capstone policy paper for late-1992 relations with Russia."
  },
  {
    naid: "470761832",
    date: "1992-09-03",
    chapter: chapters.collapse,
    documentGenre: "Paper",
    documentTitle: "US-Ukrainian Relations",
    subjectLine:
      "Nine-page paper on U.S.-Ukrainian relations, filed with fall 1992 policy review material.",
    topics: ["U.S.-Ukrainian relations", "Ukraine", "Kravchuk", "Nuclear inheritance"],
    nextAction:
      "Review alongside Kravchuk and Zlenko records for the administration's late-1992 Ukraine policy."
  },
  {
    naid: "470761832",
    date: "1992-10-01",
    chapter: chapters.collapse,
    documentGenre: "Paper",
    documentTitle: "Expanding Contacts with the FSU",
    subjectLine:
      "Twelve-page paper on expanding contacts with the former Soviet Union, part of the October 1992 interagency policy review packet.",
    topics: ["Former Soviet Union", "Contacts", "Assistance", "New independent states"],
    nextAction:
      "Check whether this paper covers exchange, technical assistance, business, or diplomatic-contact expansion."
  },
  {
    naid: "470761834",
    date: "1992-11-02",
    chapter: chapters.collapse,
    documentGenre: "Paper",
    documentTitle: "Messages to Yeltsin and Kravchuk",
    subjectLine:
      "November 1992 paper or message package to Yeltsin and Kravchuk during the final Bush administration transition period.",
    topics: ["Yeltsin", "Kravchuk", "Russia", "Ukraine"],
    nextAction:
      "Review for transition-era commitments, START/NPT assurances, and bilateral message language."
  },
  {
    naid: "470761838",
    date: "1992-12-04",
    chapter: chapters.collapse,
    documentGenre: "Memorandum",
    documentTitle: "Transition Papers on the Former Soviet Union",
    subjectLine:
      "Nicholas Burns memorandum to Scowcroft forwarding transition papers on the former Soviet Union.",
    topics: ["Transition", "Former Soviet Union", "Russia", "Ukraine"],
    nextAction:
      "High-priority transition handoff candidate; review all attached papers for Bush-to-Clinton policy continuity."
  },
  {
    naid: "470761838",
    date: "1992-12-01",
    chapter: chapters.collapse,
    documentGenre: "Paper",
    documentTitle: "General US Policy Issues with the New States of the Former Soviet Union",
    subjectLine:
      "Transition paper on general U.S. policy issues with the new states of the former Soviet Union.",
    topics: ["Transition", "New states", "Former Soviet Union", "Assistance"],
    nextAction:
      "Review with the specific-policy and commitments papers as a candidate editorial-note cluster or document set."
  },
  {
    naid: "470761838",
    date: "1992-12-01",
    chapter: chapters.collapse,
    documentGenre: "Paper",
    documentTitle: "Specific Policy Issues Pertaining to the Former Soviet Union",
    subjectLine:
      "Six-page transition paper on specific policy issues involving the former Soviet Union.",
    topics: ["Transition", "Former Soviet Union", "Policy issues", "Russia"],
    nextAction:
      "Request full text and compare against the final NSC transition and Clinton handoff files."
  },
  {
    naid: "470761838",
    date: "1992-12-02",
    chapter: chapters.collapse,
    documentGenre: "Memorandum",
    documentTitle: "List of US Obligations to Russia, Ukraine, and the Other CIS States",
    subjectLine:
      "Nicholas Burns memorandum listing U.S. obligations to Russia, Ukraine, and other CIS states.",
    topics: ["Russia", "Ukraine", "CIS", "Commitments", "Transition"],
    nextAction:
      "Use to audit promises and commitments made during 1992, especially nuclear, assistance, and recognition commitments."
  }
];

function byChapterThenDate(a, b) {
  return (
    a.chapter.number - b.chapter.number ||
    (a.sortDate || a.date).localeCompare(b.sortDate || b.date) ||
    (a.sortOrder || 0) - (b.sortOrder || 0) ||
    a.title.localeCompare(b.title)
  );
}

function monthYear(date) {
  const value = new Date(`${date}T00:00:00Z`);
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(value);
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 72);
}

function normalizedText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizedTitle(value) {
  return normalizedText(value)
    .toLowerCase()
    .replace(/u\.s\./g, "us")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function candidateKey(naid, title, date = "") {
  return `${String(naid || "")}|${normalizedTitle(title)}|${String(date || "")}`;
}

function significantWords(value) {
  const stopWords = new Set([
    "a",
    "an",
    "and",
    "for",
    "in",
    "of",
    "on",
    "re",
    "the",
    "to",
    "with"
  ]);
  return normalizedTitle(value)
    .split(" ")
    .filter((word) => word.length > 2 && !stopWords.has(word));
}

function fuzzyCandidate(selection, candidates) {
  const selectionTitle = normalizedTitle(selection.documentTitle);
  const selectionWords = significantWords(selection.documentTitle);
  let best = null;

  for (const candidate of candidates.filter((entry) => String(entry.folderNaid) === String(selection.naid))) {
    const candidateTitle = normalizedTitle(candidate.documentTitle);
    const candidateWords = new Set(significantWords(candidate.documentTitle));
    const overlap = selectionWords.filter((word) => candidateWords.has(word)).length;
    const containsBonus = candidateTitle.includes(selectionTitle) || selectionTitle.includes(candidateTitle) ? 20 : 0;
    const dateBonus = candidate.documentDate && candidate.documentDate === selection.date ? 5 : 0;
    const score = overlap * 4 + containsBonus + dateBonus + (candidate.score || 0) / 10;
    if (!best || score > best.score) best = { candidate, score };
  }

  return best && best.score >= 8 ? best.candidate : null;
}

function sourceLead(report) {
  return {
    id: "source-lead-central-chronology-374000108-search",
    date: "1989-01-20",
    sortDate: "1989-01-20",
    sortOrder: 1300,
    type: "Source Lead",
    title: "NSC European/Eurasian Central Chronology collection search",
    documentTitle: "European and Eurasian Directorate Central Chronological Files, NAID 374000108",
    participants: ["National Security Council", "European and Eurasian Directorate", "George Bush Library"],
    countries: ["United States", "Soviet Union", "Russia", "Ukraine", "Belarus", "Kazakhstan"],
    chapter: chapters.archives,
    releaseStatus: "Collection-specific NARA Catalog child-record and OCR search report generated",
    catalogUrl: report.collection.url,
    pdfUrl: "",
    digitalObjects: report.totalUniqueRecords,
    source: {
      type: "Series",
      naid: report.collection.naid,
      title: report.collection.title,
      shortName: report.collection.shortName,
      url: report.collection.url
    },
    dateLine: "NARA Catalog search, May 21, 2026",
    subjectLine: `Searched NAID ${report.collection.naid}, harvested ${report.totalUniqueRecords} online file units, and mined ${report.totalDocumentCandidates || 0} named policy-document candidates from NARA OCR and withdrawal-sheet text.`,
    sourceNote: `Source: National Archives Catalog, ${report.collection.title}, NAID ${report.collection.naid}. Collection-specific search report: reports/central-chronology-374000108-search.json.`,
    frusSourceNote:
      "Compiler source lead only; cite individual file units and full folder contents after Bush Library review or MDR/FOIA reconciliation.",
    topics: ["NSC chronology", "European and Eurasian Directorate", "NARA Catalog search", "Source mining"],
    potentialFrusDocument: false,
    countStatus: "Central chronology source lead",
    nextAction:
      "Use reports/central-chronology-374000108-search.json to request high-value file units, verify OCR against page images, and reconcile document titles with full folder contents at the Bush Library.",
    extractionStatus:
      "The NARA child-record endpoint returns OCR and withdrawal-sheet text for the file units; full page-image review is still required before quotation, page counts, or final FRUS selection.",
    volumeRole: "volume-iv-source-lead",
    volumeStatus: "Source lead",
    frusVolume: volumeIv,
    centralChronologySearch: {
      reportPath: SEARCH_REPORT_REF,
      totalUniqueRecords: report.totalUniqueRecords,
      totalDocumentCandidates: report.totalDocumentCandidates,
      likelyWithdrawalSheetOrSmallPdfs: report.likelyWithdrawalSheetOrSmallPdfs,
      byYear: report.byYear
    },
    seedBatch
  };
}

function chronologyRecord(selection, hit, index) {
  const source = {
    type: "Series",
    naid: hit.seriesNaid,
    title: hit.seriesTitle,
    shortName: "NSC European/Eurasian Central Chronology",
    url: `https://catalog.archives.gov/id/${hit.seriesNaid}`
  };
  return {
    id: `central-chronology-${hit.date}-${hit.localIdentifier}-${hit.naid}`,
    date: hit.date,
    sortDate: hit.date,
    sortOrder: index + 1,
    type: "Policy Lead",
    title: hit.title,
    documentTitle: hit.title,
    participants: ["National Security Council", "European and Eurasian Directorate"],
    countries: ["United States", "Soviet Union", "Russia", "Ukraine", "Belarus", "Kazakhstan"],
    chapter: selection.chapter,
    releaseStatus: "Catalog file-unit lead; NARA OCR and withdrawal-sheet text mined",
    accessRestrictionStatus: hit.accessStatus,
    naid: hit.naid,
    catalogUrl: hit.catalogUrl,
    pdfUrl: hit.pdfUrl,
    localIdentifier: hit.localIdentifier,
    objectFilename: hit.objectFilename,
    digitalObjects: hit.digitalObjects,
    source,
    dateLine: `${monthYear(hit.date)} file unit`,
    subjectLine: selection.subjectLine,
    sourceNote: `Source: National Archives Catalog, ${hit.seriesTitle}, ${hit.localIdentifier}, NAID ${hit.naid}. Digital object: ${hit.objectFilename}.`,
    frusSourceNote: `Source: George H.W. Bush Presidential Library, National Security Council, European and Eurasian Directorate Central Chronological Files, ${hit.localIdentifier}, NAID ${hit.naid}.`,
    topics: selection.topics,
    potentialFrusDocument: true,
    countStatus: "Central chronology file-unit lead",
    nextAction: selection.nextAction,
    extractionStatus:
      "Selected from the NAID 374000108 child-record harvest. NARA OCR and withdrawal-sheet text identify folder contents; full page-image review or Bush Library reconciliation is required before final extraction.",
    volumeRole: "volume-iv-policy-candidate",
    volumeStatus: "Volume IV research candidate",
    frusVolume: volumeIv,
    centralChronologySearch: {
      matchedQueries: hit.matchedQueries,
      objectFileSize: hit.objectFileSize,
      searchReport: SEARCH_REPORT_REF
    },
    seedBatch
  };
}

function evidenceFor(selection, hit, candidate) {
  const candidateContext = normalizedText(candidate?.context);
  if (candidateContext) return candidateContext.slice(0, 900);

  const text = normalizedText(hit.extractedText);
  if (!text) return selection.documentTitle;

  const matchIndex = text.toLowerCase().indexOf(selection.documentTitle.toLowerCase());
  if (matchIndex < 0) return text.slice(0, 900) || selection.documentTitle;

  const start = Math.max(0, matchIndex - 240);
  return text.slice(start, start + 900);
}

function documentRecord(selection, hit, index, candidate) {
  const source = {
    type: "Series",
    naid: hit.seriesNaid,
    title: hit.seriesTitle,
    shortName: "NSC European/Eurasian Central Chronology",
    url: `https://catalog.archives.gov/id/${hit.seriesNaid}`
  };
  const evidence = evidenceFor(selection, hit, candidate);
  return {
    id: `central-chronology-doc-${selection.date}-${hit.localIdentifier}-${slugify(selection.documentTitle)}-${hit.naid}`,
    date: selection.date,
    sortDate: selection.date,
    sortOrder: 600 + index,
    type: "Policy Memorandum",
    title: selection.documentTitle,
    documentTitle: selection.documentTitle,
    documentGenre: selection.documentGenre,
    participants: selection.participants || ["National Security Council", "European and Eurasian Directorate"],
    countries: selection.countries || ["United States", "Soviet Union", "Russia", "Ukraine", "Belarus", "Kazakhstan"],
    chapter: selection.chapter,
    releaseStatus: "Document title extracted from NARA OCR/withdrawal-sheet text",
    accessRestrictionStatus: hit.accessStatus,
    naid: hit.naid,
    catalogUrl: hit.catalogUrl,
    pdfUrl: hit.pdfUrl,
    localIdentifier: hit.localIdentifier,
    objectFilename: hit.objectFilename,
    digitalObjects: hit.digitalObjects,
    source,
    dateLine: `${selection.date}; filed in ${monthYear(hit.date)} file unit`,
    subjectLine: selection.subjectLine,
    sourceNote: `Source: National Archives Catalog, ${hit.seriesTitle}, ${hit.title}, ${hit.localIdentifier}, NAID ${hit.naid}. OCR/withdrawal-sheet title: ${selection.documentTitle}. Digital object: ${hit.objectFilename}.`,
    frusSourceNote: `Source: George H.W. Bush Presidential Library, National Security Council, European and Eurasian Directorate Central Chronological Files, ${hit.localIdentifier}, ${hit.title}, NAID ${hit.naid}.`,
    topics: selection.topics,
    potentialFrusDocument: true,
    countStatus: "Document-level central chronology lead",
    nextAction: selection.nextAction,
    extractionStatus:
      "Named in NARA Catalog OCR or withdrawal-sheet text from the file unit. Verify against the page images/full folder before quotation, page count, or final FRUS selection.",
    volumeRole: "volume-iv-policy-candidate",
    volumeStatus: "Volume IV document candidate",
    frusVolume: volumeIv,
    centralChronologySearch: {
      folderTitle: hit.title,
      folderDate: hit.date,
      matchedQueries: hit.matchedQueries,
      objectFileSize: hit.objectFileSize,
      candidateScore: candidate?.score || null,
      candidateMatchedQueries: candidate?.matchedQueries || [],
      searchReport: SEARCH_REPORT_REF
    },
    catalogTextEvidence: evidence || selection.documentTitle,
    seedBatch
  };
}

function main() {
  const records = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
  const report = JSON.parse(fs.readFileSync(SEARCH_REPORT_PATH, "utf8"));
  const byNaid = new Map(report.records.map((record) => [record.naid, record]));
  const candidates = report.documentCandidates || [];
  const candidateByExact = new Map();
  const candidateByTitle = new Map();
  for (const candidate of candidates) {
    const exactKey = candidateKey(candidate.folderNaid, candidate.documentTitle, candidate.documentDate);
    const titleKey = candidateKey(candidate.folderNaid, candidate.documentTitle);
    if (!candidateByExact.has(exactKey)) candidateByExact.set(exactKey, candidate);
    if (!candidateByTitle.has(titleKey)) candidateByTitle.set(titleKey, candidate);
  }

  const seededRecords = selected.map((selection, index) => {
    const hit = byNaid.get(selection.naid);
    if (!hit) throw new Error(`No central chronology hit for NAID ${selection.naid}`);
    return chronologyRecord(selection, hit, index);
  });
  const seededDocuments = selectedDocuments.map((selection, index) => {
    const hit = byNaid.get(selection.naid);
    if (!hit) throw new Error(`No central chronology hit for NAID ${selection.naid}`);
    const candidate =
      candidateByExact.get(candidateKey(selection.naid, selection.documentTitle, selection.date)) ||
      candidateByTitle.get(candidateKey(selection.naid, selection.documentTitle)) ||
      fuzzyCandidate(selection, candidates);
    return documentRecord(selection, hit, index, candidate);
  });
  const seeded = [sourceLead(report), ...seededRecords, ...seededDocuments];
  const seededIds = new Set();
  for (const record of seeded) {
    if (seededIds.has(record.id)) throw new Error(`Duplicate seed id: ${record.id}`);
    seededIds.add(record.id);
  }

  const existingKeys = new Set(
    records
      .filter((record) => record.seedBatch !== seedBatch)
      .map((record) => `${String(record.naid || "")}|${record.documentTitle || record.title || ""}`)
      .filter((key) => !key.startsWith("|"))
  );
  const duplicates = [...seededRecords, ...seededDocuments].filter((record) =>
    existingKeys.has(`${String(record.naid || "")}|${record.documentTitle || record.title || ""}`)
  );
  if (duplicates.length) {
    throw new Error(
      `Seed would duplicate existing records: ${duplicates
        .map((record) => `${record.naid} ${record.documentTitle || record.title}`)
        .join(", ")}`
    );
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
        searchReport: SEARCH_REPORT_REF,
        addedRecords: seeded.length,
        sourceLeads: 1,
        selectedFileUnits: seededRecords.length,
        selectedDocuments: seededDocuments.length,
        totalRecords: combined.length,
        selectedNaids: seededRecords.map((record) => record.naid),
        selectedDocumentIds: seededDocuments.map((record) => record.id)
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
        selectedFileUnits: seededRecords.length,
        selectedDocuments: seededDocuments.length,
        totalRecords: combined.length
      },
      null,
      2
    )
  );
}

main();
