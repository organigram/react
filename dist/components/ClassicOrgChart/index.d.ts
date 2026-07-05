import { default as React } from 'react';
import { OrganigramJson, OrganJson } from '@organigram/js';
export interface ClassicOrgChartProps {
    organigram: OrganigramJson | null;
    controls?: boolean;
    isTabletOrAbove?: boolean;
    onClickOrgan?: (organ: OrganJson) => void;
    style?: Record<string, unknown>;
    testIdPrefix?: string;
}
export declare const ClassicOrgChart: React.FC<ClassicOrgChartProps>;
