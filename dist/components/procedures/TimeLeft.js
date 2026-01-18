"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeLeft = void 0;
const react_1 = __importDefault(require("react"));
const Alert_1 = __importDefault(require("@mui/material/Alert"));
const react_i18next_1 = require("react-i18next");
const TimeLeft = ({ election, procedure }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const now = Date.now() / 1000;
    let timeLeft = '';
    if (election?.start) {
        const start = parseInt(election.start);
        const end = start + parseInt(procedure.voteDuration);
        const secondsLeft = election?.start && start > 0 && end > now ? end - now : 0;
        if (secondsLeft >= 0) {
            const days = Math.floor(secondsLeft / (60 * 60 * 24));
            const hours = Math.floor((secondsLeft - days * (60 * 60 * 24)) / (60 * 60));
            const minutes = Math.floor((secondsLeft - days * (60 * 60 * 24) - hours * (60 * 60)) / 60);
            const seconds = secondsLeft - days * (60 * 60 * 24) - hours * (60 * 60) - minutes * 60;
            timeLeft =
                (days > 0 ? days + t(' day') + ' ' : '') +
                    (hours > 0 ? hours + 'h' + ' ' : '') +
                    (minutes > 0 ? minutes + 'm' + ' ' : '') +
                    seconds.toFixed() +
                    's';
        }
    }
    return timeLeft !== '' ? (react_1.default.createElement(Alert_1.default, { variant: 'filled', sx: { width: '100%', mb: 2 }, severity: 'info' },
        t('Time left:'),
        " ",
        timeLeft)) : null;
};
exports.TimeLeft = TimeLeft;
