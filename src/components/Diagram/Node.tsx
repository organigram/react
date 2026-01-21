import React from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import MoreVertIcon from '@mui/icons-material/MoreVert'

export const DiagramNode: React.FC<{
  onClick?: () => void
  label?: string
  id?: string
  icon: React.ReactNode
}> = ({ onClick, label, id, icon }) => (
  <Grid
    container
    justifyContent='space-between'
    alignItems='center'
    sx={{
      pt: 0.5,
      pb: 1.5
    }}
  >
    <Grid container item width='30px'>
      {icon}
    </Grid>
    <Grid container item sx={{ width: 'calc(100% - 30px - 30px)' }}>
      <Typography
        variant='h2'
        fontWeight='bold'
        fontSize='12px'
        textAlign='left'
      >
        {label}
      </Typography>
    </Grid>
    {/* {organ?.metadata?.name)} */}
    <Grid container item width='30px'>
      <Button
        variant='text'
        onClick={onClick}
        id={id}
        sx={{ color: 'grey.light4' }}
      >
        <MoreVertIcon sx={{ height: '18px', color: 'grey.light' }} />
      </Button>
    </Grid>
  </Grid>
)
