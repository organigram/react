import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import { VetoProposal } from './Veto';
import { DecidersActions } from './DecidersActions';
import { VoteEnded } from './Enact';
export const ElectionComponent = ({ procedure, proposal, accountInOrgans, wrapTransaction, t = (key) => key }) => {
    const election = procedure.elections?.find((b) => b.proposalKey && b.proposalKey === proposal.key);
    const now = Date.now() / 1000;
    if (!proposal || !proposal.presented || !election) {
        return (_jsx(Alert, { variant: 'filled', sx: { width: '100%' }, severity: 'info', children: t('Proposal not presented.') }));
    }
    if (proposal.blocked || proposal.applied) {
        return _jsx(_Fragment, {});
    }
    return (_jsx(Grid, { container: true, justifyContent: 'space-between', mt: 3, className: 'procedure-proposal procedure-proposal-vote', children: !election || !election.start ? (_jsx(_Fragment, {})) : now < parseInt(election.start) ? (_jsx(VetoProposal, { procedure, proposal, accountInOrgans, wrapTransaction, t })) : now < parseInt(election.start) + parseInt(procedure.voteDuration) ? (_jsx(DecidersActions, { procedure, proposal, accountInOrgans, wrapTransaction, t })) : (_jsx(VoteEnded, { procedure, proposal, wrapTransaction, t, accountInOrgans })) }));
};
