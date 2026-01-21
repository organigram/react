import { useState, useEffect } from 'react';
import { useOrganigramClient } from './organigramClient';
export const getDeployedOrganData = async (organAddress, client) => {
    if (organAddress == null || organAddress === '') {
        return undefined;
    }
    const organ = await client?.getOrgan(organAddress).catch(e => {
        console.error(e.message);
    });
    if (organ != null)
        return organ;
};
export const useDeployedOrgan = ({ organ, signer }) => {
    const [deployedState, setDeployedState] = useState(organ);
    const client = useOrganigramClient(signer);
    useEffect(() => {
        const getDeployedOrgan = async () => {
            const deployed = await getDeployedOrganData(organ?.address, client?.organigramClient);
            if (organ != null && deployed != null) {
                setDeployedState({ ...organ, deployed });
            }
        };
        getDeployedOrgan();
    }, [client, organ, organ?.entries]);
    return deployedState ?? undefined;
};
export const useDeployedOrgans = ({ organigram, signer }) => {
    const [deployedOrgans, setDeployedOrgans] = useState([]);
    const { organigramClient } = useOrganigramClient(signer);
    useEffect(() => {
        const getDeployedOrgans = async () => {
            if (organigram != null && organigramClient != null) {
                const _deployedOrgans = await Promise.all(organigram.organs
                    .filter(organ => organ?.address != null && organ?.address !== '')
                    .map(async (organ) => {
                    const deployed = await getDeployedOrganData(organ?.address, organigramClient);
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
