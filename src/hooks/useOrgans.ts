import { useState, useEffect } from 'react'
import {
  type Organ,
  Organigram,
  OrganigramClient,
  OrganWithSourcesAndTargets
} from '@organigram/js'
import { useOrganigramClient } from './useOrganigramClient'
import { Signer } from 'ethers'
// import { DiagramOrgan } from '../components/Diagram/OrganNode'

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

export const getOrganSourcesAndTargets = (
  organ: Organ,
  organigram: Organigram
): OrganWithSourcesAndTargets => {
  return organ as OrganWithSourcesAndTargets
}

export const useDeployedOrgan = ({
  organ,
  signer
}: {
  organ?: Organ | null
  signer?: Signer | null
}): Organ | undefined => {
  // const deployed = useRecoilValue(deployedOrganState(organ?.address))
  const [deployedState, setDeployedState] = useState(organ)
  const { organigramClient } = useOrganigramClient(signer)

  useEffect(() => {
    const getDeployedOrgan: () => Promise<void> = async () => {
      const deployed = await getDeployedOrganData(
        organ?.address,
        organigramClient
      )
      if (organ != null && deployed != null) {
        setDeployedState(deployed)
      }
    }
    getDeployedOrgan()
  }, [organigramClient, organ, organ?.entries])

  return deployedState ?? undefined
}

export const useDeployedOrgans = ({
  organigram,
  signer
}: {
  organigram: Organigram
  signer?: Signer | null
}): Organ[] => {
  const [deployedOrgans, setDeployedOrgans] = useState<Organ[]>([])
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
                return deployed
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
