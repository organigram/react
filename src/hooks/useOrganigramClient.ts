import { useMemo } from 'react'
import {
  OrganigramClient,
  type TransactionOptions,
  type ProcedureType,
  type Organ,
  type Procedure
} from '@organigram/js'
import type { PublicClient, WalletClient } from 'viem'
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

export const useOrganigramClient = (
  publicClient?: PublicClient | null,
  walletClient?: WalletClient | null
): OrganigramClient | null => {
  return useMemo(() => {
    return publicClient == null
      ? null
      : new OrganigramClient({
          publicClient,
          walletClient: walletClient ?? undefined
        })
  }, [publicClient, walletClient])
}
