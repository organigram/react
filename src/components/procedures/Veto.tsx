import React from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@mui/material/Button'

export const VetoProposal = ({
  accountInOrgans,
  procedure,
  proposal,
  wrapTransaction
}) => {
  const { t } = useTranslation()
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
