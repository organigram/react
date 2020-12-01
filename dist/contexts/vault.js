import React from 'react'; // @todo : Add OpenPGP lib.

export const VaultContext = /*#__PURE__*/React.createContext({});
export const VaultProvider = ({
  children
}) => {
  return /*#__PURE__*/React.createElement(VaultContext.Provider, {
    value: {}
  }, children);
};
export const useVault = () => React.useContext(VaultContext);