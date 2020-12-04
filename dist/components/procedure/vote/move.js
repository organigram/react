import React from 'react';
export const VoteMove = ({
  move
}) => {
  const {
    procedure: {
      data
    }
  } = useProcedure();
  return data ? /*#__PURE__*/React.createElement("div", {
    className: "procedure-move procedure-move-vote"
  }, data.vote && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-danger",
    onClick: () => data.vote(move.key)
  }, "Vote!")) : /*#__PURE__*/React.createElement(React.Fragment, null);
};
export default VoteMove;