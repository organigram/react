import React from 'react';
import { Organ as OrganClass, ProcedureNomination as ProcedureNominationClass, ProcedureVote as ProcedureVoteClass } from "@organigram/client-js";
import { useGraph } from "../../contexts/graph";
import { EMPTY_CID } from '@organigram/client-js/dist/ipfs';
export const GraphContracts = () => {
  const {
    graph,
    addContracts,
    removeContracts
  } = useGraph();
  const contracts = !graph ? [] : [...graph.organs.map(({
    address
  }) => address), ...graph.procedures.map(({
    address
  }) => address)];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h3", null, "Contracts"), contracts && contracts.length > 0 && /*#__PURE__*/React.createElement("ul", {
    className: "list-unstyled mb-2"
  }, contracts.map(address => /*#__PURE__*/React.createElement("li", {
    key: address,
    className: "list-item"
  }, address, " ", /*#__PURE__*/React.createElement("span", {
    onClick: () => removeContracts([address]),
    className: "text-danger"
  }, "x")))), /*#__PURE__*/React.createElement("form", {
    className: "form row g-3 mb-2",
    onSubmit: e => {
      e.preventDefault();
      addContracts([e.currentTarget.ethereum.value]);
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-6"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "ethereum",
    className: "form-control",
    placeholder: "Ethereum address"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-auto"
  }, /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-primary"
  }, "Add Contract"))), /*#__PURE__*/React.createElement("div", {
    className: "alert alert-dark mt-2 mb-0"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary mr-1",
    onClick: async () => OrganClass.deploy(EMPTY_CID).then(o => addContracts([o.address])).catch(error => console.error(error.message))
  }, "Deploy organ"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary mx-1",
    onClick: async () => ProcedureNominationClass.deploy(EMPTY_CID).then(o => addContracts([o.address])).catch(error => console.error(error.message))
  }, "Deploy nomination"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary ml-1",
    onClick: async () => ProcedureVoteClass.deploy(EMPTY_CID).then(o => addContracts([o.address])).catch(error => console.error(error.message))
  }, "Deploy vote")));
};
export default GraphContracts;
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