import organ from '@organigram/client-js/dist/organ'
import React, { useState } from 'react'
import { useOrgan, withOrganProvider } from "../../contexts/organ"
import Upload from '../vault/upload'

export const Organ = props => {
    const { organ, loading, error, reloadData, reloadEntries, reloadProcedures } = useOrgan()
    const [showForms, setShowForms] = useState(false)
    const toggleForms = () => setShowForms(sf => !sf)
    return (
        <div {...props} id={organ.address && `organ-${organ.address}`}>
            {loading && <p>Loading organ...</p>}
            {error && <pre>Error: {JSON.stringify(error, null, 2)}</pre>}
            {organ && (
                <div className="organ card card-body bg-secondary">
                    {organ.metadata && organ.metadata.data && organ.metadata.data.name && <h5 className="card-title">{`${organ.metadata.data.name}`}</h5>}
                    <strong>{`${organ.address}`}</strong>
                    <u><em>Balance</em></u>
                    <p>Ξ {organ.balance}</p>
                    <u><em>Metadata</em></u>
                    <div>
                        <button onClick={() => reloadData()} className="btn btn-sm">reload</button>
                        <p><code>{`${organ.metadata}`}</code> <a href={`ipfs://${organ.metadata}`} target="_blank">view</a></p>
                    </div>
                    <u><em>Procedures</em></u>
                    <div>
                        <button onClick={() => reloadProcedures()} className="btn btn-sm">reload</button>
                        <ul className="list-unstyled mb-1">
                            {organ.procedures.map((op) => (
                                <li key={`organ-procedure-${op.address}`} className="list-item">
                                    <code>{op.address}</code> <span className="text-info">{`${op.permissions}`}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <u><em>Entries</em></u>
                    <div>
                        <button onClick={() => reloadEntries()} className="btn btn-sm">reload</button>
                        <ul className="list-unstyled mb-1">
                            {organ.entries.map((e) => (
                                <li key={`entry-${e.index}`} className="list-item">
                                    <em>{e.index}</em>{" "}
                                    <code>{e.address}</code><br/>
                                    <small><a href={`ipfs://${e.cid}`} target="_blank">{`${e.cid}`}</a></small>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <hr className="mb-1" />
                    <div>
                        <button className="btn btn-sm" onClick={() => toggleForms()}>toggle forms</button>
                        {showForms && (
                            <>
                                <hr />
                                <OrganFormUpdateMetadata />
                                <hr />
                                <OrganFormAddEntries />
                                <hr />
                                <OrganFormRemoveEntries />
                                <hr />
                                <OrganFormReplaceEntry />
                                <hr />
                                <OrganFormAddProcedure />
                                <hr />
                                <OrganFormRemoveProcedure />
                                <hr />
                                <OrganFormReplaceProcedure />
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default withOrganProvider(Organ)

export const OrganEntryForm = ({ onSave }) => {
    const [cid, setCid] = useState()
    const [address, setAddress] = useState("")

    React.useEffect(() => {
        if (address && cid && onSave)
            onSave({ address, cid })
    }, [cid, address])

    return (
        <>
            <input type="text" name="address" placeholder="address" defaultValue={address} onChange={e => setAddress(e.target.value)} className="form-control" />
            {cid && <p><code>{`${cid}`}</code>&nbsp;<a href={`ipfs://${cid}`} target="_blank">open</a></p>}
            <Upload cid={cid} onCID={c => setCid(c)} />
        </>
    )
}

export const OrganEntrySelector = ({ onSelect }) => {
    const { organ: { entries } } = useOrgan()
    const handleChange = (event) => {
        const entry = entries && entries.find(e => e.index === event.target.value)
        onSelect(entry)
    }
    return (
        <select onChange={handleChange} className="form-control">
            <option value="">-- Select an entry</option>
            {entries.map(e =>
                <option key={e.index} value={e.index}>{`${e.index} ${e.address} [${e.cid}]`}</option>
            )}
        </select>
    )
}

export const OrganProcedureForm = ({ onSave }) => {
    return (
        <form onSubmit={e => {
            e.preventDefault()
            const { address, permissions } = e.currentTarget
            if (onSave) {
                onSave({ address: address.value, permissions: permissions.value })
                e.currentTarget.reset()
            }
        }} className="form">
            <div><input type="text" name="address" placeholder="address" className="form-control" /></div>
            <div><input type="text" name="permissions" placeholder="permissions" className="form-control" /></div>
            <button type="submit" className="btn btn-sm">save</button>
        </form>
    )
}

export const OrganProcedureSelector = ({ procedures, onSelect }) => {
    const handleChange = (event) => {
        const procedure = procedures.find(p => p.address === event.target.value)
        onSelect(procedure)
    }
    return (
        <select onChange={handleChange} className="form-control">
            <option value="">-- Select a procedure</option>
            {procedures.map(p =>
                <option key={p.address} value={p.address}>{`${p.address} [${p.permissions}]`}</option>
            )}
        </select>
    )
}

export const OrganFormUpdateMetadata = () => {
    const { organ: { updateMetadata }, reloadData } = useOrgan()
    const cidRef = React.useRef()
    return (
        <div className="organ-updateMetadata">
            <input ref={cidRef} type="text" name="cid" placeholder="cid" className="form-control" />
            <button className="btn btn-primary"
                onClick={() => {
                    updateMetadata(cidRef.current.value)
                    .then(() => reloadData())
                    .catch(console.error)
                }}
            >Update Metadata</button>
        </div>
    )
}

export const OrganFormAddEntries = () => {
    const { organ: { addEntries }, reloadEntries } = useOrgan()
    const [entries, setEntries] = useState([])
    return (
        <div className="organ-addEntries">
            <ul className="list-unstyled">
                {entries.map((e, i) => (
                    <li key={i} className="list-item">
                        <em>{e.address}</em><br/>
                        {`${e.cid}`}
                    </li>
                ))}
                <li key={"add"}>
                    <OrganEntryForm onSave={({ address, cid }) => setEntries(es => [...es, { address, cid }])} />
                </li>
            </ul>

            <button onClick={() => {
                addEntries(entries)
                .then(() => reloadEntries())
                .catch(console.error)
            }} className="btn btn-primary">Add Entries</button>

            <hr/>
            <Upload onUpload={() => alert("Uploaded.")} />
        </div>
    )
}

export const OrganFormRemoveEntries = () => {
    const { organ: { entries: organEntries, removeEntries }, reloadEntries } = useOrgan()
    const [entries, setEntries] = useState([])
    const indexes = entries.map(e => e.index)
    return (
        <div className="organ-removeEntries">
            <ul className="list-unstyled">
                {entries.map(e =>
                    <li className="list-item" key={e.index}>
                        <span onClick={() => setEntries(es => es.filter(ese => ese.index !== e.index))}>x</span>
                        {`${e.address} [${e.cid}]`}
                    </li>
                )}
                <li key="add">
                    <OrganEntrySelector entries={organEntries} onSelect={e =>
                        e && !entries.find(ese => ese.index === e.index) && setEntries(es => [...es, e])
                    } />
                </li>
            </ul>
            <button onClick={() => {
                removeEntries(indexes)
                .then(() => reloadEntries())
                .catch(console.error)
            }} className="btn btn-primary">Remove Entries</button>
        </div>
    )
}

export const OrganFormReplaceEntry = () => {
    const { organ: { entries: organEntries, replaceEntry }, reloadEntries } = useOrgan()
    const [index, setIndex] = useState()
    const [entry, setEntry] = useState()
    return (
        <div className="organ-replaceEntry">
            <OrganEntrySelector entries={organEntries} onSelect={e => e && setIndex(e.index)} />
            <OrganEntryForm onSave={e => e && setEntry(e)} />
            <button onClick={() => {
                replaceEntry(index, entry)
                .then(() => reloadEntries())
                .catch(console.error)
            }} className="btn btn-primary">Replace Entry</button>
        </div>
    )
}

export const OrganFormAddProcedure = () => {
    const { organ: { addProcedure }, reloadProcedures } = useOrgan()
    const [procedure, setProcedure] = useState()
    return (
        <div className="organ-addProcedure">
            <OrganProcedureForm onSave={p => p && setProcedure(p)} />
            <button onClick={() => {
                if (procedure) {
                    addProcedure(procedure)
                    .then(() => reloadProcedures())
                    .catch(console.error)
                }
            }} className="btn btn-primary">Add Procedure</button>
        </div>
    )
}

export const OrganFormRemoveProcedure = () => {
    const { organ: { procedures, removeProcedure }, reloadProcedures } = useOrgan()
    const [procedure, setProcedure] = useState()
    return (
        <div className="organ-removeProcedure">
            <OrganProcedureSelector procedures={procedures} onSelect={p => p && setProcedure(p)}/>
            <button onClick={() => {
                removeProcedure(procedure.address)
                .then(() => reloadProcedures())
                .catch(console.error)
            }} className="btn btn-primary">Remove Procedure</button>
        </div>
    )
}

export const OrganFormReplaceProcedure = () => {
    const { organ: { procedures, replaceProcedure }, reloadProcedures } = useOrgan()
    const [oldProcedure, setOldProcedure] = useState()
    const [newProcedure, setNewProcedure] = useState()
    return (
        <div className="organ-replaceProcedure">
            <OrganProcedureSelector procedures={procedures} onSelect={p => p && setOldProcedure(p)}/>
            <OrganProcedureForm onSave={p => p && setNewProcedure(p)} />
            <button onClick={() => {
                replaceProcedure(oldProcedure.address, newProcedure)
                .then(() => reloadProcedures())
                .catch(console.error)
            }} className="btn btn-primary">Replace Procedure</button>
        </div>
    )
}