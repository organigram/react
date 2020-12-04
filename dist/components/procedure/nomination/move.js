import React from 'react';
import { useProcedure } from '../../../contexts/procedure';
export const NominationMove = ({
  move
}) => {
  const {
    procedure: {
      data
    }
  } = useProcedure();
  return data ? /*#__PURE__*/React.createElement("div", {
    className: "procedure-move procedure-move-vote"
  }, /*#__PURE__*/React.createElement("p", null, "Nomination Move"), data.nominate && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-danger",
    onClick: () => data.nominate(move.key)
  }, "Vote")) : /*#__PURE__*/React.createElement(React.Fragment, null);
};
export default NominationMove;