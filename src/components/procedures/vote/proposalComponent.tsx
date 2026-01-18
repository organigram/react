import React from 'react'
import { ProcedureProposal } from '@organigram/js'
import { TransactionOptions } from '@organigram/js/types/types'

import VoteProcedure from './class'
import ElectionComponent from '../Election'

export interface VoteProposalProps {
  procedure: VoteProcedure
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
