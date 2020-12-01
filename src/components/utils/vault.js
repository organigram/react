import { useVault } from "../../contexts/vault"

export const VaultAlert = () => {
    const vault = useVault()
    return (
        <pre>{JSON.stringify(vault, null, 2)}</pre>
    )
}