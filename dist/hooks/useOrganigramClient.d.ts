import { TransactionOptions, OrganigramClient, ProcedureType, Organ, Procedure } from '@organigram/js';
import { ethers, Signer } from 'ethers';
export declare const organigramIdState: import('recoil').RecoilState<string>;
export type DeployOrganInput = (metadataCid: string, salt: string, index?: number) => Promise<Organ>;
export type CreateProcedure = (type: string, options: TransactionOptions, metadataCid: string, proposers: string, moderators: string, deciders: string, withModeration: boolean, forwarder: string, salt: string, ...args: unknown[]) => Promise<Procedure & {
    type: ProcedureType;
}>;
export declare const useOrganigramClient: (signer?: Signer | null, handleTransaction?: (tx: ethers.TransactionResponse, description: string) => void) => OrganigramClient | null;
