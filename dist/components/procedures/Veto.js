"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VetoProposal = void 0;
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const Button_1 = __importDefault(require("@mui/material/Button"));
const VetoProposal = ({ accountInOrgans, procedure, proposal, wrapTransaction }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return accountInOrgans?.moderators ? (react_1.default.createElement(Button_1.default, { color: 'secondary', variant: 'contained', fullWidth: true, className: 'veto-proposal', onClick: () => {
            procedure
                .blockProposal(proposal.key, '', {
                onTransaction: wrapTransaction
            })
                .catch((error) => console.error(error.message));
        } }, t('Veto proposal'))) : null;
};
exports.VetoProposal = VetoProposal;
