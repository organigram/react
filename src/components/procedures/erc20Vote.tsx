import React from 'react'
import { ERC20VoteProcedure } from '@organigram/js'
import { secondsToHms } from '../../utils'
import { useTranslation } from 'react-i18next'
import { ElectionComponent } from './Election'

const ERC20VoteProcedureComponent = ({
  procedure
}: {
  procedure: ERC20VoteProcedure
}) => {
  const { t } = useTranslation()
  const { quorumSize, voteDuration, majoritySize } = JSON.parse(procedure.data)
  const [erc20Balance, setErc20Balance] = React.useState<string>('0')
  React.useEffect(() => {
    const handler = (): void => {
      procedure.erc20Balance().then(balance => {
        setErc20Balance(balance.toString())
      })
    }
    handler()
  })
  return procedure ? (
    <div className='procedure-vote'>
      {t('Voters Organ')}: <code>{procedure.deciders}</code>
      <br />
      {t('Veto Organ')}: <code>{procedure.moderators}</code>
      <br />
      {t('ERC20 Token contract')}: <code>{procedure.erc20}</code>
      <br />
      {t('ERC20 Token balance')}: <code>{erc20Balance}</code>
      <br />
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

const erc20Vote = {
  Component: ERC20VoteProcedureComponent,
  Proposal: ElectionComponent
}

export default erc20Vote
