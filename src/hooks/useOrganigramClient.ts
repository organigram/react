import { useState, useEffect, useMemo } from 'react'
import {
  TransactionOptions,
  OrganigramClient,
  type ProcedureType,
  type Organ,
  type Procedure
} from '@organigram/js'
import { ethers, Signer } from 'ethers'
import { atom } from 'recoil'

export const organigramIdState = atom({
  key: 'organigramId',
  default: '',
  dangerouslyAllowMutability: true
})

export type DeployOrganInput = (
  metadataCid: string,
  salt: string,
  index?: number
) => Promise<Organ>
export type CreateProcedure = (
  type: string,
  options: TransactionOptions,
  metadataCid: string,
  proposers: string,
  moderators: string,
  deciders: string,
  withModeration: boolean,
  forwarder: string,
  salt: string,
  ...args: unknown[]
) => Promise<Procedure & { type: ProcedureType }>

export interface OrganigramClientContext {
  organigramClient: OrganigramClient | null
  isLoading: boolean
  chainId?: string
}

export const useOrganigramClient = (
  signer?: Signer | null,
  handleTransaction?: (
    tx: ethers.TransactionResponse,
    description: string
  ) => void
): OrganigramClientContext => {
  const [organigramClient, setOrganigramClient] =
    useState<OrganigramClient | null>(null)
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    const initClient: () => Promise<void> = async () => {
      if (signer?.provider == null || signer == null) return
      setLoading(true)
      const _client = await OrganigramClient.load({
        provider: signer.provider,
        signer
      }).catch((error: Error) => {
        console.error('Error loading Organigram client:', error.message)
      })
      if (_client != null) {
        setOrganigramClient(_client)
      }
      setLoading(false)
    }
    initClient()
  }, [signer])

  return useMemo(() => {
    // const loadUserOrganigrams = () => {}

    return {
      organigramClient,
      isLoading
    }
  }, [organigramClient, isLoading])
}
