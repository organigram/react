import React from 'react'
import { Web3Provider } from './web3'
import { IPFSProvider } from './ipfs'
import { ContractsProvider } from './contracts'
import { OrganigramProvider } from './organigram'
import { VaultProvider } from './vault'

export const OrganigramClientProvider = ({ children }) => {
    return (
        <Web3Provider>
            <IPFSProvider>
                <OrganigramProvider address={"0x410A0A26EB521739B034Af716351C3C7a5204BD9"}>
                    <ContractsProvider>
                        <VaultProvider>
                                {children}
                        </VaultProvider>
                    </ContractsProvider>
                </OrganigramProvider>
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