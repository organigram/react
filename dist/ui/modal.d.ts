import { Dispatch, SetStateAction } from 'react';
import { type SetterOrUpdater } from 'recoil';
export type Modal = null | JSX.Element;
export type SetModal = Dispatch<SetStateAction<Modal>>;
export declare const modalState: import("recoil").RecoilState<JSX.Element | null>;
export declare const useModal: () => Modal;
export declare const useSetModal: () => SetterOrUpdater<Modal>;
export declare const useModalState: () => [Modal, SetterOrUpdater<Modal>];
