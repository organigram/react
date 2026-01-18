import React from 'react'
import { TimeLeft } from './TimeLeft'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'

export const DecidersActions = ({
  procedure,
  accountInOrgans,
  proposal,
  wrapTransaction
}) => {
  const { t } = useTranslation()
  const election = procedure.elections?.find(
    (b: { proposalKey: any }) => b.proposalKey && b.proposalKey === proposal.key
  )
  return (
    accountInOrgans.deciders && (
      <>
        <TimeLeft {...{ election, procedure }} />
        {election.hasVoted ? (
          <Alert variant='filled' sx={{ width: '100%' }} severity='info'>
            {t('You already voted on this proposal.')}
          </Alert>
        ) : (
          <>
            <Button
              sx={{ width: '48%' }}
              variant='contained'
              className='approve-proposal'
              onClick={() => {
                procedure
                  .vote(proposal.key, true, {
                    onTransaction: wrapTransaction
                  })
                  .catch((error: Error) => console.error(error.message))
              }}
            >
              {t('Approve')}
            </Button>
            <Button
              sx={{ width: '48%' }}
              variant='contained'
              color='secondary'
              className='reject-proposal'
              onClick={() => {
                procedure
                  .vote(proposal.key, false, {
                    onTransaction: wrapTransaction
                  })
                  .catch((error: Error) => console.error(error.message))
              }}
            >
              {t('Reject')}
            </Button>
          </>
        )}
      </>
    )
  )
}
