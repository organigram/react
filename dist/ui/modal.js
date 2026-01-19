"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useModalState = exports.useSetModal = exports.useModal = exports.modalState = void 0;
const recoil_1 = require("recoil");
exports.modalState = (0, recoil_1.atom)({
    key: 'modal',
    default: null
});
const useModal = () => (0, recoil_1.useRecoilValue)(exports.modalState);
exports.useModal = useModal;
const useSetModal = () => (0, recoil_1.useSetRecoilState)(exports.modalState);
exports.useSetModal = useSetModal;
const useModalState = () => (0, recoil_1.useRecoilState)(exports.modalState);
exports.useModalState = useModalState;
