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
  return /*#__PURE__*/React.createElement("div", props, loading && /*#__PURE__*/React.createElement("p", null, "Loading graph..."), error && /*#__PURE__*/React.createElement("pre", null, "Error: ", JSON.stringify(error, null, 2)), graph && /*#__PURE__*/React.createElement("div", {
    className: "graph"
  }, /*#__PURE__*/React.createElement("h3", null, "Organs"), /*#__PURE__*/React.createElement("ul", null, graph.organs.map(o => /*#__PURE__*/React.createElement("li", {
    key: o.address
  }, /*#__PURE__*/React.createElement(Organ, {
    organ: o
  })))), /*#__PURE__*/React.createElement("h3", null, "Procedures"), /*#__PURE__*/React.createElement("ul", null, graph.procedures.map(p => /*#__PURE__*/React.createElement("li", {
    key: p.address
  }, /*#__PURE__*/React.createElement(Procedure, {
    procedure: p
  }))))));
};
export default withGraphProvider(Graph);