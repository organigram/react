import { useState, useEffect, useMemo } from 'react'
import {
  TransactionOptions,
  OrganigramClient,
  type ProcedureType,
  type Organ,
  type Procedure,
  deployedAddresses
} from '@organigram/js'
import { ethers, Signer } from 'ethers'
import { atom } from 'recoil'

export const organigramIdState = atom({
  key: 'organigramId',
  default: '',
  dangerouslyAllowMutability: true
})

export type CreateOrgan = (
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
  createOrgan: CreateOrgan
  createProcedure: CreateProcedure
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
      const chainId = (await signer.provider?.getNetwork())?.chainId?.toString()
      setLoading(true)
      const _client = await OrganigramClient.load(
        deployedAddresses[chainId as '11155111'].OrganigramClient,
        signer.provider,
        signer
      ).catch((error: Error) => {
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
    const createOrgan: CreateOrgan = async (metadataCid, salt, index) => {
      if (organigramClient == null) {
        throw new Error('Manager not loaded.')
      }
      let transactionNonce: number | undefined
      const walletNonce = await signer?.getNonce()
      if (walletNonce != null && index != null) {
        transactionNonce = walletNonce + index
      }
      const signerAddress = (await signer?.getAddress()) as string
      return await organigramClient.createOrgan(
        metadataCid,
        signerAddress,
        salt,
        {
          nonce: transactionNonce,
          customData: { index },
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
      salt,
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
        {
          onTransaction: handleTransaction,
          nonce: options.nonce,
          customData: options.customData
        },
        metadataCid,
        proposers,
        moderators,
        deciders,
        withModeration,
        forwarder,
        salt,
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
