import React from 'react'
import { useProcedure } from '../../../contexts/procedure'

const Procedure = () => {
    const { procedure } = useProcedure()
    return procedure ? (
        <div className="procedure-vote">
            Voters Organ: <code>{procedure.deciders}</code><br/>
            Vetoers Organ: <code>{procedure.moderators}</code><br/>
            Quorum Size: {procedure.quorumSize.toString()}<br/>
            Vote Duration (in blocks): {procedure.voteDuration.toString()}<br/>
            Majority Size: {procedure.majoritySize.toString()}
        </div>
    ) : <></>
}

export default Procedure