import React from 'react'
import { useProcedure } from '../../../contexts/procedure'

export const NominationMove = ({ move }) => {
    const { procedure: { data } } = useProcedure()
    return data ? (
        <div className="procedure-move procedure-move-vote">
            <p>Nomination Move</p>
            {data.nominate && <button className="btn btn-danger" onClick={() => data.nominate(move.key)}>Vote</button>}
        </div>
    ) : <></>
}

export default NominationMove