"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_1 = __importDefault(require("./class"));
const procedureComponent_1 = __importDefault(require("./procedureComponent"));
const proposalComponent_1 = __importDefault(require("./proposalComponent"));
const metadata_json_1 = __importDefault(require("./metadata.json"));
exports.default = {
    Class: class_1.default,
    ProcedureComponent: procedureComponent_1.default,
    ProposalComponent: proposalComponent_1.default,
    metadata: metadata_json_1.default
};
