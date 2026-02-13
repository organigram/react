import {
  type OrganEntry,
  type ProcedureProposal,
  ProcedureJson,
  OrganJson,
  SourceOrganTypeName
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
  sourceOrganType: SourceOrganTypeName,
  organs: OrganJson[],
  deployedProcedure?: ProcedureJson,
  userAddress?: string
) => boolean = (sourceOrganType, organs, deployedProcedure, userAddress) =>
  organs
    // Find all organs that are this procedure's source organ type (for example: deciders)
    ?.filter(
      organ =>
        organ.address === deployedProcedure?.[sourceOrganType as 'deciders']
    )
    // Find any deployed organ whose entries contain the current user's userAddress
    ?.find(async organ =>
      organ?.entries
        ?.map((entry: OrganEntry) => entry?.address)
        .includes(userAddress as string)
    ) !== undefined
