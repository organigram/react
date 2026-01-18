import React from 'react'
import Alert from '@mui/material/Alert'
import { useTranslation } from 'react-i18next'

export const TimeLeft = ({ election, procedure }) => {
  const { t } = useTranslation()
  const now = Date.now() / 1000
  let timeLeft = ''
  if (election?.start) {
    const start = parseInt(election.start)
    const end = start + parseInt(procedure.voteDuration)
    const secondsLeft =
      election?.start && start > 0 && end > now ? end - now : 0
    if (secondsLeft >= 0) {
      const days = Math.floor(secondsLeft / (60 * 60 * 24))
      const hours = Math.floor(
        (secondsLeft - days * (60 * 60 * 24)) / (60 * 60)
      )
      const minutes = Math.floor(
        (secondsLeft - days * (60 * 60 * 24) - hours * (60 * 60)) / 60
      )
      const seconds =
        secondsLeft - days * (60 * 60 * 24) - hours * (60 * 60) - minutes * 60
      timeLeft =
        (days > 0 ? days + t(' day') + ' ' : '') +
        (hours > 0 ? hours + 'h' + ' ' : '') +
        (minutes > 0 ? minutes + 'm' + ' ' : '') +
        seconds.toFixed() +
        's'
    }
  }

  return timeLeft !== '' ? (
    <Alert variant='filled' sx={{ width: '100%', mb: 2 }} severity='info'>
      {t('Time left:')} {timeLeft}
    </Alert>
  ) : null
}
