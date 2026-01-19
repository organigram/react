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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOrganigramClient = exports.organigramIdState = void 0;
const react_1 = require("react");
const js_1 = require("@organigram/js");
const recoil_1 = require("recoil");
exports.organigramIdState = (0, recoil_1.atom)({
    key: 'organigramId',
    default: '',
    dangerouslyAllowMutability: true
});
const useOrganigramClient = (signer, handleTransaction) => {
    const [organigramClient, setOrganigramClient] = (0, react_1.useState)(null);
    const [isLoading, setLoading] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const initManager = async () => {
            if (signer?.provider == null || signer == null)
                return;
            const chainId = (await signer.provider?.getNetwork())?.chainId?.toString();
            const { 'OrganigramClientModule#OrganigramClient': organigramClientAddress } = await Promise.resolve(`${`@organigram/protocol/ignition/deployments/chain-${chainId}/deployed_addresses.json`}`).then(s => __importStar(require(s)));
            setLoading(true);
            const _client = await js_1.OrganigramClient.load(organigramClientAddress, signer.provider, signer).catch((error) => {
                console.error('Error loading organigram client:', error.message);
            });
            if (_client != null) {
                setOrganigramClient(_client);
            }
            setLoading(false);
        };
        initManager();
    }, [signer]);
    return (0, react_1.useMemo)(() => {
        const createOrgan = async (metadataCid, index) => {
            if (organigramClient == null) {
                throw new Error('Manager not loaded.');
            }
            let transactionNonce;
            const walletNonce = await signer?.getNonce();
            if (walletNonce != null && index != null) {
                transactionNonce = walletNonce + index;
            }
            return await organigramClient.createOrgan(metadataCid, (await signer?.getAddress()), {
                nonce: transactionNonce,
                onTransaction: handleTransaction
            });
        };
        const createProcedure = async (type, options, metadataCid, proposers, moderators, deciders, withModeration, forwarder, ...args) => {
            if (organigramClient == null) {
                throw new Error('Manager not loaded.');
            }
            const procedureType = organigramClient.procedureTypes?.find(pt => pt.key === type);
            if (procedureType?.address == null) {
                throw new Error('Procedure type not registered.');
            }
            return await organigramClient.createProcedure(procedureType.address, { onTransaction: handleTransaction, nonce: options.nonce }, metadataCid, proposers, moderators, deciders, withModeration, forwarder, ...args);
        };
        return {
            organigramClient,
            createOrgan,
            createProcedure,
            isLoading,
            chainId: organigramClient?.chainId
        };
    }, [organigramClient, isLoading, signer, handleTransaction]);
};
exports.useOrganigramClient = useOrganigramClient;
