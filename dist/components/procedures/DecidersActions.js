import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { TimeLeft } from './TimeLeft';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
export const DecidersActions = ({ procedure, accountInOrgans, proposal, wrapTransaction }) => {
    const { t } = useTranslation();
    const election = procedure.elections?.find((b) => b.proposalKey && b.proposalKey === proposal.key);
    return accountInOrgans.deciders ? (_jsxs(_Fragment, { children: [_jsx(TimeLeft, { election, procedure }), election?.hasVoted ? (_jsx(Alert, { variant: 'filled', sx: { width: '100%' }, severity: 'info', children: t('You already voted on this proposal.') })) : (_jsxs(_Fragment, { children: [_jsx(Button, { sx: { width: '48%' }, variant: 'contained', className: 'approve-proposal', onClick: () => {
                            procedure
                                .vote(proposal.key, true, {
                                onTransaction: wrapTransaction
                            })
                                .catch((error) => console.error(error.message));
                        }, children: t('Approve') }), _jsx(Button, { sx: { width: '48%' }, variant: 'contained', color: 'secondary', className: 'reject-proposal', onClick: () => {
                            procedure
                                .vote(proposal.key, false, {
                                onTransaction: wrapTransaction
                            })
                                .catch((error) => console.error(error.message));
                        }, children: t('Reject') })] }))] })) : ('You cannot take part to this vote.');
};
