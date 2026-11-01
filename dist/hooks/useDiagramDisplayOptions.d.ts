import { SetterOrUpdater } from 'recoil';
export interface DiagramDisplayOptions {
    showAdminPermissions: boolean;
    showEntriesPermissions: boolean;
    showAssetsPermissions: boolean;
}
export declare const defaultDiagramDisplayOptions: DiagramDisplayOptions;
export declare const useDiagramDisplayOptions: () => [DiagramDisplayOptions, SetterOrUpdater<DiagramDisplayOptions>];
