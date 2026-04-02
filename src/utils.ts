import {
  type OrganEntry,
  type ProcedureProposal,
  ProcedureJson,
  OrganJson,
  ProcedureRoleTypeName
} from '@organigram/js'

export type ProposalFilter = 'current' | 'drafts' | 'passed' | 'blocked' | ''

export const filterProposals: (
  filter: ProposalFilter,
  proposals: ProcedureProposal[]
) => ProcedureProposal[] = (fltr, proposals) =>
  fltr != null || fltr !== ''
    ? proposals?.filter(proposal => {
        switch (fltr) {
          case 'current':
            return proposal.presented && !proposal.applied && !proposal.blocked
          case 'drafts':
            return !proposal.presented && !proposal.blocked
          case 'passed':
            return proposal.adopted
          case 'blocked':
            return proposal.blocked
          default:
            return true
        }
      })
    : proposals

export const isUserInSourceOrgan: (
  roleType: ProcedureRoleTypeName,
  organs: OrganJson[],
  deployedProcedure?: ProcedureJson,
  userAddress?: string
) => boolean = (roleType, organs, deployedProcedure, userAddress) =>
  organs
    // Find all organs that are this procedure's role (for example: deciders)
    ?.filter(
      organ => organ.address === deployedProcedure?.[roleType as 'deciders']
    )
    // Find any deployed organ whose entries contain the current user's userAddress
    ?.find(async organ =>
      organ?.entries
        ?.map((entry: OrganEntry) => entry?.address)
        .includes(userAddress as string)
    ) !== undefined

export const secondsToHms = (d: number): string => {
  const days = Math.floor(d / 86400)
  const hours = Math.floor((d % 86400) / 3600)
  const minutes = Math.floor((d % 3600) / 60)
  const seconds = Math.floor((d % 3600) % 60)

  const dDisplay =
    days > 0 ? days.toString() + (days === 1 ? ' day' : ' days') : ''
  const hDisplay =
    hours > 0 ? hours.toString() + (hours === 1 ? ' hour' : ' hours') : ''
  const mDisplay =
    minutes > 0
      ? minutes.toString() + (minutes === 1 ? ' minute' : ' minutes')
      : ''
  const sDisplay =
    seconds > 0
      ? seconds.toString() + (seconds === 1 ? ' second' : ' seconds')
      : ''
  return [dDisplay, hDisplay, mDisplay, sDisplay].filter(Boolean).join(', ')
}
