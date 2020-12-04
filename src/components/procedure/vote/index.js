import React from 'react'
import { useProcedure } from '../../../contexts/procedure'

export const Vote = () => {
    const { procedure } = useProcedure()
    return procedure && procedure.data ? (
        <div className="procedure-vote">
            <h4>Vote</h4>
            <div>
                Voters Organ: <code>{procedure.data.votersOrgan}</code><br/>
                Vetoers Organ: <code>{procedure.data.vetoersOrgan}</code><br/>
                Enactors Organ: <code>{procedure.data.enactorsOrgan}</code>
            </div>
        </div>
    ) : <></>
}

export default Vote