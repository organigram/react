import React, { useEffect } from 'react'
import { EMPTY_CID, CID, Organigram } from '@organigram/js'
import { useWeb3 } from './web3'
import { useIPFS } from './ipfs'

export const PlatformContext = React.createContext({
  platform: {
    network: '',
    manager: '',
    keyserver: '',
  },
  account: null,
  network: null,
  manager: null,
  keyserver: null,
  isConnected: false,
  createKeyserver: null,
  createOrgan: null,
  createProcedure: null
})

export const PlatformProvider = ({ platforms, ...props }) => {
  const { account, signer, network, networkIsValid, networkName } = useWeb3()
  const { ipfs, initIPFS } = useIPFS()
  const [_platform, _setPlatform] = React.useState()
  const [manager, setManager] = React.useState()
  const [keyserver, setKeyserver] = React.useState()

  // @todo @FIXME : Correctly fix isConnected.
  const isConnected = networkIsValid &&
    manager?.address != null &&
    manager.address !== '' &&
    network === manager.network &&
    ipfs?.isOnline() === true

  // Load organigram manager.
  React.useEffect(() => {
    void (async () => {
      let platform = _platform

      // Start IPFS
      if (ipfs == null) {
        await initIPFS(true)
      } else if (ipfs?.isOnline() === false) {
        await ipfs.start()
      }

      // @todo : Make sure IPFS is loaded?
      // if (ipfs?.isOnline() !== true) {
      //   return undefined
      // }

      // Platform not loaded yet.
      if (
        platform?.manager == null &&
        network != null &&
        network !== '' &&
        network !== platform?.network &&
        // @todo : Remove networkIsValid.
        networkIsValid
      ) {
        // When switching network, find an appropriate configuration.
        // If current web3 network is not the same as the current platform.
        // @todo : Allow matching platform by hash of (network, manager, keyserver).
        const match = platforms.find(p => p.network === network)
        // Switch platform
        if (match) {
          platform = match
          _setPlatform(platform)
        }
      } else if (network == null || network === '') {
        // Disconnecting network means unsetting the platform.
        platform = undefined
        _setPlatform(undefined)
      }

      if (
        platform?.manager != null &&
        networkIsValid &&
        network === platform.network &&
        account != null &&
        account !== '' &&
        signer != null
      ) {
        // manager is an Organigram object.
        const _manager = await Organigram.load(platform.manager, signer, ipfs)
          .catch(error => {
            console.error('Error while loading contracts manager.', error.message)
          })
        if (_manager != null) {
          window._organigram = _manager
          setManager(_manager)
          console.info(`
            ///////////////////////////////////////////////\n
            //       Organigram is ready.                //\n
            ///////////////////////////////////////////////\n
            Commands: _organigram, _ethers, _ipfs, _IPFS\n
            Manager: ${platform?.manager}\n
            Web3 connected to: ${networkName}\n
            IPFS is connected: ${ipfs?.isOnline() === true}\n
            Account: ${await signer.getAddress().catch(() => 'unknown')}\n
          `)
        }
      }
    })()

    return () => {
      window._organigram = undefined
    }
  }, [signer, network, networkIsValid, account, ipfs])

  // // Load keyserver organ.
  // React.useEffect(() => {
  //   if (network?.isConnected) {
  //     Organ.load(platform.keyserver)
  //       .catch(error => {
  //         console.warn("Error while loading keyserver organ.", error.message)
  //         return null
  //       })
  //       .then(data => setKeyserver(data))
  //   }
  // }, [platform?.keyserver, network?.isConnected])

  const createKeyserver = async () => {
    if (keyserver) { throw new Error('Keyserver already exists.') }
    const _keyserver = await this.createOrgan()
    if (_keyserver != null) { setKeyserver(_keyserver) }
    return _keyserver
  }

  const createOrgan = async (metadata_cid = EMPTY_CID) => {
    if (!manager) { throw new Error('Organigram not loaded.') }
    if (account == null || account === '') { throw new Error('Account not connected.') }
    return manager.createOrgan(CID.parse(metadata_cid), account)
  }

  const createProcedure = async (
    type,
    metadata_cid,
    proposers,
    moderations,
    deciders,
    withModeration,
    ...args
  ) => {
    if (!manager) { throw new Error('Organigram not loaded.') }
    const procedureType = manager.procedureTypes?.find(pt => pt.key === type)
    if (!procedureType?.address) { throw new Error('Procedure type not registered.') }
    return manager.createProcedure(
      procedureType.address,
      CID.parse(metadata_cid),
      proposers,
      moderations,
      deciders,
      withModeration,
      ...args
    )
  }

  const getOrgan = async (address) => {
    return manager.getOrgan(address, true)
  }

  const getProcedure = async (address) => {
    return manager.getProcedure(address, true)
  }

  return (
    <PlatformContext.Provider {...props} value={{
      account,
      signer,
      network,
      manager,
      keyserver,
      isConnected,
      // @dev deprecated
      platform: _platform,
      createKeyserver,
      createOrgan,
      createProcedure
    }} />
  )
}

export const usePlatform = () => React.useContext(PlatformContext)
