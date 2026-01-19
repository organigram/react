import React from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { Handle, Position } from 'react-flow-renderer'
import { DiagramNode } from './Node'
import { palette } from '@/src/ui'
import Token from '@/src/ui/assets/svg/token.svg'

export interface Asset {
  address: string
  name: string
}

export interface AssetNodeProps {
  data: { asset: Asset }
  sourcePosition?: Position
  targetPosition?: Position
  hideHandles?: boolean
  onClick: (asset: Asset) => void
}

export const AssetNode: React.FC<AssetNodeProps> = ({
  data: { asset },
  sourcePosition,
  targetPosition,
  hideHandles,
  onClick
}) => (
  <>
    <Card
      sx={{
        borderRadius: '16px',
        backgroundColor:
          asset.address != null && asset.address !== '' ? '' : 'transparent',
        border:
          asset.address != null && asset.address !== ''
            ? ''
            : `dashed 1px ${palette.violet.light3 as string}`,
        pt: 1,
        pl: 2,
        minWidth: '180px'
      }}
    >
      <DiagramNode
        onClick={() => {
          onClick(asset)
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
              backgroundColor: 'secondary.light2'
            }}
          >
            <Token
              style={{
                width: '14px',
                height: '24px',
                fill: 'none',
                stroke: 'black',
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                strokeWidth: '4px'
              }}
            />
          </Grid>
        }
        label={asset.name}
      />
    </Card>
    {hideHandles !== true && (
      <>
        <Handle type='source' position={sourcePosition ?? Position.Top} />
        <Handle type='target' position={targetPosition ?? Position.Bottom} />
      </>
    )}
  </>
)
