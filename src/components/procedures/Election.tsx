import React from 'react'
import {
  ERC20VoteProcedure,
  ProcedureProposal,
  TransactionOptions,
  VoteProcedure
} from '@organigram/js'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import type { PublicClient, WalletClient } from 'viem'

import { VetoProposal } from './Veto'
import { DecidersActions } from './DecidersActions'
import { VoteEnded } from './Enact'

export interface ElectionComponentProps {
  procedure: ERC20VoteProcedure | VoteProcedure
  proposal: ProcedureProposal
  accountInOrgans: {
    proposers?: boolean
    moderators?: boolean
    deciders?: boolean
  }
  wrapTransaction: TransactionOptions['onTransaction']
  t: (key: string) => string
  publicClient?: PublicClient | null
  walletClient?: WalletClient | null
}
export const ElectionComponent: React.FC<ElectionComponentProps> = ({
  procedure,
  proposal,
  accountInOrgans,
  wrapTransaction,
  t = (key: string) => key,
  publicClient,
  walletClient
}) => {
  const election = procedure.elections?.find(
    (b: { proposalKey: any }) => b.proposalKey && b.proposalKey === proposal.key
  )

  const now = Date.now() / 1000
  const voteStart =
    election?.start != null ? parseInt(election.start) + 1 : undefined

  if (!proposal || !proposal.presented || !election) {
    return (
      <Alert variant='filled' sx={{ width: '100%' }} severity='info'>
        {t('Proposal not presented.')}
      </Alert>
    )
  }

  if (proposal.blocked || proposal.applied) {
    return <></>
  }

  return (
    <Grid
      container
      justifyContent='space-between'
      mt={3}
      className='procedure-proposal procedure-proposal-vote'
    >
      {!election || !election.start || voteStart == null ? ( // Election does not exist or not started, or block cannot be fetched.
        <></>
      ) : now < voteStart ? ( // The on-chain vote opens strictly after election.start.
        <VetoProposal
          {...{
            procedure,
            proposal,
            accountInOrgans,
            wrapTransaction,
            t,
            publicClient,
            walletClient
          }}
        />
      ) : now < voteStart + parseInt(procedure.voteDuration) ? ( // Vote is started. Vote is not ended.
        <DecidersActions
          {...{
            procedure,
            proposal,
            accountInOrgans,
            wrapTransaction,
            t,
            publicClient,
            walletClient
          }}
        />
      ) : (
        <VoteEnded
          {...{
            procedure,
            proposal,
            wrapTransaction,
            t,
            accountInOrgans,
            publicClient,
            walletClient
          }}
        />
      )}
    </Grid>
  )
}
