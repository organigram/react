import React from 'react'
import { useTranslation } from 'react-i18next'
import { Vote } from '@organigram/js'
import { secondsToHms } from '..'

const VoteProcedureComponent = ({
  procedure
}: {
  procedure: Vote
}) => {
  const { t } = useTranslation()
  return procedure ? (
    <div className='procedure-vote'>
      {t('Quorum Size')}: {procedure.quorumSize.toString()}
      <br />
      {t('Vote Duration')}: {secondsToHms(parseInt(procedure.voteDuration))}
      <br />
      {t('Majority Size')}: {procedure.majoritySize.toString()}
    </div>
  ) : (
    <></>
  )
}

export default VoteProcedureComponent
