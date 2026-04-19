import { atom, useRecoilState, type SetterOrUpdater } from 'recoil'

/**
 * Visual layer configuration applied to the diagram.
 */
export interface Layer {
  name: string
  organAddresses: string[]
  procedureIds: string[]
  showAdminPermissions: boolean
  showEntriesPermissions: boolean
  showAssetsPermissions: boolean
  isPublic: boolean
  isHidden: boolean
}

/**
 * Global recoil state storing the active diagram layers.
 */
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
      organAddresses: [],
      procedureIds: []
    }
  ] as Layer[]
})

/**
 * Read and update the current diagram layer configuration.
 */
export const useLayers: () => [Layer[], SetterOrUpdater<Layer[]>] = () =>
  useRecoilState(layersState)
