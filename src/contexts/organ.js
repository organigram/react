import React from 'react'
import { Organ } from '@organigram/client-js'

export const OrganContext = React.createContext({
    organ: null,
    loading: false,
    error: null,
    load: () => {},
    reloadEntries: async () => {},
    reloadProcedures: async () => {},
    reloadMetadata: async () => {}
})

export const OrganProvider = ({ organ, address, children }) => {
    // @todo Use a cache stored in useOrganigramClient (required) for organs & procedures sync.
    const [_organ, setOrgan] = React.useState(organ || null)
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState(null)

    const load = () => {
        if (address || organ.address) {
            setError(null)
            setLoading(true)
            Organ.load(address)
            .then(data => setOrgan(data))
            .catch(error => {
                console.error("Error loading organ ", address, error.message)
                setOrgan(null)
                setError(error)
            })
            .finally(() => setLoading(false))
        }
    }

    const reloadEntries = React.useCallback(() => {
        if (_organ.address && _organ.reloadEntries)
            _organ.reloadEntries()
            .then(o => setOrgan(_prev => o))
    }, [_organ.address, _organ.reloadEntries])

    const reloadMetadata = React.useCallback(() => {
        if (_organ.address && _organ.reloadMetadata)
            _organ.reloadMetadata()
            .then(o => setOrgan(_prev => o))
    }, [_organ.address, _organ.reloadMetadata])

    const reloadProcedures = React.useCallback(() => {
        if (_organ.address && _organ.reloadProcedures)
            _organ.reloadProcedures()
            .then(o => setOrgan(_prev => o))
    }, [_organ.address, _organ.reloadProcedures])

    // Initial load.
    React.useEffect(() => {
        if (!organ && address)
            load()
    }, [])

    return (
        <OrganContext.Provider value={{
            organ: _organ,
            loading,
            error,
            load,
            reloadEntries,
            reloadProcedures,
            reloadMetadata
        }}>
            {children}
        </OrganContext.Provider>
    )
}

export const useOrgan = () => React.useContext(OrganContext)

export const withOrganProvider = ComposedComponent =>
    ({ organ, address, ...props }) => (
        <OrganProvider organ={organ} address={address}>
            <ComposedComponent {...props} />
        </OrganProvider>
    )