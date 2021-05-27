import React from 'react';
import { Web3Provider } from './web3';
import { IPFSProvider } from './ipfs';
import { PlatformProvider } from './platform';
import { VaultProvider } from './vault';
export const OrganigramClientProvider = ({
  children,
  platforms
}) => {
  return /*#__PURE__*/React.createElement(Web3Provider, null, /*#__PURE__*/React.createElement(IPFSProvider, null, /*#__PURE__*/React.createElement(PlatformProvider, {
    platforms: platforms
  }, /*#__PURE__*/React.createElement(VaultProvider, null, children))));
}; // Usage: `export default withOrganigramClientProvider({ platforms })(MyApp)`

export const withOrganigramClientProvider = ({
  platforms
}) => ComposedComponent => props => /*#__PURE__*/React.createElement(OrganigramClientProvider, {
  platforms: platforms || []
}, /*#__PURE__*/React.createElement(ComposedComponent, props));
export default OrganigramClientProvider;