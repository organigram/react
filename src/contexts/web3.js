/**
 * @TODO : Move non-React code to @organigram/client-js.
 */
import React, { useState } from 'react'
import Web3 from 'web3'

export const ETHEREUM_TIMER_DELAY = 2000
export const ETHEREUM_UNKNOWN = 'ETHEREUM_UNKNOWN'
export const ETHEREUM_UNAVAILABLE = 'ETHEREUM_UNAVAILABLE'
export const ETHEREUM_LOCKED = 'ETHEREUM_LOCKED'
export const ETHEREUM_UNLOCKED = 'ETHEREUM_UNLOCKED'
export const ETHEREUM_NETWORK_ID_MAINNET = '1'
export const ETHEREUM_NETWORK_ID_MORDEN = '2'
export const ETHEREUM_NETWORK_ID_ROPSTEN = '3'
export const ETHEREUM_NETWORK_ID_RINKEBY = '4'
export const ETHEREUM_NETWORK_ID_KOVAN = '42'
export const ETHEREUM_NETWORK_ID_LOCAL = '1337'

export const Web3Context = React.createContext({
  account: '',
  network: '',
  networkIsValid: false,
  balance: 'n/a',
  status: ETHEREUM_UNKNOWN,
  web3:
    window.web3 &&
    window.web3.currentProvider &&
    new Web3(window.web3.currentProvider),
  ecRecover: null,
  sign: null,
  unlock: () => {}
})

export const useWeb3 = () => React.useContext(Web3Context)

export const withWeb3 = ComposedComponent =>
    props => <ComposedComponent {...props} web3={useWeb3()} />

export const Web3Provider = ({ children }) => {
    const timer = React.useRef(null)
    const [account, setAccount] = useState('')
    const [selected, setSelected] = useState(null)
    const [network, _setNetwork] = useState('')
    const [networkIsValid, _setNetworkIsValid] = useState(false)
    const [balance, setBalance] = useState(null)
    const [loading, setLoading] = useState(true)
    const [status, setStatus] = useState(ETHEREUM_UNKNOWN)
    const [_web3, setWeb3] = useState(null)

    const setNetwork = _network => {
        _setNetwork(_network)
        _setNetworkIsValid(_network === 'rinkeby' || _network === 'private') // @TODO : Rinkeby only in production.
    }

    React.useEffect(() => {
        if (timer.current === null) {
            timer.current = setInterval(() => {
                ;(async () => {
                    // Update network status.
                    if (
                        typeof window.web3 === 'undefined' ||
                        typeof window.web3.currentProvider === 'undefined'
                    )
                        setStatus(ETHEREUM_UNAVAILABLE)
                    else if (!_web3)
                        setWeb3(new Web3(window.web3.currentProvider))
                    else {
                        if (window.ethereum && window.ethereum.autoRefreshOnNetworkChange)
                            window.ethereum.autoRefreshOnNetworkChange = false
                        const accounts = await _web3.eth.getAccounts()
                        if (accounts.length === 0 && status !== ETHEREUM_LOCKED)
                            setStatus(ETHEREUM_LOCKED)
                        if (accounts.length > 0) {
                            if (status !== ETHEREUM_UNLOCKED)
                                setStatus(ETHEREUM_UNLOCKED)
                            const newAccount = accounts[0].toLowerCase()
                            // Update account.
                            if (
                                account !== null &&
                                account !== selected &&
                                account !== newAccount
                            ) {
                                setAccount(newAccount)
                            }

                            // Update network (async).
                            const newNetworkId = _web3.currentProvider.networkVersion
                            let newNetwork
                            switch (newNetworkId) {
                                case ETHEREUM_NETWORK_ID_MAINNET:
                                    newNetwork = 'mainnet'
                                    break
                                case ETHEREUM_NETWORK_ID_MORDEN:
                                    newNetwork = 'morden'
                                    break
                                case ETHEREUM_NETWORK_ID_ROPSTEN:
                                    newNetwork = 'ropsten'
                                    break
                                case ETHEREUM_NETWORK_ID_RINKEBY:
                                    newNetwork = 'rinkeby'
                                    break
                                case ETHEREUM_NETWORK_ID_KOVAN:
                                    newNetwork = 'kovan'
                                    break
                                default:
                                    newNetwork = 'private'
                                    break
                            }
                            if (newNetwork !== network)
                                setNetwork(newNetwork)

                            // Update balance (callback).
                            if (newAccount) {
                                _web3.eth.getBalance(newAccount, (error, data) => {
                                    if (!error) {
                                        const newBalance = _web3.utils.toBN(data)
                                        if (
                                            newBalance &&
                                            (!balance || (balance && !newBalance.eq(balance)))
                                        ) {
                                            setBalance(
                                                _web3.utils
                                                .fromWei(data, 'ether')
                                                .toString()
                                                .substring(0, 6)
                                            )
                                        }
                                    }
                                })
                                .catch(e => console.error(e.message))
                            }
                        }
                    }
                    if (loading)
                        setLoading(false)
                })()
            }, ETHEREUM_TIMER_DELAY)
        }
        return () => {
            if (timer.current) {
                clearInterval(timer.current)
                timer.current = null
            }
        }
    }, [timer, loading, account, network, balance, status, _web3])

    const unlock = React.useCallback(async () => {
        if (_web3.currentProvider.enable) {
            const accounts = await _web3.eth.getAccounts()
            if (!accounts)
                await _web3.currentProvider.enable()
        }
    }, [_web3])

    const reset = value => setAccount(value)

    const ecRecover =
        _web3 && _web3.eth && _web3.eth.personal && _web3.eth.personal.ecRecover
        ? _web3.eth.personal.ecRecover
        : null

    const sign =
        _web3 && _web3.eth && _web3.eth.personal && _web3.eth.personal.sign
        ? _web3.eth.personal.sign
        : null

    const enable = () => {
        reset('')
        if (typeof window.web3 !== 'undefined')
            window.web3.currentProvider.enable()
    }

    return (
        <Web3Context.Provider value={{
            loading,
            account,
            selected,
            network,
            networkIsValid,
            balance,
            status,
            web3: _web3,
            ecRecover,
            sign,
            unlock,
            reset,
            enable,
            setSelected
        }}>
            {children}
        </Web3Context.Provider>
    )
}