import React from 'react'
import { ProcedureProposal, ERC20Vote } from '@organigram/js'
import { TransactionOptions } from '@organigram/js/types/types'

import ElectionComponent from '../Election'

export interface ERC20VoteProposalProps {
  procedure: ERC20Vote
  proposal: ProcedureProposal
  accountInOrgans: {
    proposers?: boolean
    moderators?: boolean
    deciders?: boolean
  }
  wrapTransaction: TransactionOptions['onTransaction']
}

const ERC20VoteProposalComponent = (props: ERC20VoteProposalProps) => (
  <ElectionComponent {...props} />
)

export default ERC20VoteProposalComponent
