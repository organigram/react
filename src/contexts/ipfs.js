import React from 'react'
import { ipfsNode } from "@organigram/client-js"
export { cidToMultihash, multihashToCid } from "@organigram/client-js"

export const IPFSContext = React.createContext({ ipfs: null })

export const IPFSProvider = ({ children }) => {
    const [ipfs, setIpfs] = React.useState(null)
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        setLoading(true)
        Promise.resolve(ipfsNode)
        .then(ipfs => setIpfs(ipfs))
        .catch(error => console.error(error.message))
        .finally(() => setLoading(false))
    }, [])

    return (
        <IPFSContext.Provider value={{ ipfs, loading }}>
            {children}
        </IPFSContext.Provider>
    )
}

export const useIPFS = () => React.useContext(IPFSContext)