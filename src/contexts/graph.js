import React, { useState } from 'react'
import { Graph } from '@organigram/client-js'
import { useWeb3 } from './web3'
import { useOrganigram } from './organigram'

export const GraphContext = React.createContext({
    graph: null,
    loading: false,
    error: null,
    load: async () => {},
    addContracts: async () => {},
    removeContracts: async () => {}
})

export const GraphProvider = ({ contracts, children }) => {
    const { organigram } = useOrganigram()
    const { network } = useWeb3()
    const [graph, setGraph] = useState(new Graph({ organigram }))
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const load = () => {
        setError(null)
        if (contracts) {
            setLoading(true)
            graph.addContracts(contracts)
            .catch(error => {
                console.error("Error loading graph ", contracts, error.message)
                setError(error)
                return null
            })
            .then(data => setGraph(data))
            .finally(() => setLoading(false))
        }
    }

    const addContracts = async contracts => {
        if (!graph)
            throw new Error("Graph not instantiated.")
        graph.addContracts(contracts)
        .catch(error => {
            console.error("Error adding contracts to graph.", contracts, error.message)
            setError(error.message)
            return null
        })
        .then(ng => ng && setGraph(ng))
    }

    const removeContracts = async contracts => {
        if (!graph)
            throw new Error("Graph not instantiated.")
        graph.removeContracts(contracts)
        .catch(error => {
            console.error("Error removing contracts from graph.", contracts, error.message)
            setError(error.message)
            return null
        })
        .then(ng => ng && setGraph(ng))
    }

    // Initial load.
    React.useEffect(() => { load() }, [network])

    return (
        <GraphContext.Provider
            value={{
                graph,
                loading,
                error,
                load,
                addContracts,
                removeContracts
            }}
        >
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