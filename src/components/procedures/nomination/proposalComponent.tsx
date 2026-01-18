import React from 'react'
import { ProcedureProposal } from '@organigram/js'
import { TransactionOptions } from '@organigram/js/types/types'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Procedure from './class'
import { ImportedReactNode } from '..'

export interface NominationProposalProps {
  procedure: Procedure
  proposal: ProcedureProposal
  accountInOrgans?: {
    proposers?: boolean
    moderators?: boolean
    deciders?: boolean
  }
  wrapTransaction: TransactionOptions['onTransaction']
  t: (key: string, options?: any) => string
}

const NominationProposalComponent = ({
  procedure,
  proposal,
  accountInOrgans,
  wrapTransaction,
  t = key => key
}: NominationProposalProps) => {
  if (!proposal || !proposal.presented) {
    return <p className='text-danger'>{t('Proposal not presented.')}</p>
  }
  if (proposal.blocked || proposal.applied) {
    return <></>
  }
  return (
    <Grid container justifyContent='space-between' mt={3}>
      {accountInOrgans?.deciders && (
        <>
          <Button
            sx={{ width: '48%' }}
            variant='contained'
            className='approve-proposal'
            onClick={() =>
              procedure.nominate(proposal.key, {
                onTransaction: wrapTransaction
              })}
          >
            {t('Approve')}
          </Button>
          <Button
            sx={{ width: '48%' }}
            variant='contained'
            color='secondary'
            className='reject-proposal'
            onClick={() =>
              procedure.blockProposal(proposal.key, '', {
                onTransaction: wrapTransaction
              })}
          >
            {t('Reject')}
          </Button>
        </>
      ) as ImportedReactNode}
    </Grid>
  )
}

export default NominationProposalComponent
