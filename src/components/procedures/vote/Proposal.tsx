import React from 'react'
import {
  ProcedureProposal,
  VoteProcedure,
  type TransactionOptions
} from '@organigram/js'

import { ElectionComponent } from '../Election'

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

export const VoteProposalComponent = (props: VoteProposalProps) => (
  <ElectionComponent {...props} />
)
