import type {
  AnnualSnapshot,
  CanonicalConcept,
  DesignIteration,
  NavigationParadigm,
  NavigationZoneType,
  TaxonomyDataset,
} from '../types/retrospective';

export function withBase(assetPath: string): string {
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanAsset = assetPath.replace(/^\/+/, '');
  return `${cleanBase}${cleanAsset}`;
}

export type CellResidencyCode =
  | 'P1'
  | 'P2'
  | 'AUD'
  | 'A2'
  | 'UTL'
  | 'U2'
  | 'SDB'
  | 'FTR'
  | 'NONE';

export interface ConceptCellMatch {
  code: CellResidencyCode;
  badgeLabel: string;
  zoneSummary: string;
  entries: {
    label: string;
    href: string;
    zoneName: string;
    level: 1 | 2 | 'footer';
    parentLabel?: string;
    paradigm: NavigationParadigm;
  }[];
}

const CODE_PRIORITY: Record<CellResidencyCode, number> = {
  P1: 1,
  AUD: 2,
  UTL: 3,
  P2: 4,
  A2: 5,
  U2: 6,
  SDB: 7,
  FTR: 8,
  NONE: 99,
};

const CODE_META: Record<CellResidencyCode, { badgeLabel: string; zoneSummary: string }> = {
  P1: { badgeLabel: 'P·L1', zoneSummary: 'Primary Nav (Level 1)' },
  P2: { badgeLabel: 'P·L2', zoneSummary: 'Primary Submenu (Level 2)' },
  AUD: { badgeLabel: 'AUD·L1', zoneSummary: 'Audience Bar (Level 1)' },
  A2: { badgeLabel: 'AUD·L2', zoneSummary: 'Audience Mega-Menu (Level 2)' },
  UTL: { badgeLabel: 'UTL·L1', zoneSummary: 'Utility Header (Level 1)' },
  U2: { badgeLabel: 'UTL·L2', zoneSummary: 'Utility Menu (Level 2)' },
  SDB: { badgeLabel: 'SIDE', zoneSummary: 'Sidebar Navigation' },
  FTR: { badgeLabel: 'FOOTER', zoneSummary: 'Displaced to Footer' },
  NONE: { badgeLabel: '—', zoneSummary: 'Not in homepage navigation' },
};

function zoneLevelToCode(zoneType: NavigationZoneType, level: 1 | 2): CellResidencyCode {
  if (zoneType === 'primary') return level === 1 ? 'P1' : 'P2';
  if (zoneType === 'audience-bar') return level === 1 ? 'AUD' : 'A2';
  if (zoneType === 'utility-header') return level === 1 ? 'UTL' : 'U2';
  return 'SDB';
}

export function buildConceptMatrix(
  taxonomy: TaxonomyDataset,
  iterations: DesignIteration[]
): Record<string, Record<string, ConceptCellMatch>> {
  const matrix: Record<string, Record<string, ConceptCellMatch>> = {};

  for (const concept of taxonomy.concepts) {
    matrix[concept.id] = {};
    for (const iter of iterations) {
      const entries: ConceptCellMatch['entries'] = [];
      let bestCode: CellResidencyCode = 'NONE';

      for (const zone of iter.zones) {
        for (const l1 of zone.items) {
          if (l1.conceptId === concept.id) {
            const code = zoneLevelToCode(zone.zoneType, 1);
            if (CODE_PRIORITY[code] < CODE_PRIORITY[bestCode]) bestCode = code;
            entries.push({
              label: l1.label,
              href: l1.href,
              zoneName: zone.name,
              level: 1,
              paradigm: l1.paradigm,
            });
          }
          if (l1.children) {
            for (const l2 of l1.children) {
              if (l2.conceptId === concept.id) {
                const code = zoneLevelToCode(zone.zoneType, 2);
                if (CODE_PRIORITY[code] < CODE_PRIORITY[bestCode]) bestCode = code;
                entries.push({
                  label: l2.label,
                  href: l2.href,
                  zoneName: zone.name,
                  level: 2,
                  parentLabel: l1.label,
                  paradigm: l2.paradigm,
                });
              }
            }
          }
        }
      }

      if (iter.footerDisplaced) {
        for (const fi of iter.footerDisplaced.items) {
          if (fi.conceptId === concept.id) {
            if (CODE_PRIORITY.FTR < CODE_PRIORITY[bestCode]) bestCode = 'FTR';
            entries.push({
              label: fi.label,
              href: fi.href,
              zoneName: `Footer: ${iter.footerDisplaced.heading}`,
              level: 'footer',
              paradigm: fi.paradigm,
            });
          }
        }
      }

      matrix[concept.id][iter.id] = {
        code: bestCode,
        badgeLabel: CODE_META[bestCode].badgeLabel,
        zoneSummary: CODE_META[bestCode].zoneSummary,
        entries,
      };
    }
  }

  return matrix;
}

export function getSnapshotsForIteration(
  snapshots: AnnualSnapshot[],
  iterationId: string
): AnnualSnapshot[] {
  return snapshots.filter((s) => s.iterationId === iterationId).sort((a, b) => a.year - b.year);
}

export function countConceptPresence(
  concept: CanonicalConcept,
  iterations: DesignIteration[],
  matrix: Record<string, Record<string, ConceptCellMatch>>
): { headerEras: number; footerOnlyEras: number } {
  let headerEras = 0;
  let footerOnlyEras = 0;
  for (const it of iterations) {
    const cell = matrix[concept.id]?.[it.id];
    if (!cell || cell.code === 'NONE') continue;
    if (cell.code === 'FTR') footerOnlyEras++;
    else headerEras++;
  }
  return { headerEras, footerOnlyEras };
}
