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
                    setProcedureComponent()
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
                <div className="card procedure">
                    <div className="card-body">
                        <h4>{procedure.address}</h4>
                        <h5>Metadata</h5>
                        <code>{`${procedure.metadata.cid}`}</code> <a href={`https://ipfs.io/ipfs/${procedure.metadata.cid}`} target="_blank">view</a>
                        <h5>Moves</h5>
                        <ProcedureMoves />
                        <hr/>
                        <React.Suspense fallback={<p>Loading...</p>}>
                            <ProcedureComponent {...props} />
                        </React.Suspense>
                    </div>
                </div>
            )}
        </>
    )
}

export default withProcedureProvider(Procedure)

export const ProcedureMoves = () => {
    const { procedure: { moves, createMove } } = useProcedure()
    const [currentMove, setCurrentMove] = useState()

    return (
        <div className="row">
            <div className="col-2">
                <button onClick={() => createMove()} className="btn btn-primary">Create Move</button>
                <hr />
                <ul>
                    {moves && moves.map(move => (
                        <li key={`move-${move.key}`} onClick={() => setCurrentMove(move)}>
                            <pre>{move.key}</pre>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="col-10">
                {currentMove && <ProcedureMove move={currentMove} />}
            </div>
        </div>
    )

}

export const ProcedureMove = ({ move }) => {
    const { procedure: { type } } = useProcedure()
    const [showForms, setShowForms] = useState(false)
    const toggleForms = () => setShowForms(sf => !sf)
    const [ProcedureMoveComponent, setProcedureMoveComponent] = useState()
    React.useEffect(async () => {
        if (type)
            switch(type) {
                case '0xc5f28e49': // Nomination.
                    setProcedureMoveComponent(React.lazy(() => import('./nomination/move')))
                    break
                case '0xc9d27afe': // Vote.
                    setProcedureMoveComponent(React.lazy(() => import('./vote/move')))
                    break
                default:
                    setProcedureMoveComponent()
                    break
            }
    }, [type])

    return (
        <div className="procedure-move card">
            <div className="card-body">
                <h5>{move.key}</h5>
                <div>
                    Creator: <code>{move.creator}</code><br/>
                    Locked? <code>{move.locked ? "true" : "false"}</code><br/>
                    Applied? <code>{move.applied ? "true" : "false"}</code><br/>
                    Processing? <code>{move.processing ? "true" : "false"}</code><br/>
                    Metadata: <code>{`${move.metadata.cid}`}</code> <a href={`https://ipfs.io/ipfs/${move.metadata.cid}`} target="_blank">view</a><br/>
                    Operations:
                    <pre>{JSON.stringify(move.operations, null, 2)}</pre>
                </div>
                <React.Suspense fallback={<p>Loading...</p>}>
                    {ProcedureMoveComponent && <ProcedureMoveComponent move={move} />}
                </React.Suspense>
                <button className="btn btn-sm" onClick={() => toggleForms()}>toggle forms</button>
                {showForms && (
                    <>
                        <ProcedureMoveFormLock move={move} />
                        <ProcedureMoveFormAddEntries move={move} />
                        <ProcedureMoveFormRemoveEntry move={move} />
                        <ProcedureMoveFormReplaceEntry move={move} />
                        <ProcedureMoveFormAddProcedure move={move} />
                        <ProcedureMoveFormRemoveProcedure move={move} />
                        <ProcedureMoveFormReplaceProcedure move={move} />
                        <ProcedureMoveFormCall move={move} />
                    </>
                )}
            </div>
        </div>
    )
}

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