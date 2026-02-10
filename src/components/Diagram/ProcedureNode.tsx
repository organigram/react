import React from 'react'
import {
  OrganigramJson,
  ProcedureJson,
  ProcedureProposal,
  getPermissionsSet
} from '@organigram/js'
import { Signer } from 'ethers'
import { Handle, NodeProps, Position } from 'react-flow-renderer'
import Badge from '@mui/material/Badge'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'

import { makeTestId } from '../../utils'
import {
  filterProposals,
  useDeployedProcedure
} from '../../hooks/useProcedures'
import { DiagramNode } from './Node'
import { palette } from '../../theme/palette'
import ProcedureIcon from '../icons/Procedure'
import { CircularProgress } from '@mui/material'
import { Tune } from '@mui/icons-material'

export interface ProcedureNodeProps {
  hideHandles?: boolean
  signer?: Signer | null
  organigram?: OrganigramJson
}

export const ProcedureNode: React.FC<
  Partial<
    NodeProps<{
      procedure: ProcedureJson
      onClick?: (procedure: ProcedureJson) => void
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
    organigram: organigram!,
    signer
  })
  const activeProposals = deployedProcedure?.isDeployed
    ? filterProposals(
        'current',
        deployedProcedure?.proposals as ProcedureProposal[]
      )?.length
    : undefined

  return (
    <>
      <Badge
        key={data?.procedure?.address}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        sx={{
          '& .MuiBadge-badge': {
            backgroundColor: 'background.secondary',
            color: 'violet.light'
          }
        }}
        invisible={activeProposals === 0 || !deployedProcedure?.isDeployed}
        badgeContent={
          deployedProcedure?.proposals?.length ? (
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
            backgroundColor: deployedProcedure?.isDeployed ? '' : 'transparent',
            border: deployedProcedure?.isDeployed
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
                {data?.procedure.targetOrgans?.some(
                  to =>
                    getPermissionsSet(to.permissionValue).includes(
                      'ADD_PERMISSIONS'
                    ) ||
                    getPermissionsSet(to.permissionValue).includes(
                      'REMOVE_PERMISSIONS'
                    ) ||
                    getPermissionsSet(to.permissionValue).includes(
                      'ALL_PERMISSIONS'
                    ) ||
                    getPermissionsSet(to.permissionValue).includes('ALL')
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
