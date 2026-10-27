import React from 'react'
import { Organ, OrganJson, PERMISSIONS } from '@organigram/js'
import { Handle, NodeProps, Position } from 'react-flow-renderer'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import makeBlockie from 'ethereum-blockies-base64'

import { DiagramNode } from './Node'
import { palette } from '../../theme/palette'
import SummitIcon from '../icons/Summit'
import {
  AccountBalanceWalletRounded,
  DescriptionRounded,
  PeopleAltRounded
} from '@mui/icons-material'

/**
 * Props accepted by the default organ node renderer.
 */
export interface OrganNodeProps {
  data: {
    organ: Organ
    entryUsers?: Record<string, DiagramEntryUser>
    position?: { x: number; y: number }
    isMaster?: boolean
    onClick?: () => void
    translateLabel?: (label: string) => string
  }
  hideHandles?: boolean
}

export type DiagramEntryUser = {
  image?: string | null
  name?: string | null
}

/**
 * Small helper that renders the current entry count for an organ.
 */
export const EntryCount: React.FC<{
  organ: OrganJson
  translateLabel?: (label: string) => string
}> = ({ organ, translateLabel = label => label }) => {
  const count = organ?.entries?.length?.toString()
  const singularOrPlural =
    organ?.entries?.length != null && organ?.entries?.length > 1
      ? 'entries'
      : 'entry'
  return (
    <span id={`organ-${organ?.name as string}-entry-count`}>
      {count} {translateLabel(singularOrPlural)}
    </span>
  )
}

export const MemberCount: React.FC<{
  organ: OrganJson
  count: number
  translateLabel?: (label: string) => string
}> = ({ organ, count, translateLabel = label => label }) => (
  <span id={`organ-${organ.name}-member-count`}>
    {count} {translateLabel(count === 1 ? 'member' : 'members')}
  </span>
)

const normalizeAddress = (address: string): string => address.trim().toLowerCase()

const blockiesByAddress = new Map<string, string>()

const getBlockie = (address: string): string => {
  const normalizedAddress = normalizeAddress(address)
  const cached = blockiesByAddress.get(normalizedAddress)
  if (cached != null) return cached

  const blockie = makeBlockie(normalizedAddress)
  blockiesByAddress.set(normalizedAddress, blockie)
  return blockie
}

const assetPermissionMask =
  PERMISSIONS.DEPOSIT_ETHER |
  PERMISSIONS.WITHDRAW_ETHER |
  PERMISSIONS.DEPOSIT_COINS |
  PERMISSIONS.WITHDRAW_COINS |
  PERMISSIONS.DEPOSIT_COLLECTIBLES |
  PERMISSIONS.WITHDRAW_COLLECTIBLES

const hasStoredFunds = (organ: OrganJson): boolean => {
  try {
    if (BigInt(String(organ.balance ?? '0').replace(/n$/, '')) > 0n) {
      return true
    }
  } catch {
    // An unparseable balance is treated as unknown rather than as funds.
  }

  return (organ.permissions ?? []).some(permission =>
    (Number(permission.permissionValue) & assetPermissionMask) !== 0
  )
}

export type OrganNodeIconKind = 'master' | 'people' | 'funds' | 'documents'

export const getOrganNodeIconKind = ({
  organ,
  hasUserEntries,
  isMaster
}: {
  organ: OrganJson
  hasUserEntries: boolean
  isMaster: boolean
}): OrganNodeIconKind => {
  if (isMaster) return 'master'
  if (hasUserEntries) return 'people'
  if (hasStoredFunds(organ)) return 'funds'
  return 'documents'
}

type OrganUserEntry = {
  address: string
  user: DiagramEntryUser
}

const getOrganUserEntries = (
  organ: OrganJson,
  entryUsers: Record<string, DiagramEntryUser>
): OrganUserEntry[] => {
  const usersByAddress = new Map<string, OrganUserEntry>()
  for (const entry of organ.entries ?? []) {
    const normalizedAddress = normalizeAddress(entry.address)
    const user = entryUsers[normalizedAddress]
    if (user != null && !usersByAddress.has(normalizedAddress)) {
      usersByAddress.set(normalizedAddress, { address: entry.address, user })
    }
  }
  return [...usersByAddress.values()]
}

