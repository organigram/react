import { Dispatch, SetStateAction } from 'react'
import {
  atom,
  useRecoilValue,
  useRecoilState,
  useSetRecoilState,
  type SetterOrUpdater
} from 'recoil'

export type ModalType = null | JSX.Element
export type SetModal = Dispatch<SetStateAction<ModalType>>

export const modalState = atom({
  key: 'modal',
  default: null as ModalType
})

export const useModal: () => ModalType = () => useRecoilValue(modalState)
export const useSetModal: () => SetterOrUpdater<ModalType> = () =>
  useSetRecoilState(modalState)
export const useModalState: () => [
  ModalType,
  SetterOrUpdater<ModalType>
] = () => useRecoilState(modalState)
