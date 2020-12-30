import React, { useState } from 'react'
import { Graph } from '@organigram/client-js'
import { useWeb3 } from './web3'

export const GraphContext = React.createContext({
    graph: null,
    loading: false,
    error: null,
    load: async () => {},
    addContracts: async () => {},
    removeContracts: async () => {}
})

export const GraphProvider = ({ contracts, children }) => {
    const { network } = useWeb3()
    const [graph, setGraph] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const load = () => {
        setError(null)
        setLoading(true)
        Graph.load(contracts)
        .then(data => setGraph(data))
        .catch(error => {
            console.error("Error loading graph ", contracts, error.message)
            setGraph(null)
            setError(error)
        })
        .finally(() => setLoading(false))
    }

    const addContracts = React.useCallback(async contracts => {
        if (graph)
            graph.addContracts(contracts)
            .then(ng => setGraph(og => ng))
            .catch(error => {
                console.error("Error adding contracts to graph.", contracts, error.message)
                setError(error.message)
            })
    }, [graph])

    const removeContracts = React.useCallback(async contracts => {
        if (graph)
            graph.removeContracts(contracts)
            .then(ng => setGraph(og => ng))
            .catch(error => {
                console.error("Error removing contracts from graph.", contracts, error.message)
                setError(error.message)
            })
    }, [graph])

    // Initial load.
    React.useEffect(() => { load() }, [network])

    return (
        <GraphContext.Provider value={{
            graph,
            loading,
            error,
            load,
            addContracts,
            removeContracts
        }}>
            {children}
        </GraphContext.Provider>
    )
}

export const useGraph = () => React.useContext(GraphContext)

export const withGraphProvider = ComposedComponent =>
    ({ contracts, ...props }) => {
        return (
            <GraphProvider contracts={contracts}>
                <ComposedComponent {...props} />
            </GraphProvider>
        )
    }