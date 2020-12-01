import React from 'react'
import { Web3Provider } from './web3'
import { IPFSProvider } from './ipfs'
import { ContractsProvider } from './contracts'
import { VaultProvider } from './vault'

export const OrganigramClientProvider = ({ children }) => {
    return (
        <Web3Provider>
            <IPFSProvider>
                <ContractsProvider>
                    <VaultProvider>
                        {children}
                    </VaultProvider>
                </ContractsProvider>
            </IPFSProvider>
        </Web3Provider>
    )
}

export const withOrganigramClientProvider = ComposedComponent =>
    props => (
        <OrganigramClientProvider>
            <ComposedComponent {...props} />
        </OrganigramClientProvider>
    )

export default OrganigramClientProvider