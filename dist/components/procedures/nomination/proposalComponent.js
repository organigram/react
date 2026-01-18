"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Button_1 = __importDefault(require("@mui/material/Button"));
const Grid_1 = __importDefault(require("@mui/material/Grid"));
const NominationProposalComponent = ({ procedure, proposal, accountInOrgans, wrapTransaction, t = key => key }) => {
    if (!proposal || !proposal.presented) {
        return react_1.default.createElement("p", { className: 'text-danger' }, t('Proposal not presented.'));
    }
    if (proposal.blocked || proposal.applied) {
        return react_1.default.createElement(react_1.default.Fragment, null);
    }
    return (react_1.default.createElement(Grid_1.default, { container: true, justifyContent: 'space-between', mt: 3 }, accountInOrgans?.deciders && (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(Button_1.default, { sx: { width: '48%' }, variant: 'contained', className: 'approve-proposal', onClick: () => procedure.nominate(proposal.key, {
                onTransaction: wrapTransaction
            }) }, t('Approve')),
        react_1.default.createElement(Button_1.default, { sx: { width: '48%' }, variant: 'contained', color: 'secondary', className: 'reject-proposal', onClick: () => procedure.blockProposal(proposal.key, '', {
                onTransaction: wrapTransaction
            }) }, t('Reject'))))));
};
exports.default = NominationProposalComponent;
