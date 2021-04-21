import { CID, Procedure } from '@organigram/client-js'
import graph from '@organigram/client-js/dist/graph'
import React, { useState } from 'react'
import { useGraph } from '../../../contexts/graph'
import { useOrgan, withOrganProvider } from '../../../contexts/organ'
import { useProcedure } from '../../../contexts/procedure'
import { ContractSelector } from '../../graph/contracts'
import { OrganEntryForm, OrganEntrySelector, OrganProcedureForm, OrganProcedureSelector } from '../../organ'
import { CIDInput } from '../../vault/upload'
import { ProposalOperations } from './operations'

export const ProposalOperationAddEntries = ({ proposal, operation }) => {
    const { procedure: { lockProposal }, reloadProposal } = useProcedure()
    return !proposal.locked && (
        <div className="procedure-proposal-lockProposal">
            <button onClick={() => {
                lockProposal(proposal.key)
                .then(() => reloadProposal(proposal.key))
                .catch(console.error)
            }} className="btn btn-success">Lock Proposal</button>
        </div>
    )
}

export const EntriesSelector = ({ defaultValue, onSelect }) => {
    const [entries, setEntries] = useState(defaultValue || [])
    return (
        <>
            Entries<br/>
            <ul>
                {entries.map(entry => {
                    const key = `entry-${entry.addr}-${entry.doc}`
                    return (
                        <li key={key}>
                            <div className="row">
                                {entry.addr && <div className="col"><code>{entry.addr}</code></div>}
                                {entry.doc && <div className="col"><a href={`ipfs://${entry.doc}`}>{entry.doc}</a></div>}
                                <div className="col col-2">
                                    <span
                                        className="text-danger text-link"
                                        role="button"
                                        onClick={() => setEntries(_es => _es.filter(_e => _e.addr === entry.addr && _e.doc === entry.doc))}
                                    >
                                        remove
                                    </span>
                                </div>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </>
    )
}

export const ProposalFormAddEntries = ({ proposal }) => {
    const { graph: { organs } } = useGraph()
    const { procedure: { proposalAddEntries }, reloadProposal } = useProcedure()
    const [organ, setOrgan] = useState()
    const [entries, setEntries] = useState([])
    const removeEntry = entry =>
        setEntries(es => es.filter(ese => ese.address !== entry.address || `${ese.cid}` !== `${entry.cid}`))

    return (
        <div className="procedure-proposal-proposalAddEntries">
            <ContractSelector contracts={organs} onSelect={o => o && setOrgan(o)} />
            <ul className="list-unstyled">
                {entries.map((e,i) => (
                    <li key={i} className="list-item">
                        <code>{e.address}</code><br/>
                        <a href={`ipfs://${e.cid}`} target="_blank">
                            {`${e.cid}`}
                        </a><br />
                        <button
                            className="btn btn-sm btn-danger"
                            onClick={() => removeEntry(e)}
                        >remove</button>
                    </li>  
                ))}
            </ul>
            <OrganEntryForm onSave={entry => entry && setEntries([...entries, entry])} />
            <button onClick={() => {
                if (organ && entries)
                    proposalAddEntries(proposal.key, organ.address, entries)
                    .then(() => reloadProposal(proposal.key))
                    .catch(console.error)
            }} className="btn btn-primary">Add Entries</button>
        </div>
    )
}

export const ProposalFormRemoveEntry = ({ proposal }) => {
    const { graph: { organs } } = useGraph()
    const { procedure: { proposalRemoveEntries }, reloadProposal } = useProcedure()
    const [organ, setOrgan] = useState()
    const [entries, setEntries] = useState([])
    const removeEntry = entry =>
        setEntries(es => es.filter(ese => ese.address !== entry.address || `${ese.cid}` !== `${entry.cid}`))
    return (
        <div className="procedure-proposal-proposalRemoveEntries">
            <ContractSelector contracts={organs} onSelect={o => o && setOrgan(o)} />
            {organ && (
                <>
                    <ul className="list-unstyled">
                        {entries.map((e,i) => (
                            <li key={i} className="list-item">
                                <code>{e.address}</code><br/>
                                <a href={`ipfs://${e.cid}`} target="_blank">
                                    {`${e.cid}`}
                                </a><br />
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => removeEntry(e)}
                                >remove</button>
                            </li> 
                        ))}
                    </ul>
                    <OrganEntrySelector entries={organ.entries} onSelect={e => e && setEntries([...entries, e])} />
                </>
            )}
            <button onClick={() => {
                if (organ && entries.length > 0)
                    proposalRemoveEntries(proposal.key, organ.address, entries.map(e => e.index))
                    .then(() => reloadProposal(proposal.key))
                    .catch(console.error)
            }} className="btn btn-primary">Remove Entries</button>
        </div>
    )
}

export const ProposalFormReplaceEntry = ({ proposal }) => {
    const { graph: { organs } } = useGraph()
    const { procedure: { proposalReplaceEntry }, reloadProposal } = useProcedure()
    const [organ, setOrgan] = useState()
    const [index, setIndex] = useState()
    const [entry, setEntry] = useState()
    return (
        <div className="procedure-proposal-proposalReplaceEntry">
            <ContractSelector contracts={organs} onSelect={o => o && setOrgan(o)} />
            {organ && <OrganEntrySelector entries={organ.entries} onSelect={e => e && setIndex(e.index)} />}
            {organ && index && (
                <>
                    {entry && <><code>{entry.address}</code> <span className="text-info">{`${entry.cid}`}</span></>}
                    <OrganEntryForm onSave={e => setEntry(e)} />
                </>
            )}
            <button onClick={() => {
                if (organ && index && entry)
                    proposalReplaceEntry(proposal.key, organ.address, { index, ...entry })
                    .then(() => reloadProposal(proposal.key))
                    .catch(console.error)
            }} className="btn btn-primary">Replace Entry</button>
        </div>
    )
}

export const ProposalFormAddProcedure = ({ proposal }) => {
    const { graph: { organs } } = useGraph()
    const { procedure: { proposalAddProcedure }, reloadProposal } = useProcedure()
    const [organ, setOrgan] = useState()
    const [procedure, setProcedure] = useState()
    return (
        <div className="procedure-proposal-proposalAddProcedure">
            <ContractSelector contracts={organs} onSelect={o => o && setOrgan(o)} />
            {organ && (
                <>
                    {procedure && <><code>{procedure.address}</code> <span className="text-info">{`${procedure.permissions}`}</span></>}
                    <OrganProcedureForm onSave={p => p && setProcedure(p)} />
                </>
            )}
            <button onClick={() => {
                if (organ && procedure)
                    proposalAddProcedure(proposal.key, organ.address, procedure)
                    .then(() => reloadProposal(proposal.key))
                    .catch(console.error)
            }} className="btn btn-primary">Add Procedure</button>
        </div>
    )
}

export const ProposalFormRemoveProcedure = ({ proposal }) => {
    const { graph: { organs } } = useGraph()
    const { procedure: { proposalRemoveProcedure }, reloadProposal } = useProcedure()
    const [organ, setOrgan] = useState()
    const [procedure, setProcedure] = useState()
    return (
        <div className="procedure-proposal-proposalRemoveProcedure">
            <ContractSelector contracts={organs} onSelect={o => o && setOrgan(o)} />
            {organ && (
                <OrganProcedureSelector procedures={organ.procedures} onSelect={p => p && setProcedure(p)} />
            )}
            <button onClick={() => {
                if (organ && procedure)
                    proposalRemoveProcedure(proposal.key, organ.address, procedure.address)
                    .then(() => reloadProposal(proposal.key))
                    .catch(console.error)
            }} className="btn btn-primary">Remove Procedure</button>
        </div>
    )
}

export const ProposalFormReplaceProcedure = ({ proposal }) => {
    const { graph: { organs } } = useGraph()
    const { procedure, reloadProposal } = useProcedure()
    const { proposalReplaceProcedure } = procedure
    const [organ, setOrgan] = useState()
    const [oldProcedure, setOldProcedure] = useState()
    const [newProcedure, setNewProcedure] = useState()
    return (
        <div className="procedure-proposal-proposalReplaceProcedure">
            <ContractSelector contracts={organs} onSelect={o => o && setOrgan(o)} />
            {organ && (
                <OrganProcedureSelector procedures={organ.procedures} onSelect={p => p && setOldProcedure(p)} />
            )}
            {organ && (
                <>
                    {procedure && <><code>{procedure.address}</code> <span className="text-info">{`${procedure.permissions}`}</span></>}
                    <OrganProcedureForm onSave={p => p && setNewProcedure(p)} />
                </>
            )}
            <button onClick={() => {
                if (organ && oldProcedure && newProcedure)
                    proposalReplaceProcedure(proposal.key, organ.address, oldProcedure.address, newProcedure)
                    .then(() => reloadProposal(proposal.key))
                    .catch(console.error)
            }} className="btn btn-primary">Replace Procedure</button>
        </div>
    )
}

export const ProposalFormCall = ({ proposal }) => {
    const { procedure: { proposalCall }, reloadProposal } = useProcedure()
    const [state, setState] = useState()
    return (
        <div className="procedure-proposal-proposalCall">
            <button onClick={() => {
                proposalCall(proposal.key)
                .then(() => reloadProposal(proposal.key))
                .catch(console.error)
            }} className="btn btn-warning">Add Special Call</button>
        </div>
    )
}

export const MetadataForm = ({ defaultValue, onChange }) => {
    const cidRef = React.useRef()
    return (
        <>
            <input ref={cidRef} type="text" name="cid" placeholder="cid" className="form-control" />
            <button className="btn btn-primary"
                onClick={() => {
                    try {
                        const metadata = new CID(cidRef.current.value)
                        onChange(metadata)
                    }
                    catch (_error) {}
                }}
            >Save</button>
        </>
    )
}

export const AddressInput = ({ address, onChange }) => {
    return <input
        type="text"
        defaultValue={address}
        onChange={e => onChange(e.target.value)}
        placeholder="Address"
        className="form-control"
    />
}

export const EntryForm = ({ defaultValue, onChange }) => {
    const [value, setValue] = useState(defaultValue)

    return (
        <>
            <AddressInput defaultValue={defaultValue && defaultValue.addr} onChange={addr => setValue({...value,addr})} />
            <CIDInput cid={defaultValue && defaultValue.doc} onSave={doc => setValue({...value,doc})} />
            <button className="btn btn-primary"
                onClick={() => {
                    try {
                        const metadata = new CID(value)
                        onChange(value)
                    }
                    catch (_error) {}
                }}
            >Save</button>
        </>
    )
}

export const EntriesForm = ({ defaultValue, onChange }) => {
    const [entries, setEntries] = useState(defaultValue || [])
    const handleChange = (_entries) => {
        setEntries(_entries)
        onChange(_entries)
    }
    return (
        <>
            {
                entries.map((entry, i) => (
                    <EntryForm key={i} defaultValue={entry} onChange={_entry => {
                        let _entries = entries
                        _entries[i] = _entry
                        handleChange(_entries)
                    }} />
                ))
            }
            <div className="entry-add">
                <EntryForm onChange={_entry => handleChange([...entries, _entry])} />
            </div>
        </>
    )
}

export const ProposalOperationFormFunctionParam = ({ param, type, ...props }) => {
    switch (param) {
        case 'metadata':
            return type === 'select' ?
                <p className="text-danger">Metadata selector not implemented.</p>
                : <MetadataForm {...props} />
        case 'entries':
            return type === 'select' ?
                <OrganEntrySelector multiple {...props} onSelect={props.onChange} />
                : <EntriesForm {...props} />
        case 'entry':
            return type === 'select' ?
                <OrganEntrySelector {...props} onSelect={props.onChange} />
                : <OrganEntryForm {...props} />
        case 'organ':
            return type === 'select' ?
                <p className="text-danger">Organ selector not implemented.</p>
                : <OrganProcedureSelector {...props} />
        case 'procedure':
            return type === 'select' ?
                <OrganProcedureSelector {...props} onSelect={props.onChange} />
                : <OrganProcedureForm {...props} />
        case 'index':
            return type === 'select' ?
                <OrganEntrySelector {...props} onSelect={props.onChange} />
                : <input type="text" placeholder="Entry index" />
        case 'indexes':
            return type === 'select' ?
                <OrganEntrySelector multiple {...props} onSelect={props.onChange} />
                : <input type="text" placeholder="Entry index" />
        case 'permissions':
        case 'address':
        case 'addresses':
        default:
            return <>{param}</>
    }
}

export const ProposalOperationFormFunctionParameters = withOrganProvider(
    ({ operationFunction, defaultParams, onSave }) => {
        const { organ } = useOrgan()
        const [params, setParams] = useState(defaultParams || [])
        // Forms' components default to inputs, some are selectors.
        const hasModeSelector = React.useMemo(() => [
            'removeEntries',
            'replaceEntry',
            'removeProcedure',
            'replaceProcedure'
        ].indexOf(operationFunction.key) >= 0, [operationFunction.key])

        if (!organ)
            return <p>Loading organ...</p>

        const handleParamChange = i => v => {
            const _params = [...params]
            _params[i] = v
            setParams(_params)
        }

        return (
            <>
                <div className="operation-parameters">
                    {operationFunction && operationFunction.params && operationFunction.params.map((param,i) => (
                        <div key={`${operationFunction.key}-param-${param}`}>
                            {params && params[i] ? (
                                <pre>{JSON.stringify(params[i], null, 2)}</pre>
                            ) : (
                                <ProposalOperationFormFunctionParam
                                    param={param}
                                    type={hasModeSelector&&i===0?'select':'input'}
                                    defaultValue={params && params[i]}
                                    onChange={handleParamChange(i)}
                                />
                            )}
                        </div>
                    ))}
                </div>
                <hr />
                <button onClick={() => {
                    onSave(params)
                    setParams([])
                }} className="btn btn-primary">Save</button>
            </>
        )
    }
)

export const ProposalOperationFormFunction = ({ functionSelector, defaultTarget, defaultParams, onSave }) => {
    const { graph } = useGraph()
    const { procedure } = useProcedure()
    const targetOrgans = React.useMemo(
        () => graph.organs.filter(o => o.procedures.find(op => op.address === procedure.address)),
        [graph.organs, procedure.address]
    )
    const [target, setTarget] = useState(defaultTarget)

    const operationFunction = Procedure.OPERATIONS_FUNCTIONS.find(pof => pof.funcSig === functionSelector)
    if (!operationFunction)
        return <p className="text-danger">Operation not found.</p>
    else if (!operationFunction.target)
        return <p className="text-danger">Operation not supported.</p>

    // @todo Target can be another procedure, or Token Contract ...
    const targets = operationFunction.target === "organ"
        ? targetOrgans
        : operationFunction.target === "procedure"
        ? graph.procedures
        : [...graph.organs, ...graph.procedures]

    // @todo : Handle other kinds of target : chainable procedures, token contracts...
    return (
        <>
            <ContractSelector contracts={targets} onSelect={o => o && setTarget(o)} />
            {target && target.address && (
                <ProposalOperationFormFunctionParameters
                    operationFunction={operationFunction}
                    defaultParams={defaultParams}
                    organ={target}
                    onSave={params => {
                        onSave({ target, params })
                        setTarget(null)
                    }}
                />
            )}
        </>
    )
}

export const ProposalOperationForm = ({ onSave }) => {
    const [functionSelector, setFunctionSelector] = useState(null)
    const [values, setValues] = useState({ target: null, params: [] })
    return (
        <div className="card card-body border-light">
            <select
                defaultValue={functionSelector}
                onChange={e => setFunctionSelector(e.target.value)}
                className="form-control"
            >
                <option value="">-- Select an action</option>
                {Procedure.OPERATIONS_FUNCTIONS.map(op => (
                    <option key={op.key} value={op.funcSig}>{op.label}</option>
                ))}
            </select>
            {functionSelector && (
                <>
                    <hr/>
                    {values.target && values.params.length > 0 ? (
                        <>
                            <label>Target</label>&nbsp;{values.target.address}<br/>
                            {values.params.map((param, i) => (
                                <div key={i}>
                                    <pre>{JSON.stringify(param, null, 2)}</pre>
                                </div>
                            ))}
                        </>
                    ) : (
                        <ProposalOperationFormFunction
                            defaultTarget={values.target}
                            defaultParams={values.params}
                            onSave={({ target, params }) => setValues({ target, params })}
                            functionSelector={functionSelector}
                        />
                    )}
                </>
            )}
            <div>
                <button className="btn btn-light" onClick={() => {
                    onSave({ functionSelector, target: values.target, params: values.params })
                    setValues({ target: null, params: [] })
                }}>Add operation</button>
            </div>
        </div>
    )
}

export const ProposalFormCreate = ({ onCreate }) => {
    const { procedure } = useProcedure()
    const [metadata, setMetadata] = React.useState(null)
    const [operations, setOperations] = React.useState([])
    return (
        <div className="procedure-proposal-create">
            <strong>Metadata</strong>
            <div>
                {!metadata
                    ? <MetadataForm defaultValue={metadata} onChange={setMetadata} />
                    : <a href={`ipfs://${metadata}`} target="_blank">{`${metadata}`}</a>
                }
            </div>
            <strong>Operations</strong>
            <div><ProposalOperationForm onSave={op => { setOperations([...operations, op]) }} /></div>
            <div><ProposalOperations proposal={{ operations }} /></div>
            <div>
                <button onClick={() => {
                    procedure.propose(metadata, operations)
                    .catch(console.error)
                }} className="btn btn-primary">Create</button>
            </div>
        </div>
    )
}