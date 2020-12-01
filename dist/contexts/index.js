import React from 'react';
import { Web3Provider } from './web3';
import { IPFSProvider } from './ipfs';
import { ContractsProvider } from './contracts';
import { VaultProvider } from './vault';
export const OrganigramClientProvider = ({
  children
}) => {
  return /*#__PURE__*/React.createElement(Web3Provider, null, /*#__PURE__*/React.createElement(IPFSProvider, null, /*#__PURE__*/React.createElement(ContractsProvider, null, /*#__PURE__*/React.createElement(VaultProvider, null, children))));
};
export const withOrganigramClientProvider = ComposedComponent => props => /*#__PURE__*/React.createElement(OrganigramClientProvider, null, /*#__PURE__*/React.createElement(ComposedComponent, props));
export default OrganigramClientProvider;