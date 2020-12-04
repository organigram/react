import organ from '@organigram/client-js/dist/organ';
import React from 'react';
import { useGraph, withGraphProvider } from "../../contexts/graph";
import Organ from "../organ";
import Procedure from "../procedure";
export const Graph = props => {
  const {
    graph,
    loading,
    error,
    addContracts,
    removeContracts
  } = useGraph();
  const contracts = graph && [...graph.organs.map(({
    address
  }) => address), ...graph.procedures.map(({
    address
  }) => address)];
  return /*#__PURE__*/React.createElement("div", props, loading && /*#__PURE__*/React.createElement("div", {
    className: "alert alert-info"
  }, "Loading graph..."), error && /*#__PURE__*/React.createElement("div", {
    className: "alert alert-danger"
  }, "Error: ", /*#__PURE__*/React.createElement("pre", null, JSON.stringify(error, null, 2))), graph && /*#__PURE__*/React.createElement("div", {
    className: "graph"
  }, /*#__PURE__*/React.createElement("h2", null, "Contracts"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("ul", {
    className: "list-unstyled"
  }, contracts.map(address => /*#__PURE__*/React.createElement("li", {
    key: address,
    className: "list-item"
  }, address, " ", /*#__PURE__*/React.createElement("span", {
    onClick: () => removeContracts([address]),
    className: "text-danger"
  }, "x")))), /*#__PURE__*/React.createElement("form", {
    className: "form",
    onSubmit: e => {
      e.preventDefault();
      addContracts([e.currentTarget.address.value]);
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "address",
    placeholder: "address"
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-warning"
  }, "Add Contract"))), /*#__PURE__*/React.createElement("h2", null, "Organs"), /*#__PURE__*/React.createElement("ul", {
    className: "list-unstyled"
  }, graph.organs.map(o => /*#__PURE__*/React.createElement("li", {
    key: o.address,
    className: "list-item mb-3"
  }, /*#__PURE__*/React.createElement(Organ, {
    organ: o
  })))), /*#__PURE__*/React.createElement("h2", null, "Procedures"), /*#__PURE__*/React.createElement("ul", {
    className: "list-unstyled"
  }, graph.procedures.map(p => /*#__PURE__*/React.createElement("li", {
    key: p.address,
    className: "list-item mb-3"
  }, /*#__PURE__*/React.createElement(Procedure, {
    procedure: p
  }))))));
};
export default withGraphProvider(Graph);
export const ContractSelector = ({
  contracts,
  onSelect
}) => {
  const handleChange = event => {
    const contract = contracts.find(c => c.address === event.target.value);
    if (contract) onSelect(contract);
  };

  return /*#__PURE__*/React.createElement("select", {
    onChange: handleChange,
    className: "form-control"
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "-- Select a contract"), contracts.map(c => /*#__PURE__*/React.createElement("option", {
    key: c.address,
    value: c.address
  }, c.address)));
};