import React, { useEffect, useState } from 'react'
import { TimeLeft } from './TimeLeft'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { useTranslation } from 'react-i18next'
import {
  AccountInOrgans,
  ERC20VoteProcedure,
  getProcedureClass,
  ProcedureProposal,
  VoteProcedure
} from '@organigram/js'
import { ElectionComponentProps } from './Election'
import { parseAbi } from 'viem'

export interface DecidersActionsProps {
  procedure: ERC20VoteProcedure | VoteProcedure
  accountInOrgans: AccountInOrgans
  proposal: ProcedureProposal
  wrapTransaction: () => void
}

export const DecidersActions: React.FC<ElectionComponentProps> = ({
  procedure,
  accountInOrgans,
  proposal,
  wrapTransaction,
  publicClient,
  walletClient,
  voterAddress,
  compact = false
}) => {
  const { t } = useTranslation()
  const election = procedure.elections?.find(
    (b: { proposalKey: any }) =>
      b.proposalKey != null && String(b.proposalKey) === String(proposal.key)
  )
  const [hasVoted, setHasVoted] = useState<boolean | undefined>(undefined)
  const [isVoting, setIsVoting] = useState(false)
  const walletAddress =
    voterAddress ??
    (typeof walletClient?.account === 'string'
      ? walletClient.account
      : walletClient?.account?.address)
  const voteClosed =
    election?.start != null &&
    Number(election.start) > 0 &&
    Math.floor(Date.now() / 1000) >=
      Number(election.start) + Number(procedure.voteDuration)

  useEffect(() => {
    let cancelled = false
    if (publicClient == null || walletAddress == null || proposal.key == null) {
      setHasVoted(election?.hasVoted)
      return () => {
        cancelled = true
      }
    }

    setHasVoted(undefined)
    publicClient
      .readContract({
        account: walletAddress as `0x${string}`,
        address: procedure.address as `0x${string}`,
        abi: parseAbi([
          'function getElection(uint256) view returns (uint256 start, bool hasVoted, uint256 votesCount)'
        ]),
        functionName: 'getElection',
        args: [BigInt(proposal.key)]
      })
      .then(result => {
        if (!cancelled) setHasVoted(result[1])
      })
      .catch(() => {
        if (!cancelled) setHasVoted(election?.hasVoted)
      })

    return () => {
      cancelled = true
    }
  }, [
    election?.hasVoted,
    procedure.address,
    proposal.key,
    publicClient,
    walletAddress
  ])

  const submitVote = async (approval: boolean) => {
    if (publicClient == null) return
    if (procedure.typeName !== 'erc20Vote' && procedure.typeName !== 'vote') {
      return
    }

    setIsVoting(true)
    try {
      const Class = (await getProcedureClass(procedure.typeName)) as
        | typeof ERC20VoteProcedure
        | typeof VoteProcedure
      const instance = new Class({
        ...procedure,
        erc20: (procedure as ERC20VoteProcedure).erc20,
        publicClient,
        walletClient
      }) as ERC20VoteProcedure | VoteProcedure
      await instance.vote(proposal.key, approval, {
        onTransaction: wrapTransaction
      })
      setHasVoted(true)
    } catch (error) {
      console.error((error as Error).message)
    } finally {
      setIsVoting(false)
    }
  }

  if (compact && (voteClosed || hasVoted !== false || !accountInOrgans.deciders)) {
    return null
  }

  return voteClosed ? (
    <Alert variant='filled' sx={{ width: '100%' }} severity='info'>
      {t('Vote has ended with no decision.')}
    </Alert>
  ) : hasVoted === true ? (
    <>
      <TimeLeft {...{ election, procedure }} />
      <Alert variant='filled' sx={{ width: '100%' }} severity='success'>
        {t('You already voted on this proposal.')}
      </Alert>
    </>
  ) : accountInOrgans.deciders === undefined ? (
    <>
      <TimeLeft {...{ election, procedure }} />
      <Alert variant='filled' sx={{ width: '100%' }} severity='info'>
        {t('Checking voting rights...')}
      </Alert>
    </>
  ) : accountInOrgans.deciders ? (
    <>
      {!compact && <TimeLeft {...{ election, procedure }} />}
      {compact ? (
        <>
          <IconButton
            aria-label={t('Approve')}
            className='approve-proposal'
            color='success'
            disabled={isVoting}
            onClick={() => submitVote(true)}
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
          <IconButton
            aria-label={t('Reject')}
            className='reject-proposal'
            color='error'
            disabled={isVoting}
            onClick={() => submitVote(false)}
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
        </>
      ) : (
        <>
          <Button
            fullWidth
            sx={{ mb: 1.25, py: 1.25 }}
            variant='contained'
            className='approve-proposal'
            disabled={isVoting}
            onClick={() => submitVote(true)}
          >
            {t('Approve')}
          </Button>
          <Button
            fullWidth
            sx={{ py: 1.25 }}
            variant='outlined'
            color='secondary'
            className='reject-proposal'
            disabled={isVoting}
            onClick={() => submitVote(false)}
          >
            {t('Reject')}
          </Button>
        </>
      )}
    </>
  ) : (
    <Alert variant='filled' sx={{ width: '100%' }} severity='warning'>
      {t('Your connected wallet has no voting rights for this procedure.')}
    </Alert>
  )
}
