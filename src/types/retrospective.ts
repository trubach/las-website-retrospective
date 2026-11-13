export type UrlEpoch = 'www.las.uiuc.edu' | 'www.las.illinois.edu' | 'las.illinois.edu';

export type NavigationZoneType = 'primary' | 'audience-bar' | 'utility-header' | 'sidebar';

export type NavigationParadigm = 'audience' | 'topic' | 'task' | 'hybrid';

export interface ConceptDomain {
  id: string;
  name: string;
  description: string;
}

export interface CanonicalConcept {
  id: string;
  domainId: string;
  name: string;
  shortName: string;
  defaultParadigm: NavigationParadigm;
  description: string;
}

export interface TaxonomyDataset {
  domains: ConceptDomain[];
  concepts: CanonicalConcept[];
}

export interface NavSubItem {
  label: string;
  href: string;
  paradigm: NavigationParadigm;
  conceptId: string;
}

export interface NavItem {
  label: string;
  href: string;
  paradigm: NavigationParadigm;
  conceptId: string;
  groupHeading?: string;
  children?: NavSubItem[];
}

export interface NavigationZone {
  id: string;
  name: string;
  zoneType: NavigationZoneType;
  placement: string;
  dominantParadigm: NavigationParadigm;
  description: string;
  items: NavItem[];
}

export interface FooterDisplacedGroup {
  heading: string;
  formerZone: string;
  rationale: string;
  items: NavSubItem[];
}

export interface IntraEraDriftNote {
  years: string;
  summary: string;
}

export interface UrlEpochTransition {
  fromHost: UrlEpoch;
  toHost: UrlEpoch;
  year: number;
  note: string;
}

export interface IterationMetrics {
  zoneCount: number;
  level1Count: number;
  level2Count: number;
  totalItems: number;
  maxDepth: 1 | 2;
  paradigmCounts: Record<NavigationParadigm, number>;
  paradigmPercentages: Record<NavigationParadigm, number>;
  l1ParadigmPercentages: Record<NavigationParadigm, number>;
  audienceGatedPercentage: number;
}

export interface DesignIteration {
  id: string;
  number: number;
  debutYear: number;
  endYear: number | null;
  yearSpanLabel: string;
  title: string;
  eraTagline: string;
  canonicalHost: UrlEpoch;
  urlEpochTransition?: UrlEpochTransition;
  techSignature: string;
  visualSummary: string;
  iaHeadline: string;
  iaAnalysis: string[];
  audienceNavCommentary: string;
  intraEraDrift: IntraEraDriftNote[];
  zones: NavigationZone[];
  footerDisplaced?: FooterDisplacedGroup;
  metrics: IterationMetrics;
  showcaseFoldImage: string;
  showcaseFullImage: string;
  showcaseWaybackUrl: string;
  showcaseCaptureDate: string;
}

export interface AnnualSnapshot {
  year: number;
  iterationId: string;
  isMajorRefresh: boolean;
  canonicalHost: UrlEpoch;
  urlEpochTransition?: string;
  captureDate: string;
  waybackTimestamp: string;
  waybackUrl: string;
  liveUrl?: string;
  foldImage: string;
  fullImage: string;
  capturedFullHeight: number;
  brokenImages: number;
  archivalNote?: string;
  yearHighlight: string;
}
