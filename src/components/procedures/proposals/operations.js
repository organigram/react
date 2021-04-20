import React from 'react'

export const ProposalOperationParam = ({ param }) => {
    switch (param.type) {
        case 'metadata':
            return (
                <>
                    Metadata&nbsp;
                    <a href={`ipfs://${param.value.toString()}`} target="_blank">{param.value.toString()}</a>
                </>
            )
        case 'entries':
            return (
                <>
                    Entries
                    <ul>
                        {param.value.map((entry) => entry && (entry.addr || entry.doc) && (
                            <li className="list-item" key={`entry-${entry.addr}-${entry.doc.toString()}`}>
                                {entry.addr && <code>{entry.addr}</code>}
                                {entry.addr && entry.doc && <br/>}
                                {entry.doc && (
                                    <>
                                        Doc&nbsp;
                                        <a href={`ipfs://${entry.doc}`} target="_blank">{entry.doc.toString()}</a>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                </>
            )
        case 'entry':
            return (
                <>
                    Entry<br/>
                    {param.value.addr && <code>{param.value.addr}</code>}
                    {param.value.addr && param.value.doc && <br/>}
                    {param.value.doc && (
                        <>
                            Doc&nbsp;
                            <a href={`ipfs://${param.value.doc}`} target="_blank">{param.value.doc.toString()}</a>
                        </>
                    )}
                </>
            )
        case 'procedure':
            return (
                <>
                    Procedure&nbsp;
                    <code>{param.value}</code>
                </>
            )
        case 'organ':
            return (
                <>
                    Organ&nbsp;
                    <code>{param.value}</code>
                </>
            )
        case 'address':
            return (
                <>
                    Address&nbsp;
                    <code>{param.value}</code>
                </>
            )
        case 'addresses':
            return (
                <>
                    Addresses<br/>
                    <ul>
                        {param.value.map((addr) => addr && (
                            <li className="list-item" key={`address-${addr}}`}>
                                <code>{addr}</code>
                            </li>
                        ))}
                    </ul>
                </>
            )
        case 'index':
            return (
                <>
                    Index&nbsp;
                    {param.value.toString()}
                </>
            )
        case 'indexes':
            return (
                <>
                    Indexes<br/>
                    <ul>
                        {param.value.map((index) => index && (
                            <li className="list-item" key={`index-${index}}`}>
                                {index.toString()}
                            </li>
                        ))}
                    </ul>
                </>
            )
        case 'permissions':
            return (
                <>
                    Permissions&nbsp;
                    <code>{param.value.toString()}</code>
                </>
            )
        default:
            return (
                <span className="text-danger">Unknown parameter type.</span>
            )
    }
}

export const ProposalOperationParams = ({ operation }) => (
    <div>
        {operation.params.map((param, i) => (
            <div key={`param-${i}`}>
                <ProposalOperationParam param={param} />
            </div>
        ))}
    </div>
)

export const ProposalOperation = ({ proposal, operation }) => {
    return (
        <>
            {["addProcedure", "addEntries"].indexOf(operation.function.key) < 0 &&
                <pre>{JSON.stringify(operation, null, 2)}</pre>
            }
            {operation.functionSelector ?
                <strong>{operation.index} - <code>{operation.function.label}</code> on organ <code>{operation.organ}</code></strong>
                : <span className="text-danger">Operation not recognized.</span>
            }
            {operation.params && <ProposalOperationParams operation={operation} />}
            <div><label>Processed?</label>&nbsp;<span>{operation.processed?"Yes":"No"}</span><br/></div>
        </>
    )
}

export const ProposalOperations = ({ proposal }) => {
    return (
        <div className="proposal-operations list-group my-1">
            {proposal.operations.map(po => po && (
                <div
                    className={`proposal-operation list-group-item`}
                    key={`proposal-operation-${po.index}`}
                >
                    <ProposalOperation proposal={proposal} operation={po} />
                </div>
            ))}
        </div>
    )
}