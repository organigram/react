import { EMPTY_CID } from '@organigram/client-js/dist/ipfs';
import React from 'react';
import { useProcedure } from '../../../contexts/procedure';
export const VoteMove = ({
  move
}) => {
  const {
    procedure: {
      data: vote
    }
  } = useProcedure();
  if (!vote) return /*#__PURE__*/React.createElement(React.Fragment, null);
  const proposition = vote.propositions && vote.propositions.find(p => p.moveKey && p.moveKey === move.key);
  return /*#__PURE__*/React.createElement("div", {
    className: "procedure-move procedure-move-vote"
  }, /*#__PURE__*/React.createElement("pre", null, JSON.stringify(vote, null, 2)), !proposition ? /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => vote.propose(move.key, EMPTY_CID, "0", // quorumSize
    "0", // voteDuration
    "0", // enactmentDuration
    "0" // majoritySize
    )
  }, "Propose") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => {
      vote.vote(move.key, true).catch(error => console.error(error.message));
    }
  }, "Vote YES"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => {
      vote.vote(move.key, false).catch(error => console.error(error.message));
    }
  }, "Vote NO")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-danger",
    onClick: () => {
      vote.veto(move.key, EMPTY_CID).catch(error => console.error(error.message));
    }
  }, "Veto"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => {
      vote.count(move.key).catch(error => {
        console.error(error.message);
        return false;
      }).then(isYes => alert(`Vote result is: ${isYes ? "YES" : "NO"}`));
    }
  }, "Count"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-success",
    onClick: () => {
      vote.enact(move.key).catch(error => console.error(error.message));
    }
  }, "Enact")));
};
export default VoteMove;