"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecidersActions = void 0;
const react_1 = __importDefault(require("react"));
const TimeLeft_1 = require("./TimeLeft");
const Alert_1 = __importDefault(require("@mui/material/Alert"));
const Button_1 = __importDefault(require("@mui/material/Button"));
const react_i18next_1 = require("react-i18next");
const DecidersActions = ({ procedure, accountInOrgans, proposal, wrapTransaction }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const election = procedure.elections?.find((b) => b.proposalKey && b.proposalKey === proposal.key);
    return (accountInOrgans.deciders && (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(TimeLeft_1.TimeLeft, { election, procedure }),
        election.hasVoted ? (react_1.default.createElement(Alert_1.default, { variant: 'filled', sx: { width: '100%' }, severity: 'info' }, t('You already voted on this proposal.'))) : (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(Button_1.default, { sx: { width: '48%' }, variant: 'contained', className: 'approve-proposal', onClick: () => {
                    procedure
                        .vote(proposal.key, true, {
                        onTransaction: wrapTransaction
                    })
                        .catch((error) => console.error(error.message));
                } }, t('Approve')),
            react_1.default.createElement(Button_1.default, { sx: { width: '48%' }, variant: 'contained', color: 'secondary', className: 'reject-proposal', onClick: () => {
                    procedure
                        .vote(proposal.key, false, {
                        onTransaction: wrapTransaction
                    })
                        .catch((error) => console.error(error.message));
                } }, t('Reject')))))));
};
exports.DecidersActions = DecidersActions;
