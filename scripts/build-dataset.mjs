import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const CACHE_DIR = join(process.cwd(), '.cache', 'wayback-raw');
const DATA_DIR = join(process.cwd(), 'src', 'data');

const manifest = JSON.parse(readFileSync(join(CACHE_DIR, 'manifest.json'), 'utf-8'));
const captureReport = JSON.parse(readFileSync(join(CACHE_DIR, 'capture-report.json'), 'utf-8'));

const manifestByYear = new Map(manifest.map((m) => [m.year, m]));

/** @type {import('../src/types/retrospective').TaxonomyDataset} */
const taxonomy = {
  domains: [
    {
      id: 'about-org',
      name: 'Institutional Identity & Governance',
      description: 'College overview, academic departments/units, leadership, directory, diversity, and contact.',
    },
    {
      id: 'recruitment-admissions',
      name: 'Admissions & Student Recruitment',
      description: 'Prospective student entry points, applications, campus visits, transfer pathways, and admissions FAQs.',
    },
    {
      id: 'academics-curricula',
      name: 'Academics & Curricula',
      description: 'Majors/minors, course offerings, general education, academic policies/forms, graduation, and online programs.',
    },
    {
      id: 'student-experience',
      name: 'Advising, Career & Student Experience',
      description: 'Academic advising, career readiness, internships, honors/scholarships, study abroad, and first-year support.',
    },
    {
      id: 'research-impact',
      name: 'Research & Public Impact',
      description: 'Faculty research expertise, centers/institutes, student research opportunities, and public engagement.',
    },
    {
      id: 'news-events',
      name: 'News, Publications & Calendar',
      description: 'College news, magazine (LASNews / The Quadrangle), newsletters, media contacts, and event calendars.',
    },
    {
      id: 'alumni-giving-audiences',
      name: 'Advancement & Audience Gateways',
      description: 'Philanthropy/giving, alumni relations, and explicit persona-segmented gateways (Students, Parents, Faculty/Staff).',
    },
  ],
  concepts: [
    // Domain 1: Institutional Identity & Governance
    {
      id: 'about-overview',
      domainId: 'about-org',
      name: 'About LAS, Mission & Fast Facts',
      shortName: 'About & Facts',
      defaultParadigm: 'topic',
      description: 'General college overview, mission/values, history, strategic plan, and statistical profile.',
    },
    {
      id: 'units-departments',
      domainId: 'about-org',
      name: 'Departments, Units & Divisions',
      shortName: 'Units & Depts',
      defaultParadigm: 'topic',
      description: 'Directory of LAS departments, schools, divisions, museums, and interdisciplinary units.',
    },
    {
      id: 'leadership-directory',
      domainId: 'about-org',
      name: 'Leadership, Administration & Directory',
      shortName: 'Leadership & Directory',
      defaultParadigm: 'topic',
      description: 'Dean/administration profiles, college offices, and people directory.',
    },
    {
      id: 'diversity-inclusion',
      domainId: 'about-org',
      name: 'Inclusive Excellence & DEI',
      shortName: 'Inclusive Excellence',
      defaultParadigm: 'topic',
      description: 'Statement on diversity, DEI initiatives, and Office of Inclusive Excellence.',
    },
    {
      id: 'contact-location',
      domainId: 'about-org',
      name: 'Contact Us, Maps & Search',
      shortName: 'Contact & Search',
      defaultParadigm: 'task',
      description: 'Contact channels, campus building finder ("Find a Place"), safety, and site search.',
    },

    // Domain 2: Admissions & Student Recruitment
    {
      id: 'admissions-apply',
      domainId: 'recruitment-admissions',
      name: 'Admissions & Apply to LAS',
      shortName: 'Admissions / Apply',
      defaultParadigm: 'task',
      description: 'Undergraduate admissions hub and direct application calls to action.',
    },
    {
      id: 'visit-campus',
      domainId: 'recruitment-admissions',
      name: 'Visit Campus & Prospective Experience',
      shortName: 'Visit & Campus Life',
      defaultParadigm: 'task',
      description: 'Campus visit scheduling, campus life previews, and prospective student outreach.',
    },
    {
      id: 'transfer-pathways',
      domainId: 'recruitment-admissions',
      name: 'Intercollegiate & Off-Campus Transfers',
      shortName: 'Transfer Pathways',
      defaultParadigm: 'task',
      description: 'Intercollegiate transfer (ICT), off-campus transfer, second-degree, and re-entry routes.',
    },
    {
      id: 'prospective-faqs-blogs',
      domainId: 'recruitment-admissions',
      name: 'Admissions FAQs, Blogs & Pre-College',
      shortName: 'FAQs, Blogs & Summer',
      defaultParadigm: 'topic',
      description: 'Admissions/CS+X FAQs, LAS Insider student blog, and pre-college summer programs.',
    },

    // Domain 3: Academics & Curricula
    {
      id: 'majors-programs',
      domainId: 'academics-curricula',
      name: 'Majors, Minors & Programs of Study',
      shortName: 'Majors & Programs',
      defaultParadigm: 'topic',
      description: 'Undergraduate degree programs, majors, minors, certificates, and exploring fields of study.',
    },
    {
      id: 'courses-gened',
      domainId: 'academics-curricula',
      name: 'Courses, Offerings & General Education',
      shortName: 'Courses & GenEd',
      defaultParadigm: 'topic',
      description: 'Course catalogs, degree/General Education requirements, and curriculum proposal forms.',
    },
    {
      id: 'policies-dates-forms',
      domainId: 'academics-curricula',
      name: 'Policies, Standing, Deadlines & Forms',
      shortName: 'Policies, Dates & Forms',
      defaultParadigm: 'task',
      description: 'Academic rules, integrity, attendance, dates/deadlines, and student petition/program forms.',
    },
    {
      id: 'graduation-commencement',
      domainId: 'academics-curricula',
      name: 'Graduation, DARS & Commencement',
      shortName: 'Graduation',
      defaultParadigm: 'task',
      description: 'Degree audit (DARS), graduation preparation, and commencement ceremonies.',
    },
    {
      id: 'online-programs',
      domainId: 'academics-curricula',
      name: 'Online & Off-Campus Programs',
      shortName: 'Online Programs',
      defaultParadigm: 'topic',
      description: 'LAS Online education, Coursera/MOOC initiatives, and off-campus offerings.',
    },

    // Domain 4: Advising, Career & Student Experience
    {
      id: 'advising-support',
      domainId: 'student-experience',
      name: 'Academic Advising & Student Support',
      shortName: 'Advising & Support',
      defaultParadigm: 'task',
      description: 'College/departmental advising, workshops, Paul M. Lisnek LAS Hub, and student support.',
    },
    {
      id: 'career-internships',
      domainId: 'student-experience',
      name: 'Career Readiness, Life Design & Internships',
      shortName: 'Career & Internships',
      defaultParadigm: 'topic',
      description: 'Life + Career Design, career services, job search tools, e-portfolios, and internships.',
    },
    {
      id: 'honors-scholarships',
      domainId: 'student-experience',
      name: 'Honors, James Scholars & Scholarships',
      shortName: 'Honors & Scholarships',
      defaultParadigm: 'topic',
      description: 'James Scholar honors, college distinctions, and undergraduate scholarships/emergency funds.',
    },
    {
      id: 'study-abroad-global',
      domainId: 'student-experience',
      name: 'Study Abroad & International Programs',
      shortName: 'Study Abroad / Global',
      defaultParadigm: 'topic',
      description: 'LAS International Programs, courses abroad, Latitudes, and global learning.',
    },
    {
      id: 'first-year-wellness',
      domainId: 'student-experience',
      name: 'First-Year Experience, AAP & Wellness',
      shortName: 'FYE, AAP & Wellness',
      defaultParadigm: 'topic',
      description: 'LAS 101/102 First-Year Experience, Access & Achievement Program (AAP), student orgs, and wellness.',
    },

    // Domain 5: Research & Public Impact
    {
      id: 'research-centers',
      domainId: 'research-impact',
      name: 'Research Centers, Expertise & Engagement',
      shortName: 'Research & Centers',
      defaultParadigm: 'topic',
      description: 'Research centers/facilities, faculty experts, undergraduate/graduate research, and public engagement.',
    },

    // Domain 6: News, Publications & Calendar
    {
      id: 'news-publications',
      domainId: 'news-events',
      name: 'College News, Magazine & Newsletters',
      shortName: 'News & Magazine',
      defaultParadigm: 'topic',
      description: 'LAS News, LASNews / The Quadrangle magazine, email newsletters, faculty honors, and social/media contacts.',
    },
    {
      id: 'events-calendars',
      domainId: 'news-events',
      name: 'Calendars, Lectures & College Events',
      shortName: 'Events & Calendar',
      defaultParadigm: 'topic',
      description: 'Academic/event calendars, Dean’s Distinguished Lectures, and alumni/college events.',
    },

    // Domain 7: Advancement & Audience Gateways
    {
      id: 'giving-make-gift',
      domainId: 'alumni-giving-audiences',
      name: 'Giving & Philanthropy ("Give to LAS")',
      shortName: 'Give / Philanthropy',
      defaultParadigm: 'task',
      description: 'Make a Gift CTAs, Day of Giving, Lincoln Scholars, building campaigns, and donor impact.',
    },
    {
      id: 'alumni-engagement',
      domainId: 'alumni-giving-audiences',
      name: 'Alumni Relations, Council & Awards',
      shortName: 'Alumni Hub',
      defaultParadigm: 'audience',
      description: 'Alumni hub, Alumni Association/Council, awards, volunteering, and LAS@Work alumni careers.',
    },
    {
      id: 'persona-students-parents',
      domainId: 'alumni-giving-audiences',
      name: 'Audience Gateways: Students & Parents',
      shortName: 'Persona: Students/Parents',
      defaultParadigm: 'audience',
      description: 'Explicit persona containers ("For Students", "Prospective Students", "Current Students", "Student resources", "Parent resources").',
    },
    {
      id: 'persona-faculty-staff',
      domainId: 'alumni-giving-audiences',
      name: 'Audience Gateway: Faculty & Staff',
      shortName: 'Persona: Faculty/Staff',
      defaultParadigm: 'audience',
      description: 'Explicit internal campus persona gateway ("For Faculty & Staff", Advising Toolbox, Curricula/Course Governance, LAS Services Center).',
    },
  ],
};

const validConceptIds = new Set(taxonomy.concepts.map((c) => c.id));

function item(label, href, paradigm, conceptId, extra = {}) {
  if (!validConceptIds.has(conceptId)) {
    throw new Error(`Unknown conceptId "${conceptId}" on item "${label}"`);
  }
  return { label, href, paradigm, conceptId, ...extra };
}

function sub(label, href, paradigm, conceptId) {
  if (!validConceptIds.has(conceptId)) {
    throw new Error(`Unknown conceptId "${conceptId}" on subitem "${label}"`);
  }
  return { label, href, paradigm, conceptId };
}

