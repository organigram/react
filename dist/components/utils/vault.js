import { useVault } from "../../contexts/vault";
export const VaultAlert = () => {
  const vault = useVault();
  return /*#__PURE__*/React.createElement("pre", null, JSON.stringify(vault, null, 2));
};