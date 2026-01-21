import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import { Provider } from 'ethers'
import { Organ } from '@organigram/js'
import { ElectionComponentProps } from './Election'

export const VoteEnded: React.FC<ElectionComponentProps> = ({
  procedure,
  proposal,
  wrapTransaction
}) => {
  const { t } = useTranslation()

  const election = procedure.elections?.find(
    (b: { proposalKey: any }) => b.proposalKey && b.proposalKey === proposal.key
  )
  const [decidersCount, setDecidersCount] = React.useState(0)

  const quorum = Math.ceil(
    (decidersCount * parseInt(procedure.quorumSize)) / 100000
  )

  useEffect(() => {
    const handler = async (): Promise<void> => {
      const deciders = await Organ.load(
        procedure.deciders,
        procedure.provider as Provider
      )
      setDecidersCount(
        deciders.entries.filter(e => e.address != null && e.address !== '')
          .length
      )
    }
    handler()
  })

  return parseInt(election?.votesCount ?? '0') >= quorum &&
    election?.approved ? (
      <Button
        variant='contained'
        className='enact-proposal'
        fullWidth
        onClick={() => {
          procedure
            .adoptProposal(proposal.key, { onTransaction: wrapTransaction })
            .catch((error: Error) => console.error(error.message))
        }}
      >
        {t('Enact proposal')}
      </Button>
    ) : (
      <Alert variant='filled' sx={{ width: '100%' }} severity='info'>
        {t('Vote has ended with no decision.')}
      </Alert>
    )
}
