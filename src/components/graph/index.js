import React from 'react'
import { useGraph, withGraphProvider } from "../../contexts/graph"
import Organ from "../organ"
import Procedure from "../procedure"

export const Graph = props => {
    const { graph, loading, error } = useGraph()
    return (
        <div {...props}>
            <h1>Graph Explorer</h1>
            {loading && <div className="alert alert-info">Loading graph...</div>}
            {error && <div className="alert alert-danger">Error: <pre>{JSON.stringify(error, null, 2)}</pre></div>}
            {graph && (
                <div className="graph">
                    <h2>Organs</h2>
                    <ul className="list-unstyled">
                        {graph.organs.map(o => <li key={o.address} className="list-item"><Organ organ={o} /></li>)}
                    </ul>
                    <h2>Procedures</h2>
                    <ul className="list-unstyled">
                        {graph.procedures.map(p => <li key={p.address} className="list-item"><Procedure procedure={p} /></li>)}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default withGraphProvider(Graph)