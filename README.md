# Organigram Client for React dApps
version 1.0

## Usage
```jsx
    import {
        // Wrap your app with the Client provider.
        // Also see its HOC withOrganigramClientProvider(platforms)(MyApp).
        OrganigramClientProvider,
        // Logic hooks.
        useWeb3,    // Access Web3, account, network...
        useIPFS,    // Pin, cat, add files to IPFS.
        usePlatform,// Switch platform manager or keyserver.
        useVault,   // Encrypt and share files on IPFS.
        // Provide data to UI components
        // Also see its HOC withGraphProvider(MyGraph).
        GraphProvider,
        // UI hooks.
        useGraph,   // Control graph of organs and procedures.
        useOrgan,   // Interact with the provided organ.
        useProcedure, // Interact with the provided procedure.
        useOrgan,   // Interact with an organ provided.
    } from '@organigram/client-react'
    ...
    const MyApp = () => {
        const { isConnected } = usePlatform()
        if (!isConnected)
            return <p>Loading...</p>
        return (
            <GraphProvider
                contracts={[
                    "0xeC576D1Cd40673b5Ad607bA3771Eb992AF243E26", // admins
                    "0x6b8c5ce9B2013Eb2dc4f38268805d985F4b01186", // norms
                    "0xb47321c4E1D4C5daD2584630dF302fF79910237a", // nominateAdmins
                    "0xceE9dffCB940f8C9a61070a2b827CF49F51Fd672", // voteNorms
                    "0x00Df9aF0a46DE7ad3c803d1480087a6Ba546a2E1"  // updateSystem
                ]}
            >
                {/* Your UI components here */}
            </GraphProvider>
        )
    }
    export default withOrganigramClientProvider({
        // Specify a custom platform for the management contract.
        platforms: [
            {
                network: "rinkeby",
                manager: "0x8a6b760EA52D8E00c5253C56CF2aC0D439209cFb",
                keyserver: "0x726071aF315f099baa7ee2A51b0049645648d016"
            },
        ]
    })(MyApp)
    ...
    const MyOrgan = ({ address }) => {
        const { organ, loading, error } = useOrgan(address)
        ...
    }
```
See also @organigram/client-react/src/components for more examples.