import { Dispatch, SetStateAction } from 'react'
import {
  atom,
  useRecoilValue,
  useRecoilState,
  useSetRecoilState,
  type SetterOrUpdater
} from 'recoil'

/**
 * React element currently mounted inside the shared modal slot.
 */
export type ModalType = null | JSX.Element

/**
 * React state setter signature for the shared modal slot.
 */
export type SetModal = Dispatch<SetStateAction<ModalType>>

/**
 * Global recoil state storing the currently opened modal.
 */
export const modalState = atom({
  key: 'modal',
  default: null as ModalType
})

/**
 * Read the current modal content.
 */
export const useModal: () => ModalType = () => useRecoilValue(modalState)

/**
 * Update the current modal content.
 */
export const useSetModal: () => SetterOrUpdater<ModalType> = () =>
  useSetRecoilState(modalState)

/**
 * Read and update the current modal content.
 */
export const useModalState: () => [
  ModalType,
  SetterOrUpdater<ModalType>
] = () => useRecoilState(modalState)
