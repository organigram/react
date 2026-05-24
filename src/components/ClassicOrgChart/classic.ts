import {
  getPermissionsSet,
  type OrganEntry,
  type OrganigramJson,
  type OrganJson,
  type ProcedureJson
} from '@organigram/js'

const membershipPermissionKeys = new Set([
  'ALL_ENTRIES',
  'ADD_ENTRIES',
  'REMOVE_ENTRIES'
])

const hasAddress = (entry: OrganEntry): boolean =>
  entry.address != null && entry.address.trim() !== ''

export interface ClassicOrgChartNode {
  organ: OrganJson
  entries: OrganEntry[]
  children: ClassicOrgChartNode[]
}

const hasMembershipPermission = (permissionValue: number): boolean =>
  getPermissionsSet(permissionValue).some(permission =>
    membershipPermissionKeys.has(permission)
  )

const sortEntries = (entries: OrganEntry[]): OrganEntry[] =>
  [...entries]
    .filter(hasAddress)
    .map((entry, index) => ({ entry, index }))
    .sort((left, right) => {
      const leftIndex = Number.parseInt(left.entry.index, 10)
      const rightIndex = Number.parseInt(right.entry.index, 10)
      const leftIsNumeric = Number.isFinite(leftIndex)
      const rightIsNumeric = Number.isFinite(rightIndex)

      if (leftIsNumeric && rightIsNumeric && leftIndex !== rightIndex) {
        return leftIndex - rightIndex
      }

      if (left.entry.index !== right.entry.index) {
        return left.entry.index.localeCompare(right.entry.index)
      }

      return left.index - right.index
    })
    .map(({ entry }) => entry)

const resolveUniqueParentCandidate = ({
  organ,
  organsByAddress,
  proceduresByAddress
}: {
  organ: OrganJson
  organsByAddress: Map<string, OrganJson>
  proceduresByAddress: Map<string, ProcedureJson>
}): string | null => {
  const parentCandidates = new Set<string>()

  for (const permission of organ.permissions ?? []) {
    if (!hasMembershipPermission(permission.permissionValue)) {
      continue
    }

    const procedure = proceduresByAddress.get(permission.permissionAddress)
    const parentAddress = procedure?.deciders

    if (
      parentAddress == null ||
      parentAddress === '' ||
      parentAddress === organ.address ||
      !organsByAddress.has(parentAddress)
    ) {
      continue
    }

    parentCandidates.add(parentAddress)
  }

  return parentCandidates.size === 1
    ? [...parentCandidates][0] ?? null
    : null
}

const wouldCreateCycle = (
  childAddress: string,
  parentAddress: string,
  acceptedParentsByChild: Map<string, string>
): boolean => {
  let currentAddress: string | undefined = parentAddress

  while (currentAddress != null && currentAddress !== '') {
    if (currentAddress === childAddress) {
      return true
    }

    currentAddress = acceptedParentsByChild.get(currentAddress)
  }

  return false
}

export const projectOrganigramToClassicForest = (
  organigram: OrganigramJson
): ClassicOrgChartNode[] => {
  const organs = organigram.organs ?? []
  const procedures = organigram.procedures ?? []
  const organsByAddress = new Map(organs.map(organ => [organ.address, organ]))
  const proceduresByAddress = new Map(
    procedures.map(procedure => [procedure.address, procedure])
  )
  const uniqueParentCandidateByChild = new Map<string, string | null>()
  const acceptedParentsByChild = new Map<string, string>()

  for (const organ of organs) {
    uniqueParentCandidateByChild.set(
      organ.address,
      resolveUniqueParentCandidate({
        organ,
        organsByAddress,
        proceduresByAddress
      })
    )
  }

  for (const organ of organs) {
    const parentAddress = uniqueParentCandidateByChild.get(organ.address)

    if (
      parentAddress == null ||
      wouldCreateCycle(organ.address, parentAddress, acceptedParentsByChild)
    ) {
      continue
    }

    acceptedParentsByChild.set(organ.address, parentAddress)
  }

  const nodesByAddress = new Map<string, ClassicOrgChartNode>(
    organs.map(organ => [
      organ.address,
      {
        organ,
        entries: sortEntries(organ.entries ?? []),
        children: []
      }
    ])
  )

  for (const organ of organs) {
    const parentAddress = acceptedParentsByChild.get(organ.address)

    if (parentAddress == null) {
      continue
    }

    const parentNode = nodesByAddress.get(parentAddress)
    const childNode = nodesByAddress.get(organ.address)

    if (parentNode == null || childNode == null) {
      continue
    }

    parentNode.children.push(childNode)
  }

  return organs
    .filter(organ => !acceptedParentsByChild.has(organ.address))
    .map(organ => nodesByAddress.get(organ.address))
    .filter((node): node is ClassicOrgChartNode => node != null)
}
