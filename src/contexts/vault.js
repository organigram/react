import React from 'react'
// @todo : Add OpenPGP lib.

export const VaultContext = React.createContext({})

export const VaultProvider = ({ children }) => {
    return (
        <VaultContext.Provider value={{}}>
            {children}
        </VaultContext.Provider>
    )
}

export const useVault = () => React.useContext(VaultContext)