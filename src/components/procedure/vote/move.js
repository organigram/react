import React from 'react'

export const VoteMove = ({ move }) => {
    const { procedure: { data } } = useProcedure()
    return data ? (
        <div className="procedure-move procedure-move-vote">
            <p>Vote Move</p>
            {data.vote && <button className="btn btn-danger" onClick={() => data.vote(move.key)}>Vote</button>}
        </div>
    ) : <></>
}

export default VoteMove