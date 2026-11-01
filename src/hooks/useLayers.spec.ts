import { Organigram } from '@organigram/js'
import { expect, test } from 'vitest'

import {
  filterClassicDiagramByLayers,
  filterDiagramByLayers,
  getDiagramLayerStorageKey,
  readActiveDiagramLayerIds,
  sanitizeActiveDiagramLayerIds,
  writeActiveDiagramLayerIds,
  type DiagramLayer,
  type DiagramLayerStorage
} from './useLayers'

const layer = (
  id: string,
  organAddresses: string[],
  procedureAddresses: string[],
  assetAddresses: string[]
): DiagramLayer => ({
  id,
  organs: organAddresses.map(organAddress => ({ organAddress })),
  procedures: procedureAddresses.map(procedureAddress => ({ procedureAddress })),
  assets: assetAddresses.map(assetAddress => ({ assetAddress }))
})

class MemoryStorage implements DiagramLayerStorage {
  values = new Map<string, string>()

  getItem(key: string): string | null {
    return this.values.get(key) ?? null
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value)
  }
}

test('returns every element when no layer is active', () => {
  const organigram = new Organigram().toJson()
  const result = filterDiagramByLayers(organigram, [], [])

  expect(result).toBe(organigram)
})

test('returns the deduplicated union of active layer contents', () => {
  const organigram = new Organigram().toJson()
  const organAddresses = organigram.organs.map(item => item.address)
  const procedureAddresses = organigram.procedures.map(item => item.address)
  const assetAddresses = organigram.assets.map(item => item.address)
  const layers = [
    layer(
      'governance',
      organAddresses.slice(0, 1),
      procedureAddresses.slice(0, 1),
      assetAddresses.slice(0, 1)
    ),
    layer(
      'finance',
      organAddresses.slice(0, 2),
      procedureAddresses.slice(0, 2),
      assetAddresses.slice(0, 2)
    )
  ]

  const result = filterDiagramByLayers(organigram, layers, [
    'governance',
    'finance'
  ])

  expect(result.organs.map(item => item.address)).toEqual(
    organAddresses.slice(0, 2)
  )
  expect(result.procedures.map(item => item.address)).toEqual(
    procedureAddresses.slice(0, 2)
  )
  expect(result.assets.map(item => item.address)).toEqual(
    assetAddresses.slice(0, 2)
  )
  expect(result).not.toBe(organigram)
})

test('ignores unknown layer ids and falls back to the full view', () => {
  const organigram = new Organigram().toJson()

  expect(filterDiagramByLayers(organigram, [], ['deleted-layer'])).toBe(
    organigram
  )
})

test('classic filtering keeps relationship data while filtering organs', () => {
  const organigram = new Organigram().toJson()
  const visibleOrganAddress = organigram.organs[0]!.address
  const layers = [layer('governance', [visibleOrganAddress], [], [])]

  const result = filterClassicDiagramByLayers(organigram, layers, [
    'governance'
  ])

  expect(result.organs.map(item => item.address)).toEqual([
    visibleOrganAddress
  ])
  expect(result.procedures).toEqual(organigram.procedures)
  expect(result.assets).toEqual(organigram.assets)
})

test('stores deduplicated selections in a versioned organigram key', () => {
  const storage = new MemoryStorage()
  writeActiveDiagramLayerIds(storage, 'organigram-a', ['finance', 'finance'])

  expect(storage.getItem(getDiagramLayerStorageKey('organigram-a'))).toBe(
    '["finance"]'
  )
  expect(readActiveDiagramLayerIds(storage, 'organigram-a')).toEqual([
    'finance'
  ])
  expect(readActiveDiagramLayerIds(storage, 'organigram-b')).toEqual([])
})

test('safely handles malformed and obsolete stored layer selections', () => {
  const storage = new MemoryStorage()
  storage.setItem(getDiagramLayerStorageKey('organigram-a'), '{bad json')

  expect(readActiveDiagramLayerIds(storage, 'organigram-a')).toEqual([])
  expect(
    sanitizeActiveDiagramLayerIds(
      ['finance', 'deleted'],
      ['governance', 'finance']
    )
  ).toEqual(['finance'])
})
