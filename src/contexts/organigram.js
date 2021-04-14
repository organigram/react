import React from 'react'
import { Organigram } from '@organigram/client-js'

export const OrganigramContext = React.createContext({
    organigram: null,
    loading: false,
    error: null,
    createOrgan: async () => Promise.reject(new Error("Not implemented.")),
    createProcedure: async () => Promise.reject(new Error("Not implemented."))
})

export const OrganigramProvider = ({ address, children }) => {
    const [organigram, setOrganigram] = React.useState(null)
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState(null)

    const load = () => {
        const _address = organigram ? organigram.address : address
        if (_address) {
            setError(null)
            setLoading(true)
            Organigram.load(_address)
            .catch(error => {
                console.error("Error loading organigram contract", _address, error.message)
                setOrganigram(null)
                setError(error)
                return null
            })
            .then(data => setOrganigram(data))
            .finally(() => setLoading(false))
        }
    }

    // Initial load.
    React.useEffect(() => {
        if (!organigram && address)
            load()
    }, [])

    const createOrgan = async (metadata) => {
        if (!organigram)
            throw new Error("Organigram client not found.")
        return organigram.createOrgan(metadata)
    }

    const createProcedure = async (...args) => {
        if (!organigram)
            throw new Error("Organigram client not found.")
        return organigram.createProcedure(...args)
    }

    if (!organigram && loading)
        return <p>Loading...</p>

    return (
        <OrganigramContext.Provider
            value={{
                organigram,
                loading,
                error,
                load,
                createOrgan,
                createProcedure
            }}
        >
            {children}
        </OrganigramContext.Provider>
    )
}

export const useOrganigram = () => React.useContext(OrganigramContext)