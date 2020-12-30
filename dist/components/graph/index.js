import React from 'react';
import { useGraph, withGraphProvider } from "../../contexts/graph";
import Organ from "../organ";
import Procedure from "../procedure";
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
    className: "card-group"
  }, /*#__PURE__*/React.createElement("div", {
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
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "card card-body bg-dark"
  }, /*#__PURE__*/React.createElement("h3", null, "Organs"), /*#__PURE__*/React.createElement("ul", {
    className: "list-unstyled"
  }, graph.organs.map(o => /*#__PURE__*/React.createElement("li", {
    key: o.address,
    className: "list-item mb-2"
  }, /*#__PURE__*/React.createElement(Organ, {
    organ: o
  }))))))));
};
export default withGraphProvider(Graph);