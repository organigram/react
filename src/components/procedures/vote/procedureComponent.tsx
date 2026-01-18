import React from 'react'
import { useTranslation } from 'react-i18next'
import Procedure from './class'
import { secondsToHms } from '..'

const VoteProcedureComponent = ({ procedure }: { procedure: Procedure }) => {
  const { t } = useTranslation()
  return procedure ? (
    <div className='procedure-vote'>
      {t('Quorum Size')}: {procedure.quorumSize.toString()}<br />
      {t('Vote Duration')}: {secondsToHms(parseInt(procedure.voteDuration))}<br />
      {t('Majority Size')}: {procedure.majoritySize.toString()}
    </div>
  ) : <></>
}

export default VoteProcedureComponent
