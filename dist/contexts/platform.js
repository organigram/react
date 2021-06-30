function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React from 'react';
import { EMPTY_CID, Organ, Organigram, web3 } from '@organigram/client-js';
import { getAccount } from '@organigram/client-js/dist/web3';
import { useWeb3 } from './web3';
export const PlatformContext = /*#__PURE__*/React.createContext({
  platform: {
    network: "",
    manager: "",
    keyserver: ""
  },
  network: null,
  manager: null,
  keyserver: null,
  isConnected: false,
  setPlatform: async () => {},
  detectNetworkPlatform: async () => {},
  createKeyserver: async () => {},
  createOrgan: async () => {},
  createProcedure: async () => {}
});
export const PlatformProvider = ({
  platforms,
  ...props
}) => {
  const {
    network: web3Network
  } = useWeb3(); // Default platform is rinkeby.

  const [platform, setPlatform] = React.useState(platforms && platforms[0]);
  const network = React.useMemo(() => ({
    key: platform?.network,
    isConnected: web3Network && platform?.network && web3Network === platform.network
  }), [platform?.network, web3Network]);
  const [manager, setManager] = React.useState();
  const [keyserver, setKeyserver] = React.useState(); // Load organigram manager.

  React.useEffect(() => {
    if (platform?.manager && network?.isConnected) {
      // manager is an Organigram object.
      Organigram.load(platform.manager).catch(error => {
        console.error("Error while loading contracts manager.", error.message);
        return null;
      }).then(data => {
        setManager(data);
      });
    }
  }, [platform?.manager, network?.isConnected]); // Load keyserver organ.

  React.useEffect(() => {
    if (network?.isConnected) {
      Organ.load(platform.keyserver).catch(error => {
        console.error("Error while loading keyserver organ.", error.message);
        return null;
      }).then(data => setKeyserver(data));
    }
  }, [platform?.keyserver, network?.isConnected]);

  const createKeyserver = async () => {
    if (keyserver) throw new Error("Keyserver already exists.");
    if (!manager) throw new Error("Organigram not loaded.");
    const account = await getAccount();
    if (!account) throw new Error("Not connected to Ethereum.");

    const _keyserver = await manager.createOrgan(EMPTY_CID, account);

    setKeyserver(_keyserver);
  };

  const createOrgan = async metadata_cid => {
    if (!manager) throw new Error("Organigram not loaded.");
    const account = await getAccount();
    if (!account) throw new Error("Not connected to Ethereum.");
    return manager.createOrgan(metadata_cid);
  };

  const createProcedure = async (type, metadata_cid, proposers, moderations, deciders, withModeration, ...args) => {
    if (!manager) throw new Error("Organigram not loaded.");
    if (manager.procedureTypes?.find(pt => pt.key === type)) throw new Error("Procedure type not registered.");
    const account = await getAccount();
    if (!account) throw new Error("Not connected to Ethereum.");
    return await manager.createProcedure(type, metadata_cid, proposers, moderations, deciders, withModeration, ...args);
  };

  const detectNetworkPlatform = async () => {
    // When switching network, find an appropriate configuration.
    // If current web3 network is not the same as the current platform.
    if (web3Network && web3Network !== platform?.network) {
      // @todo : Allow matching platform by hash of (network, manager, keyserver).
      const match = platforms && platforms.find(p => p.network === web3Network);

      if (match) {
        // Switch platform to 
        setPlatform(match);
      }
    }
  }; // @todo : Switch platform from workspace object.


  React.useEffect(() => {
    detectNetworkPlatform();
  }, [web3Network, platforms]);
  return /*#__PURE__*/React.createElement(PlatformContext.Provider, _extends({}, props, {
    value: {
      platform,
      network,
      manager,
      keyserver,
      isConnected: !!(network?.isConnected && manager?.address),
      setPlatform,
      detectNetworkPlatform,
      createKeyserver,
      createOrgan,
      createProcedure
    }
  }));
};
export const usePlatform = () => React.useContext(PlatformContext);