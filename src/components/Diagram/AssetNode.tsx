import React from 'react'
import { Asset } from '@organigram/js'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { Handle, NodeProps, Position } from 'react-flow-renderer'
import { DiagramNode } from './Node'
import { palette } from '../../ui'
import TokenIcon from '../../ui/icons/Token'

export type DiagramAsset = Asset & {
  id: string
  address: string
  name: string
}

export interface AssetNodeProps {
  Token: React.FC<{ style: any }>
  data: { asset: DiagramAsset; onClick: (asset: DiagramAsset) => void }
  hideHandles?: boolean
}

export const AssetNode: React.FC<NodeProps & AssetNodeProps> = ({
  data: { asset, onClick },
  sourcePosition,
  targetPosition,
  hideHandles
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
            <TokenIcon
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
