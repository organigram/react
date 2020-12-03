import React from 'react';
import { useProcedure, withProcedureProvider } from "../../contexts/procedure";
export const Procedure = props => {
  const {
    procedure,
    loading,
    error
  } = useProcedure();
  const [ProcedureComponent, setProcedureComponent] = React.useState();
  React.useEffect(async () => {
    if (procedure.type) switch (procedure.type) {
      case '0xc5f28e49':
        // Nomination.
        setProcedureComponent( /*#__PURE__*/React.lazy(() => import('./nomination')));
        break;

      case '0xc9d27afe':
        // Vote.
        setProcedureComponent( /*#__PURE__*/React.lazy(() => import('./vote')));
        break;

      default:
        console.log('procedure.type', procedure.type);
        break;
    }
  }, [procedure.type]);

  if (!procedure) {
    return loading ? props.loading || /*#__PURE__*/React.createElement("p", null, "Loading.") : props.not_found || /*#__PURE__*/React.createElement("p", null, "Procedure not found.");
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, loading && /*#__PURE__*/React.createElement("p", null, "Loading."), error && /*#__PURE__*/React.createElement("pre", null, "Error: ", JSON.stringify(error, null, 2)), procedure && procedure.type && ProcedureComponent && /*#__PURE__*/React.createElement(React.Suspense, {
    fallback: /*#__PURE__*/React.createElement("p", null, "Loading...")
  }, /*#__PURE__*/React.createElement(ProcedureComponent, props)));
};
export default withProcedureProvider(Procedure);