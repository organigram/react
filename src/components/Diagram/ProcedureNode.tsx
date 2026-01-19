import React from 'react'
import { ProcedureProposal, getPermissionsSet } from '@organigram/js'
import { Handle, Position } from 'react-flow-renderer'
import Badge from '@mui/material/Badge'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'
import Card from '@mui/material/Card'
import TuneIcon from '@mui/icons-material/Tune'

import { makeTestId } from '../../utils'
import { filterProposals, useDeployedProcedure } from '../../hooks/procedures'
import { DiagramNode } from './Node'
import ProcedureIcon from '../../assets/svg/procedure.svg'
import { palette } from '../../ui'
import { DiagramProcedure, OrganigramDiagram } from '.'
import { Signer } from 'ethers'

export interface ProcedureNodeProps {
  data: { procedure: DiagramProcedure }
  sourcePosition?: Position
  targetPosition?: Position
  hideHandles?: boolean
  onClick?: () => void
  signer: Signer
  organigram: OrganigramDiagram
}

export const ProcedureNode: React.FC<ProcedureNodeProps> = ({
  data: { procedure },
  sourcePosition,
  targetPosition,
  hideHandles,
  onClick,
  organigram,
  signer
}) => {
  const deployedProcedure = useDeployedProcedure({
    procedure,
    organigram,
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
        key={procedure.id}
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
                  backgroundColor: 'violet.light3'
                }}
              >
                {procedure.targetOrgans.some(
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
                  <TuneIcon
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
            label={procedure.name}
            id={makeTestId(`expand-procedure-${procedure?.name}`)}
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
