import React from 'react'
import Button from '@mui/material/Button'
import { ElectionComponentProps } from './Election'

export const VetoProposal: React.FC<ElectionComponentProps> = ({
  accountInOrgans,
  procedure,
  proposal,
  wrapTransaction,
  t
}) => {
  return accountInOrgans?.moderators ? (
    <Button
      color='secondary'
      variant='contained'
      fullWidth
      className='veto-proposal'
      onClick={() => {
        procedure
          .blockProposal(proposal.key, '', {
            onTransaction: wrapTransaction
          })
          .catch((error: Error) => console.error(error.message))
      }}
    >
      {t('Veto proposal')}
    </Button>
  ) : null
}
