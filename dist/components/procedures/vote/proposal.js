import React from 'react';
import { EMPTY_CID } from '@organigram/client-js/dist/ipfs';
import { useProcedure } from '../../../contexts/procedure';

const Proposal = ({
  proposal
}) => {
  const {
    procedure: {
      data: vote
    }
  } = useProcedure();
  if (!vote) return /*#__PURE__*/React.createElement(React.Fragment, null);
  const proposition = vote.propositions && vote.propositions.find(p => p.proposalKey && p.proposalKey === proposal.key);
  return /*#__PURE__*/React.createElement("div", {
    className: "procedure-proposal procedure-proposal-vote"
  }, /*#__PURE__*/React.createElement("pre", null, JSON.stringify(vote, null, 2)), !proposition ? /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => vote.propose(proposal.key, EMPTY_CID, "0", // quorumSize
    "0", // voteDuration
    "0", // enactmentDuration
    "0" // majoritySize
    )
  }, "Propose") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => {
      vote.vote(proposal.key, true).catch(error => console.error(error.message));
    }
  }, "Vote YES"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => {
      vote.vote(proposal.key, false).catch(error => console.error(error.message));
    }
  }, "Vote NO")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-danger",
    onClick: () => {
      vote.veto(proposal.key, EMPTY_CID).catch(error => console.error(error.message));
    }
  }, "Veto"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => {
      vote.count(proposal.key).catch(error => {
        console.error(error.message);
        return false;
      }).then(isYes => alert(`Vote result is: ${isYes ? "YES" : "NO"}`));
    }
  }, "Count"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-success",
    onClick: () => {
      vote.enact(proposal.key).catch(error => console.error(error.message));
    }
  }, "Enact")));
};

export default Proposal;