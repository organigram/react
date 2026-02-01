import React, { createContext, useEffect, type ReactNode } from 'react'
import Grid from '@mui/material/Grid'
import MuiModal from '@mui/material/Modal'
import { useRecoilState, type SetterOrUpdater } from 'recoil'
import { modalState } from '../src'

export interface ModalState {
  modal: ReactNode | null
  setModal: SetterOrUpdater<JSX.Element | null>
  id?: string
}

const ModalContext = createContext<ModalState>({
  modal: null,
  setModal: _ => undefined
})

export const ModalProvider: React.FC<{ children: ReactNode }> = props => {
  const [modal, setModal] = useRecoilState(modalState)
  return (
    <ModalContext.Provider
      value={{
        modal,
        setModal
      }}
    >
      {props.children}
      <Modal {...{ modal, setModal }} />
    </ModalContext.Provider>
  )
}

export const Modal: React.FC<ModalState> = ({ modal, setModal, id }) => {
  useEffect(() => {
    const handleClickAway: (event: MouseEvent) => void = event => {
      const target = event.target as HTMLElement
      if (target?.id === (id ?? 'backdrop')) {
        setModal(null)
      }
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('click', handleClickAway)
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('click', handleClickAway)
      }
    }
  }, [setModal, id])
  return (
    <MuiModal
      disablePortal
      open={modal != null}
      onClose={() => {
        setModal(null)
      }}
    >
      <Grid
        container
        position='fixed'
        id={id ?? 'backdrop'}
        alignItems='center'
        justifyContent='center'
        height='calc(100vh - calc(100vh - 100%))'
        overflow='scroll'
        py={4}
        px={2}
      >
        {modal ?? <></>}
      </Grid>
    </MuiModal>
  )
}
