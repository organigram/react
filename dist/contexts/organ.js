import React from 'react';
import { Organ } from '@organigram/client-js';
export const OrganContext = /*#__PURE__*/React.createContext({
  organ: null,
  loading: false,
  error: null,
  load: () => {}
});
export const OrganProvider = ({
  organ,
  address,
  children
}) => {
  // @todo Use a cache stored in useOrganigramClient (required) for organs & procedures sync.
  const [_organ, setOrgan] = React.useState(organ || null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const load = () => {
    if (address || organ.address) {
      setError(null);
      setLoading(true);
      Organ.load(address).then(data => setOrgan(data)).catch(error => {
        console.error("Error loading organ ", address, error.message);
        setOrgan(null);
        setError(error);
      }).finally(() => setLoading(false));
    }
  }; // Initial load.


  React.useEffect(() => {
    if (!organ && address) load();
  }, []);
  return /*#__PURE__*/React.createElement(OrganContext.Provider, {
    value: {
      organ: _organ,
      loading,
      error,
      load
    }
  }, children);
};
export const useOrgan = () => React.useContext(OrganContext);
export const withOrganProvider = ComposedComponent => ({
  organ,
  address,
  ...props
}) => /*#__PURE__*/React.createElement(OrganProvider, {
  organ: organ,
  address: address
}, /*#__PURE__*/React.createElement(ComposedComponent, props));