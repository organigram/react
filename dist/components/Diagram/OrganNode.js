import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Handle, Position } from 'react-flow-renderer';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import { makeTestId } from '../../utils';
import { useTranslation } from 'react-i18next';
import { useDeployedOrgan } from '../../hooks/organs';
import { DiagramNode } from './Node';
import { palette } from '../../ui';
import SummitIcon from '../../ui/icons/Summit';
import { PeopleAltRounded } from '@mui/icons-material';
export const EntryCount = ({ organ: dbOrgan, signer }) => {
    const { t } = useTranslation();
    const organ = useDeployedOrgan({ organ: dbOrgan, signer });
    const count = (organ?.deployed == null
        ? (organ?.entries?.length ?? 0)
        : (organ?.deployed?.entries?.length ?? 0))?.toString();
    const singularOrPlural = (organ?.deployed?.entries?.length != null &&
        organ?.deployed?.entries?.length > 1) ||
        (organ?.entries?.length != null && organ?.entries.length > 1)
        ? 'entries'
        : 'entry';
    return (_jsxs("span", { id: makeTestId(`organ-${organ?.name}-entry-count`), children: [count, " ", t(singularOrPlural)] }));
};
export const OrganNode = ({ data, sourcePosition, targetPosition, hideHandles, onClick, signer }) => {
    const isMaster = data?.position?.y === 0;
    const isDeployed = data?.organ?.address != null && data?.organ.address !== '';
    return (_jsxs(_Fragment, { children: [_jsxs(Card, { sx: {
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
                        : `dashed 1px ${palette.grey.light2}`,
                    minWidth: '240px'
                }, children: [_jsx(Box, { sx: {
                            background: !isDeployed
                                ? 'transparent'
                                : isMaster
                                    ? palette.background.secondary
                                    : palette.background.default,
                            borderBottom: `solid 0.5px ${isMaster ? palette.grey : palette.grey.light2}`
                        }, children: _jsx(DiagramNode, { onClick: onClick, icon: _jsx(Grid, { container: true, alignItems: 'center', justifyContent: 'center', height: '100%', sx: {
                                    borderRadius: '6px',
                                    width: 3 * 8,
                                    height: 3 * 8,
                                    backgroundColor: isMaster ? 'violet.light3' : 'primary.light4'
                                }, children: isMaster ? (_jsx(SummitIcon, { style: { width: '15px', height: '15px' } })) : (_jsx(PeopleAltRounded, { style: { width: '15px', height: '15px' } })) }), label: data.organ?.name, id: makeTestId(`expand-organ-${data.organ?.name}`) }) }), _jsx(Grid, { container: true, justifyContent: 'flex-start', alignItems: 'center', pt: 1, children: _jsx(EntryCount, { organ: data.organ, signer: signer }) })] }), hideHandles !== true && (_jsxs(_Fragment, { children: [_jsx(Handle, { type: 'source', position: sourcePosition ?? Position.Top }), _jsx(Handle, { type: 'target', position: targetPosition ?? Position.Bottom })] }))] }));
};
