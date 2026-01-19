import { useState, useEffect } from 'react'
import {
  type Procedure as DeployedProcedure,
  type OrganEntry,
  type EnhancedProcedure,
  type ProcedureProposal
} from '@organigram/js'

import { useDeployedOrgans } from './organs'
import { useOrganigramClient } from './organigramClient'
import { Signer } from 'ethers'
import {
  DiagramOrgan,
  DiagramProcedure,
  OrganigramDiagram
} from '../components/Diagram'

export type ProposalFilter = 'current' | 'drafts' | 'passed' | 'blocked' | ''

export const filterProposals: (
  filter: ProposalFilter,
  proposals: ProcedureProposal[]
) => ProcedureProposal[] = (fltr, proposals) =>
  fltr != null || fltr !== ''
    ? proposals.filter(proposal => {
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
  procedure?: DiagramProcedure
  organigram: OrganigramDiagram
  signer: Signer
}) => DiagramProcedure | undefined = ({ organigram, procedure, signer }) => {
  const { organigramClient } = useOrganigramClient(signer)
  const deployedOrgans = useDeployedOrgans({ organigram, signer })
  const [deployedState, setDeployedState] = useState(procedure) // can't use recoil state here because of procedure._Class

  useEffect(() => {
    const initDeployed: () => Promise<void> = async () => {
      let deployed: EnhancedProcedure | undefined
      const userAddress = await signer?.getAddress()
      if (
        procedure?.deployed == null &&
        procedure?.address != null &&
        procedure.address !== '' &&
        organigramClient != null
      ) {
        try {
          deployed = await organigramClient
            ?.getProcedure(procedure.address)
            .catch(e => {
              console.error(e)
              return undefined
            })
          if (deployed != null) {
            setDeployedState(_deployedState => ({
              ...procedure,
              deployed,
              isUserDecider: isUserInSourceOrgan(
                'deciders',
                deployedOrgans,
                _deployedState?.deployed,
                userAddress
              ),
              isUserModerator: isUserInSourceOrgan(
                'moderators',
                deployedOrgans,
                _deployedState?.deployed,
                userAddress
              ),
              isUserProposer: isUserInSourceOrgan(
                'proposers',
                deployedOrgans,
                _deployedState?.deployed,
                userAddress
              ),
              updateCid: procedure.updateCid,
              updateAdmin: procedure.updateAdmin,
              propose: procedure.propose,
              blockProposal: procedure.blockProposal,
              presentProposal: procedure.presentProposal,
              reloadProposal: procedure.reloadProposal,
              reloadProposals: procedure.reloadProposals,
              adoptProposal: procedure.adoptProposal,
              applyProposal: procedure.applyProposal,
              reloadData: procedure.reloadData
            }))
          }
        } catch (e) {
          console.error(e)
        }
      } else setDeployedState(procedure)
    }
    initDeployed()
  }, [
    procedure,
    organigramClient,
    deployedOrgans,
    procedure?.id,
    procedure?.deployed
  ])

  return deployedState
}

export const isUserInSourceOrgan: (
  sourceOrganType: string,
  organs: DiagramOrgan[],
  deployedProcedure?: DeployedProcedure,
  wallet?: string
) => boolean = (sourceOrganType, organs, deployedProcedure, wallet) =>
  organs
    // Find all organs that are this procedure's source organ type (for example: deciders)
    .filter(
      organ =>
        organ.address ===
        deployedProcedure?.[sourceOrganType as keyof DeployedProcedure]
    )
    // Find any deployed organ whose entries contain the current user's wallet
    .find(async organ =>
      organ?.deployed?.entries
        ?.map((entry: OrganEntry) => entry?.address)
        .includes(wallet as string)
    ) !== undefined
