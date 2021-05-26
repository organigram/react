import React from 'react';
import { Organigram } from '@organigram/client-js';
import { usePlatform } from './platform';
export const ProcedureContext = /*#__PURE__*/React.createContext({
  procedure: null,
  procedureType: null,
  loading: false,
  error: null,
  load: async () => {},
  reloadData: async () => {},
  reloadProposals: async () => {},
  reloadProposal: async key => {}
});
export const ProcedureProvider = ({
  address,
  procedure,
  procedureType,
  children
}) => {
  const {
    manager
  } = usePlatform();
  const [_procedure, setProcedure] = React.useState(procedure || null);
  const [_procedureType, setProcedureType] = React.useState(procedureType || _procedure.type || null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const load = () => {
    if (address || procedure.address) {
      setError(null);
      setLoading(true);
      Promise.all([manager.getProcedure(address), manager.getProcedureType(address)]).catch(error => {
        console.error("Error loading procedure ", address, error.message);
        setError(error);
        return [null, null];
      }).then(([p, pt]) => {
        setProcedure(p);
        setProcedureType(pt);
        setLoading(false);
      });
    }
  }; // Initial load.


  React.useEffect(() => {
    if (!procedure && address) load();
  }, []);
  const reloadData = React.useCallback(async () => {
    if (_procedure && _procedure.reloadData) _procedure.reloadData().then(p => setProcedure(_prev => p));
  }, [_procedure]);
  const reloadProposals = React.useCallback(async () => {
    if (_procedure.address && _procedure.reloadProposals) _procedure.reloadProposals().then(p => setProcedure(_prev => p));
  }, [_procedure]);
  const reloadProposal = React.useCallback(async proposalKey => {
    if (_procedure && _procedure.reloadProposal) _procedure.reloadProposal(proposalKey).then(p => setProcedure(_prev => p));
  }, [_procedure]);
  return /*#__PURE__*/React.createElement(ProcedureContext.Provider, {
    value: {
      procedure: _procedure,
      procedureType: _procedureType,
      loading,
      error,
      load,
      reloadData,
      reloadProposals,
      reloadProposal
    }
  }, children);
};
export const useProcedure = () => React.useContext(ProcedureContext);
export const withProcedureProvider = ComposedComponent => ({
  procedure,
  address,
  ...props
}) => /*#__PURE__*/React.createElement(ProcedureProvider, {
  procedure: procedure,
  address: address
}, /*#__PURE__*/React.createElement(ComposedComponent, props));