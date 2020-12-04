import organ from '@organigram/client-js/dist/organ';
import React, { useState } from 'react';
import { useOrgan, withOrganProvider } from "../../contexts/organ";
export const Organ = props => {
  const {
    organ,
    loading,
    error
  } = useOrgan();
  const [showForms, setShowForms] = useState(false);

  const toggleForms = () => setShowForms(sf => !sf);

  return /*#__PURE__*/React.createElement("div", props, loading && /*#__PURE__*/React.createElement("p", null, "Loading organ..."), error && /*#__PURE__*/React.createElement("pre", null, "Error: ", JSON.stringify(error, null, 2)), organ && /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("h4", null, organ.address), /*#__PURE__*/React.createElement("h5", null, "Metadata"), /*#__PURE__*/React.createElement("code", null, `${organ.metadata.cid}`), " ", /*#__PURE__*/React.createElement("a", {
    href: `https://ipfs.io/ipfs/${organ.metadata.cid}`,
    target: "_blank"
  }, "view"), /*#__PURE__*/React.createElement("h5", null, "Procedures"), /*#__PURE__*/React.createElement("ul", {
    className: "list-unstyled"
  }, organ.procedures.map((op, i) => /*#__PURE__*/React.createElement("li", {
    key: op.address,
    className: "list-item"
  }, /*#__PURE__*/React.createElement("code", null, op.address), " ", /*#__PURE__*/React.createElement("span", {
    className: "text-info"
  }, `${op.permissions}`)))), /*#__PURE__*/React.createElement("h5", null, "Entries"), /*#__PURE__*/React.createElement("ul", {
    className: "list-unstyled"
  }, organ.entries.map((e, i) => /*#__PURE__*/React.createElement("li", {
    key: e.index,
    className: "list-item"
  }, /*#__PURE__*/React.createElement("em", null, e.index), " ", /*#__PURE__*/React.createElement("code", null, e.address), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("a", {
    href: `https://ipfs.io/ipfs/${e.cid}`,
    target: "_blank"
  }, `${e.cid}`)))), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-sm",
    onClick: () => toggleForms()
  }, "toggle forms"), showForms && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(OrganFormUpdateMetadata, null), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(OrganFormAddEntries, null), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(OrganFormRemoveEntries, null), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(OrganFormReplaceEntry, null), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(OrganFormAddProcedure, null), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(OrganFormRemoveProcedure, null), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(OrganFormReplaceProcedure, null)))));
};
export default withOrganProvider(Organ);
export const OrganEntryForm = ({
  onSave
}) => {
  return /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      const {
        address,
        cid
      } = e.currentTarget;
      onSave({
        address: address.value,
        cid: cid.value
      });
      e.currentTarget.reset();
    },
    className: "form"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "address",
    placeholder: "address",
    className: "form-control"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "cid",
    placeholder: "cid",
    className: "form-control"
  })), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-sm"
  }, "save"));
};
export const OrganEntrySelector = ({
  entries,
  onSelect
}) => {
  const handleChange = event => {
    const entry = entries.find(e => e.index === event.target.value);
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
      onSave({
        address: address.value,
        permissions: permissions.value
      });
      e.currentTarget.reset();
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
    }
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
    onClick: () => updateMetadata(cidRef.current.value).catch(console.error)
  }, "Update Metadata"));
};
export const OrganFormAddEntries = () => {
  const {
    organ: {
      addEntries
    }
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
    onClick: () => addEntries(entries).catch(console.error),
    className: "btn btn-primary"
  }, "Add Entries"));
};
export const OrganFormRemoveEntries = () => {
  const {
    organ: {
      entries: organEntries,
      removeEntries
    }
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
    onClick: () => removeEntries(indexes).catch(console.error),
    className: "btn btn-primary"
  }, "Remove Entries"));
};
export const OrganFormReplaceEntry = () => {
  const {
    organ: {
      entries: organEntries,
      replaceEntry
    }
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
    onClick: () => replaceEntry(index, entry).catch(console.error),
    className: "btn btn-primary"
  }, "Replace Entry"));
};
export const OrganFormAddProcedure = () => {
  const {
    organ: {
      addProcedure
    }
  } = useOrgan();
  const [procedure, setProcedure] = useState();
  return /*#__PURE__*/React.createElement("div", {
    className: "organ-addProcedure"
  }, /*#__PURE__*/React.createElement(OrganProcedureForm, {
    onSave: p => p && setProcedure(p)
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => addProcedure(procedure).catch(console.error),
    className: "btn btn-primary"
  }, "Add Procedure"));
};
export const OrganFormRemoveProcedure = () => {
  const {
    organ: {
      procedures,
      removeProcedure
    }
  } = useOrgan();
  const [procedure, setProcedure] = useState();
  return /*#__PURE__*/React.createElement("div", {
    className: "organ-removeProcedure"
  }, /*#__PURE__*/React.createElement(OrganProcedureSelector, {
    procedures: procedures,
    onSelect: p => p && setProcedure(p)
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => removeProcedure(procedure.address).catch(console.error),
    className: "btn btn-primary"
  }, "Remove Procedure"));
};
export const OrganFormReplaceProcedure = () => {
  const {
    organ: {
      procedures,
      replaceProcedure
    }
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
    onClick: () => replaceProcedure(oldProcedure.address, newProcedure).catch(console.error),
    className: "btn btn-primary"
  }, "Replace Procedure"));
};