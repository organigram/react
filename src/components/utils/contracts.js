export const ContractsAlert = () => {
    const { 
        contracts,
        libraries,
        registerLibrary,
        deployLibrary
    } = useContracts()
    return (
        <pre>{JSON.stringify({ contracts, libraries }, null, 2)}</pre>
    )
}