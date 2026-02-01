import { SetterOrUpdater } from 'recoil';
export interface Layer {
    name: string;
    organIds: string[];
    procedureIds: string[];
    showAdminPermissions: boolean;
    showEntriesPermissions: boolean;
    showAssetsPermissions: boolean;
    isPublic: boolean;
    isHidden: boolean;
}
export declare const layersState: import('recoil').RecoilState<Layer[]>;
export declare const useLayers: () => [Layer[], SetterOrUpdater<Layer[]>];
