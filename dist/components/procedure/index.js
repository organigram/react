import React from 'react';
import { useProcedure, withProcedureProvider } from "../../contexts/procedure";
export const Procedure = props => {
  const {
    procedure,
    loading,
    error
  } = useProcedure();
  const [ProcedureComponent, setProcedureComponent] = React.useState(null);
  React.useEffect(async () => {
    if (!procedure) setProcedureComponent(null);else {
      let Component = null;

      switch (procedure.type) {
        case 'nomination':
          Component = /*#__PURE__*/React.lazy(() => import('./nomination'));
          break;

        case 'vote':
          Component = /*#__PURE__*/React.lazy(() => import('./vote'));
          break;

        default:
          // @todo : Dev only.
          Component = componentProps => /*#__PURE__*/React.createElement("pre", null, JSON.stringify(componentProps, 0, 2));

          break;
      }

      setProcedureComponent(Component);
    }
  }, [procedure]);

  if (!procedure) {
    return loading ? props.loading || /*#__PURE__*/React.createElement("p", null, "Loading.") : props.not_found || /*#__PURE__*/React.createElement("p", null, "Procedure not found.");
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, loading && /*#__PURE__*/React.createElement("p", null, "Loading."), error && /*#__PURE__*/React.createElement("pre", null, "Error: ", JSON.stringify(error, null, 2)), procedure && ProcedureComponent && /*#__PURE__*/React.createElement(React.Suspense, {
    fallback: "Loading..."
  }, /*#__PURE__*/React.createElement(ProcedureComponent, props)));
};
export default withProcedureProvider(Procedure);