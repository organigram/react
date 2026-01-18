"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const js_1 = require("@organigram/js");
const NominationProcedure_json_1 = __importDefault(require("@organigram/protocol/abi/NominationProcedure.json"));
class NominationProcedure extends js_1.Procedure {
    static INTERFACE = '0xc5f28e49'; // nominate() signature.
    contract;
    // Constructor needs to call Procedure constructor.
    constructor(cid, address, chainId, signerOrProvider, metadata, proposers, moderators, deciders, withModeration, forwarder, proposals) {
        super(cid, address, chainId, signerOrProvider, metadata, proposers, moderators, deciders, withModeration, forwarder, proposals);
        this.contract = new ethers_1.ethers.Contract(address, NominationProcedure_json_1.default, signerOrProvider);
    }
    // _populateInitialize() overrides Procedure _populateInitialize.
    static async _populateInitialize(type, options, cid, proposers, moderators, deciders, _withModeration, forwarder, ..._args) {
        if (options.signer == null) {
            throw new Error('Not connected.');
        }
        const contract = new ethers_1.ethers.Contract(type, NominationProcedure_json_1.default, options.signer);
        return await contract.initialize.populateTransaction(cid, proposers, moderators, deciders, false, forwarder);
    }
    static async load(address, signerOrProvider) {
        const procedure = await js_1.Procedure.load(address, signerOrProvider);
        if (!procedure)
            throw new Error('Not a valid procedure.');
        // const contract = new ethers.Contract(
        //   address,
        //   NominationProcedureContractABI,
        //   signerOrProvider
        // )
        return new NominationProcedure(procedure.cid, procedure.address, procedure.chainId, signerOrProvider, procedure.metadata, procedure.proposers, procedure.moderators, procedure.deciders, procedure.withModeration, procedure.forwarder, procedure.proposals);
    }
    async nominate(proposalKey, options) {
        // @todo Check gasLimit amount
        const tx = await this.contract.nominate(proposalKey, {
            gasLimit: '1000000'
        });
        if (options?.onTransaction != null) {
            options.onTransaction(tx, 'Initialize Nomination procedure.');
        }
        const receipt = await tx.wait();
        return receipt.status === 1;
    }
}
exports.default = NominationProcedure;
