import React from 'react';
import { useProcedure } from '../../../contexts/procedure';
export const Nomination = () => {
  const {
    procedure
  } = useProcedure();
  return procedure && procedure.data ? /*#__PURE__*/React.createElement("div", {
    className: "procedure-nomination"
  }, /*#__PURE__*/React.createElement("h4", null, "Nomination"), /*#__PURE__*/React.createElement("div", null, "Nominaters Organ: ", /*#__PURE__*/React.createElement("code", null, procedure.data.nominatersOrgan))) : /*#__PURE__*/React.createElement(React.Fragment, null);
};
export default Nomination;