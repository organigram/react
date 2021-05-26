import React from 'react';
import { useProcedure } from '../../../contexts/procedure';

const Procedure = () => {
  const {
    procedure
  } = useProcedure();
  return procedure ? /*#__PURE__*/React.createElement("div", {
    className: "procedure-vote"
  }, "Voters Organ: ", /*#__PURE__*/React.createElement("code", null, procedure.deciders), /*#__PURE__*/React.createElement("br", null), "Vetoers Organ: ", /*#__PURE__*/React.createElement("code", null, procedure.moderators), /*#__PURE__*/React.createElement("br", null), "Quorum Size: ", procedure.quorumSize.toString(), /*#__PURE__*/React.createElement("br", null), "Vote Duration (in blocks): ", procedure.voteDuration.toString(), /*#__PURE__*/React.createElement("br", null), "Majority Size: ", procedure.majoritySize.toString()) : /*#__PURE__*/React.createElement(React.Fragment, null);
};

export default Procedure;