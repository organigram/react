import type { OrganigramJson } from '@organigram/js'
import type { OrganigramPreview } from './types'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

export type PreviewLabels = {
  preview: string
  confirmationNotice: string
  organ: string
  newOrgan: string
  newProcedure: string
  newAsset: string
  newEntry: string
  entry: string
  organType: string
  procedureType: string
  assetType: string
  cancel: string
  confirm: string
}

const defaultPreviewLabels: PreviewLabels = {
  preview: 'Preview',
  confirmationNotice: 'This preview will only be saved after confirmation.',
  organ: 'organ',
  newOrgan: 'new organ',
  newProcedure: 'new procedure',
  newAsset: 'new asset',
  newEntry: 'new entry',
  entry: 'entry',
  organType: 'Organ',
  procedureType: 'Procedure',
  assetType: 'Asset',
  cancel: 'Cancel',
  confirm: 'Confirm'
}

const names = (items: Array<{ name?: string | null }>): string[] =>
  items.map(item => item.name?.trim()).filter(Boolean) as string[]

const countLabel = (count: number, label: string): string =>
  `${count.toString()} ${label}${count > 1 ? 's' : ''}`

type EntryPreview = {
  index?: string | null
  address?: string | null
  cid?: string | null
  name?: string | null
}

type NamedAddressPreview = {
  address?: string | null
  name?: string | null
}

type OrganPreview = NamedAddressPreview & {
  entries?: EntryPreview[] | null
}

const normalizedEntryName = (name?: string | null): string =>
  name?.trim?.() !== '' ? (name?.trim() ?? '') : ''

const entryKey = (entry: EntryPreview): string =>
  [
    entry.index ?? '',
    entry.address ?? '',
    entry.cid ?? '',
    normalizedEntryName(entry.name)
  ].join('\u001f')

const isNewAddress = (
  address: string | null | undefined,
  currentAddresses: Set<string>
): boolean =>
  address == null || address === '' || !currentAddresses.has(address)

export const AgentPreview: React.FC<{
  preview: OrganigramPreview
  currentOrganigram: OrganigramJson | null
  canConfirm: boolean
  saving: boolean
  onConfirm: () => void
  onCancel: () => void
  labels?: Partial<PreviewLabels>
}> = ({
  preview,
  currentOrganigram,
  canConfirm,
  saving,
  onConfirm,
  onCancel,
  labels: customLabels
}) => {
  const labels = { ...defaultPreviewLabels, ...customLabels }
  const currentOrganAddresses = new Set(
    currentOrganigram?.organs
      .map((organ: NamedAddressPreview) => organ.address)
      .filter((address): address is string => address != null && address !== '')
  )
  const currentProcedureAddresses = new Set(
    currentOrganigram?.procedures
      .map((procedure: NamedAddressPreview) => procedure.address)
      .filter((address): address is string => address != null && address !== '')
  )
  const currentAssetAddresses = new Set(
    currentOrganigram?.assets
      .map((asset: NamedAddressPreview) => asset.address)
      .filter((address): address is string => address != null && address !== '')
  )
  const currentOrgansByAddress = new Map(
    currentOrganigram?.organs
      .filter(
        (organ: OrganPreview) => organ.address != null && organ.address !== ''
      )
      .map((organ: OrganPreview) => [organ.address as string, organ])
  )
  const addedOrgans = preview.organigram.organs.filter(
    (organ: NamedAddressPreview) =>
      isNewAddress(organ.address, currentOrganAddresses)
  )
  const addedProcedures = preview.organigram.procedures.filter(
    (procedure: NamedAddressPreview) =>
      isNewAddress(procedure.address, currentProcedureAddresses)
  )
  const addedAssets = preview.organigram.assets.filter(
    (asset: NamedAddressPreview) =>
      isNewAddress(asset.address, currentAssetAddresses)
  )
  const addedEntries = preview.organigram.organs.flatMap(
    (organ: OrganPreview) => {
      const existingEntryKeys = new Set(
        (currentOrgansByAddress.get(organ.address ?? '')?.entries ?? []).map(
          entryKey
        )
      )
      return (organ.entries ?? [])
        .filter(
          (entry: EntryPreview) => !existingEntryKeys.has(entryKey(entry))
        )
        .map((entry: EntryPreview) => ({
          type: labels.entry,
          name:
            entry.name?.trim() ||
            (entry.address ?? entry.cid ?? organ.name ?? labels.entry)
        }))
    }
  )
  const addedLabels = [
    ...names(addedOrgans).map(name => ({ type: labels.organType, name })),
    ...names(addedProcedures).map(name => ({
      type: labels.procedureType,
      name
    })),
    ...names(addedAssets).map(name => ({ type: labels.assetType, name })),
    ...addedEntries
  ]

  return (
    <Box
      id='workspace-agent-preview'
      sx={({ palette }) => ({
        border: `1px solid ${palette.grey[300]}`,
        borderRadius: 2,
        p: 2,
        mt: 1,
        backgroundColor: 'background.default'
      })}
    >
      <Typography variant='h3' fontSize='14px' letterSpacing='0' mb={1}>
        {labels.preview}
      </Typography>
      <Typography variant='body2' color='text.secondary' mb={1}>
        {labels.confirmationNotice}
      </Typography>
      <Stack direction='row' flexWrap='wrap' gap={1} mb={1.5}>
        <Chip
          size='small'
          label={countLabel(
            currentOrganigram?.organs.length ?? 0,
            labels.organ
          )}
        />
        <Chip size='small' label={countLabel(addedOrgans.length, labels.newOrgan)} />
        <Chip
          size='small'
          label={countLabel(addedProcedures.length, labels.newProcedure)}
        />
        <Chip size='small' label={countLabel(addedAssets.length, labels.newAsset)} />
        <Chip
          size='small'
          label={countLabel(addedEntries.length, labels.newEntry)}
        />
      </Stack>
      {preview.summary.length > 0 ? (
        <Stack component='ul' pl={2} mb={1.5}>
          {preview.summary.map((item: string, index: number) => (
            <Typography component='li' variant='body2' key={index}>
              {item}
            </Typography>
          ))}
        </Stack>
      ) : null}
      <Stack direction='row' flexWrap='wrap' gap={1} mb={2}>
        {addedLabels.map((item: { type: string; name: string }) => (
          <Chip
            key={`${item.type}-${item.name}`}
            size='small'
            variant='outlined'
            label={`${item.type}: ${item.name}`}
          />
        ))}
      </Stack>
      <Stack direction='row' gap={1} justifyContent='flex-end'>
        <Button
          id='workspace-agent-cancel-preview'
          variant='text'
          disabled={saving}
          onClick={onCancel}
        >
          {labels.cancel}
        </Button>
        {canConfirm ? (
          <Button
            id='workspace-agent-confirm-preview'
            variant='contained'
            disabled={saving}
            onClick={onConfirm}
          >
            {saving ? <CircularProgress size={18} /> : labels.confirm}
          </Button>
        ) : null}
      </Stack>
    </Box>
  )
}

export { defaultPreviewLabels }
