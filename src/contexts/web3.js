import React, { useState } from 'react'
import { getNetworkName, ethers } from '@organigram/js'

export const ETHEREUM_TIMER_DELAY = 2500
export const ETHEREUM_UNKNOWN = 'ETHEREUM_UNKNOWN'
export const ETHEREUM_UNAVAILABLE = 'ETHEREUM_UNAVAILABLE'
export const ETHEREUM_LOCKED = 'ETHEREUM_LOCKED'
export const ETHEREUM_UNLOCKED = 'ETHEREUM_UNLOCKED'
export const ETHEREUM_NETWORK_ID_MAINNET = '1'
export const ETHEREUM_NETWORK_ID_MORDEN = '2'
export const ETHEREUM_NETWORK_ID_ROPSTEN = '3'
export const ETHEREUM_NETWORK_ID_RINKEBY = '4'
export const ETHEREUM_NETWORK_ID_GOERLI = '5'
export const ETHEREUM_NETWORK_ID_KOVAN = '42'
export const ETHEREUM_NETWORK_ID_LOCAL = '1337'

export const Web3Context = React.createContext({
  account: '',
  network: '',
  networkName: '',
  networkIsValid: false,
  balance: null,
  status: ETHEREUM_UNKNOWN,
  signer: null,
  provider: null,
  ecRecover: null,
  sign: null,
  connect: null,
  setProvider: () => {}
})

export const useWeb3 = () => React.useContext(Web3Context)

export const useSigner = () => React.useContext(Web3Context).signer

export const withWeb3 = ComposedComponent =>
  props => <ComposedComponent {...props} web3={useWeb3()} />

export const Web3Provider = ({ children }) => {
  const timer = React.useRef(null)
  const [provider, setProvider] = useState()
  const [account, setAccount] = useState()
  const [network, setNetwork] = useState('')
  const [balance, setBalance] = useState(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState(ETHEREUM_UNKNOWN)
  const [signer, setSigner] = useState()
  const networkIsValid = network === 'goerli' || network === 'private' || network === 'unknown'
  const networkName = React.useMemo(() => getNetworkName(network), [network])

  const switchNetwork = async (_provider) => {
    const p = new ethers.providers.Web3Provider(_provider)
    setProvider(p)
    const _signer = await _provider.getSigner(0)
    setSigner(_signer)
    if (_signer != null) {
      const _account = await _signer.getAddress()
      setAccount(_account)
    }
    const _balance = await _signer.getBalance().catch(() => ethers.BigNumber.from(0))
    if (balance == null || !balance.eq(_balance)) {
      setBalance(_balance)
    }
    if (status !== ETHEREUM_UNLOCKED) {
      setStatus(ETHEREUM_UNLOCKED)
    }
  }

  React.useEffect(() => {
    if (timer.current === null) {
      timer.current = setInterval(() => {
        Promise.resolve(true).then(async () => {
          // @todo : Handle web3modal provider.
          let _provider = provider
          if (provider == null) {
            // @dev : _provider = new ethers.providers.JsonRpcProvider('http://localhost:8545')
            _provider = typeof window?.ethereum !== 'undefined'
              ? new ethers.providers.Web3Provider(window.ethereum)
              : ethers.getDefaultProvider('goerli')
            if (_provider != null) {
              _provider.on('network', (newNetwork, oldNetwork) => {
                if (oldNetwork?.name !== newNetwork?.name) {
                  setNetwork(newNetwork?.name)
                }
              })
              setProvider(_provider)
              setNetwork((await _provider.getNetwork())?.name)
            }
          }

          if (_provider == null) {
            setStatus(ETHEREUM_UNAVAILABLE)
            setNetwork(undefined)
            return undefined
          }

          // @todo : Listen to account change event.
          let _signer = signer
          let _account = account
          try {
            if (_signer == null) {
              _signer = await _provider.getSigner(0)
            }
            if (_signer != null) {
              _account = await _signer.getAddress()
            }
            if (_signer == null || _account == null) {
              setStatus(ETHEREUM_LOCKED)
              setSigner(undefined)
              setAccount(undefined)
              setBalance(ethers.BigNumber.from(0))
              return undefined
            }
          } catch (_e) {
            return undefined
          }

          if (account !== _account) {
            setSigner(_signer)
            setAccount(_account)
          }

          const _balance = await _signer.getBalance().catch(() => ethers.BigNumber.from(0))
          if (balance == null || !balance.eq(_balance)) {
            setBalance(_balance)
          }

          if (status !== ETHEREUM_UNLOCKED) {
            setStatus(ETHEREUM_UNLOCKED)
          }
        })
        .finally(() => {
          if (loading) { setLoading(false) }
        })
      }, ETHEREUM_TIMER_DELAY)
    }
    return () => {
      if (timer.current != null) {
        clearInterval(timer.current)
        timer.current = null
      }
    }
  }, [loading, network, account])

  const connect = async () => {
    const accounts = await provider?.send('eth_requestAccounts', [])
      .catch((error) => {
        console.warn('Cannot request accounts from provider.\n', error.message)
      }) ||
      []
    if (accounts.length > 0) {
      const _signer = await provider?.getSigner(0)
      setSigner(_signer)
    }
  }

  return (
    <Web3Context.Provider
      value={{
        loading,
        account,
        network,
        networkName,
        networkIsValid,
        balance,
        status,
        provider,
        signer,
        connect,
        switchNetwork
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}
