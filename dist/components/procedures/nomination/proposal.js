import React from 'react';
import { useProcedure } from '../../../contexts/procedure';

const Proposal = ({
  proposal
}) => {
  const {
    procedure: {
      nominate
    }
  } = useProcedure();
  if (!proposal || !proposal.presented) return /*#__PURE__*/React.createElement("p", {
    className: "text-danger"
  }, "Proposal not presented.");
  return nominate ? /*#__PURE__*/React.createElement("div", {
    className: "procedure-proposal procedure-proposal-nomination"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-success",
    onClick: () => nominate(proposal.key)
  }, "Nominate"), "}") : /*#__PURE__*/React.createElement(React.Fragment, null);
};

export default Proposal;