function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import organ from '@organigram/client-js/dist/organ';
import React, { useState } from 'react';
import { useOrgan, withOrganProvider } from "../../contexts/organ";
import Upload from '../vault/upload';
export const Organ = props => {
  const {
    organ,
    loading,
    error,
    reloadData,
    reloadEntries,
    reloadProcedures
  } = useOrgan();
  const [showForms, setShowForms] = useState(false);

  const toggleForms = () => setShowForms(sf => !sf);

  return /*#__PURE__*/React.createElement("div", _extends({}, props, {
    id: organ.address && `organ-${organ.address}`
  }), loading && /*#__PURE__*/React.createElement("p", null, "Loading organ..."), error && /*#__PURE__*/React.createElement("pre", null, "Error: ", JSON.stringify(error, null, 2)), organ && /*#__PURE__*/React.createElement("div", {
    className: "organ card card-body bg-secondary"
  }, organ.metadata && organ.metadata.data && organ.metadata.data.name && /*#__PURE__*/React.createElement("h5", {
    className: "card-title"
  }, `${organ.metadata.data.name}`), /*#__PURE__*/React.createElement("strong", null, `${organ.address}`), /*#__PURE__*/React.createElement("u", null, /*#__PURE__*/React.createElement("em", null, "Balance")), /*#__PURE__*/React.createElement("p", null, "\u039E ", organ.balance), /*#__PURE__*/React.createElement("u", null, /*#__PURE__*/React.createElement("em", null, "Metadata")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => reloadData(),
    className: "btn btn-sm"
  }, "reload"), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("code", null, `${organ.metadata}`), " ", /*#__PURE__*/React.createElement("a", {
    href: `ipfs://${organ.metadata}`,
    target: "_blank"
  }, "view"))), /*#__PURE__*/React.createElement("u", null, /*#__PURE__*/React.createElement("em", null, "Procedures")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => reloadProcedures(),
    className: "btn btn-sm"
  }, "reload"), /*#__PURE__*/React.createElement("ul", {
    className: "list-unstyled mb-1"
  }, organ.procedures.map(op => /*#__PURE__*/React.createElement("li", {
    key: `organ-procedure-${op.address}`,
    className: "list-item"
  }, /*#__PURE__*/React.createElement("code", null, op.address), " ", /*#__PURE__*/React.createElement("span", {
    className: "text-info"
  }, `${op.permissions}`))))), /*#__PURE__*/React.createElement("u", null, /*#__PURE__*/React.createElement("em", null, "Entries")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => reloadEntries(),
    className: "btn btn-sm"
  }, "reload"), /*#__PURE__*/React.createElement("ul", {
    className: "list-unstyled mb-1"
  }, organ.entries.map(e => /*#__PURE__*/React.createElement("li", {
    key: `entry-${e.index}`,
    className: "list-item"
  }, /*#__PURE__*/React.createElement("em", null, e.index), " ", /*#__PURE__*/React.createElement("code", null, e.address), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("small", null, /*#__PURE__*/React.createElement("a", {
    href: `ipfs://${e.cid}`,
    target: "_blank"
  }, `${e.cid}`)))))), /*#__PURE__*/React.createElement("hr", {
    className: "mb-1"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-sm",
    onClick: () => toggleForms()
  }, "toggle forms"), showForms && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(OrganFormUpdateMetadata, null), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(OrganFormAddEntries, null), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(OrganFormRemoveEntries, null), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(OrganFormReplaceEntry, null), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(OrganFormAddProcedure, null), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(OrganFormRemoveProcedure, null), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(OrganFormReplaceProcedure, null)))));
};
export default withOrganProvider(Organ);
export const OrganEntryForm = ({
  onSave
}) => {
  const [cid, setCid] = useState();
  const [address, setAddress] = useState("");
  React.useEffect(() => {
    if (address && cid && onSave) onSave({
      address,
      cid
    });
  }, [cid, address]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "address",
    placeholder: "address",
    defaultValue: address,
    onChange: e => setAddress(e.target.value),
    className: "form-control"
  }), cid && /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("code", null, `${cid}`), "\xA0", /*#__PURE__*/React.createElement("a", {
    href: `ipfs://${cid}`,
    target: "_blank"
  }, "open")), /*#__PURE__*/React.createElement(Upload, {
    cid: cid,
    onCID: c => setCid(c)
  }));
};
export const OrganEntrySelector = ({
  onSelect
}) => {
  const {
    organ: {
      entries
    }
  } = useOrgan();

  const handleChange = event => {
    const entry = entries && entries.find(e => e.index === event.target.value);
    onSelect(entry);
  };

  return /*#__PURE__*/React.createElement("select", {
    onChange: handleChange,
    className: "form-control"
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "-- Select an entry"), entries.map(e => /*#__PURE__*/React.createElement("option", {
    key: e.index,
    value: e.index
  }, `${e.index} ${e.address} [${e.cid}]`)));
};
export const OrganProcedureForm = ({
  onSave
}) => {
  return /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      const {
        address,
        permissions
      } = e.currentTarget;

      if (onSave) {
        onSave({
          address: address.value,
          permissions: permissions.value
        });
        e.currentTarget.reset();
      }
    },
    className: "form"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "address",
    placeholder: "address",
    className: "form-control"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "permissions",
    placeholder: "permissions",
    className: "form-control"
  })), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-sm"
  }, "save"));
};
export const OrganProcedureSelector = ({
  procedures,
  onSelect
}) => {
  const handleChange = event => {
    const procedure = procedures.find(p => p.address === event.target.value);
    onSelect(procedure);
  };

  return /*#__PURE__*/React.createElement("select", {
    onChange: handleChange,
    className: "form-control"
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "-- Select a procedure"), procedures.map(p => /*#__PURE__*/React.createElement("option", {
    key: p.address,
    value: p.address
  }, `${p.address} [${p.permissions}]`)));
};
export const OrganFormUpdateMetadata = () => {
  const {
    organ: {
      updateMetadata
    },
    reloadData
  } = useOrgan();
  const cidRef = React.useRef();
  return /*#__PURE__*/React.createElement("div", {
    className: "organ-updateMetadata"
  }, /*#__PURE__*/React.createElement("input", {
    ref: cidRef,
    type: "text",
    name: "cid",
    placeholder: "cid",
    className: "form-control"
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => {
      updateMetadata(cidRef.current.value).then(() => reloadData()).catch(console.error);
    }
  }, "Update Metadata"));
};
export const OrganFormAddEntries = () => {
  const {
    organ: {
      addEntries
    },
    reloadEntries
  } = useOrgan();
  const [entries, setEntries] = useState([]);
  return /*#__PURE__*/React.createElement("div", {
    className: "organ-addEntries"
  }, /*#__PURE__*/React.createElement("ul", {
    className: "list-unstyled"
  }, entries.map((e, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    className: "list-item"
  }, /*#__PURE__*/React.createElement("em", null, e.address), /*#__PURE__*/React.createElement("br", null), `${e.cid}`)), /*#__PURE__*/React.createElement("li", {
    key: "add"
  }, /*#__PURE__*/React.createElement(OrganEntryForm, {
    onSave: ({
      address,
      cid
    }) => setEntries(es => [...es, {
      address,
      cid
    }])
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      addEntries(entries).then(() => reloadEntries()).catch(console.error);
    },
    className: "btn btn-primary"
  }, "Add Entries"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(Upload, {
    onUpload: () => alert("Uploaded.")
  }));
};
export const OrganFormRemoveEntries = () => {
  const {
    organ: {
      entries: organEntries,
      removeEntries
    },
    reloadEntries
  } = useOrgan();
  const [entries, setEntries] = useState([]);
  const indexes = entries.map(e => e.index);
  return /*#__PURE__*/React.createElement("div", {
    className: "organ-removeEntries"
  }, /*#__PURE__*/React.createElement("ul", {
    className: "list-unstyled"
  }, entries.map(e => /*#__PURE__*/React.createElement("li", {
    className: "list-item",
    key: e.index
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => setEntries(es => es.filter(ese => ese.index !== e.index))
  }, "x"), `${e.address} [${e.cid}]`)), /*#__PURE__*/React.createElement("li", {
    key: "add"
  }, /*#__PURE__*/React.createElement(OrganEntrySelector, {
    entries: organEntries,
    onSelect: e => e && !entries.find(ese => ese.index === e.index) && setEntries(es => [...es, e])
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      removeEntries(indexes).then(() => reloadEntries()).catch(console.error);
    },
    className: "btn btn-primary"
  }, "Remove Entries"));
};
export const OrganFormReplaceEntry = () => {
  const {
    organ: {
      entries: organEntries,
      replaceEntry
    },
    reloadEntries
  } = useOrgan();
  const [index, setIndex] = useState();
  const [entry, setEntry] = useState();
  return /*#__PURE__*/React.createElement("div", {
    className: "organ-replaceEntry"
  }, /*#__PURE__*/React.createElement(OrganEntrySelector, {
    entries: organEntries,
    onSelect: e => e && setIndex(e.index)
  }), /*#__PURE__*/React.createElement(OrganEntryForm, {
    onSave: e => e && setEntry(e)
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      replaceEntry(index, entry).then(() => reloadEntries()).catch(console.error);
    },
    className: "btn btn-primary"
  }, "Replace Entry"));
};
export const OrganFormAddProcedure = () => {
  const {
    organ: {
      addProcedure
    },
    reloadProcedures
  } = useOrgan();
  const [procedure, setProcedure] = useState();
  return /*#__PURE__*/React.createElement("div", {
    className: "organ-addProcedure"
  }, /*#__PURE__*/React.createElement(OrganProcedureForm, {
    onSave: p => p && setProcedure(p)
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (procedure) {
        addProcedure(procedure).then(() => reloadProcedures()).catch(console.error);
      }
    },
    className: "btn btn-primary"
  }, "Add Procedure"));
};
export const OrganFormRemoveProcedure = () => {
  const {
    organ: {
      procedures,
      removeProcedure
    },
    reloadProcedures
  } = useOrgan();
  const [procedure, setProcedure] = useState();
  return /*#__PURE__*/React.createElement("div", {
    className: "organ-removeProcedure"
  }, /*#__PURE__*/React.createElement(OrganProcedureSelector, {
    procedures: procedures,
    onSelect: p => p && setProcedure(p)
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      removeProcedure(procedure.address).then(() => reloadProcedures()).catch(console.error);
    },
    className: "btn btn-primary"
  }, "Remove Procedure"));
};
export const OrganFormReplaceProcedure = () => {
  const {
    organ: {
      procedures,
      replaceProcedure
    },
    reloadProcedures
  } = useOrgan();
  const [oldProcedure, setOldProcedure] = useState();
  const [newProcedure, setNewProcedure] = useState();
  return /*#__PURE__*/React.createElement("div", {
    className: "organ-replaceProcedure"
  }, /*#__PURE__*/React.createElement(OrganProcedureSelector, {
    procedures: procedures,
    onSelect: p => p && setOldProcedure(p)
  }), /*#__PURE__*/React.createElement(OrganProcedureForm, {
    onSave: p => p && setNewProcedure(p)
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      replaceProcedure(oldProcedure.address, newProcedure).then(() => reloadProcedures()).catch(console.error);
    },
    className: "btn btn-primary"
  }, "Replace Procedure"));
};