import { useMemo } from 'react'
import {
  TransactionOptions,
  OrganigramClient,
  procedureTypes,
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

export const useOrganigramClient = (
  signer?: Signer | null,
  handleTransaction?: (
    tx: ethers.TransactionResponse,
    description: string
  ) => void
): OrganigramClient | null => {
  return useMemo(() => {
    return signer?.provider == null || signer == null
      ? null
      : new OrganigramClient({
          provider: signer.provider,
          signer,
          procedureTypes: Object.values(procedureTypes)
        })
  }, [signer])
}
