function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import { CID, Procedure } from '@organigram/client-js';
import graph from '@organigram/client-js/dist/graph';
import React, { useState } from 'react';
import { useGraph } from '../../../contexts/graph';
import { useOrgan, withOrganProvider } from '../../../contexts/organ';
import { useProcedure } from '../../../contexts/procedure';
import { ContractSelector } from '../../graph/contracts';
import { OrganEntryForm, OrganEntrySelector, OrganProcedureForm, OrganProcedureSelector } from '../../organ';
import { CIDInput } from '../../vault/upload';
import { ProposalOperations } from './operations';
export const ProposalOperationAddEntries = ({
  proposal,
  operation
}) => {
  const {
    procedure: {
      lockProposal
    },
    reloadProposal
  } = useProcedure();
  return !proposal.locked && /*#__PURE__*/React.createElement("div", {
    className: "procedure-proposal-lockProposal"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      lockProposal(proposal.key).then(() => reloadProposal(proposal.key)).catch(console.error);
    },
    className: "btn btn-success"
  }, "Lock Proposal"));
};
export const EntriesSelector = ({
  defaultValue,
  onSelect
}) => {
  const [entries, setEntries] = useState(defaultValue || []);
  return /*#__PURE__*/React.createElement(React.Fragment, null, "Entries", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("ul", null, entries.map(entry => {
    const key = `entry-${entry.addr}-${entry.doc}`;
    return /*#__PURE__*/React.createElement("li", {
      key: key
    }, /*#__PURE__*/React.createElement("div", {
      className: "row"
    }, entry.addr && /*#__PURE__*/React.createElement("div", {
      className: "col"
    }, /*#__PURE__*/React.createElement("code", null, entry.addr)), entry.doc && /*#__PURE__*/React.createElement("div", {
      className: "col"
    }, /*#__PURE__*/React.createElement("a", {
      href: `https://dweb.link/ipfs/${entry.doc}`
    }, entry.doc)), /*#__PURE__*/React.createElement("div", {
      className: "col col-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-danger text-link",
      role: "button",
      onClick: () => setEntries(_es => _es.filter(_e => _e.addr === entry.addr && _e.doc === entry.doc))
    }, "remove"))));
  })));
};
export const ProposalFormAddEntries = ({
  proposal
}) => {
  const {
    graph: {
      organs
    }
  } = useGraph();
  const {
    procedure: {
      proposalAddEntries
    },
    reloadProposal
  } = useProcedure();
  const [organ, setOrgan] = useState();
  const [entries, setEntries] = useState([]);

  const removeEntry = entry => setEntries(es => es.filter(ese => ese.address !== entry.address || `${ese.cid}` !== `${entry.cid}`));

  return /*#__PURE__*/React.createElement("div", {
    className: "procedure-proposal-proposalAddEntries"
  }, /*#__PURE__*/React.createElement(ContractSelector, {
    contracts: organs,
    onSelect: o => o && setOrgan(o)
  }), /*#__PURE__*/React.createElement("ul", {
    className: "list-unstyled"
  }, entries.map((e, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    className: "list-item"
  }, /*#__PURE__*/React.createElement("code", null, e.address), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("a", {
    href: `https://dweb.link/ipfs/${e.cid}`,
    target: "_blank"
  }, `${e.cid}`), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-sm btn-danger",
    onClick: () => removeEntry(e)
  }, "remove")))), /*#__PURE__*/React.createElement(OrganEntryForm, {
    onSave: entry => entry && setEntries([...entries, entry])
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (organ && entries) proposalAddEntries(proposal.key, organ.address, entries).then(() => reloadProposal(proposal.key)).catch(console.error);
    },
    className: "btn btn-primary"
  }, "Add Entries"));
};
export const ProposalFormRemoveEntry = ({
  proposal
}) => {
  const {
    graph: {
      organs
    }
  } = useGraph();
  const {
    procedure: {
      proposalRemoveEntries
    },
    reloadProposal
  } = useProcedure();
  const [organ, setOrgan] = useState();
  const [entries, setEntries] = useState([]);

  const removeEntry = entry => setEntries(es => es.filter(ese => ese.address !== entry.address || `${ese.cid}` !== `${entry.cid}`));

  return /*#__PURE__*/React.createElement("div", {
    className: "procedure-proposal-proposalRemoveEntries"
  }, /*#__PURE__*/React.createElement(ContractSelector, {
    contracts: organs,
    onSelect: o => o && setOrgan(o)
  }), organ && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("ul", {
    className: "list-unstyled"
  }, entries.map((e, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    className: "list-item"
  }, /*#__PURE__*/React.createElement("code", null, e.address), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("a", {
    href: `https://dweb.link/ipfs/${e.cid}`,
    target: "_blank"
  }, `${e.cid}`), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-sm btn-danger",
    onClick: () => removeEntry(e)
  }, "remove")))), /*#__PURE__*/React.createElement(OrganEntrySelector, {
    entries: organ.entries,
    onSelect: e => e && setEntries([...entries, e])
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (organ && entries.length > 0) proposalRemoveEntries(proposal.key, organ.address, entries.map(e => e.index)).then(() => reloadProposal(proposal.key)).catch(console.error);
    },
    className: "btn btn-primary"
  }, "Remove Entries"));
};
export const ProposalFormReplaceEntry = ({
  proposal
}) => {
  const {
    graph: {
      organs
    }
  } = useGraph();
  const {
    procedure: {
      proposalReplaceEntry
    },
    reloadProposal
  } = useProcedure();
  const [organ, setOrgan] = useState();
  const [index, setIndex] = useState();
  const [entry, setEntry] = useState();
  return /*#__PURE__*/React.createElement("div", {
    className: "procedure-proposal-proposalReplaceEntry"
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
      if (organ && index && entry) proposalReplaceEntry(proposal.key, organ.address, {
        index,
        ...entry
      }).then(() => reloadProposal(proposal.key)).catch(console.error);
    },
    className: "btn btn-primary"
  }, "Replace Entry"));
};
export const ProposalFormAddProcedure = ({
  proposal
}) => {
  const {
    graph: {
      organs
    }
  } = useGraph();
  const {
    procedure: {
      proposalAddProcedure
    },
    reloadProposal
  } = useProcedure();
  const [organ, setOrgan] = useState();
  const [procedure, setProcedure] = useState();
  return /*#__PURE__*/React.createElement("div", {
    className: "procedure-proposal-proposalAddProcedure"
  }, /*#__PURE__*/React.createElement(ContractSelector, {
    contracts: organs,
    onSelect: o => o && setOrgan(o)
  }), organ && /*#__PURE__*/React.createElement(React.Fragment, null, procedure && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("code", null, procedure.address), " ", /*#__PURE__*/React.createElement("span", {
    className: "text-info"
  }, `${procedure.permissions}`)), /*#__PURE__*/React.createElement(OrganProcedureForm, {
    onSave: p => p && setProcedure(p)
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (organ && procedure) proposalAddProcedure(proposal.key, organ.address, procedure).then(() => reloadProposal(proposal.key)).catch(console.error);
    },
    className: "btn btn-primary"
  }, "Add Procedure"));
};
export const ProposalFormRemoveProcedure = ({
  proposal
}) => {
  const {
    graph: {
      organs
    }
  } = useGraph();
  const {
    procedure: {
      proposalRemoveProcedure
    },
    reloadProposal
  } = useProcedure();
  const [organ, setOrgan] = useState();
  const [procedure, setProcedure] = useState();
  return /*#__PURE__*/React.createElement("div", {
    className: "procedure-proposal-proposalRemoveProcedure"
  }, /*#__PURE__*/React.createElement(ContractSelector, {
    contracts: organs,
    onSelect: o => o && setOrgan(o)
  }), organ && /*#__PURE__*/React.createElement(OrganProcedureSelector, {
    procedures: organ.procedures,
    onSelect: p => p && setProcedure(p)
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (organ && procedure) proposalRemoveProcedure(proposal.key, organ.address, procedure.address).then(() => reloadProposal(proposal.key)).catch(console.error);
    },
    className: "btn btn-primary"
  }, "Remove Procedure"));
};
export const ProposalFormReplaceProcedure = ({
  proposal
}) => {
  const {
    graph: {
      organs
    }
  } = useGraph();
  const {
    procedure,
    reloadProposal
  } = useProcedure();
  const {
    proposalReplaceProcedure
  } = procedure;
  const [organ, setOrgan] = useState();
  const [oldProcedure, setOldProcedure] = useState();
  const [newProcedure, setNewProcedure] = useState();
  return /*#__PURE__*/React.createElement("div", {
    className: "procedure-proposal-proposalReplaceProcedure"
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
      if (organ && oldProcedure && newProcedure) proposalReplaceProcedure(proposal.key, organ.address, oldProcedure.address, newProcedure).then(() => reloadProposal(proposal.key)).catch(console.error);
    },
    className: "btn btn-primary"
  }, "Replace Procedure"));
};
export const ProposalFormCall = ({
  proposal
}) => {
  const {
    procedure: {
      proposalCall
    },
    reloadProposal
  } = useProcedure();
  const [state, setState] = useState();
  return /*#__PURE__*/React.createElement("div", {
    className: "procedure-proposal-proposalCall"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      proposalCall(proposal.key).then(() => reloadProposal(proposal.key)).catch(console.error);
    },
    className: "btn btn-warning"
  }, "Add Special Call"));
};
export const MetadataForm = ({
  defaultValue,
  onChange
}) => {
  const cidRef = React.useRef();
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("input", {
    ref: cidRef,
    type: "text",
    name: "cid",
    placeholder: "cid",
    className: "form-control"
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => {
      try {
        const metadata = new CID(cidRef.current.value);
        onChange(metadata);
      } catch (_error) {}
    }
  }, "Save"));
};
export const AddressInput = ({
  address,
  onChange
}) => {
  return /*#__PURE__*/React.createElement("input", {
    type: "text",
    defaultValue: address,
    onChange: e => onChange(e.target.value),
    placeholder: "Address",
    className: "form-control"
  });
};
export const EntryForm = ({
  defaultValue,
  onChange
}) => {
  const [value, setValue] = useState(defaultValue);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(AddressInput, {
    defaultValue: defaultValue && defaultValue.addr,
    onChange: addr => setValue({ ...value,
      addr
    })
  }), /*#__PURE__*/React.createElement(CIDInput, {
    cid: defaultValue && defaultValue.doc,
    onSave: doc => setValue({ ...value,
      doc
    })
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => {
      try {
        const metadata = new CID(value);
        onChange(value);
      } catch (_error) {}
    }
  }, "Save"));
};
export const EntriesForm = ({
  defaultValue,
  onChange
}) => {
  const [entries, setEntries] = useState(defaultValue || []);

  const handleChange = _entries => {
    setEntries(_entries);
    onChange(_entries);
  };

  return /*#__PURE__*/React.createElement(React.Fragment, null, entries.map((entry, i) => /*#__PURE__*/React.createElement(EntryForm, {
    key: i,
    defaultValue: entry,
    onChange: _entry => {
      let _entries = entries;
      _entries[i] = _entry;
      handleChange(_entries);
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "entry-add"
  }, /*#__PURE__*/React.createElement(EntryForm, {
    onChange: _entry => handleChange([...entries, _entry])
  })));
};
export const ProposalOperationFormFunctionParam = ({
  param,
  type,
  ...props
}) => {
  switch (param) {
    case 'metadata':
      return type === 'select' ? /*#__PURE__*/React.createElement("p", {
        className: "text-danger"
      }, "Metadata selector not implemented.") : /*#__PURE__*/React.createElement(MetadataForm, props);

    case 'entries':
      return type === 'select' ? /*#__PURE__*/React.createElement(OrganEntrySelector, _extends({
        multiple: true
      }, props, {
        onSelect: props.onChange
      })) : /*#__PURE__*/React.createElement(EntriesForm, props);

    case 'entry':
      return type === 'select' ? /*#__PURE__*/React.createElement(OrganEntrySelector, _extends({}, props, {
        onSelect: props.onChange
      })) : /*#__PURE__*/React.createElement(OrganEntryForm, props);

    case 'organ':
      return type === 'select' ? /*#__PURE__*/React.createElement("p", {
        className: "text-danger"
      }, "Organ selector not implemented.") : /*#__PURE__*/React.createElement(OrganProcedureSelector, props);

    case 'procedure':
      return type === 'select' ? /*#__PURE__*/React.createElement(OrganProcedureSelector, _extends({}, props, {
        onSelect: props.onChange
      })) : /*#__PURE__*/React.createElement(OrganProcedureForm, props);

    case 'index':
      return type === 'select' ? /*#__PURE__*/React.createElement(OrganEntrySelector, _extends({}, props, {
        onSelect: props.onChange
      })) : /*#__PURE__*/React.createElement("input", {
        type: "text",
        placeholder: "Entry index"
      });

    case 'indexes':
      return type === 'select' ? /*#__PURE__*/React.createElement(OrganEntrySelector, _extends({
        multiple: true
      }, props, {
        onSelect: props.onChange
      })) : /*#__PURE__*/React.createElement("input", {
        type: "text",
        placeholder: "Entry index"
      });

    case 'permissions':
    case 'address':
    case 'addresses':
    default:
      return /*#__PURE__*/React.createElement(React.Fragment, null, param);
  }
};
export const ProposalOperationFormFunctionParameters = withOrganProvider(({
  operationFunction,
  defaultParams,
  onSave
}) => {
  const {
    organ
  } = useOrgan();
  const [params, setParams] = useState(defaultParams || []); // Forms' components default to inputs, some are selectors.

  const hasModeSelector = React.useMemo(() => ['removeEntries', 'replaceEntry', 'removeProcedure', 'replaceProcedure'].indexOf(operationFunction.key) >= 0, [operationFunction.key]);
  if (!organ) return /*#__PURE__*/React.createElement("p", null, "Loading organ...");

  const handleParamChange = i => v => {
    const _params = [...params];
    _params[i] = v;
    setParams(_params);
  };

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "operation-parameters"
  }, operationFunction && operationFunction.params && operationFunction.params.map((param, i) => /*#__PURE__*/React.createElement("div", {
    key: `${operationFunction.key}-param-${param}`
  }, params && params[i] ? /*#__PURE__*/React.createElement("pre", null, JSON.stringify(params[i], null, 2)) : /*#__PURE__*/React.createElement(ProposalOperationFormFunctionParam, {
    param: param,
    type: hasModeSelector && i === 0 ? 'select' : 'input',
    defaultValue: params && params[i],
    onChange: handleParamChange(i)
  })))), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      onSave(params);
      setParams([]);
    },
    className: "btn btn-primary"
  }, "Save"));
});
export const ProposalOperationFormFunction = ({
  functionSelector,
  defaultTarget,
  defaultParams,
  onSave
}) => {
  const {
    graph
  } = useGraph();
  const {
    procedure
  } = useProcedure();
  const targetOrgans = React.useMemo(() => graph.organs.filter(o => o.procedures.find(op => op.address === procedure.address)), [graph.organs, procedure.address]);
  const [target, setTarget] = useState(defaultTarget);
  const operationFunction = Procedure.OPERATIONS_FUNCTIONS.find(pof => pof.funcSig === functionSelector);
  if (!operationFunction) return /*#__PURE__*/React.createElement("p", {
    className: "text-danger"
  }, "Operation not found.");else if (!operationFunction.target) return /*#__PURE__*/React.createElement("p", {
    className: "text-danger"
  }, "Operation not supported."); // @todo Target can be another procedure, or Token Contract ...

  const targets = operationFunction.target === "organ" ? targetOrgans : operationFunction.target === "procedure" ? graph.procedures : [...graph.organs, ...graph.procedures]; // @todo : Handle other kinds of target : chainable procedures, token contracts...

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ContractSelector, {
    contracts: targets,
    onSelect: o => o && setTarget(o)
  }), target && target.address && /*#__PURE__*/React.createElement(ProposalOperationFormFunctionParameters, {
    operationFunction: operationFunction,
    defaultParams: defaultParams,
    organ: target,
    onSave: params => {
      onSave({
        target,
        params
      });
      setTarget(null);
    }
  }));
};
export const ProposalOperationForm = ({
  onSave
}) => {
  const [functionSelector, setFunctionSelector] = useState(null);
  const [values, setValues] = useState({
    target: null,
    params: []
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "card card-body border-light"
  }, /*#__PURE__*/React.createElement("select", {
    defaultValue: functionSelector,
    onChange: e => setFunctionSelector(e.target.value),
    className: "form-control"
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "-- Select an action"), Procedure.OPERATIONS_FUNCTIONS.map(op => /*#__PURE__*/React.createElement("option", {
    key: op.key,
    value: op.funcSig
  }, op.label))), functionSelector && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("hr", null), values.target && values.params.length > 0 ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", null, "Target"), "\xA0", values.target.address, /*#__PURE__*/React.createElement("br", null), values.params.map((param, i) => /*#__PURE__*/React.createElement("div", {
    key: i
  }, /*#__PURE__*/React.createElement("pre", null, JSON.stringify(param, null, 2))))) : /*#__PURE__*/React.createElement(ProposalOperationFormFunction, {
    defaultTarget: values.target,
    defaultParams: values.params,
    onSave: ({
      target,
      params
    }) => setValues({
      target,
      params
    }),
    functionSelector: functionSelector
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-light",
    onClick: () => {
      onSave({
        functionSelector,
        target: values.target,
        params: values.params
      });
      setValues({
        target: null,
        params: []
      });
    }
  }, "Add operation")));
};
export const ProposalFormCreate = ({
  onCreate
}) => {
  const {
    procedure
  } = useProcedure();
  const [metadata, setMetadata] = React.useState(null);
  const [operations, setOperations] = React.useState([]);
  return /*#__PURE__*/React.createElement("div", {
    className: "procedure-proposal-create"
  }, /*#__PURE__*/React.createElement("strong", null, "Metadata"), /*#__PURE__*/React.createElement("div", null, !metadata ? /*#__PURE__*/React.createElement(MetadataForm, {
    defaultValue: metadata,
    onChange: setMetadata
  }) : /*#__PURE__*/React.createElement("a", {
    href: `https://dweb.link/ipfs/${metadata}`,
    target: "_blank"
  }, `${metadata}`)), /*#__PURE__*/React.createElement("strong", null, "Operations"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(ProposalOperationForm, {
    onSave: op => {
      setOperations([...operations, op]);
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(ProposalOperations, {
    proposal: {
      operations
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      procedure.propose(metadata, operations).catch(console.error);
    },
    className: "btn btn-primary"
  }, "Create")));
};