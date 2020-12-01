import React from 'react'
import { useWeb3 } from "./web3"

export const ContractsContext = React.createContext({
    contracts: {},  // Stores ABI & Bytecode.
    libraries: {},  // Stores Contract instances of libraries.
    registerLibrary: async (_library, _address) => {},  // Registers a library from an address.
    deployLibrary: async _library => {},    // Deploys and registers a missing library.
    deployOrgan: async _organ => {},        // Deploys an organ, returns a Contract on success.
    deployProcedure: async _procedure => {} // Deploys a procedure, returns a Contract on success.
})

export const ContractsProvider = ({ children }) => {
    const { web3, network } = useWeb3()
    const [contracts, setContracts] = React.useState({})
    const [libraries, setLibraries] = React.useState({})

    const registerLibrary = React.useCallback(async (library, address) => {
        if (libraries[library].address)
            throw new Error("Library already available.")
        
        const { abi } = fetchLibraryData(library)
        const Library = await web3.eth.Contract(abi)
        const contract = await Library.at(address)
        setLibraries(libs => ({
            ...libs,
            [library]: contract
        }))
    }, [libraries])

    const deployLibrary = React.useCallback(async library => {
        if (libraries[library].address)
            throw new Error("Library already available.")

        const { abi, bytecode } = await fetchLibraryData(library)
        if (!abi || !bytecode)
            throw new Error("Missing data necessary for library deployment.")

        const Library = await web3.eth.Contract(abi)
        const contract = await Library.deploy(bytecode)
        setLibraries(libs => ({
            ...libs,
            [library]: contract
        }))
    }, [libraries])

    const deployOrgan = React.useCallback(async () => {
        throw new Error("Not implemented.")
    }, [contracts, libraries['organ']])

    const deployProcedure = React.useCallback(async () => {
        throw new Error("Not implemented.")
    }, [contracts, libraries['procedure']])

    // Update context data on network change.
    React.useEffect(() => {
        setContracts({})
        setLibraries({})
    }, [network])

    return (
        <ContractsContext.Provider value={{
            contracts,
            libraries,
            registerLibrary,
            deployLibrary,
            deployOrgan,
            deployProcedure
        }}>
            {children}
        </ContractsContext.Provider>
    )
}

export const useContracts = () => React.useContext(ContractsContext)