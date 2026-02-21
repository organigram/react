import React from 'react'
import { TimeLeft } from './TimeLeft'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'
import {
  AccountInOrgans,
  ERC20VoteProcedure,
  getProcedureClass,
  Procedure,
  ProcedureProposal,
  VoteProcedure
} from '@organigram/js'
import { ElectionComponentProps } from './Election'

export interface DecidersActionsProps {
  procedure: ERC20VoteProcedure | VoteProcedure
  accountInOrgans: AccountInOrgans
  proposal: ProcedureProposal
  wrapTransaction: () => void
}

export const DecidersActions: React.FC<ElectionComponentProps> = ({
  procedure,
  accountInOrgans,
  proposal,
  wrapTransaction,
  signer
}) => {
  const { t } = useTranslation()
  const election = procedure.elections?.find(
    (b: { proposalKey: any }) => b.proposalKey && b.proposalKey === proposal.key
  )
  return accountInOrgans.deciders ? (
    <>
      <TimeLeft {...{ election, procedure }} />
      {election?.hasVoted ? (
        <Alert variant='filled' sx={{ width: '100%' }} severity='success'>
          {t('You already voted on this proposal.')}
        </Alert>
      ) : (
        <>
          <Button
            sx={{ width: '48%' }}
            variant='contained'
            className='approve-proposal'
            onClick={async () => {
              if (
                procedure.typeName === 'erc20Vote' ||
                procedure.typeName === 'vote'
              ) {
                const Class = (await getProcedureClass(procedure.typeName)) as
                  | typeof ERC20VoteProcedure
                  | typeof VoteProcedure
                const instance = new Class({
                  ...procedure,
                  erc20: (procedure as ERC20VoteProcedure).erc20,
                  signerOrProvider: signer
                }) as ERC20VoteProcedure | VoteProcedure
                instance
                  .vote(proposal.key, true, {
                    onTransaction: wrapTransaction
                  })
                  .catch((error: Error) => console.error(error.message))
              }
            }}
          >
            {t('Approve')}
          </Button>
          <Button
            sx={{ width: '48%' }}
            variant='contained'
            color='secondary'
            className='reject-proposal'
            onClick={async () =>
              (
                (await Procedure.load(
                  procedure.address,
                  signer as any,
                  procedure
                )) as ERC20VoteProcedure | VoteProcedure
              )
                .vote(proposal.key, false, {
                  onTransaction: wrapTransaction
                })
                .catch((error: Error) => console.error(error.message))
            }
          >
            {t('Reject')}
          </Button>
        </>
      )}
    </>
  ) : (
    'You cannot take part to this vote.'
  )
}