function computeMetrics(zones) {
  let level1Count = 0;
  let level2Count = 0;
  let audienceGatedItems = 0;
  /** @type {1 | 2} */
  let maxDepth = 1;
  const paradigmCounts = { audience: 0, topic: 0, task: 0, hybrid: 0 };
  const l1ParadigmCounts = { audience: 0, topic: 0, task: 0, hybrid: 0 };

  for (const z of zones) {
    for (const l1 of z.items) {
      level1Count++;
      paradigmCounts[l1.paradigm]++;
      l1ParadigmCounts[l1.paradigm]++;
      const isAudienceGate =
        z.zoneType === 'audience-bar' || l1.paradigm === 'audience' || l1.paradigm === 'hybrid';
      if (isAudienceGate) audienceGatedItems++;

      if (l1.children && l1.children.length > 0) {
        maxDepth = 2;
        for (const l2 of l1.children) {
          level2Count++;
          paradigmCounts[l2.paradigm]++;
          if (isAudienceGate || l2.paradigm === 'audience') {
            audienceGatedItems++;
          }
        }
      }
    }
  }

  const totalItems = level1Count + level2Count;
  const pct = (n, denom) => (denom > 0 ? Math.round((n / denom) * 100) : 0);

  return {
    zoneCount: zones.length,
    level1Count,
    level2Count,
    totalItems,
    maxDepth,
    paradigmCounts,
    paradigmPercentages: {
      audience: pct(paradigmCounts.audience, totalItems),
      topic: pct(paradigmCounts.topic, totalItems),
      task: pct(paradigmCounts.task, totalItems),
      hybrid: pct(paradigmCounts.hybrid, totalItems),
    },
    l1ParadigmPercentages: {
      audience: pct(l1ParadigmCounts.audience, level1Count),
      topic: pct(l1ParadigmCounts.topic, level1Count),
      task: pct(l1ParadigmCounts.task, level1Count),
      hybrid: pct(l1ParadigmCounts.hybrid, level1Count),
    },
    audienceGatedPercentage: pct(audienceGatedItems, totalItems),
  };
}

