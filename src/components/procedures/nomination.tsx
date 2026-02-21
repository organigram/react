import React from 'react'
import {
  ProcedureProposal,
  NominationProcedure,
  type TransactionOptions
} from '@organigram/js'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import { ethers } from 'ethers'

export const NominationProcedureComponent = ({
  procedure
}: {
  procedure: NominationProcedure
}) => {
  return <></>
}
export interface NominationProposalProps {
  procedure: NominationProcedure
  proposal: ProcedureProposal
  accountInOrgans?: {
    proposers?: boolean
    moderators?: boolean
    deciders?: boolean
  }
  wrapTransaction: TransactionOptions['onTransaction']
  t: (key: string, options?: any) => string
  signer: ethers.Signer | null
}

const NominationProposal = ({
  procedure,
  proposal,
  accountInOrgans,
  wrapTransaction,
  t = key => key,
  signer
}: NominationProposalProps) => {
  if (!proposal || !proposal.presented) {
    return <p className='text-danger'>{t('Proposal not presented.')}</p>
  }
  if (proposal.blocked || proposal.applied) {
    return <></>
  }
  const _procedure = new NominationProcedure({
    ...procedure,
    signerOrProvider: signer
  })
  return (
    <Grid container justifyContent='space-between' mt={3}>
      {accountInOrgans?.deciders && (
        <>
          <Button
            sx={{ width: '48%' }}
            variant='contained'
            className='approve-proposal'
            onClick={() =>
              _procedure.nominate(proposal.key, {
                onTransaction: wrapTransaction
              })
            }
          >
            {t('Approve')}
          </Button>
          <Button
            sx={{ width: '48%' }}
            variant='contained'
            color='secondary'
            className='reject-proposal'
            onClick={() =>
              _procedure.blockProposal(proposal.key, '', {
                onTransaction: wrapTransaction
              })
            }
          >
            {t('Reject')}
          </Button>
        </>
      )}
    </Grid>
  )
}

const vote = {
  Component: NominationProcedureComponent,
  Proposal: NominationProposal
}

export default vote
