import React from 'react'
import {
  EnhancedProcedure,
  Procedure,
  ProcedureProposal,
  getPermissionsSet
} from '@organigram/js'
import { Signer } from 'ethers'
import { Handle, NodeProps, Position } from 'react-flow-renderer'
import Badge from '@mui/material/Badge'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'

import { makeTestId } from '../../utils'
import { filterProposals, useDeployedProcedure } from '../../hooks/procedures'
import { DiagramNode } from './Node'
import { palette } from '../../ui'
import { DiagramOrganigram, SourceOrgan, TargetOrgan } from '.'
import ProcedureIcon from '../../ui/icons/Procedure'
import { CircularProgress } from '@mui/material'
import { Tune } from '@mui/icons-material'

export type DiagramProcedure = Partial<Procedure> & {
  id: string
  name: string
  sourceOrgans: SourceOrgan[]
  targetOrgans: TargetOrgan[]
  deployed?: EnhancedProcedure
}

export interface ProcedureNodeProps {
  hideHandles?: boolean
  signer?: Signer | null
  organigram?: DiagramOrganigram
}

export const ProcedureNode: React.FC<
  Partial<
    NodeProps<{
      procedure: DiagramProcedure
      onClick?: (procedure: DiagramProcedure) => void
    }>
  > &
    ProcedureNodeProps
> = ({
  data,
  sourcePosition,
  targetPosition,
  hideHandles,
  organigram,
  signer,
  ...nodeProps
}) => {
  const deployedProcedure = useDeployedProcedure({
    procedure: data?.procedure,
    organigram: organigram as DiagramOrganigram,
    signer
  })
  const activeProposals =
    deployedProcedure?.deployed != null
      ? filterProposals(
          'current',
          deployedProcedure?.deployed?.proposals as ProcedureProposal[]
        ).length
      : undefined

  return (
    <>
      <Badge
        key={data?.procedure?.id}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        sx={{
          '& .MuiBadge-badge': {
            backgroundColor: 'background.secondary',
            color: 'violet.light'
          }
        }}
        invisible={activeProposals === 0 || deployedProcedure?.address === ''}
        badgeContent={
          deployedProcedure?.deployed != null ? (
            <>{activeProposals}</>
          ) : (
            <CircularProgress
              style={{ background: 'transparent', color: 'white' }}
              size='8px'
            />
          )
        }
      >
        <Card
          sx={{
            borderRadius: '16px',
            backgroundColor:
              deployedProcedure?.address != null &&
              deployedProcedure?.address !== ''
                ? ''
                : 'transparent',
            border:
              deployedProcedure?.address != null &&
              deployedProcedure?.address !== ''
                ? ''
                : `dashed 1px ${palette.violet.light3}`,
            pt: 1,
            pl: 2,
            minWidth: '240px'
          }}
        >
          <DiagramNode
            {...nodeProps}
            onClick={() => {
              data?.onClick?.(data.procedure)
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
                  backgroundColor: 'violet.light3'
                }}
              >
                {data?.procedure.targetOrgans.some(
                  to =>
                    getPermissionsSet(to.permissions).includes(
                      'ADD_PROCEDURES'
                    ) ||
                    getPermissionsSet(to.permissions).includes(
                      'REMOVE_PROCEDURES'
                    ) ||
                    getPermissionsSet(to.permissions).includes(
                      'ALL_PROCEDURES'
                    ) ||
                    getPermissionsSet(to.permissions).includes('ALL')
                ) ? (
                  <Tune
                    style={{
                      width: '15px',
                      height: '15px',
                      transform: 'rotate(90deg)'
                    }}
                  />
                ) : (
                  <ProcedureIcon style={{ width: '15px', height: '15px' }} />
                )}
              </Grid>
            }
            label={data?.procedure.name}
            id={makeTestId(`expand-procedure-${data?.procedure?.name}`)}
          />
        </Card>
      </Badge>
      {hideHandles !== true && (
        <>
          <Handle type='source' position={sourcePosition ?? Position.Top} />
          <Handle type='target' position={targetPosition ?? Position.Bottom} />
        </>
      )}
    </>
  )
}
