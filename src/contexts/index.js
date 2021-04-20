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
                <OrganigramProvider address={"0xAE49EE4B38155348F9f6B8CD823d905Ccfe13109"}>
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