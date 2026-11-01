import { useCallback, useEffect, useMemo, useState } from 'react'
import type { OrganigramJson } from '@organigram/js'

export interface UseLayersOptions {
  storage?: DiagramLayerStorage | null
  onStorageError?: () => void
}

export interface LayersState {
  activeLayerIds: string[]
  visibleOrganigram: OrganigramJson
  classicVisibleOrganigram: OrganigramJson
  toggleLayer: (layerId: string) => void
  showAll: () => void
}

export interface DiagramLayer {
  id: string
  organs: ReadonlyArray<{ organAddress: string }>
  procedures: ReadonlyArray<{ procedureAddress: string }>
  assets: ReadonlyArray<{ assetAddress: string }>
}

export interface DiagramLayerStorage {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
}

const storageVersion = 1

export const getDiagramLayerStorageKey = (organigramId: string): string =>
  `organigram.layers.active.v${storageVersion}.${organigramId}`

export const readActiveDiagramLayerIds = (
  storage: DiagramLayerStorage,
  organigramId: string
): string[] => {
  try {
    const parsed = JSON.parse(
      storage.getItem(getDiagramLayerStorageKey(organigramId)) ?? '[]'
    )
    return Array.isArray(parsed)
      ? [...new Set(parsed.filter((id): id is string => typeof id === 'string'))]
      : []
  } catch {
    return []
  }
}

export const writeActiveDiagramLayerIds = (
  storage: DiagramLayerStorage,
  organigramId: string,
  activeLayerIds: string[]
): void => {
  storage.setItem(
    getDiagramLayerStorageKey(organigramId),
    JSON.stringify([...new Set(activeLayerIds)])
  )
}

export const sanitizeActiveDiagramLayerIds = (
  activeLayerIds: string[],
  availableLayerIds: string[]
): string[] => {
  const available = new Set(availableLayerIds)
  return [...new Set(activeLayerIds)].filter(id => available.has(id))
}

export const filterDiagramByLayers = (
  organigram: OrganigramJson,
  layers: ReadonlyArray<DiagramLayer>,
  activeLayerIds: string[]
): OrganigramJson => {
  const activeIds = new Set(activeLayerIds)
  const activeLayers = layers.filter(layer => activeIds.has(layer.id))

  if (activeLayers.length === 0) return organigram

  const organAddresses = new Set(
    activeLayers.flatMap(layer => layer.organs.map(item => item.organAddress))
  )
  const procedureAddresses = new Set(
    activeLayers.flatMap(layer =>
      layer.procedures.map(item => item.procedureAddress)
    )
  )
  const assetAddresses = new Set(
    activeLayers.flatMap(layer => layer.assets.map(item => item.assetAddress))
  )

  return {
    ...organigram,
    organs: organigram.organs.filter(item => organAddresses.has(item.address)),
    procedures: organigram.procedures.filter(item =>
      procedureAddresses.has(item.address)
    ),
    assets: organigram.assets.filter(item => assetAddresses.has(item.address))
  }
}

export const filterClassicDiagramByLayers = (
  organigram: OrganigramJson,
  layers: ReadonlyArray<DiagramLayer>,
  activeLayerIds: string[]
): OrganigramJson => {
  const filtered = filterDiagramByLayers(organigram, layers, activeLayerIds)

  return filtered === organigram
    ? organigram
    : { ...organigram, organs: filtered.organs }
}

const getBrowserStorage = (): DiagramLayerStorage | null =>
  typeof window === 'undefined' ? null : window.localStorage

/**
 * Applies user-selected visual layers to an organigram without owning layer
 * persistence or editing. Applications provide their persisted definitions.
 */
export const useLayers = (
  organigram: OrganigramJson,
  layers: ReadonlyArray<DiagramLayer>,
  options: UseLayersOptions = {}
): LayersState => {
  const { onStorageError } = options
  const storage = options.storage === undefined ? getBrowserStorage() : options.storage
  const [activeLayerIds, setActiveLayerIds] = useState<string[]>([])
  const availableLayerIds = useMemo(() => layers.map(layer => layer.id), [layers])
  const availableLayerIdsKey = availableLayerIds.join('\u0000')

  useEffect(() => {
    const storedIds =
      storage == null ? [] : readActiveDiagramLayerIds(storage, organigram.id)
    setActiveLayerIds(
      sanitizeActiveDiagramLayerIds(storedIds, availableLayerIds)
    )
  }, [availableLayerIds, availableLayerIdsKey, organigram.id, storage])

  useEffect(() => {
    setActiveLayerIds(activeIds => {
      const sanitizedIds = sanitizeActiveDiagramLayerIds(
        activeIds,
        availableLayerIds
      )
      return sanitizedIds.length === activeIds.length ? activeIds : sanitizedIds
    })
  }, [availableLayerIds, availableLayerIdsKey])

  const persistSelection = useCallback(
    (nextIds: string[]) => {
      const sanitizedIds = sanitizeActiveDiagramLayerIds(
        nextIds,
        availableLayerIds
      )
      setActiveLayerIds(sanitizedIds)
      if (storage == null) return

      try {
        writeActiveDiagramLayerIds(storage, organigram.id, sanitizedIds)
      } catch {
        onStorageError?.()
      }
    },
    [availableLayerIds, onStorageError, organigram.id, storage]
  )

  const toggleLayer = useCallback(
    (layerId: string) => {
      persistSelection(
        activeLayerIds.includes(layerId)
          ? activeLayerIds.filter(id => id !== layerId)
          : [...activeLayerIds, layerId]
      )
    },
    [activeLayerIds, persistSelection]
  )

  const showAll = useCallback(() => {
    persistSelection([])
  }, [persistSelection])

  const visibleOrganigram = useMemo(
    () => filterDiagramByLayers(organigram, layers, activeLayerIds),
    [activeLayerIds, layers, organigram]
  )
  const classicVisibleOrganigram = useMemo(
    () => filterClassicDiagramByLayers(organigram, layers, activeLayerIds),
    [activeLayerIds, layers, organigram]
  )

  return {
    activeLayerIds,
    visibleOrganigram,
    classicVisibleOrganigram,
    toggleLayer,
    showAll
  }
}
