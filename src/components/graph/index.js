import React from 'react'
import { useGraph, withGraphProvider } from "../../contexts/graph"
import Organ from "../organ"
import Procedure from "../procedures"
import Contracts from "./contracts"

export const Graph = props => {
    const { graph, loading, error } = useGraph()
    return (
        <div {...props}>
            {loading && <div className="alert alert-info">Loading graph...</div>}
            {error && <div className="alert alert-danger">Error: <pre>{JSON.stringify(error, null, 2)}</pre></div>}
            {graph && (
                <div className="graph">
                    <div className="card card-body bg-secondary">
                        <Contracts />
                    </div>
                    <div className="card-stack">
                        <div className="card card-body bg-dark">
                            <h3>Organs</h3>
                            <ul className="list-unstyled row">
                                {graph.organs.map(o => (
                                    <li key={o.address} className="col-4 mb-2">
                                        <Organ organ={o} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="card card-body bg-dark">
                            <h3 className="card-title">Procedures</h3>
                            <ul className="list-unstyled">
                                {graph.procedures.map(p => (
                                    <li key={p.address} className="list-item mb-2">
                                        <Procedure procedure={p} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default withGraphProvider(Graph)
