import React from 'react'
import { ipfsNode } from "@organigram/client-js"
export { cidToMultihash, multihashToCid } from "@organigram/client-js"

export const IPFSContext = React.createContext({
    ipfs: null,
    loading: false,
    startIPFS: async () => Promise.reject(new Error("Not implemented")),
    stopIPFS: async () => Promise.reject(new Error("Not implemented")),
})

export const IPFSProvider = ({ children }) => {
    const [ipfs, setIpfs] = React.useState(null)
    const [loading, setLoading] = React.useState(false)

    const startIPFS = React.useCallback(() => {
        if (!loading && !ipfs) {
            setLoading(true)
            Promise.resolve(ipfsNode)
            .then(ipfs => setIpfs(ipfs))
            .catch(error => console.error(error.message))
            .finally(() => setLoading(false))
        }
    }, [ipfs, loading])

    const stopIPFS = React.useCallback(() => {
        if (ipfs) {
            ipfs.stop().catch(e => console.error(e.message))
            setIpfs(null)
        }
    }, [ipfs])

    React.useEffect(() => {
        // Start IPFS on boot.
        startIPFS()
        return () => {
            if (ipfs)
                ipfs.stop().catch(e => console.error(e.message))
        }
    }, [])

    return (
        <IPFSContext.Provider value={{ ipfs, loading, startIPFS, stopIPFS }}>
            {children}
        </IPFSContext.Provider>
    )
}

export const useIPFS = () => React.useContext(IPFSContext)