import { atom, useRecoilState, type SetterOrUpdater } from 'recoil'

export interface Layer {
  name: string
  organIds: string[]
  procedureIds: string[]
  showAdminPermissions: boolean
  showEntriesPermissions: boolean
  showAssetsPermissions: boolean
  isPublic: boolean
  isHidden: boolean
}

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
  ] as Layer[]
})

export const useLayers: () => [Layer[], SetterOrUpdater<Layer[]>] = () =>
  useRecoilState(layersState)
