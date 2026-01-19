"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDeployedOrgans = exports.useDeployedOrgan = exports.getDeployedOrganData = void 0;
const react_1 = require("react");
const organigramClient_1 = require("./organigramClient");
const getDeployedOrganData = async (organAddress, client) => {
    if (organAddress == null || organAddress === '') {
        return undefined;
    }
    const organ = await client?.getOrgan(organAddress).catch(e => {
        console.error(e.message);
    });
    if (organ != null)
        return organ;
};
exports.getDeployedOrganData = getDeployedOrganData;
const useDeployedOrgan = ({ organ, signer }) => {
    // const deployed = useRecoilValue(deployedOrganState(organ?.address))
    const [deployedState, setDeployedState] = (0, react_1.useState)(organ);
    const client = (0, organigramClient_1.useOrganigramClient)(signer);
    (0, react_1.useEffect)(() => {
        const getDeployedOrgan = async () => {
            const deployed = await (0, exports.getDeployedOrganData)(organ?.address, client?.organigramClient);
            if (organ != null && deployed != null) {
                setDeployedState({ ...organ, deployed });
            }
        };
        getDeployedOrgan();
    }, [client, organ, organ?.entries]);
    return deployedState ?? undefined;
};
exports.useDeployedOrgan = useDeployedOrgan;
const useDeployedOrgans = ({ organigram, signer }) => {
    const [deployedOrgans, setDeployedOrgans] = (0, react_1.useState)([]);
    const { organigramClient } = (0, organigramClient_1.useOrganigramClient)(signer);
    (0, react_1.useEffect)(() => {
        const getDeployedOrgans = async () => {
            if (organigram != null && organigramClient != null) {
                const _deployedOrgans = await Promise.all(organigram.organs
                    .filter(organ => organ?.address != null && organ?.address !== '')
                    .map(async (organ) => {
                    const deployed = await (0, exports.getDeployedOrganData)(organ?.address, organigramClient);
                    if (organ != null && deployed != null) {
                        return { ...organ, deployed };
                    }
                    else
                        return organ;
                }));
                setDeployedOrgans(_deployedOrgans);
            }
        };
        getDeployedOrgans();
    }, [organigramClient, organigram, organigram?.organs]);
    return deployedOrgans;
};
exports.useDeployedOrgans = useDeployedOrgans;
