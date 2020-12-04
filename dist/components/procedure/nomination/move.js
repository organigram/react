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
  }, data.nominate && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-danger",
    onClick: () => data.nominate(move.key)
  }, "Nominate!")) : /*#__PURE__*/React.createElement(React.Fragment, null);
};
export default NominationMove;