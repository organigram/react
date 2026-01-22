import { useState, useEffect, useMemo } from 'react';
import { OrganigramClient, organigramClientDeployedAddresses } from '@organigram/js';
import { atom } from 'recoil';
export const organigramIdState = atom({
    key: 'organigramId',
    default: '',
    dangerouslyAllowMutability: true
});
export const useOrganigramClient = (signer, handleTransaction) => {
    const [organigramClient, setOrganigramClient] = useState(null);
    const [isLoading, setLoading] = useState(false);
    useEffect(() => {
        const initManager = async () => {
            if (signer?.provider == null || signer == null)
                return;
            const chainId = (await signer.provider?.getNetwork())?.chainId?.toString();
            setLoading(true);
            const _client = await OrganigramClient.load(organigramClientDeployedAddresses[chainId], signer.provider, signer).catch((error) => {
                console.error('Error loading Organigram client:', error.message);
            });
            if (_client != null) {
                setOrganigramClient(_client);
            }
            setLoading(false);
        };
        initManager();
    }, [signer]);
    return useMemo(() => {
        const createOrgan = async (metadataCid, index) => {
            if (organigramClient == null) {
                throw new Error('Manager not loaded.');
            }
            let transactionNonce;
            const walletNonce = await signer?.getNonce();
            if (walletNonce != null && index != null) {
                transactionNonce = walletNonce + index;
            }
            const signerAddress = (await signer?.getAddress());
            return await organigramClient.createOrgan(metadataCid, signerAddress, {
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
