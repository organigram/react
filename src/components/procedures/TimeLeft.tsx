import React from 'react'
import Alert from '@mui/material/Alert'
import { useTranslation } from 'react-i18next'
import { Election, ERC20VoteProcedure, VoteProcedure } from '@organigram/js'
import { secondsToHms } from '../../utils'

export const TimeLeft = ({
  election,
  procedure
}: {
  election: Election | undefined
  procedure: ERC20VoteProcedure | VoteProcedure
}) => {
  const { t } = useTranslation()
  const now = new Date().getTime() / 1000
  let timeLeft = ''
  if (election?.start) {
    const start = parseInt(election.start)
    const end = start + parseInt(procedure.voteDuration)
    const secondsLeft =
      election?.start && start > 0 && end > now ? end - now : 0
    if (secondsLeft >= 0) {
      timeLeft = secondsToHms(secondsLeft)
    }
  }

  return timeLeft !== '' ? (
    <Alert variant='filled' sx={{ width: '100%', mb: 2 }} severity='info'>
      {t('Time left:')} {timeLeft}
    </Alert>
  ) : null
}
