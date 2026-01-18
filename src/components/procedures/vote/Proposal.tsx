import React from 'react'
import { ProcedureProposal, Vote } from '@organigram/js'
import { TransactionOptions } from '@organigram/js/types/types'

import ElectionComponent from '../Election'

export interface VoteProposalProps {
  procedure: Vote
  proposal: ProcedureProposal
  accountInOrgans: {
    proposers?: boolean
    moderators?: boolean
    deciders?: boolean
  }
  wrapTransaction: TransactionOptions['onTransaction']
  t: (key: string, options?: any) => string
}

const VoteProposalComponent = (props: VoteProposalProps) => (
  <ElectionComponent {...props} />
)

export default VoteProposalComponent
