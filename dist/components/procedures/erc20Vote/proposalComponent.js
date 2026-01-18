"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Election_1 = __importDefault(require("../Election"));
const ERC20VoteProposalComponent = (props) => (react_1.default.createElement(Election_1.default, { ...props }));
exports.default = ERC20VoteProposalComponent;
