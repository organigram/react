import React from 'react'
import { Web3Provider } from './web3'
import { IPFSProvider } from './ipfs'
import { ContractsProvider } from './contracts'
import { PlatformProvider } from './platform'
import { VaultProvider } from './vault'

export const OrganigramClientProvider = ({ children, defaultPlatforms }) => {
    return (
        <Web3Provider>
            <IPFSProvider>
                <PlatformProvider platforms={defaultPlatforms}>
                    <VaultProvider>
                        {children}
                    </VaultProvider>
                </PlatformProvider>
            </IPFSProvider>
        </Web3Provider>
    )
}

// Usage: `export default withOrganigramClientProvider(platforms)(MyApp)`
export const withOrganigramClientProvider = defaultPlatforms =>
    ComposedComponent => 
        props => (
            <OrganigramClientProvider defaultPlatforms={defaultPlatforms}>
                <ComposedComponent {...props} />
            </OrganigramClientProvider>
        )

export default OrganigramClientProvider