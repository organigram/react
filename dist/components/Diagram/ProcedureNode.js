import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { getPermissionsSet } from '@organigram/js';
import { Handle, Position } from 'react-flow-renderer';
import Badge from '@mui/material/Badge';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import { makeTestId } from '../../utils';
import { filterProposals, useDeployedProcedure } from '../../hooks/procedures';
import { DiagramNode } from './Node';
import { palette } from '../../ui';
import ProcedureIcon from '../../ui/icons/Procedure';
import { CircularProgress } from '@mui/material';
import { Tune } from '@mui/icons-material';
export const ProcedureNode = ({ data, sourcePosition, targetPosition, hideHandles, organigram, signer, ...nodeProps }) => {
    const deployedProcedure = useDeployedProcedure({
        procedure: data?.procedure,
        organigram: organigram,
        signer
    });
    const activeProposals = deployedProcedure?.deployed != null
        ? filterProposals('current', deployedProcedure?.deployed?.proposals).length
        : undefined;
    return (_jsxs(_Fragment, { children: [_jsx(Badge, { anchorOrigin: { horizontal: 'right', vertical: 'bottom' }, sx: {
                    '& .MuiBadge-badge': {
                        backgroundColor: 'background.secondary',
                        color: 'violet.light'
                    }
                }, invisible: activeProposals === 0 || deployedProcedure?.address === '', badgeContent: deployedProcedure?.deployed != null ? (_jsx(_Fragment, { children: activeProposals })) : (_jsx(CircularProgress, { style: { background: 'transparent', color: 'white' }, size: '8px' })), children: _jsx(Card, { sx: {
                        borderRadius: '16px',
                        backgroundColor: deployedProcedure?.address != null &&
                            deployedProcedure?.address !== ''
                            ? ''
                            : 'transparent',
                        border: deployedProcedure?.address != null &&
                            deployedProcedure?.address !== ''
                            ? ''
                            : `dashed 1px ${palette.violet.light3}`,
                        pt: 1,
                        pl: 2,
                        minWidth: '240px'
                    }, children: _jsx(DiagramNode, { ...nodeProps, onClick: () => {
                            data?.onClick?.(data.procedure);
                        }, icon: _jsx(Grid, { container: true, alignItems: 'center', justifyContent: 'center', height: '100%', sx: {
                                borderRadius: '6px',
                                width: 3 * 8,
                                height: 3 * 8,
                                backgroundColor: 'violet.light3'
                            }, children: data?.procedure.targetOrgans.some(to => getPermissionsSet(to.permissions).includes('ADD_PROCEDURES') ||
                                getPermissionsSet(to.permissions).includes('REMOVE_PROCEDURES') ||
                                getPermissionsSet(to.permissions).includes('ALL_PROCEDURES') ||
                                getPermissionsSet(to.permissions).includes('ALL')) ? (_jsx(Tune, { style: {
                                    width: '15px',
                                    height: '15px',
                                    transform: 'rotate(90deg)'
                                } })) : (_jsx(ProcedureIcon, { style: { width: '15px', height: '15px' } })) }), label: data?.procedure.name, id: makeTestId(`expand-procedure-${data?.procedure?.name}`) }) }) }, data?.procedure?.id), hideHandles !== true && (_jsxs(_Fragment, { children: [_jsx(Handle, { type: 'source', position: sourcePosition ?? Position.Top }), _jsx(Handle, { type: 'target', position: targetPosition ?? Position.Bottom })] }))] }));
};
