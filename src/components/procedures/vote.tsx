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
  return procedure ? (
    <div className='procedure-vote'>
      {t('Quorum Size')}: {procedure.quorumSize?.toString()}
      <br />
      {t('Vote Duration')}: {secondsToHms(parseInt(procedure.voteDuration))}
      <br />
      {t('Majority Size')}: {procedure.majoritySize?.toString()}
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
