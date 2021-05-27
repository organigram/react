import React from 'react'
import { Web3Provider } from './web3'
import { IPFSProvider } from './ipfs'
import { PlatformProvider } from './platform'
import { VaultProvider } from './vault'

export const OrganigramClientProvider = ({ children, platforms }) => {
    return (
        <Web3Provider>
            <IPFSProvider>
                <PlatformProvider platforms={platforms}>
                    <VaultProvider>
                        {children}
                    </VaultProvider>
                </PlatformProvider>
            </IPFSProvider>
        </Web3Provider>
    )
}

// Usage: `export default withOrganigramClientProvider({ platforms })(MyApp)`
export const withOrganigramClientProvider = ({ platforms }) =>
    ComposedComponent => 
        props => (
            <OrganigramClientProvider platforms={platforms || []}>
                <ComposedComponent {...props} />
            </OrganigramClientProvider>
        )

export default OrganigramClientProvider