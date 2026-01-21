import React from 'react'
import { Signer } from 'ethers'
import { Handle, Position } from 'react-flow-renderer'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded'

import { DiagramOrgan } from '.'
import { makeTestId } from '../../utils'
import { useTranslation } from 'react-i18next'
import { useDeployedOrgan } from '../../hooks/organs'
import { DiagramNode } from './Node'
import { palette } from '../../../src/ui'

export interface OrganNodeProps {
  SummitIcon: React.FC<{ style: any }>
  data: { organ: DiagramOrgan; position?: { x: number; y: number } }
  sourcePosition?: Position
  targetPosition?: Position
  hideHandles?: boolean
  signer?: Signer | null
  onClick?: () => void
}

export const EntryCount: React.FC<{
  organ: DiagramOrgan
  signer?: Signer | null
}> = ({ organ: dbOrgan, signer }) => {
  const { t } = useTranslation()
  const organ = useDeployedOrgan({ organ: dbOrgan, signer })
  const count = (
    organ?.deployed == null
      ? (organ?.entries?.length ?? 0)
      : (organ?.deployed?.entries?.length ?? 0)
  )?.toString()
  const singularOrPlural =
    (organ?.deployed?.entries?.length != null &&
      organ?.deployed?.entries?.length > 1) ||
    (organ?.entries?.length != null && organ?.entries.length > 1)
      ? 'entries'
      : 'entry'
  return (
    <span id={makeTestId(`organ-${organ?.name as string}-entry-count`)}>
      {count} {t(singularOrPlural)}
    </span>
  )
}

export const OrganNode: React.FC<OrganNodeProps> = ({
  SummitIcon,
  data,
  sourcePosition,
  targetPosition,
  hideHandles,
  onClick,
  signer
}) => {
  const isMaster = data?.position?.y === 0
  const isDeployed = data?.organ?.address != null && data?.organ.address !== ''

  return (
    <>
      <Card
        sx={{
          borderRadius: '12px',
          padding: 2,
          backgroundColor: !isDeployed
            ? 'transparent'
            : isMaster
              ? 'background.secondary'
              : '',
          color: !isDeployed
            ? 'text.primary'
            : isMaster
              ? 'violet.light3'
              : 'text.primary',
          border: isDeployed
            ? 'none'
            : `dashed 1px ${palette.grey.light2 as string}`,
          minWidth: '240px'
        }}
      >
        <Box
          sx={{
            background: !isDeployed
              ? 'transparent'
              : isMaster
                ? palette.background.secondary
                : palette.background.default,
            // border:
            //   data.organ?.address != null && data.organ.address !== ''
            //     ? 'none'
            //     : 'solid 1px',
            borderBottom: `solid 0.5px ${
              isMaster ? palette.grey : palette.grey.light2
            }`

            // height: '48px',
          }}
        >
          <DiagramNode
            onClick={onClick}
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
                {isMaster ? (
                  <SummitIcon style={{ width: '15px', height: '15px' }} />
                ) : (
                  <PeopleAltRoundedIcon
                    style={{ width: '15px', height: '15px' }}
                  />
                )}
              </Grid>
            }
            label={data.organ?.name}
            id={makeTestId(`expand-organ-${data.organ?.name}`)}
          />
        </Box>
        <Grid container justifyContent='flex-start' alignItems='center' pt={1}>
          <EntryCount organ={data.organ} signer={signer} />
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
