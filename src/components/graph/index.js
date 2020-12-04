import organ from '@organigram/client-js/dist/organ'
import React from 'react'
import { useGraph, withGraphProvider } from "../../contexts/graph"
import Organ from "../organ"
import Procedure from "../procedure"

export const Graph = props => {
    const { graph, loading, error, addContracts, removeContracts } = useGraph()
    const contracts = graph && [
        ...graph.organs.map(({ address }) => address),
        ...graph.procedures.map(({ address }) => address)
    ]
    return (
        <div {...props}>
            {loading && <div className="alert alert-info">Loading graph...</div>}
            {error && <div className="alert alert-danger">Error: <pre>{JSON.stringify(error, null, 2)}</pre></div>}
            {graph && (
                <div className="graph">
                    <h2>Contracts</h2>
                    <div>
                        <ul className="list-unstyled">
                            {contracts.map(address => (
                                <li key={address} className="list-item">
                                    {address} <span onClick={() => removeContracts([address])} className="text-danger">x</span>
                                </li>
                            ))}
                        </ul>
                        <form className="form" onSubmit={e =>{
                            e.preventDefault()
                            addContracts([e.currentTarget.address.value])
                        }}>
                            <input type="text" name="address" placeholder="address" />
                            <button type="submit" className="btn btn-warning">Add Contract</button>
                        </form>
                    </div>
                    <h2>Organs</h2>
                    <ul className="list-unstyled">
                        {graph.organs.map(o => <li key={o.address} className="list-item mb-3"><Organ organ={o} /></li>)}
                    </ul>
                    <h2>Procedures</h2>
                    <ul className="list-unstyled">
                        {graph.procedures.map(p => <li key={p.address} className="list-item mb-3"><Procedure procedure={p} /></li>)}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default withGraphProvider(Graph)

export const ContractSelector = ({ contracts, onSelect }) => {
    const handleChange = (event) => {
        const contract = contracts.find(c => c.address === event.target.value)
        if (contract) onSelect(contract)
    }
    return (
        <select onChange={handleChange} className="form-control">
            <option value="">-- Select a contract</option>
            {contracts.map(c =>
                <option key={c.address} value={c.address}>{c.address}</option>
            )}
        </select>
    )
}
