import React, { useState } from 'react'
import { ProcedureNomination, ProcedureVote } from '@organigram/client-js'
import { OrganEntryForm, OrganEntrySelector, OrganProcedureForm, OrganProcedureSelector } from '../organ'
import { useProcedure, withProcedureProvider } from "../../contexts/procedure"
import { useGraph } from "../../contexts/graph"
import { ContractSelector } from '../graph/contracts'
import graph from '@organigram/client-js/dist/graph'
import { ProposalOperations } from './proposals/operations'
import { Proposals } from './proposals'

export const Procedure = props => {
    const { graph } = useGraph()
    const { procedure, loading, error, reloadData, reloadProposals } = useProcedure()
    const [ProcedureComponent, setProcedureComponent] = useState()

    React.useEffect(async () => {
        if (procedure)
            if (procedure instanceof ProcedureNomination)
                setProcedureComponent(React.lazy(() => import('./nomination/procedure')))
            else if (procedure instanceof ProcedureVote)
                setProcedureComponent(React.lazy(() => import('./vote/procedure')))
            else
                setProcedureComponent()
    }, [procedure])

    // @todo : Explain this.
    if (!procedure) {
        return loading ?
            (props.loading || <p className="text-info">Loading.</p>)
            : (props.not_found || <p className="text-danger">Procedure not found.</p>)
    }
    
    const targetOrgans = React.useMemo(
        () => graph.organs.filter(o => o.procedures.find(op => op.address === procedure.address)),
        [graph.organs, procedure.address]
    )

    return (
        <div id={procedure.address && `procedure-${procedure.address}`}>
            {loading && <p>Loading.</p>}
            {error && <pre>Error: {JSON.stringify(error, null, 2)}</pre>}
            {procedure && procedure.type && ProcedureComponent && (
                <div className="procedure card card-body bg-secondary">
                    {procedure.metadata && procedure.metadata.data && procedure.metadata.data.name && <h5 className="card-title">{`${procedure.metadata.data.name}`}</h5>}
                    <code>{`${procedure.address}`}</code>
                    <p>{`${procedure.type.label}`}</p>
                    <React.Suspense fallback={<p>Loading...</p>}>
                        <ProcedureComponent {...props} />
                    </React.Suspense>
                    <div>
                        <div>Proposers: <a href={`#organ-${procedure.proposers}`}>{procedure.proposers}</a></div>
                        <div>Moderators: <a href={`#organ-${procedure.moderators}`}>{procedure.moderators}</a></div>
                        <div>Deciders: <a href={`#organ-${procedure.deciders}`}>{procedure.deciders}</a></div>
                        <div>
                            Target organs:
                            <ul>
                                {targetOrgans.map(to => (
                                    <li key={`target-organ-${to.address}`}>
                                        <a href={`#organ-${to.address}`}>{to.address}</a>
                                        &nbsp;
                                        <code>{to.procedures.find(top => top.address === procedure.address).permissions.toString()}</code>
                                    </li>                                     
                                ))}
                            </ul>
                        </div>
                    </div>
                    <u><em>Metadata</em></u>
                    <div>
                        <button onClick={() => reloadData()} className="btn btn-sm">reload</button>
                        <p><code>{`${procedure.metadata}`}</code> <a href={`ipfs://${procedure.metadata}`} target="_blank">view</a></p>
                    </div>
                    <u><em>Proposals</em></u>
                    <div>
                        <button onClick={() => reloadProposals()} className="btn btn-sm">reload</button>
                        <Proposals />
                    </div>
                </div>
            )}
        </div>
    )
}

export default withProcedureProvider(Procedure)