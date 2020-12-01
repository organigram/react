import React from 'react'
import { Procedure } from '@organigram/client-js'

export const ProcedureContext = React.createContext({
    procedure: null,
    loading: false,
    error: null,
    load: () => {}
})

export const ProcedureProvider = ({ address, children }) => {
    const [procedure, setProcedure] = React.useState(null)
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState(null)

    const load = () => {
        setError(null)
        setLoading(true)
        Procedure.load(address)
        .then(data => setProcedure(data))
        .catch(error => {
            console.error("Error loading procedure ", address, error.message)
            setProcedure(null)
            setError(error)
        })
        .finally(() => setLoading(false))
    }

    // Initial load.
    React.useEffect(() => { load() }, [])

    return (
        <ProcedureContext.Provider value={{ procedure, loading, error, load }}>
            {children}
        </ProcedureContext.Provider>
    )
}

export const useProcedure = () => React.useContext(ProcedureContext)

export const withProcedureProvider = ComposedComponent =>
    ({ address, ...props }) => (
        <ProcedureProvider address={address}>
            <ComposedComponent {...props} />
        </ProcedureProvider>
    )