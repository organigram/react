import React from 'react';
import { useGraph, withGraphProvider } from "../../contexts/graph";
import Organ from "../organ";
import Procedure from "../procedures";
import Contracts from "./contracts";
export const Graph = props => {
  const {
    graph,
    loading,
    error
  } = useGraph();
  return /*#__PURE__*/React.createElement("div", props, loading && /*#__PURE__*/React.createElement("div", {
    className: "alert alert-info"
  }, "Loading graph..."), error && /*#__PURE__*/React.createElement("div", {
    className: "alert alert-danger"
  }, "Error: ", /*#__PURE__*/React.createElement("pre", null, JSON.stringify(error, null, 2))), graph && /*#__PURE__*/React.createElement("div", {
    className: "graph"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card card-body bg-secondary"
  }, /*#__PURE__*/React.createElement(Contracts, null)), /*#__PURE__*/React.createElement("div", {
    className: "card-stack"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card card-body bg-dark"
  }, /*#__PURE__*/React.createElement("h3", null, "Organs"), /*#__PURE__*/React.createElement("ul", {
    className: "list-unstyled row"
  }, graph.organs.map(o => /*#__PURE__*/React.createElement("li", {
    key: o.address,
    className: "col-4 mb-2"
  }, /*#__PURE__*/React.createElement(Organ, {
    organ: o
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "card card-body bg-dark"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "card-title"
  }, "Procedures"), /*#__PURE__*/React.createElement("ul", {
    className: "list-unstyled"
  }, graph.procedures.map(p => /*#__PURE__*/React.createElement("li", {
    key: p.address,
    className: "list-item mb-2"
  }, /*#__PURE__*/React.createElement(Procedure, {
    procedure: p
  }))))))));
};
export default withGraphProvider(Graph);