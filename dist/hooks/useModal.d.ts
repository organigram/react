import { Dispatch, SetStateAction } from 'react';
import { SetterOrUpdater } from 'recoil';
export type ModalType = null | JSX.Element;
export type SetModal = Dispatch<SetStateAction<ModalType>>;
export declare const modalState: import('recoil').RecoilState<JSX.Element | null>;
export declare const useModal: () => ModalType;
export declare const useSetModal: () => SetterOrUpdater<ModalType>;
export declare const useModalState: () => [
    ModalType,
    SetterOrUpdater<ModalType>
];
