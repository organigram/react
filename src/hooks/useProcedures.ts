import { useState, useEffect } from 'react'
import {
  type OrganEntry,
  type ProcedureProposal,
  ProcedureJson,
  OrganigramJson,
  OrganJson
} from '@organigram/js'

import { useDeployedOrgans } from './useOrgans'
import { useOrganigramClient } from './useOrganigramClient'
import { Signer } from 'ethers'

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

export const useDeployedProcedure: (options: {
  procedure?: ProcedureJson
  organigram: OrganigramJson
  signer?: Signer | null
}) => ProcedureJson | undefined = ({ organigram, procedure, signer }) => {
  const { organigramClient } = useOrganigramClient(signer)
  const deployedOrgans = useDeployedOrgans({ organigram, signer })
  const [deployedState, setDeployedState] = useState(procedure) // can't use recoil state here because of procedure._Class

  useEffect(() => {
    const initDeployed: () => Promise<void> = async () => {
      let deployed: ProcedureJson | undefined
      const userAddress = await signer?.getAddress()
      if (
        procedure?.isDeployed === true &&
        procedure?.address != null &&
        procedure.address !== '' &&
        organigramClient != null
      ) {
        try {
          deployed = (
            await organigramClient?.getProcedure(procedure.address)
          )?.toJson()
          if (deployed != null) {
            setDeployedState(_deployedState => ({
              ...procedure,
              deployed,
              isUserDecider: isUserInSourceOrgan(
                'deciders',
                deployedOrgans,
                _deployedState,
                userAddress
              ),
              isUserModerator: isUserInSourceOrgan(
                'moderators',
                deployedOrgans,
                _deployedState,
                userAddress
              ),
              isUserProposer: isUserInSourceOrgan(
                'proposers',
                deployedOrgans,
                _deployedState,
                userAddress
              ),
              data: procedure.data,
              metadata: procedure.metadata,
              sourceOrgans: procedure.sourceOrgans,
              targetOrgans: procedure.targetOrgans,
              type: procedure.type
            }))
          }
        } catch (e) {
          console.error(e)
        }
      } else setDeployedState(procedure)
    }
    initDeployed()
  }, [procedure, organigramClient, deployedOrgans, procedure?.address])

  return deployedState
}

export const isUserInSourceOrgan: (
  sourceOrganType: string,
  organs: OrganJson[],
  deployedProcedure?: ProcedureJson,
  wallet?: string
) => boolean = (sourceOrganType, organs, deployedProcedure, wallet) =>
  organs
    // Find all organs that are this procedure's source organ type (for example: deciders)
    .filter(
      organ =>
        organ.address === deployedProcedure?.[sourceOrganType as 'deciders']
    )
    // Find any deployed organ whose entries contain the current user's wallet
    .find(async organ =>
      organ?.entries
        ?.map((entry: OrganEntry) => entry?.address)
        .includes(wallet as string)
    ) !== undefined
