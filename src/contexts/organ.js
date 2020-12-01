import React from 'react'
import { Organ } from '@organigram/client-js'

export const OrganContext = React.createContext({
    organ: null,
    loading: false,
    error: null,
    load: () => {}
})

export const OrganProvider = ({ address, children }) => {
    // @todo WHEN useGraph is available, we can init Organ from the Graph if present.
    // @todo Use a cache stored in useOrganigramClient (required) for organs & procedures sync.
    const [organ, setOrgan] = React.useState(null)
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState(null)

    const load = () => {
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

    // Initial load.
    React.useEffect(() => { load() }, [])

    return (
        <OrganContext.Provider value={{ organ, loading, error, load }}>
            {children}
        </OrganContext.Provider>
    )
}

export const useOrgan = () => React.useContext(OrganContext)

export const withOrganProvider = ComposedComponent =>
    ({ address, ...props }) => (
        <OrganProvider address={address}>
            <ComposedComponent {...props} />
        </OrganProvider>
    )