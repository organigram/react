import { EMPTY_CID } from '@organigram/client-js/dist/ipfs'
import React from 'react'
import { useProcedure } from '../../../contexts/procedure'

export const VoteMove = ({ move }) => {
    const { procedure: { data: vote } } = useProcedure()
    if (!vote) return <></>
    const proposition = vote.propositions && vote.propositions.find(p => p.moveKey && p.moveKey === move.key)
    return (
        <div className="procedure-move procedure-move-vote">
            <pre>{JSON.stringify(vote, null, 2)}</pre>
            {!proposition ? (
                <button className="btn btn-primary" onClick={() => vote.propose(
                    move.key,
                    EMPTY_CID,
                    "0",  // quorumSize
                    "0",  // voteDuration
                    "0",  // enactmentDuration
                    "0"   // majoritySize
                )}>
                    Propose
                </button>
            ) : (
                <>
                    <div>
                        <button className="btn btn-primary" onClick={() => {
                            vote.vote(move.key, true)
                            .catch(error => console.error(error.message))
                        }}>
                            Vote YES
                        </button>}
                        <button className="btn btn-primary" onClick={() => {
                            vote.vote(move.key, false)
                            .catch(error => console.error(error.message))
                        }}>
                            Vote NO
                        </button>
                    </div>
                    <button className="btn btn-danger" onClick={() => {
                        vote.veto(move.key, EMPTY_CID)
                        .catch(error => console.error(error.message))
                    }}>
                        Veto
                    </button>
                    <button className="btn btn-primary" onClick={() => {
                        vote.count(move.key)
                        .catch(error => {
                            console.error(error.message)
                            return false
                        })
                        .then(isYes => alert("Vote result is:", isYes ? "YES" : "NO"))
                    }}>
                        Count
                    </button>
                    <button className="btn btn-success" onClick={() => {
                        vote.enact(move.key)
                        .catch(error => console.error(error.message))
                    }}>
                        Enact
                    </button>
                </>
            )}
        </div>
    )
}

export default VoteMove