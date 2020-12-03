import React, { useState } from 'react'
import { useProcedure } from '../../contexts/procedure'

export const ProcedureMoves = () => {
    const { procedure: { moves, createMove } } = useProcedure()
    const [currentMove, setCurrentMove] = useState()

    return (
        <div className="row">
            <div className="col">
                <button onClick={() => createMove()}>Create Move</button>
                <hr />
                <ul>
                    {moves && moves.map(move => (
                        <li key={`move-${move.key}`} onClick={() => setCurrentMove(move)}>
                            <pre>{move.key}</pre>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="col">
                {currentMove && (
                    <ProcedureMove move={currentMove} />
                )}
            </div>
        </div>
    )

}

export const ProcedureMove = ({ move }) => {
    const { procedure } = useProcedure()
    const handleLock = React.useCallback(() => {
        procedure.lockMove(move.key).catch(console.error)
    }, [procedure.lockMove, move])
    return (
        <div className="procedure-move">
            <pre>{JSON.stringify(move, null, 2)}</pre>
            <button onClick={handleLock}>LOCK!</button>
        </div>
    )
}