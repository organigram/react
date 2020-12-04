import React, { useState } from 'react'
import { useProcedure, withProcedureProvider } from "../../contexts/procedure"

export const Procedure = props => {
    const { procedure, loading, error } = useProcedure()
    const [ProcedureComponent, setProcedureComponent] = useState()

    React.useEffect(async () => {
        if (procedure.type)
            switch(procedure.type) {
                case '0xc5f28e49': // Nomination.
                    setProcedureComponent(React.lazy(() => import('./nomination')))
                    break
                case '0xc9d27afe': // Vote.
                    setProcedureComponent(React.lazy(() => import('./vote')))
                    break
                default:
                    console.log('procedure.type', procedure.type)
                    break
            }
    }, [procedure.type])

    if (!procedure) {
        return loading ?
            (props.loading || <p>Loading.</p>)
            : (props.not_found || <p>Procedure not found.</p>)
    }

    return (
        <>
            {loading && <p>Loading.</p>}
            {error && <pre>Error: {JSON.stringify(error, null, 2)}</pre>}
            {procedure && procedure.type && ProcedureComponent && (
                <React.Suspense fallback={<p>Loading...</p>}>
                    <ProcedureComponent {...props} />
                </React.Suspense>
            )}
            {procedure && procedure.type && (
                <>
                    <ProcedureMoves />
                </>
            )}
        </>
    )
}

export default withProcedureProvider(Procedure)


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

export const ProcedureMove = ({ move }) => (
    <div className="procedure-move">
        <pre>{JSON.stringify(move, null, 2)}</pre>
        <ProcedureMoveFormLock move={move} />
        <ProcedureMoveFormAddEntries move={move} />
        <ProcedureMoveFormRemoveEntry move={move} />
        <ProcedureMoveFormReplaceEntry move={move} />
        <ProcedureMoveFormAddProcedure move={move} />
        <ProcedureMoveFormRemoveProcedure move={move} />
        <ProcedureMoveFormReplaceProcedure move={move} />
        <ProcedureMoveFormCall move={move} />
    </div>
)

export const ProcedureMoveFormLock = ({ move }) => {
    const { procedure: { lockMove } } = useProcedure()
    return (
        <div className="procedure-move-lockMove">
            <button onClick={() => lockMove(move.key).catch(console.error)}>Lock Move</button>
        </div>
    )
}

export const ProcedureMoveFormAddEntries = ({ move }) => {
    const { procedure: { moveAddEntries } } = useProcedure()
    return (
        <div className="procedure-move-moveAddEntries">
            <button onClick={() => moveAddEntries(move.key, ).catch(console.error)}>Add Entries</button>
        </div>
    )
}

export const ProcedureMoveFormRemoveEntry = ({ move }) => {
    const { procedure: { moveRemoveEntry } } = useProcedure()
    return (
        <div className="procedure-move-moveRemoveEntry">
            <button onClick={() => moveRemoveEntry(move.key).catch(console.error)}>Remove Entry</button>
        </div>
    )
}

export const ProcedureMoveFormReplaceEntry = ({ move }) => {
    const { procedure: { moveReplaceEntry } } = useProcedure()
    return (
        <div className="procedure-move-moveReplaceEntry">
            <button onClick={() => moveReplaceEntry(move.key).catch(console.error)}>Replace Entry</button>
        </div>
    )
}

export const ProcedureMoveFormAddProcedure = ({ move }) => {
    const { procedure: { moveAddProcedure } } = useProcedure()
    return (
        <div className="procedure-move-moveAddProcedure">
            <button onClick={() => moveAddProcedure(move.key).catch(console.error)}>Add Procedure</button>
        </div>
    )
}

export const ProcedureMoveFormRemoveProcedure = ({ move }) => {
    const { procedure: { moveRemoveProcedure } } = useProcedure()
    return (
        <div className="procedure-move-moveRemoveProcedure">
            <button onClick={() => moveRemoveProcedure(move.key).catch(console.error)}>Remove Procedure</button>
        </div>
    )
}

export const ProcedureMoveFormReplaceProcedure = ({ move }) => {
    const { procedure: { moveReplaceProcedure } } = useProcedure()
    return (
        <div className="procedure-move-moveReplaceProcedure">
            <button onClick={() => moveReplaceProcedure(move.key).catch(console.error)}>Replace Procedure</button>
        </div>
    )
}

export const ProcedureMoveFormCall = ({ move }) => {
    const { procedure: { moveCall } } = useProcedure()
    const [state, setState] = useState()
    return (
        <div className="procedure-move-moveCall">
            <button onClick={() => moveCall(move.key).catch(console.error)}>Add Special Call</button>
        </div>
    )
}