import React from 'react'
import { Organ, OrganJson } from '@organigram/js'
import { Signer } from 'ethers'
import { Handle, NodeProps, Position } from 'react-flow-renderer'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'

import { makeTestId } from '../../utils'
import { useTranslation } from 'react-i18next'
// import { useDeployedOrgan } from '../../hooks/useOrgans'
import { DiagramNode } from './Node'
import { palette } from '../../theme/palette'
import SummitIcon from '../icons/Summit'
import { PeopleAltRounded } from '@mui/icons-material'
export interface OrganNodeProps {
  data: {
    organ: Organ
    position?: { x: number; y: number }
    onClick?: () => void
  }
  hideHandles?: boolean
  signer?: Signer | null
}

export const EntryCount: React.FC<{
  organ: OrganJson
  signer?: Signer | null
}> = ({ organ, signer }) => {
  const { t } = useTranslation()
  // const organ = useDeployedOrgan({ organ: dbOrgan, signer })
  const count = organ?.entries?.length?.toString()
  const singularOrPlural =
    organ?.entries?.length != null && organ?.entries?.length > 1
      ? 'entries'
      : 'entry'
  return (
    <span id={makeTestId(`organ-${organ?.name as string}-entry-count`)}>
      {count} {t(singularOrPlural)}
    </span>
  )
}

export const OrganNode: React.FC<Partial<NodeProps> & OrganNodeProps> = ({
  data,
  sourcePosition,
  targetPosition,
  hideHandles,
  signer
}) => {
  const isMaster = data?.position?.y === 0
  const isDeployed = data?.organ?.isDeployed

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
                {isMaster ? (
                  <SummitIcon style={{ width: '15px', height: '15px' }} />
                ) : (
                  <PeopleAltRounded style={{ width: '15px', height: '15px' }} />
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
