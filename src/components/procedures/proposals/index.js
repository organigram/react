import React from 'react'
import { useProcedure } from '../../../contexts/procedure'
import { ProposalOperations } from './operations'
import {
    ProposalFormCreate,
    ProposalFormAddEntries,
    ProposalFormRemoveEntry,
    ProposalFormReplaceEntry,
    ProposalFormAddProcedure,
    ProposalFormRemoveProcedure,
    ProposalFormReplaceProcedure,
    ProposalFormCall
} from './forms'

export const Proposal = ({ proposal }) => {
    const { procedure: { type }, reloadProposal } = useProcedure()
    const [showForms, setShowForms] = React.useState(false)
    const toggleForms = () => setShowForms(sf => !sf)
    const [ProposalComponent, setProposalComponent] = React.useState()
    React.useEffect(async () => {
        if (type)
            switch(type) {
                case '0xc5f28e49': // Nomination.
                    setProposalComponent(React.lazy(() => import('../nomination/proposal')))
                    break
                case '0xc9d27afe': // Vote.
                    setProposalComponent(React.lazy(() => import('../vote/proposal')))
                    break
                default:
                    setProposalComponent()
                    break
            }
    }, [type])

    return (
        <div className={`procedure-proposal`}>
            <div className="row">
                <div className="col"><h5 className="text-muted">{proposal.key}</h5></div>
                <div className="col text-center">{proposal.applied && <strong>Enacted</strong>}</div>
                <div className="col text-right">
                    <button onClick={() => reloadProposal(proposal.key)} className="btn btn-sm">reload</button>
                </div>
            </div>
            <div>
                Creator: <code>{proposal.creator}</code><br/>
                Presented? <code>{proposal.presented ? "true" : "false"}</code><br/>
                Adopted? <code>{proposal.adopted ? "true" : "false"}</code><br/>
                Enacted? <code>{proposal.applied ? "true" : "false"}</code><br/>
                Metadata: <code>{`${proposal.metadata}`}</code> <a href={`ipfs://${proposal.metadata}`} target="_blank">view</a><br/>
                <ProposalOperations proposal={proposal} />
            </div>
            {proposal.locked && (
                <React.Suspense fallback={<p>Loading...</p>}>
                    {ProposalComponent && <ProposalComponent proposal={proposal} />}
                </React.Suspense>
            )}
            <hr/>
            <button className="btn btn-sm" onClick={() => toggleForms()}>toggle forms</button>
            {showForms && (
                <>
                    <ProposalFormAddEntries proposal={proposal} />
                    <hr/>
                    <ProposalFormRemoveEntry proposal={proposal} />
                    <hr/>
                    <ProposalFormReplaceEntry proposal={proposal} />
                    <hr/>
                    <ProposalFormAddProcedure proposal={proposal} />
                    <hr/>
                    <ProposalFormRemoveProcedure proposal={proposal} />
                    <hr/>
                    <ProposalFormReplaceProcedure proposal={proposal} />
                    <hr/>
                    <ProposalFormCall proposal={proposal} />
                </>
            )}
        </div>
    )
}

export const Proposals = () => {
    const { procedure: { proposals, propose } } = useProcedure()
    const [currentProposal, setCurrentProposal] = React.useState()
    return (
        <div className="row">
            <div className="col-2">
                <ul>
                    <li key="none" onClick={() => setCurrentProposal(null)}>New</li>
                    {proposals && proposals.map(proposal => (
                        <li key={`proposal-${proposal.key}`} onClick={() => setCurrentProposal(proposal)}>
                            <span className={`text-${proposal.applied?"success":"default"}`}>{`${proposal.key}`}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="col-10">
                <div className={`card card-body ${currentProposal && currentProposal.applied && "bg-success"}`}>
                    {currentProposal ?
                        <Proposal proposal={currentProposal} />
                        : <ProposalFormCreate />
                    }
                </div>
            </div>
        </div>
    )
}