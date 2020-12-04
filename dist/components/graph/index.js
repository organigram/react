import React from 'react';
import { useGraph, withGraphProvider } from "../../contexts/graph";
import Organ from "../organ";
import Procedure from "../procedure";
export const Graph = props => {
  const {
    graph,
    loading,
    error
  } = useGraph();
  return /*#__PURE__*/React.createElement("div", props, /*#__PURE__*/React.createElement("h1", null, "Graph Explorer"), loading && /*#__PURE__*/React.createElement("div", {
    className: "alert alert-info"
  }, "Loading graph..."), error && /*#__PURE__*/React.createElement("div", {
    className: "alert alert-danger"
  }, "Error: ", /*#__PURE__*/React.createElement("pre", null, JSON.stringify(error, null, 2))), graph && /*#__PURE__*/React.createElement("div", {
    className: "graph"
  }, /*#__PURE__*/React.createElement("h2", null, "Organs"), /*#__PURE__*/React.createElement("ul", {
    className: "list-unstyled"
  }, graph.organs.map(o => /*#__PURE__*/React.createElement("li", {
    key: o.address,
    className: "list-item"
  }, /*#__PURE__*/React.createElement(Organ, {
    organ: o
  })))), /*#__PURE__*/React.createElement("h2", null, "Procedures"), /*#__PURE__*/React.createElement("ul", {
    className: "list-unstyled"
  }, graph.procedures.map(p => /*#__PURE__*/React.createElement("li", {
    key: p.address,
    className: "list-item"
  }, /*#__PURE__*/React.createElement(Procedure, {
    procedure: p
  }))))));
};
export default withGraphProvider(Graph);