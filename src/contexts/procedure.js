import React from 'react'
import { Organigram } from '@organigram/js'
import { usePlatform } from './platform'

export const ProcedureContext = React.createContext({
  procedure: null,
  procedureType: null,
  loading: false,
  error: null,
  load: null,
  reloadData: null,
  reloadProposals: null,
  reloadProposal: null
})

export const ProcedureProvider = ({ address, procedure, procedureType, children }) => {
  const { manager } = usePlatform()
  const [_procedure, setProcedure] = React.useState(procedure || null)
  const [_procedureType, setProcedureType] = React.useState(procedureType || _procedure.type || null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)

  const load = () => {
    if (address || procedure.address) {
      setError(null)
      setLoading(true)
      manager.getProcedure(address, false)
        .catch(error => {
          console.warn('Error loading procedure', address, error.message)
          setError(error)
        })
        .then((p) => {
          setProcedure(p)
          setProcedureType(p.type)
        })
        .finally(() => setLoading(false))
    }
  }

  // Initial load.
  React.useEffect(() => {
    if (!procedure && address) { load() }
  }, [])

  const reloadData = React.useCallback(async () => {
    if (_procedure && _procedure.reloadData) {
 _procedure.reloadData()
        .then(p => setProcedure(_prev => p))
}
  }, [_procedure])

  const reloadProposals = React.useCallback(async () => {
    if (_procedure.address && _procedure.reloadProposals) {
 _procedure.reloadProposals()
        .then(p => setProcedure(_prev => p))
}
  }, [_procedure])

  const reloadProposal = React.useCallback(async (proposalKey) => {
    if (_procedure && _procedure.reloadProposal) {
 _procedure.reloadProposal(proposalKey)
        .then(p => setProcedure(_prev => p))
}
  }, [_procedure])

  return (
    <ProcedureContext.Provider
      value={{
        procedure: _procedure,
        procedureType: _procedureType,
        loading,
        error,
        load,
        reloadData,
        reloadProposals,
        reloadProposal
      }}
    >
      {children}
    </ProcedureContext.Provider>
  )
}

export const useProcedure = () => React.useContext(ProcedureContext)

export const withProcedureProvider = ComposedComponent =>
  ({ procedure, address, ...props }) => (
    <ProcedureProvider procedure={procedure} address={address}>
      <ComposedComponent {...props} />
    </ProcedureProvider>
  )
