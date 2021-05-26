import React from 'react';
import { useProcedure } from '../../../contexts/procedure';
import { ProposalOperations } from './operations';
import { ProposalFormCreate, ProposalFormAddEntries, ProposalFormRemoveEntry, ProposalFormReplaceEntry, ProposalFormAddProcedure, ProposalFormRemoveProcedure, ProposalFormReplaceProcedure, ProposalFormCall } from './forms';
export const Proposal = ({
  proposal
}) => {
  const {
    procedure,
    reloadProposal
  } = useProcedure();
  const [showForms, setShowForms] = React.useState(false);

  const toggleForms = () => setShowForms(sf => !sf);

  const [ProposalComponent, setProposalComponent] = React.useState();
  React.useEffect(async () => {
    if (procedure.type) switch (procedure.type) {
      case '0xc5f28e49':
        // Nomination.
        setProposalComponent( /*#__PURE__*/React.lazy(() => import('../nomination/proposal')));
        break;

      case '0xc9d27afe':
        // Vote.
        setProposalComponent( /*#__PURE__*/React.lazy(() => import('../vote/proposal')));
        break;

      default:
        setProposalComponent();
        break;
    }
  }, [procedure.type]);
  return /*#__PURE__*/React.createElement("div", {
    className: `procedure-proposal`
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "text-muted"
  }, "Proposal ", proposal.key)), /*#__PURE__*/React.createElement("div", {
    className: "col text-center"
  }, proposal.applied && /*#__PURE__*/React.createElement("strong", null, "Enacted")), /*#__PURE__*/React.createElement("div", {
    className: "col text-right"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => reloadProposal(proposal.key),
    className: "btn btn-sm"
  }, "reload"))), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, "Creator: ", /*#__PURE__*/React.createElement("code", null, proposal.creator)), /*#__PURE__*/React.createElement("div", {
    className: "col-4"
  }, "Presented? ", /*#__PURE__*/React.createElement("code", null, proposal.presented ? "true" : "false")), /*#__PURE__*/React.createElement("div", {
    className: "col-4"
  }, "Adopted? ", /*#__PURE__*/React.createElement("code", null, proposal.adopted ? "true" : "false")), /*#__PURE__*/React.createElement("div", {
    className: "col-4"
  }, "Enacted? ", /*#__PURE__*/React.createElement("code", null, proposal.applied ? "true" : "false")), /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, "Metadata: ", /*#__PURE__*/React.createElement("code", null, `${proposal.metadata}`), " ", /*#__PURE__*/React.createElement("a", {
    href: `ipfs://${proposal.metadata}`,
    target: "_blank"
  }, "view"))), /*#__PURE__*/React.createElement(ProposalOperations, {
    proposal: proposal
  }), proposal && /*#__PURE__*/React.createElement(React.Suspense, {
    fallback: /*#__PURE__*/React.createElement("p", null, "Loading...")
  }, ProposalComponent && /*#__PURE__*/React.createElement(ProposalComponent, {
    proposal: proposal
  })), /*#__PURE__*/React.createElement("hr", null), !proposal.presented && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    onClick: () => procedure.presentProposal(proposal.key),
    className: "btn btn-primary"
  }, "Present proposal"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-sm",
    onClick: () => toggleForms()
  }, "toggle forms"), showForms && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ProposalFormAddEntries, {
    proposal: proposal
  }), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(ProposalFormRemoveEntry, {
    proposal: proposal
  }), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(ProposalFormReplaceEntry, {
    proposal: proposal
  }), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(ProposalFormAddProcedure, {
    proposal: proposal
  }), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(ProposalFormRemoveProcedure, {
    proposal: proposal
  }), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(ProposalFormReplaceProcedure, {
    proposal: proposal
  }), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(ProposalFormCall, {
    proposal: proposal
  }))));
};
export const Proposals = () => {
  const {
    procedure: {
      proposals,
      propose
    }
  } = useProcedure();
  const [currentProposal, setCurrentProposal] = React.useState();
  return /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-2"
  }, /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", {
    key: "none",
    onClick: () => setCurrentProposal(null)
  }, "New"), proposals && proposals.map(proposal => /*#__PURE__*/React.createElement("li", {
    key: `proposal-${proposal.key}`,
    onClick: () => setCurrentProposal(proposal)
  }, /*#__PURE__*/React.createElement("span", {
    className: `text-${proposal.applied ? "success" : "default"}`
  }, `${proposal.key}`))))), /*#__PURE__*/React.createElement("div", {
    className: "col-10"
  }, /*#__PURE__*/React.createElement("div", {
    className: `card card-body ${currentProposal && currentProposal.applied && "bg-success"}`
  }, currentProposal ? /*#__PURE__*/React.createElement(Proposal, {
    proposal: currentProposal
  }) : /*#__PURE__*/React.createElement(ProposalFormCreate, null))));
};