/** @type {Omit<import('../src/types/retrospective').DesignIteration, 'metrics' | 'showcaseFoldImage' | 'showcaseFullImage' | 'showcaseWaybackUrl' | 'showcaseCaptureDate'>[]} */
const rawIterations = [
  // 1. 2000
  {
    id: 'iter-2000',
    number: 1,
    debutYear: 2000,
    endYear: 2000,
    yearSpanLabel: '2000',
    title: 'Early Institutional Directory',
    eraTagline: 'Single-column HTML table index organized by administrative document categories',
    canonicalHost: 'www.las.uiuc.edu',
    techSignature: 'HTML 4.0 table layout (4 tables, zero external CSS)',
    visualSummary:
      'Minimal white page pairing a left-rail Lincoln Hall arch emblem and seasonal commencement link with a single vertical index divided into College Information, Program and Course Information, External Relations, and standalone utility links.',
    iaHeadline:
      'Document-centric institutional index with flat Level-1 links and almost no persona segmentation.',
    iaAnalysis: [
      'The earliest archived LAS homepage functioned entirely as a table of contents rather than an editorial homepage. With zero horizontal header bars or dropdown menus, all 13 core links lived in one flat vertical list grouped under three bold subheadings: College Information, Program and Course Information, and External Relations.',
      'Information architecture mirrored internal administrative silos—placing faculty governance forms ("Course and Curriculum Proposal Forms") directly alongside undergraduate catalog links ("Undergraduate Degree Programs", "General Education Requirements") at the exact same hierarchy level.',
    ],
    audienceNavCommentary:
      'Audience navigation had not yet crystallized into a dedicated bar. Only two mild audience labels existed—"Student Information" and "Alumni"—mixed inline with institutional topics and internal faculty curriculum forms.',
    intraEraDrift: [
      {
        years: 'Apr–Dec 2000',
        summary:
          'Left-rail seasonal spotlight rotated between Spring/December 1999 and December 2000 Commencement links while the 13-item main directory remained static.',
      },
    ],
    zones: [
      {
        id: '2000-directory',
        name: 'Main Directory Index',
        zoneType: 'primary',
        placement: 'Center vertical column under 3 administrative headings',
        dominantParadigm: 'topic',
        description: 'Flat vertical directory serving simultaneously as homepage body and site-wide primary navigation.',
        items: [
          item('General Information', 'general_information.html', 'topic', 'about-overview', { groupHeading: 'College Information' }),
          item('Student Information', 'student_information.html', 'audience', 'persona-students-parents', { groupHeading: 'College Information' }),
          item('Department and Academic Units', 'academic.html', 'topic', 'units-departments', { groupHeading: 'College Information' }),
          item('Research and Instructional Resources', 'las_resources.html', 'topic', 'research-centers', { groupHeading: 'College Information' }),
          item('Undergraduate Degree Programs', 'p_index.html', 'topic', 'majors-programs', { groupHeading: 'Program and Course Information' }),
          item('LAS Course Offerings', 'las_course_offerings.html', 'topic', 'courses-gened', { groupHeading: 'Program and Course Information' }),
          item('General Education Requirements', 'undergrad_degree_programs.html#general_education', 'topic', 'courses-gened', { groupHeading: 'Program and Course Information' }),
          item('Course and Curriculum Proposal Forms', 'course-forms.html', 'task', 'persona-faculty-staff', { groupHeading: 'Program and Course Information' }),
          item('Alumni', 'alumni_relations.html', 'audience', 'alumni-engagement', { groupHeading: 'External Relations' }),
          item('Development', 'dev/index.html', 'topic', 'giving-make-gift', { groupHeading: 'External Relations' }),
          item('Make A Gift', 'makeagift.html', 'task', 'giving-make-gift'),
          item('Calendars', 'calendars.html', 'topic', 'events-calendars'),
          item('Search LAS', 'search.html', 'task', 'contact-location'),
        ],
      },
      {
        id: '2000-sidebar',
        name: 'Left Crest Callout',
        zoneType: 'sidebar',
        placement: 'Left table column below Lincoln Hall / LAS emblem',
        dominantParadigm: 'task',
        description: 'Seasonal high-priority link slot beneath the college crest.',
        items: [
          item('December 2000 Commencement Info', 'commence_dec00.html', 'task', 'graduation-commencement'),
        ],
      },
    ],
  },

  // 2. 2001–2004
  {
    id: 'iter-2001',
    number: 2,
    debutYear: 2001,
    endYear: 2004,
    yearSpanLabel: '2001–2004',
    title: 'Quad Panorama & First Audience Portals',
    eraTagline: 'Introduction of a horizontal navbar and explicit "For Students / Faculty / Alumni" audience hubs',
    canonicalHost: 'www.las.uiuc.edu',
    techSignature: '7-table graphical banner layout + DHTML rollover menus (/js/lasmenus.js)',
    visualSummary:
      'Full-width Main Quad panoramic banner crowned by a dark horizontal navigation strip, paired below with a two-column split between annotated core gateways on the left and timely announcements + quick utility links on the right.',
    iaHeadline:
      'Birth of persona-based wayfinding at LAS: three of six core sections became audience portals.',
    iaAnalysis: [
      'The 2001 redesign replaced the 2000 administrative link list with LAS’s first true horizontal navigation bar: about las, academic units, students, faculty/staff, alumni/friends, make-a-gift, and search. Those exact six gateways were intentionally echoed immediately below the hero banner with 1-sentence descriptions ("For Students", "For Faculty and Staff", "For Alumni and Friends") to orient first-time web visitors.',
      'Rather than exposing deep academic links directly on the homepage, the IA consolidated 13 links down to 7 top-level hubs—routing undergraduate majors, advising, and policies behind "For Students" and governance behind "For Faculty and Staff".',
    ],
    audienceNavCommentary:
      'This iteration established the persona-first mental model that dominated LAS web architecture for the next 17 years: Students, Faculty/Staff, and Alumni/Friends became co-equal Level-1 peers inside the main navigation bar.',
    intraEraDrift: [
      {
        years: '2002–2004',
        summary:
          'Replaced the duplicate body directory list on the homepage with editorial feature stories and campus news teasers while keeping the 7-item horizontal top bar intact through late 2004.',
      },
    ],
    zones: [
      {
        id: '2001-primary',
        name: 'Top Horizontal Navigation Bar',
        zoneType: 'primary',
        placement: 'Dark horizontal strip directly beneath the Quad panorama header',
        dominantParadigm: 'hybrid',
        description: 'Seven-item horizontal bar blending two institutional topics, three audience portals, and two utility actions.',
        items: [
          item('about las', '/about/contents.shtml', 'topic', 'about-overview'),
          item('academic units', '/acunits.shtml', 'topic', 'units-departments'),
          item('students', '/students/contents.shtml', 'audience', 'persona-students-parents'),
          item('faculty/staff', '/faculty/contents.shtml', 'audience', 'persona-faculty-staff'),
          item('alumni/friends', '/alumni/alumni.shtml', 'audience', 'alumni-engagement'),
          item('make-a-gift', '/makeagift.shtml', 'task', 'giving-make-gift'),
          item('search', '/search.shtml', 'task', 'contact-location'),
        ],
      },
      {
        id: '2001-audience-directory',
        name: 'Annotated Gateway Directory',
        zoneType: 'audience-bar',
        placement: 'Primary left-column portal list with audience descriptions (2001 debut)',
        dominantParadigm: 'audience',
        description: 'Descriptive portal cards reinforcing the new "For [Audience]" segmentation.',
        items: [
          item('About LAS', '/about/contents.shtml', 'topic', 'about-overview'),
          item('Academic Units', 'acunits.shtml', 'topic', 'units-departments'),
          item('For Students', 'students/contents.shtml', 'audience', 'persona-students-parents'),
          item('For Faculty and Staff', 'faculty/contents.shtml', 'audience', 'persona-faculty-staff'),
          item('For Alumni and Friends', 'alumni/contents.shtml', 'audience', 'alumni-engagement'),
          item('Make-A-Gift', '/dev/index.html', 'task', 'giving-make-gift'),
        ],
      },
      {
        id: '2001-sidebar-utility',
        name: 'Right-Rail Quick Links',
        zoneType: 'sidebar',
        placement: 'Lower right-hand column below "What’s New" announcements',
        dominantParadigm: 'task',
        description: 'Campus utility and student-service shortcuts.',
        items: [
          item('Contact Us', '/contact.shtml', 'task', 'contact-location'),
          item('Safety', '/safety.shtml', 'topic', 'contact-location'),
          item("Writers' Workshop", 'http://www.english.uiuc.edu/cws/wworkshop/ww_staff.html', 'topic', 'advising-support'),
          item('Search', '/search.shtml', 'task', 'contact-location'),
        ],
      },
    ],
  },

  // 3. 2005–2007
  {
    id: 'iter-2005',
    number: 3,
    debutYear: 2005,
    endYear: 2007,
    yearSpanLabel: '2005–2007',
    title: 'Periwinkle Foellinger & "Resources For" Split Bar',
    eraTagline: 'Three-zone header explicitly separating Utility actions, College topics, and a labeled "Resources For" audience bar',
    canonicalHost: 'www.las.uiuc.edu',
    techSignature: 'Hybrid 13-table + external CSS (/css/las.css; /css/mainnav.css dropdowns added 2006–2007)',
    visualSummary:
      'Fixed-width navy and periwinkle editorial magazine layout featuring Foellinger Auditorium and a 6-photo discipline montage, a white top-right utility pill, a split horizontal bar ("Resources For: Students | Faculty | Alumni"), left search/calendar rail, and audience-tagged news columns.',
    iaHeadline:
      'First explicit multi-bar architecture: Utility pill + Topic bar + visually bracketed "Resources For" Audience bar.',
    iaAnalysis: [
      'The 2005 refresh solved the mixed-paradigm ambiguity of 2001’s single black navbar by visibly splitting header wayfinding into three distinct zones: a top-right white Utility Header ("Make a Gift | Contact Us | Find a Place"), three topic links on the left ("About LAS | News | Academic Units"), and three persona links on the right visually grouped under a bracketed "Resources For" overline ("Students | Faculty | Alumni").',
      'Even the editorial body mirrored the audience navigation: below the lead research feature, homepage news was partitioned into labeled "FOR STUDENTS", "FACULTY & STAFF", and "ALUMNI & FRIENDS" boxes.',
    ],
    audienceNavCommentary:
      'Adding the explicit "Resources For" super-header over Students, Faculty, and Alumni marked the moment LAS formally distinguished audience-based navigation from topic-based navigation within the visual chrome.',
    intraEraDrift: [
      {
        years: '2006–2007',
        summary:
          'Added /css/mainnav.css multi-item hover dropdowns beneath all 6 bar items (expanding to 45 Level-2 links, including 12 under Students and 12 under Faculty), shortened "Academic Units" to "Units", and added an orange top "mobile version" strip + left-rail "Find a Place" button.',
      },
    ],
    zones: [
      {
        id: '2005-utility',
        name: 'Top-Right Utility Pill',
        zoneType: 'utility-header',
        placement: 'Rounded white pill in top-right corner of the campus banner',
        dominantParadigm: 'task',
        description: 'High-intent action and wayfinding shortcuts elevated above the main bar.',
        items: [
          item('Make a Gift', '/giving/', 'task', 'giving-make-gift'),
          item('Contact Us', '/contact.html', 'task', 'contact-location'),
          item('Find a Place', '/findaplace.html', 'task', 'contact-location'),
        ],
      },
      {
        id: '2005-primary-topics',
        name: 'Primary Topic Bar (Left)',
        zoneType: 'primary',
        placement: 'Left half of periwinkle horizontal navigation bar',
        dominantParadigm: 'topic',
        description: 'Core institutional subject sections.',
        items: [
          item('About LAS', '/about/', 'topic', 'about-overview'),
          item('LAS News', '/news/', 'topic', 'news-publications'),
          item('Academic Units', '/units/', 'topic', 'units-departments'),
        ],
      },
      {
        id: '2005-audience',
        name: '"Resources For" Audience Bar (Right)',
        zoneType: 'audience-bar',
        placement: 'Right half of horizontal bar beneath bracketed "Resources For" label',
        dominantParadigm: 'audience',
        description: 'Dedicated three-persona gateway cluster.',
        items: [
          item('Students', '/students/', 'audience', 'persona-students-parents'),
          item('Faculty', '/faculty/', 'audience', 'persona-faculty-staff'),
          item('Alumni', '/alumni/', 'audience', 'alumni-engagement'),
        ],
      },
      {
        id: '2005-sidebar',
        name: 'Left Search & Calendar Rail',
        zoneType: 'sidebar',
        placement: 'Left column below Foellinger Auditorium photo',
        dominantParadigm: 'task',
        description: 'Site search form and academic/events calendar module.',
        items: [
          item('Search LAS', '/search/', 'task', 'contact-location'),
          item('Calendar', '/calendar/', 'topic', 'events-calendars'),
        ],
      },
    ],
  },

  // 4. 2008–2013
  {
    id: 'iter-2008',
    number: 4,
    debutYear: 2008,
    endYear: 2013,
    yearSpanLabel: '2008–2013',
    title: 'ATLAS Tableless Web-Standards Era',
    eraTagline: 'Semantic zero-table CSS layout coinciding with the August 2008 campus cutover to illinois.edu',
    canonicalHost: 'www.las.illinois.edu',
    urlEpochTransition: {
      fromHost: 'www.las.uiuc.edu',
      toHost: 'www.las.illinois.edu',
      year: 2008,
      note: 'Launched alongside the campus-wide uiuc.edu → illinois.edu transition in August 2008; www.las.illinois.edu became canonical while www.las.uiuc.edu mirrored content until 301-redirecting in 2014.',
    },
    techSignature: 'Semantic HTML/CSS (0 layout tables, /_includes/styles/screen.css by ATLAS Web Services)',
    visualSummary:
      'Deep teal, cream, charcoal-black, and Illini Orange editorial design featuring a black top topic bar with an orange "GIVE TO LAS" CTA tab, a large split hero montage with Alma Mater watermark, and angled orange audience tabs anchored directly below the college wordmark.',
    iaHeadline:
      'Clean two-tier separation: black institutional/giving top bar + high-contrast orange Audience Bar in the hero.',
    iaAnalysis: [
      'Built by ATLAS Web Services using semantic, tableless CSS, the 2008 redesign streamlined homepage wayfinding back to shallow Level-1 hubs (removing the 45-link hover dropdown menus experimented with in 2006–2007). Institutional topics ("Home | ABOUT LAS | NEWS | DEPARTMENTS & UNITS") and an emphasized orange "GIVE TO LAS" button anchored the top black bar.',
      'Visually, audience navigation received peak focal weight: rendered in bright Illini Orange tabs directly beneath the College of Liberal Arts & Sciences wordmark ("for STUDENTS | ALUMNI | FACULTY & STAFF"), drawing the eye immediately at the center of the viewport.',
    ],
    audienceNavCommentary:
      'Audience tabs acted as the visual centerpiece of the hero banner, reinforcing persona-first routing ("for STUDENTS", "ALUMNI", "FACULTY & STAFF") while still pooling prospective and current students into a single "for STUDENTS" tab.',
    intraEraDrift: [
      {
        years: '2011–2013',
        summary:
          'Expanded the top black bar from 5 to 7 items: renamed "NEWS" to "NEWS & RESEARCH", shortened "DEPARTMENTS & UNITS" to "UNITS", and added dedicated dark-gray tabs for "LATITUDES" (international newsletter) and "ONLINE EDUCATION" beside "GIVE TO LAS".',
      },
    ],
    zones: [
      {
        id: '2008-primary-top',
        name: 'Top Institutional & Giving Bar',
        zoneType: 'primary',
        placement: 'Full-width black top bar with orange right-aligned CTA tab',
        dominantParadigm: 'topic',
        description: 'Core college sections paired with a high-contrast philanthropy tab.',
        items: [
          item('Home', '/', 'topic', 'about-overview'),
          item('About LAS', '/about/', 'topic', 'about-overview'),
          item('News', '/news/', 'topic', 'news-publications'),
          item('Departments & Units', '/units/', 'topic', 'units-departments'),
          item('Give to LAS', '/giving/', 'task', 'giving-make-gift'),
        ],
      },
      {
        id: '2008-audience-hero',
        name: 'Hero Orange Audience Tabs',
        zoneType: 'audience-bar',
        placement: 'Angled Illini Orange tab strip directly below the LAS wordmark',
        dominantParadigm: 'audience',
        description: 'High-salience persona bar routing students, alumni, and faculty/staff.',
        items: [
          item('for Students', '/students/', 'audience', 'persona-students-parents'),
          item('Alumni', '/alumni/', 'audience', 'alumni-engagement'),
          item('Faculty & Staff', '/faculty/', 'audience', 'persona-faculty-staff'),
        ],
      },
    ],
  },

  // 5. 2014–2015
  {
    id: 'iter-2014',
    number: 5,
    debutYear: 2014,
    endYear: 2015,
    yearSpanLabel: '2014–2015',
    title: 'Bootstrap Responsive & Peak Audience Mega-Menu',
    eraTagline: 'Responsive grid debut where 100% of Primary Navigation was organized into four Audience mega-menus',
    canonicalHost: 'www.las.illinois.edu',
    techSignature: 'Bootstrap 3.1.1 + Font Awesome 4 + custom mega-menu (/las.css, /newnav.css)',
    visualSummary:
      'Dark charcoal architectural stone header with serif orange/white typography, compact top-right utility strip, dark translucent 4-persona mega-menu bar + social icons, and a boxed white container showcasing stacked wide feature banners.',
    iaHeadline:
      'High-water mark of Audience-Based IA: institutional topics moved into a compact utility strip so four personas could own the entire primary mega-menu.',
    iaAnalysis: [
      'The 2014 responsive redesign inverted traditional university hierarchy. Institutional sections ("About | News | Events | Units & Programs | Contact | Giving") were compressed into a compact top-right utility strip, handing 100% of the primary navigation bar to four audience mega-menus: Prospective Students (12 links), Current Students (28 links), Alumni & Friends (10 links), and Faculty & Staff (17 links).',
      'Crucially, LAS split its former unified "Students" tab into "Prospective Students" and "Current Students"—acknowledging diverging recruitment vs. enrolled-student needs—yet doing so via persona labels created duplicate destinations across menus (e.g., Majors, International/Global, and Honors appeared inside both Prospective and Current Student dropdowns).',
    ],
    audienceNavCommentary:
      'This era exemplifies why higher-ed UX later reconsidered pure audience bars: 67 Level-2 links were partitioned strictly by persona, forcing visitors (e.g., a prospective parent, an intercollegiate transfer student, or a prospective grad/faculty visitor) to guess which persona bucket held academic programs or policies.',
    intraEraDrift: [
      {
        years: '2015',
        summary:
          'Added hands-on learning and FAQ refinements inside the Prospective Students panel while maintaining identical 4-audience mega-menu and slate header geometry.',
      },
    ],
    zones: [
      {
        id: '2014-utility',
        name: 'Top-Right Topic & Action Strip',
        zoneType: 'utility-header',
        placement: 'Compact dark strip in upper-right corner of header',
        dominantParadigm: 'topic',
        description: 'Institutional topics and giving compressed into a secondary utility bar.',
        items: [
          item('Home', '/', 'topic', 'about-overview'),
          item('About', '/about/', 'topic', 'about-overview'),
          item('News', '/news/', 'topic', 'news-publications'),
          item('Events', 'http://illinois.edu/calendar/list/1249', 'topic', 'events-calendars'),
          item('Units & Programs', '/units/', 'topic', 'units-departments'),
          item('Contact', '/contact/', 'task', 'contact-location'),
          item('Giving', '/giving/', 'task', 'giving-make-gift'),
        ],
      },
      {
        id: '2014-audience-megamenu',
        name: 'Primary Audience Mega-Menu',
        zoneType: 'audience-bar',
        placement: 'Full-width primary horizontal bar with multi-column dropdown panels',
        dominantParadigm: 'audience',
        description: 'Four persona triggers housing all 67 deep navigation links.',
        items: [
          item('Prospective Students', '/prospective/', 'audience', 'persona-students-parents', {
            children: [
              sub('Explore Majors', '/students/programs/', 'topic', 'majors-programs'),
              sub('Global Experience', '/students/international/', 'topic', 'study-abroad-global'),
              sub('Honors Programs', '/students/honors/', 'topic', 'honors-scholarships'),
              sub('Student Blogs', '/students/bloggers/', 'topic', 'prospective-faqs-blogs'),
              sub('Campus Life', 'http://admissions.illinois.edu/campuslife', 'topic', 'visit-campus'),
              sub('Freshman Admissions', 'http://admissions.illinois.edu/early/', 'task', 'admissions-apply'),
              sub('Off-Campus Transfers', 'http://www.admissions.illinois.edu/apply/requirements_transfer.html', 'task', 'transfer-pathways'),
              sub('Intercollegiate Transfer', '/prospective/intercollegiate/', 'task', 'transfer-pathways'),
              sub('Second Degree in LAS', '/prospective/second/', 'task', 'transfer-pathways'),
              sub('Returning to LAS', '/prospective/returning/', 'task', 'transfer-pathways'),
              sub('Re-Entry to LAS', '/prospective/reentry/', 'task', 'transfer-pathways'),
              sub('Non-Degree', 'http://admissions.illinois.edu/apply/app_nondegree.html', 'task', 'admissions-apply'),
            ],
          }),
          item('Current Students', '/students/', 'audience', 'persona-students-parents', {
            children: [
              sub('Dates & Deadlines', '/students/dates/', 'topic', 'policies-dates-forms'),
              sub('Academic Advising', '/students/advising/', 'task', 'advising-support'),
              sub('Majors & Minors', '/students/programs/', 'topic', 'majors-programs'),
              sub('LAS Chalk Newsletter', '/students/laschalk/', 'topic', 'news-publications'),
              sub('U of I Course Information', 'https://my.illinois.edu/', 'topic', 'courses-gened'),
              sub('Graduation', '/students/graduation/', 'task', 'graduation-commencement'),
              sub('Degree Requirements', '/students/requirements/', 'topic', 'courses-gened'),
              sub('Course Guidelines', '/students/courses/', 'topic', 'courses-gened'),
              sub('Academic Integrity', '/students/integrity/', 'topic', 'policies-dates-forms'),
              sub('Attendance & Withdrawals', '/students/attendance/', 'topic', 'policies-dates-forms'),
              sub('Get Student Forms', '/students/forms/', 'task', 'policies-dates-forms'),
              sub('DARS Audit', 'http://www.oar.uiuc.edu/current/dars/', 'task', 'graduation-commencement'),
              sub('LAS OnLine Education', 'http://www.lasonline.illinois.edu', 'topic', 'online-programs'),
              sub('Career Development', '/students/career/', 'topic', 'career-internships'),
              sub('International Programs', '/students/international/', 'topic', 'study-abroad-global'),
              sub('Honors Programs', '/students/honors/', 'topic', 'honors-scholarships'),
              sub('James Scholars', '/students/honors/james/', 'topic', 'honors-scholarships'),
              sub('Scholarships', '/students/honors/scholarships/', 'topic', 'honors-scholarships'),
              sub('LAS Distinction and Recognition', '/students/honors/recognition/', 'topic', 'honors-scholarships'),
              sub('LAS 101', '/students/las101/', 'topic', 'first-year-wellness'),
              sub('Access & Achievement Program', '/students/accessandachievement/', 'topic', 'first-year-wellness'),
              sub('For Parents', '/students/parents/', 'audience', 'persona-students-parents'),
            ],
          }),
          item('Alumni & Friends', '/alumni/', 'audience', 'alumni-engagement', {
            children: [
              sub('Give to LAS', '/giving/', 'task', 'giving-make-gift'),
              sub('Events', '/alumni/events/', 'topic', 'events-calendars'),
              sub('Alumni Board', '/alumni/association/board/', 'topic', 'alumni-engagement'),
              sub('LAS Award Programs', '/alumni/awards/', 'topic', 'alumni-engagement'),
              sub('Get Involved', '/alumni/volunteer/', 'task', 'alumni-engagement'),
              sub('LASNews Magazine', '/alumni/magazine/', 'topic', 'news-publications'),
              sub('Class Notes', '/alumni/magazine/classnotes/', 'topic', 'alumni-engagement'),
              sub('Contact Us', '/alumni/contact/', 'task', 'contact-location'),
              sub('Update Your Information', '/alumni/contact/form/', 'task', 'alumni-engagement'),
              sub('Get Our Newsletter', '/news/getnews/', 'task', 'news-publications'),
            ],
          }),
          item('Faculty & Staff', '/faculty/', 'audience', 'persona-faculty-staff', {
            children: [
              sub('Announcements', '/faculty/announcements/', 'topic', 'persona-faculty-staff'),
              sub('Dates & Deadlines', '/faculty/dates/', 'topic', 'policies-dates-forms'),
              sub('Annual Faculty Meeting', '/faculty/meetings/', 'topic', 'persona-faculty-staff'),
              sub('Committees', '/faculty/committees/', 'topic', 'persona-faculty-staff'),
              sub('Faculty Honors', '/faculty/honors/', 'topic', 'news-publications'),
              sub('Advising Toolbox', '/faculty/advising/', 'task', 'advising-support'),
              sub('Courses Approval', '/faculty/courses/', 'task', 'courses-gened'),
              sub('Curricula Approval', '/faculty/curricula/', 'task', 'courses-gened'),
              sub('General Education Proposals', '/faculty/gened/', 'task', 'courses-gened'),
              sub('Faculty Policy Manual', '/faculty/policies/', 'topic', 'persona-faculty-staff'),
              sub('Employment at LAS', '/faculty/jobs/', 'task', 'persona-faculty-staff'),
            ],
          }),
        ],
      },
    ],
  },

  // 6. 2016–2018
  {
    id: 'iter-2016',
    number: 6,
    debutYear: 2016,
    endYear: 2018,
    yearSpanLabel: '2016–2018',
    title: 'Illini Orange Banner & Card-Grid Refresh',
    eraTagline: 'Modernized brand-orange header and editorial card grid retaining the 4-persona mega-menu structure',
    canonicalHost: 'www.las.illinois.edu',
    techSignature: 'Bootstrap 3.1.1 + refreshed full-bleed orange brand header & card grid',
    visualSummary:
      'Clean white utility bar with an oversized orange "GIVE to LAS" button, bold full-width Illini Orange masthead, dark navy 4-persona mega-menu + inline search trigger, and an open white background featuring a 3-column LAS News card grid.',
    iaHeadline:
      'Visual modernization over an unchanged Audience Mega-Menu—exposing the limits of persona-bucketed IA.',
    iaAnalysis: [
      'While 2016 overhauled the homepage’s visual lightness—trading dark stone textures for a crisp white utility header, vibrant Illini Orange brand band, and structured card grid—it preserved 2014’s exact two-bar split: institutional links in the white top utility bar ("About | News | Calendar | Units | Contact | GIVE to LAS") and the four audience buckets in the dark navy primary mega-menu.',
      'Prospective recruitment content expanded inside the "Prospective students" dropdown (adding Hands-on learning, Prospective FAQ, Admitted student FAQ, LAS Insider blog, and Summer programs), signaling growing recruitment pressure inside a menu still shared equally with internal faculty/staff governance.',
    ],
    audienceNavCommentary:
      'This was the final LAS iteration to organize primary navigation around user personas ("Prospective students | Current students | Alumni and friends | Faculty and staff") before the 2019 paradigm shift to topic- and task-driven IA.',
    intraEraDrift: [
      {
        years: '2017–2018',
        summary:
          'Replaced "Contact" with "Directory" in the white top utility bar and updated the header brand mark from the boxed column-I to the modern Illinois wordmark in 2018.',
      },
    ],
    zones: [
      {
        id: '2016-utility',
        name: 'White Top Utility & Giving Bar',
        zoneType: 'utility-header',
        placement: 'Full-width white top bar above the orange brand masthead',
        dominantParadigm: 'topic',
        description: 'High-visibility institutional links paired with a prominent orange "GIVE to LAS" button.',
        items: [
          item('About', '/about/', 'topic', 'about-overview'),
          item('News', '/news/archive/', 'topic', 'news-publications'),
          item('Calendar', 'http://illinois.edu/calendar/list/1249', 'topic', 'events-calendars'),
          item('Units', '/units/', 'topic', 'units-departments'),
          item('Contact', '/contact/', 'task', 'contact-location'),
          item('GIVE to LAS', '/giving/', 'task', 'giving-make-gift'),
        ],
      },
      {
        id: '2016-audience-megamenu',
        name: 'Navy Primary Audience Mega-Menu',
        zoneType: 'audience-bar',
        placement: 'Dark navy horizontal bar beneath the Illini Orange masthead',
        dominantParadigm: 'audience',
        description: 'Four persona dropdown triggers plus integrated search.',
        items: [
          item('Prospective students', '/prospective/', 'audience', 'persona-students-parents', {
            children: [
              sub('Explore majors', '/prospective/majors/', 'topic', 'majors-programs'),
              sub('Global experience', '/students/international/', 'topic', 'study-abroad-global'),
              sub('Hands-on learning', '/prospective/experience/', 'topic', 'career-internships'),
              sub('Honors programs', '/students/honors/', 'topic', 'honors-scholarships'),
              sub('Prospective FAQ', '/prospective/faq/', 'topic', 'prospective-faqs-blogs'),
              sub('Admitted student FAQ', '/prospective/admitted/', 'topic', 'prospective-faqs-blogs'),
              sub('LAS Insider blog', '/prospective/insider/', 'topic', 'prospective-faqs-blogs'),
              sub('Summer programs', '/prospective/summer/', 'topic', 'prospective-faqs-blogs'),
              sub('Campus life', 'http://admissions.illinois.edu/campuslife', 'topic', 'visit-campus'),
              sub('Freshman admissions', 'http://admissions.illinois.edu/apply', 'task', 'admissions-apply'),
              sub('Off-campus transfers', 'http://admissions.illinois.edu/apply/requirements_transfer.html', 'task', 'transfer-pathways'),
              sub('Intercollegiate transfer', '/prospective/intercollegiate/', 'task', 'transfer-pathways'),
            ],
          }),
          item('Current students', '/students/', 'audience', 'persona-students-parents', {
            children: [
              sub('Dates and deadlines', '/students/dates/', 'topic', 'policies-dates-forms'),
              sub('Academic advising', '/students/advising/', 'task', 'advising-support'),
              sub('Majors and minors', '/students/programs/', 'topic', 'majors-programs'),
              sub('LAS Lineup newsletter', '/students/laslineup/', 'topic', 'news-publications'),
              sub('U of I course information', 'https://courses.illinois.edu/', 'topic', 'courses-gened'),
              sub('Graduation', '/students/graduation/', 'task', 'graduation-commencement'),
              sub('Student organizations', '/students/organizations/', 'topic', 'first-year-wellness'),
              sub('Degree requirements', '/students/requirements/', 'topic', 'courses-gened'),
              sub('Get Student forms', '/students/forms/', 'task', 'policies-dates-forms'),
              sub('LAS onLine education', 'http://lasonline.illinois.edu/', 'topic', 'online-programs'),
              sub('Career development', '/students/career/', 'topic', 'career-internships'),
              sub('International programs', '/students/international/', 'topic', 'study-abroad-global'),
              sub('Honors programs', '/students/honors/', 'topic', 'honors-scholarships'),
              sub('LAS scholarships', '/students/scholarships/', 'topic', 'honors-scholarships'),
              sub('LAS 101', '/students/las101/', 'topic', 'first-year-wellness'),
              sub('Access and Achievement Program', '/students/aap/', 'topic', 'first-year-wellness'),
              sub('For parents', '/students/parents/', 'audience', 'persona-students-parents'),
            ],
          }),
          item('Alumni and friends', '/alumni/', 'audience', 'alumni-engagement', {
            children: [
              sub('Give to LAS', '/giving/', 'task', 'giving-make-gift'),
              sub('Events', '/alumni/events/', 'topic', 'events-calendars'),
              sub('Alumni board', '/alumni/board/', 'topic', 'alumni-engagement'),
              sub('LAS Award programs', '/alumni/awards/', 'topic', 'alumni-engagement'),
              sub('Get involved', '/alumni/volunteer/', 'task', 'alumni-engagement'),
              sub('LASNews magazine', '/alumni/magazine/', 'topic', 'news-publications'),
              sub('Alumni careers', '/alumni/careers/', 'topic', 'career-internships'),
              sub('Contact us', '/alumni/contact/', 'task', 'contact-location'),
              sub('Update your information', '/alumni/update/', 'task', 'alumni-engagement'),
            ],
          }),
          item('Faculty and staff', '/faculty/', 'audience', 'persona-faculty-staff', {
            children: [
              sub('Announcements', '/faculty/announcements/', 'topic', 'persona-faculty-staff'),
              sub('Dates and deadlines', '/faculty/dates/', 'topic', 'policies-dates-forms'),
              sub('Annual faculty meeting', '/faculty/meetings/', 'topic', 'persona-faculty-staff'),
              sub('Committees', '/faculty/committees/', 'topic', 'persona-faculty-staff'),
              sub('Faculty honors', '/faculty/honors/', 'topic', 'news-publications'),
              sub('Advising toolbox', '/faculty/advising/', 'task', 'advising-support'),
              sub('Courses approval', '/faculty/courses/', 'task', 'courses-gened'),
              sub('Curricula approval', '/faculty/curricula/', 'task', 'courses-gened'),
              sub('Faculty policy manual', '/faculty/policies/', 'topic', 'persona-faculty-staff'),
              sub('Employment at LAS', '/faculty/jobs/', 'task', 'persona-faculty-staff'),
              sub('Hiring procedures', '/faculty/hiring/', 'task', 'persona-faculty-staff'),
            ],
          }),
        ],
      },
    ],
  },

  // 7. 2019–2020
  {
    id: 'iter-2019',
    number: 7,
    debutYear: 2019,
    endYear: 2020,
    yearSpanLabel: '2019–2020',
    title: 'Drupal 8 Overhaul & "I Want To..." Task Architecture',
    eraTagline: 'Retirement of the Audience Mega-Menu in favor of Topic navigation + verb-led task shortcuts on bare HTTPS las.illinois.edu',
    canonicalHost: 'las.illinois.edu',
    urlEpochTransition: {
      fromHost: 'www.las.illinois.edu',
      toHost: 'las.illinois.edu',
      year: 2019,
      note: 'Cut over to canonical bare-domain HTTPS (https://las.illinois.edu/), with www.las.illinois.edu 301-redirecting to las.illinois.edu.',
    },
    techSignature: 'Drupal 8 custom theme (college_of_las, Roboto typography, companion mega-panels)',
    visualSummary:
      'Two-tone navy and Illini Orange masthead with an interactive "I want to..." task trigger beside search, a royal-blue 8-item uppercase primary bar ("ABOUT | ADMISSIONS | ACADEMICS | LIFE + CAREER DESIGN | RESEARCH | ALUMNI | NEWS | GIVE NOW"), and full-bleed hero storytelling.',
    iaHeadline:
      'Watershed IA pivot: Audience-Based Primary Navigation retired after 18 years, replaced by Topic domains + verb-first student tasks.',
    iaAnalysis: [
      'Migrating to Drupal 8 on canonical https://las.illinois.edu/ brought the biggest structural rethink in LAS web history. The 4-persona mega-menu disappeared overnight, replaced by an 8-item domain/action bar: About, Admissions, Academics, Life + Career Design, Research, Alumni, News, and Give now. Notice how "Research" returned to Level-1 visibility for the first time since 2000!',
      'To bridge common high-intent journeys without bringing back persona tabs, the header introduced a verb-led "I want to..." task menu ("Apply to LAS | Transfer into LAS | Find forms | Find my advisor | Learn about majors | Give to Illinois")—every single item framed as a user action rather than an identity.',
    ],
    audienceNavCommentary:
      'Internal campus audiences ("Faculty & Staff") were deliberately removed from primary and header navigation entirely and relocated to a dedicated "Resources for faculty and staff" footer menu—initiating LAS’s modern recruitment-and-external focus in header wayfinding.',
    intraEraDrift: [
      {
        years: '2020',
        summary:
          'Added "Welcome from the Dean", "Diversity and inclusion" under About, and pandemic academic continuity links while preserving the "I want to..." task menu and 8-item primary bar.',
      },
    ],
    zones: [
      {
        id: '2019-task-utility',
        name: '"I Want To..." Task Utility Menu',
        zoneType: 'utility-header',
        placement: 'Upper-right orange header band next to site search',
        dominantParadigm: 'task',
        description: 'Verb-first action menu targeting prospective/current student tasks and giving.',
        items: [
          item('I want to...', '#sub-nav', 'task', 'admissions-apply', {
            children: [
              sub('Apply to LAS', '/admissions/attendillinois', 'task', 'admissions-apply'),
              sub('Transfer into LAS', '/admissions/intercollegiate', 'task', 'transfer-pathways'),
              sub('Find forms', '/academics/forms', 'task', 'policies-dates-forms'),
              sub('Find my advisor', '/academics/advising', 'task', 'advising-support'),
              sub('Learn about majors', '/admissions/exploremajors', 'task', 'majors-programs'),
              sub('Give to Illinois', '/giving', 'task', 'giving-make-gift'),
            ],
          }),
        ],
      },
      {
        id: '2019-primary',
        name: 'Primary Domain Mega-Menu',
        zoneType: 'primary',
        placement: 'Royal-blue full-width horizontal navigation bar',
        dominantParadigm: 'topic',
        description: 'Eight-section primary navigation organized by subject domain plus Alumni and Give Now.',
        items: [
          item('About', '/about', 'topic', 'about-overview', {
            children: [
              sub('Statement on Diversity', '/about/diversity', 'topic', 'diversity-inclusion'),
              sub('Fast facts', '/about/facts', 'topic', 'about-overview'),
              sub('Notable alumni', '/about/notablealumni', 'topic', 'alumni-engagement'),
              sub('Accessibility', '/about/accessibility', 'topic', 'about-overview'),
              sub('College leadership', '/about/leadership', 'topic', 'leadership-directory'),
              sub('Directory', '/directory', 'task', 'leadership-directory'),
              sub('LAS departments, units, and programs', '/academics/units', 'topic', 'units-departments'),
              sub('LAS history', '/about/history', 'topic', 'about-overview'),
            ],
          }),
          item('Admissions', '/admissions', 'topic', 'admissions-apply', {
            children: [
              sub('Apply to LAS', '/admissions/attendillinois', 'task', 'admissions-apply'),
              sub('Explore LAS majors', '/admissions/exploremajors', 'topic', 'majors-programs'),
              sub('Admitted student FAQ', '/admissions/admittedfaq', 'topic', 'prospective-faqs-blogs'),
              sub('Prospective student FAQ', '/admissions/prospectivefaq', 'topic', 'prospective-faqs-blogs'),
              sub('Pre-college summer programs', '/admissions/summer', 'topic', 'prospective-faqs-blogs'),
              sub('FAQ on CS + X majors', '/admissions/faqcsx', 'topic', 'prospective-faqs-blogs'),
              sub('LAS Insider blog', '/admissions/lasinsider', 'topic', 'prospective-faqs-blogs'),
            ],
          }),
          item('Academics', '/academics', 'topic', 'majors-programs', {
            children: [
              sub('Academic policies and standing', '/academics/rules', 'topic', 'policies-dates-forms'),
              sub('Academic Workshops', '/academics/workshops', 'topic', 'advising-support'),
              sub('Access and Achievement Program', '/academics/aap', 'topic', 'first-year-wellness'),
              sub('Advising and support', '/academics/advising', 'task', 'advising-support'),
              sub('College distinctions', '/academics/distinctions', 'topic', 'honors-scholarships'),
              sub('Dates and deadlines', '/academics/dates', 'topic', 'policies-dates-forms'),
              sub('Graduation', '/academics/graduation', 'task', 'graduation-commencement'),
              sub('Honors Program', '/academics/honors', 'topic', 'honors-scholarships'),
              sub('International programs', '/academics/international', 'topic', 'study-abroad-global'),
              sub('LAS Lineup student newsletter', '/academics/laslineup', 'topic', 'news-publications'),
              sub('LAS departments', '/academics/units', 'topic', 'units-departments'),
              sub('Programs of study', '/academics/programs', 'topic', 'majors-programs'),
              sub('Scholarships', '/academics/scholarships', 'topic', 'honors-scholarships'),
              sub('Program Change Requests', '/academics/forms', 'task', 'policies-dates-forms'),
            ],
          }),
          item('Life + Career Design', '/lifecareerdesign', 'topic', 'career-internships', {
            children: [
              sub('Apply to be an LAS intern', '/lifecareerdesign/internships', 'task', 'career-internships'),
              sub('Core courses', '/lifecareerdesign/classes', 'topic', 'career-internships'),
              sub('E-portfolios', '/lifecareerdesign/eportfolio', 'topic', 'career-internships'),
              sub('Get started', '/lifecareerdesign/questions', 'task', 'career-internships'),
              sub('Job search tools', '/lifecareerdesign/jobsearch', 'task', 'career-internships'),
              sub('LAS Success workshops', '/lifecareerdesign/lassuccess', 'topic', 'career-internships'),
              sub('Leadership opportunities', '/lifecareerdesign/leadership', 'topic', 'career-internships'),
              sub('Life + Career Design Lab', '/lifecareerdesign/lab', 'topic', 'career-internships'),
              sub('Mapping your future', '/lifecareerdesign/map', 'topic', 'career-internships'),
              sub('Service opportunities', '/lifecareerdesign/service', 'topic', 'career-internships'),
              sub('Wellness resources', '/lifecareerdesign/wellness', 'topic', 'first-year-wellness'),
            ],
          }),
          item('Research', '/research', 'topic', 'research-centers', {
            children: [
              sub('Graduate research opportunities', '/research/graduate', 'topic', 'research-centers'),
              sub('Health and LAS', '/research/health', 'topic', 'research-centers'),
              sub('LAS Experts', '/research/experts', 'topic', 'research-centers'),
              sub('Research facilities and centers', '/research/centers', 'topic', 'research-centers'),
              sub('Undergraduate research', '/research/undergraduate', 'topic', 'research-centers'),
              sub("Dean's Distinguished Lecture series", '/research/deanslecture', 'topic', 'events-calendars'),
            ],
          }),
          item('Alumni', '/alumni', 'audience', 'alumni-engagement', {
            children: [
              sub('Alumni advice', '/alumni/advice', 'topic', 'alumni-engagement'),
              sub('Alumni award programs', '/alumni/awards', 'topic', 'alumni-engagement'),
              sub('Events', '/alumni/events', 'topic', 'events-calendars'),
              sub('Get involved', '/alumni/volunteer', 'task', 'alumni-engagement'),
              sub('LAS Alumni Association', '/alumni/association', 'topic', 'alumni-engagement'),
            ],
          }),
          item('News', '/news', 'topic', 'news-publications', {
            children: [
              sub('Faculty honors', '/news/faculty-honors', 'topic', 'news-publications'),
              sub('LAS News email newsletter archive', '/news/newsletter', 'topic', 'news-publications'),
              sub('LAS News magazine', '/news/magazine', 'topic', 'news-publications'),
              sub('LAS social media', '/news/socialmedia', 'topic', 'news-publications'),
              sub('Media contact in the College of LAS', '/news/media', 'task', 'news-publications'),
            ],
          }),
          item('Give now', '/giving', 'task', 'giving-make-gift'),
        ],
      },
    ],
    footerDisplaced: {
      heading: 'Resources for faculty and staff',
      formerZone: 'Primary Audience Mega-Menu (2014–2018)',
      rationale:
        'Removed from primary navigation so header wayfinding could focus on prospective/student journeys and public academic domains, relocating internal faculty/staff governance links to a dedicated footer block.',
      items: [
        sub('Resources for faculty and staff', '/faculty', 'audience', 'persona-faculty-staff'),
        sub('Advising toolbox', '/faculty/advising', 'task', 'advising-support'),
        sub('Dates and deadlines', '/faculty/dates', 'topic', 'policies-dates-forms'),
        sub('Courses', '/faculty/courses', 'task', 'courses-gened'),
        sub('Curricula', '/faculty/curricula', 'task', 'courses-gened'),
      ],
    },
  },

  // 8. 2021–2024
  {
    id: 'iter-2021',
    number: 8,
    debutYear: 2021,
    endYear: 2024,
    yearSpanLabel: '2021–2024',
    title: 'Campus Block-I Masthead & Recruitment CTA Consolidation',
    eraTagline: 'White campus-aligned header condensing utility links to two conversion pills: "Apply to LAS" and "Make a gift"',
    canonicalHost: 'las.illinois.edu',
    techSignature: 'Drupal 8 → 9 → 10 (refreshed college_of_las theme with campus Block-I banner)',
    visualSummary:
      'Clean white masthead anchored by the navy University of Illinois Urbana-Champaign top ribbon, orange Block-I + College of Liberal Arts & Sciences wordmark, two pill CTAs ("Apply to LAS", "Make a gift"), light-gray title-case primary menu bar, and duotone campaign storytelling.',
    iaHeadline:
      'Sharpened conversion hierarchy: utility header distilled down to recruitment ("Apply to LAS") and philanthropy ("Make a gift").',
    iaAnalysis: [
      'The 2021 visual overhaul aligned LAS with campus Block-I branding while simplifying header choices. The 6-link "I want to..." dropdown was retired in favor of two high-contrast pill buttons in the upper masthead—"Apply to LAS" and "Make a gift"—eliminating secondary clutter around the college’s top two external conversion goals.',
      'In the primary bar, internal branding jargon ("Life + Career Design") was renamed to plain-language "Career readiness" (and broadened again in 2023 to "Student resources" to offload non-curricular items from an overcrowded 16-link Academics menu), while "Give now" expanded into a full 8-item "Giving" dropdown.',
    ],
    audienceNavCommentary:
      'Internal faculty/staff navigation stayed intentionally out of Level-1 primary navigation (anchored in the "Resources for faculty and staff" footer menu, supplemented by a single secondary "Faculty and staff resources" link inside the About dropdown—and "Parent resources" added inside Admissions in 2023).',
    intraEraDrift: [
      {
        years: '2023–2024',
        summary:
          'Broadened L1 "Career readiness" into "Student resources" (/resources), migrating Honors, International programs, Access & Achievement, and First-Year Experience out of Academics; added "Intercollegiate transfers" and "Forms" to Academics, "Parent resources" to Admissions, and updated DEI naming to "Inclusive Excellence" (2024) as the site upgraded through Drupal 9 and Drupal 10.',
      },
    ],
    zones: [
      {
        id: '2021-utility',
        name: 'Masthead Conversion Pill CTAs',
        zoneType: 'utility-header',
        placement: 'Upper-right white masthead beside Block-I college title',
        dominantParadigm: 'task',
        description: 'Distilled two-button utility zone focused strictly on student applications and donor giving.',
        items: [
          item('Apply to LAS', '/admissions/attendillinois', 'task', 'admissions-apply'),
          item('Make a gift', '/giving', 'task', 'giving-make-gift'),
        ],
      },
      {
        id: '2021-primary',
        name: 'Light-Gray Primary Menu Bar',
        zoneType: 'primary',
        placement: 'Full-width light-gray horizontal bar below the white masthead',
        dominantParadigm: 'topic',
        description: 'Eight title-case dropdown menus plus right-aligned search toggle.',
        items: [
          item('About', '/about', 'topic', 'about-overview', {
            children: [
              sub('Departments, units, and programs', '/about/units', 'topic', 'units-departments'),
              sub('Fast facts', '/about/facts', 'topic', 'about-overview'),
              sub('College leadership', '/about/leadership', 'topic', 'leadership-directory'),
              sub('Directory', '/directory', 'task', 'leadership-directory'),
              sub('LAS Strategic Plan', '/about/strategicplan', 'topic', 'about-overview'),
              sub('Faculty and staff resources', '/faculty', 'audience', 'persona-faculty-staff'),
              sub('Diversity and inclusion', '/about/diversity', 'topic', 'diversity-inclusion'),
            ],
          }),
          item('Admissions', '/admissions', 'topic', 'admissions-apply', {
            children: [
              sub('Apply to LAS', '/admissions/attendillinois', 'task', 'admissions-apply'),
              sub('Explore LAS majors', '/admissions/exploremajors', 'topic', 'majors-programs'),
              sub('LAS Insider blog', '/admissions/lasinsider', 'topic', 'prospective-faqs-blogs'),
              sub('Admissions FAQs', '/admissions/faqs', 'topic', 'prospective-faqs-blogs'),
              sub('CS + X majors FAQ', '/admissions/faqcsx', 'topic', 'prospective-faqs-blogs'),
              sub('Pre-college summer programs', '/admissions/summer', 'topic', 'prospective-faqs-blogs'),
            ],
          }),
          item('Academics', '/academics', 'topic', 'majors-programs', {
            children: [
              sub('Student COVID-19 resources', '/academics/covid19', 'topic', 'first-year-wellness'),
              sub('Academic policies and standing', '/academics/rules', 'topic', 'policies-dates-forms'),
              sub('Academic Workshops', '/academics/workshops', 'topic', 'advising-support'),
              sub('Access and Achievement Program', '/academics/aap', 'topic', 'first-year-wellness'),
              sub('Advising and support', '/academics/advising', 'task', 'advising-support'),
              sub('College distinctions', '/academics/distinctions', 'topic', 'honors-scholarships'),
              sub('Dates and deadlines', '/academics/dates', 'topic', 'policies-dates-forms'),
              sub('Departments, units, and programs', '/about/units', 'topic', 'units-departments'),
              sub('Graduation', '/academics/graduation', 'task', 'graduation-commencement'),
              sub('Honors Program', '/academics/honors', 'topic', 'honors-scholarships'),
              sub('International programs', '/academics/international', 'topic', 'study-abroad-global'),
              sub('LAS Lineup student newsletter', '/academics/laslineup', 'topic', 'news-publications'),
              sub('Programs of study', '/academics/programs', 'topic', 'majors-programs'),
              sub('Scholarships', '/academics/scholarships', 'topic', 'honors-scholarships'),
              sub('Program Change Requests', '/academics/forms', 'task', 'policies-dates-forms'),
            ],
          }),
          item('Career readiness', '/lifecareerdesign', 'topic', 'career-internships', {
            children: [
              sub('Classes', '/lifecareerdesign/classes', 'topic', 'career-internships'),
              sub('Internship opportunities', '/lifecareerdesign/internships', 'task', 'career-internships'),
              sub('Life + Career exploration', '/lifecareerdesign/exploration', 'topic', 'career-internships'),
              sub('Life + Career preparation', '/lifecareerdesign/preparation', 'topic', 'career-internships'),
              sub('Leadership and service', '/lifecareerdesign/leadershipservice', 'topic', 'career-internships'),
              sub('Scholarships', '/lifecareerdesign/scholarships', 'topic', 'honors-scholarships'),
              sub('Global learning', 'https://las.illinois.edu/academics/international', 'topic', 'study-abroad-global'),
            ],
          }),
          item('Research', '/research', 'topic', 'research-centers', {
            children: [
              sub('Student research opportunities', '/research/students', 'topic', 'research-centers'),
              sub('Expertise in LAS', '/research/expertise', 'topic', 'research-centers'),
              sub('Research facilities and centers', '/research/facilities', 'topic', 'research-centers'),
              sub("Dean's Distinguished Lecture series", '/research/deanslecture', 'topic', 'events-calendars'),
            ],
          }),
          item('Alumni', '/alumni', 'audience', 'alumni-engagement', {
            children: [
              sub('Alumni advice', '/alumni/advice', 'topic', 'alumni-engagement'),
              sub('Alumni award programs', '/alumni/awards', 'topic', 'alumni-engagement'),
              sub('Events', '/alumni/events', 'topic', 'events-calendars'),
              sub('Get involved', '/alumni/volunteer', 'task', 'alumni-engagement'),
              sub('LAS Alumni Council', '/alumni/council', 'topic', 'alumni-engagement'),
              sub('LAS@Work: Alumni careers', '/alumni/advice/lasatwork', 'topic', 'career-internships'),
              sub('Study Abroad Alumni Networks', '/alumni/abroad', 'topic', 'study-abroad-global'),
            ],
          }),
          item('News', '/news', 'topic', 'news-publications', {
            children: [
              sub('Faculty honors', '/news/faculty-honors', 'topic', 'news-publications'),
              sub('LAS News email newsletter archive', '/news/newsletter', 'topic', 'news-publications'),
              sub('LAS News magazine', '/news/magazine', 'topic', 'news-publications'),
              sub('LAS social media', '/news/socialmedia', 'topic', 'news-publications'),
              sub('Media contact in the College of LAS', '/news/media', 'task', 'news-publications'),
            ],
          }),
          item('Giving', '/giving', 'topic', 'giving-make-gift', {
            children: [
              sub('Give now', '/giving/givenow', 'task', 'giving-make-gift'),
              sub('About giving to LAS', '/giving/about', 'topic', 'giving-make-gift'),
              sub('Building projects', '/giving/building', 'topic', 'giving-make-gift'),
              sub('Corporate engagement', '/giving/corporate', 'topic', 'giving-make-gift'),
              sub('Faculty support', '/giving/faculty', 'topic', 'giving-make-gift'),
              sub('Life + Career Design', '/giving/lifecareer', 'topic', 'giving-make-gift'),
              sub('Lincoln Scholars Initiative', '/giving/lincolnscholars', 'topic', 'giving-make-gift'),
              sub('Impact of giving', '/giving/stories', 'topic', 'giving-make-gift'),
            ],
          }),
        ],
      },
    ],
    footerDisplaced: {
      heading: 'Resources for faculty and staff',
      formerZone: 'Primary Audience Mega-Menu (2014–2018)',
      rationale:
        'Maintained in the footer (expanded with "LAS Services Center" and "Directory") so internal campus operations stay accessible without competing with student recruitment in the primary navigation bar.',
      items: [
        sub('Complete list of resources', '/faculty', 'audience', 'persona-faculty-staff'),
        sub('LAS Services Center', '/faculty/center', 'task', 'persona-faculty-staff'),
        sub('Advising toolbox', '/faculty/advising', 'task', 'advising-support'),
        sub('Dates and deadlines', '/faculty/dates', 'topic', 'policies-dates-forms'),
        sub('Approval process for LAS courses', '/faculty/courses', 'task', 'courses-gened'),
        sub('Approval process for curricula', '/faculty/curricula', 'task', 'courses-gened'),
        sub('Directory', '/directory', 'task', 'leadership-directory'),
      ],
    },
  },

  // 9. 2025–Present
  {
    id: 'iter-2025',
    number: 9,
    debutYear: 2025,
    endYear: null,
    yearSpanLabel: '2025–Present',
    title: 'Illinois Web Theme & Recruitment-First Architecture',
    eraTagline: 'Standardized Campus Toolkit v3 (<ilw-header>) centering student recruitment while keeping campus-internal audiences out of primary nav',
    canonicalHost: 'las.illinois.edu',
    techSignature: 'Drupal 10 + illinois_framework_theme + Illinois Campus Toolkit v3 (<ilw-header>)',
    visualSummary:
      'Standardized University of Illinois <ilw-header> masthead featuring "Visit | Apply | Give" action links beside search, accessible high-contrast dropdown bar, full-width hero photography with "Explore majors / Apply / Visit" conversion buttons, and modular story blocks.',
    iaHeadline:
      'Deliberate Recruitment-First IA: "Visit | Apply | Give" utility funnel + student-centered primary menu, with internal faculty/staff governance excluded from primary navigation.',
    iaAnalysis: [
      'Adopting the campus-wide Illinois Web Theme (<ilw-header>) crystallized LAS’s strategic Recruitment-First navigation model. Adding "Visit" alongside "Apply" and "Give" in the top utility slot—mirrored immediately by "Explore majors | Apply | Visit" hero CTAs—aligns the header tightly around the prospective-student recruitment funnel.',
      'Across the 8 primary menus (About, Admissions, Academics, Student resources, Research, Alumni, News, Giving/Give), curriculum and support are cleanly separated: Academics holds degree rules, advising, ICTs, and majors/minors, while Student resources houses co-curricular success (Career services, FYE, Honors, International programs, Internships, Paul M. Lisnek LAS Hub).',
    ],
    audienceNavCommentary:
      'Reflecting an explicit UX/UI decision by the LAS web team to prioritize student recruitment, pages geared toward internal campus audiences (faculty and staff) are intentionally excluded from primary Level-1 navigation—living instead in the dedicated "Resources for faculty and staff" footer menu (with a single secondary cross-link inside About). Notably, student- and external-aligned groupings ("Student resources" and "Alumni" at L1; "Parent resources" under Admissions) remain only where they reinforce student success and external engagement.',
    intraEraDrift: [
      {
        years: '2026 (Live)',
        summary:
          'Converted the 8th primary label from noun "Giving" to action verb "Give", added "College mission, vision and values" and "Educational Excellence" under About, "Online programs" under Academics, and "Health & wellness resources" under Student resources.',
      },
    ],
    zones: [
      {
        id: '2025-utility',
        name: 'Recruitment & Philanthropy Utility Header',
        zoneType: 'utility-header',
        placement: 'Upper-right <ilw-header> utility slot next to search',
        dominantParadigm: 'task',
        description: 'Three verb-driven conversion CTAs leading with prospective campus visits and applications.',
        items: [
          item('Visit', 'https://www.admissions.illinois.edu/visit', 'task', 'visit-campus'),
          item('Apply', 'https://las.illinois.edu/admissions/attendillinois', 'task', 'admissions-apply'),
          item('Give', 'https://las.illinois.edu/giving', 'task', 'giving-make-gift'),
        ],
      },
      {
        id: '2025-primary',
        name: 'Illinois Web Theme Primary Menu (<ilw-header>)',
        zoneType: 'primary',
        placement: 'Standardized <ilw-header> horizontal menu bar with accessible disclosure panels',
        dominantParadigm: 'topic',
        description: 'Eight primary menus balancing prospective recruitment, academic journeys, research, and external advancement.',
        items: [
          item('About', '/about', 'topic', 'about-overview', {
            children: [
              sub('Departments, units, and programs', '/about/units', 'topic', 'units-departments'),
              sub('College leadership', '/about/leadership', 'topic', 'leadership-directory'),
              sub('Directory', '/directory', 'task', 'leadership-directory'),
              sub('Fast facts', '/about/facts', 'topic', 'about-overview'),
              sub('Inclusive Excellence', '/about/ie', 'topic', 'diversity-inclusion'),
              sub('Public engagement in LAS', '/about/publicengagement', 'topic', 'research-centers'),
              sub('Faculty & staff resources', '/faculty', 'audience', 'persona-faculty-staff'),
            ],
          }),
          item('Admissions', '/admissions', 'topic', 'admissions-apply', {
            children: [
              sub('Apply to LAS', '/admissions/attendillinois', 'task', 'admissions-apply'),
              sub('Liberal arts & sciences majors', '/admissions/explore', 'topic', 'majors-programs'),
              sub('LAS Insider blog', '/admissions/lasinsider', 'topic', 'prospective-faqs-blogs'),
              sub('Admissions FAQs', '/admissions/faqs', 'topic', 'prospective-faqs-blogs'),
              sub('Parent resources', '/admissions/parents', 'audience', 'persona-students-parents'),
              sub('Pre-college summer programs', '/admissions/summer', 'topic', 'prospective-faqs-blogs'),
            ],
          }),
          item('Academics', '/academics', 'topic', 'majors-programs', {
            children: [
              sub('Academic policies and standing', '/academics/rules', 'topic', 'policies-dates-forms'),
              sub('Advising and support', '/academics/advising', 'task', 'advising-support'),
              sub('College distinctions', '/academics/distinctions', 'topic', 'honors-scholarships'),
              sub('Dates and deadlines', '/academics/dates', 'topic', 'policies-dates-forms'),
              sub('Forms', '/academics/forms', 'task', 'policies-dates-forms'),
              sub('Graduation', '/academics/graduation', 'task', 'graduation-commencement'),
              sub('Intercollegiate transfers', '/academics/icts', 'task', 'transfer-pathways'),
              sub('Majors & minors', '/academics/programs', 'topic', 'majors-programs'),
              sub('Scholarships', '/academics/scholarships', 'topic', 'honors-scholarships'),
            ],
          }),
          item('Student resources', '/resources', 'hybrid', 'persona-students-parents', {
            children: [
              sub('Access and Achievement Program', '/resources/aap', 'topic', 'first-year-wellness'),
              sub('Career services', '/resources/career', 'topic', 'career-internships'),
              sub('Courses', '/resources/classes', 'topic', 'courses-gened'),
              sub('First-Year Experience', '/resources/fye', 'topic', 'first-year-wellness'),
              sub('Honors program', '/resources/honors', 'topic', 'honors-scholarships'),
              sub('International programs', '/resources/international', 'topic', 'study-abroad-global'),
              sub('Internship opportunities', '/resources/internships', 'task', 'career-internships'),
              sub('LAS Lineup newsletter', '/resources/laslineup', 'topic', 'news-publications'),
              sub('Paul M. Lisnek LAS Hub', '/resources/hub', 'topic', 'advising-support'),
            ],
          }),
          item('Research', '/research', 'topic', 'research-centers', {
            children: [
              sub('Expertise in LAS', '/research/expertise', 'topic', 'research-centers'),
              sub('Research centers & institutes', '/research/facilities', 'topic', 'research-centers'),
              sub('Student research', '/research/students', 'topic', 'research-centers'),
              sub('Resources for LAS researchers', '/research/resources', 'topic', 'research-centers'),
              sub('Request support', 'https://apps.atlas.illinois.edu/', 'task', 'research-centers'),
              sub("Dean's Distinguished Lecture series", '/research/deanslecture', 'topic', 'events-calendars'),
            ],
          }),
          item('Alumni', '/alumni', 'audience', 'alumni-engagement', {
            children: [
              sub('Alumni advice', '/alumni/advice', 'topic', 'alumni-engagement'),
              sub('Alumni award programs', '/alumni/awards', 'topic', 'alumni-engagement'),
              sub('Events', '/alumni/events', 'topic', 'events-calendars'),
              sub('Get involved', '/alumni/volunteer', 'task', 'alumni-engagement'),
              sub('LAS Alumni Council', '/alumni/council', 'topic', 'alumni-engagement'),
              sub('LAS store', 'https://las.illini.store/', 'task', 'alumni-engagement'),
              sub('LAS@Work: Alumni careers', '/alumni/advice/lasatwork', 'topic', 'career-internships'),
              sub('Study Abroad Alumni Networks', '/alumni/abroad', 'topic', 'study-abroad-global'),
            ],
          }),
          item('News', '/news', 'topic', 'news-publications', {
            children: [
              sub('Faculty honors', '/news/faculty-honors', 'topic', 'news-publications'),
              sub('The Quadrangle', '/news/magazine', 'topic', 'news-publications'),
              sub('LAS News email newsletter archive', '/news/newsletter', 'topic', 'news-publications'),
              sub('LAS social media', '/news/socialmedia', 'topic', 'news-publications'),
              sub('Media contact in the College of LAS', '/news/media', 'task', 'news-publications'),
            ],
          }),
          item('Giving', '/giving', 'topic', 'giving-make-gift', {
            children: [
              sub('Day of Giving', '/giving/dayofgiving', 'task', 'giving-make-gift'),
              sub('Give now', '/giving/givenow', 'task', 'giving-make-gift'),
              sub('About giving to LAS', '/giving/about', 'topic', 'giving-make-gift'),
              sub('Building projects', '/giving/building', 'topic', 'giving-make-gift'),
              sub('Corporate engagement', '/giving/corporate', 'topic', 'giving-make-gift'),
              sub('Faculty support', '/giving/faculty', 'topic', 'giving-make-gift'),
              sub('Lincoln Scholars Initiative', '/giving/lincolnscholars', 'topic', 'giving-make-gift'),
              sub('Impact of giving', '/giving/stories', 'topic', 'giving-make-gift'),
              sub('Diversity, equity, and inclusion', '/giving/diversity', 'topic', 'diversity-inclusion'),
            ],
          }),
        ],
      },
    ],
    footerDisplaced: {
      heading: 'Resources for faculty and staff',
      formerZone: 'Primary Audience Mega-Menu (2014–2018)',
      rationale:
        'Strategic LAS UX decision: keep internal campus audience links out of the primary navigation bar so primary/utility header real estate remains focused on student recruitment and external engagement.',
      items: [
        sub('Complete list of resources', '/faculty', 'audience', 'persona-faculty-staff'),
        sub('LAS Services Center', '/faculty/center', 'task', 'persona-faculty-staff'),
        sub('Advising toolbox', '/faculty/advising', 'task', 'advising-support'),
        sub('Dates and deadlines', '/faculty/dates', 'topic', 'policies-dates-forms'),
        sub('Approval process for courses', '/faculty/courses', 'task', 'courses-gened'),
        sub('Approval process for curricula', '/faculty/curricula', 'task', 'courses-gened'),
        sub('Directory', '/directory', 'task', 'leadership-directory'),
      ],
    },
  },
];

