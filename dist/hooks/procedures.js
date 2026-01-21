import { useState, useEffect } from 'react';
import { useDeployedOrgans } from './organs';
import { useOrganigramClient } from './organigramClient';
export const filterProposals = (fltr, proposals) => fltr != null || fltr !== ''
    ? proposals.filter(proposal => {
        switch (fltr) {
            case 'current':
                return proposal.presented && !proposal.applied && !proposal.blocked;
            case 'drafts':
                return !proposal.presented && !proposal.blocked;
            case 'passed':
                return proposal.adopted;
            case 'blocked':
                return proposal.blocked;
            default:
                return true;
        }
    })
    : proposals;
export const useDeployedProcedure = ({ organigram, procedure, signer }) => {
    const { organigramClient } = useOrganigramClient(signer);
    const deployedOrgans = useDeployedOrgans({ organigram, signer });
    const [deployedState, setDeployedState] = useState(procedure);
    useEffect(() => {
        const initDeployed = async () => {
            let deployed;
            const userAddress = await signer?.getAddress();
            if (procedure?.deployed == null &&
                procedure?.address != null &&
                procedure.address !== '' &&
                organigramClient != null) {
                try {
                    deployed = await organigramClient
                        ?.getProcedure(procedure.address)
                        .catch((e) => {
                        console.error(e);
                        return undefined;
                    });
                    if (deployed != null) {
                        setDeployedState(_deployedState => ({
                            ...procedure,
                            deployed,
                            isUserDecider: isUserInSourceOrgan('deciders', deployedOrgans, _deployedState?.deployed, userAddress),
                            isUserModerator: isUserInSourceOrgan('moderators', deployedOrgans, _deployedState?.deployed, userAddress),
                            isUserProposer: isUserInSourceOrgan('proposers', deployedOrgans, _deployedState?.deployed, userAddress),
                            updateCid: procedure.updateCid,
                            updateAdmin: procedure.updateAdmin,
                            propose: procedure.propose,
                            blockProposal: procedure.blockProposal,
                            presentProposal: procedure.presentProposal,
                            reloadProposal: procedure.reloadProposal,
                            reloadProposals: procedure.reloadProposals,
                            adoptProposal: procedure.adoptProposal,
                            applyProposal: procedure.applyProposal,
                            reloadData: procedure.reloadData
                        }));
                    }
                }
                catch (e) {
                    console.error(e);
                }
            }
            else
                setDeployedState(procedure);
        };
        initDeployed();
    }, [
        procedure,
        organigramClient,
        deployedOrgans,
        procedure?.id,
        procedure?.deployed
    ]);
    return deployedState;
};
export const isUserInSourceOrgan = (sourceOrganType, organs, deployedProcedure, wallet) => organs
    .filter(organ => organ.address ===
    deployedProcedure?.[sourceOrganType])
    .find(async (organ) => organ?.deployed?.entries
    ?.map((entry) => entry?.address)
    .includes(wallet)) !== undefined;
