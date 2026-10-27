import React from 'react'
import {
  ProcedureProposal,
  NominationProcedure,
  type TransactionOptions
} from '@organigram/js'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import type { PublicClient, WalletClient } from 'viem'

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
  publicClient?: PublicClient | null
  walletClient?: WalletClient | null
  compact?: boolean
}

const NominationProposal = ({
  procedure,
  proposal,
  accountInOrgans,
  wrapTransaction,
  t = key => key,
  publicClient,
  walletClient,
  compact = false
}: NominationProposalProps) => {
  if (!proposal || !proposal.presented) {
    return <p className='text-danger'>{t('Proposal not presented.')}</p>
  }
  if (proposal.blocked || proposal.applied) {
    return <></>
  }
  const _procedure = new NominationProcedure({
    ...procedure,
    publicClient,
    walletClient
  })
  const canBlock =
    procedure.withModeration === true && accountInOrgans?.moderators === true
  const canReject =
    procedure.withModeration !== true && accountInOrgans?.deciders === true
  return (
    <Grid
      container
      justifyContent='space-between'
      mt={compact ? 0 : 3}
      sx={compact ? { display: 'contents' } : undefined}
    >
      {accountInOrgans?.deciders && (
        <>
          {compact ? (
            <IconButton
              aria-label={t('Approve')}
              className='approve-proposal'
              color='success'
              onClick={() =>
                _procedure.nominate(proposal.key, {
                  onTransaction: wrapTransaction
                })
              }
              size='small'
              sx={{
                border: '1px solid',
                borderColor: 'currentColor',
                borderRadius: 1,
                height: 28,
                width: 28
              }}
            >
              <CheckRoundedIcon fontSize='small' />
            </IconButton>
          ) : (
            <Button
              sx={{ width: canBlock || canReject ? '48%' : '100%' }}
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
          )}
          {canBlock && (
            compact ? (
              <IconButton
                aria-label={t('Reject')}
                className='reject-proposal'
                color='error'
                onClick={() =>
                  _procedure.blockProposal(proposal.key, '', {
                    onTransaction: wrapTransaction
                  })
                }
                size='small'
                sx={{
                  border: '1px solid',
                  borderColor: 'currentColor',
                  borderRadius: 1,
                  height: 28,
                  width: 28
                }}
              >
                <CloseRoundedIcon fontSize='small' />
              </IconButton>
            ) : (
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
            )
          )}
          {canReject && (
            compact ? (
              <IconButton
                aria-label={t('Reject')}
                className='reject-proposal'
                color='error'
                onClick={() =>
                  _procedure.reject(proposal.key, {
                    onTransaction: wrapTransaction
                  })
                }
                size='small'
                sx={{
                  border: '1px solid',
                  borderColor: 'currentColor',
                  borderRadius: 1,
                  height: 28,
                  width: 28
                }}
              >
                <CloseRoundedIcon fontSize='small' />
              </IconButton>
            ) : (
              <Button
                sx={{ width: '48%' }}
                variant='contained'
                color='secondary'
                className='reject-proposal'
                onClick={() =>
                  _procedure.reject(proposal.key, {
                    onTransaction: wrapTransaction
                  })
                }
              >
                {t('Reject')}
              </Button>
            )
          )}
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
