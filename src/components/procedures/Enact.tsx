import React, { useEffect, useMemo, useState } from 'react'
import { Procedure } from '@organigram/js'
import { useTranslation } from 'react-i18next'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import { ElectionComponentProps } from './Election'
import { parseAbi } from 'viem'

export const VoteEnded: React.FC<ElectionComponentProps> = ({
  procedure,
  proposal,
  wrapTransaction,
  publicClient,
  walletClient
}) => {
  const { t } = useTranslation()
  const _procedure = useMemo(
    () =>
      new Procedure({
        ...procedure,
        publicClient,
        walletClient
      }),
    [procedure, publicClient, walletClient]
  )

  const election = procedure.elections?.find(
    (b: { proposalKey: any }) =>
      b.proposalKey != null && String(b.proposalKey) === String(proposal.key)
  )
  const [approved, setApproved] = useState<boolean | undefined>(
    election?.approved
  )

  useEffect(() => {
    if (publicClient == null || proposal.key == null) return
    let cancelled = false
    setApproved(undefined)
    const request = {
      address: procedure.address as `0x${string}`,
      abi: parseAbi(['function count(uint256) view returns (bool)']),
      functionName: 'count',
      args: [BigInt(proposal.key)]
    } as const
    // Election.tsx uses the pending block timestamp to determine the exact
    // closing boundary. Query the count against that same state; querying
    // `latest` here can be one block behind on local chains and report a
    // false "no decision" at the instant the vote closes.
    publicClient
      .readContract({ ...request, blockTag: 'pending' })
      .catch(() => publicClient.readContract(request))
      .then(result => {
        if (!cancelled) setApproved(result)
      })
      .catch(error => {
        console.error(error)
        if (!cancelled) setApproved(election?.approved ?? false)
      })
    return () => {
      cancelled = true
    }
  }, [election?.approved, proposal.key, procedure.address, publicClient])

  if (approved == null) {
    return (
      <Alert variant='filled' sx={{ width: '100%' }} severity='info'>
        {t('Loading vote status...')}
      </Alert>
    )
  }

  return approved ? (
    <Button
      variant='contained'
      className='enact-proposal'
      fullWidth
      onClick={() => {
        _procedure
          .applyProposal(proposal.key, { onTransaction: wrapTransaction })
          .catch((error: Error) => console.error(error.message))
      }}
    >
      {t('Enact proposal')}
    </Button>
  ) : (
    <Alert variant='filled' sx={{ width: '100%' }} severity='info'>
      {t('Vote has ended with no decision.')}
    </Alert>
  )
}
