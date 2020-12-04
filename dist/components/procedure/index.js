import React, { useState } from 'react';
import { useProcedure, withProcedureProvider } from "../../contexts/procedure";
export const Procedure = props => {
  const {
    procedure,
    loading,
    error
  } = useProcedure();
  const [ProcedureComponent, setProcedureComponent] = useState();
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
        setProcedureComponent();
        break;
    }
  }, [procedure.type]);

  if (!procedure) {
    return loading ? props.loading || /*#__PURE__*/React.createElement("p", null, "Loading.") : props.not_found || /*#__PURE__*/React.createElement("p", null, "Procedure not found.");
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, loading && /*#__PURE__*/React.createElement("p", null, "Loading."), error && /*#__PURE__*/React.createElement("pre", null, "Error: ", JSON.stringify(error, null, 2)), procedure && procedure.type && ProcedureComponent && /*#__PURE__*/React.createElement("div", {
    className: "card procedure"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("h4", null, procedure.address), /*#__PURE__*/React.createElement("h5", null, "Metadata"), /*#__PURE__*/React.createElement("code", null, `${procedure.metadata.cid}`), " ", /*#__PURE__*/React.createElement("a", {
    href: `https://ipfs.io/ipfs/${procedure.metadata.cid}`,
    target: "_blank"
  }, "view"), /*#__PURE__*/React.createElement("h5", null, "Moves"), /*#__PURE__*/React.createElement(ProcedureMoves, null), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(React.Suspense, {
    fallback: /*#__PURE__*/React.createElement("p", null, "Loading...")
  }, /*#__PURE__*/React.createElement(ProcedureComponent, props)))));
};
export default withProcedureProvider(Procedure);
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
    className: "col-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => createMove(),
    className: "btn btn-primary"
  }, "Create Move"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("ul", null, moves && moves.map(move => /*#__PURE__*/React.createElement("li", {
    key: `move-${move.key}`,
    onClick: () => setCurrentMove(move)
  }, /*#__PURE__*/React.createElement("pre", null, move.key))))), /*#__PURE__*/React.createElement("div", {
    className: "col-10"
  }, currentMove && /*#__PURE__*/React.createElement(ProcedureMove, {
    move: currentMove
  })));
};
export const ProcedureMove = ({
  move
}) => {
  const {
    procedure: {
      type
    }
  } = useProcedure();
  const [showForms, setShowForms] = useState(false);

  const toggleForms = () => setShowForms(sf => !sf);

  const [ProcedureMoveComponent, setProcedureMoveComponent] = useState();
  React.useEffect(async () => {
    if (type) switch (type) {
      case '0xc5f28e49':
        // Nomination.
        setProcedureMoveComponent( /*#__PURE__*/React.lazy(() => import('./nomination/move')));
        break;

      case '0xc9d27afe':
        // Vote.
        setProcedureMoveComponent( /*#__PURE__*/React.lazy(() => import('./vote/move')));
        break;

      default:
        setProcedureMoveComponent();
        break;
    }
  }, [type]);
  return /*#__PURE__*/React.createElement("div", {
    className: "procedure-move card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("h5", null, move.key), /*#__PURE__*/React.createElement("div", null, "Creator: ", /*#__PURE__*/React.createElement("code", null, move.creator), /*#__PURE__*/React.createElement("br", null), "Locked? ", /*#__PURE__*/React.createElement("code", null, move.locked ? "true" : "false"), /*#__PURE__*/React.createElement("br", null), "Applied? ", /*#__PURE__*/React.createElement("code", null, move.applied ? "true" : "false"), /*#__PURE__*/React.createElement("br", null), "Processing? ", /*#__PURE__*/React.createElement("code", null, move.processing ? "true" : "false"), /*#__PURE__*/React.createElement("br", null), "Metadata: ", /*#__PURE__*/React.createElement("code", null, `${move.metadata.cid}`), " ", /*#__PURE__*/React.createElement("a", {
    href: `https://ipfs.io/ipfs/${move.metadata.cid}`,
    target: "_blank"
  }, "view"), /*#__PURE__*/React.createElement("br", null), "Operations:", /*#__PURE__*/React.createElement("pre", null, JSON.stringify(move.operations, null, 2))), /*#__PURE__*/React.createElement(React.Suspense, {
    fallback: /*#__PURE__*/React.createElement("p", null, "Loading...")
  }, ProcedureMoveComponent && /*#__PURE__*/React.createElement(ProcedureMoveComponent, {
    move: move
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-sm",
    onClick: () => toggleForms()
  }, "toggle forms"), showForms && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ProcedureMoveFormLock, {
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
  }))));
};
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
  const [state, setState] = useState();
  return /*#__PURE__*/React.createElement("div", {
    className: "procedure-move-moveCall"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => moveCall(move.key).catch(console.error)
  }, "Add Special Call"));
};