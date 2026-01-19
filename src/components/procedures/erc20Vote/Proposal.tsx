import React from 'react'
import {
  ProcedureProposal,
  ERC20VoteProcedure,
  type TransactionOptions
} from '@organigram/js'

import ElectionComponent from '../Election'

export interface ERC20VoteProposalProps {
  procedure: ERC20VoteProcedure
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
