import React, { useEffect, useState } from 'react'
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
  voterAddress?: string
  compact?: boolean
}
export const ElectionComponent: React.FC<ElectionComponentProps> = ({
  procedure,
  proposal,
  accountInOrgans,
  wrapTransaction,
  t = (key: string) => key,
  publicClient,
  walletClient,
  voterAddress,
  compact
}) => {
  const election = procedure.elections?.find(
    (b: { proposalKey: any }) =>
      b.proposalKey != null && String(b.proposalKey) === String(proposal.key)
  )

  // The procedure is evaluated with the chain timestamp, not the browser
  // clock. Local chains and machines can legitimately drift by a few seconds;
  // using Date.now() could therefore leave a closed vote in its voting UI.
  const [chainTimestamp, setChainTimestamp] = useState<number | null>(null)
  useEffect(() => {
    if (publicClient == null) return
    let cancelled = false
    const refreshTimestamp = async () => {
      try {
        const block = await publicClient.getBlock({ blockTag: 'pending' })
        if (!cancelled) setChainTimestamp(Number(block.timestamp))
      } catch {
        try {
          const block = await publicClient.getBlock()
          if (!cancelled) setChainTimestamp(Number(block.timestamp))
        } catch {
          // Fall back to the browser clock below while the RPC reconnects.
        }
      }
    }
    refreshTimestamp()
    const interval = window.setInterval(() => refreshTimestamp(), 15_000)
    return () => {
      cancelled = true
      window.clearInterval(interval)
    }
  }, [publicClient])

  const now = chainTimestamp ?? Math.floor(Date.now() / 1000)
  const voteStart =
    election?.start != null ? parseInt(election.start) + 1 : undefined
  const voteClosed =
    voteStart != null && now >= voteStart + parseInt(procedure.voteDuration)

  if (!proposal || !proposal.presented) {
    return (
      <Alert variant='filled' sx={{ width: '100%' }} severity='info'>
        {t('Proposal not presented.')}
      </Alert>
    )
  }

  if (!election) {
    return (
      <Alert variant='filled' sx={{ width: '100%' }} severity='info'>
        {t('Loading vote status...')}
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
      sx={compact ? { display: 'contents' } : undefined}
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
            walletClient,
            voterAddress,
            compact
          }}
        />
      ) : !voteClosed ? ( // Vote is started. Vote is not ended.
        <DecidersActions
          {...{
            procedure,
            proposal,
            accountInOrgans,
            wrapTransaction,
            t,
            publicClient,
            walletClient,
            voterAddress,
            compact
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
            walletClient,
            voterAddress,
            compact
          }}
        />
      )}
    </Grid>
  )
}
