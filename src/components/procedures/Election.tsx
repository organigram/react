import React from 'react'
import {
  ERC20VoteProcedure,
  ProcedureProposal,
  TransactionOptions,
  VoteProcedure
} from '@organigram/js'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import { ethers } from 'ethers'

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
  signer?: ethers.Signer | null
}
export const ElectionComponent: React.FC<ElectionComponentProps> = ({
  procedure,
  proposal,
  accountInOrgans,
  wrapTransaction,
  t = (key: string) => key,
  signer
}) => {
  const election = procedure.elections?.find(
    (b: { proposalKey: any }) => b.proposalKey && b.proposalKey === proposal.key
  )

  const now = Date.now() / 1000

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
      {!election || !election.start ? ( // Election does not exist or not started, or block cannot be fetched.
        <></>
      ) : now < parseInt(election.start) ? ( // Election is started. Vote is not started.
        <VetoProposal
          {...{ procedure, proposal, accountInOrgans, wrapTransaction, t, signer }}
        />
      ) : now < parseInt(election.start) + parseInt(procedure.voteDuration) ? ( // Vote is started. Vote is not ended.
        <DecidersActions
          {...{
            procedure,
            proposal,
            accountInOrgans,
            wrapTransaction,
            t,
            signer
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
            signer
          }}
        />
      )}
    </Grid>
  )
}
