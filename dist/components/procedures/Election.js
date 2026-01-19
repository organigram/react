"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Grid_1 = __importDefault(require("@mui/material/Grid"));
const Alert_1 = __importDefault(require("@mui/material/Alert"));
const Veto_1 = require("./Veto");
const DecidersActions_1 = require("./DecidersActions");
const Enact_1 = require("./Enact");
const ElectionComponent = ({ procedure, proposal, accountInOrgans, wrapTransaction, t = key => key }) => {
    const election = procedure.elections?.find((b) => b.proposalKey && b.proposalKey === proposal.key);
    const now = Date.now() / 1000;
    if (!proposal || !proposal.presented || !election) {
        return (react_1.default.createElement(Alert_1.default, { variant: 'filled', sx: { width: '100%' }, severity: 'info' }, t('Proposal not presented.')));
    }
    if (proposal.blocked || proposal.applied) {
        return react_1.default.createElement(react_1.default.Fragment, null);
    }
    return (react_1.default.createElement(Grid_1.default, { container: true, justifyContent: 'space-between', mt: 3, className: 'procedure-proposal procedure-proposal-vote' }, !election || !election.start ? ( // Election does not exist or not started, or block cannot be fetched.
    react_1.default.createElement(react_1.default.Fragment, null)) : now < parseInt(election.start) ? ( // Election is started. Vote is not started.
    react_1.default.createElement(Veto_1.VetoProposal, { procedure, proposal, accountInOrgans, wrapTransaction })) : now < parseInt(election.start) + parseInt(procedure.voteDuration) ? ( // Vote is started. Vote is not ended.
    react_1.default.createElement(DecidersActions_1.DecidersActions, { procedure, proposal, accountInOrgans, wrapTransaction })) : (react_1.default.createElement(Enact_1.VoteEnded, { procedure, proposal, wrapTransaction }))));
};
exports.default = ElectionComponent;
