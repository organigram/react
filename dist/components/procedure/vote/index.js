import React from 'react';
import { useProcedure } from '../../../contexts/procedure';
export const Vote = () => {
  const {
    procedure
  } = useProcedure();
  return procedure && procedure.data ? /*#__PURE__*/React.createElement("div", {
    className: "procedure-vote"
  }, /*#__PURE__*/React.createElement("h4", null, "Vote"), /*#__PURE__*/React.createElement("div", null, "Voters Organ: ", /*#__PURE__*/React.createElement("code", null, procedure.data.votersOrgan), /*#__PURE__*/React.createElement("br", null), "Vetoers Organ: ", /*#__PURE__*/React.createElement("code", null, procedure.data.vetoersOrgan), /*#__PURE__*/React.createElement("br", null), "Enactors Organ: ", /*#__PURE__*/React.createElement("code", null, procedure.data.enactorsOrgan))) : /*#__PURE__*/React.createElement(React.Fragment, null);
};
export default Vote;