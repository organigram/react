"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const __1 = require("..");
const react_i18next_1 = require("react-i18next");
const ERC20VoteProcedureComponent = ({ procedure }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [erc20Balance, setErc20Balance] = react_1.default.useState('0');
    react_1.default.useEffect(() => {
        const handler = () => {
            procedure.erc20Balance().then(balance => {
                setErc20Balance(balance.toString());
            });
        };
        handler();
    });
    return procedure ? (react_1.default.createElement("div", { className: 'procedure-vote' },
        t('Voters Organ'),
        ": ",
        react_1.default.createElement("code", null, procedure.deciders),
        react_1.default.createElement("br", null),
        t('Veto Organ'),
        ": ",
        react_1.default.createElement("code", null, procedure.moderators),
        react_1.default.createElement("br", null),
        t('ERC20 Token contract'),
        ": ",
        react_1.default.createElement("code", null, procedure.erc20),
        react_1.default.createElement("br", null),
        t('ERC20 Token balance'),
        ": ",
        react_1.default.createElement("code", null, erc20Balance),
        react_1.default.createElement("br", null),
        t('Quorum Size'),
        ": ",
        procedure.quorumSize.toString(),
        react_1.default.createElement("br", null),
        t('Vote Duration'),
        ": ",
        (0, __1.secondsToHms)(parseInt(procedure.voteDuration)),
        react_1.default.createElement("br", null),
        t('Majority Size'),
        ": ",
        procedure.majoritySize.toString())) : (react_1.default.createElement(react_1.default.Fragment, null));
};
exports.default = ERC20VoteProcedureComponent;
