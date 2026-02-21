import React from 'react'
import { useTranslation } from 'react-i18next'
import { VoteProcedure } from '@organigram/js'
import { secondsToHms } from '../../utils'
import { ElectionComponent } from './Election'

const VoteProcedureComponent = ({
  procedure
}: {
  procedure: VoteProcedure
}) => {
  const { t } = useTranslation()
  const { quorumSize, voteDuration, majoritySize } = JSON.parse(procedure.data)
  return procedure ? (
    <div className='procedure-vote'>
      {t('Quorum Size')}: {parseInt(quorumSize) / 1000}%
      <br />
      {t('Vote Duration')}: {secondsToHms(parseInt(voteDuration))}
      <br />
      {t('Majority Size')}: {parseInt(majoritySize) / 1000}%
    </div>
  ) : (
    <></>
  )
}

const vote = {
  Proposal: ElectionComponent,
  Component: VoteProcedureComponent
}

export default vote
