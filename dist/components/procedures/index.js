"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.secondsToHms = exports.ERC20VoteProposal = exports.ERC20VoteComponent = exports.NominationProposal = exports.NominationComponent = exports.VoteProposal = exports.VoteComponent = void 0;
const Component_1 = __importDefault(require("./nomination/Component"));
exports.NominationComponent = Component_1.default;
const Proposal_1 = __importDefault(require("./nomination/Proposal"));
exports.NominationProposal = Proposal_1.default;
const Component_2 = __importDefault(require("./vote/Component"));
exports.VoteComponent = Component_2.default;
const Proposal_2 = __importDefault(require("./vote/Proposal"));
exports.VoteProposal = Proposal_2.default;
const Component_3 = __importDefault(require("./erc20Vote/Component"));
exports.ERC20VoteComponent = Component_3.default;
const Proposal_3 = __importDefault(require("./erc20Vote/Proposal"));
exports.ERC20VoteProposal = Proposal_3.default;
const secondsToHms = (d) => {
    const days = Math.floor(d / 86400);
    const hours = Math.floor((d % 86400) / 3600);
    const minutes = Math.floor((d % 3600) / 60);
    const seconds = Math.floor((d % 3600) % 60);
    const dDisplay = days > 0 ? days.toString() + (days === 1 ? ' day, ' : ' days, ') : '';
    const hDisplay = hours > 0 ? hours.toString() + (hours === 1 ? ' hour, ' : ' hours, ') : '';
    const mDisplay = minutes > 0
        ? minutes.toString() + (minutes === 1 ? ' minute, ' : ' minutes, ')
        : '';
    const sDisplay = seconds > 0
        ? seconds.toString() + (seconds === 1 ? ' second' : ' seconds')
        : '';
    return dDisplay + hDisplay + mDisplay + sDisplay;
};
exports.secondsToHms = secondsToHms;
