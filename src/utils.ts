import {
  type OrganEntry,
  type ProcedureProposal,
  ProcedureJson,
  OrganJson,
  ProcedureRoleTypeName
} from '@organigram/js'

/**
 * Named filters used by proposal list UIs.
 */
export type ProposalFilter = 'current' | 'drafts' | 'passed' | 'blocked' | ''

/**
 * Filter hydrated proposals according to their workflow status.
 *
 * @param filter Filter label selected by the UI.
 * @param proposals Proposals to filter.
 */
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

/**
 * Check whether the current user belongs to the organ assigned to one procedure role.
 *
 * @param roleType Procedure role to inspect.
 * @param organs Hydrated organs available in the current organigram.
 * @param deployedProcedure Procedure whose role organ should be checked.
 * @param userAddress Connected user address.
 */
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

/**
 * Convert a duration in seconds into a human-readable string.
 */
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
