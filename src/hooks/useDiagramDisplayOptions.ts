import { atom, useRecoilState, type SetterOrUpdater } from 'recoil'

export interface DiagramDisplayOptions {
  showAdminPermissions: boolean
  showEntriesPermissions: boolean
  showAssetsPermissions: boolean
}

export const defaultDiagramDisplayOptions: DiagramDisplayOptions = {
  showAdminPermissions: false,
  showEntriesPermissions: true,
  showAssetsPermissions: true
}

const diagramDisplayOptionsState = atom<DiagramDisplayOptions>({
  key: 'diagramDisplayOptions',
  default: defaultDiagramDisplayOptions
})

export const useDiagramDisplayOptions = (): [
  DiagramDisplayOptions,
  SetterOrUpdater<DiagramDisplayOptions>
] => useRecoilState(diagramDisplayOptionsState)
