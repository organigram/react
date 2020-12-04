import React, { useState } from 'react'
import { useOrgan, withOrganProvider } from "../../contexts/organ"

export const Organ = props => {
    const { organ, loading, error } = useOrgan()
    const [showForms, setShowForms] = useState(false)
    const toggleForms = () => setShowForms(sf => !sf)
    return (
        <div {...props}>
            {loading && <p>Loading organ...</p>}
            {error && <pre>Error: {JSON.stringify(error, null, 2)}</pre>}
            {organ && (
                <div className="card">
                    <div className="card-body">
                        <h4>{organ.address}</h4>
                        <h5>Metadata</h5>
                        <code>{`${organ.metadata.cid}`}</code> <a href={`https://ipfs.io/ipfs/${organ.metadata.cid}`} target="_blank">view</a>
                        <h5>Procedures</h5>
                        <ul className="list-unstyled">
                            {organ.procedures.map((op, i) => (
                                <li key={op.address} className="list-item">
                                    <code>{op.address}</code> <span className="text-info">{`${op.permissions}`}</span>
                                </li>
                            ))}
                        </ul>
                        <h5>Entries</h5>
                        <ul className="list-unstyled">
                            {organ.entries.map((e, i) => (
                                <li key={e.index} className="list-item">
                                    <em>{e.index}</em>{" "}
                                    <code>{e.address}</code><br/>
                                    <a href={`https://ipfs.io/ipfs/${e.cid}`} target="_blank">{`${e.cid}`}</a>
                                </li>
                            ))}
                        </ul>
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
    return (
        <form onSubmit={e => {
            e.preventDefault()
            const { address, cid, reset } = e.currentTarget
            onSave({ address, cid }).then(() => reset())
        }} className="form">
            <div><input type="text" name="address" placeholder="address" className="form-control" /></div>
            <div><input type="text" name="cid" placeholder="cid" className="form-control" /></div>
            <button type="submit" className="btn btn-sm">save</button>
        </form>
    )
}

export const OrganEntrySelector = ({ onSelect }) => {
    const { organ: { entries } } = useOrgan()
    const handleChange = (event) => {
        const entry = entries.find(e => e.index === event.target.value)
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
            const { address, permissions, reset } = e.currentTarget
            onSave({ address, permissions }).then(() => reset())
        }} className="form">
            <div><input type="text" name="address" placeholder="address" className="form-control" /></div>
            <div><input type="text" name="permissions" placeholder="permissions" className="form-control" /></div>
            <button type="submit" className="btn btn-sm">save</button>
        </form>
    )
}

export const OrganProcedureSelector = ({ onSelect }) => {
    const { organ: { procedures } } = useOrgan()
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
    const { organ: { updateMetadata } } = useOrgan()
    const cidRef = React.useRef()
    return (
        <div className="organ-updateMetadata">
            <input ref={cidRef} type="text" name="cid" placeholder="cid" className="form-control" />
            <button className="btn btn-outline-primary"
                onClick={() => updateMetadata(cidRef.current.value).catch(console.error)}
            >Update Metadata</button>
        </div>
    )
}

export const OrganFormAddEntries = () => {
    const { organ: { addEntries } } = useOrgan()
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

            <button onClick={() => addEntries(entries).catch(console.error)} className="btn btn-outline-primary">Add Entries</button>
        </div>
    )
}

export const OrganFormRemoveEntries = () => {
    const { organ: { removeEntries } } = useOrgan()
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
                    <OrganEntrySelector onSelect={e =>
                        e && !entries.find(ese => ese.index === e.index) && setEntries(es => [...es, e])
                    } />
                </li>
            </ul>
            <button onClick={() => removeEntries(indexes).catch(console.error)} className="btn btn-outline-primary">Remove Entries</button>
        </div>
    )
}

export const OrganFormReplaceEntry = () => {
    const { organ: { replaceEntry } } = useOrgan()
    const [index, setIndex] = useState()
    const [entry, setEntry] = useState()
    return (
        <div className="organ-replaceEntry">
            <OrganEntrySelector onSelect={e => e && setIndex(e.index)} />
            <OrganEntryForm onSave={setEntry} />
            <button onClick={() => replaceEntry(index, entry).catch(console.error)} className="btn btn-outline-primary">Replace Entry</button>
        </div>
    )
}

export const OrganFormAddProcedure = () => {
    const { organ: { addProcedure } } = useOrgan()
    const [procedure, setProcedure] = useState()
    return (
        <div className="organ-addProcedure">
            <OrganProcedureForm onSave={setProcedure} />
            <button onClick={() => addProcedure(procedure).catch(console.error)} className="btn btn-outline-primary">Add Procedure</button>
        </div>
    )
}

export const OrganFormRemoveProcedure = () => {
    const { organ: { removeProcedure } } = useOrgan()
    const [procedure, setProcedure] = useState()
    return (
        <div className="organ-removeProcedure">
            <OrganProcedureSelector onSelect={p => p && setProcedure(p)}/>
            <button onClick={() => removeProcedure(procedure.address).catch(console.error)} className="btn btn-outline-primary">Remove Procedure</button>
        </div>
    )
}

export const OrganFormReplaceProcedure = () => {
    const { organ: { replaceProcedure } } = useOrgan()
    const [oldProcedure, setOldProcedure] = useState()
    const [newProcedure, setNewProcedure] = useState()
    return (
        <div className="organ-replaceProcedure">
            <OrganProcedureSelector onSelect={p => p && setOldProcedure(p)}/>
            <OrganProcedureForm onSave={p => p && setNewProcedure(p)} />
            <button onClick={() => replaceProcedure(oldProcedure.address, newProcedure).catch(console.error)} className="btn btn-outline-primary">Replace Procedure</button>
        </div>
    )
}