/** @type {import('../src/types/retrospective').DesignIteration[]} */
const iterations = rawIterations.map((it) => {
  const m = manifestByYear.get(it.debutYear);
  if (!m) throw new Error(`Missing manifest entry for debutYear ${it.debutYear}`);
  return {
    ...it,
    metrics: computeMetrics(it.zones),
    showcaseFoldImage: `screenshots/${it.debutYear}-fold.webp`,
    showcaseFullImage: `screenshots/${it.debutYear}-full.webp`,
    showcaseWaybackUrl: m.waybackUrl,
    showcaseCaptureDate: m.dateFormatted,
  };
});

/** @type {Record<number, string>} */
const yearHighlights = {
  2000: 'Earliest Wayback capture era: 4-table white directory grouping 13 flat links under College, Program/Course, and External Relations.',
  2001: 'Major Refresh: Debuts the Main Quad panorama header, horizontal navbar, and explicit "For Students / Faculty / Alumni" gateways.',
  2002: 'Replaces the lower duplicate gateway directory with featured LAS stories and campus announcements beneath the 7-item top bar.',
  2003: 'Expands homepage editorial photo features while maintaining the 2001 horizontal topic + audience bar.',
  2004: 'Final autumn of the 2001 Quad-panorama layout prior to the 2005 periwinkle magazine redesign.',
  2005: 'Major Refresh: Introduces Foellinger periwinkle layout with top-right utility pill and bracketed "Resources For" audience bar.',
  2006: 'Adds /css/mainnav.css multi-item hover dropdowns under the 6 bar items and introduces an orange "mobile version" top banner.',
  2007: 'Shortens "Academic Units" to "Units" with 45 Level-2 dropdown links and adds a left-rail "Find a Place" campus map button.',
  2008: 'Major Refresh + URL Epoch Transition to www.las.illinois.edu: ATLAS zero-table teal/orange design with hero audience tabs.',
  2009: 'Continues the semantic ATLAS layout across the Lincoln Hall renovation campaign.',
  2010: 'Summer capture maintaining the 5-item black institutional bar and 3-tab orange hero audience navigation.',
  2011: 'Expands top black bar with "Online Education" and renames "News" to "News & Research".',
  2012: 'Adds "Latitudes" international newsletter tab to the top bar alongside Online Education and Give to LAS; celebrates Lincoln Hall reopening.',
  2013: 'Final year of the fixed-width 2008 ATLAS design (and final year www.las.uiuc.edu mirrored content before 301-redirecting in 2014).',
  2014: 'Major Refresh: Bootstrap 3 responsive debut handing 100% of primary navigation to 4 Audience mega-menus (67 Level-2 links).',
  2015: 'Refines Prospective Students mega-menu links while retaining the slate architectural header and stacked banner layout.',
  2016: 'Major Refresh: Bright Illini Orange header banner, white utility bar with oversized "GIVE to LAS" CTA, and 3-column news card grid.',
  2017: 'Replaces "Contact" with "Directory" in the top white utility bar above the orange masthead.',
  2018: 'Adopts the updated Illinois wordmark in the orange masthead; final year of Audience-Based Primary Navigation and www.las.illinois.edu.',
  2019: 'Major Refresh + URL Epoch Transition to bare HTTPS las.illinois.edu: Drupal 8 launch with Topic primary nav, "I want to..." task bar, and faculty/staff moved to footer.',
  2020: 'Adds "Diversity and inclusion", "Welcome from the Dean", and pandemic academic support links within the 2019 Drupal 8 layout.',
  2021: 'Major Refresh: White Block-I campus masthead condensing utility CTAs to "Apply to LAS" + "Make a gift" and renaming "Life + Career Design" to "Career readiness".',
  2022: 'Upgrades to Drupal 9 while maintaining the two-pill conversion header and 8-section light-gray primary menu.',
  2023: 'Intra-era IA refinement: Renames "Career readiness" to "Student resources" (consolidating Honors, International, FYE, and AAP) and adds "Parent resources" under Admissions.',
  2024: 'Upgrades to Drupal 10 and updates About submenu naming to "Inclusive Excellence" ahead of the Campus Web Theme migration.',
  2025: 'Major Refresh: Adopts Illinois Web Theme (<ilw-header>) with "Visit | Apply | Give" recruitment utility bar and Recruitment-First primary IA.',
  2026: 'Current live state on las.illinois.edu: tightens 8th primary label to action verb "Give" and adds Mission/Values and Online programs.',
};

