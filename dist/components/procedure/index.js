import React, { useState } from 'react';
import { OrganEntryForm, OrganEntrySelector, OrganProcedureForm, OrganProcedureSelector } from '../organ';
import { useProcedure, withProcedureProvider } from "../../contexts/procedure";
import { useGraph } from "../../contexts/graph";
import { ContractSelector } from '../graph';
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
  }, "view"), /*#__PURE__*/React.createElement("br", null), "Operations:", /*#__PURE__*/React.createElement("pre", null, JSON.stringify(move.operations, null, 2))), move.locked && /*#__PURE__*/React.createElement(React.Suspense, {
    fallback: /*#__PURE__*/React.createElement("p", null, "Loading...")
  }, ProcedureMoveComponent && /*#__PURE__*/React.createElement(ProcedureMoveComponent, {
    move: move
  })), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-sm",
    onClick: () => toggleForms()
  }, "toggle forms"), showForms && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ProcedureMoveFormLock, {
    move: move
  }), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(ProcedureMoveFormAddEntries, {
    move: move
  }), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(ProcedureMoveFormRemoveEntry, {
    move: move
  }), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(ProcedureMoveFormReplaceEntry, {
    move: move
  }), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(ProcedureMoveFormAddProcedure, {
    move: move
  }), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(ProcedureMoveFormRemoveProcedure, {
    move: move
  }), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(ProcedureMoveFormReplaceProcedure, {
    move: move
  }), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(ProcedureMoveFormCall, {
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
  return !move.locked && /*#__PURE__*/React.createElement("div", {
    className: "procedure-move-lockMove"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      lockMove(move.key).catch(console.error);
    },
    className: "btn btn-success"
  }, "Lock Move"));
};
export const ProcedureMoveFormAddEntries = ({
  move
}) => {
  const {
    graph: {
      organs
    }
  } = useGraph();
  const {
    procedure: {
      moveAddEntries
    }
  } = useProcedure();
  const [organ, setOrgan] = useState();
  const [entries, setEntries] = useState([]);

  const removeEntry = entry => setEntries(es => es.filter(ese => ese.address !== entry.address || `${ese.cid}` !== `${entry.cid}`));

  return /*#__PURE__*/React.createElement("div", {
    className: "procedure-move-moveAddEntries"
  }, /*#__PURE__*/React.createElement(ContractSelector, {
    contracts: organs,
    onSelect: o => o && setOrgan(o)
  }), /*#__PURE__*/React.createElement("ul", {
    className: "list-unstyled"
  }, entries.map((e, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    className: "list-item"
  }, /*#__PURE__*/React.createElement("code", null, e.address), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("a", {
    href: `https://ipfs.io/ipfs/${e.cid}`,
    target: "_blank"
  }, `${e.cid}`), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-sm btn-danger",
    onClick: () => removeEntry(e)
  }, "remove")))), /*#__PURE__*/React.createElement(OrganEntryForm, {
    onSave: entry => entry && setEntries([...entries, entry])
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (organ && entries) moveAddEntries(move.key, organ.address, entries).catch(console.error);
    },
    className: "btn btn-primary"
  }, "Add Entries"));
};
export const ProcedureMoveFormRemoveEntry = ({
  move
}) => {
  const {
    graph: {
      organs
    }
  } = useGraph();
  const {
    procedure: {
      moveRemoveEntry
    }
  } = useProcedure();
  const [organ, setOrgan] = useState();
  const [entry, setEntry] = useState();
  return /*#__PURE__*/React.createElement("div", {
    className: "procedure-move-moveRemoveEntry"
  }, /*#__PURE__*/React.createElement(ContractSelector, {
    contracts: organs,
    onSelect: o => o && setOrgan(o)
  }), organ && /*#__PURE__*/React.createElement(React.Fragment, null, entry && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("code", null, entry.address), " ", /*#__PURE__*/React.createElement("span", {
    className: "text-info"
  }, `${entry.cid}`)), /*#__PURE__*/React.createElement(OrganEntrySelector, {
    entries: organ.entries,
    onSelect: e => e && setEntry(e)
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (organ && entry) moveRemoveEntry(move.key, organ.address, entry).catch(console.error);
    },
    className: "btn btn-primary"
  }, "Remove Entry"));
};
export const ProcedureMoveFormReplaceEntry = ({
  move
}) => {
  const {
    graph: {
      organs
    }
  } = useGraph();
  const {
    procedure: {
      moveReplaceEntry
    }
  } = useProcedure();
  const [organ, setOrgan] = useState();
  const [index, setIndex] = useState();
  const [entry, setEntry] = useState();
  return /*#__PURE__*/React.createElement("div", {
    className: "procedure-move-moveReplaceEntry"
  }, /*#__PURE__*/React.createElement(ContractSelector, {
    contracts: organs,
    onSelect: o => o && setOrgan(o)
  }), organ && /*#__PURE__*/React.createElement(OrganEntrySelector, {
    entries: organ.entries,
    onSelect: e => e && setIndex(e.index)
  }), organ && index && /*#__PURE__*/React.createElement(React.Fragment, null, entry && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("code", null, entry.address), " ", /*#__PURE__*/React.createElement("span", {
    className: "text-info"
  }, `${entry.cid}`)), /*#__PURE__*/React.createElement(OrganEntryForm, {
    onSave: e => setEntry(e)
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (organ && index && entry) moveReplaceEntry(move.key, organ.address, index, entry).catch(console.error);
    },
    className: "btn btn-primary"
  }, "Replace Entry"));
};
export const ProcedureMoveFormAddProcedure = ({
  move
}) => {
  const {
    graph: {
      organs
    }
  } = useGraph();
  const {
    procedure: {
      moveAddProcedure
    }
  } = useProcedure();
  const [organ, setOrgan] = useState();
  const [procedure, setProcedure] = useState();
  return /*#__PURE__*/React.createElement("div", {
    className: "procedure-move-moveAddProcedure"
  }, /*#__PURE__*/React.createElement(ContractSelector, {
    contracts: organs,
    onSelect: o => o && setOrgan(o)
  }), organ && /*#__PURE__*/React.createElement(React.Fragment, null, procedure && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("code", null, procedure.address), " ", /*#__PURE__*/React.createElement("span", {
    className: "text-info"
  }, `${procedure.permissions}`)), /*#__PURE__*/React.createElement(OrganProcedureForm, {
    onSave: p => p && setProcedure(p)
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (organ && procedure) moveAddProcedure(move.key, organ.address, procedure).catch(console.error);
    },
    className: "btn btn-primary"
  }, "Add Procedure"));
};
export const ProcedureMoveFormRemoveProcedure = ({
  move
}) => {
  const {
    graph: {
      organs
    }
  } = useGraph();
  const {
    procedure: {
      moveRemoveProcedure
    }
  } = useProcedure();
  const [organ, setOrgan] = useState();
  const [procedure, setProcedure] = useState();
  return /*#__PURE__*/React.createElement("div", {
    className: "procedure-move-moveRemoveProcedure"
  }, /*#__PURE__*/React.createElement(ContractSelector, {
    contracts: organs,
    onSelect: o => o && setOrgan(o)
  }), organ && /*#__PURE__*/React.createElement(OrganProcedureSelector, {
    procedures: organ.procedures,
    onSelect: p => p && setProcedure(p)
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (organ && procedure) moveRemoveProcedure(move.key, organ.address, procedure.address).catch(console.error);
    },
    className: "btn btn-primary"
  }, "Remove Procedure"));
};
export const ProcedureMoveFormReplaceProcedure = ({
  move
}) => {
  const {
    graph: {
      organs
    }
  } = useGraph();
  const {
    procedure: {
      moveReplaceProcedure
    }
  } = useProcedure();
  const [organ, setOrgan] = useState();
  const [oldProcedure, setOldProcedure] = useState();
  const [newProcedure, setNewProcedure] = useState();
  return /*#__PURE__*/React.createElement("div", {
    className: "procedure-move-moveReplaceProcedure"
  }, /*#__PURE__*/React.createElement(ContractSelector, {
    contracts: organs,
    onSelect: o => o && setOrgan(o)
  }), organ && /*#__PURE__*/React.createElement(OrganProcedureSelector, {
    procedures: organ.procedures,
    onSelect: p => p && setOldProcedure(p)
  }), organ && /*#__PURE__*/React.createElement(React.Fragment, null, procedure && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("code", null, procedure.address), " ", /*#__PURE__*/React.createElement("span", {
    className: "text-info"
  }, `${procedure.permissions}`)), /*#__PURE__*/React.createElement(OrganProcedureForm, {
    onSave: p => p && setNewProcedure(p)
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (organ && oldProcedure && newProcedure) moveReplaceProcedure(move.key, organ.address, oldProcedure.address, newProcedure).catch(console.error);
    },
    className: "btn btn-primary"
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
    onClick: () => {
      moveCall(move.key).catch(console.error);
    },
    className: "btn btn-warning"
  }, "Add Special Call"));
};