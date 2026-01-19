import { Dispatch, SetStateAction } from 'react'
import {
  atom,
  useRecoilValue,
  useRecoilState,
  useSetRecoilState,
  type SetterOrUpdater
} from 'recoil'

export type Modal = null | JSX.Element
export type SetModal = Dispatch<SetStateAction<Modal>>

export const modalState = atom({
  key: 'modal',
  default: null as Modal
})

export const useModal: () => Modal = () => useRecoilValue(modalState)
export const useSetModal: () => SetterOrUpdater<Modal> = () =>
  useSetRecoilState(modalState)
export const useModalState: () => [Modal, SetterOrUpdater<Modal>] = () =>
  useRecoilState(modalState)
