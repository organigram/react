import React from 'react'
import { initIPFS as _initIPFS, IPFS } from '@organigram/js'
export { cidToMultihash, multihashToCid } from '@organigram/js'

export const IPFSContext = React.createContext({
  ipfs: null,
  loading: false,
  initIPFS: (autostart = true) => {}
})

export const IPFSProvider = ({ children }) => {
  const [ipfs, setIpfs] = React.useState()
  const [loading, setLoading] = React.useState(false)

  const initIPFS = React.useCallback((start = false) => {
    if (!loading && ipfs == null) {
      setLoading(true)
      void (_initIPFS())?.then(async _ipfs => {
        if (_ipfs) {
          window._ipfs = _ipfs
          if (start) {
            await _ipfs.start()
              .catch(error => console.error('IPFS not started.', error.message))
          }
          setIpfs(_ipfs)
        }
      })
        // @todo : Catch ?
        .catch(error => console.warn('IPFS node not created.', error.message))
        .finally(() => setLoading(false))
    }
  }, [ipfs, loading])

  React.useEffect(() => {
    // Share IPFS module on mount.
    window._IPFS = IPFS
    // Stop on unmount
    return () => {
      window._ipfs = undefined
      if (ipfs != null) {
        void ipfs.stop().catch(e => console.warn(e.message))
      }
    }
  }, [])

  return (
    <IPFSContext.Provider value={{ ipfs, loading, initIPFS }}>
      {children}
    </IPFSContext.Provider>
  )
}

export const useIPFS = () => React.useContext(IPFSContext)
