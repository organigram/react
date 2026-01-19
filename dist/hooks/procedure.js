"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserInSourceOrgan = exports.useDeployedProcedure = exports.filterProposals = void 0;
const react_1 = require("react");
const organs_1 = require("./organs");
const organigramClient_1 = require("./organigramClient");
const filterProposals = (fltr, proposals) => fltr != null || fltr !== ''
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
exports.filterProposals = filterProposals;
const useDeployedProcedure = ({ organigram, procedure, signer }) => {
    const { organigramClient } = (0, organigramClient_1.useOrganigramClient)(signer);
    const deployedOrgans = (0, organs_1.useDeployedOrgans)({ organigram, signer });
    const [deployedState, setDeployedState] = (0, react_1.useState)(procedure); // can't use recoil state here because of procedure._Class
    (0, react_1.useEffect)(() => {
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
                        .catch(e => {
                        console.error(e);
                        return undefined;
                    });
                    if (deployed != null) {
                        setDeployedState(_deployedState => ({
                            ...procedure,
                            deployed,
                            isUserDecider: (0, exports.isUserInSourceOrgan)('deciders', deployedOrgans, _deployedState?.deployed, userAddress),
                            isUserModerator: (0, exports.isUserInSourceOrgan)('moderators', deployedOrgans, _deployedState?.deployed, userAddress),
                            isUserProposer: (0, exports.isUserInSourceOrgan)('proposers', deployedOrgans, _deployedState?.deployed, userAddress),
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
exports.useDeployedProcedure = useDeployedProcedure;
const isUserInSourceOrgan = (sourceOrganType, organs, deployedProcedure, wallet) => organs
    // Find all organs that are this procedure's source organ type (for example: deciders)
    .filter(organ => organ.address ===
    deployedProcedure?.[sourceOrganType])
    // Find any deployed organ whose entries contain the current user's wallet
    .find(async (organ) => organ?.deployed?.entries
    ?.map((entry) => entry?.address)
    .includes(wallet)) !== undefined;
exports.isUserInSourceOrgan = isUserInSourceOrgan;
