"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLayers = exports.layersState = void 0;
const recoil_1 = require("recoil");
exports.layersState = (0, recoil_1.atom)({
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
const useLayers = () => (0, recoil_1.useRecoilState)(exports.layersState);
exports.useLayers = useLayers;