function findIterationForYear(year) {
  const found = iterations.find(
    (it) => year >= it.debutYear && (it.endYear === null || year <= it.endYear)
  );
  if (!found) throw new Error(`No iteration covers year ${year}`);
  return found;
}

/** @type {import('../src/types/retrospective').AnnualSnapshot[]} */
const snapshots = manifest.map((m) => {
  const iter = findIterationForYear(m.year);
  const rep = captureReport[m.year] || { capturedFullHeight: 900, brokenImages: 0, totalVisibleImages: 0 };
  const broken = rep.brokenImages || 0;

  let archivalNote;
  if (broken > 0) {
    archivalNote = `${broken} of ${rep.totalVisibleImages} inline image asset${broken === 1 ? '' : 's'} not preserved in this Wayback crawl; layout and CSS rendered intact.`;
  } else if (m.year === 2010) {
    archivalNote = 'Earliest clean HTTP 200 capture in 2010 is from June (early-fall crawl returned redirects).';
  }

  let urlEpochTransition;
  if (m.year === 2008) {
    urlEpochTransition = 'www.las.uiuc.edu → www.las.illinois.edu (Aug 2008)';
  } else if (m.year === 2019) {
    urlEpochTransition = 'www.las.illinois.edu → las.illinois.edu (HTTPS bare domain)';
  }

  return {
    year: m.year,
    iterationId: iter.id,
    isMajorRefresh: iter.debutYear === m.year,
    canonicalHost: m.canonicalHost,
    ...(urlEpochTransition ? { urlEpochTransition } : {}),
    captureDate: m.year === 2026 ? '2026-11-13 (Live + Oct 2026 Archive)' : m.dateFormatted,
    waybackTimestamp: m.timestamp,
    waybackUrl: m.waybackUrl,
    ...(m.year === 2026 ? { liveUrl: 'https://las.illinois.edu/' } : {}),
    foldImage: `screenshots/${m.year}-fold.webp`,
    fullImage: `screenshots/${m.year}-full.webp`,
    capturedFullHeight: rep.capturedFullHeight || 900,
    brokenImages: broken,
    ...(archivalNote ? { archivalNote } : {}),
    yearHighlight: yearHighlights[m.year] || '',
  };
});

writeFileSync(join(DATA_DIR, 'taxonomy.json'), JSON.stringify(taxonomy, null, 2));
writeFileSync(join(DATA_DIR, 'iterations.json'), JSON.stringify(iterations, null, 2));
writeFileSync(join(DATA_DIR, 'snapshots.json'), JSON.stringify(snapshots, null, 2));

console.log(
  `Built datasets: ${taxonomy.domains.length} domains, ${taxonomy.concepts.length} canonical concepts, ${iterations.length} design iterations, ${snapshots.length} annual snapshots.`
);
for (const it of iterations) {
  console.log(
    `  [${it.yearSpanLabel.padEnd(12)}] ${it.title.padEnd(48)} L1=${String(it.metrics.level1Count).padStart(2)} L2=${String(it.metrics.level2Count).padStart(2)} L1_aud=${String(it.metrics.l1ParadigmPercentages.audience).padStart(2)}% audGated=${String(it.metrics.audienceGatedPercentage).padStart(2)}%`
  );
}
