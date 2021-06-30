import React from 'react'
import { usePlatform } from './platform'

export const OrganContext = React.createContext({
  address: null,
  organ: null,
  loading: false,
  error: null,
  load: () => { },
  reloadEntries: async () => { },
  reloadProcedures: async () => { },
  reloadData: async () => { }
})

export const OrganProvider = ({ organ, address, children }) => {
  // @todo Use a cache stored in useOrganigramClient (required) for organs & procedures sync.
  const { manager } = usePlatform()
  const [_organ, setOrgan] = React.useState(organ || null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)

  const load = () => {
    if (address || organ.address) {
      setError(null)
      setLoading(true)
      manager.getOrgan(address)
        .then(data => setOrgan(data))
        .catch(error => {
          console.error("Error loading organ ", address, error.message)
          setOrgan(null)
          setError(error)
        })
        .finally(() => setLoading(false))
    }
  }

  const reloadData = React.useCallback(async () => {
    if (_organ.address && _organ.reloadMetadata)
      _organ.reloadData()
        .then(o => setOrgan(_prev => o))
  }, [_organ])

  const reloadEntries = React.useCallback(async () => {
    if (_organ.address && _organ.reloadEntries)
      _organ.reloadEntries()
        .then(o => setOrgan(_prev => o))
  }, [_organ])

  const reloadProcedures = React.useCallback(async () => {
    if (_organ.address && _organ.reloadProcedures)
      _organ.reloadProcedures()
        .then(o => setOrgan(_prev => o))
  }, [_organ])

  // Initial load.
  React.useEffect(() => {
    if (!organ && address)
      load()
  }, [])

  return (
    <OrganContext.Provider value={{
      address,
      organ: _organ,
      loading,
      error,
      load,
      reloadData,
      reloadEntries,
      reloadProcedures
    }}>
      {children}
    </OrganContext.Provider>
  )
}

export const useOrgan = () => React.useContext(OrganContext)

export const withOrganProvider = ComposedComponent =>
  ({ organ, address, ...props }) => (
    <OrganProvider organ={organ} address={address}>
      <ComposedComponent {...props} />
    </OrganProvider>
  )