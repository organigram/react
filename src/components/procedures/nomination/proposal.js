import React from 'react'
import { useProcedure } from '../../../contexts/procedure'

const Proposal = ({ proposal }) => {
    const { procedure: { nominate } } = useProcedure()
    if (!proposal || !proposal.presented)
        return <p className="text-danger">Proposal not presented.</p>
    return nominate ? (
        <div className="procedure-proposal procedure-proposal-nomination">
            <button className="btn btn-success" onClick={() => nominate(proposal.key)}>Nominate</button>}
        </div>
    ) : <></>
}

export default Proposal