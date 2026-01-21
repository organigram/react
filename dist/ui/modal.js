import { atom, useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';
export const modalState = atom({
    key: 'modal',
    default: null
});
export const useModal = () => useRecoilValue(modalState);
export const useSetModal = () => useSetRecoilState(modalState);
export const useModalState = () => useRecoilState(modalState);
