import React from 'react';
import { ipfsNode } from "@organigram/client-js";
export { cidToMultihash, multihashToCid } from "@organigram/client-js";
export const IPFSContext = /*#__PURE__*/React.createContext({
  ipfs: null
});
export const IPFSProvider = ({
  children
}) => {
  const [ipfs, setIpfs] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    setLoading(true);
    Promise.resolve(ipfsNode).then(ipfs => setIpfs(ipfs)).catch(error => console.error(error.message)).finally(() => setLoading(false));
  }, []);
  return /*#__PURE__*/React.createElement(IPFSContext.Provider, {
    value: {
      ipfs,
      loading
    }
  }, children);
};
export const useIPFS = () => React.useContext(IPFSContext);