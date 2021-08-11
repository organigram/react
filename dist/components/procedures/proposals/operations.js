import React from 'react';
export const ProposalOperationParam = ({
  param
}) => {
  switch (param.type) {
    case 'metadata':
      return /*#__PURE__*/React.createElement(React.Fragment, null, "Metadata\xA0", /*#__PURE__*/React.createElement("a", {
        href: `https://dweb.link/ipfs/${param.value.toString()}`,
        target: "_blank"
      }, param.value.toString()));

    case 'entries':
      return /*#__PURE__*/React.createElement(React.Fragment, null, "Entries", /*#__PURE__*/React.createElement("ul", null, param.value.map(entry => entry && (entry.addr || entry.doc) && /*#__PURE__*/React.createElement("li", {
        className: "list-item",
        key: `entry-${entry.addr}-${entry.doc.toString()}`
      }, entry.addr && /*#__PURE__*/React.createElement("code", null, entry.addr), entry.addr && entry.doc && /*#__PURE__*/React.createElement("br", null), entry.doc && /*#__PURE__*/React.createElement(React.Fragment, null, "Doc\xA0", /*#__PURE__*/React.createElement("a", {
        href: `https://dweb.link/ipfs/${entry.doc}`,
        target: "_blank"
      }, entry.doc.toString()))))));

    case 'entry':
      return /*#__PURE__*/React.createElement(React.Fragment, null, "Entry", /*#__PURE__*/React.createElement("br", null), param.value.addr && /*#__PURE__*/React.createElement("code", null, param.value.addr), param.value.addr && param.value.doc && /*#__PURE__*/React.createElement("br", null), param.value.doc && /*#__PURE__*/React.createElement(React.Fragment, null, "Doc\xA0", /*#__PURE__*/React.createElement("a", {
        href: `https://dweb.link/ipfs/${param.value.doc}`,
        target: "_blank"
      }, param.value.doc.toString())));

    case 'procedure':
      return /*#__PURE__*/React.createElement(React.Fragment, null, "Procedure\xA0", /*#__PURE__*/React.createElement("code", null, param.value));

    case 'organ':
      return /*#__PURE__*/React.createElement(React.Fragment, null, "Organ\xA0", /*#__PURE__*/React.createElement("code", null, param.value));

    case 'address':
      return /*#__PURE__*/React.createElement(React.Fragment, null, "Address\xA0", /*#__PURE__*/React.createElement("code", null, param.value));

    case 'addresses':
      return /*#__PURE__*/React.createElement(React.Fragment, null, "Addresses", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("ul", null, param.value.map(addr => addr && /*#__PURE__*/React.createElement("li", {
        className: "list-item",
        key: `address-${addr}}`
      }, /*#__PURE__*/React.createElement("code", null, addr)))));

    case 'index':
      return /*#__PURE__*/React.createElement(React.Fragment, null, "Index\xA0", param.value.toString());

    case 'indexes':
      return /*#__PURE__*/React.createElement(React.Fragment, null, "Indexes", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("ul", null, param.value.map(index => index && /*#__PURE__*/React.createElement("li", {
        className: "list-item",
        key: `index-${index}}`
      }, index.toString()))));

    case 'permissions':
      return /*#__PURE__*/React.createElement(React.Fragment, null, "Permissions\xA0", /*#__PURE__*/React.createElement("code", null, param.value.toString()));

    default:
      return /*#__PURE__*/React.createElement("span", {
        className: "text-danger"
      }, "Unknown parameter type.");
  }
};
export const ProposalOperationParams = ({
  operation
}) => /*#__PURE__*/React.createElement("div", null, operation.params.map((param, i) => /*#__PURE__*/React.createElement("div", {
  key: `param-${i}`
}, /*#__PURE__*/React.createElement(ProposalOperationParam, {
  param: param
}))));
export const ProposalOperation = ({
  proposal,
  operation
}) => {
  return /*#__PURE__*/React.createElement(React.Fragment, null, operation && operation.function && operation.function.key && ["addProcedure", "addEntries"].indexOf(operation.function.key) < 0 && /*#__PURE__*/React.createElement("pre", null, JSON.stringify(operation, null, 2)), operation.functionSelector ? /*#__PURE__*/React.createElement("strong", null, operation.index, " - ", /*#__PURE__*/React.createElement("code", null, operation.function.label), " on organ ", /*#__PURE__*/React.createElement("code", null, operation.organ)) : /*#__PURE__*/React.createElement("span", {
    className: "text-danger"
  }, "Operation not recognized."), operation.params && /*#__PURE__*/React.createElement(ProposalOperationParams, {
    operation: operation
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "Processed?"), "\xA0", /*#__PURE__*/React.createElement("span", null, operation.processed ? "Yes" : "No"), /*#__PURE__*/React.createElement("br", null)));
};
export const ProposalOperations = ({
  proposal
}) => {
  return /*#__PURE__*/React.createElement("div", {
    className: "proposal-operations list-group my-1"
  }, proposal.operations.map(po => po && /*#__PURE__*/React.createElement("div", {
    className: `proposal-operation list-group-item`,
    key: `proposal-operation-${po.index}`
  }, /*#__PURE__*/React.createElement(ProposalOperation, {
    proposal: proposal,
    operation: po
  }))));
};