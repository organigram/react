import React, { useState } from 'react';
import { OrganEntryForm, OrganEntrySelector, OrganProcedureForm, OrganProcedureSelector } from '../organ';
import { useProcedure, withProcedureProvider } from "../../contexts/procedure";
import { useGraph } from "../../contexts/graph";
import { ContractSelector } from '../graph/contracts';
import graph from '@organigram/client-js/dist/graph';
import { ProposalOperations } from './proposals/operations';
import { Proposals } from './proposals';
export const Procedure = props => {
  const {
    graph
  } = useGraph();
  const {
    procedure,
    loading,
    error,
    reloadData,
    reloadProposals
  } = useProcedure();
  const [ProcedureComponent, setProcedureComponent] = useState();
  React.useEffect(async () => {
    if (procedure?.type?.key) {
      switch (procedure.type.key) {
        case 'nomination':
        case 'vote':
        case 'erc20vote':
          setProcedureComponent( /*#__PURE__*/React.lazy(() => import(`@organigram/procedures/dist/${procedure.type.key}/procedureComponent`)));
          break;

        default:
          setProcedureComponent();
      }
    }
  }, [procedure]); // @todo : Explain this.

  if (!procedure) {
    return loading ? props.loading || /*#__PURE__*/React.createElement("p", {
      className: "text-info"
    }, "Loading.") : props.not_found || /*#__PURE__*/React.createElement("p", {
      className: "text-danger"
    }, "Procedure not found.");
  }

  const targetOrgans = React.useMemo(() => graph.organs.filter(o => o.procedures.find(op => op.address === procedure.address)), [graph.organs, procedure.address]);
  return /*#__PURE__*/React.createElement("div", {
    id: procedure.address && `procedure-${procedure.address}`
  }, loading && /*#__PURE__*/React.createElement("p", null, "Loading."), error && /*#__PURE__*/React.createElement("pre", null, "Error: ", JSON.stringify(error, null, 2)), procedure && procedure.type && ProcedureComponent && /*#__PURE__*/React.createElement("div", {
    className: "procedure card card-body bg-secondary"
  }, procedure.metadata && procedure.metadata.data && procedure.metadata.data.name && /*#__PURE__*/React.createElement("h5", {
    className: "card-title"
  }, `${procedure.metadata.data.name}`), /*#__PURE__*/React.createElement("code", null, `${procedure.address}`), /*#__PURE__*/React.createElement("p", null, `${procedure.type.label}`), /*#__PURE__*/React.createElement(React.Suspense, {
    fallback: /*#__PURE__*/React.createElement("p", null, "Loading...")
  }, /*#__PURE__*/React.createElement(ProcedureComponent, props)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, "Proposers: ", /*#__PURE__*/React.createElement("a", {
    href: `#organ-${procedure.proposers}`
  }, procedure.proposers)), /*#__PURE__*/React.createElement("div", null, "Moderators: ", /*#__PURE__*/React.createElement("a", {
    href: `#organ-${procedure.moderators}`
  }, procedure.moderators)), /*#__PURE__*/React.createElement("div", null, "Deciders: ", /*#__PURE__*/React.createElement("a", {
    href: `#organ-${procedure.deciders}`
  }, procedure.deciders)), /*#__PURE__*/React.createElement("div", null, "Moderation: ", procedure.withModeration.toString()), /*#__PURE__*/React.createElement("div", null, "Target organs:", /*#__PURE__*/React.createElement("ul", null, targetOrgans.map(to => /*#__PURE__*/React.createElement("li", {
    key: `target-organ-${to.address}`
  }, /*#__PURE__*/React.createElement("a", {
    href: `#organ-${to.address}`
  }, to.address), "\xA0", /*#__PURE__*/React.createElement("code", null, to.procedures.find(top => top.address === procedure.address).permissions.toString())))))), /*#__PURE__*/React.createElement("u", null, /*#__PURE__*/React.createElement("em", null, "Metadata")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => reloadData(),
    className: "btn btn-sm"
  }, "reload"), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("code", null, `${procedure.metadata}`), " ", /*#__PURE__*/React.createElement("a", {
    href: `ipfs://${procedure.metadata}`,
    target: "_blank"
  }, "view"))), /*#__PURE__*/React.createElement("u", null, /*#__PURE__*/React.createElement("em", null, "Proposals")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => reloadProposals(),
    className: "btn btn-sm"
  }, "reload"), /*#__PURE__*/React.createElement(Proposals, null))));
};
export default withProcedureProvider(Procedure);