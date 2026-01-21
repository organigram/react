import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { palette } from '../../ui';
import { MoreVert } from '@mui/icons-material';
export const DiagramNode = ({ onClick, label, id, icon }) => (_jsxs(Grid, { container: true, justifyContent: 'space-between', alignItems: 'center', sx: {
        pt: 0.5,
        pb: 1.5
    }, children: [_jsx(Grid, { container: true, item: true, width: '30px', children: icon }), _jsx(Grid, { container: true, item: true, sx: { width: 'calc(100% - 30px - 30px)' }, children: _jsx(Typography, { variant: 'h2', fontWeight: 'bold', fontSize: '12px', textAlign: 'left', children: label }) }), _jsx(Grid, { container: true, item: true, width: '30px', children: _jsx(Button, { variant: 'text', onClick: onClick, id: id, sx: { color: 'grey.light4' }, children: _jsx(MoreVert, { style: { height: '18px', color: palette.grey.light } }) }) })] }));
