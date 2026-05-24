import { OrganEntry, OrganigramJson, OrganJson } from '@organigram/js';
export interface ClassicOrgChartNode {
    organ: OrganJson;
    entries: OrganEntry[];
    children: ClassicOrgChartNode[];
}
export declare const projectOrganigramToClassicForest: (organigram: OrganigramJson) => ClassicOrgChartNode[];
