import { useState, useEffect } from 'react'
import { type Organ, OrganigramClient } from '@organigram/js'
import { useOrganigramClient } from './organigramClient'
import { DiagramOrgan, DiagramOrganigram } from '../components/Diagram'
import { Signer } from 'ethers'

export const getDeployedOrganData = async (
  organAddress?: string | null,
  client?: OrganigramClient | null
): Promise<Organ | undefined> => {
  if (organAddress == null || organAddress === '') {
    return undefined
  }
  const organ = await client?.getOrgan(organAddress).catch(e => {
    console.error(e.message)
  })
  if (organ != null) return organ
}

export const useDeployedOrgan = ({
  organ,
  signer
}: {
  organ?: DiagramOrgan | null
  signer?: Signer | null
}): DiagramOrgan | undefined => {
  // const deployed = useRecoilValue(deployedOrganState(organ?.address))
  const [deployedState, setDeployedState] = useState(organ)
  const client = useOrganigramClient(signer)

  useEffect(() => {
    const getDeployedOrgan: () => Promise<void> = async () => {
      const deployed = await getDeployedOrganData(
        organ?.address,
        client?.organigramClient
      )
      if (organ != null && deployed != null) {
        setDeployedState({ ...organ, deployed })
      }
    }
    getDeployedOrgan()
  }, [client, organ, organ?.entries])

  return deployedState ?? undefined
}

export const useDeployedOrgans = ({
  organigram,
  signer
}: {
  organigram: DiagramOrganigram
  signer?: Signer | null
}): DiagramOrgan[] => {
  const [deployedOrgans, setDeployedOrgans] = useState<DiagramOrgan[]>([])
  const { organigramClient } = useOrganigramClient(signer)
  useEffect(() => {
    const getDeployedOrgans: () => Promise<void> = async () => {
      if (organigram != null && organigramClient != null) {
        const _deployedOrgans = await Promise.all(
          organigram.organs
            .filter(organ => organ?.address != null && organ?.address !== '')
            .map(async organ => {
              const deployed = await getDeployedOrganData(
                organ?.address,
                organigramClient
              )
              if (organ != null && deployed != null) {
                return { ...organ, deployed }
              } else return organ
            })
        )
        setDeployedOrgans(_deployedOrgans)
      }
    }
    getDeployedOrgans()
  }, [organigramClient, organigram, organigram?.organs])

  return deployedOrgans
}
