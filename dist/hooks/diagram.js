import { atom, useRecoilState } from 'recoil';
export const layersState = atom({
    key: 'layers',
    default: [
        {
            name: 'Layer 0',
            showAdminPermissions: false,
            showEntriesPermissions: true,
            showAssetsPermissions: true,
            isPublic: false,
            isHidden: false,
            organIds: [],
            procedureIds: []
        }
    ]
});
export const useLayers = () => useRecoilState(layersState);
