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
}) => /*#__PURE__*/React.createElement("div", {
  className: "procedure-move"
}, /*#__PURE__*/React.createElement("pre", null, JSON.stringify(move, null, 2)), /*#__PURE__*/React.createElement(ProcedureMoveFormLock, {
  move: move
}), /*#__PURE__*/React.createElement(ProcedureMoveFormAddEntries, {
  move: move
}), /*#__PURE__*/React.createElement(ProcedureMoveFormRemoveEntry, {
  move: move
}), /*#__PURE__*/React.createElement(ProcedureMoveFormReplaceEntry, {
  move: move
}), /*#__PURE__*/React.createElement(ProcedureMoveFormAddProcedure, {
  move: move
}), /*#__PURE__*/React.createElement(ProcedureMoveFormRemoveProcedure, {
  move: move
}), /*#__PURE__*/React.createElement(ProcedureMoveFormReplaceProcedure, {
  move: move
}), /*#__PURE__*/React.createElement(ProcedureMoveFormCall, {
  move: move
}));
export const ProcedureMoveFormLock = ({
  move
}) => {
  const {
    procedure: {
      lockMove
    }
  } = useProcedure();
  return /*#__PURE__*/React.createElement("div", {
    className: "procedure-move-lockMove"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => lockMove(move.key).catch(console.error)
  }, "Lock Move"));
};
export const ProcedureMoveFormAddEntries = ({
  move
}) => {
  const {
    procedure: {
      moveAddEntries
    }
  } = useProcedure();
  return /*#__PURE__*/React.createElement("div", {
    className: "procedure-move-moveAddEntries"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => moveAddEntries(move.key).catch(console.error)
  }, "Add Entries"));
};
export const ProcedureMoveFormRemoveEntry = ({
  move
}) => {
  const {
    procedure: {
      moveRemoveEntry
    }
  } = useProcedure();
  return /*#__PURE__*/React.createElement("div", {
    className: "procedure-move-moveRemoveEntry"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => moveRemoveEntry(move.key).catch(console.error)
  }, "Remove Entry"));
};
export const ProcedureMoveFormReplaceEntry = ({
  move
}) => {
  const {
    procedure: {
      moveReplaceEntry
    }
  } = useProcedure();
  return /*#__PURE__*/React.createElement("div", {
    className: "procedure-move-moveReplaceEntry"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => moveReplaceEntry(move.key).catch(console.error)
  }, "Replace Entry"));
};
export const ProcedureMoveFormAddProcedure = ({
  move
}) => {
  const {
    procedure: {
      moveAddProcedure
    }
  } = useProcedure();
  return /*#__PURE__*/React.createElement("div", {
    className: "procedure-move-moveAddProcedure"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => moveAddProcedure(move.key).catch(console.error)
  }, "Add Procedure"));
};
export const ProcedureMoveFormRemoveProcedure = ({
  move
}) => {
  const {
    procedure: {
      moveRemoveProcedure
    }
  } = useProcedure();
  return /*#__PURE__*/React.createElement("div", {
    className: "procedure-move-moveRemoveProcedure"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => moveRemoveProcedure(move.key).catch(console.error)
  }, "Remove Procedure"));
};
export const ProcedureMoveFormReplaceProcedure = ({
  move
}) => {
  const {
    procedure: {
      moveReplaceProcedure
    }
  } = useProcedure();
  return /*#__PURE__*/React.createElement("div", {
    className: "procedure-move-moveReplaceProcedure"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => moveReplaceProcedure(move.key).catch(console.error)
  }, "Replace Procedure"));
};
export const ProcedureMoveFormCall = ({
  move
}) => {
  const {
    procedure: {
      moveCall
    }
  } = useProcedure();
  return /*#__PURE__*/React.createElement("div", {
    className: "procedure-move-moveCall"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => moveCall(move.key).catch(console.error)
  }, "Add Special Call"));
};