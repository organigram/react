import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import { Handle, Position } from 'react-flow-renderer';
import { DiagramNode } from './Node';
import { palette } from '../../ui';
import TokenIcon from '../../ui/icons/Token';
export const AssetNode = ({ data: { asset, onClick }, sourcePosition, targetPosition, hideHandles }) => (_jsxs(_Fragment, { children: [_jsx(Card, { sx: {
                borderRadius: '16px',
                backgroundColor: asset.address != null && asset.address !== '' ? '' : 'transparent',
                border: asset.address != null && asset.address !== ''
                    ? ''
                    : `dashed 1px ${palette.violet.light3}`,
                pt: 1,
                pl: 2,
                minWidth: '180px'
            }, children: _jsx(DiagramNode, { onClick: () => {
                    onClick?.(asset);
                }, icon: _jsx(Grid, { container: true, alignItems: 'center', justifyContent: 'center', height: '100%', sx: {
                        borderRadius: '6px',
                        width: 3 * 8,
                        height: 3 * 8,
                        backgroundColor: 'secondary.light2'
                    }, children: _jsx(TokenIcon, { style: {
                            width: '14px',
                            height: '24px',
                            fill: 'none',
                            stroke: 'black',
                            strokeLinecap: 'round',
                            strokeLinejoin: 'round',
                            strokeWidth: '4px'
                        } }) }), label: asset.name }) }), hideHandles !== true && (_jsxs(_Fragment, { children: [_jsx(Handle, { type: 'source', position: sourcePosition ?? Position.Top }), _jsx(Handle, { type: 'target', position: targetPosition ?? Position.Bottom })] }))] }));
