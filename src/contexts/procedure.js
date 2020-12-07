import React from 'react'
import { Procedure } from '@organigram/client-js'

export const ProcedureContext = React.createContext({
    procedure: null,
    loading: false,
    error: null,
    load: async () => {},
    reloadMoves: async () => {},
    reloadMetadata: async () => {},
    reloadMove: async key => {}
})

export const ProcedureProvider = ({ procedure, address, children }) => {
    const [_procedure, setProcedure] = React.useState(procedure || null)
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState(null)

    const load = () => {
        if (address || procedure.address) {
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
    }

    // Initial load.
    React.useEffect(() => {
        if (!procedure && address)
            load()
    }, [])

    const reloadMoves = React.useCallback(async () => {
        if (_procedure.address && _procedure.reloadMoves)
            _procedure.reloadMoves()
            .then(p => setProcedure(_prev => p))
    }, [_procedure])

    const reloadMetadata = React.useCallback(async () => {
        if (_procedure && _procedure.reloadMoves)
            _procedure.reloadMetadata()
            .then(p => setProcedure(_prev => p))
    }, [_procedure])

    const reloadMove = React.useCallback(async (moveKey) => {
        if (_procedure && _procedure.reloadMoves)
            _procedure.reloadMove(moveKey)
            .then(p => setProcedure(_prev => p))
    }, [_procedure])

    return (
        <ProcedureContext.Provider value={{
            procedure: _procedure,
            loading,
            error,
            load,
            reloadMoves,
            reloadMetadata,
            reloadMove
        }}>
            {children}
        </ProcedureContext.Provider>
    )
}

export const useProcedure = () => React.useContext(ProcedureContext)

export const withProcedureProvider = ComposedComponent =>
    ({ procedure, address, ...props }) => (
        <ProcedureProvider procedure={procedure} address={address}>
            <ComposedComponent {...props} />
        </ProcedureProvider>
    )