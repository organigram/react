"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const __1 = require("..");
const VoteProcedureComponent = ({ procedure }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return procedure ? (react_1.default.createElement("div", { className: 'procedure-vote' },
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
exports.default = VoteProcedureComponent;
