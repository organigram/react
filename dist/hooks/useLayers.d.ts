import { OrganigramJson } from '@organigram/js';
export interface UseLayersOptions {
    storage?: DiagramLayerStorage | null;
    onStorageError?: () => void;
}
export interface LayersState {
    activeLayerIds: string[];
    visibleOrganigram: OrganigramJson;
    classicVisibleOrganigram: OrganigramJson;
    toggleLayer: (layerId: string) => void;
    showAll: () => void;
}
export interface DiagramLayer {
    id: string;
    organs: ReadonlyArray<{
        organAddress: string;
    }>;
    procedures: ReadonlyArray<{
        procedureAddress: string;
    }>;
    assets: ReadonlyArray<{
        assetAddress: string;
    }>;
}
export interface DiagramLayerStorage {
    getItem: (key: string) => string | null;
    setItem: (key: string, value: string) => void;
}
export declare const getDiagramLayerStorageKey: (organigramId: string) => string;
export declare const readActiveDiagramLayerIds: (storage: DiagramLayerStorage, organigramId: string) => string[];
export declare const writeActiveDiagramLayerIds: (storage: DiagramLayerStorage, organigramId: string, activeLayerIds: string[]) => void;
export declare const sanitizeActiveDiagramLayerIds: (activeLayerIds: string[], availableLayerIds: string[]) => string[];
export declare const filterDiagramByLayers: (organigram: OrganigramJson, layers: ReadonlyArray<DiagramLayer>, activeLayerIds: string[]) => OrganigramJson;
export declare const filterClassicDiagramByLayers: (organigram: OrganigramJson, layers: ReadonlyArray<DiagramLayer>, activeLayerIds: string[]) => OrganigramJson;
export declare const useLayers: (organigram: OrganigramJson, layers: ReadonlyArray<DiagramLayer>, options?: UseLayersOptions) => LayersState;
