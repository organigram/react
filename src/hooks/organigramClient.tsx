import { useState, useEffect, useMemo } from 'react'
import {
  OrganigramClient,
  type ProcedureType,
  type Organ,
  type Procedure
} from '@organigram/js'

import { TransactionOptions } from '@organigram/js'
import { atom } from 'recoil'

import { Signer } from 'ethers'

export const organigramIdState = atom({
  key: 'organigramId',
  default: '',
  dangerouslyAllowMutability: true
})

export type CreateOrgan = (
  metadataCid: string,
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
  ...args: unknown[]
) => Promise<Procedure & { type: ProcedureType }>

export interface UseOrganigramClient {
  organigramClient: OrganigramClient | null
  createOrgan: CreateOrgan
  createProcedure: CreateProcedure
  isLoading: boolean
  chainId?: string
}

export const useOrganigramClient = (
  signer: Signer,
  handleTransaction?: () => void
): UseOrganigramClient => {
  const [organigramClient, setOrganigramClient] =
    useState<OrganigramClient | null>(null)
  const [isLoading, setLoading] = useState(false)
  useEffect(() => {
    const initManager: () => Promise<void> = async () => {
      if (signer?.provider == null || signer == null) return
      const chainId = (await signer.provider?.getNetwork())?.chainId?.toString()
      const {
        'OrganigramClientModule#OrganigramClient': organigramClientAddress
      } = await import(
        `@organigram/protocol/ignition/deployments/chain-${chainId}/deployed_addresses.json`
      )
      setLoading(true)
      const _client = await OrganigramClient.load(
        organigramClientAddress,
        signer.provider,
        signer
      ).catch((error: Error) => {
        console.error('Error loading organigram client:', error.message)
      })
      if (_client != null) {
        setOrganigramClient(_client)
      }
      setLoading(false)
    }
    initManager()
  }, [signer])

  return useMemo(() => {
    const createOrgan: CreateOrgan = async (metadataCid, index) => {
      if (organigramClient == null) {
        throw new Error('Manager not loaded.')
      }
      let transactionNonce: number | undefined
      const walletNonce = await signer?.getNonce()
      if (walletNonce != null && index != null) {
        transactionNonce = walletNonce + index
      }
      return await organigramClient.createOrgan(
        metadataCid,
        (await signer?.getAddress()) as string,
        {
          nonce: transactionNonce,
          onTransaction: handleTransaction
        }
      )
    }

    const createProcedure: CreateProcedure = async (
      type,
      options,
      metadataCid,
      proposers,
      moderators,
      deciders,
      withModeration,
      forwarder,
      ...args
    ) => {
      if (organigramClient == null) {
        throw new Error('Manager not loaded.')
      }
      const procedureType = organigramClient.procedureTypes?.find(
        pt => pt.key === type
      )
      if (procedureType?.address == null) {
        throw new Error('Procedure type not registered.')
      }
      return await organigramClient.createProcedure(
        procedureType.address,
        { onTransaction: handleTransaction, nonce: options.nonce },
        metadataCid,
        proposers,
        moderators,
        deciders,
        withModeration,
        forwarder,
        ...args
      )
    }

    return {
      organigramClient,
      createOrgan,
      createProcedure,
      isLoading,
      chainId: organigramClient?.chainId
    }
  }, [organigramClient, isLoading, signer, handleTransaction])
}
