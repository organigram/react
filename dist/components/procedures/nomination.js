import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
export const NominationProcedureComponent = ({ procedure }) => {
    return _jsx(_Fragment, {});
};
const NominationProposal = ({ procedure, proposal, accountInOrgans, wrapTransaction, t = key => key }) => {
    if (!proposal || !proposal.presented) {
        return _jsx("p", { className: 'text-danger', children: t('Proposal not presented.') });
    }
    if (proposal.blocked || proposal.applied) {
        return _jsx(_Fragment, {});
    }
    return (_jsx(Grid, { container: true, justifyContent: 'space-between', mt: 3, children: accountInOrgans?.deciders && (_jsxs(_Fragment, { children: [_jsx(Button, { sx: { width: '48%' }, variant: 'contained', className: 'approve-proposal', onClick: () => procedure.nominate(proposal.key, {
                        onTransaction: wrapTransaction
                    }), children: t('Approve') }), _jsx(Button, { sx: { width: '48%' }, variant: 'contained', color: 'secondary', className: 'reject-proposal', onClick: () => procedure.blockProposal(proposal.key, '', {
                        onTransaction: wrapTransaction
                    }), children: t('Reject') })] })) }));
};
const vote = {
    Component: NominationProcedureComponent,
    Proposal: NominationProposal
};
export default vote;
