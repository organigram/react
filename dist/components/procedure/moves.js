import React, { useState } from 'react';
import { useProcedure } from '../../contexts/procedure';
export const ProcedureMoves = () => {
  const {
    procedure: {
      moves,
      createMove
    }
  } = useProcedure();
  const [currentMove, setCurrentMove] = useState();
  return /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => createMove()
  }, "Create Move"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("ul", null, moves && moves.map(move => /*#__PURE__*/React.createElement("li", {
    key: `move-${move.key}`,
    onClick: () => setCurrentMove(move)
  }, /*#__PURE__*/React.createElement("pre", null, move.key))))), /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, currentMove && /*#__PURE__*/React.createElement(ProcedureMove, {
    move: currentMove
  })));
};
export const ProcedureMove = ({
  move
}) => {
  const {
    procedure
  } = useProcedure();
  const handleLock = React.useCallback(() => {
    procedure.lockMove(move.key).catch(console.error);
  }, [procedure.lockMove, move]);
  return /*#__PURE__*/React.createElement("div", {
    className: "procedure-move"
  }, /*#__PURE__*/React.createElement("pre", null, JSON.stringify(move, null, 2)), /*#__PURE__*/React.createElement("button", {
    onClick: handleLock
  }, "LOCK!"));
};