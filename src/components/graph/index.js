import React from 'react'
import { useGraph, withGraphProvider } from "../../contexts/graph"
import Organ from "../organ"
import Procedure from "../procedure"

export const Graph = props => {
    const { graph, loading, error } = useGraph()
    return (
        <div {...props}>
            {loading && <p>Loading graph...</p>}
            {error && <p>Error: <pre>{JSON.stringify(error, null, 2)}</pre></p>}
            {graph && (
                <div className="graph">
                    <h3>Organs</h3>
                    <ul>
                        {graph.organs.map(o => <li key={o.address}><Organ address={o.address} /></li>)}
                    </ul>
                    <h3>Procedures</h3>
                    <ul>
                        {graph.procedures.map(p => <li key={p.address}><Procedure address={p.address} /></li>)}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default withGraphProvider(Graph)