import React, { useState } from 'react'
import { OrganEntryForm, OrganEntrySelector, OrganProcedureForm, OrganProcedureSelector } from '../organ'
import { useProcedure, withProcedureProvider } from "../../contexts/procedure"
import { useGraph } from "../../contexts/graph"
import { ContractSelector } from '../graph'

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
                {move.locked && (
                    <React.Suspense fallback={<p>Loading...</p>}>
                        {ProcedureMoveComponent && <ProcedureMoveComponent move={move} />}
                    </React.Suspense>
                )}
                <hr/>
                <button className="btn btn-sm" onClick={() => toggleForms()}>toggle forms</button>
                {showForms && (
                    <>
                        <ProcedureMoveFormLock move={move} />
                        <hr/>
                        <ProcedureMoveFormAddEntries move={move} />
                        <hr/>
                        <ProcedureMoveFormRemoveEntry move={move} />
                        <hr/>
                        <ProcedureMoveFormReplaceEntry move={move} />
                        <hr/>
                        <ProcedureMoveFormAddProcedure move={move} />
                        <hr/>
                        <ProcedureMoveFormRemoveProcedure move={move} />
                        <hr/>
                        <ProcedureMoveFormReplaceProcedure move={move} />
                        <hr/>
                        <ProcedureMoveFormCall move={move} />
                    </>
                )}
            </div>
        </div>
    )
}

export const ProcedureMoveFormLock = ({ move }) => {
    const { procedure: { lockMove } } = useProcedure()
    return !move.locked && (
        <div className="procedure-move-lockMove">
            <button onClick={() => {
                lockMove(move.key).catch(console.error)
            }} className="btn btn-success">Lock Move</button>
        </div>
    )
}

export const ProcedureMoveFormAddEntries = ({ move }) => {
    const { graph: { organs } } = useGraph()
    const { procedure: { moveAddEntries } } = useProcedure()
    const [organ, setOrgan] = useState()
    const [entries, setEntries] = useState([])
    const removeEntry = entry =>
        setEntries(es => es.filter(ese => ese.address !== entry.address || `${ese.cid}` !== `${entry.cid}`))

    return (
        <div className="procedure-move-moveAddEntries">
            <ContractSelector contracts={organs} onSelect={o => o && setOrgan(o)} />
            <ul className="list-unstyled">
                {entries.map((e,i) => (
                    <li key={i} className="list-item">
                        <code>{e.address}</code><br/>
                        <a href={`https://ipfs.io/ipfs/${e.cid}`} target="_blank">
                            {`${e.cid}`}
                        </a><br />
                        <button
                            className="btn btn-sm btn-danger"
                            onClick={() => remoteEntry(e)}
                        >remove</button>
                    </li> 
                ))}
            </ul>
            <OrganEntryForm onSave={entry => entry && setEntries([...entries, entry])} />
            <button onClick={() => {
                if (organ && entries)
                    moveAddEntries(move.key, organ, entries).catch(console.error)
            }} className="btn btn-primary">Add Entries</button>
        </div>
    )
}

export const ProcedureMoveFormRemoveEntry = ({ move }) => {
    const { graph: { organs } } = useGraph()
    const { procedure: { moveRemoveEntry } } = useProcedure()
    const [organ, setOrgan] = useState()
    const [entry, setEntry] = useState()
    return (
        <div className="procedure-move-moveRemoveEntry">
            <ContractSelector contracts={organs} onSelect={o => o && setOrgan(o)} />
            {organ && <OrganEntrySelector entries={organ.entries} onSelect={e => e && setEntry(e)} />}
            <button onClick={() => {
                if (organ && entry)
                    moveRemoveEntry(move.key, organ.address, entry).catch(console.error)
            }} className="btn btn-primary">Remove Entry</button>
        </div>
    )
}

export const ProcedureMoveFormReplaceEntry = ({ move }) => {
    const { graph: { organs } } = useGraph()
    const { procedure: { moveReplaceEntry } } = useProcedure()
    const [organ, setOrgan] = useState()
    const [index, setIndex] = useState()
    const [entry, setEntry] = useState()
    return (
        <div className="procedure-move-moveReplaceEntry">
            <ContractSelector contracts={organs} onSelect={o => o && setOrgan(o)} />
            {organ && <OrganEntrySelector entries={organ.entries} onSelect={e => e && setIndex(e.index)} />}
            {organ && index && (
                <OrganEntryForm onSave={e => setEntry(e)} />
            )}
            <button onClick={() => {
                if (organ && index && entry)
                    moveReplaceEntry(move.key, organ.address, index, entry)
                    .catch(console.error)
            }} className="btn btn-primary">Replace Entry</button>
        </div>
    )
}

export const ProcedureMoveFormAddProcedure = ({ move }) => {
    const { graph: { organs } } = useGraph()
    const { procedure: { moveRemoveProcedure } } = useProcedure()
    const [organ, setOrgan] = useState()
    const [procedure, setProcedure] = useState()
    return (
        <div className="procedure-move-moveAddProcedure">
            <ContractSelector contracts={organs} onSelect={o => o && setOrgan(o)} />
            {organ && (
                <OrganProcedureForm onSave={p => p && setProcedure(p)} />
            )}
            <button onClick={() => {
                if (organ && procedure)
                    moveAddProcedure(move.key, organ.address, ).catch(console.error)
            }} className="btn btn-primary">Add Procedure</button>
        </div>
    )
}

export const ProcedureMoveFormRemoveProcedure = ({ move }) => {
    const { graph: { organs } } = useGraph()
    const { procedure: { moveRemoveProcedure } } = useProcedure()
    const [organ, setOrgan] = useState()
    const [procedure, setProcedure] = useState()
    return (
        <div className="procedure-move-moveRemoveProcedure">
            <ContractSelector contracts={organs} onSelect={o => o && setOrgan(o)} />
            {organ && (
                <OrganProcedureSelector procedures={organ.procedures} onSelect={p => p && setProcedure(p)} />
            )}
            <button onClick={() => {
                if (organ && procedure)
                    moveRemoveProcedure(move.key, organ.address, procedure.address).catch(console.error)
            }} className="btn btn-primary">Remove Procedure</button>
        </div>
    )
}

export const ProcedureMoveFormReplaceProcedure = ({ move }) => {
    const { graph: { organs } } = useGraph()
    const { procedure: { moveReplaceProcedure } } = useProcedure()
    const [organ, setOrgan] = useState()
    const [oldProcedure, setOldProcedure] = useState()
    const [newProcedure, setNewProcedure] = useState()
    return (
        <div className="procedure-move-moveReplaceProcedure">
            <ContractSelector contracts={organs} onSelect={o => o && setOrgan(o)} />
            {organ && (
                <OrganProcedureSelector procedures={organ.procedures} onSelect={p => p && setOldProcedure(p)} />
            )}
            {organ && (
                <OrganProcedureForm onSave={p => p && setNewProcedure(p)} />
            )}
            <button onClick={() => {
                if (organ && oldProcedure && newProcedure)
                    moveReplaceProcedure(move.key, organ.address, oldProcedure.address, newProcedure).catch(console.error)
            }} className="btn btn-primary">Replace Procedure</button>
        </div>
    )
}

export const ProcedureMoveFormCall = ({ move }) => {
    const { procedure: { moveCall } } = useProcedure()
    const [state, setState] = useState()
    return (
        <div className="procedure-move-moveCall">
            <button onClick={() => {
                moveCall(move.key).catch(console.error)
            }} className="btn btn-warning">Add Special Call</button>
        </div>
    )
}