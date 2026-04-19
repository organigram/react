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

/**
 * Global recoil state storing the active organigram identifier.
 */
export const organigramIdState = atom({
  key: 'organigramId',
  default: '',
  dangerouslyAllowMutability: true
})

/**
 * Helper signature used by flows that deploy one organ from the UI.
 */
export type DeployOrganInput = (
  metadataCid: string,
  salt: string,
  index?: number
) => Promise<Organ>

/**
 * Helper signature used by flows that deploy one procedure from the UI.
 */
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

/**
 * Create an {@link OrganigramClient} tied to the provided viem clients.
 *
 * The hook returns `null` until a public client is available.
 *
 * @param publicClient Read-only viem client used for chain queries.
 * @param walletClient Optional wallet client used for write operations.
 */
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
