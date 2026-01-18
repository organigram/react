"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteEnded = void 0;
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const Button_1 = __importDefault(require("@mui/material/Button"));
const Alert_1 = __importDefault(require("@mui/material/Alert"));
const js_1 = require("@organigram/js");
const VoteEnded = ({ procedure, proposal, wrapTransaction }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const election = procedure.elections?.find((b) => b.proposalKey && b.proposalKey === proposal.key);
    const [decidersCount, setDecidersCount] = react_1.default.useState(0);
    const quorum = Math.ceil((decidersCount * parseInt(procedure.quorumSize)) / 100000);
    (0, react_1.useEffect)(() => {
        const handler = async () => {
            const deciders = await js_1.Organ.load(procedure.deciders, procedure.provider);
            setDecidersCount(deciders.entries.filter(e => e.address != null && e.address !== '')
                .length);
        };
        handler();
    });
    return parseInt(election.votesCount) >= quorum && election.approved ? ( // Vote is ended. Votes has quorum.(
    react_1.default.createElement(Button_1.default, { variant: 'contained', className: 'enact-proposal', fullWidth: true, onClick: () => {
            procedure
                .adoptProposal(proposal.key, { onTransaction: wrapTransaction })
                .catch((error) => console.error(error.message));
        } }, t('Enact proposal'))) : (react_1.default.createElement(Alert_1.default, { variant: 'filled', sx: { width: '100%' }, severity: 'info' }, t('Vote has ended with no decision.')));
};
exports.VoteEnded = VoteEnded;