const EntryAvatars: React.FC<{ users: OrganUserEntry[] }> = ({ users }) => {
  if (users.length === 0) return null

  return (
    <AvatarGroup
      max={4}
      spacing='small'
      sx={{
        justifyContent: 'flex-end',
        '& .MuiAvatar-root': {
          border: '0 !important',
          height: 24,
          width: 24
        }
      }}
    >
      {users.map(({ address, user }) => (
        <Avatar
          key={address}
          src={user.image?.trim() || getBlockie(address)}
          alt={user.name?.trim() || address}
          title={user.name?.trim() || address}
          sx={{ fontSize: '10px' }}
        />
      ))}
    </AvatarGroup>
  )
}

/**
 * Default React Flow node used to display one organ inside a diagram.
 */
export const OrganNode: React.FC<Partial<NodeProps> & OrganNodeProps> = ({
  data,
  sourcePosition,
  targetPosition,
  hideHandles
}) => {
  const translateLabel =
    data.translateLabel ?? ((label: string): string => label)
  const isMaster = data.isMaster === true
  const userEntries = getOrganUserEntries(
    data.organ,
    data.entryUsers ?? {}
  )
  const hasUserEntries = userEntries.length > 0
  const iconKind = getOrganNodeIconKind({
    organ: data.organ,
    hasUserEntries,
    isMaster
  })

  return (
    <>
      <Card
        sx={{
          borderRadius: '12px',
          padding: 2,
          backgroundColor: !data.organ?.isDeployed
            ? 'transparent'
            : isMaster
              ? 'background.secondary'
              : '',
          color: !data.organ?.isDeployed
            ? 'text.primary'
            : isMaster
              ? 'violet.light3'
              : 'text.primary',
          border: data.organ?.isDeployed
            ? 'none'
            : `dashed 1px ${palette.grey.light2 as string}`,
          width: '288px'
        }}
      >
        <Box
          sx={{
            background: !data.organ?.isDeployed
              ? 'transparent'
              : isMaster
                ? palette.background.secondary
                : palette.background.default,
            borderBottom: `solid 0.5px ${
              isMaster ? palette.grey : palette.grey.light2
            }`
          }}
        >
          <DiagramNode
            onClick={() => {
              data.onClick?.(data.organ)
            }}
            icon={
              <Grid
                container
                alignItems='center'
                justifyContent='center'
                height='100%'
                sx={{
                  borderRadius: '6px',
                  width: 3 * 8,
                  height: 3 * 8,
                  backgroundColor: isMaster ? 'violet.light3' : 'primary.light4'
                }}
              >
                {iconKind === 'master' && (
                  <SummitIcon style={{ width: '15px', height: '15px' }} />
                )}
                {iconKind === 'people' && (
                  <PeopleAltRounded style={{ width: '15px', height: '15px' }} />
                )}
                {iconKind === 'funds' && (
                  <AccountBalanceWalletRounded
                    style={{ width: '15px', height: '15px' }}
                  />
                )}
                {iconKind === 'documents' && (
                  <DescriptionRounded style={{ width: '15px', height: '15px' }} />
                )}
              </Grid>
            }
            label={translateLabel(data.organ?.name ?? '')}
            id={`expand-organ-${data.organ?.name}`}
          />
        </Box>
        <Grid
          container
          justifyContent='flex-start'
          alignItems='center'
          height='28px'
          pt={hasUserEntries ? 0 : 1}
          gap={hasUserEntries ? 1 : 0}
          sx={{ boxSizing: 'border-box' }}
        >
          {hasUserEntries ? (
            <>
              <EntryAvatars users={userEntries} />
              <MemberCount
                organ={data.organ}
                count={userEntries.length}
                translateLabel={translateLabel}
              />
            </>
          ) : (
            <EntryCount organ={data.organ} translateLabel={translateLabel} />
          )}
        </Grid>
      </Card>
      {hideHandles !== true && (
        <>
          <Handle type='source' position={sourcePosition ?? Position.Top} />
          <Handle type='target' position={targetPosition ?? Position.Bottom} />
        </>
      )}
    </>
  )
}
