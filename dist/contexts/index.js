import React from 'react';
import { Web3Provider } from './web3';
import { IPFSProvider } from './ipfs';
import { ContractsProvider } from './contracts';
import { PlatformProvider } from './platform';
import { VaultProvider } from './vault';
export const OrganigramClientProvider = ({
  children,
  defaultPlatforms
}) => {
  return /*#__PURE__*/React.createElement(Web3Provider, null, /*#__PURE__*/React.createElement(IPFSProvider, null, /*#__PURE__*/React.createElement(PlatformProvider, {
    platforms: defaultPlatforms
  }, /*#__PURE__*/React.createElement(VaultProvider, null, children))));
}; // Usage: `export default withOrganigramClientProvider(platforms)(MyApp)`

export const withOrganigramClientProvider = defaultPlatforms => ComposedComponent => props => /*#__PURE__*/React.createElement(OrganigramClientProvider, {
  defaultPlatforms: defaultPlatforms
}, /*#__PURE__*/React.createElement(ComposedComponent, props));
export default OrganigramClientProvider;